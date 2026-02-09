import React, { useRef } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import { Video } from 'expo-av';
import { useTheme } from '../context/ThemeContext';

export default function VideoPlayerScreen({ navigation }: any) {
  const { colors } = useTheme();
  const videoRef = useRef<Video | null>(null);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.backText, { color: colors.primary }]}>Voltar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.videoWrapper}>
        <Video
          ref={videoRef}
          source={require('../../videos/video-HAYALLASLZ.webm')}
          useNativeControls
          resizeMode="contain"
          style={styles.video}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 16 },
  backText: { fontSize: 16, fontWeight: '600' },
  videoWrapper: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  video: { width: '100%', height: 320, backgroundColor: '#000' },
});
