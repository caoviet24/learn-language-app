import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from "react-native";
import { Search, Volume2, Book, Copy } from "lucide-react-native";
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import vocabularyService from "@/services/vocabulary-service";

export default function VocabularyScreen() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
 const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      Alert.alert("Vui lòng nhập từ cần tra");
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const data = await vocabularyService.search(searchTerm.trim());
      setResults(data);
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra khi tìm kiếm từ vựng");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const playAudio = (audioUrl: string) => {
    // In a real app, you would use an audio player library
    Alert.alert("Audio", `Playing: ${audioUrl}`);
  };

  const copyToClipboard = (text: string) => {
    // In a real app, you would use Clipboard API
    Alert.alert("Đã sao chép", text);
  };

  const renderPhonetics = (phonetics: any[]) => {
    return phonetics.map((phonetic, index) => (
      <View key={index} className="flex-row items-center mr-3">
        <Text className="text-gray-600 mr-1">{phonetic.text}</Text>
        {phonetic.audio && (
          <TouchableOpacity onPress={() => playAudio(phonetic.audio)}>
            <Volume2 size={16} color="#6b7280" />
          </TouchableOpacity>
        )}
      </View>
    ));
  };

  const renderMeanings = (meanings: any[]) => {
    return meanings.map((meaning, index) => (
      <View key={index} className="mb-6">
        <View className="flex-row items-center mb-3">
          <View className="bg-blue-100 px-3 py-1 rounded-full">
            <Text className="text-blue-700 font-semibold">{meaning.partOfSpeech}</Text>
          </View>
        </View>
        
        {meaning.definitions.map((definition: any, defIndex: number) => (
          <View key={defIndex} className="mb-4 pl-2">
            <Text className="text-gray-800 text-base mb-1">• {definition.definition}</Text>
            {definition.example && (
              <Text className="text-gray-600 text-sm italic ml-2">&#34;{definition.example}&#34;</Text>
            )}
          </View>
        ))}
      </View>
    ));
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <ExpoLinearGradient
        colors={['#667eea', '#764ba2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="px-4 pt-12 pb-8 rounded-b-3xl"
      >
        <Text className="text-2xl font-bold text-white mb-6 text-center">Từ điển Anh - Việt</Text>
        
        <View className="flex-row items-center bg-white/20 rounded-2xl px-4 py-3">
          <TextInput
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholder="Nhập từ cần tra cứu..."
            placeholderTextColor="#e2e8f0"
            className="flex-1 text-white placeholder:text-white/70"
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity onPress={handleSearch} className="ml-2">
            <Search size={24} color="white" />
          </TouchableOpacity>
        </View>
      </ExpoLinearGradient>

      <View className="p-4">
        {loading && (
          <View className="flex-row justify-center py-8">
            <ActivityIndicator size="large" color="#667eea" />
          </View>
        )}

        {error && (
          <View className="bg-red-50 p-4 rounded-2xl mb-4">
            <Text className="text-red-700 text-center">{error}</Text>
          </View>
        )}

        {results.length > 0 && results.map((entry, index) => (
          <View key={index} className="bg-white rounded-2xl p-5 mb-6 shadow-sm">
            <View className="flex-row justify-between items-start mb-4">
              <View>
                <View className="flex-row items-center">
                  <Text className="text-2xl font-bold text-gray-800 mr-3">{entry.word}</Text>
                  <TouchableOpacity onPress={() => copyToClipboard(entry.word)}>
                    <Copy size={18} color="#6b7280" />
                  </TouchableOpacity>
                </View>
                {entry.phonetic && (
                  <Text className="text-gray-600 mt-1">{entry.phonetic}</Text>
                )}
              </View>
            </View>

            {entry.phonetics && entry.phonetics.length > 0 && (
              <View className="flex-row flex-wrap mb-4 py-2 border-b border-gray-100">
                {renderPhonetics(entry.phonetics)}
              </View>
            )}

            {entry.origin && (
              <View className="mb-6">
                <Text className="text-gray-700 font-semibold mb-2">Nguồn gốc:</Text>
                <Text className="text-gray-600">{entry.origin}</Text>
              </View>
            )}

            <View className="mb-2">
              <Text className="text-gray-700 font-semibold mb-3">Nghĩa:</Text>
              {entry.meanings && renderMeanings(entry.meanings)}
            </View>
          </View>
        ))}

        {!loading && results.length === 0 && !error && (
          <View className="items-center py-12">
            <Book size={64} color="#cbd5e1" />
            <Text className="text-gray-400 text-lg mt-4">Nhập từ cần tra để bắt đầu</Text>
          </View>
        )}
      </View>
    </ScrollView>
 );
}