import { Link, Stack } from 'expo-router';
import { View, Text } from 'react-native';
import { Frown, Home } from 'lucide-react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className="flex-1 bg-gray-50 dark:bg-gray-900 justify-center items-center p-6">
        {/* Main content container */}
        <View className="items-center justify-center w-full max-w-md">
          {/* Emoji icon */}
          <View className="w-24 h-24 bg-blue-100 dark:bg-blue-900 rounded-full items-center justify-center mb-6">
            <Frown size={48} color="#3B82F6" className="text-blue-500" />
          </View>
          
          {/* Title */}
          <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center">
            Oops!
          </Text>
          
          {/* Description */}
          <Text className="text-lg text-gray-600 dark:text-gray-300 text-center mb-8 px-4">
            This screen does not exist. The page you are looking for might have been moved or removed.
          </Text>
          
          {/* Home button */}
          <Link href="/" asChild>
            <View className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl px-8 py-4 flex-row items-center justify-center shadow-md">
              <Home size={20} color="white" className="mr-2" />
              <Text className="text-white text-base font-semibold">
                Go to Home Screen
              </Text>
            </View>
          </Link>
        </View>
      </View>
    </>
  );
}
