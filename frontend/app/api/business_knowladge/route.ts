import { businessKnowladgeService } from "@/lib/services/business_knowladge/businessKnowladgeService";
import { BaseBusinessKnowladge, BusinessKnowladgeResponse } from "@/lib/services/business_knowladge/types";
import { ErrorResponse, SuccessResponse } from "@/lib/services/responseType";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest){
    try{
        const res = await businessKnowladgeService.getAllBusinessKnowladges(request)
        const data = await res.json()
        if (!res.ok){
            return NextResponse.json<ErrorResponse>({code: data.code, message: data.message, status: data.status}, {status: res.status})
        }
        
        return NextResponse.json<SuccessResponse<BusinessKnowladgeResponse[]>>(data, {status: res.status})
    }catch (error: any){
        return NextResponse.json<ErrorResponse>(
            {
                status: "error",
                message: error.message || "Internal server error",
                code: "INTERNAL_SERVER_ERROR"
            },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest){
    try{

        const body = await request.json()
        const {category, category_description, content} = body
        const payload = {category, category_description, content}
        const res = await businessKnowladgeService.postBusinessKnowladge(request, payload as BaseBusinessKnowladge)
        const data = await res.json()
        if (!res.ok){
            return NextResponse.json<ErrorResponse>({code: data.code, message: data.message, status: data.status}, {status: res.status})
        }
        return NextResponse.json<SuccessResponse<BusinessKnowladgeResponse>>(data, {status: res.status})
    }catch (error: any){
        return NextResponse.json<ErrorResponse>(
            {
                status: "error",
                message: error.message || "Internal server error",
                code: "INTERNAL_SERVER_ERROR"
            },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest){
    try{
        const id = request.nextUrl.searchParams.get("id");
        if (!id) throw new Error("ID is required");

        const body = await request.json()
        const {category, category_description, content} = body
        const payload = {category, category_description, content}
        const res = await businessKnowladgeService.updateBusinessKnowladge(request,id, payload as BaseBusinessKnowladge)
        const data = await res.json()
        if (!res.ok){
            return NextResponse.json<ErrorResponse>({code: data.code, message: data.message, status: data.status}, {status: res.status})
        }
        return NextResponse.json<SuccessResponse<BusinessKnowladgeResponse>>(data, {status: res.status})
    }catch (error: any){
        return NextResponse.json<ErrorResponse>(
            {
                status: "error",
                message: error.message || "Internal server error",
                code: "INTERNAL_SERVER_ERROR"
            },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest){
    try{
        const id = request.nextUrl.searchParams.get("id");
        if (!id) throw new Error("ID is required");

        const res = await businessKnowladgeService.delelteBusinessKnowladge(request,id)
        const data = await res.json()
        if (!res.ok){
            return NextResponse.json<ErrorResponse>({code: data.code, message: data.message, status: data.status}, {status: res.status})
        }
        return NextResponse.json<SuccessResponse<BusinessKnowladgeResponse>>(data, {status: res.status})
    }catch (error: any){
        return NextResponse.json<ErrorResponse>(
            {
                status: "error",
                message: error.message || "Internal server error",
                code: "INTERNAL_SERVER_ERROR"
            },
            { status: 500 }
        );
    }
}
