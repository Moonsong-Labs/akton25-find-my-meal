// Created: Environment configuration
// - Added environment variables loading
// - Added server configuration
// - Added API keys configuration

import 'package:flutter_dotenv/flutter_dotenv.dart';

class Env {
  static String get modelServerUrl => 
    dotenv.env['MODEL_SERVER_URL'] ?? 'http://localhost:8000';
    
  static String get googleMapsApiKey =>
    dotenv.env['GOOGLE_MAPS_API_KEY'] ?? '';

  static Future<void> load() async {
    try {
      await dotenv.load(fileName: ".env");
    } catch (e) {
      print('Warning: .env file not found. Using default values.');
    }
  }

  static bool get isProduction =>
    const bool.fromEnvironment('dart.vm.product');
} 