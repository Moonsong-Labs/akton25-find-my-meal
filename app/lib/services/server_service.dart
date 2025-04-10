// Updated: Server service implementation
// - Updated for specific prompt endpoint
// - Added user ID handling
// - Simplified response format

import 'dart:convert';
import 'dart:async';
import 'package:http/http.dart' as http;
import '../config/env.dart';

class ServerResponse {
  final bool success;
  final String message;
  final Map<String, dynamic>? data;

  ServerResponse({
    required this.success,
    required this.message,
    this.data,
  });

  factory ServerResponse.fromJson(Map<String, dynamic> json) {
    return ServerResponse(
      success: true,
      message: json['response'] ?? 'No response provided',
      data: json,
    );
  }

  factory ServerResponse.error(String message) {
    return ServerResponse(
      success: false,
      message: message,
    );
  }
}

class ServerService {
  final String baseUrl;
  final Duration timeout;
  final int maxRetries;
  final String userId;

  ServerService({
    String? baseUrl,
    Duration? timeout,
    int? maxRetries,
    String? userId,
  }) : baseUrl = baseUrl ?? Env.modelServerUrl,
       timeout = timeout ?? const Duration(seconds: 30),
       maxRetries = maxRetries ?? 3,
       userId = userId ?? 'default';

  Future<ServerResponse> sendPrompt(
    String message, {
    Map<String, String>? headers,
    int currentRetry = 0,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/prompt/$userId'),
        headers: {
          'Content-Type': 'application/json',
          ...?headers,
        },
        body: json.encode({
          'message': message,
        }),
      ).timeout(timeout);

      if (response.statusCode == 200) {
        return ServerResponse.fromJson(json.decode(response.body));
      } else if (response.statusCode >= 500 && currentRetry < maxRetries) {
        // Retry on server errors
        await Future.delayed(Duration(seconds: pow(2, currentRetry).toInt()));
        return sendPrompt(message, headers: headers, currentRetry: currentRetry + 1);
      } else {
        return ServerResponse.error(
          'Server error: ${response.statusCode} - ${response.body}',
        );
      }
    } catch (e) {
      if (e is TimeoutException && currentRetry < maxRetries) {
        // Retry on timeout
        await Future.delayed(Duration(seconds: pow(2, currentRetry).toInt()));
        return sendPrompt(message, headers: headers, currentRetry: currentRetry + 1);
      }
      return ServerResponse.error('Network error: ${e.toString()}');
    }
  }
} 