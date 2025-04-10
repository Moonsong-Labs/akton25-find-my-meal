// Updated: AI chat service implementation
// - Updated to use new prompt endpoint
// - Simplified message handling
// - Added user ID support

import 'package:http/http.dart' as http;
import '../services/server_service.dart';

class Message {
  final String role;
  final String content;

  Message({required this.role, required this.content});

  Map<String, dynamic> toJson() => {
    'role': role,
    'content': content,
  };

  factory Message.fromJson(Map<String, dynamic> json) {
    return Message(
      role: json['role'] as String,
      content: json['content'] as String,
    );
  }
}

class AIChatService {
  final ServerService _serverService;
  final List<Message> _conversationHistory = [];
  
  AIChatService({String? userId}) : _serverService = ServerService(userId: userId);

  Future<String> processUserInput(String text) async {
    try {
      // Add user message to history
      final userMessage = Message(role: 'user', content: text);
      _conversationHistory.add(userMessage);

      // Send request to server
      final response = await _serverService.sendPrompt(text);

      if (!response.success) {
        throw Exception(response.message);
      }

      // Add AI response to history
      final assistantMessage = Message(
        role: 'assistant',
        content: response.message,
      );
      _conversationHistory.add(assistantMessage);

      return assistantMessage.content;
    } catch (e) {
      // Log the error and return a user-friendly message
      print('Error processing user input: $e');
      return 'I apologize, but I encountered an error. Please try again.';
    }
  }

  void clearConversation() {
    _conversationHistory.clear();
  }

  List<Message> get conversationHistory => List.unmodifiable(_conversationHistory);
} 