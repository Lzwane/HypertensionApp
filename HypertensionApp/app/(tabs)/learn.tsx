import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function LearnScreen() {
  const router = useRouter();

  const tips = [
    { title: "Reduce Sodium", desc: "Aim for less than 2,300mg of sodium per day." },
    { title: "Move More", desc: "Just 30 mins of walking can lower your BP significantly." },
    { title: "Limit Caffeine", desc: "Caffeine can cause a short, but dramatic BP spike." },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Heart Health</Text>

      {/* Game Card */}
      <View style={styles.gameCard}>
        <View style={styles.gameContent}>
          <Text style={styles.gameTitle}>BP Master Quiz</Text>
          <Text style={styles.gameDesc}>Test your knowledge and earn a high score!</Text>
          <TouchableOpacity 
            style={styles.playButton} 
            onPress={() => router.push('/quiz')}
          >
            <Text style={styles.playButtonText}>Play Now</Text>
            <Ionicons name="play-circle" size={20} color="white" style={{marginLeft: 5}}/>
          </TouchableOpacity>
        </View>
        <Ionicons name="game-controller" size={80} color="rgba(255,255,255,0.2)" style={styles.gameIcon} />
      </View>

      <Text style={styles.sectionTitle}>Daily Tips</Text>
      
      {tips.map((tip, index) => (
        <View key={index} style={styles.tipCard}>
          <View style={styles.tipIcon}>
            <Ionicons name="bulb" size={24} color="#f1c40f" />
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.tipTitle}>{tip.title}</Text>
            <Text style={styles.tipDesc}>{tip.desc}</Text>
          </View>
        </View>
      ))}

      <View style={styles.infoBox}>
        <Ionicons name="information-circle" size={24} color="#2980b9" />
        <Text style={styles.infoText}>
          Hypertension is often called the "Silent Killer" because it often has no warning signs. Regular testing is key.
        </Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#f5f5f5' },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  
  // Game Card Styles
  gameCard: {
    backgroundColor: '#e67e22',
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    height: 160,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#e67e22',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  gameContent: { flex: 1, zIndex: 1 },
  gameTitle: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  gameDesc: { color: 'rgba(255,255,255,0.9)', fontSize: 14, marginVertical: 8 },
  gameIcon: { position: 'absolute', right: -10, bottom: -10 },
  playButton: {
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  playButtonText: { color: '#e67e22', fontWeight: 'bold' },

  sectionTitle: { fontSize: 20, fontWeight: '600', marginBottom: 15, color: '#333' },
  
  tipCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff9c4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  tipTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  tipDesc: { fontSize: 14, color: '#666', marginTop: 2 },

  infoBox: {
    marginTop: 20,
    backgroundColor: '#e1f5fe',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoText: { flex: 1, color: '#2980b9', fontStyle: 'italic' },
});