import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import SentenceWithVoice from '@/components/SentenceWithVoice';

interface VocabularyLessonProps {
  vocabularyData: {
    answer: Record<string, string> | Array<{ [key: string]: string }>;
    options: {
      english: string[];
      vietnamese: string[];
    };
    question: string;
    question_type: string;
    topic: string;
    word: string;
  };
  onComplete?: (isCompleted: boolean, correctCount: number, totalCount: number) => void;
  onAnswerChange?: (answer: any) => void;
  disabled?: boolean;
}

const VocabularyLesson: React.FC<VocabularyLessonProps> = ({
  vocabularyData,
  onComplete,
  onAnswerChange,
  disabled = false
}) => {
  const [correctMatches, setCorrectMatches] = useState<{ [key: string]: string }>({});
  const [incorrectMatches, setIncorrectMatches] = useState<{ [key: string]: string }>({});
  const [showResult, setShowResult] = useState(false);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);

  // Check if all pairs are matched correctly and automatically show results
  useEffect(() => {
    const correctCount = Object.keys(correctMatches).length;
    // Get total count from the answer data structure
    const totalCount = Array.isArray(vocabularyData.answer)
      ? vocabularyData.answer.length
      : Object.keys(vocabularyData.answer).length;
    
    if (correctCount === totalCount && correctCount > 0) {
      setTimeout(() => {
        setShowResult(true);
        onComplete?.(true, correctCount, totalCount);
      }, 500);
    }

    // Update answer for parent component
    onAnswerChange?.(correctMatches);
  }, [correctMatches, vocabularyData.answer, vocabularyData.options.english.length, onComplete, onAnswerChange]);

  // Reset when disabled prop changes from true to false (for parent control)
  useEffect(() => {
    if (!disabled && showResult) {
      reset();
    }
  }, [disabled, showResult]);

  const reset = () => {
    setCorrectMatches({});
    setIncorrectMatches({});
    setShowResult(false);
    setSelectedLeft(null);
    setSelectedRight(null);
  };

  const handleWordPress = (word: string, isEnglish: boolean) => {
    if (disabled || showResult) return;

    if (isEnglish) {
      if (selectedLeft === word) {
        setSelectedLeft(null);
      } else {
        setSelectedLeft(word);
        if (selectedRight) {
          handlePairMatch(word, selectedRight);
        }
      }
    } else {
      if (selectedRight === word) {
        setSelectedRight(null);
      } else {
        setSelectedRight(word);
        if (selectedLeft) {
          handlePairMatch(selectedLeft, word);
        }
      }
    }
  };

  const handlePairMatch = (left: string, right: string) => {
    // Check if this match is correct
    let isCorrect = false;
    
    // Handle both data structures: Record<string, string> and Array<{[key: string]: string}>
    if (Array.isArray(vocabularyData.answer)) {
      // Array of objects format: [{key: value}, {key: value}, ...]
      isCorrect = vocabularyData.answer.some(pair => pair[left] === right);
    } else {
      // Record format: {key: value, key: value, ...}
      isCorrect = vocabularyData.answer[left] === right;
    }
    
    if (isCorrect) {
      // Add to correct matches and remove from incorrect if it was there
      setCorrectMatches(prev => ({
        ...prev,
        [left]: right
      }));
      setIncorrectMatches(prev => {
        const newIncorrect = { ...prev };
        delete newIncorrect[left];
        return newIncorrect;
      });
    } else {
      // Add to incorrect matches and remove from correct if it was there
      setIncorrectMatches(prev => ({
        ...prev,
        [left]: right
      }));
      setCorrectMatches(prev => {
        const newCorrect = { ...prev };
        delete newCorrect[left];
        return newCorrect;
      });
      
      // Clear incorrect match after animation (1 second)
      setTimeout(() => {
        setIncorrectMatches(prev => {
          const newIncorrect = { ...prev };
          delete newIncorrect[left];
          return newIncorrect;
        });
      }, 1000);
    }

    // Clear selections
    setSelectedLeft(null);
    setSelectedRight(null);
  };

  const getWordStyle = (word: string, isEnglish: boolean) => {
    const isSelected = isEnglish ? selectedLeft === word : selectedRight === word;
    const isCorrectlyMatched = isEnglish ? correctMatches[word] : Object.values(correctMatches).includes(word);
    const isIncorrectlyMatched = isEnglish ? incorrectMatches[word] : Object.values(incorrectMatches).includes(word);

    let baseStyle = "p-4 rounded-xl border-2 m-1 min-h-[60px] justify-center items-center";
    
    if (isCorrectlyMatched) {
      return `${baseStyle} bg-green-500/20 border-green-400`;
    } else if (isIncorrectlyMatched) {
      return `${baseStyle} bg-red-500/20 border-red-400`;
    } else if (isSelected) {
      return `${baseStyle} bg-blue-500/20 border-blue-400`;
    } else {
      return `${baseStyle} bg-slate-700 border-slate-600`;
    }
  };

  const getTotalMatches = () => {
    return Object.keys(correctMatches).length + Object.keys(incorrectMatches).length;
  };

  const getAvailableWords = (words: string[], isEnglish: boolean) => {
    return words.filter(word => {
      if (isEnglish) {
        return !correctMatches[word];
      } else {
        return !Object.values(correctMatches).includes(word);
      }
    });
  };

  return (
    <View className="flex-1 p-4 bg-slate-900">
      <View className="mb-6">
        <SentenceWithVoice sentence={vocabularyData.question} />
      </View>

      <View className="flex-row justify-between mb-4">
        {/* English Words Column */}
        <View className="flex-1 mr-2">
          <Text className="text-slate-400 text-lg font-semibold mb-4 text-center">
            English
          </Text>
          {vocabularyData.options.english.map((word, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleWordPress(word, true)}
              disabled={disabled || showResult || !!correctMatches[word]}
              className={getWordStyle(word, true)}
              activeOpacity={0.7}
            >
              <Text className="text-white text-center font-medium">
                {word}
              </Text>
              {correctMatches[word] && (
                <View className="absolute -top-2 -right-2 bg-green-400 rounded-full p-1">
                  <Text className="text-white text-xs font-bold">✓</Text>
                </View>
              )}
              {incorrectMatches[word] && (
                <View className="absolute -top-2 -right-2 bg-red-400 rounded-full p-1">
                  <Text className="text-white text-xs font-bold">✗</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Vietnamese Words Column */}
        <View className="flex-1 ml-2">
          <Text className="text-slate-400 text-lg font-semibold mb-4 text-center">
            Tiếng Việt
          </Text>
          {vocabularyData.options.vietnamese.map((word, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleWordPress(word, false)}
              disabled={disabled || showResult || Object.values(correctMatches).includes(word)}
              className={getWordStyle(word, false)}
              activeOpacity={0.7}
            >
              <Text className="text-white text-center font-medium">
                {word}
              </Text>
              {Object.values(correctMatches).includes(word) && (
                <View className="absolute -top-2 -right-2 bg-green-400 rounded-full p-1">
                  <Text className="text-white text-xs font-bold">✓</Text>
                </View>
              )}
              {Object.values(incorrectMatches).includes(word) && (
                <View className="absolute -top-2 -right-2 bg-red-400 rounded-full p-1">
                  <Text className="text-white text-xs font-bold">✗</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Progress and Instructions */}
      <View className="mt-8">
        {showResult ? (
          <Text className="text-center text-lg font-bold text-green-40">
            🎉 Excellent! All matches are correct!
          </Text>
        ) : getTotalMatches() > 0 ? (
          <Text className="text-slate-400 text-center">
            {`Correct matches: ${Object.keys(correctMatches).length}/${vocabularyData.options.english.length}`}
          </Text>
        ) : (
          <Text className="text-slate-400 text-center">
            Tap on words to match them. Green border means correct, red means incorrect.
          </Text>
        )}

        {/* Show current selections */}
        {(selectedLeft || selectedRight) && !showResult && (
          <View className="mt-4 p-3 bg-slate-800 rounded-lg">
            <Text className="text-slate-300 text-center">
              Selected: {selectedLeft && `"${selectedLeft}"`} {selectedLeft && selectedRight && " → "} {selectedRight && `"${selectedRight}"`}
            </Text>
            {selectedLeft && selectedRight && (
              <Text className="text-slate-400 text-sm text-center mt-1">
                Tap to confirm match
              </Text>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

export default VocabularyLesson;