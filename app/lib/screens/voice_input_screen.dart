// Updated: Voice input screen implementation
// - Changed navigation to chat screen
// - Updated voice recognition handling

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../services/voice_service.dart';
import 'chat_screen.dart';

class VoiceInputScreen extends StatefulWidget {
  const VoiceInputScreen({super.key});

  @override
  State<VoiceInputScreen> createState() => _VoiceInputScreenState();
}

class _VoiceInputScreenState extends State<VoiceInputScreen> with SingleTickerProviderStateMixin {
  late AnimationController _pulseController;
  late Animation<double> _pulseAnimation;
  final VoiceService _voiceService = VoiceService();
  String _recognizedText = 'I want to eat...';
  bool _isListening = false;

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    );

    _pulseAnimation = Tween<double>(begin: 1.0, end: 1.2).animate(
      CurvedAnimation(
        parent: _pulseController,
        curve: Curves.easeInOut,
      ),
    );

    _setupVoiceRecognition();
  }

  Future<void> _setupVoiceRecognition() async {
    final hasPermission = await _voiceService.requestPermissions();
    if (!hasPermission) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Microphone permission is required to use voice input'),
          ),
        );
      }
      return;
    }

    await _voiceService.initialize();
    
    _voiceService.onResult = (text) {
      setState(() {
        _recognizedText = text;
        _isListening = false;
      });
      
      // Navigate to chat screen after a short delay
      Future.delayed(const Duration(milliseconds: 500), () {
        if (mounted) {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => ChatScreen(initialQuery: text),
            ),
          );
        }
      });
    };

    _voiceService.onListening = () {
      setState(() {
        _isListening = true;
      });
      _pulseController.repeat(reverse: true);
    };

    _voiceService.onNotListening = () {
      setState(() {
        _isListening = false;
      });
      _pulseController.stop();
      _pulseController.reset();
    };
  }

  Future<void> _startListening() async {
    setState(() {
      _recognizedText = 'Listening...';
    });
    await _voiceService.startListening();
  }

  Future<void> _stopListening() async {
    await _voiceService.stopListening();
  }

  @override
  void dispose() {
    _pulseController.dispose();
    _voiceService.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              _recognizedText,
              style: GoogleFonts.poppins(
                fontSize: 24,
                fontWeight: FontWeight.w500,
                color: Colors.black87,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 60),
            GestureDetector(
              onTapDown: (_) => _startListening(),
              onTapUp: (_) => _stopListening(),
              onTapCancel: () => _stopListening(),
              child: AnimatedBuilder(
                animation: _pulseAnimation,
                builder: (context, child) {
                  return Transform.scale(
                    scale: _isListening ? _pulseAnimation.value : 1.0,
                    child: Container(
                      width: 100,
                      height: 100,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: Colors.white,
                        boxShadow: [
                          BoxShadow(
                            color: _isListening
                                ? Colors.blue.withOpacity(0.3)
                                : Colors.black.withOpacity(0.1),
                            blurRadius: 20,
                            spreadRadius: 5,
                          ),
                        ],
                      ),
                      child: Icon(
                        Icons.mic,
                        size: 40,
                        color: _isListening ? Colors.blue : const Color(0xFF2A2A2A),
                      ),
                    ),
                  );
                },
              ),
            ),
            const SizedBox(height: 40),
            if (_isListening)
              Text(
                'Release to stop',
                style: GoogleFonts.poppins(
                  fontSize: 16,
                  color: Colors.black54,
                ),
              ),
          ],
        ),
      ),
    );
  }
} 