import React, { useState, useMemo, useRef } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Image,
    ActivityIndicator,
} from "react-native";
import { useMutation } from "@tanstack/react-query";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Mail, Lock, Check, CheckCircle, Bot } from "lucide-react-native";
import { Link, useRouter } from "expo-router";

import authService from "@/services/auth-service";
import { validateEmail } from "../utils/validateEmail";

const steps = ["Thông tin", "Email", "Mật khẩu", "Xác nhận"];

type StepType = 1 | 2 | 3 | 4;

export default function RegisterWizardScreen() {
    const [step, setStep] = useState<StepType>(1);
    const [success, setSuccess] = useState(false);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const router = useRouter();


    const errors = useMemo(() => {
        const e: Record<string, string> = {};
        if (step >= 1) {
            if (!firstName.trim()) e.firstName = "Vui lòng nhập First name";
            if (!lastName.trim()) e.lastName = "Vui lòng nhập Last name";
        }
        if (step >= 2) {
            if (!email.trim()) e.email = "Vui lòng nhập email";
            else if (!validateEmail(email)) e.email = "Email không hợp lệ";
        }
        if (step >= 3) {
            if (password.length < 6) e.password = "Mật khẩu tối thiểu 6 ký tự";
            if (confirmPassword !== password) e.confirmPassword = "Xác nhận không khớp";
        }
        return e;
    }, [step, firstName, lastName, email, password, confirmPassword]);

    const isStepValid = useMemo(() => {
        if (step === 1) return firstName.trim() && lastName.trim();
        if (step === 2) return email.trim() && validateEmail(email);
        if (step === 3) return password.length >= 6 && confirmPassword === password;
        return true;
    }, [step, firstName, lastName, email, password, confirmPassword]);

    const registerMutation = useMutation({
        mutationFn: () => authService.register({ firstName, lastName, email, password }),
        onSuccess: (data) => {
            console.log("Đăng ký thành công:", data);
            setSuccess(true);
        },
        onError: (err) => console.error("Lỗi đăng ký:", err),
    });

    const goNext = () => {
        if (step === 1) setTouched((t) => ({ ...t, firstName: true, lastName: true }));
        if (step === 2) setTouched((t) => ({ ...t, email: true }));
        if (step === 3) setTouched((t) => ({ ...t, password: true, confirmPassword: true }));

        if (isStepValid && step < 4) setStep((s) => ((s + 1) as StepType));
    };
    const goBack = () => setStep((s) => (s > 1 ? ((s - 1) as StepType) : s));

    if (registerMutation.isPending) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-50 px-6">
                <Image
                    source={require("../assets/images/logo.png")}
                    className="w-40 h-40"
                    resizeMode="contain"
                />
                <ActivityIndicator size="large" color="gray" />
            </View>
        )
    }

    if (success) {
        return (
            <View className="flex-1 items-center justify-center bg-white px-6">
                <Image
                    source={require("../assets/images/logo.png")}
                    className="w-44 h-44"
                    resizeMode="contain"
                />
                <View className="flex-col p-4 bg-white rounded-xl w-full">


                    <View className="flex-row items-start">
                        <CheckCircle size={24} color="#4CAF50" className="mt-1" />
                        <Text className="ml-2 text-gray-800 text-lg font-semibold flex-shrink">
                            Chúng tôi đã gửi email xác nhận, vui lòng kiểm tra hộp thư.
                        </Text>
                    </View>


                    <TouchableOpacity
                        className={`bg-blue-600 py-3 rounded-xl shadow-md my-4`}
                        onPress={() => {
                            setSuccess(false);
                            setStep(1);
                            setFirstName("");
                            setLastName("");
                            setEmail("");
                            setPassword("");
                            setConfirmPassword("");
                            setTouched({});
                            router.push("/login");
                        }}
                    >
                        <Text className="text-white text-center font-semibold text-base">
                            Quay lại đăng nhập
                        </Text>
                    </TouchableOpacity>
                </View>

            </View>
        );
    }

    return (
        <KeyboardAwareScrollView
            style={{ flex: 1, backgroundColor: "#f9fafb" }}
            contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingHorizontal: 24, paddingVertical: 40 }}
            enableOnAndroid
            keyboardShouldPersistTaps="handled"
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                <View className="flex-1 px-6 py-10">
                    <View className="items-center mb-6">
                        <Image source={require("../assets/images/logo.png")} className="w-40 h-40" resizeMode="contain" />
                        <Text className="text-xl font-semibold text-gray-800">Đăng kí tài khoản</Text>
                    </View>

                    <Stepper step={step} />

                    <View className="w-full bg-white rounded-2xl p-6 shadow-lg">
                        {step === 1 && (
                            <View className="gap-3">
                                <Input
                                    label="First name"
                                    icon={<Bot size={20} color="#6B7280" />}
                                    value={firstName}
                                    onChangeText={(v: string) => {
                                        setFirstName(v);
                                        setTouched((t) => ({ ...t, firstName: true }));
                                    }}
                                    placeholder="Tên"
                                    error={touched.firstName && errors.firstName}
                                />
                                <Input
                                    label="Last name"
                                    icon={<Bot size={20} color="#6B7280" />}
                                    value={lastName}
                                    onChangeText={(v: string) => {
                                        setLastName(v);
                                        setTouched((t) => ({ ...t, lastName: true }));
                                    }}
                                    placeholder="Họ"
                                    error={touched.lastName && errors.lastName}
                                />
                            </View>
                        )}
                        {step === 2 &&
                            <Input
                                label="Email"
                                icon={<Mail size={20} color="#6B7280" />}
                                value={email}
                                onChangeText={(v: string) => { setEmail(v); setTouched((t) => ({ ...t, email: true })); }}
                                placeholder="learn-app@gmail.com"
                                autoCapitalize="none"
                                keyboardType="email-address"
                                error={touched.email && errors.email}
                            />}
                        {step === 3 && (
                            <View className="gap-3">
                                <Input
                                    label="Mật khẩu"
                                    icon={<Lock size={20} color="#6B7280" />}
                                    value={password}
                                    onChangeText={(v: string) => { setPassword(v); setTouched((t) => ({ ...t, password: true })); }}
                                    placeholder="Tối thiểu 6 ký tự"
                                    secureTextEntry
                                    error={touched.password && errors.password}
                                />
                                <Input
                                    label="Xác nhận mật khẩu"
                                    icon={<Lock size={20} color="#6B7280" />}
                                    value={confirmPassword}
                                    onChangeText={(v: string) => { setConfirmPassword(v); setTouched((t) => ({ ...t, confirmPassword: true })); }}
                                    placeholder="Nhập lại mật khẩu"
                                    secureTextEntry
                                    error={touched.confirmPassword && errors.confirmPassword}
                                />
                            </View>
                        )}
                        {step === 4 &&
                            <View className="gap-4">
                                <Text className="text-base font-semibold text-gray-800">Xác nhận thông tin</Text>
                                <View className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                    <Row label="First name" value={firstName} />
                                    <Row label="Last name" value={lastName} />
                                    <Row label="Email" value={email} />
                                </View>
                                <Text className="text-gray-500 text-xs">* Mật khẩu được ẩn vì lý do bảo mật</Text>
                            </View>}
                    </View>

                    <View className="mt-4 flex-row gap-3">
                        {step > 1 && (
                            <Button gray onPress={goBack} disabled={registerMutation.isPending} label="Quay lại" />
                        )}

                        {step < 4 ? (
                            <Button blue disabled={!isStepValid || registerMutation.isPending} onPress={goNext} label="Tiếp tục" />
                        ) : (
                            <Button
                                blue
                                disabled={registerMutation.isPending}
                                onPress={() => registerMutation.mutate()}
                                loading={registerMutation.isPending}
                                label="Đăng ký"
                            />
                        )}
                    </View>

                    <View className="mt-8 flex-row justify-center">
                        <Text className="text-gray-600">Đã có tài khoản? </Text>
                        <Link href="/login">
                            <Text className="text-blue-600 font-semibold">Đăng nhập</Text>
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAwareScrollView>
    );
}


