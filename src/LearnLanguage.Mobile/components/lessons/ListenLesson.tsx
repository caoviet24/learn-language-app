

import { Ionicons } from '@expo/vector-icons';
import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { memo, useCallback, useMemo } from 'react'
import { TextInput, TouchableOpacity, View } from 'react-native';

interface ListenLessonProps {
    type: 'listening' | 'video';
    media: any;
    value: string;
    onValueChange: (value: string) => void;
    disabled?: boolean;
}

const ListenLesson = memo(function ListenLesson({
    type,
    media,
    value,
    onValueChange,
    disabled = false
}: ListenLessonProps) {

    // Setup video player (cannot be inside useMemo due to React Hook rules)
    const player = useVideoPlayer(media, player => {
        player.loop = true;
        player.play();
    });

    const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });

    // Memoize input change handler
    const handleInputChange = useCallback((text: string) => {
        if (!disabled) {
            onValueChange(text);
        }
    }, [onValueChange, disabled]);

    // Memoize clear handler
    const handleClear = useCallback(() => {
        if (!disabled) {
            onValueChange("");
        }
    }, [onValueChange, disabled]);

    // Memoize video view style
    const videoViewStyle = useMemo(() => ({
        width: "100%" as const,
        height: 220,
        borderRadius: 16,
    }), []);

    // Memoize text input style
    const textInputStyle = useMemo(() => ({
        minHeight: 80
    }), []);

    if (!player) {
        return null;
    }

    return (
        <View className="gap-6">
            <View className="bg-slate-800 rounded-3xl p-4 shadow-lg">
                <VideoView
                    player={player}
                    allowsFullscreen
                    allowsPictureInPicture
                    style={videoViewStyle}
                />
            </View>
            <View className="relative">
                <TextInput
                    placeholder="Nhập câu trả lời..."
                    placeholderTextColor="#64748b"
                    value={value}
                    onChangeText={handleInputChange}
                    editable={!disabled}
                    className={`bg-slate-800 text-white p-5 rounded-2xl text-lg border-2 ${
                        disabled ? 'border-slate-500 opacity-60' : 'border-slate-600 focus:border-blue-400'
                    }`}
                    multiline
                    textAlignVertical="top"
                    style={textInputStyle}
                />
                {value.length > 0 && !disabled && (
                    <TouchableOpacity
                        onPress={handleClear}
                        className="absolute right-4 top-4 bg-slate-600 rounded-full p-1"
                    >
                        <Ionicons name="close" size={16} color="white" />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
});

export default ListenLesson;
