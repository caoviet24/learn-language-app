import authService from '@/services/auth-service';
import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { Mail, Lock } from 'lucide-react-native';
import { Link, useRouter } from 'expo-router';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as SecureStore from 'expo-secure-store';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const loginMutation = useMutation({
        mutationFn: async () => {
            console.log('Đang đăng nhập với email:', email, 'và password:', password);

            const res = await authService.login({ email, password });
            return res;
        },
        onSuccess: async (data) => {
            console.log('Đăng nhập thành công:', data);

            const { data: _data, message, success } = data;

            if (!success) {
                console.error('Đăng nhập không thành công:', message);
                setError(message || 'Đăng nhập không thành công');
                return;
            }

            if (_data) {
                console.log('Lưu token:', _data.access_token);
                await SecureStore.setItemAsync('access_token', _data.access_token);
                await SecureStore.setItemAsync('refresh_token', _data.refresh_token);
                router.push('/');
            }
        },

        onError: (error) => {
            console.error('Lỗi đăng nhập:', error);
            setError('Thông tin đăng nhập không chính xác');
        },
    });

    return (
        <KeyboardAwareScrollView
            style={{ flex: 1, backgroundColor: '#f9fafb' }}
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                <View className="flex-1 justify-center items-center px-6 py-12">
                    <Image source={require('../assets/images/logo.png')} className="w-40 h-40" resizeMode="contain" />
                    <View className="w-full bg-white rounded-2xl p-6 shadow-lg">
                        <View className="gap-3">
                            <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-gray-50">
                                <Mail size={20} color="#6B7280" />
                                <TextInput
                                    className="flex-1 ml-2 text-base text-gray-800 leading-5"
                                    placeholder="Tài khoản/Tên đăng nhập"
                                    value={email}
                                    onChangeText={setEmail}
                                    onFocus={() => setError('')}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                    placeholderTextColor="#9CA3AF"
                                />
                            </View>

                            <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-gray-50">
                                <Lock size={20} color="#6B7280" />
                                <TextInput
                                    className="flex-1 ml-2 text-base text-gray-800 leading-5"
                                    placeholder="Nhập mật khẩu"
                                    value={password}
                                    onChangeText={setPassword}
                                    onFocus={() => setError('')}
                                    secureTextEntry
                                    placeholderTextColor="#9CA3AF"
                                />
                            </View>

                            <Text className="text-red-500">{error}</Text>
                        </View>

                        <TouchableOpacity
                            className={`bg-blue-600 py-3 rounded-xl shadow-md my-4 ${
                                loginMutation.isPending ? 'opacity-50' : ''
                            }`}
                            onPress={() => loginMutation.mutate()}
                            disabled={loginMutation.isPending}
                        >
                            <View className="flex-row justify-center items-center">
                                {loginMutation.isPending ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <Text className="text-white text-center font-semibold text-base">Đăng nhập</Text>
                                )}
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity>
                            <Text className="text-blue-500 text-center text-sm">Quên mật khẩu?</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row items-center w-full my-6">
                        <View className="flex-1 h-px bg-gray-300" />
                        <Text className="px-3 text-gray-500 text-sm">hoặc</Text>
                        <View className="flex-1 h-px bg-gray-300" />
                    </View>

                    <TouchableOpacity
                        className="w-full bg-gray-100 py-3 rounded-xl shadow-sm border border-gray-300"
                        onPress={() => console.log('Tiếp tục với guest')}
                    >
                        <Text className="text-gray-700 text-center font-medium">Tiếp tục với Guest</Text>
                    </TouchableOpacity>

                    <View className="mt-8 flex-row justify-center">
                        <Text className="text-gray-600">Chưa có tài khoản? </Text>
                        <Link href="/register">
                            <Text className="text-blue-600 font-semibold">Đăng ký</Text>
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAwareScrollView>
    );
}
