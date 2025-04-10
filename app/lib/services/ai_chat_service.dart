// Updated: AI chat service implementation
// - Updated API request format to match curl
// - Added error handling
// - Updated message format
// - Updated system prompt to focus on Google Maps MCP query optimization

import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/env.dart';

class Message {
  final String role;
  final String content;

  Message({required this.role, required this.content});

  Map<String, dynamic> toJson() => {
    'role': role,
    'content': content,
  };
}

class AIChatService {
  final List<Message> _conversationHistory = [];
  
  // System message to guide the AI's behavior
  static const String _systemPrompt = '''
You are a helpful restaurant and location assistant. Your primary goal is to help users find the perfect place to eat or spend time, with the ultimate objective of creating an optimized query for Google Maps MCP.

When users tell you what they want, ask relevant follow-up questions to better understand their preferences, such as:
- Type of cuisine they prefer
- Price range
- Atmosphere (casual, formal, etc.)
- Special requirements (dietary restrictions, accessibility, etc.)
- Location preferences
- Time of day

Your final milestone is to create a perfect query for Google Maps MCP that will yield the best results. Keep this in mind throughout the conversation and structure your questions to gather information that will help create an optimized search query.

Be conversational and friendly, but also efficient in gathering information. Once you have enough details, provide a clear, concise query that can be used with Google Maps MCP to find the perfect match.
''';

  AIChatService() {
    // Initialize conversation with system message
    _conversationHistory.add(Message(
      role: 'system',
      content: _systemPrompt,
    ));
  }

  Future<String> processUserInput(String userInput) async {
    try {
      // Add user message to history
      _conversationHistory.add(Message(
        role: 'user',
        content: userInput,
      ));

      final response = await http.post(
        Uri.parse(Env.klusterApiEndpoint),
        headers: {
          'Authorization': 'Bearer ${Env.klusterApiKey}',
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'model': Env.klusterModel,
          'max_completion_tokens': 4000,
          'temperature': 0.6,
          'top_p': 1,
          'messages': _conversationHistory.map((m) => m.toJson()).toList(),
        }),
      );

      if (response.statusCode == 200) {
        final jsonResponse = jsonDecode(response.body);
        
        // Extract the response content based on the API response format
        final aiResponse = jsonResponse['choices'][0]['message']['content'] as String;
        
        // Add AI response to history
        _conversationHistory.add(Message(
          role: 'assistant',
          content: aiResponse,
        ));

        return aiResponse;
      } else {
        print('API Error Response: ${response.body}');
        throw Exception('Failed to get AI response: ${response.statusCode}');
      }
    } catch (e) {
      print('Error processing AI chat: $e');
      throw Exception('Error processing AI chat: $e');
    }
  }

  void clearConversation() {
    _conversationHistory.clear();
    // Reinitialize with system message
    _conversationHistory.add(Message(
      role: 'system',
      content: _systemPrompt,
    ));
  }

  List<Message> get conversationHistory => List.unmodifiable(_conversationHistory);
} 