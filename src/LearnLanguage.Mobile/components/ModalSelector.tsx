import React from "react";
import { View, Text, TouchableOpacity, Modal, ScrollView } from "react-native";
import { X, Check } from "lucide-react-native";
import { useTranslation } from 'react-i18next';

interface OptionItem {
  id: number;
  name: string;
  level?: string;
  flag?: string;
}

interface ModalSelectorProps {
 visible: boolean;
  title: string;
  options: OptionItem[];
  selectedId: number | null;
  onClose: () => void;
  onSelect: (id: number) => void;
  type: 'topic' | 'level' | 'language';
}

const ModalSelector: React.FC<ModalSelectorProps> = ({
  visible,
  title,
  options,
  selectedId,
  onClose,
  onSelect,
  type
}) => {
  const { t } = useTranslation();

  const getDisplayText = (item: OptionItem) => {
    if (type === 'topic') {
      return t(item.name);
    } else if (type === 'level') {
      return `${t(item.name)} (${item.level})`;
    } else if (type === 'language') {
      return `${item.flag} ${t(item.name)}`;
    }
    return '';
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center px-4" style={{ zIndex: 9999 }}>
        <View className="w-full bg-white rounded-2xl max-h-3/4 overflow-hidden" style={{ zIndex: 10000 }}>
          {/* Header */}
          <View className="flex-row items-center justify-between p-4 bg-gray-50 border-b">
            <Text className="text-lg font-bold text-gray-800">{title}</Text>
            <TouchableOpacity onPress={onClose} className="p-1">
              <X size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          
          {/* Options List */}
          <ScrollView className="p-2">
            {options.map((option) => (
              <TouchableOpacity
                key={option.id}
                onPress={() => {
                  onSelect(option.id);
                  onClose();
                }}
                className={`p-4 border-b border-gray-100 flex-row items-center justify-between ${
                  selectedId === option.id ? 'bg-blue-50' : 'bg-white'
                }`}
              >
                <Text className={`font-medium ${
                  selectedId === option.id ? 'text-blue-700' : 'text-gray-700'
                }`}>
                  {getDisplayText(option)}
                </Text>
                {selectedId === option.id && <Check size={20} color="#3b82f6" />}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default ModalSelector;