import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import useAuth from '@/hooks/useAuth';
import { ActivityIndicator, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Flame, BookOpen, Target, Calendar, Globe } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserActivity } from '@/types';

export default function HomeScreen() {
    const { user, isLoading, isError } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user && !isLoading && isError) {
            router.replace('/login');
        } else if (user && !isLoading) {
            if (!user?.activities || user?.activities?.length === 0) {
                router.replace('/onBoarding');
            }
        }
    }, [user, isLoading, isError, router]);

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-50">
                <ActivityIndicator size="large" color="#3b82f6" />
            </View>
        );
    }

    // Don't render anything while checking auth status, or if redirecting
    if (!user || isError) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-50">
                <ActivityIndicator size="large" color="#3b82f6" />
            </View>
        );
    }

    const navigateToOnboarding = () => {
        router.push('/onBoarding');
    };

    const getLanguageFlag = (language: string) => {
        const flags: Record<string, string> = {
            'en': '🇺🇸',
            'es': '🇪🇸',
            'fr': '🇫🇷',
            'de': '🇩🇪',
            'ja': '🇯🇵',
            'ko': '🇰🇷',
            'vi': '🇻🇳',
            'zh': '🇨🇳',
            'ru': '🇷🇺',
            'it': '🇮🇹',
            'pt': '🇵🇹',
            'ar': '🇸🇦',
        };
        
        const langCode = language.toLowerCase().substring(0, 2);
        return flags[langCode] || '🌐';
    };

    const getLanguageName = (language: string) => {
        const languages: Record<string, string> = {
            'en': 'English',
            'es': 'Spanish',
            'fr': 'French',
            'de': 'German',
            'ja': 'Japanese',
            'ko': 'Korean',
            'vi': 'Vietnamese',
            'zh': 'Chinese',
            'ru': 'Russian',
            'it': 'Italian',
            'pt': 'Portuguese',
            'ar': 'Arabic',
        };
        
        const langCode = language.toLowerCase().substring(0, 2);
        return languages[langCode] || language;
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView className="flex-1 px-4">
                {/* Header */}
                <View className="mb-6">
                    <Text className="text-2xl font-bold text-gray-800">
                        Welcome back, {user.username}! 👋
                    </Text>
                    <Text className="text-gray-600 mt-1">Continue your language learning journey</Text>
                </View>

                <View className="mb-6">
                    <Text className="text-lg font-semibold text-gray-800 mb-4">Your Languages</Text>
                    
                    {user.activities && user.activities.length > 0 ? (
                        <View className="space-y-4">
                            {user.activities.map((activity: UserActivity, index: number) => (
                                <View 
                                    key={index} 
                                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                                >
                                    <View className="flex-row items-center justify-between">
                                        <View className="flex-row items-center space-x-4">
                                            <View className="w-12 h-12 rounded-full bg-blue-100 items-center justify-center">
                                                <Text className="text-2xl">{getLanguageFlag(activity.language)}</Text>
                                            </View>
                                            <View>
                                                <Text className="text-lg font-semibold text-gray-800">
                                                    {getLanguageName(activity.language)}
                                                </Text>
                                                <Text className="text-sm text-gray-600">Learning</Text>
                                            </View>
                                        <View className="items-end">
                                            <View className="flex-row items-center space-x-2 mb-2">
                                                <Flame size={16} color="#f59e0b" />
                                                <Text className="text-sm font-medium text-gray-700">
                                                    {activity.currentStreak} day streak
                                                </Text>
                                            </View>
                                            <Text className="text-xs text-gray-50">
                                                Last active: {activity.lastActive ? (typeof activity.lastActive === 'string' ? new Date(activity.lastActive).toLocaleDateString() : activity.lastActive.toLocaleDateString()) : 'Never'}
                                            </Text>
                                        </View>
                                    </View>
                                    
                                    {/* Progress indicators */}
                                    <View className="mt-4">
                                        <View className="flex-row justify-between items-center mb-1">
                                            <Text className="text-sm text-gray-60">Daily Goal</Text>
                                            <Text className="text-sm font-medium text-gray-800">10/20 min</Text>
                                        </View>
                                        <View className="w-full bg-gray-200 rounded-full h-2">
                                            <View className="bg-blue-600 h-2 rounded-full" style={{ width: '50%' }}></View>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <View className="bg-white rounded-2xl p-8 items-center justify-center border-2 border-dashed border-gray-200">
                            <Globe size={48} color="#9ca3af" />
                            <Text className="text-lg font-medium text-gray-600 mt-4">No languages yet</Text>
                            <Text className="text-gray-500 text-center mt-2">
                                Start learning a new language to see your progress here
                            </Text>
                        </View>
                    )}
                </View>

                {/* Add More Language Button */}
                <TouchableOpacity 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 mb-6 shadow-lg"
                    onPress={navigateToOnboarding}
                >
                    <View className="flex-row items-center justify-center space-x-3">
                        <View className="w-10 h-10 bg-white bg-opacity-20 rounded-full items-center justify-center">
                            <Globe size={20} color="white" />
                        </View>
                        <View>
                            <Text className="text-white text-lg font-semibold">Learn Another Language</Text>
                            <Text className="text-white text-opacity-80 text-sm">Expand your language portfolio</Text>
                        </View>
                    </View>
                </TouchableOpacity>

                {/* Quick Stats */}
                {user.activities && user.activities.length > 0 && (
                    <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100">
                        <Text className="text-lg font-semibold text-gray-800 mb-4">Your Progress</Text>
                        <View className="flex-row justify-between">
                            <View className="items-center">
                                <View className="w-12 h-12 rounded-full bg-blue-100 items-center justify-center mb-2">
                                    <Flame size={20} color="#3b82f6" />
                                </View>
                                <Text className="text-sm font-medium text-gray-700">{user.activities.length}</Text>
                                <Text className="text-xs text-gray-500">Languages</Text>
                            </View>
                            <View className="items-center">
                                <View className="w-12 h-12 rounded-full bg-green-100 items-center justify-center mb-2">
                                    <BookOpen size={20} color="#10b981" />
                                </View>
                                <Text className="text-sm font-medium text-gray-700">24</Text>
                                <Text className="text-xs text-gray-500">Lessons</Text>
                            </View>
                            <View className="items-center">
                                <View className="w-12 h-12 rounded-full bg-purple-100 items-center justify-center mb-2">
                                    <Target size={20} color="#8b5cf6" />
                                </View>
                                <Text className="text-sm font-medium text-gray-700">85%</Text>
                                <Text className="text-xs text-gray-500">Mastery</Text>
                            </View>
                            <View className="items-center">
                                <View className="w-12 h-12 rounded-full bg-orange-100 items-center justify-center mb-2">
                                    <Calendar size={20} color="#f59e0b" />
                                </View>
                                <Text className="text-sm font-medium text-gray-700">12</Text>
                                <Text className="text-xs text-gray-500">Days</Text>
                            </View>
                        </View>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
