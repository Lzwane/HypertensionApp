import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useRouter, Link, Href } from 'expo-router';
import { useSession } from './ctx';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useSession();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!name || !password) {
      Alert.alert("Missing Fields", "Please enter your name and password.");
      return;
    }
    // Simulate login - in a real app, verify password here
    signIn(name);
    // The _layout.tsx will handle the redirect to tabs automatically
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.headerContainer}>
        {/* Updated branding to match Home Page theme */}
        <View style={styles.logoBadge}>
          <Ionicons name="flask" size={40} color="white" />
        </View>
        <Text style={styles.appName}>JG LABS</Text>
        <Text style={styles.tagline}>Hypertension Manager</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Enter your name" 
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Enter your password" 
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#999"
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Log In</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <Link href={"/signup" as Href} asChild>
            <TouchableOpacity>
              <Text style={styles.linkText}>Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', justifyContent: 'center', padding: 20 },
  headerContainer: { alignItems: 'center', marginBottom: 40 },
  logoBadge: { 
    width: 80, height: 80, borderRadius: 20, backgroundColor: '#3498db', // Matches Home Page Blue
    alignItems: 'center', justifyContent: 'center', marginBottom: 15,
    shadowColor: '#3498db', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 5,
  },
  appName: { fontSize: 28, fontWeight: 'bold', color: '#333', letterSpacing: 1 },
  tagline: { fontSize: 16, color: '#7f8c8d', marginTop: 5 },
  
  formContainer: { width: '100%', backgroundColor: 'white', padding: 20, borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
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
  loginButton: {
    backgroundColor: '#3498db', // Matches Home Page Blue
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  loginButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  footerText: { color: '#666', fontSize: 15 },
  linkText: { color: '#3498db', fontSize: 15, fontWeight: 'bold', marginLeft: 5 },
});