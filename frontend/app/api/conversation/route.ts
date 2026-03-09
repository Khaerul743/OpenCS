import { conversationService } from "@/lib/services/conversation/conversationService";
import { ConversationResponse } from "@/lib/services/conversation/types";
import { ErrorResponse, SuccessResponse } from "@/lib/services/responseType";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest){
    try{
        const { searchParams } = new URL(request.url);
        const page = searchParams.get('page') ? searchParams.get('page') : 1; // Mengambil 'keyword'
        const limit = searchParams.get('limit') ? searchParams.get('limit') : 5; // Mengambil 'keyword'
        const res = await conversationService.getAllConversation(request, Number(page), Number(limit))
        const data = await res.json()
        if (!res.ok){
            return NextResponse.json<ErrorResponse>(data, {status: res.status})
        }
        return NextResponse.json<SuccessResponse<ConversationResponse>>(data, {status: res.status})
    }catch (error:any){
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

export async function PUT(request: NextRequest){
  try{
    const id = request.nextUrl.searchParams.get("id");
    if (!id) throw new Error("ID is required");
    const body = await request.json()
    const {agentStatus} = body
    const res = await conversationService.updateStatusAgent(request, id, agentStatus)
    const data = await res.json()
    if (!res.ok){
      return NextResponse.json<ErrorResponse>(data, {status: res.status})
    }
    return NextResponse.json(data, {status: res.status})
  }catch (error:any){
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