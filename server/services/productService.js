const firestoreService = require('./firestoreService');

class ProductService {
  constructor() {
    this.collection = 'products';
  }

  async createProduct(productData) {
    const productDoc = {
      name: productData.name,
      description: productData.description || '',
      imageURL: productData.imageURL || null,
      qualities: productData.qualities || 4,
      qualityNames: productData.qualityNames || ['Quality 1', 'Quality 2', 'Quality 3', 'Quality 4'],
      active: productData.active !== undefined ? productData.active : true
    };

    return await firestoreService.create(this.collection, productDoc);
  }

  async findById(id) {
    return await firestoreService.findById(this.collection, id);
  }

  async getAllProducts(filters = {}) {
    try {
      console.log('ProductService: Fetching ALL products from Firestore...');
      const products = await firestoreService.findAll(this.collection, filters, { field: 'name', direction: 'asc' });
      console.log('ProductService: Found', products ? products.length : 0, 'total products');
      return products || [];
    } catch (error) {
      console.error('ProductService: Error fetching all products:', error);
      return [];
    }
  }

  async getActiveProducts() {
    try {
      console.log('ProductService: Fetching active products...');
      // Use manual filtering as workaround for Firestore boolean query issue
      const allProducts = await this.getAllProducts();
      const activeProducts = allProducts.filter(product => product.active === true);
      console.log('ProductService: Found', activeProducts.length, 'active products out of', allProducts.length, 'total');
      return activeProducts;
    } catch (error) {
      console.error('ProductService: Error fetching active products:', error);
      return [];
    }
  }

  async updateProduct(id, updateData) {
    return await firestoreService.update(this.collection, id, updateData);
  }

  async deleteProduct(id) {
    return await firestoreService.delete(this.collection, id);
  }

  async toggleProductStatus(id) {
    const product = await this.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }

    return await this.updateProduct(id, { active: !product.active });
  }

  async searchProducts(searchTerm) {
    const allProducts = await this.getAllProducts();
    
    if (!searchTerm) {
      return allProducts;
    }

    const searchLower = searchTerm.toLowerCase();
    return allProducts.filter(product => 
      product.name.toLowerCase().includes(searchLower)
    );
  }

  async getProductStats() {
    const allProducts = await this.getAllProducts();
    const activeProducts = allProducts.filter(product => product.active);
    const inactiveProducts = allProducts.filter(product => !product.active);

    return {
      total: allProducts.length,
      active: activeProducts.length,
      inactive: inactiveProducts.length
    };
  }

  async productExists(name) {
    return await firestoreService.exists(this.collection, 'name', name);
  }
}

module.exports = new ProductService();
