import { ErrorResponse } from "@/lib/services/responseType";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    try{
        const cookieStore = await cookies()
        cookieStore.delete("access_token")
        cookieStore.delete("refresh_token")
        return NextResponse.json({message: "Logout is successfully"}, {status: 200})
    }catch (error: any){
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