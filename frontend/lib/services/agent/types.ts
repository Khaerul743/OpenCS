type Tone = "profesional" | "casual" | "friendly" | "formal"
type LLM_MODEL = "gpt-3.5-turbo" | "gpt-4o" | "gpt-4o-mini"

export interface AgentResponse{
    id: string,
    name: string,
    enable_ai: boolean,
    phone_number_id: string,
    fallback_email: string,
    base_prompt: string,
    llm_model: string,
    llm_provider: string,
    tone: Tone,
    temperature: number,
    created_at: string,
    updated_at: string
}

export interface UpdateAgent{
    name: string,
    fallback_email: string,
    base_prompt: string,
    llm_model: LLM_MODEL,
    llm_provider: string,
    tone: Tone,
    temperature: number,
}

type DETAIL_INVOKE_RES = {
    decision_summary: string,
    human_fallback: boolean,
    confidence_level: number
}
export interface InvokeAgentResponse{
    response: string,
    detail: DETAIL_INVOKE_RES
}