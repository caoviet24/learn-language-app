import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';

interface MultipleChoiceLessonProps {
  questionData: {
    answer: string;
    options: string[];
    question: string;
    question_type: string;
    topic: string;
    word: string;
  };
  onComplete?: (isCorrect: boolean, selectedAnswer: string) => void;
  onAnswerChange?: (answer: string) => void;
  disabled?: boolean;
  showTryAgain?: boolean;
}

const MultipleChoiceLesson: React.FC<MultipleChoiceLessonProps> = ({
  questionData,
  onComplete,
  onAnswerChange,
  disabled = false,
  showTryAgain = true
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  // Animation values for each option
  const animationValues = useRef(
    questionData.options.map(() => new Animated.Value(0))
  ).current;

  const handleOptionSelect = (option: string, index: number) => {
    if (isAnswered || disabled) return;

    setSelectedOption(option);
    setIsAnswered(true);

    const isCorrect = option === questionData.answer;

    // Notify parent component immediately
    onAnswerChange?.(option);

    // Animate the selected option
    Animated.sequence([
      Animated.timing(animationValues[index], {
        toValue: isCorrect ? -15 : -10,
        duration: isCorrect ? 200 : 150,
        useNativeDriver: true,
      }),
      Animated.timing(animationValues[index], {
        toValue: 0,
        duration: isCorrect ? 200 : 150,
        useNativeDriver: true,
      }),
    ]).start();

    // Show result after animation
    setTimeout(() => {
      setShowResult(true);
      onComplete?.(isCorrect, option);
    }, 500);
  };

  const resetQuiz = () => {
    setSelectedOption(null);
    setShowResult(false);
    setIsAnswered(false);

    // Reset all animations
    animationValues.forEach(anim => anim.setValue(0));
    
    onAnswerChange?.('');
  };

  // Reset when disabled prop changes from true to false (for parent control)
  React.useEffect(() => {
    if (!disabled && showResult) {
      // Parent has enabled the component again, reset for new question
      resetQuiz();
    }
  }, [disabled]);

  const getOptionStyle = (option: string) => {
    if (!isAnswered) {
      return selectedOption === option
        ? 'border-blue-500 bg-blue-50'
        : 'border-gray-300 bg-gray-50';
    }

    const isCorrect = option === questionData.answer;
    const isSelected = option === selectedOption;

    if (showResult) {
      if (isCorrect) {
        return 'border-green-500 bg-green-50';
      } else if (isSelected && !isCorrect) {
        return 'border-red-500 bg-red-50';
      } else {
        return 'border-gray-300 bg-gray-100';
      }
    }

    if (isSelected) {
      return isCorrect
        ? 'border-green-500 bg-green-50'
        : 'border-red-500 bg-red-50';
    }

    return 'border-gray-300 bg-gray-50';
  };

  const getOptionIcon = (option: string) => {
    if (!showResult) return null;

    const isCorrect = option === questionData.answer;
    const isSelected = option === selectedOption;

    if (isCorrect) {
      return (
        <View className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
          <Text className="text-white text-sm font-bold">✓</Text>
        </View>
      );
    } else if (isSelected && !isCorrect) {
      return (
        <View className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1">
          <Text className="text-white text-sm font-bold">✗</Text>
        </View>
      );
    }

    return null;
  };

  // Render options in a responsive grid
  const renderOptionsGrid = () => {
    // Determine number of columns based on screen size and number of options
    const numOptions = questionData.options.length;
    const columns = numOptions <= 2 ? numOptions : 2;
    
    const rows = [];
    for (let i = 0; i < numOptions; i += columns) {
      const rowOptions = questionData.options.slice(i, i + columns);
      rows.push(
        <View key={i} className="flex-row gap-3 mb-3">
          {rowOptions.map((option, colIndex) => {
            const index = i + colIndex;
            return (
              <Animated.View
                key={index}
                className="flex-1"
                style={{
                  transform: [{ translateY: animationValues[index] }]
                }}
              >
                <TouchableOpacity
                  onPress={() => handleOptionSelect(option, index)}
                  disabled={isAnswered || disabled}
                  className={`p-4 rounded-xl border-2 relative min-h-[60px] justify-center items-center ${getOptionStyle(option)}`}
                  activeOpacity={0.7}
                >
                  <Text className="text-gray-800 text-base font-medium text-center" numberOfLines={2} ellipsizeMode="tail">
                    {option}
                  </Text>
                  {getOptionIcon(option)}
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      );
    }
    return rows;
  };

  return (
    <View className="flex-1 p-2 bg-white">
      {/* Header */}
      <View className="mb-8">
        <Text className="text-gray-600 text-sm uppercase tracking-wider mb-2 font-semibold">
          {questionData.topic.toUpperCase()} VOCABULARY
        </Text>
        <Text className="text-gray-900 text-2xl font-bold mb-4">
          {questionData.question}
        </Text>
        <View className="bg-blue-50 p-6 rounded-xl border border-blue-200">
          <Text className="text-blue-600 text-4xl font-bold text-center">
            {questionData.word}
          </Text>
        </View>
      </View>

      {/* Instructions */}
      <Text className="text-gray-600 text-base mb-6">
        Select the correct answer:
      </Text>

      {/* Options Grid - 2 dòng 2 cột */}
      <View className="gap-3 mb-8">
        {renderOptionsGrid()}
      </View>

      {/* Status text */}
      <View className="mt-auto">
        <Text className="text-gray-500 text-center">
          {isAnswered 
            ? (showResult ? 'Answer submitted. Please proceed.' : 'Processing your answer...')
            : 'Choose your answer from the options above'
          }
        </Text>
      </View>
    </View>
  );
};

export default MultipleChoiceLesson;