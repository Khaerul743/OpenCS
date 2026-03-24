import { HttpClient } from "@/lib/http/httpClient";
import { logger } from "@/lib/logger";
import { ErrorResponse, SuccessResponse } from "../responseType";
import { LoginResponse, LoginSchema, RegisterResponse, RegisterSchema } from "./types";

class AuthService extends HttpClient{
    async register(payload: RegisterSchema): Promise<SuccessResponse<RegisterResponse> | ErrorResponse>{
        const { password, ...logData } = payload;
        logger.info("Starting user registration process", { user: logData });
        
        const option = {
            method: "POST",
            body: JSON.stringify(payload)
        }
        return this.sendRequest("/auth/register", option)
    }

    async login(payload: LoginSchema): Promise<SuccessResponse<LoginResponse> | ErrorResponse>{
        logger.info("Starting user login process", {email: payload.email})
        const option = {
            method: "POST",
            body: JSON.stringify(payload)
        }
        return this.sendRequest("/auth/login", option)
    }
}

export const authService = new AuthService()

