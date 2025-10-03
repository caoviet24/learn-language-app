import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, ActivityIndicator, Dimensions } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import questionService from '@/services/question-service';
import { useMutation } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Check, RotateCcw, BookOpen, Sparkles, Book } from 'lucide-react-native';
import Notebook from '@/components/Notebook';
import SentenceWithVoice from '@/components/SentenceWithVoice';

type Question = {
  id: string;
  question: string;
  answer: string;
  topic?: string;
};

export default function TranslationPracticeScreen() {
  const params = useLocalSearchParams();
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [questionQueue, setQuestionQueue] = useState<Question[]>([]);
  const [isLoadingNewQuestions, setIsLoadingNewQuestions] = useState<boolean>(false);
  const [isNotebookVisible, setIsNotebookVisible] = useState<boolean>(false);
  const [showSentenceVoice, setShowSentenceVoice] = useState<boolean>(true);
  // Generate questions
  const generateQuestionMutation = useMutation({
    mutationFn: async (previousQuestion: string = "") => {
      return await questionService.generateQuestion({
        word: "",
        question_type: "translation",
        topic: params.topic as string || "common.daily_conversation",
        previous_question: previousQuestion || "",
        language_in: params.language_in as string || "en",
        language_out: params.language_out as string || "vi"
      });
    },
    onError: (error) => {
      console.error('Error generating question:', error);
      Alert.alert('Error', 'Failed to generate question. Please try again.');
    }
  });

  // Compare user answer with correct answer
  const compareAnswerMutation = useMutation({
    mutationFn: async ({ userAnswer, correctAnswer }: { userAnswer: string; correctAnswer: string }) => {
      return await questionService.compare({
        sentence1: userAnswer,
        sentence2: correctAnswer
      });
    }
  });

  // Function to generate multiple questions
  const generateMultipleQuestions = async (count: number, previousQuestion: string = "") => {
    const questions: Question[] = [];
    
    for (let i = 0; i < count; i++) {
      try {
        const newQuestion = await generateQuestionMutation.mutateAsync(
          i === 0 ? previousQuestion : questions[i - 1]?.question || ""
        );
        
        questions.push({
          id: Date.now().toString() + i,
          question: newQuestion.question || newQuestion.Question || "",
          answer: newQuestion.answer || newQuestion.Answer || "",
          topic: newQuestion.topic
        });
      } catch (error) {
        console.error(`Error generating question ${i + 1}:`, error);
        // Continue generating other questions even if one fails
      }
    }
    
    return questions;
  };

  // Initialize with 2 questions at start
  useEffect(() => {
    const initializeQuestions = async () => {
      setIsLoading(true);
      
      try {
        // Check if we have initial question data from params
        let initialQuestion = null;
        if (params.questionData) {
          try {
            const initialData = JSON.parse(params.questionData as string);
            initialQuestion = {
              id: Date.now().toString(),
              question: initialData.question || initialData.Question || "",
              answer: initialData.answer || initialData.Answer || "",
              topic: initialData.topic
            };
          } catch (error) {
            console.error('Error parsing initial question data:', error);
          }
        }

        if (initialQuestion) {
          // Use initial question as current and generate 1 more for queue
          setCurrentQuestion(initialQuestion);
          const additionalQuestions = await generateMultipleQuestions(1, initialQuestion.question);
          setQuestionQueue(additionalQuestions);
        } else {
          // Generate 2 questions from scratch
          const questions = await generateMultipleQuestions(2);
          if (questions.length > 0) {
            setCurrentQuestion(questions[0]);
            setQuestionQueue(questions.slice(1));
          }
        }
      } catch (error) {
        console.error('Error initializing questions:', error);
        Alert.alert('Error', 'Failed to initialize questions. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeQuestions();
  }, []);

  const handleCheckAnswer = async () => {
    if (!currentQuestion || !userAnswer.trim()) return;

    try {
      const result = await compareAnswerMutation.mutateAsync({
        userAnswer,
        correctAnswer: currentQuestion.answer
      });

      const isCorrect = result.similarity_score > 0.85;
      setIsAnswerCorrect(isCorrect);
      setShowResult(true);
    } catch (error) {
      const isCorrect = userAnswer.trim().toLowerCase() === currentQuestion.answer.trim().toLowerCase();
      setIsAnswerCorrect(isCorrect);
      setShowResult(true);
    }
  };

  const handleNextQuestion = async () => {
    if (!currentQuestion) return;

    // Reset UI state
    setUserAnswer('');
    setIsAnswerCorrect(null);
    setShowResult(false);
    
    // If answer was correct, remove current question and load next from queue
    if (isAnswerCorrect) {
      if (questionQueue.length > 0) {
        const nextQuestion = questionQueue[0];
        setCurrentQuestion(nextQuestion);
        setQuestionQueue(prev => prev.slice(1));
        
        // Generate 2 new questions to maintain queue
        setIsLoadingNewQuestions(true);
        try {
          const newQuestions = await generateMultipleQuestions(2, nextQuestion.question);
          setQuestionQueue(prev => [...prev, ...newQuestions]);
        } catch (error) {
          console.error('Error generating new questions:', error);
        } finally {
          setIsLoadingNewQuestions(false);
        }
      } else {
        // If queue is empty, generate new questions
        setIsLoading(true);
        try {
          const newQuestions = await generateMultipleQuestions(3, currentQuestion.question);
          if (newQuestions.length > 0) {
            setCurrentQuestion(newQuestions[0]);
            setQuestionQueue(newQuestions.slice(1));
          }
        } catch (error) {
          console.error('Error generating new questions:', error);
        } finally {
          setIsLoading(false);
        }
      }
    } else {
      // If answer was wrong, move to next question without removing from queue logic
      if (questionQueue.length > 0) {
        const nextQuestion = questionQueue[0];
        setCurrentQuestion(nextQuestion);
        setQuestionQueue(prev => prev.slice(1));
        
        // Generate 1 new question to maintain queue
        setIsLoadingNewQuestions(true);
        try {
          const newQuestions = await generateMultipleQuestions(1, nextQuestion.question);
          setQuestionQueue(prev => [...prev, ...newQuestions]);
        } catch (error) {
          console.error('Error generating new question:', error);
        } finally {
          setIsLoadingNewQuestions(false);
        }
      } else {
        // If queue is empty, generate new questions
        setIsLoading(true);
        try {
          const newQuestions = await generateMultipleQuestions(2, currentQuestion.question);
          if (newQuestions.length > 0) {
            setCurrentQuestion(newQuestions[0]);
            setQuestionQueue(newQuestions.slice(1));
          }
        } catch (error) {
          console.error('Error generating new questions:', error);
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  const handleTryAgain = () => {
    setUserAnswer('');
    setIsAnswerCorrect(null);
    setShowResult(false);
  };

  const handleExit = () => {
    router.back();
  };

  if (isLoading && !currentQuestion) {
    return (
      <LinearGradient colors={['#667eea', '#764ba2']} className="flex-1">
        <View className="flex-1 justify-center items-center">
          <View className="bg-white/90 rounded-3xl p-8 items-center shadow-2xl mx-6">
            <View className="bg-indigo-100 rounded-full p-4 mb-4">
              <Sparkles size={32} color="#667eea" />
            </View>
            <ActivityIndicator size="large" color="#667eea" />
            <Text className="mt-4 text-lg text-indigo-700 font-semibold">
              Generating questions...
            </Text>
            <Text className="mt-2 text-indigo-600 text-center">
              Please wait while we prepare your practice
            </Text>
          </View>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} className="flex-1">
      <ScrollView className="flex-1 px-5 pt-5" contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* Header */}
        <View className="flex-row justify-between items-center mb-8 mt-6">
          <TouchableOpacity
            onPress={handleExit}
            className="bg-white/20 rounded-2xl p-3 shadow-lg"
            activeOpacity={0.8}
          >
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          
          <View className="items-center">
            <View className="bg-white/20 rounded-full p-2 mb-2">
              <BookOpen size={28} color="white" />
            </View>
            <Text className="text-xl font-bold text-white">
              Translation Practice
            </Text>
            {/* Show queue status */}
            <Text className="text-white/70 text-sm mt-1">
              Queue: {questionQueue.length} questions ready
              {isLoadingNewQuestions && " • Loading..."}
            </Text>
          </View>
          
          <TouchableOpacity
            onPress={() => setIsNotebookVisible(true)}
            className="bg-white/20 rounded-2xl p-3 shadow-lg"
            activeOpacity={0.8}
          >
            <Book size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Question Card */}
        <View className="bg-white rounded-3xl p-6 mb-5 shadow-lg">
          <View className="flex-row items-center mb-4">
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              className="rounded-xl p-2 mr-3"
            >
              <Text className="text-white text-sm font-bold">Q</Text>
            </LinearGradient>
            <Text className="text-indigo-600 text-lg font-bold">
              Question
            </Text>
          </View>
          
          <View className="bg-slate-50 rounded-2xl p-5 border border-slate-200 min-h-20">
            <Text className="text-lg leading-7 text-slate-700 font-medium">
              {currentQuestion?.question || "Loading question..."}
            </Text>
            <SentenceWithVoice sentence={currentQuestion?.question || ""} />
          </View>
        </View>

        {/* User Answer Input */}
        <View className="bg-white rounded-3xl p-6 mb-5 shadow-lg">
          <View className="flex-row items-center mb-4">
            <LinearGradient
              colors={['#10b981', '#059669']}
              className="rounded-xl p-2 mr-3"
            >
              <Text className="text-white text-sm font-bold">A</Text>
            </LinearGradient>
            <Text className="text-emerald-600 text-lg font-bold">
              Your Translation
            </Text>
          </View>
          
          <TextInput
            value={userAnswer}
            onChangeText={setUserAnswer}
            placeholder="Enter your translation here..."
            placeholderTextColor="#94a3b8"
            multiline
            className={`bg-slate-50 rounded-2xl p-5 min-h-32 text-base leading-6 text-slate-700 border-2 ${
              userAnswer ? 'border-emerald-400' : 'border-slate-200'
            }`}
            style={{ textAlignVertical: 'top' }}
          />
        </View>

        {/* Result Section */}
        {showResult && (
          <View className="bg-white rounded-3xl p-6 mb-5 shadow-lg">
            <View className="items-center mb-5">
              <LinearGradient
                colors={isAnswerCorrect ? ['#10b981', '#059669'] : ['#f59e0b', '#d97706']}
                className="rounded-full p-5 mb-4 shadow-lg"
              >
                <Text className="text-3xl">
                  {isAnswerCorrect ? '🎉' : '💪'}
                </Text>
              </LinearGradient>
              
              <Text className={`text-3xl font-bold mb-2 ${
                isAnswerCorrect ? 'text-emerald-600' : 'text-amber-600'
              }`}>
                {isAnswerCorrect ? 'Excellent!' : 'Keep Going!'}
              </Text>
              
              <Text className={`text-center text-base font-medium ${
                isAnswerCorrect ? 'text-emerald-700' : 'text-amber-700'
              }`}>
                {isAnswerCorrect 
                  ? 'Perfect! Your translation is spot on.' 
                  : 'Great effort! Practice makes perfect.'}
              </Text>
            </View>

            {!isAnswerCorrect && currentQuestion && (
              <LinearGradient
                colors={['#dbeafe', '#bfdbfe']}
                className="rounded-2xl p-5 mb-4 border border-blue-300"
              >
                <View className="items-center mb-3">
                  <View className="bg-blue-500 rounded-full p-2 mb-2">
                    <Sparkles size={16} color="white" />
                  </View>
                  <Text className="text-blue-700 font-bold text-base">
                    Suggested Translation
                  </Text>
                </View>
                <View className="bg-white rounded-xl p-4">
                  <Text className="text-center text-blue-800 font-semibold text-base">
                    {currentQuestion.answer}
                  </Text>
                </View>
              </LinearGradient>
            )}
          </View>
        )}

        {/* Action Buttons */}
        <View className="space-y-4">
          {!showResult ? (
            <TouchableOpacity
              onPress={handleCheckAnswer}
              disabled={!userAnswer.trim() || compareAnswerMutation.isPending}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={!userAnswer.trim() 
                  ? ['#d1d5db', '#9ca3af'] 
                  : ['#10b981', '#059669']
                }
                className="py-4 rounded-2xl items-center shadow-lg"
              >
                {compareAnswerMutation.isPending ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <View className="flex-row items-center">
                    <Check size={20} color="white" />
                    <Text className="text-white font-bold text-lg ml-2">
                      Check Answer
                    </Text>
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <View className="flex-row space-x-3">
              {!isAnswerCorrect && (
                <TouchableOpacity
                  onPress={handleTryAgain}
                  className="flex-1"
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#f59e0b', '#d97706']}
                    className="py-4 rounded-2xl items-center shadow-lg"
                  >
                    <View className="flex-row items-center">
                      <RotateCcw size={20} color="white" />
                      <Text className="text-white font-bold text-lg ml-2">
                        Try Again
                      </Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={handleNextQuestion}
                className={isAnswerCorrect ? "flex-1" : "flex-1"}
                activeOpacity={0.8}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={isLoading ? ['#d1d5db', '#9ca3af'] : ['#3b82f6', '#1d4ed8']}
                  className="py-4 rounded-2xl items-center shadow-lg"
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <View className="flex-row items-center">
                      <ArrowLeft size={20} color="white" style={{ transform: [{ rotate: '180deg' }] }} />
                      <Text className="text-white font-bold text-lg ml-2">
                        {isAnswerCorrect ? 'Next Question' : 'Skip'}
                      </Text>
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
      
      <Notebook
        visible={isNotebookVisible}
        onClose={() => setIsNotebookVisible(false)}
      />
    </LinearGradient>
  );
}