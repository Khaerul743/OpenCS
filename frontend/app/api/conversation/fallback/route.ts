import { conversationService } from "@/lib/services/conversation/conversationService";
import { ConversationFallbackResponse } from "@/lib/services/conversation/types";
import { ErrorResponse, SuccessResponse } from "@/lib/services/responseType";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const id = request.nextUrl.searchParams.get("id");
        if (!id) throw new Error("ID is required");
        const results = await Promise.allSettled([
            conversationService.getConversationMessages(request, id),
            conversationService.getConversationFallback(request, id),
            conversationService.getConversationStatusAgent(request, id)
        ])

        const [messagesResult, fallbackResult, convStatusAgentResult] = results

        // 🔴 1. Cek kalau ada 401 dulu
        for (const result of results) {
        if (result.status === "fulfilled") {
            if (!result.value.ok) {
            const data = await result.value.json()
            return NextResponse.json<ErrorResponse>(
                {
                status:  data.status,
                code: data.code,
                message: data.message
                },
                { status: result.value.status }
            )
            }
        }
        }

        // 🟢 2. Parse data normal (graceful)
        let messages = null
        let fallback = null
        let convStatusAgent = null

        if (messagesResult.status === "fulfilled" && messagesResult.value.ok) {
            const data = await messagesResult.value.json()
            messages = data.data
        }

        if (fallbackResult.status === "fulfilled" && fallbackResult.value.ok) {
            const data = await fallbackResult.value.json()
            fallback = data.data
        }

        if (convStatusAgentResult.status === "fulfilled" && convStatusAgentResult.value.ok) {
            const data = await convStatusAgentResult.value.json()
            convStatusAgent = data.data.customer_status_agent
        }

        return NextResponse.json<SuccessResponse<ConversationFallbackResponse>>({
          status: "success",
          message: "Get fallback is successfully",
          data:{
            messages,
            fallback,
            convStatusAgent
          }
        })
        
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        message: error.message || "Internal server error",
        code: "INTERNAL_SERVER_ERROR"
      },
      { status: 500 }
    )
  }
}