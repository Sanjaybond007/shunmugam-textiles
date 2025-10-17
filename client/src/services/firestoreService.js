import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

class FirestoreService {
  // Generic methods for CRUD operations

  // Create a new document
  async create(collectionName, data) {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { id: docRef.id, ...data };
    } catch (error) {
      console.error('Error creating document:', error);
      throw error;
    }
  }

  // Read a single document by ID
  async getById(collectionName, id) {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        throw new Error('Document not found');
      }
    } catch (error) {
      console.error('Error getting document:', error);
      throw error;
    }
  }

  // Read all documents from a collection
  async getAll(collectionName, orderByField = null, orderDirection = 'asc', limitCount = null) {
    try {
      let q = collection(db, collectionName);
      
      if (orderByField) {
        q = query(q, orderBy(orderByField, orderDirection));
      }
      
      if (limitCount) {
        q = query(q, limit(limitCount));
      }

      const querySnapshot = await getDocs(q);
      const documents = [];
      
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      
      return documents;
    } catch (error) {
      console.error('Error getting documents:', error);
      throw error;
    }
  }

  // Query documents with conditions
  async query(collectionName, field, operator, value, orderByField = null, orderDirection = 'asc') {
    try {
      let q = query(collection(db, collectionName), where(field, operator, value));
      
      if (orderByField) {
        q = query(q, orderBy(orderByField, orderDirection));
      }

      const querySnapshot = await getDocs(q);
      const documents = [];
      
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      
      return documents;
    } catch (error) {
      console.error('Error querying documents:', error);
      throw error;
    }
  }

  // Update a document
  async update(collectionName, id, data) {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
      return { id, ...data };
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  }

  // Delete a document
  async delete(collectionName, id) {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }

  // Real-time listener for a collection
  onCollectionChange(collectionName, callback, orderByField = null, orderDirection = 'asc') {
    let q = collection(db, collectionName);
    
    if (orderByField) {
      q = query(q, orderBy(orderByField, orderDirection));
    }

    return onSnapshot(q, (querySnapshot) => {
      const documents = [];
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      callback(documents);
    });
  }

  // Real-time listener for a single document
  onDocumentChange(collectionName, id, callback) {
    const docRef = doc(db, collectionName, id);
    return onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() });
      } else {
        callback(null);
      }
    });
  }

  // Specific methods for your application

  // Users collection
  async createUser(userData) {
    return this.create('users', userData);
  }

  async getUserById(id) {
    return this.getById('users', id);
  }

  async getAllUsers() {
    return this.getAll('users', 'createdAt', 'desc');
  }

  async updateUser(id, userData) {
    return this.update('users', id, userData);
  }

  async deleteUser(id) {
    return this.delete('users', id);
  }

  // Products collection
  async createProduct(productData) {
    return this.create('products', productData);
  }

  async getAllProducts() {
    return this.getAll('products', 'createdAt', 'desc');
  }

  async updateProduct(id, productData) {
    return this.update('products', id, productData);
  }

  async deleteProduct(id) {
    return this.delete('products', id);
  }

  // Quality entries collection
  async createQualityEntry(entryData) {
    return this.create('qualityEntries', entryData);
  }

  async getAllQualityEntries() {
    return this.getAll('qualityEntries', 'createdAt', 'desc');
  }

  async getQualityEntriesByProduct(productId) {
    return this.query('qualityEntries', 'productId', '==', productId, 'createdAt', 'desc');
  }

  // Company info collection
  async getCompanyInfo() {
    const entries = await this.getAll('companyInfo');
    return entries.length > 0 ? entries[0] : null;
  }

  async updateCompanyInfo(data) {
    const existing = await this.getCompanyInfo();
    if (existing) {
      return this.update('companyInfo', existing.id, data);
    } else {
      return this.create('companyInfo', data);
    }
  }
}

export default new FirestoreService();
