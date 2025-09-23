import React, { memo, useMemo, useCallback } from 'react'
import { Text, TextInput, View, TouchableOpacity } from 'react-native'

interface FillLessonProps {
    question: string;
    value: string;
    onValueChange: (value: string) => void;
    options?: string[];
    disabled?: boolean;
}

const FillLesson = memo(function FillLesson({
    question,
    value,
    onValueChange,
    options = [],
    disabled = false
}: FillLessonProps) {

    // Tách câu hỏi thành các phần bằng regex
    const questionParts = useMemo(() => {
        return question.split(/_+/);
    }, [question]);

    const handleInputChange = useCallback((text: string) => {
        if (!disabled) {
            onValueChange(text);
        }
    }, [onValueChange, disabled]);

    const handleOptionSelect = useCallback((option: string) => {
        if (!disabled) {
            onValueChange(option);
        }
    }, [onValueChange, disabled]);

    return (
        <View className="gap-4">
            {/* Câu hỏi */}
            <View className="bg-slate-800 p-6 rounded-2xl">
                <Text className="text-white text-xl leading-relaxed flex-wrap">
                    {questionParts.map((part, index, array) => (
                        <React.Fragment key={index}>
                            <Text>{part}</Text>
                            {index < array.length - 1 && (
                                <Text className="bg-blue-500/30 px-3 py-1 rounded-lg border-2 border-blue-400 text-blue-200">
                                    {value || "____"}
                                </Text>
                            )}
                        </React.Fragment>
                    ))}
                </Text>
            </View>

            {/* Ô nhập đáp án thủ công */}
            <TextInput
                placeholder="Điền từ còn thiếu..."
                placeholderTextColor="#64748b"
                value={value}
                onChangeText={handleInputChange}
                editable={!disabled}
                className={`bg-slate-800 text-white p-5 rounded-2xl text-lg border-2 ${
                    disabled ? 'border-slate-500 opacity-60' : 'border-slate-600 focus:border-blue-400'
                }`}
            />

            {/* Các lựa chọn (options) */}
            {options.length > 0 && (
                <View className="flex-row flex-wrap gap-3">
                    {options.map((option) => (
                        <TouchableOpacity
                            key={option}
                            disabled={disabled}
                            onPress={() => handleOptionSelect(option)}
                            className={`px-4 py-2 rounded-xl border-2 ${
                                value === option
                                    ? 'bg-blue-500 border-blue-400'
                                    : 'bg-slate-700 border-slate-600'
                            }`}
                        >
                            <Text
                                className={`text-lg ${
                                    value === option ? 'text-white' : 'text-slate-200'
                                }`}
                            >
                                {option}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
});

export default FillLesson;
