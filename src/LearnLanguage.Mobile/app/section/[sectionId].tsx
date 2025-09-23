import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Animated,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import LingoMascot from '../../components/LingoMasco';

const { height } = Dimensions.get('window');

interface Lesson {
    id: string;
    title: string;
    completed: boolean;
    locked: boolean;
    type?: 'star' | 'book' | 'chest' | 'trophy';
}

interface Section {
    id: string;
    name: string;
    lessons: Lesson[];
}

const mockData: Section[] = [
    {
        id: 'basics',
        name: 'Cơ bản',
        lessons: [
            { id: '1', title: 'BẮT ĐẦU', completed: true, locked: false, type: 'star' },
            { id: '2', title: '', completed: true, locked: false, type: 'star' },
            { id: '3', title: '', completed: false, locked: true, type: 'chest' },
            { id: '4', title: '', completed: false, locked: true, type: 'star' },
            { id: '5', title: '', completed: false, locked: true, type: 'trophy' },
        ],
    },
    {
        id: 'introduction',
        name: 'Giới thiệu góc gác',
        lessons: [
            { id: '6', title: 'HỌC VƯỢT?', completed: false, locked: false, type: 'book' },
        ],
    },
];

interface SectionScreenProps {
    sectionId: string;
    onBack: () => void;
}

