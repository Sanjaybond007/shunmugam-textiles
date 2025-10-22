const { getFirestore } = require('../config/firebaseAdmin');
const bcrypt = require('bcryptjs');

class FirestoreService {
  constructor() {
    this.db = null;
  }

  async getDb() {
    if (!this.db) {
      this.db = getFirestore();
      if (!this.db) {
        throw new Error('Firestore not initialized');
      }
    }
    return this.db;
  }

  // Generic CRUD operations
  async create(collection, data, customId = null) {
    const db = await this.getDb();
    const timestamp = new Date();
    
    const docData = {
      ...data,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    if (customId) {
      await db.collection(collection).doc(customId).set(docData);
      return { id: customId, ...docData };
    } else {
      const docRef = await db.collection(collection).add(docData);
      return { id: docRef.id, ...docData };
    }
  }

  async findById(collection, id) {
    const db = await this.getDb();
    const doc = await db.collection(collection).doc(id).get();
    
    if (!doc.exists) {
      return null;
    }
    
    return { id: doc.id, ...doc.data() };
  }

  async findOne(collection, field, value) {
    const db = await this.getDb();
    const snapshot = await db.collection(collection)
      .where(field, '==', value)
      .limit(1)
      .get();
    
    if (snapshot.empty) {
      return null;
    }
    
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  }

  async findAll(collection, filters = {}, orderBy = null, limit = null) {
    try {
      const db = await this.getDb();
      let query = db.collection(collection);
      
      // Apply filters
      Object.entries(filters).forEach(([field, value]) => {
        if (value !== undefined && value !== null) {
          query = query.where(field, '==', value);
        }
      });
      
      // Apply ordering
      if (orderBy) {
        query = query.orderBy(orderBy.field, orderBy.direction || 'asc');
      }
      
      // Apply limit
      if (limit) {
        query = query.limit(limit);
      }
      
      const snapshot = await query.get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error(`FirestoreService: Error in findAll for collection ${collection}:`, error);
      if (error.code === 8 || error.message.includes('Quota exceeded')) {
        console.error('⚠️  Firebase quota exceeded. Please upgrade to Blaze plan or wait for quota reset.');
      }
      throw error;
    }
  }

  async update(collection, id, data) {
    const db = await this.getDb();
    const updateData = {
      ...data,
      updatedAt: new Date()
    };
    
    await db.collection(collection).doc(id).update(updateData);
    return this.findById(collection, id);
  }

  async delete(collection, id) {
    const db = await this.getDb();
    await db.collection(collection).doc(id).delete();
    return true;
  }

  async exists(collection, field, value) {
    const result = await this.findOne(collection, field, value);
    return !!result;
  }

  // Batch operations
  async batchWrite(operations) {
    const db = await this.getDb();
    const batch = db.batch();
    
    operations.forEach(op => {
      const docRef = db.collection(op.collection).doc(op.id);
      
      switch (op.type) {
        case 'set':
          batch.set(docRef, { ...op.data, updatedAt: new Date() });
          break;
        case 'update':
          batch.update(docRef, { ...op.data, updatedAt: new Date() });
          break;
        case 'delete':
          batch.delete(docRef);
          break;
      }
    });
    
    await batch.commit();
  }

  // Query with complex conditions
  async query(collection, conditions = [], orderBy = null, limit = null) {
    const db = await this.getDb();
    let query = db.collection(collection);
    
    conditions.forEach(condition => {
      const { field, operator, value } = condition;
      query = query.where(field, operator, value);
    });
    
    if (orderBy) {
      query = query.orderBy(orderBy.field, orderBy.direction || 'asc');
    }
    
    if (limit) {
      query = query.limit(limit);
    }
    
    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // Pagination support
  async paginate(collection, filters = {}, orderBy = null, pageSize = 10, lastDoc = null) {
    const db = await this.getDb();
    let query = db.collection(collection);
    
    // Apply filters
    Object.entries(filters).forEach(([field, value]) => {
      if (value !== undefined && value !== null) {
        query = query.where(field, '==', value);
      }
    });
    
    // Apply ordering
    if (orderBy) {
      query = query.orderBy(orderBy.field, orderBy.direction || 'asc');
    }
    
    // Apply pagination
    if (lastDoc) {
      query = query.startAfter(lastDoc);
    }
    
    query = query.limit(pageSize);
    
    const snapshot = await query.get();
    const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    return {
      docs,
      hasMore: docs.length === pageSize,
      lastDoc: snapshot.docs[snapshot.docs.length - 1] || null
    };
  }
}

module.exports = new FirestoreService();
