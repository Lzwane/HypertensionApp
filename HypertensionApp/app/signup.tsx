import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
// Import Firestore functions to fix the "Empty Collection" issue
import { doc, setDoc } from 'firebase/firestore'; 
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from './services/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';

export default function SignUpScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      Alert.alert("Missing Fields", "Please fill in all fields.");
      return;
    }

    setLoading(true);
    console.log("Attempting sign up..."); // Debug log

    try {
      // 1. Create Authentication User
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("Auth User Created:", user.uid);

      // 2. Update Profile Name
      await updateProfile(user, {
        displayName: name
      });

      // 3. CREATE DATABASE ENTRY (Fixes empty collection issue)
      // This creates a document in the 'users' collection with your ID
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        fullName: name,
        email: email,
        createdAt: new Date().toISOString(),
      });
      console.log("Firestore User Document Created");

      // 4. Force Redirect
      // We manually push to tabs just in case the auto-listener is slow
      router.replace('/(tabs)'); 

    } catch (error: any) {
      console.error("Sign Up Error:", error);
      let msg = error.message;
      
      // Friendly error messages
      if (msg.includes('auth/email-already-in-use')) msg = "Email is already registered.";
      if (msg.includes('auth/weak-password')) msg = "Password must be at least 6 characters.";
      if (msg.includes('auth/configuration-not-found') || msg.includes('auth/operation-not-allowed')) {
        msg = "Please enable Email/Password Sign-in in your Firebase Console.";
      }
      
      Alert.alert("Sign Up Failed", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Account</Text>
        </View>

        <View style={styles.brandingHeader}>
           <View style={styles.logoBadge}>
              <Ionicons name="flask" size={24} color="white" />
           </View>
           <Text style={styles.appName}>Syscare.ng</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput 
            style={styles.input} 
            placeholder="e.g. Lethabo Zwane" 
            value={name}
            onChangeText={setName}
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput 
            style={styles.input} 
            placeholder="lethabo@example.com" 
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Min 6 chars" 
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#999"
          />

          <TouchableOpacity style={styles.signupButton} onPress={handleSignUp} disabled={loading}>
            {loading ? <ActivityIndicator color="white"/> : <Text style={styles.signupButtonText}>Sign Up</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  scrollContainer: { flexGrow: 1, padding: 20, paddingTop: 60, justifyContent: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  backButton: { padding: 5, marginRight: 10 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  brandingHeader: { alignItems: 'center', marginBottom: 30 },
  logoBadge: { 
    width: 60, height: 60, borderRadius: 18, backgroundColor: '#3498db', 
    alignItems: 'center', justifyContent: 'center', marginBottom: 10,
    shadowColor: '#3498db', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 3,
  },
  appName: { fontSize: 20, fontWeight: 'bold', color: '#333', letterSpacing: 1 },
  formContainer: { backgroundColor: 'white', padding: 25, borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  label: { fontSize: 16, color: '#333', marginBottom: 8, fontWeight: '600' },
  input: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 20,
    fontSize: 16,
    color: '#333'
  },
  signupButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#3498db', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 5,
  },
  signupButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});