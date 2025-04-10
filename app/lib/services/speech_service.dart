// Created: Speech service implementation
// - Added text-to-speech functionality
// - Added speech configuration
// - Added error handling

import 'package:flutter_tts/flutter_tts.dart';

class SpeechService {
  final FlutterTts _tts = FlutterTts();
  bool _isInitialized = false;

  Future<void> initialize() async {
    if (_isInitialized) return;

    try {
      await _tts.setLanguage('en-US');
      await _tts.setPitch(1.0);
      await _tts.setSpeechRate(0.9); // Slightly slower for better clarity
      await _tts.setVolume(1.0);
      _isInitialized = true;
    } catch (e) {
      print('Error initializing TTS: $e');
      rethrow;
    }
  }

  Future<void> speak(String text) async {
    if (!_isInitialized) {
      await initialize();
    }

    try {
      await _tts.stop(); // Stop any ongoing speech
      await _tts.speak(text);
    } catch (e) {
      print('Error speaking text: $e');
      rethrow;
    }
  }

  Future<void> stop() async {
    try {
      await _tts.stop();
    } catch (e) {
      print('Error stopping speech: $e');
      rethrow;
    }
  }

  void dispose() {
    _tts.stop();
  }
} 