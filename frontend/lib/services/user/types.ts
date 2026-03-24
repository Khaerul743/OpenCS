export interface UserResponse {
    id: string;
    name: string;
    avatar: string | null;
    email: string;
    role: string;
    status: "active" | "inactive";
    created_at: string;
}
