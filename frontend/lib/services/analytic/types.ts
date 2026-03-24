export interface TokenUsageTrendResponse{
    date: string,
    token: number
}

export interface MessageUsageTrendResponse{
    date: string,
    total_message: number
}

export interface MessageTrendHumanVsAiResponse{
    date: string,
    human: number,
    ai: number
}