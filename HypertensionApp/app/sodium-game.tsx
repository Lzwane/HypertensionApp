import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getSodiumGameDataAI } from './services/ai';

export default function SodiumGameScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    loadGame();
  }, []);

  const loadGame = async () => {
    setLoading(true);
    const data = await getSodiumGameDataAI();
    setItems(data);
    setCurrentIndex(0);
    setScore(0);
    setGameOver(false);
    setLoading(false);
  };

  const handleGuess = (guess: 'High' | 'Low') => {
    const item = items[currentIndex];
    const isCorrect = item.category === guess;

    if (isCorrect) {
      setScore(prev => prev + 1);
      setFeedback('Correct! 🎉');
    } else {
      setFeedback('Wrong! ❌');
    }

    setTimeout(() => {
      setFeedback(null);
      if (currentIndex < items.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setGameOver(true);
      }
    }, 800);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#e67e22" />
        <Text style={{marginTop: 20, color: '#666'}}>Fetching tasty foods...</Text>
      </View>
    );
  }

  if (gameOver) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="ribbon" size={80} color="#e67e22" />
        <Text style={styles.header}>Game Over!</Text>
        <Text style={styles.scoreText}>You got {score} out of {items.length} right.</Text>
        <TouchableOpacity style={styles.actionBtn} onPress={() => router.back()}>
          <Text style={styles.btnText}>Back to Learn</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.outlineBtn]} onPress={loadGame}>
          <Text style={[styles.btnText, {color: '#e67e22'}]}>Play Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentItem = items[currentIndex];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sodium Sorter</Text>
      <Text style={styles.subtitle}>Is this food High or Low in sodium?</Text>

      <View style={styles.card}>
        <Text style={styles.emoji}>{currentItem.emoji}</Text>
        <Text style={styles.foodName}>{currentItem.name}</Text>
      </View>

      {feedback && (
        <Text style={[styles.feedback, feedback.includes('Correct') ? styles.correct : styles.wrong]}>
          {feedback}
        </Text>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.gameBtn, styles.highBtn]} onPress={() => handleGuess('High')}>
          <Ionicons name="alert-circle" size={24} color="white" />
          <Text style={styles.gameBtnText}>HIGH</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.gameBtn, styles.lowBtn]} onPress={() => handleGuess('Low')}>
          <Ionicons name="leaf" size={24} color="white" />
          <Text style={styles.gameBtnText}>LOW</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.progress}>{currentIndex + 1} / {items.length}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 60, paddingHorizontal: 20, alignItems: 'center' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333' },
  subtitle: { fontSize: 16, color: '#7f8c8d', marginBottom: 40 },
  
  card: {
    backgroundColor: '#fff',
    width: '100%',
    height: 250,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5,
    borderWidth: 1, borderColor: '#eee'
  },
  emoji: { fontSize: 80, marginBottom: 20 },
  foodName: { fontSize: 24, fontWeight: 'bold', color: '#2c3e50', textAlign: 'center' },

  buttonContainer: { flexDirection: 'row', gap: 20, width: '100%' },
  gameBtn: { flex: 1, padding: 20, borderRadius: 15, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 10 },
  highBtn: { backgroundColor: '#e74c3c' },
  lowBtn: { backgroundColor: '#27ae60' },
  gameBtnText: { color: 'white', fontWeight: 'bold', fontSize: 18 },

  progress: { marginTop: 40, color: '#bdc3c7', fontSize: 14 },
  
  header: { fontSize: 32, fontWeight: 'bold', marginVertical: 10, color: '#333' },
  scoreText: { fontSize: 18, color: '#666', marginBottom: 30 },
  actionBtn: { backgroundColor: '#e67e22', padding: 15, width: '100%', borderRadius: 12, alignItems: 'center', marginBottom: 10 },
  outlineBtn: { backgroundColor: 'white', borderWidth: 2, borderColor: '#e67e22' },
  btnText: { color: 'white', fontSize: 16, fontWeight: 'bold' },

  feedback: { fontSize: 24, fontWeight: 'bold', position: 'absolute', top: 180, zIndex: 10 },
  correct: { color: '#27ae60' },
  wrong: { color: '#e74c3c' },
});