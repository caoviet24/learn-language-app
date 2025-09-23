import { Ionicons } from '@expo/vector-icons';
import React, { memo, useCallback, useMemo, useState, useRef, useEffect } from 'react'
import { View, TouchableOpacity, Text, Animated } from 'react-native';

interface MatchLessonProps {
    english: string[];
    vietnamese: string[];
    answer: Record<string, string>; 
    correctMatches?: { [key: string]: string };
    incorrectMatches?: { [key: string]: string };
    onPairMatch?: (left: string, right: string) => void;
    showResult?: boolean;
    disabled?: boolean;
}

const MatchLesson2 = memo(function MatchLesson({
    english,
    vietnamese,
    answer,
    correctMatches = {},
    incorrectMatches = {},
    onPairMatch,
    showResult = false,
    disabled = false
}: MatchLessonProps) {

    const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
    const [selectedRight, setSelectedRight] = useState<string | null>(null);
    
    // Animation values for each card
    const leftAnimations = useRef(english.map(() => new Animated.Value(0))).current;
    const rightAnimations = useRef(vietnamese.map(() => new Animated.Value(0))).current;

    // shuffle right side
    const rightItems = useMemo(() => {
        return [...vietnamese].sort(() => Math.random() - 0.5);
    }, [vietnamese]);

    // Animate cards when they become correct or incorrect
    useEffect(() => {
        // Animate correct matches
        Object.keys(correctMatches).forEach(leftWord => {
            const leftIndex = english.indexOf(leftWord);
            const rightWord = correctMatches[leftWord];
            const rightIndex = rightItems.indexOf(rightWord);
            
            if (leftIndex !== -1) {
                Animated.sequence([
                    Animated.timing(leftAnimations[leftIndex], {
                        toValue: -15,
                        duration: 200,
                        useNativeDriver: true,
                    }),
                    Animated.timing(leftAnimations[leftIndex], {
                        toValue: 0,
                        duration: 200,
                        useNativeDriver: true,
                    }),
                ]).start();
            }
            
            if (rightIndex !== -1) {
                Animated.sequence([
                    Animated.timing(rightAnimations[rightIndex], {
                        toValue: -15,
                        duration: 200,
                        useNativeDriver: true,
                    }),
                    Animated.timing(rightAnimations[rightIndex], {
                        toValue: 0,
                        duration: 200,
                        useNativeDriver: true,
                    }),
                ]).start();
            }
        });

        // Animate incorrect matches
        Object.keys(incorrectMatches).forEach(leftWord => {
            const leftIndex = english.indexOf(leftWord);
            const rightWord = incorrectMatches[leftWord];
            const rightIndex = rightItems.indexOf(rightWord);
            
            if (leftIndex !== -1) {
                Animated.sequence([
                    Animated.timing(leftAnimations[leftIndex], {
                        toValue: -10,
                        duration: 150,
                        useNativeDriver: true,
                    }),
                    Animated.timing(leftAnimations[leftIndex], {
                        toValue: 0,
                        duration: 150,
                        useNativeDriver: true,
                    }),
                ]).start();
            }
            
            if (rightIndex !== -1) {
                Animated.sequence([
                    Animated.timing(rightAnimations[rightIndex], {
                        toValue: -10,
                        duration: 150,
                        useNativeDriver: true,
                    }),
                    Animated.timing(rightAnimations[rightIndex], {
                        toValue: 0,
                        duration: 150,
                        useNativeDriver: true,
                    }),
                ]).start();
            }
        });
    }, [correctMatches, incorrectMatches, english, rightItems, leftAnimations, rightAnimations]);

    const handleLeftSelect = useCallback((left: string, index: number) => {
        if (disabled || correctMatches[left]) return; // Don't allow selecting correct matches
        
        if (selectedLeft === left) {
            setSelectedLeft(null);
        } else {
            setSelectedLeft(left);
            if (selectedRight) {
                onPairMatch?.(left, selectedRight);
                setSelectedLeft(null);
                setSelectedRight(null);
            }
        }
    }, [disabled, selectedLeft, selectedRight, onPairMatch, correctMatches]);

    const handleRightSelect = useCallback((right: string, index: number) => {
        if (disabled || Object.values(correctMatches).includes(right)) return; // Don't allow selecting correct matches
        
        if (selectedRight === right) {
            setSelectedRight(null);
        } else {
            setSelectedRight(right);
            if (selectedLeft) {
                onPairMatch?.(selectedLeft, right);
                setSelectedLeft(null);
                setSelectedRight(null);
            }
        }
    }, [disabled, selectedLeft, selectedRight, onPairMatch, correctMatches]);

    const getLeftCardStyle = useCallback((left: string) => {
        const isCorrect = correctMatches[left];
        const isIncorrect = incorrectMatches[left];
        const isSelected = selectedLeft === left;

        if (isCorrect) {
            return 'border-green-400 bg-green-500/20';
        } else if (isIncorrect) {
            return 'border-red-400 bg-red-500/20';
        } else if (isSelected) {
            return 'border-blue-400 bg-blue-500/20';
        } else {
            return 'border-slate-600 bg-slate-700';
        }
    }, [correctMatches, incorrectMatches, selectedLeft]);

    const getRightCardStyle = useCallback((right: string) => {
        const isCorrect = Object.values(correctMatches).includes(right);
        const isIncorrect = Object.values(incorrectMatches).includes(right);
        const isSelected = selectedRight === right;

        if (isCorrect) {
            return 'border-green-400 bg-green-500/20';
        } else if (isIncorrect) {
            return 'border-red-400 bg-red-500/20';
        } else if (isSelected) {
            return 'border-blue-400 bg-blue-500/20';
        } else {
            return 'border-slate-600 bg-slate-700';
        }
    }, [correctMatches, incorrectMatches, selectedRight]);

    return (
        <View className="gap-4">
            <Text className="text-slate-400 text-base mb-2">
                Ghép từ tiếng Anh với nghĩa tiếng Việt
            </Text>

            {english.map((left, index) => {
                const isCorrect = correctMatches[left];
                const isIncorrect = incorrectMatches[left];

                return (
                    <View key={index} className="flex-row gap-3">
                        {/* Left: English */}
                        <Animated.View
                            style={{ 
                                transform: [{ translateY: leftAnimations[index] }],
                                flex: 1
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => handleLeftSelect(left, index)}
                                disabled={disabled || Boolean(isCorrect)}
                                className={`p-4 rounded-2xl border-2 ${getLeftCardStyle(left)}`}
                            >
                                <Text className="text-white text-lg font-medium text-center">
                                    {left}
                                </Text>
                                {isCorrect && (
                                    <View className="absolute -top-2 -right-2">
                                        <Ionicons
                                            name="checkmark-circle"
                                            size={24}
                                            color="#22c55e"
                                        />
                                    </View>
                                )}
                                {isIncorrect && (
                                    <View className="absolute -top-2 -right-2">
                                        <Ionicons
                                            name="close-circle"
                                            size={24}
                                            color="#ef4444"
                                        />
                                    </View>
                                )}
                            </TouchableOpacity>
                        </Animated.View>

                        {/* Right: Vietnamese */}
                        <Animated.View
                            style={{ 
                                transform: [{ translateY: rightAnimations[index] }],
                                flex: 1
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => handleRightSelect(rightItems[index], index)}
                                disabled={disabled || Object.values(correctMatches).includes(rightItems[index])}
                                className={`p-4 rounded-2xl border-2 ${getRightCardStyle(rightItems[index])}`}
                            >
                                <Text className="text-slate-300 text-lg font-medium text-center">
                                    {rightItems[index]}
                                </Text>
                                {Object.values(correctMatches).includes(rightItems[index]) && (
                                    <View className="absolute -top-2 -right-2">
                                        <Ionicons
                                            name="checkmark-circle"
                                            size={24}
                                            color="#22c55e"
                                        />
                                    </View>
                                )}
                                {Object.values(incorrectMatches).includes(rightItems[index]) && (
                                    <View className="absolute -top-2 -right-2">
                                        <Ionicons
                                            name="close-circle"
                                            size={24}
                                            color="#ef4444"
                                        />
                                    </View>
                                )}
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                );
            })}
        </View>
    );
});

export default MatchLesson2;