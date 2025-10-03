import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import { Volume2, Send, RefreshCw, Play, Square, Pause } from 'lucide-react-native';
import { baseUrl2 } from '@/configs/baseUrl';
import { Link } from 'expo-router';

export default function TestScreen() {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [requestTime, setRequestTime] = useState<string>('');
  const [sound, setSound] = useState<any | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackStatus, setPlaybackStatus] = useState<any>(null);

  // Preset text examples
  const presetTexts = [
    'Hello world',
    'Learn English',
    'How are you today?',
    'Beautiful morning',
    'Thank you very much'
  ];

  useEffect(() => {
    return sound
      ? () => {
        console.log('Removing Sound');
        sound.remove();
      }
      : undefined;
  }, [sound]);

  const handleTextToSpeech = async () => {
    if (!inputText.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập văn bản cần chuyển đổi');
      return;
    }

    setIsLoading(true);
    setResponse(null);
    const startTime = new Date();

    try {
      const response = await fetch(`${baseUrl2}/text-to-speech`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText.trim(),
        }),
      });

      console.log('baseUrl2:', baseUrl2);

      const data = await response.json();
      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();

      if (response.ok) {
        setResponse(data);
        setRequestTime(`${duration}ms`);
        Alert.alert('Thành công', 'Đã tạo file âm thanh thành công!');
      } else {
        Alert.alert('Lỗi', data.error || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Lỗi kết nối', 'Không thể kết nối đến server. Vui lòng kiểm tra server có đang chạy không.');
    } finally {
      setIsLoading(false);
    }
  };

  const playAudio = async () => {
    if (!response?.audio) return;

    try {
      // If sound exists and finished playing, replay it
      if (sound && !isPlaying) {
        await sound.seekTo(0);
        sound.play();
        setIsPlaying(true);
        return;
      }

      // If already playing, do nothing
      if (isPlaying) return;

      // If there's already a sound loaded, stop and unload it
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }

      console.log('Loading Sound from:', response.audio);

      // Set audio mode for playback
      await setAudioModeAsync({
        allowsRecording: false,
        shouldPlayInBackground: false,
        playsInSilentMode: true,
        interruptionMode: 'mixWithOthers',
        shouldRouteThroughEarpiece: false,
      });

      const newSound = createAudioPlayer(response.audio);
      newSound.play();

      setSound(newSound);
      setIsPlaying(true);

      // Set up status listener
      newSound.addListener('playbackStatusUpdate', (status: any) => {
        setPlaybackStatus(status);
        if ('isLoaded' in status && status.isLoaded && 'didJustFinish' in status && status.didJustFinish) {
          setIsPlaying(false);
        }
      });

    } catch (error) {
      console.error('Error playing audio:', error);
      Alert.alert('Lỗi phát âm thanh', `Không thể phát âm thanh: ${error}`);
      setIsPlaying(false);
    }
  };

  const pauseAudio = async () => {
    if (sound) {
      try {
        sound.pause();
        setIsPlaying(false);
      } catch (error) {
        console.error('Error pausing audio:', error);
      }
    }
  };

  const stopAudio = async () => {
    if (sound) {
      try {
        sound.pause();
        setIsPlaying(false);
      } catch (error) {
        console.error('Error stopping audio:', error);
      }
    }
  };

  const selectPresetText = (text: string) => {
    setInputText(text);
  };

  const clearAll = () => {
    setInputText('');
    setResponse(null);
    setRequestTime('');
    if (sound) {
      sound.remove();
      setSound(null);
    }
    setIsPlaying(false);
    setPlaybackStatus(null);
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <ExpoLinearGradient
        colors={['#6366f1', '#8b5cf6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="px-6 pt-12 pb-8 rounded-b-3xl mx-4 mt-2"
      >
        <View className="flex-row items-center justify-center mb-4">
          <Volume2 size={28} color="white" />
          <Text className="text-2xl font-bold text-white ml-3">Text to Speech Test</Text>
        </View>
        <Text className="text-white/80 text-center">
          Test API chuyển đổi văn bản thành giọng nói
        </Text>
      </ExpoLinearGradient>

      {/* Input Section */}
      <View className="mx-4 mt-6">
        <View className="bg-white rounded-2xl p-6 shadow-lg">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold text-gray-800">
              Nhập văn bản cần chuyển đổi
            </Text>
            <TouchableOpacity
              onPress={clearAll}
              className="bg-gray-100 p-2 rounded-full"
            >
              <RefreshCw size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {/* Preset Texts */}
          <Text className="text-sm text-gray-600 mb-3">Văn bản mẫu:</Text>
          <View className="flex-row flex-wrap mb-4">
            {presetTexts.map((text, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => selectPresetText(text)}
                className="bg-blue-100 px-3 py-2 rounded-full mr-2 mb-2"
              >
                <Text className="text-blue-700 text-sm">{text}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Nhập văn bản tiếng Anh..."
            multiline
            className="border border-gray-300 rounded-xl p-4 text-base min-h-24 mb-4"
            textAlignVertical="top"
          />

          <TouchableOpacity
            onPress={handleTextToSpeech}
            disabled={isLoading || !inputText.trim()}
            className={`flex-row items-center justify-center py-4 rounded-xl ${isLoading || !inputText.trim()
              ? 'bg-gray-300'
              : 'bg-blue-500'
              }`}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Send size={20} color="white" />
            )}
            <Text className={`font-semibold ml-2 ${isLoading || !inputText.trim() ? 'text-gray-500' : 'text-white'
              }`}>
              {isLoading ? 'Đang xử lý...' : 'Gửi yêu cầu'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Response Section */}
      {response && (
        <View className="mx-4 mt-6">
          <View className="bg-white rounded-2xl p-6 shadow-lg">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-semibold text-gray-800">
                Kết quả
              </Text>
              {requestTime && (
                <View className="bg-green-100 px-3 py-1 rounded-full">
                  <Text className="text-green-700 text-sm font-medium">
                    {requestTime}
                  </Text>
                </View>
              )}
            </View>

            {/* Audio Player Controls */}
            <View className="bg-purple-50 rounded-2xl p-4 mb-4">
              <Text className="text-sm font-medium text-purple-800 mb-3">
                🎵 Audio Player
              </Text>

              <View className="flex-row space-x-3 mb-3">
                <TouchableOpacity
                  onPress={playAudio}
                  disabled={!response.audio || isPlaying}
                  className={`flex-1 flex-row items-center justify-center py-3 rounded-xl ${!response.audio || isPlaying ? 'bg-gray-300' : 'bg-green-500'
                    }`}
                >
                  <Play size={20} color={!response.audio || isPlaying ? '#9ca3af' : 'white'} />
                  <Text className={`font-semibold ml-2 ${!response.audio || isPlaying ? 'text-gray-500' : 'text-white'
                    }`}>
                    Phát
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={pauseAudio}
                  disabled={!isPlaying}
                  className={`flex-1 flex-row items-center justify-center py-3 rounded-xl ${!isPlaying ? 'bg-gray-300' : 'bg-yellow-500'
                    }`}
                >
                  <Pause size={20} color={!isPlaying ? '#9ca3af' : 'white'} />
                  <Text className={`font-semibold ml-2 ${!isPlaying ? 'text-gray-500' : 'text-white'
                    }`}>
                    Tạm dừng
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={stopAudio}
                  disabled={!sound}
                  className={`flex-1 flex-row items-center justify-center py-3 rounded-xl ${!sound ? 'bg-gray-300' : 'bg-red-500'
                    }`}
                >
                  <Square size={20} color={!sound ? '#9ca3af' : 'white'} />
                  <Text className={`font-semibold ml-2 ${!sound ? 'text-gray-500' : 'text-white'
                    }`}>
                    Dừng
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Playback Status */}
              {playbackStatus && playbackStatus.isLoaded && (
                <View className="bg-white rounded-lg p-3">
                  <Text className="text-xs text-gray-600">
                    Trạng thái: {isPlaying ? '▶️ Đang phát' : '⏸️ Đã tạm dừng'}
                  </Text>
                  {playbackStatus.durationMillis && (
                    <Text className="text-xs text-gray-600">
                      Thời lượng: {Math.round(playbackStatus.durationMillis / 1000)}s
                    </Text>
                  )}
                </View>
              )}
            </View>

            {/* Audio URL */}
            <View className="bg-green-50 rounded-xl p-4 mb-4">
              <Text className="text-sm font-medium text-green-800 mb-2">
                Audio URL được tạo:
              </Text>
              <View className="bg-white rounded-lg p-3 border border-green-200">
                <Text className="text-sm text-green-700" numberOfLines={3}>
                  {response.audio}
                </Text>
              </View>
              <Text className="text-xs text-green-600 mt-2">
                Sử dụng trình phát ở trên để nghe âm thanh
              </Text>
            </View>

            {/* Status */}
            <View className="bg-yellow-50 rounded-xl p-4">
              <View className="flex-row items-center">
                <View className="w-3 h-3 bg-green-500 rounded-full mr-3" />
                <Text className="text-sm text-yellow-800 font-medium">
                  ✅ API hoạt động thành công
                </Text>
              </View>
              <Text className="text-xs text-yellow-700 mt-2">
                Server đã tạo file âm thanh và trả về URL. 
                Âm thanh được phát trực tiếp trong app bằng Expo Audio.
              </Text>
            </View>
          </View>
        </View>
      )}

      <View className="mx-4 my-6">
        <Link href="/talk-with-bot">
          <Text className="text-blue-600 text-base font-medium text-center">
            ← Quay lại trang chủ
          </Text>
        </Link>
      </View>

    </ScrollView>
  );
}