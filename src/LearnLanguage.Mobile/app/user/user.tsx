import authService from "@/services/auth-service";
import { userService } from "@/services/user-service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import {
    View,
    Text,
    FlatList,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Modal,
    Pressable,
    Alert,
    StyleSheet,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

type User = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    nickName: string;
    role: string;
};

type ApiResponse = {
    pageNumber: number;
    pageSize: number;
    totalRecords: number;
    data: User[];
};

export default function UserListScreen() {
    const [pageNumber, setPageNumber] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const [isCreateModalVisible, setCreateModalVisible] = useState(false);

    const [newUser, setNewUser] = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
    });

    const pageSize = 10;
    const queryClient = useQueryClient();

    const { data, isLoading, error, refetch } = useQuery<ApiResponse>({
        queryKey: ["users", pageNumber, searchTerm],
        queryFn: () => userService.getAll(pageNumber, pageSize, searchTerm),
    });

    const updateUser = useMutation({
        mutationFn: (user: User) =>
            userService.update({
                userId: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            Alert.alert("Thành công", "Cập nhật người dùng thành công!");
            setModalVisible(false);
        },
        onError: () => {
            Alert.alert("Lỗi", "Không thể cập nhật người dùng.");
        },
    });

    const deleteUser = useMutation({
        mutationFn: (userId: string) => userService.remove(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            Alert.alert("Thành công", "Người dùng đã được xóa.");
            setModalVisible(false);
        },
        onError: () => {
            Alert.alert("Lỗi", "Không thể xóa người dùng.");
        },
    });

    const createUser = useMutation({
        mutationFn: () => authService.register({
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            password: newUser.password,
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            Alert.alert("Thành công", "Người dùng đã được tạo thành công!");
            setCreateModalVisible(false);
            setNewUser({ email: "", password: "", firstName: "", lastName: "" });
        },
        onError: () => {
            Alert.alert("Lỗi", "Không thể tạo người dùng.");
        },
    });

    const getInitials = (first: string, last: string) => {
        return (first?.[0] || "").toUpperCase() + (last?.[0] || "").toUpperCase();
    };

    const openModal = (user: User) => {
        setSelectedUser(user);
        setModalVisible(true);
    };

    const handleSave = () => {
        if (selectedUser) {
            updateUser.mutate(selectedUser);
        }
    };

    const handleDelete = () => {
        if (selectedUser) {
            Alert.alert(
                "Xác nhận xóa",
                "Bạn có chắc chắn muốn xóa người dùng này không?",
                [
                    { text: "Hủy", style: "cancel" },
                    { text: "Xóa", style: "destructive", onPress: () => deleteUser.mutate(selectedUser.id) },
                ]
            );
        }
    };

    const handleCreate = () => {
        if (!newUser.email || !newUser.password || !newUser.firstName || !newUser.lastName) {
            Alert.alert("Cảnh báo", "Vui lòng điền đầy đủ thông tin.");
            return;
        }
        createUser.mutate();
    };

    const renderItem = ({ item }: { item: User }) => (
        <TouchableOpacity
            onPress={() => openModal(item)}
            className="flex-row items-center bg-white rounded-xl p-4 mb-3 shadow-sm"
        >
            <View className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center mr-4">
                <Text className="text-white font-bold text-lg">
                    {getInitials(item.firstName, item.lastName)}
                </Text>
            </View>
            <View className="flex-1">
                <Text className="text-base font-semibold text-slate-800">
                    {item.firstName} {item.lastName}
                </Text>
                <Text className="text-sm text-slate-500">{item.email}</Text>
            </View>
            <View className="flex-row items-center">
                <View
                    className={`px-3 py-1 rounded-full ${item.role === "Admin" ? "bg-red-100" : "bg-green-100"}`}
                >
                    <Text className={`text-xs font-medium ${item.role === "Admin" ? "text-red-600" : "text-green-600"}`}>
                        {item.role}
                    </Text>
                </View>
                <Feather name="chevron-right" size={20} color="#94a3b8" className="ml-2" />
            </View>
        </TouchableOpacity>
    );
    
    // if (isLoading) {
    //     return (
    //         <SafeAreaView className="flex-1 items-center justify-center bg-slate-50">
    //             <ActivityIndicator size="large" color="#4f46e5" />
    //             <Text className="mt-4 text-slate-500 font-medium">Đang tải người dùng...</Text>
    //         </SafeAreaView>
    //     );
    // }

    if (error) {
        return (
            <SafeAreaView className="flex-1 items-center justify-center bg-slate-50 p-8">
                 <Feather name="alert-triangle" size={48} color="#dc2626" />
                <Text className="text-red-600 font-semibold text-lg mt-4">Failed to Load Data</Text>
                <Text className="text-slate-500 text-center mt-2 mb-6">An error occurred while fetching the user list. Please try again.</Text>
                <TouchableOpacity onPress={() => refetch()} className="bg-indigo-500 px-6 py-3 rounded-lg flex-row items-center">
                    <Feather name="refresh-cw" size={16} color="white" />
                    <Text className="text-white font-semibold ml-2">Retry</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-slate-50" edges={['top', 'left', 'right']}>
            <View className="flex-row justify-between items-center p-4">
                <Text className="text-2xl font-bold text-slate-800">Quản lý người dùng</Text>
                <TouchableOpacity
                    className="bg-indigo-500 w-10 h-10 rounded-full justify-center items-center"
                    onPress={() => setCreateModalVisible(true)}
                >
                    <Feather name="plus" size={24} color="white" />
                </TouchableOpacity>
            </View>
            
            <View className="px-4 pb-4">
                 <View className="flex-row items-center bg-white rounded-lg border border-slate-200 px-3">
                     <Feather name="search" size={20} color="#94a3b8" />
                     <TextInput
                        placeholder="Tìm kiếm người dùng...."
                        className="flex-1 h-12 ml-2 text-slate-700"
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                        placeholderTextColor="#94a3b8"
                    />
                 </View>
            </View>

            <FlatList
                data={data?.data || []}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
                ListEmptyComponent={
                    <View className="items-center justify-center mt-20">
                         <Feather name="users" size={40} color="#94a3b8" />
                        <Text className="mt-4 text-slate-500 font-medium">No users found.</Text>
                    </View>
                }
            />

            <View className="flex-row justify-between items-center p-4 border-t border-slate-200">
                <TouchableOpacity
                    className="bg-slate-200 rounded-full w-10 h-10 items-center justify-center disabled:opacity-40"
                    disabled={pageNumber === 1}
                    onPress={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
                >
                    <Feather name="arrow-left" size={20} color="#334155" />
                </TouchableOpacity>
                <Text className="text-slate-600 font-semibold">
                    Trang {pageNumber} trên {Math.max(1, Math.ceil((data?.totalRecords || 0) / pageSize))}
                </Text>
                <TouchableOpacity
                    className="bg-slate-200 rounded-full w-10 h-10 items-center justify-center disabled:opacity-40"
                    disabled={pageNumber >= Math.ceil((data?.totalRecords || 0) / pageSize)}
                    onPress={() => setPageNumber((prev) => prev + 1)}
                >
                    <Feather name="arrow-right" size={20} color="#334155" />
                </TouchableOpacity>
            </View>

            <Modal visible={isModalVisible} transparent animationType="fade">
                <View className="flex-1 bg-black/60 justify-center items-center p-4">
                    <View className="bg-white rounded-2xl p-6 w-full shadow-xl">
                        <View className="flex-row justify-between items-center mb-6">
                             <Text className="text-xl font-bold text-slate-800">Cập nhật người dùng</Text>
                             <Pressable className="p-1" onPress={() => setModalVisible(false)}>
                                 <Feather name="x" size={24} color="#64748b" />
                             </Pressable>
                        </View>
                        
    
                        <Text className="text-sm font-medium text-slate-600 mb-1">First Name</Text>
                        <TextInput style={styles.modalInput} value={selectedUser?.firstName} onChangeText={(text) => setSelectedUser((prev) => (prev ? { ...prev, firstName: text } : prev))} />
                        
                        <Text className="text-sm font-medium text-slate-600 mb-1 mt-3">Last Name</Text>
                        <TextInput style={styles.modalInput} value={selectedUser?.lastName} onChangeText={(text) => setSelectedUser((prev) => (prev ? { ...prev, lastName: text } : prev))} />
                        
                        <Text className="text-sm font-medium text-slate-600 mb-1 mt-3">Email</Text>
                        <TextInput style={styles.modalInput} value={selectedUser?.email} editable={false} />

                        <Text className="text-sm font-medium text-slate-600 mb-1 mt-3">Vai trò</Text>
                        <TextInput className={`${styles.modalInput} bg-slate-100 text-slate-500`} value={selectedUser?.role} editable={false} />

                        <View className="flex-row justify-between mt-8">
                            <TouchableOpacity onPress={handleDelete} className="bg-red-100 p-3 rounded-lg">
                                <Feather name="trash-2" size={20} color="#dc2626" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleSave} className="bg-indigo-500 px-6 py-3 rounded-lg flex-row items-center">
                                {updateUser.isPending ? <ActivityIndicator color="white" /> : <Feather name="save" size={18} color="white" />}
                                <Text className="text-white font-semibold ml-2">Thay đổi</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal visible={isCreateModalVisible} transparent animationType="fade">
                 <View className="flex-1 bg-black/60 justify-center items-center p-4">
                    <View className="bg-white rounded-2xl p-6 w-full shadow-xl">
                        <View className="flex-row justify-between items-center mb-6">
                             <Text className="text-xl font-bold text-slate-800">Tạo người dùng mới</Text>
                             <Pressable className="p-1" onPress={() => setCreateModalVisible(false)}>
                                 <Feather name="x" size={24} color="#64748b" />
                             </Pressable>
                        </View>
                        
                        <Text className="text-sm font-medium text-slate-600 mb-1">Email</Text>
                        <TextInput style={styles.modalInput} placeholder="user@example.com" value={newUser.email} onChangeText={(text) => setNewUser((prev) => ({ ...prev, email: text }))} keyboardType="email-address" autoCapitalize="none" />
                        
                        <Text className="text-sm font-medium text-slate-600 mb-1 mt-3">Password</Text>
                        <TextInput style={styles.modalInput} placeholder="••••••••" secureTextEntry value={newUser.password} onChangeText={(text) => setNewUser((prev) => ({ ...prev, password: text }))} />

                        <Text className="text-sm font-medium text-slate-600 mb-1 mt-3">First Name</Text>
                        <TextInput style={styles.modalInput} placeholder="John" value={newUser.firstName} onChangeText={(text) => setNewUser((prev) => ({ ...prev, firstName: text }))} />
                        
                        <Text className="text-sm font-medium text-slate-600 mb-1 mt-3">Last Name</Text>
                        <TextInput style={styles.modalInput} placeholder="Doe" value={newUser.lastName} onChangeText={(text) => setNewUser((prev) => ({ ...prev, lastName: text }))} />
                        
                        {/* Actions */}
                        <View className="flex-row justify-end mt-8">
                            <Pressable className="px-6 py-3 rounded-lg mr-3" onPress={() => setCreateModalVisible(false)}>
                                <Text className="text-slate-600 font-semibold">Cancel</Text>
                            </Pressable>
                            <TouchableOpacity onPress={handleCreate} disabled={createUser.isPending} className="bg-indigo-500 px-6 py-3 rounded-lg flex-row items-center disabled:opacity-60">
                                {createUser.isPending ? <ActivityIndicator color="white" /> : <Feather name="user-plus" size={18} color="white" />}
                                <Text className="text-white font-semibold ml-2">Tạo người dùng</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    modalInput: {
        borderWidth: 1,
        borderColor: '#cbd5e1',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        color: '#1e293b'
    }
});