function Stepper({ step }: { step: StepType }) {
    return (
        <View className="w-full mb-4">
            <View className="flex-row justify-between items-center">
                {steps.map((_, idx) => {
                    const index = (idx + 1) as StepType;
                    const active = step === index;
                    const done = step > index;
                    return (
                        <React.Fragment key={index}>
                            <View className={`w-8 h-8 rounded-full items-center justify-center ${done ? "bg-green-500" : active ? "bg-blue-600" : "bg-gray-300"}`}>
                                {done ? <Check size={18} color="#fff" /> : <Text className="text-white text-sm">{index}</Text>}
                            </View>
                            {index !== 4 && <View className="flex-1 h-0.5 bg-gray-300 mx-2" />}
                        </React.Fragment>
                    );
                })}
            </View>
            <View className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-3">
                <View style={{ width: `${((step - 1) / 3) * 100}%` }} className="h-2 bg-blue-600" />
            </View>
        </View>
    );
}


function Input({ label, icon, value, onChangeText, placeholder, error, ...props }: any) {
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

function Row({ label, value }: { label: string; value: string }) {
    return (
        <View className="flex-row justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
            <Text className="text-gray-500">{label}</Text>
            <Text className="text-gray-800 font-medium">{value || "-"}</Text>
        </View>
    );
}

function Button({ blue, gray, label, onPress, disabled, loading }: any) {
    return (
        <TouchableOpacity
            className={`flex-1 py-3 rounded-xl ${blue ? (disabled ? "bg-blue-300" : "bg-blue-600") : "bg-gray-200"}`}
            onPress={onPress}
            disabled={disabled}
        >
            <View className="flex-row justify-center items-center">
                {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text className={`text-center font-semibold ${blue ? "text-white" : "text-gray-800"}`}>{label}</Text>}
            </View>
        </TouchableOpacity>
    );
}
