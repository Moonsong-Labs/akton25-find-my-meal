// Updated: Chat screen implementation
// - Removed text-to-speech functionality
// - Added voice input for user responses
// - Added voice service integration
// - Removed location screen navigation
// - Improved voice input responsiveness
// - Added navigation to waiting screen
// - Improved voice input button
// - Added press-and-hold mechanics
// - Added visual feedback
// - Fixed ripple animation
// - Fixed setState after dispose error
// - Added proper cleanup of voice service

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../services/ai_chat_service.dart';
import '../services/voice_service.dart';
import 'waiting_screen.dart';

class ChatScreen extends StatefulWidget {
  final String initialQuery;

  const ChatScreen({
    super.key,
    required this.initialQuery,
  });

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> with SingleTickerProviderStateMixin {
  final AIChatService _aiService = AIChatService();
  final VoiceService _voiceService = VoiceService();
  final List<Message> _messages = [];
  bool _isProcessing = false;
  bool _isReady = false;
  bool _isListening = false;
  bool _isInitialized = false;
  
  // Animation controller for the ripple effect
  late AnimationController _rippleController;
  late Animation<double> _rippleAnimation;

  @override
  void initState() {
    super.initState();
    _setupAnimations();
    _setupVoiceRecognition();
    _processInitialQuery();
  }

  void _setupAnimations() {
    _rippleController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 600),
    );

    _rippleAnimation = Tween<double>(
      begin: 1.0,
      end: 1.2,
    ).animate(CurvedAnimation(
      parent: _rippleController,
      curve: Curves.easeInOut,
    ));

    _rippleController.addStatusListener((status) {
      if (!mounted) return;
      if (status == AnimationStatus.completed) {
        _rippleController.reverse();
      } else if (status == AnimationStatus.dismissed && _isListening) {
        _rippleController.forward();
      }
    });
  }

  Future<void> _setupVoiceRecognition() async {
    if (!mounted) return;

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
      if (!mounted) return;
      if (text.trim().isNotEmpty) {
        _processUserInput(text);
      }
      _stopListening();
    };

    _voiceService.onListening = () {
      if (!mounted) return;
      setState(() {
        _isListening = true;
      });
      if (mounted) {
        _rippleController.forward();
      }
    };

    _voiceService.onNotListening = () {
      if (!mounted) return;
      _stopListening();
    };

    if (mounted) {
      setState(() {
        _isInitialized = true;
      });
    }
  }

  void _stopListening() {
    if (!mounted) return;
    setState(() {
      _isListening = false;
    });
    _rippleController.stop();
    _rippleController.reset();
  }

  Future<void> _processInitialQuery() async {
    if (!mounted) return;
    try {
      setState(() {
        _isProcessing = true;
        _messages.add(Message(
          role: 'user',
          content: widget.initialQuery,
        ));
      });

      final response = await _aiService.processUserInput(widget.initialQuery);
      
      if (mounted) {
        setState(() {
          _messages.add(Message(
            role: 'assistant',
            content: response,
          ));
          _isProcessing = false;
          _isReady = true;
        });
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e')),
        );
        setState(() {
          _isProcessing = false;
          _isReady = true;
        });
      }
    }
  }

  Future<void> _processUserInput(String text) async {
    if (!mounted) return;
    try {
      setState(() {
        _isProcessing = true;
        _messages.add(Message(
          role: 'user',
          content: text,
        ));
      });

      final response = await _aiService.processUserInput(text);
      
      if (mounted) {
        setState(() {
          _messages.add(Message(
            role: 'assistant',
            content: response,
          ));
          _isProcessing = false;
        });
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e')),
        );
        setState(() {
          _isProcessing = false;
        });
      }
    }
  }

  void _proceedToWaiting() {
    if (!mounted) return;
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => const WaitingScreen(),
      ),
    );
  }

  @override
  void dispose() {
    _rippleController.dispose();
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
        actions: [
          if (_isReady && _messages.length >= 4)
            TextButton(
              onPressed: _proceedToWaiting,
              child: Text(
                'Next',
                style: GoogleFonts.poppins(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                  color: const Color(0xFF2A2A2A),
                ),
              ),
            ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _messages.length + (_isProcessing ? 1 : 0),
              itemBuilder: (context, index) {
                if (index == _messages.length) {
                  return const Center(
                    child: Padding(
                      padding: EdgeInsets.all(16),
                      child: CircularProgressIndicator(),
                    ),
                  );
                }

                final message = _messages[index];
                final isUser = message.role == 'user';

                return Align(
                  alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 16),
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 12,
                    ),
                    decoration: BoxDecoration(
                      color: isUser
                          ? const Color(0xFF2A2A2A)
                          : Colors.grey[100],
                      borderRadius: BorderRadius.circular(20),
                    ),
                    constraints: BoxConstraints(
                      maxWidth: MediaQuery.of(context).size.width * 0.75,
                    ),
                    child: Text(
                      message.content,
                      style: GoogleFonts.poppins(
                        fontSize: 16,
                        color: isUser ? Colors.white : Colors.black87,
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
          if (_isReady && _isInitialized)
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  Text(
                    _isListening 
                      ? 'Listening... Release to send'
                      : 'Press and hold to speak',
                    style: GoogleFonts.poppins(
                      fontSize: 14,
                      color: _isListening ? Colors.red : Colors.black54,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 16),
                  GestureDetector(
                    onTapDown: (_) async {
                      if (!mounted) return;
                      setState(() {
                        _isListening = true;
                      });
                      _rippleController.repeat(reverse: true);
                      await _voiceService.startListening();
                    },
                    onTapUp: (_) async {
                      if (!mounted) return;
                      _stopListening();
                      await _voiceService.stopListening();
                    },
                    onTapCancel: () async {
                      if (!mounted) return;
                      _stopListening();
                      await _voiceService.stopListening();
                    },
                    child: AnimatedBuilder(
                      animation: _rippleAnimation,
                      builder: (context, child) {
                        return Container(
                          width: 80,
                          height: 80,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: Colors.white,
                            border: Border.all(
                              color: _isListening ? Colors.red : Colors.grey[300]!,
                              width: 2,
                            ),
                            boxShadow: [
                              BoxShadow(
                                color: _isListening 
                                  ? Colors.red.withOpacity(0.3)
                                  : Colors.grey.withOpacity(0.2),
                                blurRadius: 8,
                                spreadRadius: _isListening ? 2 : 0,
                              ),
                            ],
                          ),
                          child: Transform.scale(
                            scale: _isListening ? _rippleAnimation.value : 1.0,
                            child: Container(
                              margin: const EdgeInsets.all(8),
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: _isListening ? Colors.red : Colors.grey[200],
                              ),
                              child: Icon(
                                Icons.mic,
                                color: _isListening ? Colors.white : Colors.grey[600],
                                size: 32,
                              ),
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }
} 