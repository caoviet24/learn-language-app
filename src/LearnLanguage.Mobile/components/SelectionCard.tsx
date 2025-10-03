import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Check } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

interface OptionItem {
    id: number;
    name: string;
    level?: string;
    flag?: string;
}

interface OptionButtonProps {
    item: OptionItem;
    isSelected: boolean;
    onPress: () => void;
    type: 'topic' | 'level' | 'language';
}

interface SelectionCardProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    icon: React.ComponentType<any>;
}

export const OptionButton: React.FC<OptionButtonProps> = ({ item, isSelected, onPress, type }) => {
    const { t } = useTranslation();

    let displayText = '';
    if (type === 'topic') {
        displayText = t(item.name);
    } else if (type === 'level') {
        displayText = `${t(item.name)}`;
    } else if (type === 'language') {
        displayText = `${item.flag} ${t(item.name)}`;
    }

    return (
        <TouchableOpacity
            onPress={onPress}
            className={`p-4 rounded-xl border ${
                isSelected ? 'bg-blue-50 border-blue-500' : 'bg-white border-gray-200'
            } flex-row items-center justify-between`}
            style={{ zIndex: 1 }}
        >
            <Text className={`font-medium ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>{displayText}</Text>
            {isSelected && <Check size={20} color="#3b82f6" />}
        </TouchableOpacity>
    );
};

export const SelectionCard: React.FC<SelectionCardProps> = ({ title, subtitle, children, icon: IconComponent }) => {
    return (
        <View className="mb-6">
            <View className="flex-row items-center mb-3">
                <IconComponent size={20} color="#6b7280" />
                <Text className="text-lg font-bold text-gray-800 ml-2">{title}</Text>
            </View>
            {subtitle && <Text className="text-gray-600 mb-3 ml-7">{subtitle}</Text>}
            <View className="space-y-3 gap-2">{children}</View>
        </View>
    );
};
