import { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Keyboard, ActivityIndicator, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAIResponse } from '../services/ai'; // Import our new AI service

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

export default function ChatScreen() {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      text: 'Hello! I am your JB LABS health assistant. How can I help with your hypertension today?', 
      sender: 'ai' 
    }
  ]);
  
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages]);

  const handleSend = async () => {
    if (inputText.trim() === '') return;

    // 1. Add User Message
    const userMsg: Message = { id: Date.now().toString(), text: inputText, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    Keyboard.dismiss();
    setIsLoading(true);

    // 2. Call REAL AI
    const aiResponseText = await getAIResponse(userMsg.text);

    const aiMsg: Message = { id: (Date.now() + 1).toString(), text: aiResponseText, sender: 'ai' };
    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user';
    return (
      <View style={[
        styles.messageBubble, 
        isUser ? styles.userBubble : (isDark ? styles.aiBubbleDark : styles.aiBubble)
      ]}>
        <Text style={[
          styles.messageText, 
          isUser ? styles.userText : (isDark ? styles.aiTextDark : styles.aiText)
        ]}>
          {item.text}
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <View style={[styles.header, isDark && styles.headerDark]}>
        <Text style={[styles.headerTitle, isDark && styles.textLight]}>JB LABS Assistant</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.listContent}
      />

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#3498db" />
          <Text style={[styles.loadingText, isDark ? styles.textGray : styles.textLoading]}>Thinking...</Text>
        </View>
      )}

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        style={[styles.inputContainer, isDark && styles.inputContainerDark]}
      >
        <TextInput
          style={[styles.input, isDark && styles.inputDark]}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  containerDark: { backgroundColor: '#121212' },
  
  header: {
    paddingTop: 50, paddingBottom: 15, backgroundColor: 'white', alignItems: 'center',
    borderBottomWidth: 1, borderBottomColor: '#eee',
  },
  headerDark: { backgroundColor: '#1e1e1e', borderBottomColor: '#333' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  textLight: { color: 'white' },
  textGray: { color: '#aaa' },
  textLoading: { color: '#666' },

  listContent: { padding: 15, paddingBottom: 20 },
  messageBubble: { padding: 12, borderRadius: 20, marginBottom: 10, maxWidth: '80%' },
  
  userBubble: { backgroundColor: '#3498db', alignSelf: 'flex-end', borderBottomRightRadius: 2 },
  aiBubble: { backgroundColor: 'white', alignSelf: 'flex-start', borderBottomLeftRadius: 2, borderWidth: 1, borderColor: '#eee' },
  aiBubbleDark: { backgroundColor: '#2c2c2c', alignSelf: 'flex-start', borderBottomLeftRadius: 2, borderWidth: 1, borderColor: '#333' },
  
  messageText: { fontSize: 16 },
  userText: { color: 'white' },
  aiText: { color: '#333' },
  aiTextDark: { color: '#eee' },

  loadingContainer: { flexDirection: 'row', alignItems: 'center', marginLeft: 20, marginBottom: 10 },
  loadingText: { marginLeft: 10, fontStyle: 'italic' },

  inputContainer: {
    flexDirection: 'row', padding: 10, backgroundColor: 'white', alignItems: 'center',
    borderTopWidth: 1, borderTopColor: '#eee', paddingBottom: 30,
  },
  inputContainerDark: { backgroundColor: '#1e1e1e', borderTopColor: '#333' },
  
  input: {
    flex: 1, backgroundColor: '#f0f0f0', borderRadius: 20, paddingHorizontal: 15,
    paddingVertical: 10, fontSize: 16, marginRight: 10,
  },
  inputDark: { backgroundColor: '#333', color: 'white' },
  
  sendButton: { backgroundColor: '#3498db', padding: 10, borderRadius: 50, alignItems: 'center', justifyContent: 'center' },
});