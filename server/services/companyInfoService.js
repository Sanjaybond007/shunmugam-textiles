const firestoreService = require('./firestoreService');

class CompanyInfoService {
  constructor() {
    this.collection = 'companyInfo';
    this.defaultDocId = 'main';
  }

  async getCompanyInfo() {
    let companyInfo = await firestoreService.findById(this.collection, this.defaultDocId);
    
    // If no company info exists, create default
    if (!companyInfo) {
      companyInfo = await this.createDefaultCompanyInfo();
    }
    
    return companyInfo;
  }

  async updateCompanyInfo(updateData) {
    const existingInfo = await this.getCompanyInfo();
    
    if (existingInfo) {
      return await firestoreService.update(this.collection, this.defaultDocId, updateData);
    } else {
      return await firestoreService.create(this.collection, updateData, this.defaultDocId);
    }
  }

  async createDefaultCompanyInfo() {
    const defaultData = {
      name: 'Shunmugam Textiles',
      description: 'Leading textile manufacturer with over 20 years of experience in producing high-quality fabrics for global markets.',
      mission: 'To provide the highest quality textiles while maintaining sustainable practices and supporting our local community.',
      address: '123 Textile Street, Industrial Area, Chennai, Tamil Nadu, India',
      phone: '+91-44-12345678',
      email: 'info@shunmugamtextiles.com',
      website: 'www.shunmugamtextiles.com'
    };

    return await firestoreService.create(this.collection, defaultData, this.defaultDocId);
  }

  async updateField(field, value) {
    return await this.updateCompanyInfo({ [field]: value });
  }

  async companyInfoExists() {
    const info = await firestoreService.findById(this.collection, this.defaultDocId);
    return !!info;
  }
}

module.exports = new CompanyInfoService();
