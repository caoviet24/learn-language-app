import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, Dimensions } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { createAudioPlayer } from 'expo-audio';
import { Ionicons } from '@expo/vector-icons';
import chatBotService from '@/services/chatBotService';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Message {
 id: string;
 text: string;
  isUser: boolean;
  audioUrl?: string;
  viewMode?: 'buttons' | 'audio' | 'text'; // Control what to display
}

const { width } = Dimensions.get('window');

export default function TalkWithBotScreen() {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const flatListRef = useRef<FlatList>(null);

  // Audio state
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
 const [soundObject, setSoundObject] = useState<any | null>(null);
  const [audioPosition, setAudioPosition] = useState<number | null>(null);
  const [audioDuration, setAudioDuration] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Format time in mm:ss
  const formatTime = (millis: number | null) => {
    if (millis === null) return '0:00';
    const totalSeconds = Math.floor(millis / 100);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  useEffect(() => {
    // Cleanup audio on unmount
    return () => {
      if (soundObject) {
        soundObject.remove();
      }
    };
  }, []);

  const talkingMutation = useMutation({
    mutationFn: ({ message, language }: { message: string; language: string }) =>
      chatBotService.talkingWithMessage({ message, language }),
    onSuccess: (data) => {
      // Add bot response to messages
      const botMessage: Message = {
        id: Date.now().toString() + '-bot',
        text: data.message || 'Hello! How can I help you?',
        isUser: false,
        audioUrl: data.audio,
        viewMode: 'buttons', // Start with buttons view
      };
      setMessages(prev => [...prev, botMessage]);
    },
    onError: (error) => {
      console.error('Error talking with bot:', error);
      const errorMessage: Message = {
        id: Date.now().toString() + '-error',
        text: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        viewMode: 'text',
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  });

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString() + '-user',
      text: inputText,
      isUser: true,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    talkingMutation.mutate({
      message: inputText,
      language: 'en'
    });
  };

  const playAudio = async (audioUrl: string, messageId: string) => {
    // If already playing this audio, pause it
    if (playingAudio === audioUrl && soundObject) {
      if ('isLoaded' in soundObject.currentStatus && soundObject.currentStatus.isLoaded && soundObject.playing) {
        soundObject.pause();
        setIsPlaying(false);
      } else {
        soundObject.play();
        setIsPlaying(true);
      }
      return;
    }

    // Stop any currently playing audio
    if (soundObject) {
      soundObject.pause();
      soundObject.remove();
      setSoundObject(null);
    }

    try {
      const player = createAudioPlayer(audioUrl);
      setSoundObject(player);
      setPlayingAudio(audioUrl);
      setIsPlaying(true);
      
      player.addListener('playbackStatusUpdate', (status: any) => {
        if ('isLoaded' in status && status.isLoaded) {
          setAudioPosition(status.currentTime * 100); // Convert to milliseconds
          setAudioDuration((status.duration || 0) * 1000); // Convert to milliseconds
          
          if ('didJustFinish' in status && status.didJustFinish) {
            setPlayingAudio(null);
            setSoundObject(null);
            setIsPlaying(false);
            setAudioPosition(null);
            setAudioDuration(null);
          } else if ('isPlaying' in status && !status.isPlaying) {
            setIsPlaying(false);
          } else if ('isPlaying' in status && status.isPlaying) {
            setIsPlaying(true);
          }
        } else if ('error' in status && status.error) {
          console.error('Error with playback status:', status.error);
        }
      });
      
      player.play();
    } catch (error) {
      console.error('Error playing audio:', error);
      setPlayingAudio(null);
      setSoundObject(null);
      setIsPlaying(false);
      setAudioPosition(null);
      setAudioDuration(null);
    }
  };

  const updateMessageViewMode = (messageId: string, mode: 'buttons' | 'audio' | 'text') => {
    setMessages(prev => prev.map(msg =>
      msg.id === messageId ? { ...msg, viewMode: mode } : msg
    ));
  };

  const renderMessage = ({ item }: { item: Message }) => {
    return item.isUser ? (
      // User message
      <View className="mb-3 flex-row items-end justify-end px-2">
        <View className="max-w-[75%] bg-blue-500 rounded-2xl px-4 py-3 shadow-sm">
          <Text className="text-white text-base leading-5">{item.text}</Text>
        </View>
      </View>
    ) : (
      // Bot message
      <View className="mb-3 flex-row items-start px-2">
        <Image
          source={require('@/assets/images/react-logo.png')}
          className="w-10 h-10 rounded-full mr-2 mt-1"
        />
        <View className="flex-1 max-w-[75%]">
          {item.viewMode === 'buttons' ? (
            // Show audio and text buttons
            <View className="bg-white rounded-2xl p-4 shadow-sm">
              <Text className="text-gray-600 text-sm mb-3">Choose how to view response:</Text>
              <View className="flex-row space-x-3">
                {item.audioUrl && (
                  <TouchableOpacity
                    className="flex-1 bg-blue-500 rounded-xl py-3 px-4 flex-row items-center justify-center shadow-sm"
                    onPress={() => updateMessageViewMode(item.id, 'audio')}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="volume-high" size={20} color="#fff" />
                    <Text className="text-white font-semibold ml-2">Audio</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  className="flex-1 bg-green-500 rounded-xl py-3 px-4 flex-row items-center justify-center shadow-sm"
                  onPress={() => updateMessageViewMode(item.id, 'text')}
                  activeOpacity={0.7}
                >
                  <Ionicons name="chatbubble-ellipses" size={20} color="#fff" />
                  <Text className="text-white font-semibold ml-2">Text</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : item.viewMode === 'audio' ? (
            // Show audio player
            <View className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-4 shadow-sm">
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center flex-1">
                  <TouchableOpacity
                    className="bg-blue-500 w-12 h-12 rounded-full justify-center items-center shadow-md mr-3"
                    onPress={() => playAudio(item.audioUrl!, item.id)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={playingAudio === item.audioUrl ? 'pause' : 'play'}
                      size={24}
                      color="#fff"
                    />
                  </TouchableOpacity>
                  <View className="flex-1">
                    <Text className="text-gray-700 font-medium">Voice Response</Text>
                    <Text className="text-gray-500 text-xs">
                      {playingAudio === item.audioUrl ? 'Playing...' : 'Tap to play'}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  className="bg-gray-200 w-8 h-8 rounded-full justify-center items-center"
                  onPress={() => updateMessageViewMode(item.id, 'buttons')}
                  activeOpacity={0.7}
                >
                  <Ionicons name="close" size={16} color="#666" />
                </TouchableOpacity>
              </View>
              
              {/* Audio progress bar */}
              {audioDuration && audioPosition !== null && (
                <View className="mb-3">
                  <View className="h-1.5 bg-gray-300 rounded-full overflow-hidden">
                    <View 
                      className="h-full bg-blue-500"
                      style={{ width: `${(audioPosition / audioDuration) * 100}%` }}
                    />
                  </View>
                  <View className="flex-row justify-between text-xs text-gray-500 mt-1">
                    <Text>{formatTime(audioPosition)}</Text>
                    <Text>{formatTime(audioDuration)}</Text>
                  </View>
                </View>
              )}
              
              <TouchableOpacity
                className="bg-white rounded-lg py-2 px-3 flex-row items-center justify-center"
                onPress={() => updateMessageViewMode(item.id, 'text')}
                activeOpacity={0.7}
              >
                <Ionicons name="text" size={16} color="#3b82f6" />
                <Text className="text-blue-500 text-sm ml-1.5">View as text</Text>
              </TouchableOpacity>
            </View>
          ) : (
            // Show text content
            <View className="bg-white rounded-2xl p-4 shadow-sm">
              <Text className="text-gray-800 text-base leading-6 mb-3">{item.text}</Text>
              <View className="flex-row space-x-2">
                {item.audioUrl && (
                  <TouchableOpacity
                    className="bg-blue-100 rounded-lg py-2 px-3 flex-row items-center justify-center flex-1"
                    onPress={() => updateMessageViewMode(item.id, 'audio')}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="volume-high" size={16} color="#3b82f6" />
                    <Text className="text-blue-500 text-sm ml-1.5">Listen</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  className="bg-gray-200 rounded-lg py-2 px-3 flex-row items-center justify-center"
                  onPress={() => updateMessageViewMode(item.id, 'buttons')}
                  activeOpacity={0.7}
                >
                  <Ionicons name="close" size={16} color="#666" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
        <Text className="text-lg font-semibold text-gray-80">AI Assistant</Text>
        <Text className="text-xs text-gray-500">Always here to help</Text>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item: Message) => item.id}
        className="flex-1"
        contentContainerStyle={{ paddingVertical: 10 }}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-20">
            <Ionicons name="chatbubbles-outline" size={64} color="#cbd5e1" />
            <Text className="text-gray-400 text-base mt-4">Start a conversation</Text>
          </View>
        }
      />

      {/* Loading indicator */}
      {talkingMutation.isPending && (
        <View className="px-2 pb-2">
          <View className="flex-row items-center px-4">
            <Image
              source={require('@/assets/images/react-logo.png')}
              className="w-10 h-10 rounded-full mr-2"
            />
            <View className="bg-white rounded-2xl px-4 py-3 shadow-sm">
              <Text className="text-gray-400">Typing...</Text>
            </View>
          </View>
        </View>
      )}
      
      {/* Input area */}
      <View className="bg-white border-t border-gray-200 px-3 py-3 shadow-lg">
        <View className="flex-row items-center">
          <TextInput
            className="flex-1 border border-gray-300 rounded-full px-4 py-3 text-base bg-gray-50 mr-2"
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your message..."
            placeholderTextColor="#9ca3af"
            onSubmitEditing={handleSendMessage}
            returnKeyType="send"
            multiline={false}
          />
          <TouchableOpacity
            className="bg-blue-500 w-12 h-12 rounded-full justify-center items-center shadow-md"
            onPress={handleSendMessage}
            disabled={talkingMutation.isPending || inputText.trim() === ''}
            activeOpacity={0.7}
            style={{
              opacity: inputText.trim() === '' || talkingMutation.isPending ? 0.5 : 1
            }}
          >
            <Ionicons
              name="send"
              size={20}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}