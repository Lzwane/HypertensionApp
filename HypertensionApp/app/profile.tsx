import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { db } from './services/firebaseConfig'; // Correct path from app/profile.tsx to app/services/
import { collection, addDoc } from 'firebase/firestore'; 

export default function ProfileScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const savedName = await AsyncStorage.getItem('user_name');
      if (savedName) setName(savedName);
    } catch (error) {
      console.log('Error loading profile');
    }
  };

  const handleSave = async () => {
    try {
      await AsyncStorage.setItem('user_name', name);
      Alert.alert('Success', 'Profile updated!');
      router.back(); 
    } catch (error) {
      Alert.alert('Error', 'Could not save profile');
    }
  };

  // NEW: Function to upload data to Firebase
  const handleCloudSync = async () => {
    setIsSyncing(true);
    try {
      // 1. Get all local data
      const bpData = await AsyncStorage.getItem('bp_readings');
      const medData = await AsyncStorage.getItem('medications');
      
      // 2. Upload to Firebase 'backups' collection
      // In a real app, you'd use a user ID (uid) instead of just 'anonymous_user'
      await addDoc(collection(db, "backups"), {
        user: name || 'Anonymous',
        timestamp: new Date(),
        bpReadings: bpData ? JSON.parse(bpData) : [],
        medications: medData ? JSON.parse(medData) : [],
      });

      Alert.alert("Cloud Sync", "Your data has been securely backed up to the cloud!");
    } catch (error: any) {
      Alert.alert("Sync Failed", error.message);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleClearData = async () => {
    Alert.alert(
      "Reset App",
      "Delete ALL local data? Make sure you Sync first!",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.clear();
            router.replace('/(tabs)');
          }
        }
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile & Settings</Text>
      </View>

      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={60} color="#bdc3c7" />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Your Name</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Enter your name" 
          value={name}
          onChangeText={setName}
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      <Text style={styles.sectionTitle}>Cloud Backup</Text>
      <TouchableOpacity style={styles.syncButton} onPress={handleCloudSync} disabled={isSyncing}>
        {isSyncing ? (
          <ActivityIndicator color="white" />
        ) : (
          <>
            <Ionicons name="cloud-upload" size={24} color="white" />
            <Text style={styles.syncText}>Sync Data to Cloud</Text>
          </>
        )}
      </TouchableOpacity>

      <View style={styles.divider} />

      <Text style={styles.sectionTitle}>Danger Zone</Text>
      <TouchableOpacity style={styles.dangerButton} onPress={handleClearData}>
        <Ionicons name="trash-outline" size={24} color="#c0392b" />
        <Text style={styles.dangerText}>Clear Local Data</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, paddingTop: 50, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 15, color: '#333' },
  
  avatarContainer: { alignItems: 'center', marginBottom: 30 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#f5f5f5', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#eee' },

  section: { marginBottom: 20 },
  label: { fontSize: 16, marginBottom: 8, color: '#333', fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 15, borderRadius: 10, fontSize: 18, backgroundColor: '#f9f9f9' },

  saveButton: { backgroundColor: '#3498db', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 30 },
  saveButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },

  divider: { height: 1, backgroundColor: '#eee', marginBottom: 30 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#333' },

  // New Sync Button Styles
  syncButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 15, backgroundColor: '#27ae60', borderRadius: 10, marginBottom: 20 },
  syncText: { color: 'white', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },

  dangerButton: { flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: '#fdedec', borderRadius: 10, borderWidth: 1, borderColor: '#fadbd8' },
  dangerText: { color: '#c0392b', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
});