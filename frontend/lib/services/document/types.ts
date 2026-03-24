type FILE_FORMAT = "pdf" | "docs" | "txt"
type FILE_STATUS = "processed" | "uploaded" | "failed"

export interface DocumentKnowladgeResponse{
    id: string,
    title: string,
    description: string,
    file_format: FILE_FORMAT,
    file_size: number,
    status: FILE_STATUS,
    created_at: string,
}