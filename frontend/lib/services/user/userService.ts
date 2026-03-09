import { HttpClient } from "@/lib/http/httpClient";
import type { NextRequest } from "next/server";

class UserService extends HttpClient{
    async getCurrentUser(request: NextRequest): Promise<Response> {
        return this.sendRequestWithAuth(request, "/user/me")
    }
    // async logout(request: NextRequest){
    //     return this.sendRequestWithAuth(request, "/auth/logout", {method: "POST"})
    // }
}

export const userService = new UserService()