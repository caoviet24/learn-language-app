import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Note {
  id: string;
  text: string;
}

interface Topic {
  id: string;
  name: string;
  notes: Note[];
}

interface NotebookProps {
  visible: boolean;
  onClose: () => void;
  initialTopics?: Topic[];
}

export default function Notebook({ visible, onClose, initialTopics = [] }: NotebookProps) {
  const [topics, setTopics] = useState<Topic[]>(initialTopics);
  const [newTopicName, setNewTopicName] = useState("");
  const [newNoteText, setNewNoteText] = useState("");
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [expandedTopics, setExpandedTopics] = useState<string[]>([]);
  const [isAddingNote, setIsAddingNote] = useState(false);

  const addTopic = () => {
    if (newTopicName.trim() === "") {
      Alert.alert("Error", "Please enter a topic name");
      return;
    }

    const newTopic: Topic = {
      id: Date.now().toString(),
      name: newTopicName.trim(),
      notes: [],
    };

    setTopics([...topics, newTopic]);
    setNewTopicName("");
  };

  const addNote = () => {
    if (!selectedTopicId) {
      Alert.alert("Error", "Please select a topic first");
      return;
    }

    if (newNoteText.trim() === "") {
      Alert.alert("Error", "Please enter note content");
      return;
    }

    setTopics(topics.map(topic => {
      if (topic.id === selectedTopicId) {
        const newNote: Note = {
          id: Date.now().toString(),
          text: newNoteText.trim(),
        };
        return {
          ...topic,
          notes: [...topic.notes, newNote],
        };
      }
      return topic;
    }));

    setNewNoteText("");
    setIsAddingNote(false);
  };

  const toggleTopic = (id: string) => {
    setExpandedTopics(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const handleDeleteNote = (topicId: string, noteId: string) => {
    setTopics(topics.map(topic => {
      if (topic.id === topicId) {
        return {
          ...topic,
          notes: topic.notes.filter(note => note.id !== noteId),
        };
      }
      return topic;
    }));
  };

  const handleDeleteTopic = (topicId: string) => {
    Alert.alert(
      "Delete Topic",
      "Are you sure you want to delete this topic and all its notes?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setTopics(topics.filter(topic => topic.id !== topicId));
            if (selectedTopicId === topicId) {
              setSelectedTopicId(null);
            }
          }
        }
      ]
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/60 justify-center items-center">
        <View className="bg-gray-900 w-11/12 rounded-2xl p-4 max-h-[80%]">
          <View className="flex-row justify-between items-center border-b border-gray-700 pb-2 mb-4">
            <Text className="text-white text-lg font-bold">Notebook</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <ScrollView>
            {/* Add new topic section */}
            <View className="mb-4">
              <View className="flex-row items-center mb-2">
                <TextInput
                  value={newTopicName}
                  onChangeText={setNewTopicName}
                  placeholder="Enter new topic name..."
                  placeholderTextColor="#9CA3AF"
                  className="flex-1 bg-slate-100 rounded-2xl px-4 py-3 text-base text-slate-700 border border-slate-200"
                />
                <TouchableOpacity
                  onPress={addTopic}
                  className="ml-2 bg-indigo-500 rounded-2xl px-4 py-3"
                  activeOpacity={0.8}
                >
                  <Ionicons name="add" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Topic list */}
            {topics.map((topic) => (
              <View key={topic.id} className="mb-3 border border-slate-200 rounded-2xl overflow-hidden">
                <TouchableOpacity
                  onPress={() => toggleTopic(topic.id)}
                  className="flex-row justify-between items-center bg-slate-50 p-3"
                >
                  <View className="flex-row items-center flex-1">
                    <Ionicons
                      name={
                        expandedTopics.includes(topic.id)
                          ? "chevron-down"
                          : "chevron-forward"
                      }
                      size={18}
                      color="#4B5563"
                      style={{ marginRight: 6 }}
                    />
                    <Text className="text-slate-800 font-semibold flex-1">
                      {topic.name}
                    </Text>
                  </View>
                  <View className="flex-row">
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedTopicId(topic.id);
                        setIsAddingNote(true);
                      }}
                      className="p-1 mr-2"
                    >
                      <Ionicons name="add-circle-outline" size={20} color="#10B981" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDeleteTopic(topic.id)}
                      className="p-1"
                    >
                      <Ionicons name="trash-outline" size={20} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>

                {expandedTopics.includes(topic.id) && (
                  <View className="bg-white p-3">
                    {/* Add note to this topic */}
                    {isAddingNote && selectedTopicId === topic.id && (
                      <View className="mb-3 flex-row items-center">
                        <TextInput
                          value={newNoteText}
                          onChangeText={setNewNoteText}
                          placeholder="Add a note..."
                          placeholderTextColor="#9CA3AF"
                          className="flex-1 bg-slate-100 rounded-2xl px-4 py-2 text-base text-slate-700 border border-slate-200 mr-2"
                        />
                        <TouchableOpacity
                          onPress={addNote}
                          className="bg-emerald-500 rounded-xl px-3 py-2"
                        >
                          <Ionicons name="checkmark" size={20} color="white" />
                        </TouchableOpacity>
                      </View>
                    )}

                    {/* Notes list */}
                    {topic.notes.length > 0 ? (
                      <View>
                        {topic.notes.map((note) => (
                          <View
                            key={note.id}
                            className="flex-row justify-between items-center bg-slate-50 rounded-xl p-3 mb-2"
                          >
                            <Text className="text-slate-700 flex-1 mr-2">{note.text}</Text>
                            <TouchableOpacity
                              onPress={() => handleDeleteNote(topic.id, note.id)}
                            >
                              <Ionicons name="close" size={18} color="#EF4444" />
                            </TouchableOpacity>
                          </View>
                        ))}
                      </View>
                    ) : (
                      <Text className="text-slate-500 text-center py-2">
                        No notes yet
                      </Text>
                    )}
                  </View>
                )}
              </View>
            ))}

            {topics.length === 0 && (
              <View className="items-center justify-center py-8">
                <Ionicons name="book-outline" size={48} color="#D1D5DB" />
                <Text className="text-slate-500 mt-2">No topics yet</Text>
                <Text className="text-slate-400 text-sm mt-1">
                  Add your first topic to start taking notes
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}