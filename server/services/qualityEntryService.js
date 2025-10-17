const firestoreService = require('./firestoreService');

class QualityEntryService {
  constructor() {
    this.collection = 'qualityEntries';
  }

  async createQualityEntry(entryData) {
    // Check if receipt number already exists
    const existingEntry = await this.findByReceiptNo(entryData.receiptNo);
    if (existingEntry) {
      throw new Error('Receipt number already exists');
    }

    const entryDoc = {
      receiptNo: entryData.receiptNo,
      employeeId: entryData.employeeId,
      productId: entryData.productId,
      q1: entryData.q1 || 0,
      q2: entryData.q2 || 0,
      q3: entryData.q3 || 0,
      q4: entryData.q4 || 0,
      supervisorId: entryData.supervisorId
    };

    return await firestoreService.create(this.collection, entryDoc);
  }

  async findById(id) {
    return await firestoreService.findById(this.collection, id);
  }

  async findByReceiptNo(receiptNo) {
    return await firestoreService.findOne(this.collection, 'receiptNo', receiptNo);
  }

  async getAllQualityEntries(filters = {}) {
    return await firestoreService.findAll(this.collection, filters, { field: 'createdAt', direction: 'desc' });
  }

  async getQualityEntriesByEmployee(employeeId) {
    return await firestoreService.findAll(this.collection, { employeeId }, { field: 'createdAt', direction: 'desc' });
  }

  async getQualityEntriesByProduct(productId) {
    return await firestoreService.findAll(this.collection, { productId }, { field: 'createdAt', direction: 'desc' });
  }

  async getQualityEntriesBySupervisor(supervisorId) {
    return await firestoreService.findAll(this.collection, { supervisorId }, { field: 'createdAt', direction: 'desc' });
  }

  async updateQualityEntry(id, updateData) {
    return await firestoreService.update(this.collection, id, updateData);
  }

  async deleteQualityEntry(id) {
    return await firestoreService.delete(this.collection, id);
  }

  async getQualityEntriesByDateRange(startDate, endDate, filters = {}) {
    const conditions = [];
    
    if (startDate) {
      conditions.push({ field: 'createdAt', operator: '>=', value: startDate });
    }
    
    if (endDate) {
      conditions.push({ field: 'createdAt', operator: '<=', value: endDate });
    }

    // Add additional filters
    Object.entries(filters).forEach(([field, value]) => {
      if (value !== undefined && value !== null) {
        conditions.push({ field, operator: '==', value });
      }
    });

    return await firestoreService.query(
      this.collection, 
      conditions, 
      { field: 'createdAt', direction: 'desc' }
    );
  }

  async getQualityStats(filters = {}) {
    const entries = await this.getAllQualityEntries(filters);
    
    const stats = {
      totalEntries: entries.length,
      totalQ1: 0,
      totalQ2: 0,
      totalQ3: 0,
      totalQ4: 0,
      averageQ1: 0,
      averageQ2: 0,
      averageQ3: 0,
      averageQ4: 0,
      totalQuantity: 0
    };

    if (entries.length === 0) {
      return stats;
    }

    entries.forEach(entry => {
      stats.totalQ1 += entry.q1 || 0;
      stats.totalQ2 += entry.q2 || 0;
      stats.totalQ3 += entry.q3 || 0;
      stats.totalQ4 += entry.q4 || 0;
    });

    stats.totalQuantity = stats.totalQ1 + stats.totalQ2 + stats.totalQ3 + stats.totalQ4;
    stats.averageQ1 = stats.totalQ1 / entries.length;
    stats.averageQ2 = stats.totalQ2 / entries.length;
    stats.averageQ3 = stats.totalQ3 / entries.length;
    stats.averageQ4 = stats.totalQ4 / entries.length;

    return stats;
  }

  async getEmployeeProductionStats(employeeId, startDate = null, endDate = null) {
    const conditions = [
      { field: 'employeeId', operator: '==', value: employeeId }
    ];

    if (startDate) {
      conditions.push({ field: 'createdAt', operator: '>=', value: startDate });
    }
    
    if (endDate) {
      conditions.push({ field: 'createdAt', operator: '<=', value: endDate });
    }

    const entries = await firestoreService.query(
      this.collection, 
      conditions, 
      { field: 'createdAt', direction: 'desc' }
    );

    return this.calculateProductionStats(entries);
  }

  async getProductProductionStats(productId, startDate = null, endDate = null) {
    const conditions = [
      { field: 'productId', operator: '==', value: productId }
    ];

    if (startDate) {
      conditions.push({ field: 'createdAt', operator: '>=', value: startDate });
    }
    
    if (endDate) {
      conditions.push({ field: 'createdAt', operator: '<=', value: endDate });
    }

    const entries = await firestoreService.query(
      this.collection, 
      conditions, 
      { field: 'createdAt', direction: 'desc' }
    );

    return this.calculateProductionStats(entries);
  }

  calculateProductionStats(entries) {
    const stats = {
      totalEntries: entries.length,
      totalProduction: 0,
      qualityBreakdown: {
        q1: 0,
        q2: 0,
        q3: 0,
        q4: 0
      },
      averagePerEntry: 0
    };

    entries.forEach(entry => {
      stats.qualityBreakdown.q1 += entry.q1 || 0;
      stats.qualityBreakdown.q2 += entry.q2 || 0;
      stats.qualityBreakdown.q3 += entry.q3 || 0;
      stats.qualityBreakdown.q4 += entry.q4 || 0;
    });

    stats.totalProduction = Object.values(stats.qualityBreakdown).reduce((sum, val) => sum + val, 0);
    stats.averagePerEntry = entries.length > 0 ? stats.totalProduction / entries.length : 0;

    return stats;
  }

  async receiptExists(receiptNo) {
    return await firestoreService.exists(this.collection, 'receiptNo', receiptNo);
  }

  async paginateQualityEntries(filters = {}, pageSize = 20, lastDoc = null) {
    return await firestoreService.paginate(
      this.collection, 
      filters, 
      { field: 'createdAt', direction: 'desc' }, 
      pageSize, 
      lastDoc
    );
  }
}

module.exports = new QualityEntryService();
