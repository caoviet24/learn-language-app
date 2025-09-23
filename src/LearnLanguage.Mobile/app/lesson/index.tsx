import Input from "@/components/Input";
import FillLesson from "@/components/lessons/FillLesson";
import VocabularyLesson from "@/components/lessons/VocabularyLesson";
import TranslationLesson from "@/components/lessons/TranslationLesson";
import questionService from "@/services/question-service";
import { useMutation } from "@tanstack/react-query";
import React, { useState, useEffect, useRef } from "react";
import { View, TouchableOpacity, Text, ScrollView, Animated, Dimensions } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import MultipleChoiceLesson from "@/components/lessons/MutilpleChoice";
import NotebookDialog from "@/components/NotebookDialog";
import LottieView from "lottie-react-native";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get('window');

const questionTypes = [
  {
    en: "translation",
    vi: "dịch câu"
  },
  {
    en: "fill_in_blank",
    vi: "điền từ còn thiếu"
  },
  {
    en: "multiple_choice",
    vi: "trắc nghiệm"
  },
  {
    en: "match",
    vi: "nối từ"
  }
];
// 10 random topics for the bot to choose from
const randomTopics = [
  "Daily Life",
  "Food & Cooking",
  "Travel",
  "Technology",
  "Sports",
  "Nature",
  "Education",
  "Health & Fitness",
  "Shopping",
  "Entertainment"
];