export default function SectionScreen({
    sectionId,
    onBack,
}: SectionScreenProps) {
    const [currentSection, setCurrentSection] = useState({
        name: mockData[0].name,
        idx: 0,
    });
    const scrollViewRef = useRef<ScrollView>(null);
    const pulseAnimation = useRef(new Animated.Value(1)).current;
    const progressAnimation = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        // Pulse animation for active lesson
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnimation, {
                    toValue: 1.1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnimation, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        );
        pulse.start();

        // Progress animation
        Animated.timing(progressAnimation, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: false,
        }).start();

        return () => {
            pulse.stop();
        };
    }, []);

    const handleScroll = (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const sectionHeight = height * 0.8;
        const sectionIndex = Math.floor(offsetY / sectionHeight);

        if (sectionIndex >= 0 && sectionIndex < mockData.length) {
            setCurrentSection({
                name: mockData[sectionIndex].name,
                idx: sectionIndex,
            });
        }
    };

    const navigateToLesson = (lessonId: string, locked: boolean) => {
        if (!locked) {
            router.push(`/lesson`);
        }
    };

    const getIconName = (lesson: Lesson) => {
        if (lesson.locked) return 'lock-closed';
        if (lesson.completed) {
            switch (lesson.type) {
                case 'star': return 'star';
                case 'trophy': return 'trophy';
                default: return 'checkmark';
            }
        }
        switch (lesson.type) {
            case 'star': return 'star';
            case 'chest': return 'gift';
            case 'trophy': return 'trophy';
            default: return 'book';
        }
    };

    const getLessonColors = (lesson: Lesson) => {
        if (lesson.locked) {
            return {
                gradient: ['#6B7280', '#4B5563'],
                border: '#374151',
                shadow: '#1F2937',
            };
        }
        if (lesson.completed) {
            return {
                gradient: ['#10B981', '#059669'],
                border: '#047857',
                shadow: '#064E3B',
            };
        }
        if (lesson.type === 'book') {
            return {
                gradient: ['#8B5CF6', '#7C3AED'],
                border: '#6D28D9',
                shadow: '#5B21B6',
            };
        }
        if (lesson.type === 'chest') {
            return {
                gradient: ['#F59E0B', '#D97706'],
                border: '#B45309',
                shadow: '#92400E',
            };
        }
        if (lesson.type === 'trophy') {
            return {
                gradient: ['#EF4444', '#DC2626'],
                border: '#B91C1C',
                shadow: '#991B1B',
            };
        }
        return {
            gradient: ['#3B82F6', '#2563EB'],
            border: '#1D4ED8',
            shadow: '#1E3A8A',
        };
    };

    const renderLesson = (lesson: Lesson, index: number, sectionIndex: number) => {
        const positions = [
            { left: 80 }, // center
            { left: 160 }, // right
            { left: 80 }, // center
            { left: 160 }, // right
            { left: 80 }, // center
        ];
        
        const position = positions[index] || { left: 80 };
        const isSpecialLesson = lesson.title === 'HỌC VƯỢT?';
        const colors = getLessonColors(lesson);
        const isActive = !lesson.locked && !lesson.completed;

        return (
            <View key={lesson.id} style={{ marginVertical: 30 }}>
                {/* Progress line connecting lessons */}
                {index > 0 && (
                    <Animated.View
                        style={{
                            position: 'absolute',
                            top: -30,
                            left: position.left + 40,
                            width: 4,
                            height: 30,
                            backgroundColor: lesson.completed ? '#10B981' : '#374151',
                            opacity: progressAnimation,
                        }}
                    />
                )}
                
                <Animated.View
                    style={{
                        marginLeft: position.left,
                        transform: [{ scale: isActive ? pulseAnimation : 1 }],
                    }}
                >
                    <TouchableOpacity
                        onPress={() => navigateToLesson(lesson.id, lesson.locked)}
                        activeOpacity={0.8}
                        style={{
                            shadowColor: colors.shadow,
                            shadowOffset: { width: 0, height: 6 },
                            shadowOpacity: 0.4,
                            shadowRadius: 8,
                            elevation: 12,
                        }}
                    >
                        <LinearGradient
                            colors={colors.gradient as [string, string]}
                            style={{
                                width: 80,
                                height: 80,
                                borderRadius: 40,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderWidth: 4,
                                borderColor: colors.border,
                            }}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <Ionicons
                                name={getIconName(lesson)}
                                size={32}
                                color="white"
                                style={{
                                    textShadowColor: 'rgba(0,0,0,0.3)',
                                    textShadowOffset: { width: 1, height: 1 },
                                    textShadowRadius: 2,
                                }}
                            />
                            
                            {/* Completion checkmark overlay */}
                            {lesson.completed && (
                                <View
                                    style={{
                                        position: 'absolute',
                                        bottom: -2,
                                        right: -2,
                                        backgroundColor: '#059669',
                                        borderRadius: 12,
                                        width: 24,
                                        height: 24,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderWidth: 2,
                                        borderColor: 'white',
                                    }}
                                >
                                    <Ionicons name="checkmark" size={14} color="white" />
                                </View>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>
                </Animated.View>
                
                {lesson.title && (
                    <View style={{ alignItems: 'center', marginTop: 12 }}>
                        {isSpecialLesson ? (
                            <LinearGradient
                                colors={['#1F2937', '#111827']}
                                style={{
                                    paddingHorizontal: 12,
                                    paddingVertical: 6,
                                    borderRadius: 20,
                                    borderWidth: 1,
                                    borderColor: '#374151',
                                }}
                            >
                                <Text className="text-white text-xs font-bold">
                                    {lesson.title}
                                </Text>
                            </LinearGradient>
                        ) : (
                            <View className="bg-gray-800 px-3 py-2 rounded-lg border border-gray-600">
                                <Text className="text-gray-200 text-xs font-semibold">
                                    {lesson.title}
                                </Text>
                            </View>
                        )}
                    </View>
                )}
            </View>
        );
    };

    const renderMascot = () => {
        try {
            return (
                <Animated.View style={{
                    position: 'absolute',
                    right: 20,
                    top: 150,
                    zIndex: 10,
                    opacity: progressAnimation,
                    transform: [{ scale: progressAnimation }],
                }}>
                    <LingoMascot size={100} />
                </Animated.View>
            );
        } catch (error) {
            console.warn('LingoMascot failed to render:', error);
            return (
                <View style={{
                    position: 'absolute',
                    right: 20,
                    top: 150,
                    zIndex: 10,
                    width: 80,
                    height: 100,
                    backgroundColor: '#10B981',
                    borderRadius: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Ionicons name="happy" size={40} color="white" />
                </View>
            );
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#111827' }}>
            <LinearGradient
                colors={['#10B981', '#059669', '#047857'] as [string, string, string]}
                style={{ paddingHorizontal: 16, paddingVertical: 16 }}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View className="flex-row items-center justify-between">
                    <TouchableOpacity
                        onPress={onBack}
                        style={{
                            padding: 12,
                            borderRadius: 25,
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.3,
                            shadowRadius: 4,
                            elevation: 5,
                        }}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>

                    <View className="flex-1 mx-4">
                        <Text style={{
                            color: 'rgba(255,255,255,0.8)',
                            fontSize: 12,
                            fontWeight: '600',
                            letterSpacing: 1,
                        }}>
                            PHẦN 1, CỬA 1
                        </Text>
                        <Text style={{
                            color: 'white',
                            fontSize: 18,
                            fontWeight: 'bold',
                            marginTop: 2,
                            textShadowColor: 'rgba(0,0,0,0.3)',
                            textShadowOffset: { width: 1, height: 1 },
                            textShadowRadius: 2,
                        }}>
                            Mời khách xơi nước
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            paddingHorizontal: 12,
                            paddingVertical: 8,
                            borderRadius: 20,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.3,
                            shadowRadius: 4,
                            elevation: 5,
                        }}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="list" size={16} color="white" />
                        <Text style={{
                            color: 'white',
                            fontSize: 12,
                            fontWeight: '600',
                            marginLeft: 4,
                            letterSpacing: 0.5,
                        }}>
                            HƯỚNG DẪN
                        </Text>
                    </TouchableOpacity>
                </View>
                
                {/* Progress bar */}
                <View style={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    height: 6,
                    borderRadius: 3,
                    marginTop: 12,
                    overflow: 'hidden',
                }}>
                    <Animated.View
                        style={[
                            {
                                backgroundColor: '#FDE047',
                                height: '100%',
                                borderRadius: 3,
                            },
                            {
                                width: progressAnimation.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['0%', '30%'],
                                }),
                            }
                        ]}
                    />
                </View>
            </LinearGradient>

            <View style={{ flex: 1, backgroundColor: '#111827' }}>
                <ScrollView
                    ref={scrollViewRef}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    style={{ flex: 1, paddingHorizontal: 16 }}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 40 }}
                >
                    <View style={{ position: 'relative', minHeight: height }}>
                        {/* Decorative background pattern */}
                        <View style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '100%',
                            opacity: 0.05,
                        }}>
                            {Array.from({ length: 20 }).map((_, i) => (
                                <View
                                    key={i}
                                    style={{
                                        position: 'absolute',
                                        width: 2,
                                        height: 100,
                                        backgroundColor: '#10B981',
                                        left: (i % 2) * 200 + 50,
                                        top: i * 80,
                                        borderRadius: 1,
                                    }}
                                />
                            ))}
                        </View>

                        {/* {renderMascot()} */}
                        
                        {mockData.map((section, sectionIndex) => (
                            <Animated.View
                                key={section.id}
                                style={{
                                    paddingVertical: 20,
                                    opacity: progressAnimation,
                                }}
                            >
                                {sectionIndex === 1 && (
                                    <View style={{
                                        alignItems: 'center',
                                        marginBottom: 30,
                                        marginTop: 40,
                                    }}>
                                        <LinearGradient
                                            colors={['transparent', '#374151', 'transparent'] as [string, string, string]}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            style={{
                                                width: '100%',
                                                height: 1,
                                                marginBottom: 16,
                                            }}
                                        />
                                        <View style={{
                                            backgroundColor: '#1F2937',
                                            paddingHorizontal: 20,
                                            paddingVertical: 10,
                                            borderRadius: 20,
                                            borderWidth: 1,
                                            borderColor: '#374151',
                                            shadowColor: '#000',
                                            shadowOffset: { width: 0, height: 4 },
                                            shadowOpacity: 0.3,
                                            shadowRadius: 6,
                                            elevation: 8,
                                        }}>
                                            <Text style={{
                                                color: '#9CA3AF',
                                                fontSize: 14,
                                                fontWeight: '600',
                                                textAlign: 'center',
                                                letterSpacing: 0.5,
                                            }}>
                                                {section.name}
                                            </Text>
                                        </View>
                                        <LinearGradient
                                            colors={['transparent', '#374151', 'transparent'] as [string, string, string]}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            style={{
                                                width: '100%',
                                                height: 1,
                                                marginTop: 16,
                                            }}
                                        />
                                    </View>
                                )}
                                
                                {section.lessons.map((lesson, index) =>
                                    renderLesson(lesson, index, sectionIndex)
                                )}
                            </Animated.View>
                        ))}

                        {/* Achievement section */}
                        <Animated.View
                            style={{
                                marginTop: 60,
                                alignItems: 'center',
                                opacity: progressAnimation,
                            }}
                        >
                            <LinearGradient
                                colors={['#7C3AED', '#5B21B6'] as [string, string]}
                                style={{
                                    paddingHorizontal: 24,
                                    paddingVertical: 16,
                                    borderRadius: 25,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    shadowColor: '#7C3AED',
                                    shadowOffset: { width: 0, height: 6 },
                                    shadowOpacity: 0.4,
                                    shadowRadius: 8,
                                    elevation: 10,
                                }}
                            >
                                <Ionicons name="trophy" size={24} color="#FDE047" />
                                <Text style={{
                                    color: 'white',
                                    fontSize: 16,
                                    fontWeight: 'bold',
                                    marginLeft: 12,
                                }}>
                                    Hoàn thành để mở khóa!
                                </Text>
                            </LinearGradient>
                        </Animated.View>
                    </View>
                </ScrollView>
            </View>

        </SafeAreaView>
    );
}
