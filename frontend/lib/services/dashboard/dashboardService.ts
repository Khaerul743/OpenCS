import { HttpClient } from "@/lib/http/httpClient";
import type { NextRequest } from "next/server";

class DashboardService extends HttpClient{

    async analyticCards(request: NextRequest): Promise<Response>{
        return this.sendRequestWithAuth(request,"/agent/analytic/me")
    } 
    async tokenUsageTrend(request: NextRequest): Promise<Response>{
        return this.sendRequestWithAuth(request,"/agent/analytic/token-usage-trend/me")
    }

    async listConversation(request: NextRequest): Promise<Response>{
        return this.sendRequestWithAuth(request, "/conversation/me/all?page=1&limit=5")
    }

}

export const dashboardService = new DashboardService()