export interface DashboardResponse{
    analytic_cards: {
        total_tokens: number;
        total_messages: number;
        total_human_takeovers: number;
        avg_response_time: number;
        response_rate: number;
    } | null;
    token_usage_trend: {
        date: string;
        token: number;
    }[] | null;
    list_conversation: {
        id: string;
        username: string;
        phone_number: string;
        status: string;
        last_message_at: string;
        created_at: string;
        last_message: {
            content: string;
            sender_type: string;
            created_at: string;
        };
    }[] | null;
}