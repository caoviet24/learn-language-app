
export interface User {
    id: string;
    username: string;
    email: string;
    nickname?: string;
    fullName?: string;
    avatarUrl?: string;
    activities?: UserActivity[];
    createdAt: string;
    updatedAt: string;
}

export interface UserActivity {
    currentStreak: number;
    language: string;
    practiceLessons: any; // Temporary fix - should be properly defined
    lastActive?: string | Date;
}

