import { Ionicons } from '@expo/vector-icons';
import React, { memo, useCallback, useMemo, useState } from 'react'
import { View, TouchableOpacity, Text } from 'react-native';

export interface Pair {
  left: string;
  right: string;
}

interface MatchLessonProps {
  pairs?: Pair[];
  matchedPairs: { [key: string]: string };
  onPairMatch: (left: string, right: string) => void;
  showResult?: boolean;
  disabled?: boolean;
}

const MatchLesson = memo(function MatchLesson({
  pairs,
  matchedPairs,
  onPairMatch,
  showResult = false,
  disabled = false
}: MatchLessonProps) {

  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);

  // Memoize the shuffle arrays for consistent ordering
  const { leftItems, rightItems } = useMemo(() => {
    if (!pairs) return { leftItems: [], rightItems: [] };

    const leftItems = pairs.map(pair => pair.left);
    const rightItems = [...pairs.map(pair => pair.right)].sort(() => Math.random() - 0.5);

    return { leftItems, rightItems };
  }, [pairs]);

  // Handle left item selection
  const handleLeftSelect = useCallback((left: string) => {
    if (disabled) return;

    if (selectedLeft === left) {
      setSelectedLeft(null);
    } else {
      setSelectedLeft(left);
      if (selectedRight) {
        onPairMatch(left, selectedRight);
        setSelectedLeft(null);
        setSelectedRight(null);
      }
    }
  }, [selectedLeft, selectedRight, onPairMatch, disabled]);

  // Handle right item selection
  const handleRightSelect = useCallback((right: string) => {
    if (disabled) return;

    if (selectedRight === right) {
      setSelectedRight(null);
    } else {
      setSelectedRight(right);
      if (selectedLeft) {
        onPairMatch(selectedLeft, right);
        setSelectedLeft(null);
        setSelectedRight(null);
      }
    }
  }, [selectedLeft, selectedRight, onPairMatch, disabled]);

  // Check if items are matched
  const isLeftMatched = useCallback((left: string) => {
    return Object.hasOwnProperty.call(matchedPairs, left);
  }, [matchedPairs]);

  const isRightMatched = useCallback((right: string) => {
    return Object.values(matchedPairs).includes(right);
  }, [matchedPairs]);

  // Check if pair is correctly matched
  const isPairCorrect = useCallback((left: string, right: string) => {
    if (!pairs || !showResult) return false;
    const correctPair = pairs.find(pair => pair.left === left);
    return correctPair?.right === right;
  }, [pairs, showResult]);

  return (
    <View className="gap-4">
      <Text className="text-slate-400 text-base mb-2">
        Chạm để ghép từ với nghĩa đúng
      </Text>

      {leftItems.map((left, index) => {
        const matchedRight = matchedPairs[left];
        const isMatched = isLeftMatched(left);
        const isSelected = selectedLeft === left;
        const isCorrect = matchedRight && isPairCorrect(left, matchedRight);

        return (
          <View key={index} className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => handleLeftSelect(left)}
              disabled={disabled || isMatched}
              className={`flex-1 p-4 rounded-2xl border-2 ${isMatched
                  ? showResult
                    ? isCorrect
                      ? 'border-green-400 bg-green-500/20'
                      : 'border-red-400 bg-red-500/20'
                    : 'border-blue-400 bg-blue-500/20'
                  : isSelected
                    ? 'border-blue-400 bg-blue-500/20'
                    : 'border-slate-600 bg-slate-700'
                }`}
              style={{ opacity: disabled && !isMatched ? 0.6 : 1 }}
            >
              <Text className="text-white text-lg font-medium text-center">
                {left}
              </Text>
              {isMatched && showResult && (
                <View className="absolute -top-2 -right-2">
                  <Ionicons
                    name={isCorrect ? "checkmark-circle" : "close-circle"}
                    size={24}
                    color={isCorrect ? "#22c55e" : "#ef4444"}
                  />
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleRightSelect(rightItems[index])}
              disabled={disabled || isRightMatched(rightItems[index])}
              className={`flex-1 p-4 rounded-2xl border-2 ${isRightMatched(rightItems[index])
                  ? 'border-blue-400 bg-blue-500/20'
                  : selectedRight === rightItems[index]
                    ? 'border-blue-400 bg-blue-500/20'
                    : 'border-slate-600 bg-slate-700'
                }`}
              style={{ opacity: disabled && !isRightMatched(rightItems[index]) ? 0.6 : 1 }}
            >
              <Text className="text-slate-300 text-lg font-medium text-center">
                {rightItems[index]}
              </Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
});

export default MatchLesson;
