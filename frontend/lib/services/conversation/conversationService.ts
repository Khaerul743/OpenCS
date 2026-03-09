import { HttpClient } from "@/lib/http/httpClient";
import { NextRequest } from "next/server";

class ConversationService extends HttpClient{
    async getAllConversation(request: NextRequest, page: number = 1, limit: number = 5){
        return this.sendRequestWithAuth(request, `/conversation/me/all?page=${page}&limit=${limit}`)
    }
    async getConversationMessages(request: NextRequest, conversation_id: string){
        // id is conversation id
        return this.sendRequestWithAuth(request, `/conversation/me/message/${conversation_id}`)
    }
    async getConversationFallback(request: NextRequest, conversation_id: string){
        return this.sendRequestWithAuth(request, `/conversation/me/fallback/${conversation_id}`)
    }
    async getConversationStatusAgent(request: NextRequest, conversation_id: string){
        return this.sendRequestWithAuth(request, `/conversation/agent/status/${conversation_id}`)
    }
    async postHumanMessage(request: NextRequest, conversation_id: string, text_message: string){
        return this.sendRequestWithAuth(request, `/conversation/message/post/${conversation_id}`, {
            method: "POST", 
            body: JSON.stringify({text_message}),
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
    async updateStatusAgent(request: NextRequest, conversation_id: string, agentStatus: boolean){
        return this.sendRequestWithAuth(request, `/conversation/agent/status/${conversation_id}?status=${agentStatus}`, {method: "PUT"})
    }
}

export const conversationService = new ConversationService()