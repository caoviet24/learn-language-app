import React, { act, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Image, ActivityIndicator } from 'react-native';
import { User, Target, Bell, Check, Globe, GraduationCap } from 'lucide-react-native';
import { OptionButton, SelectionCard } from '@/components/SelectionCard';
import { useRouter } from 'expo-router';
import { goalOptions, languageOptions, levelOptions, roleOptions } from '@/configs/app';
import useAuth from '@/hooks/useAuth';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMutation } from '@tanstack/react-query';
import { userService } from '@/services/user-service';
import { UserActivity } from '@/types';

type LanguageOption = {
    id: number;
    name: string;
    flag: string;
    code: string;
};

type RoleOption = {
    id: number;
    name: string;
};

type LevelOption = {
    id: number;
    name: string;
};

type GoalOption = {
    id: number;
    name: string;
    minutes: number;
};

export default function OnBoardingScreen() {
    const { user, isLoading, setUser } = useAuth();
    const [selectedLanguage, setSelectedLanguage] = useState<LanguageOption | null>(null);
    const [selectedRole, setSelectedRole] = useState<RoleOption | null>(null);
    const [selectedLevel, setSelectedLevel] = useState<LevelOption | null>(null);
    const [selectedGoal, setSelectedGoal] = useState<GoalOption | null>(null);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [currentStep, setCurrentStep] = useState(0);
    const router = useRouter();

    const goToNextStep = () => {
        if (currentStep < 5) {
            setCurrentStep(currentStep + 1);
        }
    };

    const goToPrevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const { mutate, isPending, isSuccess } = useMutation({
        mutationFn: async () =>
            await userService.createActivity({
                language: selectedLanguage?.code || '',
                studyTimeEveryday: selectedGoal?.minutes || 0,
            }),
        onSuccess: (data: UserActivity) => {
            if (data && setUser) {
                setUser((prev) =>
                    prev
                        ? {
                              ...prev,
                              activities: [...(prev.activities || []), data],
                          }
                        : prev,
                );
            }
        },
    });

    const startLearning = async () => {
        await mutate();
        setCurrentStep(6);
    };

    const finishOnboarding = () => {
        console.log('Finishing onboarding with:', {
            selectedLanguage,
            selectedRole,
            selectedLevel,
            selectedGoal,
            notificationsEnabled,
        });
        router.push('/(tabs)/learn');
    };

    const isStepComplete = () => {
        switch (currentStep) {
            case 1:
                return !!selectedLanguage;
            case 2:
                return !!selectedRole;
            case 3:
                return !!selectedLevel;
            case 4:
                return !!selectedGoal;
            case 5:
                return true;
            default:
                return false;
        }
    };

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#3b82f6" />
            </View>
        );
    }

    if (isPending) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text className="mt-4 text-gray-600">Setting up your learning plan...</Text>
            </View>
        );
    }

    return (
        <ScrollView className="flex-1">
            <SafeAreaView className="flex-1 px-6 py-8">
                {currentStep > 0 && currentStep < 6 && (
                    <View className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-8">
                        <View style={{ width: `${(currentStep / 5) * 10}%` }} className="h-2 bg-blue-600" />
                    </View>
                )}

                {currentStep === 0 && (
                    <View className="items-center justify-center flex-1">
                        <View className="bg-white rounded-2xl p-8 shadow-lg w-full max-w-md">
                            <View className="items-center mb-6">
                                <Image
                                    source={require('../../assets/images/logo.png')}
                                    className="w-24 h-24 mb-4"
                                    resizeMode="contain"
                                />
                                <Text className="text-3xl font-bold text-gray-800">Welcome!</Text>
                                <Text className="text-2xl font-bold text-gray-800">Language Learning App</Text>
                                <Text className="text-gray-600 text-center mt-2">
                                    {'Answer a few questions to personalize your learning journey'}
                                </Text>
                            </View>

                            <View className="gap-2">
                                <TouchableOpacity
                                    className="bg-blue-600 py-4 rounded-xl shadow-md"
                                    onPress={goToNextStep}
                                >
                                    <Text className="text-white text-center font-semibold text-lg">Get Started</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className="bg-green-600 py-4 rounded-xl shadow-md"
                                    onPress={() => router.push('/')}
                                >
                                    <Text className="text-white text-center font-semibold text-lg">Back Home</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}

                {currentStep === 1 && (
                    <SelectionCard
                        title="What language do you want to learn?"
                        subtitle="Choose the language you want to master"
                        icon={Globe}
                    >
                        <View className="flex-row flex-wrap w-full">
                            {languageOptions.map((lang) => (
                                <View key={lang.id} className="w-1/2 p-2">
                                    <OptionButton
                                        item={lang}
                                        isSelected={selectedLanguage?.id === lang.id}
                                        onPress={() => setSelectedLanguage(lang)}
                                        type="language"
                                    />
                                </View>
                            ))}
                        </View>
                    </SelectionCard>
                )}

                {currentStep === 2 && (
                    <SelectionCard
                        title="What is your role?"
                        subtitle="Select the option that best describes you"
                        icon={User}
                    >
                        {roleOptions.map((role) => (
                            <OptionButton
                                key={role.id}
                                item={role}
                                isSelected={selectedRole?.id === role.id}
                                onPress={() => setSelectedRole(role)}
                                type="topic"
                            />
                        ))}
                    </SelectionCard>
                )}

                {currentStep === 3 && (
                    <SelectionCard
                        title="What is your current language level?"
                        subtitle="Choose the level that matches your skills"
                        icon={GraduationCap}
                    >
                        {levelOptions.map((level) => (
                            <OptionButton
                                key={level.id}
                                item={level}
                                isSelected={selectedLevel?.id === level.id}
                                onPress={() => setSelectedLevel(level)}
                                type="level"
                            />
                        ))}
                    </SelectionCard>
                )}

                {currentStep === 4 && (
                    <SelectionCard
                        title="What is your daily goal?"
                        subtitle="How much time can you dedicate each day?"
                        icon={Target}
                    >
                        {goalOptions.map((goal) => (
                            <OptionButton
                                key={goal.id}
                                item={goal}
                                isSelected={selectedGoal?.id === goal.id}
                                onPress={() => setSelectedGoal(goal)}
                                type="topic"
                            />
                        ))}
                    </SelectionCard>
                )}

                {currentStep === 5 && (
                    <View className="mb-6">
                        <View className="flex-row items-center mb-3">
                            <Bell size={20} color="#6b7280" />
                            <Text className="text-lg font-bold text-gray-800 ml-2">Notifications</Text>
                        </View>
                        <View className="bg-white rounded-xl p-4 border border-gray-200">
                            <View className="flex-row justify-between items-center">
                                <View>
                                    <Text className="font-medium text-gray-800">Allow Notifications</Text>
                                    <Text className="text-gray-600 text-sm">Get reminders to practice daily</Text>
                                </View>
                                <Switch
                                    value={notificationsEnabled}
                                    onValueChange={setNotificationsEnabled}
                                    trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
                                    thumbColor={notificationsEnabled ? '#ffffff' : '#ffffff'}
                                />
                            </View>
                        </View>
                    </View>
                )}

                {currentStep === 6 && (
                    <View className="items-center justify-center flex-1">
                        <View className="bg-white rounded-2xl p-8 shadow-lg w-full max-w-md">
                            <View className="items-center mb-6">
                                <View className="w-20 h-20 rounded-full bg-green-100 items-center justify-center mb-4">
                                    <Check size={40} color="#10b981" />
                                </View>
                                <Text className="text-2xl font-bold text-gray-800 text-center">Ready to Start!</Text>
                                <Text className="text-gray-600 text-center mt-2">
                                    {"Your learning experience is customized. Let's begin your journey!"}
                                </Text>
                            </View>

                            <TouchableOpacity
                                className="bg-blue-600 py-4 rounded-xl shadow-md"
                                onPress={finishOnboarding}
                            >
                                <Text className="text-white text-center font-semibold text-lg">Start Learning</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {currentStep > 0 && currentStep < 6 && (
                    <View className="flex-row gap-3 mt-8">
                        <TouchableOpacity className="flex-1 py-4 rounded-xl bg-gray-200" onPress={goToPrevStep}>
                            <Text className="text-gray-800 text-center font-semibold">Back</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className={`flex-1 py-4 rounded-xl ${isStepComplete() ? 'bg-blue-600' : 'bg-blue-30'}`}
                            onPress={isStepComplete() ? goToNextStep : () => {}}
                            disabled={!isStepComplete()}
                        >
                            <Text
                                className={`text-center font-semibold ${
                                    isStepComplete() ? 'text-white' : 'text-gray-500'
                                }`}
                            >
                                {currentStep === 5 ? 'Finish' : 'Continue'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                {currentStep === 5 && (
                    <TouchableOpacity className="w-full py-4 rounded-xl bg-green-600 mt-4" onPress={startLearning}>
                        <Text className="text-white text-center font-semibold text-lg">Start Learning</Text>
                    </TouchableOpacity>
                )}
            </SafeAreaView>
        </ScrollView>
    );
}
