const firestoreService = require('./firestoreService');

class EmployeeService {
  constructor() {
    this.collection = 'employees';
  }

  async createEmployee(employeeData) {
    // Check if employee already exists
    const existingEmployee = await this.findByEmployeeId(employeeData.employeeId);
    if (existingEmployee) {
      throw new Error('Employee already exists');
    }

    const employeeDoc = {
      employeeId: employeeData.employeeId,
      name: employeeData.name,
      photo: employeeData.photo || null,
      status: employeeData.status || 'active',
      supervisorId: employeeData.supervisorId || null
    };

    return await firestoreService.create(this.collection, employeeDoc, employeeData.employeeId);
  }

  async findByEmployeeId(employeeId) {
    return await firestoreService.findById(this.collection, employeeId);
  }

  async findById(id) {
    return await firestoreService.findById(this.collection, id);
  }

  async getAllEmployees(filters = {}) {
    return await firestoreService.findAll(this.collection, filters, { field: 'name', direction: 'asc' });
  }

  async getActiveEmployees() {
    return await firestoreService.findAll(this.collection, { status: 'active' }, { field: 'name', direction: 'asc' });
  }

  async getEmployeesBySupervisor(supervisorId) {
    return await firestoreService.findAll(this.collection, { supervisorId }, { field: 'name', direction: 'asc' });
  }

  async updateEmployee(employeeId, updateData) {
    return await firestoreService.update(this.collection, employeeId, updateData);
  }

  async deleteEmployee(employeeId) {
    return await firestoreService.delete(this.collection, employeeId);
  }

  async employeeExists(employeeId) {
    return await firestoreService.exists(this.collection, 'employeeId', employeeId);
  }

  async updateEmployeeStatus(employeeId, status) {
    return await this.updateEmployee(employeeId, { status });
  }

  async searchEmployees(searchTerm) {
    // Since Firestore doesn't support full-text search natively,
    // we'll get all employees and filter on the client side
    const allEmployees = await this.getAllEmployees();
    
    if (!searchTerm) {
      return allEmployees;
    }

    const searchLower = searchTerm.toLowerCase();
    return allEmployees.filter(employee => 
      employee.name.toLowerCase().includes(searchLower) ||
      employee.employeeId.toLowerCase().includes(searchLower)
    );
  }

  async getEmployeeStats() {
    const allEmployees = await this.getAllEmployees();
    const activeEmployees = allEmployees.filter(emp => emp.status === 'active');
    const inactiveEmployees = allEmployees.filter(emp => emp.status === 'inactive');

    return {
      total: allEmployees.length,
      active: activeEmployees.length,
      inactive: inactiveEmployees.length
    };
  }
}

module.exports = new EmployeeService();
