import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Animated,
    Dimensions,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";

import NotebookDialog from "@/components/NotebookDialog";
import { SafeAreaView } from "react-native-safe-area-context";
import MatchLesson from "@/components/lessons/MatchLesson";
import ChoiceLesson, { Choice as ChoiceType } from "@/components/lessons/ChoiceLesson";
import ListenLesson from "@/components/lessons/ListenLesson";
import { Easing } from "react-native-reanimated";
import FillLesson from "@/components/lessons/FillLesson";

const { width } = Dimensions.get('window');


interface Lesson {
    type: "choice" | "listening" | "match" | "fill_in_blank" | "video" | "synonym";
    question: string;
    choices?: ChoiceType[];
    media?: any;
    answer?: string | string[];
    pairs?: { left: string; right: string }[];
    notebook: {
        topic: string;
        lessonTitle: string;
        content: string;
    };
}


const lessonData: { [key: string]: Lesson } = {
    "1": {
        type: "choice",
        question: "Đâu là 'đường'?",
        choices: [
            { id: "coffee", text: "coffee", icon: "☕", isCorrect: false },
            { id: "sugar", text: "sugar", icon: "🍯", isCorrect: true },
            { id: "milk", text: "milk", icon: "🥛", isCorrect: false },
        ],
        notebook: {
            topic: "Đồ ăn & Đồ uống",
            lessonTitle: "Từ vựng cơ bản",
            content: "👉 'sugar' nghĩa là 'đường'...",
        },
    },
    "2": {
        type: "listening",
        question: "Nghe và điền từ bạn nghe được:",
        media: require("../../assets/audios/audio.mp3"),
        answer: "Today is November 26th",
        notebook: {
            topic: "Giao tiếp cơ bản",
            lessonTitle: "Nghe - Chào hỏi",
            content: "👉 'hello' nghĩa là xin chào",
        },
    },
    "3": {
        type: "match",
        question: "Ghép từ với nghĩa đúng:",
        pairs: [
            { left: "cat", right: "con mèo" },
            { left: "dog", right: "con chó" },
            { left: "fish", right: "con cá" },
        ],
        notebook: {
            topic: "Động vật",
            lessonTitle: "Ghép từ",
            content: "👉 Luyện tập ghép từ Anh-Việt.",
        },
    },
    "4": {
        type: "fill_in_blank",
        question: "Điền từ còn thiếu: I ___ sugar in my coffee.",
        answer: "like",
        notebook: {
            topic: "Ngữ pháp cơ bản",
            lessonTitle: "Động từ",
            content: "👉 'like' nghĩa là 'thích'.",
        },
    },
    "5": {
        type: "video",
        question: "Xem video và gõ lại câu nói:",
        media: {
            URL: "https://youtu.be/j-WFJ_WCpFE?si=4Drw0j7srMxWCkWe"
        },
        answer: "Good morning",
        notebook: {
            topic: "Giao tiếp",
            lessonTitle: "Video chào hỏi",
            content: "👉 'Good morning' = 'Chào buổi sáng'.",
        },
    },
};

