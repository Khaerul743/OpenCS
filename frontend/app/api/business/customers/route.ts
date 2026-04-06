import { businessService } from "@/lib/services/business/businessService";
import { ErrorResponse, SuccessResponse } from "@/lib/services/responseType";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest){
    try{
        const res = await businessService.getCustomers(request)
        const data = await res.json()

        if (!res.ok){
            return NextResponse.json<ErrorResponse>({
                status: "error",
                message: data.message || "Failed to get customers",
            }, { status: res.status })
        }

        return NextResponse.json<SuccessResponse>({
            status: "success",
            message: data.message || "Successfully fetched customers",
            data: data.data,
        }, { status: 200 })

    } catch(err){
        return NextResponse.json<ErrorResponse>({
            status: "error",
            message: "Internal server error"
        }, { status: 500 })
    }
}
