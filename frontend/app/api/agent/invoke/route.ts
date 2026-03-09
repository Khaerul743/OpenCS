import { agentService } from "@/lib/services/agent/agentService";
import { InvokeAgentResponse } from "@/lib/services/agent/types";
import { SuccessResponse, type ErrorResponse } from "@/lib/services/responseType";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    try{
        const body = await request.json()
        const {text_message} = body
        const res = await agentService.invokeAgent(request, text_message)
        const data = await res.json()

        if (!res.ok){
            return NextResponse.json<ErrorResponse>({code: data.code, message: data.message, status: data.status}, {status: res.status})
        }

        return NextResponse.json<SuccessResponse<InvokeAgentResponse>>(data, {status: res.status})
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