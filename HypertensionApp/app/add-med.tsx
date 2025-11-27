import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

export default function AddMedScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [instructions, setInstructions] = useState('');
  const [reminderEnabled, setReminderEnabled] = useState(false);

  // Helper: Request Permission and Schedule
  const scheduleNotification = async (medName: string) => {
    // 1. Check/Request Permission
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We cannot send reminders without permission.');
      return null;
    }

    // 2. Schedule the Notification
    // FIX: We explicitly define the trigger type as 'TIME_INTERVAL'
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Medication Reminder",
        body: `It's time to take your ${medName}`,
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 10, // Fires 10 seconds after saving (for testing)
        repeats: false,
      },
    });

    return identifier;
  };

  const handleSave = async () => {
    if (!name) {
      Alert.alert('Missing Data', 'Please enter the medication name.');
      return;
    }

    try {
      let notificationId = null;

      // If user wants reminders, schedule one
      if (reminderEnabled) {
        notificationId = await scheduleNotification(name);
      }

      const newMed = {
        id: Date.now(),
        name,
        dosage,
        instructions,
        reminder: reminderEnabled,
        notificationId,
      };

      const existingData = await AsyncStorage.getItem('medications');
      const meds = existingData ? JSON.parse(existingData) : [];

      meds.push(newMed);
      await AsyncStorage.setItem('medications', JSON.stringify(meds));

      Alert.alert('Success', 'Medication added! (Reminder set for 10s from now)');
      router.back(); 
    } catch (error) {
      Alert.alert('Error', 'Could not save data');
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Medication</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Medicine Name</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g. Amlodipine" 
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Dosage</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g. 5mg" 
          value={dosage}
          onChangeText={setDosage}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Instructions</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g. Take in the morning" 
          value={instructions}
          onChangeText={setInstructions}
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Enable Daily Reminder</Text>
        <Switch 
          value={reminderEnabled} 
          onValueChange={setReminderEnabled}
          trackColor={{ false: "#767577", true: "#3498db" }}
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Medication</Text>
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
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
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
    backgroundColor: '#8e44ad',
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