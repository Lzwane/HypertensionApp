import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Alert, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// Firebase Imports
import { collection, addDoc, query, where, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../services/firebaseConfig';

interface JournalEntry {
  id: string;
  text: string;
  date: string;
}

export default function JournalScreen() {
  const [text, setText] = useState('');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    loadJournal();
  }, []);

  const loadJournal = async () => {
    if (!auth.currentUser) return;

    try {
      const q = query(
        collection(db, 'journal'),
        where('userId', '==', auth.currentUser.uid),
        orderBy('date', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const loadedEntries: JournalEntry[] = [];
      querySnapshot.forEach((doc) => {
        loadedEntries.push({ id: doc.id, ...doc.data() } as JournalEntry);
      });
      
      setEntries(loadedEntries);
    } catch (e) {
      console.log('Failed to load journal', e);
    }
  };

  const handleSave = async () => {
    if (!text.trim()) return;
    if (!auth.currentUser) return;

    try {
      await addDoc(collection(db, 'journal'), {
        userId: auth.currentUser.uid,
        text: text.trim(),
        date: new Date().toISOString(),
      });
      setText('');
      loadJournal(); // Refresh
    } catch (e) {
      Alert.alert('Error', 'Could not save entry');
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert("Delete Entry", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete", style: "destructive", onPress: async () => {
          try {
            await deleteDoc(doc(db, 'journal', id));
            loadJournal();
          } catch (e) {
            Alert.alert('Error', 'Could not delete entry');
          }
        }
      }
    ]);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, isDark && styles.containerDark]}
    >
      <Text style={[styles.header, isDark && styles.textLight]}>My Journal</Text>

      <FlatList
        data={entries}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.card, isDark && styles.cardDark]}>
            <View style={styles.cardHeader}>
              <Text style={styles.dateText}>{new Date(item.date).toLocaleDateString()} {new Date(item.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Text>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Ionicons name="trash-outline" size={20} color="#e74c3c" />
              </TouchableOpacity>
            </View>
            <Text style={[styles.entryText, isDark && styles.textLight]}>{item.text}</Text>
          </View>
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>No thoughts recorded yet.</Text>}
      />

      <View style={[styles.inputContainer, isDark && styles.inputContainerDark]}>
        <TextInput
          style={[styles.input, isDark && styles.inputDark]}
          placeholder="Write your thoughts..."
          placeholderTextColor="#999"
          value={text}
          onChangeText={setText}
          multiline
        />
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingTop: 60 },
  containerDark: { backgroundColor: '#121212' },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, paddingHorizontal: 20, color: '#333' },
  textLight: { color: 'white' },
  list: { paddingHorizontal: 20, paddingBottom: 100 },
  card: { backgroundColor: 'white', padding: 15, borderRadius: 12, marginBottom: 15, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  cardDark: { backgroundColor: '#1e1e1e' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  dateText: { fontSize: 12, color: '#888' },
  entryText: { fontSize: 16, color: '#333', lineHeight: 22 },
  emptyText: { textAlign: 'center', color: '#aaa', marginTop: 50 },
  inputContainer: { flexDirection: 'row', padding: 15, backgroundColor: 'white', borderTopWidth: 1, borderColor: '#eee', alignItems: 'flex-end' },
  inputContainerDark: { backgroundColor: '#1e1e1e', borderColor: '#333' },
  input: { flex: 1, backgroundColor: '#f0f0f0', borderRadius: 20, padding: 12, marginRight: 10, fontSize: 16, maxHeight: 100 },
  inputDark: { backgroundColor: '#333', color: 'white' },
  saveButton: { backgroundColor: '#3498db', padding: 12, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
});