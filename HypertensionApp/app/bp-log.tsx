import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface BPReading {
  id: number;
  systolic: string;
  diastolic: string;
  date: string;
}

export default function BPLogScreen() {
  const router = useRouter();
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [history, setHistory] = useState<BPReading[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const existingData = await AsyncStorage.getItem('bp_readings');
      if (existingData) {
        // Show only the last 5 readings
        const readings = JSON.parse(existingData);
        setHistory(readings.slice(0, 5));
      }
    } catch (error) {
      console.log('Error loading history', error);
    }
  };

  const handleSave = async () => {
    if (!systolic || !diastolic) {
      Alert.alert('Missing Data', 'Please enter both numbers.');
      return;
    }

    try {
      const newReading = {
        id: Date.now(),
        systolic,
        diastolic,
        date: new Date().toISOString(),
      };

      const existingData = await AsyncStorage.getItem('bp_readings');
      const readings = existingData ? JSON.parse(existingData) : [];

      readings.unshift(newReading);
      await AsyncStorage.setItem('bp_readings', JSON.stringify(readings));

      Alert.alert('Success', 'Reading saved!');
      router.back(); 
    } catch (error) {
      Alert.alert('Error', 'Could not save data');
      console.error(error);
    }
  };

  const renderHistoryItem = ({ item }: { item: BPReading }) => (
    <View style={styles.historyItem}>
      <Text style={styles.historyValue}>{item.systolic}/{item.diastolic} mmHg</Text>
      <Text style={styles.historyDate}>
        {new Date(item.date).toLocaleDateString()} {new Date(item.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
      </Text>
    </View>
  );

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

      {/* History Section */}
      <View style={styles.historyContainer}>
        <Text style={styles.historyTitle}>Recent Trends</Text>
        {history.length === 0 ? (
          <Text style={styles.emptyText}>No previous readings.</Text>
        ) : (
          <FlatList
            data={history}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderHistoryItem}
            style={styles.historyList}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  inputGroup: { marginBottom: 15 },
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
    marginTop: 5,
  },
  cancelButtonText: { color: '#e74c3c', fontSize: 16 },
  
  // History Styles
  historyContainer: { marginTop: 30, flex: 1 },
  historyTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#555' },
  historyList: { flex: 1 },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  historyValue: { fontSize: 16, fontWeight: 'bold', color: '#2c3e50' },
  historyDate: { fontSize: 14, color: '#95a5a6' },
  emptyText: { color: '#bdc3c7', fontStyle: 'italic', marginTop: 10 },
});