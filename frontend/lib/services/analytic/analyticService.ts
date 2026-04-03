import { HttpClient } from "@/lib/http/httpClient";
import { NextRequest } from "next/server";

class AnalyticService extends HttpClient{
    async getTokenUsageTrend(request: NextRequest): Promise<Response>{
        return this.sendRequestWithAuth(request,"/agent/analytic/token-usage-trend/me")
    }
    async getMessageTrend(request: NextRequest): Promise<Response>{
        return this.sendRequestWithAuth(request,"/agent/analytic/message-usage-trend/me")
    }
    async getMsgTrendHumanVsAi(request: NextRequest): Promise<Response>{
        return this.sendRequestWithAuth(request,"/agent/analytic/message-trend/human-vs-ai/me")
    }
    
    async getCategoryPercentage(request: NextRequest, period: string = 'alltime'): Promise<Response> {
        return this.sendRequestWithAuth(request, `/agent/analytic/category-percentages/${period}/me`);
    }

    async getAnalyticInsight(request: NextRequest): Promise<Response> {
        return this.sendRequestWithAuth(request, "/agent/analytic/insight");
    }

    async getKnowledgeGap(request: NextRequest): Promise<Response> {
        return this.sendRequestWithAuth(request, "/agent/analytic/knowlage_gap");
    }

}

export const analyticService = new AnalyticService()