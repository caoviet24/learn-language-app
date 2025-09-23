import React, { useState } from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Note {
    id: string;
    text: string;
}

interface Lesson {
    id: string;
    name: string;
    notes: Note[];
}

interface Topic {
    id: string;
    name: string;
    lessons: Lesson[];
}

interface NotebookDialogProps {
    visible: boolean;
    onClose: () => void;
}

const mockData: Topic[] = [
    {
        id: "topic1",
        name: "Chủ đề 1: Thức ăn",
        lessons: [
            {
                id: "lesson1",
                name: "Bài 1: Từ vựng cơ bản",
                notes: [
                    { id: "n1", text: "Sugar = đường" },
                    { id: "n2", text: "Bread = bánh mì" },
                ],
            },
            {
                id: "lesson2",
                name: "Bài 2: Món ăn",
                notes: [{ id: "n3", text: "Rice = cơm" }],
            },
        ],
    },
    {
        id: "topic2",
        name: "Chủ đề 2: Gia đình",
        lessons: [
            {
                id: "lesson3",
                name: "Bài 1: Người thân",
                notes: [{ id: "n4", text: "Family = gia đình" }],
            },
        ],
    },
];

export default function NotebookDialog({ visible, onClose }: NotebookDialogProps) {
    const [expandedTopics, setExpandedTopics] = useState<string[]>([]);
    const [expandedLessons, setExpandedLessons] = useState<string[]>([]);

    const toggleTopic = (id: string) => {
        setExpandedTopics((prev) =>
            prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
        );
    };

    const toggleLesson = (id: string) => {
        setExpandedLessons((prev) =>
            prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
        );
    };

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View className="flex-1 bg-black/60 justify-center items-center">
                <View className="bg-gray-900 w-11/12 rounded-2xl p-4 max-h-[80%]">
                    <View className="flex-row justify-between items-center border-b border-gray-700 pb-2 mb-4">
                        <Text className="text-white text-lg font-bold">Notebook</Text>
                        <TouchableOpacity onPress={() => {
                            setExpandedTopics([]);
                            setExpandedLessons([]);
                            onClose();
                        }}>
                            <Ionicons name="close" size={24} color="white" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView>
                        {mockData.map((topic) => (
                            <View key={topic.id} className="mb-3">
                                <TouchableOpacity
                                    onPress={() => toggleTopic(topic.id)}
                                    className="flex-row items-center py-2"
                                >
                                    <Ionicons
                                        name={
                                            expandedTopics.includes(topic.id)
                                                ? "chevron-down"
                                                : "chevron-forward"
                                        }
                                        size={18}
                                        color="white"
                                        style={{ marginRight: 6 }}
                                    />
                                    <Text className="text-pink-400 font-bold">{topic.name}</Text>
                                </TouchableOpacity>

                                {/* Lessons */}
                                {expandedTopics.includes(topic.id) &&
                                    topic.lessons.map((lesson) => (
                                        <View key={lesson.id} className="ml-6 mb-2">
                                            <TouchableOpacity
                                                onPress={() => toggleLesson(lesson.id)}
                                                className="flex-row items-center py-1"
                                            >
                                                <Ionicons
                                                    name={
                                                        expandedLessons.includes(lesson.id)
                                                            ? "chevron-down"
                                                            : "chevron-forward"
                                                    }
                                                    size={16}
                                                    color="white"
                                                    style={{ marginRight: 6 }}
                                                />
                                                <Text className="text-blue-400">{lesson.name}</Text>
                                            </TouchableOpacity>

                                            {expandedLessons.includes(lesson.id) &&
                                                lesson.notes.map((note) => (
                                                    <Text
                                                        key={note.id}
                                                        className="ml-8 text-white text-sm py-1"
                                                    >
                                                        • {note.text}
                                                    </Text>
                                                ))}
                                        </View>
                                    ))}
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}
