import { HttpClient } from "@/lib/http/httpClient";
import { NextRequest } from "next/server";


class DocumentService extends HttpClient{
    async getAllDocument(request: NextRequest){
        return this.sendRequestWithAuth(request, "/document_knowladge/me/all")
    }

    async addDocument(request: NextRequest, data: FormData){
        return this.sendRequestWithAuth(request, "/document_knowladge/me", {method: "POST", body: data})
    }
    async deleteDocument(request: NextRequest, id: string){
        return this.sendRequestWithAuth(request, `/document_knowladge/me/${id}`, {method: "DELETE"})
    }
}

export const documentService = new DocumentService()