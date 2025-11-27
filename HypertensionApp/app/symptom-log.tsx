import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function SymptomLogScreen() {
  const router = useRouter();
  const [symptom, setSymptom] = useState('');
  const [severity, setSeverity] = useState(1); // 1 to 5
  const [notes, setNotes] = useState('');

  // Common symptoms for easy selection
  const commonSymptoms = ["Headache", "Dizziness", "Fatigue", "Palpitations", "Swelling"];

  const handleSave = async () => {
    if (!symptom) {
      Alert.alert('Missing Data', 'Please select or type a symptom.');
      return;
    }

    try {
      const newEntry = {
        id: Date.now(),
        symptom,
        severity,
        notes,
        date: new Date().toISOString(),
      };

      const existingData = await AsyncStorage.getItem('symptoms');
      const logs = existingData ? JSON.parse(existingData) : [];

      logs.unshift(newEntry); // Add to top
      await AsyncStorage.setItem('symptoms', JSON.stringify(logs));

      Alert.alert('Success', 'Symptom recorded.');
      router.back(); 
    } catch (error) {
      Alert.alert('Error', 'Could not save data');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Log Symptoms</Text>
      
      <Text style={styles.label}>What are you feeling?</Text>
      <View style={styles.chipContainer}>
        {commonSymptoms.map((item) => (
          <TouchableOpacity 
            key={item} 
            style={[styles.chip, symptom === item && styles.chipActive]}
            onPress={() => setSymptom(item)}
          >
            <Text style={[styles.chipText, symptom === item && styles.chipTextActive]}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={styles.inputGroup}>
        <TextInput 
          style={styles.input} 
          placeholder="Or type here..." 
          value={symptom}
          onChangeText={setSymptom}
        />
      </View>

      <Text style={styles.label}>Severity (1 = Mild, 5 = Severe)</Text>
      <View style={styles.severityContainer}>
        {[1, 2, 3, 4, 5].map((level) => (
          <TouchableOpacity 
            key={level} 
            style={[styles.severityButton, severity === level && styles.severityActive]}
            onPress={() => setSeverity(level)}
          >
            <Text style={[styles.severityText, severity === level && styles.severityTextActive]}>{level}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Notes</Text>
        <TextInput 
          style={[styles.input, { height: 80 }]} 
          placeholder="e.g. Started after lunch" 
          multiline
          value={notes}
          onChangeText={setNotes}
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Entry</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, paddingTop: 60, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 16, marginBottom: 10, color: '#333', fontWeight: '600' },
  
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 15 },
  chip: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: '#eee' },
  chipActive: { backgroundColor: '#3498db' },
  chipText: { color: '#555' },
  chipTextActive: { color: 'white', fontWeight: 'bold' },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 10,
    fontSize: 18,
    backgroundColor: '#f9f9f9',
  },

  severityContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  severityButton: {
    width: 50, height: 50, borderRadius: 25, backgroundColor: '#eee',
    alignItems: 'center', justifyContent: 'center'
  },
  severityActive: { backgroundColor: '#e74c3c' },
  severityText: { fontSize: 18, color: '#555' },
  severityTextActive: { color: 'white', fontWeight: 'bold' },

  saveButton: {
    backgroundColor: '#e67e22', // Orange
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
  cancelButtonText: { color: '#95a5a6', fontSize: 16 },
});