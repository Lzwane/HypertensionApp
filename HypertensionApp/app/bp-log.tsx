import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function BPLogScreen() {
  const router = useRouter();
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');

  const handleSave = async () => {
    if (!systolic || !diastolic) {
      Alert.alert('Missing Data', 'Please enter both numbers.');
      return;
    }

    try {
      // 1. Create the new reading object
      const newReading = {
        id: Date.now(),
        systolic,
        diastolic,
        date: new Date().toISOString(),
      };

      // 2. Get existing readings from storage
      const existingData = await AsyncStorage.getItem('bp_readings');
      const readings = existingData ? JSON.parse(existingData) : [];

      // 3. Add new reading to the list
      readings.unshift(newReading); // Add to the top of the list

      // 4. Save back to storage
      await AsyncStorage.setItem('bp_readings', JSON.stringify(readings));

      Alert.alert('Success', 'Reading saved!');
      router.back(); 
    } catch (error) {
      Alert.alert('Error', 'Could not save data');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>New Reading</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Systolic (Top Number)</Text>
        <TextInput 
          style={styles.input} 
          placeholder="120" 
          keyboardType="numeric"
          value={systolic}
          onChangeText={setSystolic}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Diastolic (Bottom Number)</Text>
        <TextInput 
          style={styles.input} 
          placeholder="80" 
          keyboardType="numeric"
          value={diastolic}
          onChangeText={setDiastolic}
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Reading</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 16, marginBottom: 8, color: '#333' },
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
    marginTop: 10,
  },
  saveButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  cancelButton: {
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: { color: '#e74c3c', fontSize: 16 },
});