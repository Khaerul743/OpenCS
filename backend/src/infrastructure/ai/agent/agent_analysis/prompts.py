from typing import Optional
from langchain_core.messages import SystemMessage, HumanMessage, BaseMessage


class AgentAnalysisPrompt:
    def _get_prompt_setup(
        self, system_message: str, human_message: str
    ) -> list[BaseMessage]:
        return [
            SystemMessage(content=system_message),
            HumanMessage(content=human_message),
        ]

    def context_builder_prompt(
        self, business_description: str, raw_data: dict
    ) -> list[BaseMessage]:

        system_message = (
            "You are a data context builder for a WhatsApp customer service SaaS platform. "
            "Convert the JSON analytics data into a short, structured narrative. "
            "Include: category totals, change %, and key themes from sample messages. "
            "Be descriptive only — no recommendations. Output in English."
        )

        human_message = (
            f"Business: {business_description}\n"
            f"Data: {raw_data}\n\n"
            "Summarize this data as a structured context narrative."
        )

        return self._get_prompt_setup(system_message, human_message)

    def insight_generator(
        self, business_description: str, insight_context: Optional[str] = None
    ):

        system_message = (
            "You are a business analyst for a WhatsApp customer service SaaS platform. "
            "The business below uses this SaaS to automate customer service via AI agent on WhatsApp. "
            "Analyze the customer conversation data and generate ONE balanced insight — covering both strengths and issues. "
            "Base your answer only on the context. Be concise. Output structured fields: insight, reason, impact."
        )

        human_message = (
            f"Business: {business_description}\n\n"
            f"Context:\n{insight_context}\n\n"
            "Generate:\n"
            "1. insight — what is happening (positive and/or negative)\n"
            "2. reason — why it is happening (based on data)\n"
            "3. impact — why it matters to the business"
        )

        return self._get_prompt_setup(system_message, human_message)

    def recommendation_generator(
        self,
        business_description: str,
        insight: Optional[str] = None,
        reason: Optional[str] = None,
        impact: Optional[str] = None,
    ):

        system_message = (
            "You are a business consultant for a SaaS customer service platform. "
            "The business uses an AI WhatsApp agent to handle customer messages. "
            "Give short, practical recommendations based on the insight. "
            "Include both: things to maintain (positive) and things to improve (negative). "
            "Max 3 bullet points. Write in Indonesian."
        )

        human_message = (
            f"Bisnis: {business_description}\n\n"
            f"Insight: {insight}\n"
            f"Alasan: {reason}\n"
            f"Dampak: {impact}\n\n"
            "Berikan 2–3 rekomendasi singkat dan spesifik."
        )

        return self._get_prompt_setup(system_message, human_message)
