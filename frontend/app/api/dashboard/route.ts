import { dashboardService } from "@/lib/services/dashboard/dashboardService";
import { DashboardResponse } from "@/lib/services/dashboard/types";
import { ErrorResponse, SuccessResponse } from "@/lib/services/responseType";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
  try {
    const results = await Promise.allSettled([
      dashboardService.analyticCards(request),
      dashboardService.tokenUsageTrend(request),
      dashboardService.listConversation(request)
    ])

    const [cardResult, trendResult, conversationResult] = results

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
    let analytic_cards = null
    let token_usage_trend = null
    let list_conversation = null

    if (cardResult.status === "fulfilled" && cardResult.value.ok) {
      const data = await cardResult.value.json()
      analytic_cards = data.data
    }

    if (trendResult.status === "fulfilled" && trendResult.value.ok) {
      const data = await trendResult.value.json()
      token_usage_trend = data.data
    }
    
    if (conversationResult.status === "fulfilled" && conversationResult.value.ok) {
      const data = await conversationResult.value.json()
      list_conversation = data.data.conversations.map((conv: any) => {
      const { agent_id, business_id, customer_id, ...rest } = conv
      return rest
      })
    }


    return NextResponse.json<SuccessResponse<DashboardResponse>>({
      status: "success",
      message: "Get dashboard overview is successfully",
      data: {
        analytic_cards,
        token_usage_trend,
        list_conversation
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