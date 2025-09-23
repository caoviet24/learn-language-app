import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing } from 'react-native';
import Svg, {
    Path,
    Circle,
    Ellipse,
    G,
    Defs,
    LinearGradient,
    Stop,
    RadialGradient,
} from 'react-native-svg';

const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedView = Animated.createAnimatedComponent(View);

interface GreenDuolingoMascotProps {
    size?: number;
}

export default function LingoMascot({ size = 80 }: GreenDuolingoMascotProps) {
    const blinkAnimation = useRef(new Animated.Value(1)).current;
    const headTurnAnimation = useRef(new Animated.Value(0)).current;
    const jumpAnimation = useRef(new Animated.Value(0)).current;
    const bodySquishAnimation = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Blink animation
        const blink = () => {
            Animated.sequence([
                Animated.timing(blinkAnimation, {
                    toValue: 0,
                    duration: 120,
                    useNativeDriver: false,
                }),
                Animated.timing(blinkAnimation, {
                    toValue: 1,
                    duration: 120,
                    useNativeDriver: false,
                }),
            ]).start();
        };

        // Head turn animation
        const headTurn = Animated.loop(
            Animated.sequence([
                Animated.timing(headTurnAnimation, {
                    toValue: 1,
                    duration: 2000,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: false,
                }),
                Animated.timing(headTurnAnimation, {
                    toValue: -1,
                    duration: 4000,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: false,
                }),
                Animated.timing(headTurnAnimation, {
                    toValue: 0,
                    duration: 2000,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: false,
                }),
            ])
        );

        // Jump animation
        const jump = Animated.loop(
            Animated.sequence([
                Animated.timing(jumpAnimation, {
                    toValue: 1,
                    duration: 500,
                    easing: Easing.out(Easing.quad),
                    useNativeDriver: true,
                }),
                Animated.timing(jumpAnimation, {
                    toValue: 0,
                    duration: 500,
                    easing: Easing.in(Easing.quad),
                    useNativeDriver: true,
                }),
                Animated.delay(1500),
            ])
        );

        // Body squish animation (when jumping)
        const bodySquish = Animated.loop(
            Animated.sequence([
                Animated.timing(bodySquishAnimation, {
                    toValue: 0.9,
                    duration: 100,
                    useNativeDriver: false,
                }),
                Animated.timing(bodySquishAnimation, {
                    toValue: 1.1,
                    duration: 400,
                    easing: Easing.out(Easing.bounce),
                    useNativeDriver: false,
                }),
                Animated.timing(bodySquishAnimation, {
                    toValue: 1,
                    duration: 500,
                    easing: Easing.inOut(Easing.quad),
                    useNativeDriver: false,
                }),
                Animated.delay(1500),
            ])
        );

        headTurn.start();
        jump.start();
        bodySquish.start();

        // Random blink
        const blinkInterval = setInterval(() => {
            if (Math.random() > 0.6) {
                blink();
            }
        }, 1500);

        return () => {
            clearInterval(blinkInterval);
            headTurn.stop();
            jump.stop();
            bodySquish.stop();
        };
    }, []);

    const headRotation = headTurnAnimation.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: ['-15deg', '0deg', '15deg'],
    });

    const jumpY = jumpAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -20],
    });

    const eyePositionX = headTurnAnimation.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: [2, 0, -2],
    });

    const eyeHeight = blinkAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 8],
    });

    const bodyScaleY = bodySquishAnimation;

    return (
        <AnimatedView
            style={{
                transform: [{ translateY: jumpY }],
            }}
        >
            <Svg width={size} height={size * 1.2} viewBox="0 0 100 120">
                <Defs>
                    {/* Body gradient */}
                    <RadialGradient id="bodyGradient" cx="50%" cy="40%">
                        <Stop offset="0%" stopColor="#58CC02" />
                        <Stop offset="70%" stopColor="#4CAF50" />
                        <Stop offset="100%" stopColor="#388E3C" />
                    </RadialGradient>

                    {/* Head gradient */}
                    <RadialGradient id="headGradient" cx="50%" cy="30%">
                        <Stop offset="0%" stopColor="#66D734" />
                        <Stop offset="70%" stopColor="#58CC02" />
                        <Stop offset="100%" stopColor="#4CAF50" />
                    </RadialGradient>

                    {/* Beak gradient */}
                    <RadialGradient id="beakGradient" cx="30%" cy="30%">
                        <Stop offset="0%" stopColor="#FFA726" />
                        <Stop offset="100%" stopColor="#FF9800" />
                    </RadialGradient>

                    {/* Shadow */}
                    <RadialGradient id="shadowGradient" cx="50%" cy="50%">
                        <Stop offset="0%" stopColor="#000000" stopOpacity="0.3" />
                        <Stop offset="100%" stopColor="#000000" stopOpacity="0" />
                    </RadialGradient>
                </Defs>

                {/* Shadow */}
                <Ellipse
                    cx="50"
                    cy="110"
                    rx="25"
                    ry="6"
                    fill="url(#shadowGradient)"
                />

                {/* Body */}
                <AnimatedG
                    scaleY={bodyScaleY}
                    originY="70"
                >
                    <Ellipse
                        cx="50"
                        cy="70"
                        rx="28"
                        ry="25"
                        fill="url(#bodyGradient)"
                        stroke="#2E7D00"
                        strokeWidth="1.5"
                    />
                </AnimatedG>

                {/* Head */}
                <AnimatedG

                    transform={[
                        { rotate: headRotation }
                    ]}


                >
                    {/* Head circle */}
                    <Circle
                        cx="50"
                        cy="35"
                        r="22"
                        fill="url(#headGradient)"
                        stroke="#2E7D00"
                        strokeWidth="1.5"
                    />

                    {/* Eyes background (white) */}
                    <AnimatedG translateX={eyePositionX}>
                        <Ellipse cx="42" cy="32" rx="7" ry={8} fill="white" />
                        <Ellipse cx="58" cy="32" rx="7" ry={8} fill="white" />
                    </AnimatedG>

                    {/* Eye pupils */}
                    <AnimatedG translateX={eyePositionX}>
                        <Ellipse
                            cx="42"
                            cy="32"
                            rx="4"
                            ry={Number(eyeHeight)}
                            fill="#1A237E"
                        />
                        <Ellipse
                            cx="58"
                            cy="32"
                            rx="4"
                            ry={Number(eyeHeight)}
                            fill="#1A237E"
                        />
                    </AnimatedG>

                    {/* Eye highlights */}
                    <AnimatedG translateX={eyePositionX}>
                        <Circle cx="44" cy="30" r="1.5" fill="white" opacity="0.9" />
                        <Circle cx="60" cy="30" r="1.5" fill="white" opacity="0.9" />
                    </AnimatedG>

                    {/* Beak */}
                    <Path
                        d="M 50 42 L 46 47 L 54 47 Z"
                        fill="url(#beakGradient)"
                        stroke="#E65100"
                        strokeWidth="1"
                    />

                    {/* Beak highlight */}
                    <Path
                        d="M 50 43 L 48 45 L 52 45 Z"
                        fill="#FFB74D"
                        opacity="0.8"
                    />
                </AnimatedG>

                {/* Arms/Wings */}
                <Ellipse
                    cx="25"
                    cy="55"
                    rx="8"
                    ry="15"
                    fill="url(#bodyGradient)"
                    stroke="#2E7D00"
                    strokeWidth="1"
                    transform="rotate(-20 25 55)"
                />
                <Ellipse
                    cx="75"
                    cy="55"
                    rx="8"
                    ry="15"
                    fill="url(#bodyGradient)"
                    stroke="#2E7D00"
                    strokeWidth="1"
                    transform="rotate(20 75 55)"
                />

                {/* Belly highlight */}
                <Ellipse
                    cx="50"
                    cy="65"
                    rx="18"
                    ry="12"
                    fill="#7ED321"
                    opacity="0.4"
                />

                {/* Feet */}
                <Ellipse
                    cx="42"
                    cy="95"
                    rx="6"
                    ry="8"
                    fill="#FF9800"
                    stroke="#E65100"
                    strokeWidth="1"
                />
                <Ellipse
                    cx="58"
                    cy="95"
                    rx="6"
                    ry="8"
                    fill="#FF9800"
                    stroke="#E65100"
                    strokeWidth="1"
                />

                {/* Toe details */}
                <Circle cx="40" cy="100" r="2" fill="#FFB74D" />
                <Circle cx="44" cy="100" r="2" fill="#FFB74D" />
                <Circle cx="56" cy="100" r="2" fill="#FFB74D" />
                <Circle cx="60" cy="100" r="2" fill="#FFB74D" />
            </Svg>
        </AnimatedView>
    );
}