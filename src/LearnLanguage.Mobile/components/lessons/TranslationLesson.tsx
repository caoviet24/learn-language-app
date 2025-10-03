import React, { memo, useCallback } from 'react'
import { Text, TextInput, View } from 'react-native'
import SentenceWithVoice from '@/components/SentenceWithVoice';

interface TranslationLessonProps {
    question: string;
    value: string;
    onValueChange: (value: string) => void;
    disabled?: boolean;
}

const TranslationLesson = memo(function TranslationLesson({
    question,
    value,
    onValueChange,
    disabled = false
}: TranslationLessonProps) {

    const handleInputChange = useCallback((text: string) => {
        if (!disabled) {
            onValueChange(text);
        }
    }, [onValueChange, disabled]);

    return (
        <View className="gap-4">
            <View className="bg-slate-800 p-6 rounded-2xl">
                <SentenceWithVoice sentence={question} />
            </View>

            <TextInput
                placeholder="Nhập bản dịch tiếng Việt..."
                placeholderTextColor="#64748b"
                value={value}
                onChangeText={handleInputChange}
                editable={!disabled}
                multiline
                className={`bg-slate-800 text-white p-5 rounded-2xl text-lg border-2 ${
                    disabled ? 'border-slate-500 opacity-60' : 'border-slate-600 focus:border-blue-400'
                }`}
                style={{ minHeight: 100, textAlignVertical: 'top' }}
            />
        </View>
    );
});

export default TranslationLesson;
