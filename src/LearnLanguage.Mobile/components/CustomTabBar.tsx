import React from "react";
import { TouchableOpacity, Text, View, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

interface TabConfig {
    focused: keyof typeof Ionicons.glyphMap;
    unfocused: keyof typeof Ionicons.glyphMap;
    label: string;
}

const TAB_CONFIG: Record<string, TabConfig> = {
    index: {
        focused: "book",
        unfocused: "book-outline",
        label: "Trang chủ"
    },
    vocabulary: {
        focused: "bookmarks",
        unfocused: "bookmarks-outline",
        label: "Từ vựng"
    },
    settings: {
        focused: "settings",
        unfocused: "settings-outline",
        label: "Cài đặt"
    },
    user: {
        focused: "person-circle",
        unfocused: "person-circle-outline",
        label: "Test"
    }
};

const COLORS = {
    active: "#22c55e",
    inactive: "#9ca3af",
    background: "#ffffff",
    shadow: "#00000010"
};

export default function CustomTabBar({
    state,
    descriptors,
    navigation,
}: BottomTabBarProps) {
    const animatedValues = React.useRef(
        state.routes.map(() => new Animated.Value(0))
    ).current;

    React.useEffect(() => {
        animatedValues.forEach((animatedValue, index) => {
            const isFocused = state.index === index;
            Animated.spring(animatedValue, {
                toValue: isFocused ? 1 : 0,
                useNativeDriver: true,
                tension: 100,
                friction: 8,
            }).start();
        });
    }, [state.index]);

    const handleTabPress = React.useCallback((route: any, index: number) => {
        const isFocused = state.index === index;

        const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
        });

        if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
        }
    }, [state.index, navigation]);

    return (
        <View className="absolute bottom-0 left-0 right-0 pb-safe">
            <View className="flex-row bg-white mx-4 mb-4 rounded-2xl py-3 px-2 justify-around items-center shadow-lg border border-gray-100">
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const config = TAB_CONFIG[route.name];
                    const isFocused = state.index === index;

                    // Fallback cho route không được định nghĩa
                    const label = config?.label ||
                        (options.tabBarLabel as string) ||
                        options.title ||
                        route.name;

                    const iconName = config
                        ? (isFocused ? config.focused : config.unfocused)
                        : "ellipse-outline";

                    const scale = animatedValues[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.1],
                    });

                    const translateY = animatedValues[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -2],
                    });

                    return (
                        <TouchableOpacity
                            key={route.key}
                            onPress={() => handleTabPress(route, index)}
                            activeOpacity={0.7}
                            className="items-center flex-1 py-2 justify-center"
                            accessibilityRole="tab"
                            accessibilityState={{ selected: isFocused }}
                            accessibilityLabel={label}
                        >
                            <Animated.View
                                style={{
                                    transform: [
                                        { scale },
                                        { translateY }
                                    ],
                                }}
                                className="items-center justify-center"
                            >
                                <Ionicons
                                    className="text-center"
                                    name={iconName}
                                    size={26}
                                    color={isFocused ? COLORS.active : COLORS.inactive}
                                />
                                <Text
                                    className={`text-xs mt-1 ${isFocused
                                            ? "text-green-500 font-semibold"
                                            : "text-gray-400 font-medium"
                                        }`}
                                    numberOfLines={1}
                                >
                                    {label}
                                </Text>
                            </Animated.View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}