const firestoreService = require('./firestoreService');

class ContactService {
  constructor() {
    this.collection = 'contactSubmissions';
  }

  async createContactSubmission(contactData) {
    const submissionDoc = {
      name: contactData.name,
      email: contactData.email,
      phone: contactData.phone || null,
      message: contactData.message
    };

    return await firestoreService.create(this.collection, submissionDoc);
  }

  async findById(id) {
    return await firestoreService.findById(this.collection, id);
  }

  async getAllContactSubmissions(filters = {}) {
    return await firestoreService.findAll(this.collection, filters, { field: 'createdAt', direction: 'desc' });
  }

  async deleteContactSubmission(id) {
    return await firestoreService.delete(this.collection, id);
  }

  async getContactSubmissionsByDateRange(startDate, endDate) {
    const conditions = [];
    
    if (startDate) {
      conditions.push({ field: 'createdAt', operator: '>=', value: startDate });
    }
    
    if (endDate) {
      conditions.push({ field: 'createdAt', operator: '<=', value: endDate });
    }

    return await firestoreService.query(
      this.collection, 
      conditions, 
      { field: 'createdAt', direction: 'desc' }
    );
  }

  async searchContactSubmissions(searchTerm) {
    const allSubmissions = await this.getAllContactSubmissions();
    
    if (!searchTerm) {
      return allSubmissions;
    }

    const searchLower = searchTerm.toLowerCase();
    return allSubmissions.filter(submission => 
      submission.name.toLowerCase().includes(searchLower) ||
      submission.email.toLowerCase().includes(searchLower) ||
      (submission.phone && submission.phone.includes(searchTerm)) ||
      submission.message.toLowerCase().includes(searchLower)
    );
  }

  async getContactStats() {
    const allSubmissions = await this.getAllContactSubmissions();
    
    // Get submissions from last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentSubmissions = allSubmissions.filter(submission => 
      submission.createdAt && submission.createdAt.toDate() >= thirtyDaysAgo
    );

    return {
      total: allSubmissions.length,
      recent: recentSubmissions.length
    };
  }

  async paginateContactSubmissions(pageSize = 20, lastDoc = null) {
    return await firestoreService.paginate(
      this.collection, 
      {}, 
      { field: 'createdAt', direction: 'desc' }, 
      pageSize, 
      lastDoc
    );
  }
}

module.exports = new ContactService();
