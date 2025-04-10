// Updated: Voice service implementation
// - Replaced Whisper with native speech recognition
// - Added speech_to_text integration
// - Added permission handling

import 'package:speech_to_text/speech_to_text.dart';
import 'package:permission_handler/permission_handler.dart';

class VoiceService {
  final SpeechToText _speechToText = SpeechToText();
  bool _speechEnabled = false;
  Function(String)? onResult;
  Function()? onListening;
  Function()? onNotListening;

  Future<bool> initialize() async {
    _speechEnabled = await _speechToText.initialize(
      onStatus: (status) {
        if (status == 'listening') {
          onListening?.call();
        } else {
          onNotListening?.call();
        }
      },
      onError: (error) => print('Speech recognition error: $error'),
    );
    return _speechEnabled;
  }

  Future<bool> requestPermissions() async {
    final micStatus = await Permission.microphone.request();
    return micStatus.isGranted;
  }

  Future<void> startListening() async {
    if (!_speechEnabled) {
      _speechEnabled = await initialize();
    }

    await _speechToText.listen(
      onResult: (result) {
        if (result.finalResult) {
          onResult?.call(result.recognizedWords);
        }
      },
      listenMode: ListenMode.confirmation,
      pauseFor: const Duration(seconds: 3),
    );
  }

  Future<void> stopListening() async {
    await _speechToText.stop();
  }

  bool get isListening => _speechToText.isListening;

  void dispose() {
    _speechToText.cancel();
  }
} 