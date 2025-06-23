// firebaseauth.dart

import 'package:firebase_auth/firebase_auth.dart';

class FirebaseAuthService {
  final FirebaseAuth _auth = FirebaseAuth.instance;

  // Sign in with a custom token received from your backend
  Future<User?> signInWithCustomToken(String token) async {
    try {
      UserCredential userCredential = await _auth.signInWithCustomToken(token);
      return userCredential.user;
    } catch (e) {
      print('Error signing in with custom token: $e');
      return null;
    }
  }

  // Sign out user
  Future<void> signOut() async {
    await _auth.signOut();
  }

  // Get current user
  User? getCurrentUser() {
    return _auth.currentUser;
  }

  // Stream for auth state changes (login/logout)
  Stream<User?> authStateChanges() {
    return _auth.authStateChanges();
  }
}
