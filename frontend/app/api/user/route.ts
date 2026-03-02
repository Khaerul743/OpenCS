import type { ErrorResponse, SuccessResponse } from "@/lib/services/responseType";
import type { UserResponse } from "@/lib/services/user/types";
import { userService } from "@/lib/services/user/userService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const res = await userService.getCurrentUser(request);
        
        let data;
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            data = await res.json();
        } else {
            const text = await res.text();
            data = { status: "error", message: text || "Invalid response format", code: "INVALID_RESPONSE" };
        }

        if (!res.ok) {
            return NextResponse.json<ErrorResponse>(data as ErrorResponse, { status: res.status });
        }

        return NextResponse.json<SuccessResponse<UserResponse>>(data, { status: res.status });
    } catch (error: any) {
        return NextResponse.json<ErrorResponse>(
            {
                status: "error",
                message: error.message || "Internal server error",
                code: "INTERNAL_SERVER_ERROR"
            },
            { status: 500 }
        );
    }
}

