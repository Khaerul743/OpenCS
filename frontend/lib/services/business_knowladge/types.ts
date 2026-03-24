
export interface BaseBusinessKnowladge{
    category: string,
    category_description: string,
    content: string,
}
export interface BusinessKnowladgeResponse extends BaseBusinessKnowladge{
    id: string,
    created_at: string
}
