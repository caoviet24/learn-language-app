import { Text, TextInput, View } from "react-native";
import { ReactNode } from "react";

interface InputProps {
    label?: string;
    icon?: ReactNode;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    error?: string;
    [key: string]: any;
}

export default function Input({
    label,
    icon,
    value,
    onChangeText,
    placeholder,
    error,
    ...props
}: InputProps) {
    return (
        <View>
            <Text className="text-sm text-gray-600 mb-2">{label}</Text>
            <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-gray-50">
                {icon}
                <TextInput
                    className="flex-1 ml-2 text-base text-gray-800 leading-5"
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor="#9CA3AF"
                    {...props}
                />
            </View>
            {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
        </View>
    );
}
