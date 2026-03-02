
import { config } from "dotenv";
import type { NextRequest } from "next/server";
import { ExternalServiceError, InternalServerError } from "../errors/appError";

config()
export class HttpClient {
  protected baseUrl: string;

  constructor() {
    // Isi dulu baru validasi
    const url = process.env.BACKEND_SERVICE_URL;
    if (!url) {
      console.error("BACKEND_SERVICE_URL not found inside .env");
      throw new InternalServerError();
    }
    this.baseUrl = url;
  }

  protected async sendRequest<T>(endpoint: string, option?: RequestInit): Promise<T> {
    const res = await fetch(`${this.baseUrl}/api${endpoint}`, {
      ...option,
      headers: {
        "Content-Type": "application/json",
        ...option?.headers,
      },
    });

    if (res.status >= 500) {
      throw new ExternalServiceError(res.status);
    }

    return res.json();
  }

  protected async sendRequestWithAuth<T>(request: NextRequest,endpoint: string,option?: RequestInit): Promise<Response>{
    const access_token = request.cookies.get("access_token")?.value
    const refresh_token = request.cookies.get("refresh_token")?.value
    if (!access_token && !refresh_token){
      return new Response(
        JSON.stringify({ status: "error", message: "Unauthorized", code: "UNAUTHORIZED" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    let res = await fetch(`${this.baseUrl}/api${endpoint}`, {
      ...option,
      headers: {
        "Content-Type": "application/json",
        Cookie: `access_token=${access_token}; refresh_token=${refresh_token}`,
        ...option?.headers,
      },
    });

    if (res.status === 401 && refresh_token) {
      console.log("===================================================")
      const refreshRes = await fetch(`${this.baseUrl}/api/auth/refresh`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${refresh_token}`,
        },
      });

      if (!refreshRes.ok) {
        return new Response(
          JSON.stringify({ status: "error", message: "Session expired", code: "SESSION_EXPIRED" }),
          { status: 401, headers: { "Content-Type": "application/json" } }
        );
      }

      const refreshData = await refreshRes.json();

      // Set cookie baru
      const response = new Response();
      response.headers.append(
        "Set-Cookie",
        `access_token=${refreshData.access_token}; HttpOnly; Path=/; Max-Age=3600`
      );

      // retry request
      res = await fetch(`${this.baseUrl}/api${endpoint}`, {
        ...option,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${refreshData.access_token}`,
          ...option?.headers,
        },
      });

      return res;
    }

    return res
  }
}