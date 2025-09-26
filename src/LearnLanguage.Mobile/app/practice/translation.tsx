import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert, TextInput } from "react-native";
import { BookOpen, GraduationCap, Languages, Check, ChevronDown } from "lucide-react-native";
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { SelectionCard, OptionButton } from '@/components/SelectionCard';
import ModalSelector from '@/components/ModalSelector';

// Define predefined topics, levels, and languages
const predefinedTopics = [
    { id: 1, name: 'common.daily_conversation', icon: '💬' },
    { id: 2, name: 'common.travel', icon: '✈️' },
    { id: 3, name: 'common.business', icon: '💼' },
    { id: 4, name: 'common.food', icon: '🍽️' },
    { id: 5, name: 'common.family', icon: '👨‍👩‍👧‍👦' },
    { id: 6, name: 'common.health', icon: '🏥' },
];

const levels = [
    { id: 1, name: 'common.beginner', level: 'A1' },
    { id: 2, name: 'common.elementary', level: 'A2' },
    { id: 3, name: 'common.intermediate', level: 'B1' },
    { id: 4, name: 'common.upper_intermediate', level: 'B2' },
    { id: 5, name: 'common.advanced', level: 'C1' },
    { id: 6, name: 'common.fluent', level: 'C2' },
];

const languages = [
    { id: 1, code: "en", flag: "🇺🇸", name: 'common.english' },
    { id: 2, code: "ja", flag: "🇯🇵", name: 'common.japanese' },
    { id: 3, code: "ko", flag: "🇰🇷", name: 'common.korean' },
    { id: 4, code: "zh", flag: "🇨🇳", name: 'common.chinese' },
    { id: 5, code: "fr", flag: "🇫🇷", name: 'common.french' },
    { id: 6, code: "de", flag: "🇩🇪", name: 'common.german' },
];

