import React, { useState } from 'react';
import { Text, TouchableOpacity, View, Alert, Modal, ScrollView } from 'react-native';
import { Volume2, X } from 'lucide-react-native';
import { createAudioPlayer } from 'expo-audio';
import vocabularyService from '../services/vocabulary-service';

interface SentenceWithVoiceProps {
  sentence: string;
  targetLanguage?: string; // e.g., 'vi' for Vietnamese, 'ja' for Japanese
}

const SentenceWithVoice: React.FC<SentenceWithVoiceProps> = ({ sentence, targetLanguage = 'vi' }) => {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [wordData, setWordData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Split the sentence into words while preserving spaces and punctuation
  const words = sentence.split(/(\s+)/);

  const handleWordPress = async (word: string) => {
    // Clean the word from punctuation
    const cleanWord = word.replace(/[.,!?;:()"'[\]{}]/g, '').trim();
    
    if (!cleanWord) return;

    try {
      setIsLoading(true);
      setSelectedWord(cleanWord);
      
      // Fetch word data from vocabulary service
      const data = await vocabularyService.search(cleanWord);
      setWordData(data);
      setShowModal(true);
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Có lỗi xảy ra khi tìm kiếm từ vựng');
    } finally {
      setIsLoading(false);
    }
  };

  const playWordAudio = async () => {
    if (!wordData || !wordData[0]?.phonetics?.length) return;

    try {
      // Find the first phonetic with an audio URL
      const phoneticWithAudio = wordData[0].phonetics.find((p: any) => p.audio);
      
      if (phoneticWithAudio && phoneticWithAudio.audio) {
        const player = createAudioPlayer(phoneticWithAudio.audio);
        player.play();
      } else {
        Alert.alert('Thông báo', 'Không tìm thấy âm thanh cho từ này');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi phát âm thanh');
      console.error('Error playing audio:', error);
    }
  };

  const renderWord = (word: string, index: number) => {
    // Check if the word is just whitespace
    if (word.trim() === '') {
      return <Text key={index}>{word}</Text>;
    }

    // Clean the word from punctuation for the press handler
    const cleanWord = word.replace(/[.,!?;:()"'[\]{}]/g, '').trim();
    
    return (
      <TouchableOpacity
        key={index}
        onPress={() => handleWordPress(cleanWord)}
        style={{
          borderBottomWidth: 1,
          borderBottomColor: '#3b82f6', // blue-500
          marginHorizontal: 1,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: '500' }}>
          {word}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {words.map((word, index) => renderWord(word, index))}
      </View>

      {/* Modal for showing word details */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}>
          <View style={{
            backgroundColor: 'white',
            borderRadius: 10,
            padding: 20,
            width: '90%',
            maxHeight: '80%',
          }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 15,
            }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                {selectedWord}
              </Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <X size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {isLoading ? (
              <Text>Đang tải...</Text>
            ) : wordData && wordData[0] ? (
              <ScrollView>
                {/* Phonetics */}
                {wordData[0].phonetic && (
                  <View style={{ marginBottom: 15 }}>
                    <Text style={{ fontSize: 16, color: '#666' }}>
                      {wordData[0].phonetic}
                    </Text>
                  </View>
                )}

                {/* Audio playback */}
                {wordData[0].phonetics && wordData[0].phonetics.length > 0 && (
                  <TouchableOpacity
                    onPress={playWordAudio}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: '#3b82f6',
                      padding: 10,
                      borderRadius: 5,
                      marginBottom: 15,
                      alignSelf: 'flex-start',
                    }}
                  >
                    <Volume2 size={20} color="white" />
                    <Text style={{ color: 'white', marginLeft: 8, fontWeight: '500' }}>
                      Phát âm
                    </Text>
                  </TouchableOpacity>
                )}

                {/* Meanings */}
                {wordData[0].meanings && wordData[0].meanings.map((meaning: any, idx: number) => (
                  <View key={idx} style={{ marginBottom: 15 }}>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: '#3b82f6' }}>
                      {meaning.partOfSpeech}
                    </Text>
                    <View style={{ marginLeft: 10 }}>
                      {meaning.definitions.map((definition: any, defIdx: number) => (
                        <View key={defIdx} style={{ marginBottom: 8 }}>
                          <Text style={{ fontSize: 15 }}>
                            • {definition.definition}
                          </Text>
                          {definition.example && (
                            <Text style={{ fontSize: 14, fontStyle: 'italic', color: '#666', marginTop: 4 }}>
                              Ví dụ: {definition.example}
                            </Text>
                          )}
                        </View>
                      ))}
                    </View>
                  </View>
                ))}

                {/* Translations would go here if available */}
                {/* Currently the dictionary API doesn't provide translations, 
                    but we could potentially integrate with a translation API */}
              </ScrollView>
            ) : (
              <Text>Không tìm thấy thông tin cho từ này</Text>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SentenceWithVoice;