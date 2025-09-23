import React from "react";
import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity, ScrollView, Switch } from "react-native";
import { Bell, User, Lock, Globe, LogOut, ChevronRight } from "lucide-react-native";

export default function SettingsScreen() {
    const router = useRouter();
    const [notifications, setNotifications] = React.useState(true);

    const MenuItem = ({ icon: Icon, title, onPress }: any) => (
        <TouchableOpacity
            onPress={onPress}
            className="flex-row items-center justify-between p-4 bg-white rounded-2xl mb-3 shadow-sm"
        >
            <View className="flex-row items-center space-x-3">
                <View className="p-2 bg-blue-100 rounded-xl">
                    <Icon size={22} color="#2563eb" />
                </View>
                <Text className="text-lg font-medium text-gray-800">{title}</Text>
            </View>
            <ChevronRight size={20} color="#9ca3af" />
        </TouchableOpacity>
    );

    return (
        <ScrollView className="flex-1 bg-gray-100 p-4">
            <Text className="text-2xl font-bold text-gray-900 mb-6">Settings</Text>

            <View className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
                <View className="flex-row items-center space-x-4">
                    <View className="w-14 h-14 bg-blue-500 rounded-full items-center justify-center">
                        <Text className="text-white text-xl font-bold">CV</Text>
                    </View>
                    <View>
                        <Text className="text-lg font-semibold text-gray-800">Cao Viet</Text>
                        <Text className="text-gray-500">caoviet@example.com</Text>
                    </View>
                </View>
            </View>

            <MenuItem icon={User} title="Account" onPress={() => { }} />
            <MenuItem icon={Lock} title="Privacy & Security" onPress={() => { }} />
            <MenuItem icon={Globe} title="Language" onPress={() => { }} />

            <View className="flex-row items-center justify-between p-4 bg-white rounded-2xl mb-3 shadow-sm">
                <View className="flex-row items-center space-x-3">
                    <View className="p-2 bg-blue-100 rounded-xl">
                        <Bell size={22} color="#2563eb" />
                    </View>
                    <Text className="text-lg font-medium text-gray-800">Notifications</Text>
                </View>
                <Switch value={notifications} onValueChange={setNotifications} />
            </View>

            <TouchableOpacity className="flex-row items-center justify-between p-4 bg-white rounded-2xl mt-6 shadow-sm" onPress={() => {
                router.replace('/login');
             }}>
                <View className="flex-row items-center space-x-3">
                    <View className="p-2 bg-red-100 rounded-xl">
                        <LogOut size={22} color="#dc2626" />
                    </View>
                    <Text className="text-lg font-medium text-red-600">Log Out</Text>
                </View>
            </TouchableOpacity>
        </ScrollView>
    );
}
