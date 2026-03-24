type SENDER_TYPE = "customer" | "ai" | "human_admin"

type LAST_MESSAGE = {
    content: string,
    sender_type: SENDER_TYPE,
    created_at: string,
}

interface Conversation{
    id: string,
    customer_id: string,
    username: string,
    phone_number: string,
    need_human: boolean,
    last_message: LAST_MESSAGE,
    last_message_at: string
}

export interface ConversationResponse{
    conversations: Conversation[]
    total: number,
    page: number,
    limit: number
}

interface ConversationMessage{
    id: string
    conversation_id: string
    message_type: string
    content: string
    sender_type: SENDER_TYPE
    created_at: string
}

export interface ConversationMessageResponse{
    messages: ConversationMessage[]
    convStatusAgent: boolean
}

type FALLBACK = {
    id: string
    conversation_id: string
    confidence_level: number
    last_decision_summary: string
}

export interface ConversationFallbackResponse{
    messages: ConversationMessage[]
    fallback: FALLBACK
    convStatusAgent: boolean
}