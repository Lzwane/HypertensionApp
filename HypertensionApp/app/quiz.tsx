import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const questions = [
  {
    question: "What is considered a normal blood pressure reading?",
    options: ["120/80", "140/90", "160/100", "90/60"],
    answer: "120/80",
    fact: "120/80 mmHg or lower is considered normal.",
  },
  {
    question: "Which food nutrient increases blood pressure the most?",
    options: ["Sugar", "Sodium (Salt)", "Protein", "Fiber"],
    answer: "Sodium (Salt)",
    fact: "Excess sodium causes the body to hold onto water, putting stress on your heart.",
  },
  {
    question: "True or False: High blood pressure always has obvious symptoms.",
    options: ["True", "False"],
    answer: "False",
    fact: "It is called the 'Silent Killer' because it usually has NO symptoms.",
  },
  {
    question: "What lifestyle change helps lower BP?",
    options: ["Smoking", "Sitting all day", "Regular Exercise", "Drinking alcohol"],
    answer: "Regular Exercise",
    fact: "150 minutes of moderate activity a week helps keep your heart strong.",
  }
];

export default function QuizScreen() {
  const router = useRouter();
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showFact, setShowFact] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameOver, setGameOver] = useState(false);

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

  if (gameOver) {
    return (
      <View style={styles.container}>
        <Ionicons name="trophy" size={80} color="#f1c40f" />
        <Text style={styles.header}>Quiz Complete!</Text>
        <Text style={styles.score}>You scored {score} / {questions.length}</Text>
        
        <Text style={styles.message}>
          {score === questions.length ? "Perfect! You are a Heart Health Expert!" : "Good job! Keep learning to stay healthy."}
        </Text>

        <TouchableOpacity style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Back to Learn</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.outlineBtn]} onPress={() => {
          setGameOver(false);
          setCurrentQ(0);
          setScore(0);
        }}>
          <Text style={[styles.buttonText, {color: '#3498db'}]}>Play Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${((currentQ + 1) / questions.length) * 100}%` }]} />
      </View>

      <Text style={styles.questionCount}>Question {currentQ + 1} of {questions.length}</Text>
      <Text style={styles.questionText}>{questions[currentQ].question}</Text>

      {!showFact ? (
        <View style={styles.optionsContainer}>
          {questions[currentQ].options.map((option, index) => (
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
            <Ionicons 
              name={isCorrect ? "checkmark-circle" : "close-circle"} 
              size={32} 
              color={isCorrect ? "#27ae60" : "#c0392b"} 
            />
            <Text style={[styles.feedbackTitle, { color: isCorrect ? "#27ae60" : "#c0392b" }]}>
              {isCorrect ? "Correct!" : "Incorrect"}
            </Text>
          </View>
          
          <Text style={styles.factText}>{questions[currentQ].fact}</Text>
          
          <TouchableOpacity style={styles.nextButton} onPress={nextQuestion}>
            <Text style={styles.nextButtonText}>
              {currentQ === questions.length - 1 ? "Finish Quiz" : "Next Question"}
            </Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60, backgroundColor: '#fff', alignItems: 'center' },
  header: { fontSize: 28, fontWeight: 'bold', marginVertical: 20, color: '#333' },
  score: { fontSize: 22, fontWeight: '600', color: '#3498db', marginBottom: 10 },
  message: { textAlign: 'center', color: '#666', marginBottom: 30, paddingHorizontal: 20 },
  
  progressBar: { height: 6, width: '100%', backgroundColor: '#eee', borderRadius: 3, marginBottom: 20 },
  progressFill: { height: '100%', backgroundColor: '#3498db', borderRadius: 3 },
  
  questionCount: { fontSize: 14, color: '#999', marginBottom: 10 },
  questionText: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: '#2c3e50', marginBottom: 40 },
  
  optionsContainer: { width: '100%', gap: 15 },
  optionButton: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
  },
  optionText: { fontSize: 18, color: '#333', fontWeight: '500' },
  
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 15,
    width: '80%',
    alignItems: 'center',
  },
  outlineBtn: { backgroundColor: 'transparent', borderWidth: 2, borderColor: '#3498db' },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },

  // Feedback Card
  feedbackCard: {
    width: '100%',
    padding: 20,
    borderRadius: 15,
    backgroundColor: '#f0f9ff',
    alignItems: 'center',
  },
  correctCard: { backgroundColor: '#e8f8f5' },
  wrongCard: { backgroundColor: '#fdedec' },
  
  feedbackHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, gap: 10 },
  feedbackTitle: { fontSize: 22, fontWeight: 'bold' },
  factText: { fontSize: 16, textAlign: 'center', color: '#555', marginBottom: 20, lineHeight: 22 },
  
  nextButton: {
    backgroundColor: '#333',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  nextButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});