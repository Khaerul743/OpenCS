export interface DashboardResponse{
    analytic_cards: Record<string, number> | null
    token_usage_trend: Record<string, string | number>[] | null,
    list_conversation: Record<string, string>[] | null
}