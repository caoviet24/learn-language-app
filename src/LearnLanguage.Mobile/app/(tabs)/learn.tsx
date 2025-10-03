import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Pressable } from "react-native";
import {
  ChevronRight,
  Star,
  Trophy,
  Zap,
  Target,
  Award,
  Flame,
  BookOpen,
  Clock,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';

const levels = [
  { id: 1, name: "Cơ bản", icon: "🌟", completed: true, current: false, color: "bg-green-500" },
  { id: 2, name: "Sơ cấp", icon: "🎯", completed: true, current: false, color: "bg-blue-500" },
  { id: 3, name: "Trung cấp", icon: "⚡", completed: false, current: true, color: "bg-orange-500" },
  { id: 4, name: "Nâng cao", icon: "🏆", completed: false, current: false, color: "bg-purple-500" },
  { id: 5, name: "Chuyên gia", icon: "👑", completed: false, current: false, color: "bg-red-500" },
  { id: 6, name: "Thạc sĩ", icon: "💎", completed: false, current: false, color: "bg-indigo-500" },
];

export default function HomeScreen() {
  const router = useRouter();


  const onNavigateToLesson = (levelId: number) => {
    router.push(`/section/${levelId}`);
  };

  return (
    <ScrollView className="flex-1 mt-5" style={{ backgroundColor: '#f8fafc' }}>
      <ExpoLinearGradient
        colors={['#667eea', '#764ba2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="px-4 pt-12 pb-8 rounded-b-3xl mx-4 mt-2"
      >
        <View className="flex-row justify-between items-center mb-6 p-2">
          <View className="flex-1">
            <Text className="text-3xl font-bold text-white mb-2">Chào mừng! 👋</Text>
            <Text className="text-white/80 text-base">Hãy tiếp tục hành trình học tập của bạn</Text>
          </View>
          <View className="bg-white/20 px-4 py-2 rounded-full flex-row items-center space-x-2">
            <Star size={20} color="#fbbf24" fill="#fbbf24" />
            <Text className="font-bold text-white text-lg">1,250</Text>
          </View>
        </View>

        <View className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center space-x-3 gap-2">
              <View className="bg-orange-500 p-2 rounded-full">
                <Flame size={20} color="white" />
              </View>
              <View>
                <Text className="text-white font-semibold text-lg">15 ngày liên tiếp!</Text>
                <Text className="text-white/70 text-sm">Bạn đang có phong độ tuyệt vời</Text>
              </View>
            </View>
            <Text className="text-2xl">🔥</Text>
          </View>
        </View>
      </ExpoLinearGradient>

      {/* Progress Section */}
      <View className="mx-4 mt-6 mb-6">
        <View className="bg-white rounded-2xl p-6 shadow-lg" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 8 }}>
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-gray-800">Tiến trình tổng thể</Text>
            <View className="bg-purple-100 px-3 py-1 rounded-full">
              <Text className="text-sm font-semibold text-purple-600">3/6 bậc</Text>
            </View>
          </View>
          <View className="w-full bg-gray-200 rounded-full h-4 mb-2">
            <ExpoLinearGradient
              colors={['#10b981', '#34d399']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="h-4 rounded-full"
              style={{ width: "50%" }}
            />
          </View>
          <Text className="text-sm text-gray-600 text-center">50% hoàn thành - Tuyệt vời!</Text>
        </View>
      </View>

      {/* Levels Section */}
      <View className="mx-4">
        <Text className="text-xl font-bold text-gray-800 mb-4">Lộ trình học tập</Text>
        <View className="space-y-4 gap-3">
          {levels.map((level, index) => (
            <View key={level.id} className="flex-row items-center">
              {/* Connecting Line */}
              {index < levels.length - 1 && (
                <View className="absolute left-12 top-24 w-0.5 h-8 bg-gray-300 z-0" />
              )}

              <View className="relative z-10">
                <Pressable
                  onPress={() => onNavigateToLesson(level.id)}
                  disabled={!level.completed && !level.current}
                  className={`
                    w-24 h-24 rounded-full items-center justify-center shadow-lg
                    ${level.completed
                      ? ""
                      : level.current
                        ? ""
                        : "bg-gray-300 opacity-60"
                    }
                  `}
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.2,
                    shadowRadius: 8,
                    elevation: 8
                  }}
                >
                  {level.completed ? (
                    <ExpoLinearGradient
                      colors={['#10b981', '#34d399']}
                      className="w-full h-full rounded-full items-center justify-center"
                    >
                      <Text className="text-3xl">{level.icon}</Text>
                    </ExpoLinearGradient>
                  ) : level.current ? (
                    <ExpoLinearGradient
                      colors={level.id === 3 ? ['#f97316', '#fb923c'] : ['#8b5cf6', '#a78bfa']}
                      className="w-full h-full rounded-full items-center justify-center"
                    >
                      <Text className="text-3xl">{level.icon}</Text>
                    </ExpoLinearGradient>
                  ) : (
                    <Text className="text-3xl text-gray-500">{level.icon}</Text>
                  )}

                  {level.current && (
                    <View className="absolute -top-2 -right-2 w-7 h-7 bg-yellow-400 rounded-full items-center justify-center border-2 border-white shadow-lg">
                      <Zap size={14} color="white" />
                    </View>
                  )}
                  {level.completed && (
                    <View className="absolute -top-2 -right-2 w-7 h-7 bg-yellow-400 rounded-full items-center justify-center border-2 border-white shadow-lg">
                      <Trophy size={14} color="white" />
                    </View>
                  )}
                </Pressable>
              </View>

              <View className="ml-6 flex-1">
                <View
                  className={`bg-white rounded-2xl p-5 shadow-lg
                    ${level.current ? "border-2 border-orange-200" : ""}
                    ${level.completed ? "border-l-4 border-green-400" : ""}
                  `}
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 4
                  }}
                >
                  <View className="flex-row justify-between items-center">
                    <View className="flex-1">
                      <Text
                        className={`font-bold text-lg mb-1 ${level.completed
                          ? "text-green-700"
                          : level.current
                            ? "text-orange-600"
                            : "text-gray-400"
                          }`}
                      >
                        Bậc {level.id}: {level.name}
                      </Text>
                      <View className="flex-row items-center">
                        {level.completed && <Text className="text-sm text-green-600 font-medium">✅ Hoàn thành</Text>}
                        {level.current && <Text className="text-sm text-orange-600 font-medium">🔥 Đang học</Text>}
                        {!level.completed && !level.current && <Text className="text-sm text-gray-400">🔒 Chưa mở khóa</Text>}
                      </View>
                    </View>
                    {(level.completed || level.current) && (
                      <View className="bg-gray-50 p-2 rounded-full">
                        <ChevronRight size={20} color="#9ca3af" />
                      </View>
                    )}
                  </View>

                  {level.current && (
                    <View className="mt-4 p-3 bg-orange-50 rounded-xl">
                      <View className="flex-row justify-between mb-2">
                        <Text className="text-sm font-medium text-orange-700">Tiến trình bậc học</Text>
                        <Text className="text-sm font-bold text-orange-600">7/10 bài</Text>
                      </View>
                      <View className="w-full bg-orange-200 rounded-full h-3">
                        <ExpoLinearGradient
                          colors={['#f97316', '#fb923c']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          className="h-3 rounded-full"
                          style={{ width: "70%" }}
                        />
                      </View>
                    </View>
                  )}
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Statistics Section */}
      <View className="mx-4 mt-8 mb-8">
        <ExpoLinearGradient
          colors={['#ffffff', '#f8fafc']}
          className="rounded-3xl p-6 shadow-lg"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.1,
            shadowRadius: 16,
            elevation: 10
          }}
        >
          <View className="flex-row items-center justify-between mb-6">
            <Text className="font-bold text-2xl text-gray-800">Thành tích của bạn</Text>
            <View className="bg-yellow-100 p-2 rounded-full">
              <Trophy size={24} color="#eab308" />
            </View>
          </View>

          <View className="flex-row justify-between">
            <View className="items-center flex-1">
              <ExpoLinearGradient
                colors={['#3b82f6', '#60a5fa']}
                className="p-4 rounded-2xl mb-3 shadow-md"
              >
                <Target size={28} color="white" />
              </ExpoLinearGradient>
              <Text className="text-3xl font-bold text-blue-500 mb-1">15</Text>
              <Text className="text-sm text-gray-600 text-center">Ngày liên tiếp</Text>
              <Text className="text-xs text-blue-500 font-medium">Tuyệt vời! 🎯</Text>
            </View>

            <View className="items-center flex-1">
              <ExpoLinearGradient
                colors={['#22c55e', '#4ade80']}
                className="p-4 rounded-2xl mb-3 shadow-md"
              >
                <BookOpen size={28} color="white" />
              </ExpoLinearGradient>
              <Text className="text-3xl font-bold text-green-500 mb-1">127</Text>
              <Text className="text-sm text-gray-600 text-center">Bài đã hoàn thành</Text>
              <Text className="text-xs text-green-500 font-medium">Xuất sắc! 📚</Text>
            </View>

            <View className="items-center flex-1">
              <ExpoLinearGradient
                colors={['#9333ea', '#a855f7']}
                className="p-4 rounded-2xl mb-3 shadow-md"
              >
                <Award size={28} color="white" />
              </ExpoLinearGradient>
              <Text className="text-3xl font-bold text-purple-500 mb-1">3</Text>
              <Text className="text-sm text-gray-600 text-center">Kỹ năng thành thạo</Text>
              <Text className="text-xs text-purple-500 font-medium">Chuyên gia! 🏆</Text>
            </View>
          </View>

          {/* Motivation Quote */}
          <View className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
            <Text className="text-center text-indigo-700 font-medium italic">
              {"Mỗi ngày học một chút, mỗi ngày tiến bộ một chút!"} ✨
            </Text>
          </View>
        </ExpoLinearGradient>
      </View>

      {/* Quick Actions */}
      <View className="mx-4 mb-8">
        <Text className="text-xl font-bold text-gray-800 mb-4">Hành động nhanh</Text>
        <View className="flex-row space-x-4">
          <TouchableOpacity className="flex-1">
            <ExpoLinearGradient
              colors={['#06b6d4', '#22d3ee']}
              className="p-4 rounded-2xl items-center shadow-lg"
            >
              <Clock size={24} color="white" />
              <Text className="text-white font-semibold mt-2">Ôn tập</Text>
              <Text className="text-white/80 text-xs">15 từ cần ôn</Text>
            </ExpoLinearGradient>
          </TouchableOpacity>

          <TouchableOpacity className="flex-1">
            <ExpoLinearGradient
              colors={['#f59e0b', '#fbbf24']}
              className="p-4 rounded-2xl items-center shadow-lg"
            >
              <Zap size={24} color="white" />
              <Text className="text-white font-semibold mt-2">Thử thách</Text>
              <Text className="text-white/80 text-xs">Hôm nay</Text>
            </ExpoLinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
