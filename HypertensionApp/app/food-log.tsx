import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FoodLogScreen() {
  const router = useRouter();
  const [meal, setMeal] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = async () => {
    if (!meal) {
      Alert.alert('Missing Data', 'Please enter what you ate.');
      return;
    }

    try {
      const newEntry = {
        id: Date.now(),
        meal,
        description, // e.g., "Salty", "Home cooked", etc.
        date: new Date().toISOString(),
      };

      // Get existing food logs
      const existingData = await AsyncStorage.getItem('food_logs');
      const logs = existingData ? JSON.parse(existingData) : [];

      // Add new and save
      logs.unshift(newEntry);
      await AsyncStorage.setItem('food_logs', JSON.stringify(logs));

      Alert.alert('Success', 'Meal recorded!');
      router.back(); 
    } catch (error) {
      Alert.alert('Error', 'Could not save data');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log Meal</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>What did you eat?</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g. Jollof Rice" 
          value={meal}
          onChangeText={setMeal}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Notes (Sodium/Portion)</Text>
        <TextInput 
          style={[styles.input, { height: 80 }]} 
          placeholder="e.g. A little salty, small portion" 
          multiline
          value={description}
          onChangeText={setDescription}
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Meal</Text>
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
    backgroundColor: '#27ae60', // Green color for food
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