export default function LessonScreen() {
    const { lessonId } = useLocalSearchParams();

    // State management
    const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
    const [matchedPairs, setMatchedPairs] = useState<{ [key: string]: string }>({});
    const [userInput, setUserInput] = useState("");
    const [showResult, setShowResult] = useState(false);
    const [showNotebook, setShowNotebook] = useState(false);
    const [hearts, setHearts] = useState(3);
    const [streakCount, setStreakCount] = useState(0);
    
    // Lesson queue management
    const [lessonQueue, setLessonQueue] = useState<string[]>([]);
    const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
    const [isCompleted, setIsCompleted] = useState(false);

    // Animation values
    const [buttonAnimation] = useState(new Animated.Value(1));
    const [resultAnimation] = useState(new Animated.Value(0));

    // Initialize lesson queue
    const allLessonKeys = useMemo(() => Object.keys(lessonData), []);
    
    useEffect(() => {
        if (lessonQueue.length === 0) {
            setLessonQueue(allLessonKeys);
        }
    }, [allLessonKeys, lessonQueue.length]);

    // Current lesson data
    const currentIndex = useMemo(() => lessonQueue.indexOf(lessonId as string), [lessonQueue, lessonId]);
    const lesson = useMemo(() => lessonData[lessonId as string] || lessonData["1"], [lessonId]);
    
    // Progress calculation based on completed lessons
    const progress = useMemo(() => {
        const totalLessons = allLessonKeys.length;
        const completedCount = completedLessons.size;
        return (completedCount / totalLessons) * 100;
    }, [allLessonKeys.length, completedLessons.size]);

    // Reset state when lesson changes
    useEffect(() => {
        setSelectedChoice(null);
        setMatchedPairs({});
        setUserInput("");
        setShowResult(false);
        resultAnimation.setValue(0);
    }, [lessonId, resultAnimation]);

    // Optimized handlers with useCallback
    const handleChoiceSelect = useCallback((choiceId: string) => {
        if (showResult) return;
        
        setSelectedChoice(choiceId);
        
        Animated.sequence([
            Animated.timing(buttonAnimation, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(buttonAnimation, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();
    }, [showResult, buttonAnimation]);

    const handleMatchPair = useCallback((left: string, right: string) => {
        if (showResult) return;

        setMatchedPairs(prev => ({
            ...prev,
            [left]: right
        }));
    }, [showResult]);

    const handleUserInputChange = useCallback((value: string) => {
        if (!showResult) {
            setUserInput(value);
        }
    }, [showResult]);

    const hasValidAnswer = useCallback(() => {
        switch (lesson.type) {
            case "choice":
                return selectedChoice !== null;
            case "listening":
            case "fill_in_blank":
            case "video":
                return userInput.trim().length > 0;
            case "match":
                return lesson.pairs && Object.keys(matchedPairs).length === lesson.pairs.length;
            default:
                return false;
        }
    }, [lesson.type, selectedChoice, userInput, lesson.pairs, matchedPairs]);

    const isCorrect = useMemo(() => {
        switch (lesson.type) {
            case "choice":
                if (!selectedChoice || !lesson.choices) return false;
                const selectedChoiceData = lesson.choices.find(choice => choice.id === selectedChoice);
                return selectedChoiceData?.isCorrect || false;

            case "listening":
            case "fill_in_blank":
            case "video":
                const correctAnswer = typeof lesson.answer === "string"
                    ? lesson.answer
                    : lesson.answer?.[0];
                return userInput.trim().toLowerCase() === correctAnswer?.toLowerCase();

            case "match":
                return lesson.pairs?.every(pair =>
                    matchedPairs[pair.left] === pair.right
                ) || false;

            default:
                return false;
        }
    }, [lesson, selectedChoice, userInput, matchedPairs]);

    const handleCheck = useCallback(() => {
        if (!hasValidAnswer()) return;

        setShowResult(true);

        // Result animation
        Animated.timing(resultAnimation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();

        // Update hearts and streak based on correctness
        if (isCorrect) {
            setStreakCount(prev => prev + 1);
            // Mark lesson as completed (progress will update automatically)
            setCompletedLessons(prev => {
                const newCompleted = new Set([...prev, lessonId as string]);
                // Check if all lessons are completed
                if (newCompleted.size === allLessonKeys.length) {
                    setTimeout(() => setIsCompleted(true), 1500); // Delay to show success animation first
                }
                return newCompleted;
            });
        } else {
            setHearts(prev => Math.max(0, prev - 1));
            setStreakCount(0);
            // Move incorrect lesson to end of queue (don't update progress)
            setLessonQueue(prev => {
                const filtered = prev.filter(id => id !== lessonId);
                return [...filtered, lessonId as string];
            });
        }
    }, [hasValidAnswer, isCorrect, resultAnimation, lessonId, allLessonKeys.length]);

    const handleNext = useCallback(() => {
        if (isCompleted) {
            router.back();
            return;
        }

        if (isCorrect) {
            // Find next lesson in queue that's not completed
            const remainingLessons = lessonQueue.filter(id => !completedLessons.has(id) && id !== lessonId);
            const nextLessonId = remainingLessons[0];
            
            if (nextLessonId) {
                router.replace(`/lesson/${nextLessonId}`);
            } else {
                // All lessons completed, will be handled by the completion check in handleCheck
                return;
            }
        } else {
            // Move to next lesson in queue (the incorrect one will be at the end)
            const currentIdx = lessonQueue.indexOf(lessonId as string);
            const nextIdx = (currentIdx + 1) % lessonQueue.length;
            const nextLessonId = lessonQueue[nextIdx];
            
            if (nextLessonId && nextLessonId !== lessonId) {
                router.replace(`/lesson/${nextLessonId}`);
            }
        }
    }, [isCorrect, lessonQueue, completedLessons, lessonId, isCompleted]);

    const handleSkip = useCallback(() => {
        router.back();
    }, []);

    const renderQuestion = useCallback(() => {
        switch (lesson.type) {
            case "choice":
                return (
                    <ChoiceLesson
                        choices={lesson.choices}
                        selectedChoice={selectedChoice}
                        onChoiceSelect={handleChoiceSelect}
                        showResult={showResult}
                        disabled={showResult}
                    />
                );

            case "listening":
            case "video":
                return (
                    <ListenLesson
                        type={lesson.type === "listening" ? "listening" : "video"}
                        media={lesson.media}
                        value={userInput}
                        onValueChange={handleUserInputChange}
                        disabled={showResult}
                    />
                );

            case "match":
                return (
                    <MatchLesson
                        pairs={lesson.pairs}
                        matchedPairs={matchedPairs}
                        onPairMatch={handleMatchPair}
                        showResult={showResult}
                        disabled={showResult}
                    />
                );

            case "fill_in_blank":
                return (
                    <FillLesson
                        question={lesson.question}
                        value={userInput}
                        onValueChange={handleUserInputChange}
                        disabled={showResult}
                    />
                );

            default:
                return (
                    <View className="bg-slate-800 p-6 rounded-2xl">
                        <Text className="text-slate-400 text-center">
                            Loại bài tập không được hỗ trợ
                        </Text>
                    </View>
                );
        }
    }, [lesson, selectedChoice, userInput, matchedPairs, showResult, handleChoiceSelect, handleUserInputChange, handleMatchPair]);


    // Progress animation
    const progressAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(progressAnim, {
            toValue: progress,
            duration: 800,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: false,
        }).start();
    }, [progress, progressAnim]);

    // Completion Screen
    if (isCompleted) {
        return (
            <SafeAreaView className="flex-1 bg-gradient-to-b from-green-900 to-emerald-800">
                <View className="flex-1 justify-center items-center px-6">
                    <LottieView
                        source={require("../../assets/animations/fireworks.json")}
                        autoPlay
                        loop={true}
                        style={{
                            width: width * 0.8,
                            height: width * 0.8,
                            position: "absolute",
                            top: "10%",
                        }}
                    />
                    
                    <View className="bg-white/10 backdrop-blur p-8 rounded-3xl border border-green-400/30 items-center">
                        <Text className="text-6xl mb-4">🎉</Text>
                        <Text className="text-white text-4xl font-bold text-center mb-4">
                            Chúc mừng!
                        </Text>
                        <Text className="text-green-200 text-xl text-center mb-6">
                            Bạn đã hoàn thành tất cả các bài học!
                        </Text>
                        
                        <View className="bg-green-500/20 p-6 rounded-2xl border border-green-400/30 mb-8">
                            <View className="flex-row justify-between items-center mb-2">
                                <Text className="text-green-200 text-lg">Tổng số bài:</Text>
                                <Text className="text-white text-lg font-bold">{allLessonKeys.length}</Text>
                            </View>
                            <View className="flex-row justify-between items-center mb-2">
                                <Text className="text-green-200 text-lg">Hoàn thành:</Text>
                                <Text className="text-green-400 text-lg font-bold">{completedLessons.size}</Text>
                            </View>
                            <View className="flex-row justify-between items-center">
                                <Text className="text-green-200 text-lg">Streak cao nhất:</Text>
                                <Text className="text-orange-400 text-lg font-bold">🔥 {streakCount}</Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="bg-gradient-to-r from-green-500 to-emerald-500 py-4 px-8 rounded-2xl shadow-lg"
                            style={{
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.3,
                                shadowRadius: 8,
                                elevation: 8,
                            }}
                        >
                            <Text className="text-white text-xl font-bold text-center">
                                HOÀN THÀNH
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gradient-to-b from-slate-900 to-slate-800">
            {/* Header */}
            <View className="bg-slate-800/90 backdrop-blur px-6 py-4 border-b border-slate-700/50">
                <View className="flex-row items-center gap-4">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="p-2 rounded-full bg-slate-700"
                    >
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>

                    <View className="flex-1">
                        <View className="bg-slate-600 h-3 rounded-full overflow-hidden">
                            <Animated.View
                                className="bg-gradient-to-r from-green-400 to-blue-500 h-full rounded-full"
                                style={{
                                    width: progressAnim.interpolate({
                                        inputRange: [0, 100],
                                        outputRange: ["0%", "100%"],
                                    })
                                }}
                            />
                        </View>
                        <Text className="text-slate-400 text-xs mt-1">
                            Bài {currentIndex + 1} / {allLessonKeys.length}
                        </Text>
                    </View>

                    <View className="flex-row items-center gap-3">
                        <View className="flex-row items-center bg-red-500/20 px-3 py-2 rounded-full">
                            <Ionicons name="heart" size={20} color="#ef4444" />
                            <Text className="text-red-400 font-bold ml-1">{hearts}</Text>
                        </View>

                     
                    </View>
                </View>
            </View>

            <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
                <View className="flex-row items-center mb-6">
                    <View className="bg-purple-500/20 px-4 py-2 rounded-full border border-purple-400/30">
                        <Text className="text-purple-300 text-sm font-bold uppercase tracking-wider">
                            {lesson.type === "choice" && "Trắc nghiệm"}
                            {lesson.type === "listening" && "Nghe hiểu"}
                            {lesson.type === "match" && "Ghép từ"}
                            {lesson.type === "fill_in_blank" && "Điền từ"}
                            {lesson.type === "video" && "Video"}
                        </Text>
                    </View>
                    {streakCount > 0 && (
                        <View className="bg-orange-500/20 px-3 py-1 rounded-full ml-3 border border-orange-400/30">
                            <Text className="text-orange-300 text-sm font-bold">
                                🔥 {streakCount}
                            </Text>
                        </View>
                    )}
                </View>


                <Text className="text-white text-3xl font-bold mb-8 leading-tight">
                    {lesson.question}
                </Text>

                {renderQuestion()}


                {showResult && (
                    <Animated.View
                        style={{
                            opacity: resultAnimation,
                            transform: [{
                                translateY: resultAnimation.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [30, 0],
                                }),
                            }],
                        }}
                        className="mt-8 p-6 rounded-3xl"
                    >
                        {isCorrect ? (
                            <View className="bg-green-500/20 border border-green-400/30">
                                <View className="flex-row items-center justify-center mb-3">
                                    <Ionicons name="checkmark-circle" size={32} color="#22c55e" />
                                    <Text className="text-green-400 text-2xl font-bold ml-3">
                                        Tuyệt vời! 🎉
                                    </Text>
                                </View>
                                <Text className="text-green-300 text-center text-lg">
                                    Bạn đã trả lời đúng!
                                </Text>
                            </View>
                        ) : (
                            <View className="bg-red-500/20 border border-red-400/30">
                                <View className="flex-row items-center justify-center mb-3">
                                    <Ionicons name="close-circle" size={32} color="#ef4444" />
                                    <Text className="text-red-400 text-2xl font-bold ml-3">
                                        Chưa đúng 😔
                                    </Text>
                                </View>
                                <Text className="text-red-300 text-center text-lg mb-2">
                                    Đáp án đúng là:
                                </Text>
                                <Text className="text-white text-center text-xl font-bold">
                                    {typeof lesson.answer === "string" ? lesson.answer : lesson.answer?.[0]}
                                </Text>
                            </View>
                        )}
                    </Animated.View>
                )}
            </ScrollView>

            {/* Footer */}
            <View className="px-6 pb-8 pt-4 bg-slate-800/90 backdrop-blur border-t border-slate-700/50">
                <View className="flex-row gap-4">
                    <TouchableOpacity
                        onPress={handleSkip}
                        className="flex-1 bg-slate-600 py-4 rounded-2xl shadow-lg"
                        style={{
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.25,
                            shadowRadius: 4,
                            elevation: 4,
                        }}
                    >
                        <Text className="text-white text-center text-lg font-bold">
                            THOÁT
                        </Text>
                    </TouchableOpacity>

                    {!showResult ? (
                        <TouchableOpacity
                            onPress={handleCheck}
                            disabled={!hasValidAnswer()}
                            className={`flex-1 py-4 rounded-2xl shadow-lg ${hasValidAnswer()
                                ? "bg-green-500"
                                : "bg-slate-600"
                                }`}
                            style={{
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.25,
                                shadowRadius: 4,
                                elevation: 4,
                            }}
                        >
                            <Text className="text-white text-center text-lg font-bold">
                                KIỂM TRA
                            </Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            onPress={handleNext}
                            className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 py-4 rounded-2xl shadow-lg"
                            style={{
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.25,
                                shadowRadius: 4,
                                elevation: 4,
                            }}
                        >
                            <Text className="text-white text-center text-lg font-bold">
                                {isCompleted ? "HOÀN THÀNH" : "TIẾP THEO"}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Success Animation for correct answers */}
            {showResult && isCorrect && !isCompleted && (
                <LottieView
                    source={require("../../assets/animations/fireworks.json")}
                    autoPlay
                    loop={false}
                    style={{
                        width: width,
                        height: width,
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: [
                            { translateX: -width / 2 },
                            { translateY: -width / 2 }
                        ],
                        pointerEvents: 'none',
                    }}
                />
            )}

            {/* Notebook Dialog */}
            <NotebookDialog
                visible={showNotebook}
                onClose={() => setShowNotebook(false)}

            />
        </SafeAreaView>
    );
}