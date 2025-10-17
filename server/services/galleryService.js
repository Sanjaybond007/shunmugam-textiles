const firestoreService = require('./firestoreService');

class GalleryService {
  constructor() {
    this.collection = 'gallery';
  }

  async createGalleryItem(galleryData) {
    const galleryDoc = {
      filename: galleryData.filename,
      originalName: galleryData.originalName,
      filePath: galleryData.filePath,
      fileSize: galleryData.fileSize || null
    };

    return await firestoreService.create(this.collection, galleryDoc);
  }

  async findById(id) {
    return await firestoreService.findById(this.collection, id);
  }

  async getAllGalleryItems(filters = {}) {
    return await firestoreService.findAll(this.collection, filters, { field: 'createdAt', direction: 'desc' });
  }

  async deleteGalleryItem(id) {
    return await firestoreService.delete(this.collection, id);
  }

  async findByFilename(filename) {
    return await firestoreService.findOne(this.collection, 'filename', filename);
  }

  async searchGalleryItems(searchTerm) {
    const allItems = await this.getAllGalleryItems();
    
    if (!searchTerm) {
      return allItems;
    }

    const searchLower = searchTerm.toLowerCase();
    return allItems.filter(item => 
      item.filename.toLowerCase().includes(searchLower) ||
      item.originalName.toLowerCase().includes(searchLower)
    );
  }

  async getGalleryStats() {
    const allItems = await this.getAllGalleryItems();
    
    const totalSize = allItems.reduce((sum, item) => sum + (item.fileSize || 0), 0);
    
    return {
      totalItems: allItems.length,
      totalSize: totalSize,
      totalSizeMB: Math.round(totalSize / (1024 * 1024) * 100) / 100
    };
  }

  async paginateGalleryItems(pageSize = 20, lastDoc = null) {
    return await firestoreService.paginate(
      this.collection, 
      {}, 
      { field: 'createdAt', direction: 'desc' }, 
      pageSize, 
      lastDoc
    );
  }

  async updateGalleryItem(id, updateData) {
    return await firestoreService.update(this.collection, id, updateData);
  }

  async filenameExists(filename) {
    return await firestoreService.exists(this.collection, 'filename', filename);
  }
}

module.exports = new GalleryService();
