import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getQuizQuestionsAI } from './services/ai';

export default function QuizScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showFact, setShowFact] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    loadGame();
  }, []);

  const loadGame = async () => {
    setLoading(true);
    const data = await getQuizQuestionsAI();
    setQuestions(data);
    setLoading(false);
    setCurrentQ(0);
    setScore(0);
    setGameOver(false);
    setShowFact(false);
  };

  const handleAnswer = (option: string) => {
    const correct = option === questions[currentQ].answer;
    if (correct) setScore(score + 1);
    setIsCorrect(correct);
    setShowFact(true);
  };

  const nextQuestion = () => {
    setShowFact(false);
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setGameOver(true);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={{marginTop: 20, color: '#666'}}>Generating new questions with AI...</Text>
      </View>
    );
  }

  if (gameOver) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="trophy" size={80} color="#f1c40f" />
        <Text style={styles.header}>Quiz Complete!</Text>
        <Text style={styles.score}>You scored {score} / {questions.length}</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Back to Learn</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.outlineBtn]} onPress={loadGame}>
          <Text style={[styles.buttonText, {color: '#3498db'}]}>Play Again (New Questions)</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const q = questions[currentQ];

  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${((currentQ + 1) / questions.length) * 100}%` }]} />
      </View>

      <Text style={styles.questionCount}>Question {currentQ + 1} of {questions.length}</Text>
      <Text style={styles.questionText}>{q.question}</Text>

      {!showFact ? (
        <View style={styles.optionsContainer}>
          {q.options.map((option: string, index: number) => (
            <TouchableOpacity 
              key={index} 
              style={styles.optionButton} 
              onPress={() => handleAnswer(option)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={[styles.feedbackCard, isCorrect ? styles.correctCard : styles.wrongCard]}>
          <View style={styles.feedbackHeader}>
            <Ionicons name={isCorrect ? "checkmark-circle" : "close-circle"} size={32} color={isCorrect ? "#27ae60" : "#c0392b"} />
            <Text style={[styles.feedbackTitle, { color: isCorrect ? "#27ae60" : "#c0392b" }]}>
              {isCorrect ? "Correct!" : "Incorrect"}
            </Text>
          </View>
          <Text style={styles.factText}>{q.fact}</Text>
          <TouchableOpacity style={styles.nextButton} onPress={nextQuestion}>
            <Text style={styles.nextButtonText}>{currentQ === questions.length - 1 ? "Finish" : "Next"}</Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60, backgroundColor: '#fff', alignItems: 'center' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 20 },
  header: { fontSize: 28, fontWeight: 'bold', marginVertical: 20, color: '#333' },
  score: { fontSize: 22, fontWeight: '600', color: '#3498db', marginBottom: 30 },
  progressBar: { height: 6, width: '100%', backgroundColor: '#eee', borderRadius: 3, marginBottom: 20 },
  progressFill: { height: '100%', backgroundColor: '#3498db', borderRadius: 3 },
  questionCount: { fontSize: 14, color: '#999', marginBottom: 10 },
  questionText: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', color: '#2c3e50', marginBottom: 30 },
  optionsContainer: { width: '100%', gap: 12 },
  optionButton: { backgroundColor: '#f8f9fa', padding: 18, borderRadius: 12, borderWidth: 1, borderColor: '#eee', alignItems: 'center' },
  optionText: { fontSize: 16, color: '#333', fontWeight: '500' },
  button: { backgroundColor: '#3498db', paddingVertical: 15, width: '100%', borderRadius: 12, alignItems: 'center', marginBottom: 10 },
  outlineBtn: { backgroundColor: 'transparent', borderWidth: 2, borderColor: '#3498db' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  feedbackCard: { width: '100%', padding: 20, borderRadius: 15, backgroundColor: '#f0f9ff', alignItems: 'center' },
  correctCard: { backgroundColor: '#e8f8f5' },
  wrongCard: { backgroundColor: '#fdedec' },
  feedbackHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 10 },
  feedbackTitle: { fontSize: 20, fontWeight: 'bold' },
  factText: { fontSize: 16, textAlign: 'center', color: '#555', marginBottom: 20 },
  nextButton: { backgroundColor: '#333', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 25, flexDirection: 'row', alignItems: 'center', gap: 10 },
  nextButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});