// Updated: Environment configuration
// - Added flutter_dotenv integration
// - Updated API configuration

import 'package:flutter_dotenv/flutter_dotenv.dart';

class Env {
  static String get klusterApiKey => dotenv.env['KLUSTER_AI_API_KEY'] ?? '';
  
  static const String klusterApiEndpoint = 'https://api.kluster.ai/v1/chat/completions';
  static const String klusterModel = 'meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8';
} 