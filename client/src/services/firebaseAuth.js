import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification
} from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

class FirebaseAuthService {
  // Sign in with email and password
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Get user role from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.exists() ? userDoc.data() : {};
      
      return {
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          role: userData.role || 'user',
          ...userData
        },
        token: await user.getIdToken()
      };
    } catch (error) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Register new user with role
  async register(email, password, displayName = null, role = 'user') {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update display name if provided
      if (displayName) {
        await updateProfile(user, { displayName });
      }

      // Store user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        displayName: displayName || '',
        role: role,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Send email verification
      await sendEmailVerification(user);

      return {
        user: {
          uid: user.uid,
          email: user.email,
          displayName: displayName,
          role: role
        },
        token: await user.getIdToken()
      };
    } catch (error) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Sign out
  async logout() {
    try {
      await signOut(auth);
      return true;
    } catch (error) {
      throw new Error('Failed to sign out');
    }
  }

  // Get current user
  getCurrentUser() {
    return auth.currentUser;
  }

  // Listen to auth state changes
  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback);
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!auth.currentUser;
  }

  // Reset password
  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (error) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Get ID token
  async getIdToken() {
    const user = this.getCurrentUser();
    if (user) {
      return await user.getIdToken();
    }
    return null;
  }

  // Error message mapping
  getErrorMessage(errorCode) {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No user found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/invalid-email':
        return 'Invalid email address.';
      case 'auth/user-disabled':
        return 'This account has been disabled.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection.';
      default:
        return 'Authentication failed. Please try again.';
    }
  }
}

export default new FirebaseAuthService();
