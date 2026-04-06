import { HttpClient } from "@/lib/http/httpClient";
import { NextRequest } from "next/server";

class BusinessService extends HttpClient {
    async getCustomers(request: NextRequest): Promise<Response> {
        return this.sendRequestWithAuth(request, "/business/customers/me");
    }
}

export const businessService = new BusinessService();
