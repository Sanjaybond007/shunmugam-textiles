class CloudinaryService {
  constructor() {
    this.cloudName = 'ddalwamja';
    this.uploadPreset = 'products';
    this.baseUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}`;
  }

  async uploadImage(file) {
    if (!file) {
      throw new Error('No file provided');
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload an image (JPEG, PNG, GIF, or WebP)');
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      throw new Error('File size too large. Please upload an image smaller than 10MB');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);
    formData.append('folder', 'products'); // Organize images in products folder

    try {
      const response = await fetch(`${this.baseUrl}/image/upload`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Upload failed');
      }

      const data = await response.json();
      
      return {
        url: data.secure_url,
        publicId: data.public_id,
        width: data.width,
        height: data.height,
        format: data.format,
        bytes: data.bytes
      };
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error(`Image upload failed: ${error.message}`);
    }
  }

  async deleteImage(publicId) {
    try {
      // Note: Deletion requires authentication, typically done on backend
      // For now, we'll just log the public ID for manual cleanup
      console.log('Image to delete (public_id):', publicId);
      // In production, you'd call your backend to delete the image
      return true;
    } catch (error) {
      console.error('Cloudinary delete error:', error);
      throw new Error(`Image deletion failed: ${error.message}`);
    }
  }

  // Generate optimized image URLs
  getOptimizedUrl(originalUrl, options = {}) {
    if (!originalUrl) return null;

    const {
      width = null,
      height = null,
      quality = 'auto',
      format = 'auto',
      crop = 'fill'
    } = options;

    // Extract public_id from URL
    const urlParts = originalUrl.split('/');
    const uploadIndex = urlParts.findIndex(part => part === 'upload');
    if (uploadIndex === -1) return originalUrl;

    const publicIdWithExtension = urlParts.slice(uploadIndex + 1).join('/');
    const publicId = publicIdWithExtension.replace(/\.[^/.]+$/, ''); // Remove extension

    // Build transformation string
    let transformations = [];
    if (width) transformations.push(`w_${width}`);
    if (height) transformations.push(`h_${height}`);
    if (crop) transformations.push(`c_${crop}`);
    if (quality) transformations.push(`q_${quality}`);
    if (format) transformations.push(`f_${format}`);

    const transformationString = transformations.length > 0 ? transformations.join(',') + '/' : '';

    return `${this.baseUrl}/image/upload/${transformationString}${publicId}`;
  }

  // Get thumbnail URL
  getThumbnailUrl(originalUrl, size = 150) {
    return this.getOptimizedUrl(originalUrl, {
      width: size,
      height: size,
      crop: 'fill',
      quality: 'auto'
    });
  }

  // Get medium size URL for product cards
  getMediumUrl(originalUrl) {
    return this.getOptimizedUrl(originalUrl, {
      width: 400,
      height: 300,
      crop: 'fill',
      quality: 'auto'
    });
  }
}

export default new CloudinaryService();