export default function TranslationSelectionScreen() {
    const { t } = useTranslation();
    const [customTopic, setCustomTopic] = useState<string>('');
    const [selectedPredefinedTopic, setSelectedPredefinedTopic] = useState<number | null>(null);
    const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
    const [selectedLanguage, setSelectedLanguage] = useState<number | null>(null);
    const [useCustomTopic, setUseCustomTopic] = useState(false);

    // Modal selector states
    const [showLevelModal, setShowLevelModal] = useState(false);
    const [showLanguageModal, setShowLanguageModal] = useState(false);

    const handleStartPractice = () => {
        const finalTopic = useCustomTopic ? customTopic.trim() : selectedPredefinedTopic;
        
        if (!finalTopic || selectedLevel === null || selectedLanguage === null) {
            Alert.alert(t('common.warning'), t('translation_selection.please_select_all'));
            return;
        }

        // In a real app, you would navigate to the translation practice screen with the selected options
        console.log('Starting translation practice with:', {
            topic: useCustomTopic ? customTopic : predefinedTopics.find(t => t.id === selectedPredefinedTopic)?.name,
            level: levels.find(l => l.id === selectedLevel)?.level,
            language: languages.find(l => l.id === selectedLanguage)?.code
        });

        // Navigate back to practice or to the actual translation practice screen
        router.back();
    };

    return (
        <ScrollView className="flex-1 bg-gray-50">
            {/* Header with gradient background */}
            <ExpoLinearGradient
                colors={['#667eea', '#764ba2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="px-4 pt-12 pb-8 rounded-b-3xl"
            >
                <Text className="text-2xl font-bold text-white mb-2 text-center">
                    {t('translation_selection.title')}
                </Text>
                <Text className="text-white/80 text-center mb-6">
                    {t('translation_selection.subtitle')}
                </Text>
            </ExpoLinearGradient>

            {/* Selection Options */}
            <View className="p-4 mt-6">
                {/* Topic Selection */}
                <SelectionCard
                    title={t('translation_selection.topic_title')}
                    subtitle={t('translation_selection.topic_subtitle')}
                    icon={BookOpen}
                >
                    {/* Toggle between custom and predefined topics */}
                    <View className="flex-row mb-4">
                        <TouchableOpacity
                            onPress={() => setUseCustomTopic(false)}
                            className={`flex-1 p-3 rounded-l-xl border ${!useCustomTopic 
                                ? 'bg-blue-50 border-blue-500' 
                                : 'bg-white border-gray-200'}`}
                        >
                            <Text className={`text-center font-medium ${!useCustomTopic ? 'text-blue-700' : 'text-gray-700'}`}>
                                {t('translation_selection.predefined_topics')}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setUseCustomTopic(true)}
                            className={`flex-1 p-3 rounded-r-xl border ${useCustomTopic 
                                ? 'bg-blue-50 border-blue-50' 
                                : 'bg-white border-gray-200'}`}
                        >
                            <Text className={`text-center font-medium ${useCustomTopic ? 'text-blue-700' : 'text-gray-700'}`}>
                                {t('translation_selection.custom_topic')}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {useCustomTopic ? (
                        <TextInput
                            value={customTopic}
                            onChangeText={setCustomTopic}
                            placeholder={t('translation_selection.enter_custom_topic')}
                            className="p-4 bg-white border-gray-200 rounded-xl text-gray-700"
                            multiline
                            numberOfLines={2}
                        />
                    ) : (
                        predefinedTopics.map((topic) => (
                            <OptionButton
                                key={topic.id}
                                item={topic}
                                isSelected={selectedPredefinedTopic === topic.id}
                                onPress={() => setSelectedPredefinedTopic(topic.id)}
                                type="topic"
                            />
                        ))
                    )}
                </SelectionCard>

                {/* Level Selection */}
                <SelectionCard
                    title={t('translation_selection.level_title')}
                    subtitle={t('translation_selection.level_subtitle')}
                    icon={GraduationCap}
                >
                    <TouchableOpacity
                        onPress={() => setShowLevelModal(true)}
                        className={`p-4 rounded-xl border bg-white border-gray-200 flex-row items-center justify-between`}
                    >
                        <Text className={`font-medium ${selectedLevel ? 'text-gray-700' : 'text-gray-400'}`}>
                            {selectedLevel 
                                ? `${t(levels.find(l => l.id === selectedLevel)?.name || '')} (${levels.find(l => l.id === selectedLevel)?.level || ''})`
                                : t('translation_selection.select_level')}
                        </Text>
                        <ChevronDown size={20} color="#6b7280" />
                    </TouchableOpacity>
                </SelectionCard>

                {/* Language Selection */}
                <SelectionCard
                    title={t('translation_selection.language_title')}
                    subtitle={t('translation_selection.language_subtitle')}
                    icon={Languages}
                >
                    <TouchableOpacity
                        onPress={() => setShowLanguageModal(true)}
                        className={`p-4 rounded-xl border bg-white border-gray-200 flex-row items-center justify-between`}
                    >
                        <Text className={`font-medium ${selectedLanguage ? 'text-gray-700' : 'text-gray-400'}`}>
                            {selectedLanguage 
                                ? `${languages.find(l => l.id === selectedLanguage)?.flag} ${t(languages.find(l => l.id === selectedLanguage)?.name || '')}`
                                : t('translation_selection.select_language')}
                        </Text>
                        <ChevronDown size={20} color="#6b7280" />
                    </TouchableOpacity>
                </SelectionCard>
                
                {/* Modal Selectors */}
                <ModalSelector
                    visible={showLevelModal}
                    title={t('translation_selection.level_title')}
                    options={levels}
                    selectedId={selectedLevel}
                    onClose={() => setShowLevelModal(false)}
                    onSelect={setSelectedLevel}
                    type="level"
                />
                
                <ModalSelector
                    visible={showLanguageModal}
                    title={t('translation_selection.language_title')}
                    options={languages}
                    selectedId={selectedLanguage}
                    onClose={() => setShowLanguageModal(false)}
                    onSelect={setSelectedLanguage}
                    type="language"
                />
                
                {/* Start Practice Button */}
                <TouchableOpacity
                    onPress={handleStartPractice}
                    className="mt-8 p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl items-center shadow-lg"
                >
                    <Text className="text-white text-lg font-bold">
                        {t('translation_selection.start_practice')}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}