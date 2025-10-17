const firestoreService = require('./firestoreService');
const bcrypt = require('bcryptjs');

class UserService {
  constructor() {
    this.collections = {
      admin: 'admins',
      supervisor: 'supervisors',
      weaver: 'weavers'
    };
  }

  getCollectionName(role) {
    return this.collections[role] || 'users';
  }

  async createUser(userData) {
    const role = userData.role || 'supervisor';
    const collection = this.getCollectionName(role);
    
    // Check if user already exists in the appropriate collection
    const existingUser = await this.findByUserId(userData.userId, role);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const userDoc = {
      userId: userData.userId,
      name: userData.name,
      password: hashedPassword,
      role: role
    };

    return await firestoreService.create(collection, userDoc, userData.userId);
  }

  async findByUserId(userId, role = null) {
    if (role) {
      // Search in specific collection
      const collection = this.getCollectionName(role);
      return await firestoreService.findById(collection, userId);
    }
    
    // Search across all collections
    for (const [userRole, collection] of Object.entries(this.collections)) {
      const user = await firestoreService.findById(collection, userId);
      if (user) {
        return user;
      }
    }
    return null;
  }

  async findById(id, role = null) {
    if (role) {
      const collection = this.getCollectionName(role);
      return await firestoreService.findById(collection, id);
    }
    
    // Search across all collections
    for (const [userRole, collection] of Object.entries(this.collections)) {
      const user = await firestoreService.findById(collection, id);
      if (user) {
        return user;
      }
    }
    return null;
  }

  async getAllUsers(filters = {}) {
    // Get users from all collections
    let allUsers = [];
    for (const [userRole, collection] of Object.entries(this.collections)) {
      const users = await firestoreService.findAll(collection, filters, { field: 'createdAt', direction: 'desc' });
      allUsers = allUsers.concat(users);
    }
    return allUsers;
  }

  async updateUser(userId, updateData, role = null) {
    // If password is being updated, hash it
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    if (role) {
      const collection = this.getCollectionName(role);
      return await firestoreService.update(collection, userId, updateData);
    }

    // Find user first to determine collection
    const user = await this.findByUserId(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    const collection = this.getCollectionName(user.role);
    return await firestoreService.update(collection, userId, updateData);
  }

  async deleteUser(userId, role = null) {
    if (role) {
      const collection = this.getCollectionName(role);
      return await firestoreService.delete(collection, userId);
    }

    // Find user first to determine collection
    const user = await this.findByUserId(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    const collection = this.getCollectionName(user.role);
    return await firestoreService.delete(collection, userId);
  }

  async comparePassword(user, candidatePassword) {
    return await bcrypt.compare(candidatePassword, user.password);
  }

  async validateCredentials(userId, password) {
    const user = await this.findByUserId(userId);
    if (!user) {
      return null;
    }

    const isValid = await this.comparePassword(user, password);
    if (!isValid) {
      return null;
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getUsersByRole(role) {
    const collection = this.getCollectionName(role);
    return await firestoreService.findAll(collection, {}, { field: 'createdAt', direction: 'desc' });
  }

  async userExists(userId, role = null) {
    if (role) {
      const collection = this.getCollectionName(role);
      return await firestoreService.exists(collection, 'userId', userId);
    }
    
    // Check across all collections
    for (const [userRole, collection] of Object.entries(this.collections)) {
      const exists = await firestoreService.exists(collection, 'userId', userId);
      if (exists) {
        return true;
      }
    }
    return false;
  }
}

module.exports = new UserService();
