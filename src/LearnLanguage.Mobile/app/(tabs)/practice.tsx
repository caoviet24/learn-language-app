import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, FlatList } from "react-native";
import { ChevronRight, Languages, BookOpen, Volume2, Type, AudioLines } from "lucide-react-native";
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';

// Define language options
const languages = [
    { id: 1, code: "en", flag: "🇺🇸" },
    { id: 2, code: "ja", flag: "🇯🇵" },
    { id: 3, code: "ko", flag: "🇰🇷" },
    { id: 4, code: "zh", flag: "🇨🇳" },
    { id: 5, code: "fr", flag: "🇫🇷" },
    { id: 6, code: "de", flag: "🇩🇪" },
];

export default function PracticeScreen() {
    const { t } = useTranslation();
    const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);

    const PracticeCard = ({ mode, onPress }: any) => {
        const IconComponent = mode.icon;
        return (
            <TouchableOpacity
                onPress={onPress}
                className={`${mode.bgColor} ${mode.borderColor} border rounded-2xl p-5 mb-4 shadow-sm`}
                activeOpacity={0.7}
            >
                <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                        <View className="flex-row items-center mb-2">
                            <IconComponent size={24} color={mode.color} />
                            <Text className="text-lg font-bold text-gray-800 ml-3">{mode.title}</Text>
                        </View>
                        <Text className="text-sm text-gray-600 ml-7 mb-2">{mode.subtitle}</Text>
                        <Text className="text-sm text-gray-500 ml-7">{mode.description}</Text>
                    </View>
                    <ChevronRight size={20} color="#9ca3af" />
                </View>
            </TouchableOpacity>
        );
    };

    const handlePracticeModePress = (modeId: number) => {
          // Handle navigation to specific practice mode
          if (modeId === 1) { // Translation mode
              // Navigate to translation selection screen
              router.push('/practice/translation');
          } else {
              console.log(`Navigating to practice mode: ${modeId} for language: ${selectedLanguage.code}`);
              // In a real app, you would navigate to the specific practice screen
          }
      };

    // Get practice modes from translations
    const practiceModes = [
        {
            id: 1,
            title: t('practice_modes.translation.title'),
            subtitle: t('practice_modes.translation.subtitle'),
            description: t('practice_modes.translation.description'),
            icon: Type,
            color: "#3b82f6",
            bgColor: "bg-blue-50",
            borderColor: "border-blue-200"
        },
        {
            id: 2,
            title: t('practice_modes.listen_write.title'),
            subtitle: t('practice_modes.listen_write.subtitle'),
            description: t('practice_modes.listen_write.description'),
            icon: AudioLines,
            color: "#10b981",
            bgColor: "bg-green-50",
            borderColor: "border-green-200"
        },
        {
            id: 3,
            title: t('practice_modes.read_pronounce.title'),
            subtitle: t('practice_modes.read_pronounce.subtitle'),
            description: t('practice_modes.read_pronounce.description'),
            icon: Volume2,
            color: "#f59e0b",
            bgColor: "bg-yellow-50",
            borderColor: "border-yellow-200"
        },
        {
            id: 4,
            title: t('practice_modes.vocabulary.title'),
            subtitle: t('practice_modes.vocabulary.subtitle'),
            description: t('practice_modes.vocabulary.description'),
            icon: BookOpen,
            color: "#8b5cf6",
            bgColor: "bg-purple-50",
            borderColor: "border-purple-200"
        }
    ];

    return (
        <ScrollView className="flex-1 bg-gray-50">
            {/* Header with gradient background */}
            <ExpoLinearGradient
                colors={['#667eea', '#764ba2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="px-4 pt-12 pb-8 rounded-b-3xl"
            >
                <Text className="text-2xl font-bold text-white mb-2 text-center">{t('common.practice')}</Text>
                <Text className="text-white/80 text-center mb-6">{t('common.improve_skills')}</Text>
                
                {/* Language Selection */}
                <View className="bg-white/20 rounded-2xl p-4">
                    <View className="flex-row items-center mb-3">
                        <Languages size={20} color="white" />
                        <Text className="text-white font-semibold ml-2">{t('common.languages')}</Text>
                    </View>
                    
                    <View className="flex-row flex-wrap gap-2">
                        {languages.map((language) => (
                            <TouchableOpacity
                                key={language.id}
                                onPress={() => setSelectedLanguage(language)}
                                className={`px-4 py-2 rounded-full ${selectedLanguage.id === language.id
                                        ? 'bg-white text-purple-600'
                                        : 'bg-white/20 text-white'
                                    }`}
                            >
                                <Text className={`font-medium ${selectedLanguage.id === language.id ? 'text-purple-600' : 'text-white'
                                    }`}>
                                    {language.flag} {t(`languages.${language.code}`)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ExpoLinearGradient>

            {/* Practice Modes Section */}
            <View className="p-4 mt-6">
                <View className="flex-row items-center mb-4">
                    <BookOpen size={24} color="#6b7280" />
                    <Text className="text-xl font-bold text-gray-800 ml-2">{t('common.practice_modes')}</Text>
                </View>
                
                <Text className="text-gray-600 mb-6">
                    {t('common.select_practice_mode')}
                </Text>

                {/* Practice Modes Cards */}
                <View className="space-y-3">
                    {practiceModes.map((mode) => (
                        <PracticeCard
                            key={mode.id}
                            mode={mode}
                            onPress={() => handlePracticeModePress(mode.id)}
                        />
                    ))}
                </View>
            </View>

            {/* Quick Stats Section */}
            <View className="mx-4 mt-8 mb-6">
                <ExpoLinearGradient
                    colors={['#ffffff', '#f8fafc']}
                    className="rounded-3xl p-6 shadow-lg"
                    style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.1,
                        shadowRadius: 8,
                        elevation: 6
                    }}
                >
                    <Text className="font-bold text-xl text-gray-800 mb-4">{t('common.practice_stats')}</Text>
                    
                    <View className="flex-row justify-between">
                        <View className="items-center flex-1">
                            <ExpoLinearGradient
                                colors={['#3b82f6', '#60a5fa']}
                                className="p-3 rounded-xl mb-2 shadow-md"
                            >
                                <BookOpen size={20} color="white" />
                            </ExpoLinearGradient>
                            <Text className="text-xl font-bold text-blue-500 mb-1">24</Text>
                            <Text className="text-xs text-gray-600 text-center">{t('stats.practice_sessions')}</Text>
                        </View>

                        <View className="items-center flex-1">
                            <ExpoLinearGradient
                                colors={['#22c55e', '#4ade80']}
                                className="p-3 rounded-xl mb-2 shadow-md"
                            >
                                <Volume2 size={20} color="white" />
                            </ExpoLinearGradient>
                            <Text className="text-xl font-bold text-green-500 mb-1">18</Text>
                            <Text className="text-xs text-gray-600 text-center">{t('stats.listening_times')}</Text>
                        </View>

                        <View className="items-center flex-1">
                            <ExpoLinearGradient
                                colors={['#f59e0b', '#fbbf24']}
                                className="p-3 rounded-xl mb-2 shadow-md"
                            >
                                <Type size={20} color="white" />
                            </ExpoLinearGradient>
                            <Text className="text-xl font-bold text-yellow-500 mb-1">156</Text>
                            <Text className="text-xs text-gray-600 text-center">{t('stats.words_learned')}</Text>
                        </View>
                    </View>
                </ExpoLinearGradient>
            </View>
        </ScrollView>
    );
}