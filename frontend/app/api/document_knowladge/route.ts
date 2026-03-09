import { documentService } from "@/lib/services/document/documentService";
import { DocumentKnowladgeResponse } from "@/lib/services/document/types";
import { ErrorResponse, SuccessResponse } from "@/lib/services/responseType";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest){
    try{
        const res = await documentService.getAllDocument(request)
        const data = await res.json()

        if (!res.ok){
            return NextResponse.json<ErrorResponse>({code: data.code, message: data.message, status: data.status}, {status: res.status})
        }

        return NextResponse.json<SuccessResponse<DocumentKnowladgeResponse[]>>(data, {status: res.status})
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

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        
        // Validation check (optional, but good for returning clean errors)
        if (!formData.has('file') || !formData.has('file_description')) {
             return NextResponse.json<ErrorResponse>({
                 status: "error",
                 message: "file and file_description are required",
                 code: "BAD_REQUEST"
             }, { status: 400 });
        }

        const res = await documentService.addDocument(request, formData);
        const data = await res.json();
        
        if (!res.ok) {
            return NextResponse.json<ErrorResponse>({code: data.code, message: data.message, status: data.status}, {status: res.status});
        }
        
        return NextResponse.json<SuccessResponse<DocumentKnowladgeResponse>>(data, {status: res.status});
    } catch (error: any) {
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

        const res = await documentService.deleteDocument(request,id)
        const data = await res.json()
        if (!res.ok){
            return NextResponse.json<ErrorResponse>({code: data.code, message: data.message, status: data.status}, {status: res.status})
        }
        return NextResponse.json<SuccessResponse<DocumentKnowladgeResponse>>(data, {status: res.status})
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
