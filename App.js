import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function App() {
  // React state to track how many mindful breaths the user logged today
  const [breathCount, setBreathCount] = useState(0);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* A soft skeuomorphic card using layered background, subtle border, and Android elevation */}
      <View style={styles.card}>
        <Text style={styles.badge}>MINDCARE • PHASE 1</Text>
        <Text style={styles.title}>Hello, MindCare</Text>
        <Text style={styles.subtitle}>
          You are running React Native on your real Android phone!
        </Text>

        {/* Inner recessed stat box */}
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Mindful Check-ins Today</Text>
          <Text style={styles.statValue}>{breathCount}</Text>
        </View>

        {/* Tactile button that slightly scales down when pressed */}
        <Pressable
          onPress={() => setBreathCount(breathCount + 1)}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.buttonText}>Log Quick Check-in</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,                        // Fill the entire phone screen
    backgroundColor: '#F3F0E8',     // MindCare Warm Ivory background
    alignItems: 'center',           // Center horizontally
    justifyContent: 'center',       // Center vertically
    padding: 24,
  },
  card: {
    width: '100%',
    backgroundColor: '#FAF8F3',     // Slightly lighter surface for raised depth
    borderRadius: 24,               // Smooth rounded corners
    padding: 24,
    borderWidth: 1,
    borderColor: '#FFFFFF',         // Top/outer highlight for soft skeuomorphic feel
    // Android shadow
    elevation: 8,
    // iOS shadow (good habit to keep both)
    shadowColor: '#172B40',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
  },
  badge: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: '#3C8580',               // MindCare Muted Teal
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#172B40',               // MindCare Deep Navy Blue
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: '#263442',               // MindCare Slate
    marginBottom: 20,
  },
  statBox: {
    backgroundColor: '#EAE5D9',     // Slightly darker ivory to look "pressed in"
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#DFD9CA',
  },
  statLabel: {
    fontSize: 13,
    color: '#263442',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 36,
    fontWeight: '700',
    color: '#172B40',
  },
  button: {
    backgroundColor: '#3C8580',     // Muted Teal
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#172B40',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  buttonPressed: {
    backgroundColor: '#316F6B',     // Slightly darker teal on press
    elevation: 1,                   // Lower shadow so it looks pushed inward
    transform: [{ scale: 0.98 }],   // Subtle tactile press-in effect
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});