import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
// 1. Import Firebase functions
import { collection, addDoc, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db, auth } from './services/firebaseConfig';

interface BPReading {
  id: string;
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
    // 2. Security Check: Must be logged in
    if (!auth.currentUser) return;

    try {
      // 3. Query ONLY this user's data
      const q = query(
        collection(db, 'bp_readings'),
        where('userId', '==', auth.currentUser.uid), // <--- The Magic Filter
        orderBy('date', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const readings: BPReading[] = [];
      querySnapshot.forEach((doc) => {
        readings.push({ id: doc.id, ...doc.data() } as BPReading);
      });
      
      // Show only last 5
      setHistory(readings.slice(0, 5));
    } catch (error) {
      console.log('Error loading history', error);
    }
  };

  const handleSave = async () => {
    if (!systolic || !diastolic) {
      Alert.alert('Missing Data', 'Please enter both numbers.');
      return;
    }

    if (!auth.currentUser) {
      Alert.alert('Error', 'You must be logged in to save.');
      return;
    }

    try {
      // 4. Save to Cloud with User ID
      await addDoc(collection(db, 'bp_readings'), {
        userId: auth.currentUser.uid, // <--- Link data to Lethabo/Grace
        systolic,
        diastolic,
        date: new Date().toISOString(),
      });

      Alert.alert('Success', 'Reading saved to cloud!');
      router.back(); 
    } catch (error: any) {
      Alert.alert('Error', error.message);
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
        <Text style={styles.saveButtonText}>Save to Cloud</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>

      <View style={styles.historyContainer}>
        <Text style={styles.historyTitle}>Your Recent Trends</Text>
        {history.length === 0 ? (
          <Text style={styles.emptyText}>No readings found for this user.</Text>
        ) : (
          <FlatList
            data={history}
            keyExtractor={(item) => item.id}
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