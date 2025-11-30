import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Switch, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AddMedScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [instructions, setInstructions] = useState('');
  const [reminderEnabled, setReminderEnabled] = useState(false);
  
  const [reminderTime, setReminderTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  const scheduleNotification = async (medName: string, time: Date) => {
    // 1. Check/Request Permission
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We cannot send reminders without permission.');
      return null;
    }

    // 2. Schedule the Notification
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Medication Reminder",
        body: `It's time to take your ${medName}`,
        sound: true,
      },
      trigger: {
        // FIX: Explicitly set the type to DAILY
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: time.getHours(),
        minute: time.getMinutes(),
      },
    });

    return identifier;
  };

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    
    if (selectedDate) {
      setReminderTime(selectedDate);
    }
  };

  const handleSave = async () => {
    if (!name) {
      Alert.alert('Missing Data', 'Please enter the medication name.');
      return;
    }

    try {
      let notificationId = null;

      if (reminderEnabled) {
        notificationId = await scheduleNotification(name, reminderTime);
      }

      const newMed = {
        id: Date.now(),
        name,
        dosage,
        instructions,
        reminder: reminderEnabled,
        reminderTime: reminderEnabled ? reminderTime.toISOString() : null,
        notificationId,
      };

      const existingData = await AsyncStorage.getItem('medications');
      const meds = existingData ? JSON.parse(existingData) : [];

      meds.push(newMed);
      await AsyncStorage.setItem('medications', JSON.stringify(meds));

      const timeString = reminderTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      Alert.alert('Success', `Medication added! ${reminderEnabled ? `(Reminder set for ${timeString})` : ''}`);
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

      {reminderEnabled && (
        <View style={styles.timeSection}>
          <Text style={styles.label}>Notification Time</Text>
          
          {Platform.OS === 'android' && (
            <TouchableOpacity style={styles.timeButton} onPress={() => setShowTimePicker(true)}>
              <Text style={styles.timeButtonText}>
                {reminderTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </TouchableOpacity>
          )}

          {(showTimePicker || Platform.OS === 'ios') && (
            <DateTimePicker
              value={reminderTime}
              mode="time"
              display="default"
              onChange={handleTimeChange}
              style={styles.datePicker}
            />
          )}
        </View>
      )}

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
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
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
  timeSection: {
    marginBottom: 30,
    alignItems: Platform.OS === 'ios' ? 'flex-start' : 'stretch',
  },
  timeButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  timeButtonText: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
  datePicker: {
    marginTop: 5,
  }
});