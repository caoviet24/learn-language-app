

import { Ionicons } from '@expo/vector-icons';
import React, { memo, useCallback, useMemo } from 'react'
import { Text, TouchableOpacity, View } from 'react-native';
import Animated from 'react-native-reanimated';

export interface Choice {
    id: string;
    text: string;
    icon: string;
    isCorrect: boolean;
}

interface ChoiceLessonProps {
    choices?: Choice[];
    selectedChoice?: string | null;
    onChoiceSelect: (choiceId: string) => void;
    showResult?: boolean;
    disabled?: boolean;
}

const ChoiceLesson = memo(function ChoiceLesson({
    choices,
    selectedChoice,
    onChoiceSelect,
    showResult = false,
    disabled = false
}: ChoiceLessonProps) {

    // Memoize choice items to prevent unnecessary re-renders
    const choiceItems = useMemo(() => {
        if (!choices) return [];
        
        return choices.map((choice: Choice) => {
            const isSelected = selectedChoice === choice.id;
            const shouldShowResult = showResult && isSelected;
            
            return {
                ...choice,
                isSelected,
                shouldShowResult,
                className: `flex-row items-center p-5 rounded-3xl border-2 shadow-lg ${
                    isSelected
                        ? shouldShowResult
                            ? choice.isCorrect
                                ? "border-green-400 bg-green-500/20 shadow-green-400/30"
                                : "border-red-400 bg-red-500/20 shadow-red-400/30"
                            : "border-blue-400 bg-blue-500/20 shadow-blue-400/30"
                        : "border-slate-600 bg-slate-800/80 hover:bg-slate-700/80"
                }`
            };
        });
    }, [choices, selectedChoice, showResult]);

    // Memoize choice selection handler
    const handleChoiceSelect = useCallback((choiceId: string) => {
        if (!disabled) {
            onChoiceSelect(choiceId);
        }
    }, [onChoiceSelect, disabled]);

    return (
        <View className="gap-3">
            {choiceItems.map((choice) => (
                <Animated.View
                    key={choice.id}
                    style={{
                        transform: [{ scale: choice.isSelected ? 0.96 : 1 }]
                    }}
                >
                    <TouchableOpacity
                        onPress={() => handleChoiceSelect(choice.id)}
                        disabled={disabled}
                        className={choice.className}
                        style={{
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.3,
                            shadowRadius: 8,
                            elevation: 8,
                            opacity: disabled ? 0.6 : 1,
                        }}
                    >
                        <View className="bg-white/10 p-3 rounded-2xl mr-4">
                            <Text className="text-4xl">{choice.icon}</Text>
                        </View>
                        <Text className="text-white text-xl font-semibold flex-1">
                            {choice.text}
                        </Text>
                        {choice.shouldShowResult && (
                            <Ionicons
                                name={choice.isCorrect ? "checkmark-circle" : "close-circle"}
                                size={28}
                                color={choice.isCorrect ? "#22c55e" : "#ef4444"}
                            />
                        )}
                    </TouchableOpacity>
                </Animated.View>
            ))}
        </View>
    );
});

export default ChoiceLesson;