export default function LessonScreen() {
  const [inputValue, setInputValue] = useState<string>("");
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [fillValue, setFillValue] = useState<string>("");
  const [showNotebook, setShowNotebook] = useState<boolean>(false);

  // States for lesson management
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLessonStarted, setIsLessonStarted] = useState<boolean>(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [showResult, setShowResult] = useState<boolean>(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0);
  // Loading state for translation questions
  const [isCheckingTranslation, setIsCheckingTranslation] = useState<boolean>(false);

  // Animation references
  // Remove animation references as user doesn't want animation
  const fadeInAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  // Animation references for loading section
  const spinValue = useRef(new Animated.Value(0)).current;
  const pulseValue = useRef(new Animated.Value(1)).current;

  // Generate random topic
  const getRandomTopic = () => {
    const randomIndex = Math.floor(Math.random() * randomTopics.length);
    return randomTopics[randomIndex];
  };

  // Generate random question type
  const getRandomQuestionType = () => {
    const randomIndex = Math.floor(Math.random() * questionTypes.length);
    return questionTypes[randomIndex].en;
  };

  const generateQuestionMutation = useMutation({
    mutationFn: async (questionType: string) => {
      return await questionService.generate({
        word: "",
        type_qs: questionType,
        topic: inputValue
      });
    },
    onSuccess: (data, questionType) => {
      const newQuestion = {
        ...data,
        questionType,
        index: questions.length
      };
      setQuestions(prev => [...prev, newQuestion]);
    }
  });

  const compareSentenceMutation = useMutation({
    mutationFn: async (params: { sentence1: string; sentence2: string }) => {
      return await questionService.compare(params);
    }
  });

  // Generate all 15 questions
  const generateAllQuestions = async () => {
    if (!inputValue) {
      alert("Vui lòng nhập từ để học");
      return;
    }

    // Select a random topic
    const randomTopic = getRandomTopic();
    setSelectedTopic(randomTopic);

    setQuestions([]);
    setIsLessonStarted(true);
    setCurrentQuestionIndex(0);
    setCorrectAnswersCount(0);

    // Trigger entrance animation
    triggerEntranceAnimation();

    // Generate 15 questions with random types
    for (let i = 0; i < 15; i++) {
      const randomType = getRandomQuestionType();
      try {
        await generateQuestionMutation.mutateAsync(randomType);
      } catch (error) {
        console.error(`Error generating question ${i + 1}:`, error);
      }
    }
  };

  // Entrance animation
  const triggerEntranceAnimation = () => {
    fadeInAnim.setValue(0);
    scaleAnim.setValue(0.95);

    Animated.parallel([
      Animated.timing(fadeInAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start();
  };

  // Loading animation
  const triggerLoadingAnimation = () => {
    // Spin animation for the dice emoji
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();

    // Pulse animation for the text
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, {
          toValue: 1.1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseValue, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        })
      ])
    ).start();
  };

  // Check answer function
  const checkAnswer = async () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;

    let isCorrect = false;

    switch (currentQuestion.questionType) {
      case 'translation':
        try {
          // Call the compare mutation
          await compareSentenceMutation.mutateAsync({
            sentence1: userAnswer,
            sentence2: currentQuestion.answer
          });


          isCorrect = compareSentenceMutation.data?.similarity_score > 0.85;
        } catch (error) {
          console.error("Error comparing sentences:", error);
          isCorrect = userAnswer.toLowerCase().trim() ===
            currentQuestion.answer.toLowerCase().trim();
        }
        break;
      case 'fill_in_blank':
        try {
          isCorrect = currentQuestion.answer === userAnswer;
        } catch (error) {
          console.error("Error comparing sentences:", error);
          isCorrect = userAnswer.toLowerCase().trim() ===
            currentQuestion.answer.toLowerCase().trim();
        }
        break;
      case 'multiple_choice':
        isCorrect = userAnswer === currentQuestion.answer;
        break;
      case 'match':
        try {
          const matchedPairs = JSON.parse(userAnswer);
          const correctPairs: { [key: string]: string } = {};
          if (Array.isArray(currentQuestion.answer)) {
            currentQuestion.answer.forEach((pair: { [key: string]: string }) => {
              const key = Object.keys(pair)[0];
              correctPairs[key] = pair[key];
            });
          } else {
            Object.assign(correctPairs, currentQuestion.answer);
          }

          isCorrect = Object.keys(correctPairs).length === Object.keys(matchedPairs).length &&
            Object.keys(correctPairs).every(key => matchedPairs[key] === correctPairs[key]);
        } catch (error) {
          console.error("Error checking match question:", error);
          isCorrect = false;
        }
        break;
      default:
        isCorrect = false;
    }

    setIsAnswerCorrect(isCorrect);
    setShowResult(true);

    if (isCorrect) {
      setCorrectAnswersCount(prev => prev + 1);
    }

    // No animation needed as per user request
  };

  // Slide up animation function (removed animation as per user request)
  const triggerSlideUpAnimation = () => {
    // No animation needed
  };

  // Move to next question
  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setUserAnswer("");
      setFillValue("");
      setIsAnswerCorrect(null);
      setShowResult(false);
    } else {
      alert(`🎉 Hoàn thành! Bạn đã trả lời đúng ${correctAnswersCount}/15 câu hỏi.`);
      setIsLessonStarted(false);
    }
  };

  // Try again function
  const tryAgain = () => {
    setUserAnswer("");
    setFillValue("");
    setIsAnswerCorrect(null);
    setShowResult(false);
  };

  // Reset lesson
  const resetLesson = () => {
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setIsLessonStarted(false);
    setIsAnswerCorrect(null);
    setUserAnswer("");
    setFillValue("");
    setShowResult(false);
    setCorrectAnswersCount(0);
    setSelectedTopic("");
  };

  // Handle answer completion for different question types
  const handleAnswerComplete = (isCorrect: boolean, selectedAnswer: string) => {
    setIsAnswerCorrect(isCorrect);
    setUserAnswer(selectedAnswer);
    setShowResult(true);
    if (isCorrect) {
      setCorrectAnswersCount(prev => prev + 1);
    }

    // No animation needed as per user request
  };

  const currentQuestion = questions[currentQuestionIndex];

  if (!isLessonStarted) {
    return (
      <View className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100">
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            padding: 20
          }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 justify-center">
            {/* Header Section */}
            <View className="items-center mb-8">
              <View className="bg-white rounded-full p-6 shadow-lg mb-6">

              </View>
              <Text className="text-3xl font-bold text-gray-800 text-center mb-2">
                Lingo Learning
              </Text>
            </View>

            {/* Input Card */}
            <View className="bg-white rounded-2xl p-6 shadow-xl mx-4 mb-6">
              <Text className="text-lg font-semibold text-gray-700 mb-4 text-center">
                Nhập từ chủ đề muốn học
              </Text>

              <View className="mb-6">
                <Input
                  value={inputValue}
                  onChangeText={setInputValue}
                  placeholder="Ví dụ: School, Home, Technology..."
                />
              </View>

              {/* Topic Preview */}
              <View className="bg-gray-50 rounded-xl p-4 mb-6">
                <Text className="text-sm font-medium text-gray-600 mb-2">
                  🎲 Chủ đề sẽ được chọn ngẫu nhiên từ:
                </Text>
                <View className="flex-row flex-wrap">
                  {randomTopics.slice(0, 5).map((topic, index) => (
                    <View key={index} className="bg-blue-100 rounded-full px-3 py-1 m-1">
                      <Text className="text-blue-700 text-xs font-medium">{topic}</Text>
                    </View>
                  ))}
                  <View className="bg-gray-200 rounded-full px-3 py-1 m-1">
                    <Text className="text-gray-600 text-xs">+5 more</Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                onPress={generateAllQuestions}
                className={`py-4 rounded-xl items-center shadow-sm ${generateQuestionMutation.isPending
                  ? "bg-gray-400"
                  : "bg-gradient-to-r from-blue-500 to-indigo-600"
                  }`}
                disabled={generateQuestionMutation.isPending || !inputValue.trim()}
              >
                <Text className="text-black font-bold text-lg">
                  {generateQuestionMutation.isPending ? (
                    <View className="flex-row items-center">
                      <Text>🔄 Đang tạo câu hỏi...</Text>
                    </View>
                  ) : (
                    "🚀 Bắt đầu học (15 câu)"
                  )}
                </Text>
              </TouchableOpacity>

              {generateQuestionMutation.isError && (
                <View className="mt-4 bg-red-50 rounded-xl p-3">
                  <Text className="text-red-600 text-center">
                    ❌ Lỗi: {(generateQuestionMutation.error as any)?.message}
                  </Text>
                </View>
              )}
            </View>

            {/* Features Section */}
            <View className="mx-4">
              <View className="flex-row justify-around">
                <View className="items-center flex-1 mx-2">
                  <View className="bg-green-100 rounded-full p-3 mb-2">
                    <Text className="text-2xl">🎯</Text>
                  </View>
                  <Text className="text-sm font-medium text-gray-700 text-center">
                    Chủ đề ngẫu nhiên
                  </Text>
                </View>
                <View className="items-center flex-1 mx-2">
                  <View className="bg-purple-100 rounded-full p-3 mb-2">
                    <Text className="text-2xl">⚡</Text>
                  </View>
                  <Text className="text-sm font-medium text-gray-700 text-center">
                    Học nhanh hiệu quả
                  </Text>
                </View>
                <View className="items-center flex-1 mx-2">
                  <View className="bg-yellow-100 rounded-full p-3 mb-2">
                    <Text className="text-2xl">🏆</Text>
                  </View>
                  <Text className="text-sm font-medium text-gray-700 text-center">
                    Theo dõi tiến độ
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (generateQuestionMutation.isPending && questions.length === 0) {
    // Start loading animation when this section is rendered
    triggerLoadingAnimation();

    // Interpolate spin value to degrees
    const spin = spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    });

    // Interpolate pulse value to scale
    const pulse = pulseValue;

    return (
      <View className="flex-1 justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <View className="bg-white rounded-2xl p-6 shadow-lg items-center">
          <Animated.Text
            style={{
              transform: [{ rotate: spin }],
              fontSize: 24,
              marginBottom: 16
            }}
          >
            🎲
          </Animated.Text>
          <Animated.Text
            className="text-xl font-semibold text-gray-800"
            style={{
              transform: [{ scale: pulse }]
            }}
          >
            Đang tạo câu hỏi...
          </Animated.Text>
        </View>
      </View>
    );
  }

  return (
    <Animated.View
      className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100 mt-4"
      style={{
        opacity: fadeInAnim,
        transform: [{ scale: scaleAnim }],
      }}
    >
      <View className="flex-1 p-4">
        {/* Enhanced Progress Header */}
        <View className="bg-white rounded-2xl p-4 mb-4 shadow-lg">
          <View className="flex-row justify-between items-center mb-3">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-800">
                Câu {currentQuestionIndex + 1}/15
              </Text>
              <Text className="text-sm text-gray-600">
                📚 Chủ đề: {selectedTopic}
              </Text>
            </View>
            <View className="items-center flex-row">
              <View className="bg-green-100 rounded-full px-4 py-2">
                <Text className="text-green-700 font-bold">
                  ✅ {correctAnswersCount}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowNotebook(true)}
                className="p-2 rounded-full bg-yellow-500/20"
              >
                <Ionicons name="book" size={24} color="#eab308" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Progress Bar */}
          <View className="bg-gray-200 rounded-full h-2 mb-2">
            <View
              className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full h-2"
              style={{ width: `${((currentQuestionIndex + 1) / 15) * 100}%` }}
            />
          </View>
          <Text className="text-xs text-gray-500 text-center">
            {Math.round(((currentQuestionIndex + 1) / 15) * 100)}% hoàn thành
          </Text>
        </View>

        {/* Question Card */}
        {currentQuestion && (
          <View className="bg-white rounded-2xl p-4 mb-4 shadow-lg flex-1">
            <View className="flex-row items-center mb-4">
              <View className="bg-blue-100 rounded-full px-3 py-1">
                <Text className="text-blue-700 text-xs font-medium">
                  {questionTypes.find(qt => qt.en === currentQuestion.questionType)?.vi || currentQuestion.questionType}
                </Text>
              </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {currentQuestion.questionType === 'fill_in_blank' && (
                <FillLesson
                  question={currentQuestion.question}
                  options={currentQuestion.options}
                  value={fillValue}
                  onValueChange={(value) => {
                    setFillValue(value);
                    setUserAnswer(value);
                  }}
                />
              )}

              {currentQuestion.questionType === 'translation' && (
                <TranslationLesson
                  question={currentQuestion.question}
                  value={fillValue}
                  onValueChange={(value) => {
                    setFillValue(value);
                    setUserAnswer(value);
                  }}
                />
              )}

              {currentQuestion.questionType === 'match' && (
                <VocabularyLesson
                  vocabularyData={currentQuestion}
                  onComplete={(isCompleted, correctCount, totalCount) => {
                    if (isCompleted) {
                      handleAnswerComplete(true, JSON.stringify({}));
                    }
                  }}
                  onAnswerChange={(answer) => setUserAnswer(JSON.stringify(answer))}
                  disabled={showResult}
                />
              )}

              {currentQuestion.questionType === 'multiple_choice' && (
                <MultipleChoiceLesson
                  questionData={currentQuestion}
                  onComplete={handleAnswerComplete}
                  onAnswerChange={(answer) => setUserAnswer(answer)}
                  disabled={showResult}
                  showTryAgain={false}
                />
              )}
            </ScrollView>
          </View>
        )}

        {!showResult && currentQuestion &&
          !['match', 'multiple_choice'].includes(currentQuestion.questionType) && (
            <TouchableOpacity
              onPress={() => {
                checkAnswer().catch(error => {
                  console.error("Error checking answer:", error);
                });
              }}
              className={`py-4 rounded-xl items-center shadow-sm ${!userAnswer
                ? "bg-orange-400"
                : "bg-gradient-to-r from-green-500 to-green-600"
                }`}
              disabled={!userAnswer}
            >
              <Text className="text-white font-bold text-lg">
                {compareSentenceMutation.isPending ? '🔄 Đang kiểm tra...' : '✅ Kiểm tra đáp án'}
              </Text>
            </TouchableOpacity>
          )}

        {/* Enhanced Animated Result Section */}
        {showResult && (
          <View className="mt-4">
            <View className={`rounded-2xl p-6 shadow-xl border-2 ${isAnswerCorrect
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
              }`}>
              <View className="items-center mb-4">
                <View className={`rounded-full p-4 mb-3 ${isAnswerCorrect ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                  <Text className="text-4xl">
                    {isAnswerCorrect ? '🎉' : '😔'}
                  </Text>
                </View>
                <Text className={`text-2xl font-bold mb-2 ${isAnswerCorrect ? 'text-green-600' : 'text-red-600'
                  }`}>
                  {isAnswerCorrect ? 'Xuất sắc!' : 'Chưa đúng!'}
                </Text>
                <Text className={`text-center ${isAnswerCorrect ? 'text-green-700' : 'text-red-700'
                  }`}>
                  {isAnswerCorrect
                    ? 'Bạn đã trả lời chính xác!'
                    : 'Đừng lo, hãy thử lại nhé!'
                  }
                </Text>
              </View>

              {!isAnswerCorrect && currentQuestion && (
                <View className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
                  <Text className="text-center text-gray-700 font-medium mb-2">
                    💡 Đáp án đúng:
                  </Text>
                  <Text className="text-center text-gray-800 font-bold text-lg">
                    {typeof currentQuestion.answer === 'object'
                      ? Object.entries(currentQuestion.answer).map(([key, value]) => `${key} → ${value}`).join(', ')
                      : currentQuestion.answer
                    }
                  </Text>
                </View>
              )}

              <TouchableOpacity
                onPress={isAnswerCorrect ? nextQuestion : tryAgain}
                className={`py-4 rounded-xl items-center shadow-sm ${isAnswerCorrect
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600'
                  : 'bg-gradient-to-r from-orange-500 to-orange-600'
                  }`}
              >
                <Text className="text-black font-bold text-lg">
                  {isAnswerCorrect
                    ? (currentQuestionIndex < questions.length - 1 ? '➡️ Tiếp theo' : '🏆 Hoàn thành')
                    : '🔄 Thử lại'
                  }
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Reset Button */}
        <TouchableOpacity
          onPress={resetLesson}
          className="mt-4 bg-gray-500 py-3 rounded-xl items-center shadow-sm"
        >
          <Text className="text-white font-semibold">
            🔙 Làm lại từ đầu
          </Text>
        </TouchableOpacity>
      </View>


      {showResult && isAnswerCorrect && isLessonStarted && (
        <LottieView
          source={require("../../assets/animations/fireworks.json")}
          autoPlay
          loop={false}
          style={{
            width: width,
            height: width,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: [
              { translateX: -width / 2 },
              { translateY: -width / 2 }
            ],
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Notebook Dialog */}
      <NotebookDialog
        visible={showNotebook}
        onClose={() => setShowNotebook(false)}

      />
    </Animated.View>
  );
}