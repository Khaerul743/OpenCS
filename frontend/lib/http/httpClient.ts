import { config } from "dotenv";
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
}