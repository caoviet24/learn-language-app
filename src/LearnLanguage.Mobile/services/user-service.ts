import axiosJWT from "@/configs/axios";



async function getAll(pageNumber: number, pageSize: number, searchTerm: string) {
    const res = await axiosJWT.get(`/user/get-all?pageNumber=${pageNumber}&pageSize=${pageSize}&searchTerm=${searchTerm}`);
    return res.data;

}

async function remove(userId: string) {
    const res = await axiosJWT.delete(`/user/delete/${userId}`);
    return res.data;
}

async function update({
    userId,
    firstName,
    lastName,
}: { userId: string; firstName: string; lastName: string }) {
    try {
        const res = await axiosJWT.put(`/user/update`, {
            id: userId,
            firstName,
            lastName,
        });
        return res.data;
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
}


export const userService = {
    getAll,
    remove,
    update
};