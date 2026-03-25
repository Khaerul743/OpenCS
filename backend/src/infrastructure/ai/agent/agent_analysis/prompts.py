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

        system_message = """
    You are a Business Analytics Context Builder. 
    Task: Transform JSON customer service data into a structured narrative.
    Role: Descriptive ONLY. No insights, conclusions, recommendations, or hallucinations.

    Data Schema:
    - "summary": {category_type, total, change (%)}
    - "samples": {category_type, sample_messages[]}

    Output Requirements:
    1. Overview: Brief interaction distribution.
    2. Category Breakdown: List each category with its total, change %, and a brief summary of its sample messages.

    Rules: Professional English, concise, strictly data-driven, no assumptions. This output will be used for downstream AI analysis.
    """

        human_message = f"""
    Business: {business_description}
    Data: {raw_data}

    Convert this data into a structured business context narrative following the system rules.
    """

        return self._get_prompt_setup(system_message, human_message)

    def insight_generator(
        self, business_description: str, insight_context: Optional[str] = None
    ):

        system_message = """
    You are an AI Business Analyst.

    Your task is to analyze customer service context and generate a concise business insight.

    Focus on identifying the most important pattern or issue.

    Rules:
    - Base your answer only on the given context
    - Do not hallucinate or add external assumptions
    - Be concise and specific
    - Do not repeat the context
    - Output must follow the required structure
    """

        human_message = f"""
    ## Business Description
    {business_description}

    ## Context
    {insight_context}

    ---

    Generate:
    1. Insight → what is happening
    2. Reason → why it is happening (based on data)
    3. Impact → why it matters to the business
    """

        return self._get_prompt_setup(system_message, human_message)

    def recommendation_generator(
        self,
        business_description: str,
        insight: Optional[str] = None,
        reason: Optional[str] = None,
        impact: Optional[str] = None,
    ):

        system_message = """
    You are an AI Business Consultant.

    Your task is to generate practical and actionable recommendations based on a given business insight.

    Rules:
    - Recommendations must be specific and implementable
    - Focus on actions the business owner can take
    - Base your answer only on the provided insight, reason, and impact
    - Do not add unrelated assumptions
    - Be concise and clear
    """

        human_message = f"""
    ## Business Description
    {business_description}

    ## Insight
    {insight}

    ## Reason
    {reason}

    ## Impact
    {impact}

    ---

    Generate just 2-3 short, actionable recommendations that the business can implement.
    Write in indonesian
    """

        return self._get_prompt_setup(system_message, human_message)
