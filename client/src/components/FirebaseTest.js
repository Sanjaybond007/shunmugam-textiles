import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import firestoreService from '../services/firestoreService';

const FirebaseTest = () => {
  const { user, login, register, logout, resetPassword } = useAuth();
  const [testData, setTestData] = useState('');
  const [firestoreData, setFirestoreData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Test Firestore connection
  const testFirestore = async () => {
    setLoading(true);
    try {
      // Create a test document
      const testDoc = await firestoreService.create('test', {
        message: testData || 'Hello Firebase!',
        timestamp: new Date().toISOString(),
        userId: user?.uid
      });
      
      setMessage(`✅ Firestore test successful! Document ID: ${testDoc.id}`);
      
      // Fetch all test documents
      const allDocs = await firestoreService.getAll('test');
      setFirestoreData(allDocs);
      
    } catch (error) {
      setMessage(`❌ Firestore test failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Test authentication
  const testAuth = async () => {
    setLoading(true);
    try {
      if (!user) {
        // Try to register a test user
        await register({
          email: 'test@example.com',
          password: 'test123456',
          displayName: 'Test User'
        });
        setMessage('✅ Authentication test successful! User registered.');
      } else {
        setMessage(`✅ User is authenticated: ${user.email}`);
      }
    } catch (error) {
      setMessage(`❌ Authentication test failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Test logout
  const testLogout = async () => {
    try {
      await logout();
      setMessage('✅ Logout successful!');
    } catch (error) {
      setMessage(`❌ Logout failed: ${error.message}`);
    }
  };

  // Test password reset
  const testPasswordReset = async () => {
    setLoading(true);
    try {
      await resetPassword('test@example.com');
      setMessage('✅ Password reset email sent!');
    } catch (error) {
      setMessage(`❌ Password reset failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <h3>Firebase Connection Test</h3>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <h5>Authentication Status:</h5>
            {user ? (
              <div className="alert alert-success">
                <strong>✅ Authenticated as:</strong> {user.email}
                <br />
                <strong>UID:</strong> {user.uid}
                <br />
                <strong>Email Verified:</strong> {user.emailVerified ? 'Yes' : 'No'}
              </div>
            ) : (
              <div className="alert alert-warning">
                <strong>⚠️ Not authenticated</strong>
              </div>
            )}
          </div>

          <div className="mb-3">
            <h5>Test Actions:</h5>
            <div className="btn-group me-2" role="group">
              <button 
                className="btn btn-primary" 
                onClick={testAuth}
                disabled={loading}
              >
                {user ? 'Check Auth' : 'Test Registration'}
              </button>
              <button 
                className="btn btn-success" 
                onClick={testFirestore}
                disabled={loading || !user}
              >
                Test Firestore
              </button>
              <button 
                className="btn btn-warning" 
                onClick={testPasswordReset}
                disabled={loading}
              >
                Test Password Reset
              </button>
              <button 
                className="btn btn-danger" 
                onClick={testLogout}
                disabled={!user}
              >
                Test Logout
              </button>
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="testData" className="form-label">Test Data for Firestore:</label>
            <input
              type="text"
              className="form-control"
              id="testData"
              value={testData}
              onChange={(e) => setTestData(e.target.value)}
              placeholder="Enter test message"
            />
          </div>

          {message && (
            <div className="alert alert-info">
              <strong>Test Result:</strong> {message}
            </div>
          )}

          {firestoreData.length > 0 && (
            <div className="mt-3">
              <h5>Firestore Data:</h5>
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Message</th>
                      <th>Timestamp</th>
                      <th>User ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {firestoreData.map((doc, index) => (
                      <tr key={index}>
                        <td>{doc.id}</td>
                        <td>{doc.message}</td>
                        <td>{doc.timestamp}</td>
                        <td>{doc.userId}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FirebaseTest;
