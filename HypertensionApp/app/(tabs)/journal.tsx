import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Alert, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

interface JournalEntry {
  id: number;
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
    try {
      const data = await AsyncStorage.getItem('user_journal');
      if (data) setEntries(JSON.parse(data));
    } catch (e) {
      console.log('Failed to load journal');
    }
  };

  const handleSave = async () => {
    if (!text.trim()) return;

    const newEntry: JournalEntry = {
      id: Date.now(),
      text: text.trim(),
      date: new Date().toISOString(),
    };

    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    await AsyncStorage.setItem('user_journal', JSON.stringify(updatedEntries));
    setText('');
  };

  const handleDelete = (id: number) => {
    Alert.alert("Delete Entry", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete", style: "destructive", onPress: async () => {
          const updated = entries.filter(e => e.id !== id);
          setEntries(updated);
          await AsyncStorage.setItem('user_journal', JSON.stringify(updated));
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
        keyExtractor={item => item.id.toString()}
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