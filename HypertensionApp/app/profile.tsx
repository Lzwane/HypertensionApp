import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const router = useRouter();
  const [name, setName] = useState('');

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
      router.back(); // Go back to Home
    } catch (error) {
      Alert.alert('Error', 'Could not save profile');
    }
  };

  const handleClearData = async () => {
    Alert.alert(
      "Reset App",
      "This will delete ALL your logs, medications, and settings. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete Everything", 
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.clear();
            Alert.alert("Reset Complete", "Please restart the app.");
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
        <Text style={styles.editLabel}>Edit Profile</Text>
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

      <Text style={styles.sectionTitle}>Data Management</Text>
      
      <TouchableOpacity style={styles.dangerButton} onPress={handleClearData}>
        <Ionicons name="trash-outline" size={24} color="#c0392b" />
        <Text style={styles.dangerText}>Clear All App Data</Text>
      </TouchableOpacity>

      <View style={styles.versionInfo}>
        <Text style={styles.versionText}>Hypertension Manager v1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, paddingTop: 50, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 15, color: '#333' },
  
  avatarContainer: { alignItems: 'center', marginBottom: 30 },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  editLabel: { color: '#3498db', fontWeight: '600' },

  section: { marginBottom: 20 },
  label: { fontSize: 16, marginBottom: 8, color: '#333', fontWeight: 'bold' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 10,
    fontSize: 18,
    backgroundColor: '#f9f9f9',
  },

  saveButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
  },
  saveButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },

  divider: { height: 1, backgroundColor: '#eee', marginBottom: 30 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#333' },

  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fdedec',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fadbd8',
  },
  dangerText: { color: '#c0392b', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },

  versionInfo: { marginTop: 50, alignItems: 'center' },
  versionText: { color: '#999', fontSize: 12 },
});