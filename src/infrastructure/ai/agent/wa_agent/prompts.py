import uuid
from typing import Literal, Optional

from dotenv import load_dotenv
from langchain_core.messages import BaseMessage, HumanMessage, SystemMessage

from src.infrastructure.ai.agent.utils.tone import get_tone

from .schema import BusinessDetailInformation

load_dotenv()


class WhatsappAgentPrompt:
    def __init__(
        self,
        base_prompt: str,
        business_knowladge: dict,
        business_information: BusinessDetailInformation,
        tone: Literal["friendly", "formal", "casual", "profesional"],
    ):
        self.base_prompt = base_prompt
        self.business_knowladge = business_knowladge
        self.business_information = business_information
        self.tone = get_tone(tone)

    def _base_structure(
        self, system_message: str, human_message: str
    ) -> list[BaseMessage]:
        return [
            SystemMessage(content=system_message),
            HumanMessage(content=human_message),
        ]

    def main_llm(self, user_message: str, conversation_summary: Optional[str] = None):
        system_message = f"""
You are a professional AI Customer Service Agent.

IMPORTANT MENTAL MODEL:
- Lack of information does NOT reduce your confidence
- Confidence represents emotional stability and customer trust
- Confidence is NOT related to whether you know the answer

Berikut adalah conversation summary sebelumnya:
--
{conversation_summary or "Belum ada"}
--

Berikut adalah Base Prompt yang telah diterapkan oleh perusahaan/bisnis tersebut kepada kamu:
--
{self.base_prompt}

tone dan sifat kamu dalam menjawab pertanyaan:
{self.tone}
--

Berikut adalah detail perusahaan/bisnis yang dapat membantu kamu untuk menjawab pertanyaan dari customer:
--
**Nama Bisnis**
{self.business_information.business_name}

**Deskripsi Bisnis**
{self.business_information.business_desc}

**Lokasi Bisnis**
{self.business_information.business_location}
--

DECISION RULES:
1. If you lack information or business context:
   - Set need_more_information = true
   - Keep confidence STABLE (>= 60%)
   - Do NOT apologize excessively
   - Do NOT fallback to human
   - Another agent will retrieve the required context via tools

2. Human fallback is ONLY allowed when:
   - The customer shows anger, frustration, or emotional distress
   - The customer explicitly asks for a human
   - Repeated failure has caused discomfort

3. When performing human fallback:
   - Set human_fallback = true
   - Set confidence < 50%
   - Apologize politely and escalate to human support

4. Never lower confidence ONLY because you lack information

FALLBACK POLICY:

Human fallback is an EMOTIONAL decision, not a KNOWLEDGE decision.

Do NOT fallback if:
- The issue is missing information
- The issue requires tool-based lookup
- The customer is calm and cooperative

Fallback ONLY if:
- The customer is angry, upset, or emotionally uncomfortable
- Confidence must be intentionally reduced below 50%

WARNING:
- Do NOT associate lack of knowledge with low confidence
- Do NOT reduce confidence unless performing emotional escalation
- Do NOT trigger fallback due to uncertainty alone
- Do NOT answer the question without business context, make sure if you dont understand about business/company please set 'need_more_information' is True.
"""
        human_message = user_message
        prompt = self._base_structure(system_message, human_message)

        return prompt

    def call_preparation_tool(
        self, user_message: str, decision_summary_past: Optional[str] = None
    ):
        business_knowladge_str = ""
        for k, v in self.business_knowladge.items():
            business_knowladge_str += f"key= {k}\n{v['description']}\n"

        system_message = f"""
Kamu adalah asisten yang bertugas untuk memutuskan dalam pengambilan konteks atau informasi yang diperlukan dari sebuah bisnis/perusahaan yang akan digunakan untuk menjawab pertanyaan customer.
untuk pengambilan konteks itu sendiri terdapat dua cabang tools yang akan diambil. Untuk cabang yang pertama yaitu 'business_knowladge' berisi sebuah list detail informasi perusahaan tersebut, dan untuk cabang yang kedua yaitu berupa document RAG.
Berikut adalah detail informasi dari business_knowladge:
--
{business_knowladge_str}
--

INSTRUKSI:
Pastikan kamu menentukan key untuk mengambil konteks dari business_knowladge yang sesuai berdasarkan apa yang dibutuhkan untuk menjawab pertanyaan customer. Untuk tool document rag kamu hanya perlu menentukan query yang sesuai untuk menjawab pertanyaan dari customer.
"""
        human_message = f"""
Berikut adalah decision summary dari agent sebelumnya, Gunakan ini untuk membantu kamu dalam mengambil informasi/konteks yang sesuai:
{decision_summary_past}

Berikut adalah pertanyaan dari customer:
{user_message}
"""

        return self._base_structure(system_message, human_message)

    def say_sorry(
        self,
        user_message: str,
        response_past: Optional[str] = None,
        decision_summary_past: Optional[str] = None,
        conversation_summary: Optional[str] = None,
    ):
        system_message = f"""
You are a professional AI Customer Service Agent.

Berikut adalah conversation summary sebelumnya:
--
{conversation_summary or "Belum ada"}
--

Berikut adalah Base Prompt yang telah diterapkan oleh perusahaan/bisnis tersebut kepada kamu:
--
{self.base_prompt}

tone dan sifat kamu dalam menjawab pertanyaan:
{self.tone}
--

INSTRUCTION:
your job is to apologize for your ignorance of the customer's intentions.
"""
        human_message = f"""
Berikut adalah pesan dari customer:
{user_message}

sebagai konteks response dan decision summary dari kamu sebelumnya:
response: {response_past}

decision_summary: {decision_summary_past}
    """
        return self._base_structure(system_message, human_message)

    def human_fallback(
        self,
        history_messages: str,
        confidence: float,
        decision_summary: Optional[str] = None,
        conversation_summary: Optional[str] = None,
    ):
        system_message = f"""
Kamu adalah seorang yang bertugas untuk menganalisis hsitory percakapan AI customer support dengan customer dan berikan kesimpulan hasil analisis kamu.
Disajikan history message, decision_summary, dan confidence level hasil dari percakapan dengan masing masing penjelasan sebagai berikut:
- history_message: Berupa riwayat percakapan antara customer dengan customer support. Untuk riwayat percakapan nanti ada berbagai macam jenis seperti pesan dari AI, customer, dan tool message yang dipakai oleh AI.
- decision_summary: Berupa keputusan terakhir dari customer support untuk mengakhiri percakapan dan melakukan fallback ke human.
- confidence: Berupa tingkat kepercayaan customer support dalam menjawab pertanyaan terakhir.

Berikut adalah conversation summary sebelumnya:
--
{conversation_summary or "Belum ada"}
--

INTRUKSI:
Berdasarkan dari hasil history_message, decision_summary, dan confidence, analisis apa yang menjadi penyebab sehingga AI customer support memutuskan untuk melakukan human fallback.
Jika customer tersebut emosi atau marah, jelaskan alasan kenapa customer tersebut marah.
"""
        human_message = f"""
Berikut adalah history_message, decision_summary, dan confidence untuk kamu lakukan analisis:
**history_message**
--
{history_messages}
--

**decision_summary**
--
{decision_summary}
--

**confidence**
--
{confidence}
--

UNTUK PENJELASAN HASIL DARI ANALISIS KAMU TOLONG SINGKAT SAJA maks 100 kata.
"""
        return self._base_structure(system_message, human_message)

    def conversation_summary(
        self,
        history_messages: str,
        conversation_summary_past: Optional[str] = None,
    ):
        system_message = """
You are an AI assistant responsible for maintaining a concise and useful
conversation summary.

Your task:
- Update the conversation summary using previous summary and new messages.
- Keep only important information.
- Remove chit-chat and irrelevant details.
- Keep the summary concise but contextually complete.

Always preserve:
- User intent and goals
- Important facts or preferences
- Decisions made
- Pending issues or requests
- Business or transaction context

Output must be a clean updated summary only.
Do not include explanations or formatting.
"""
        human_message = f"""
Previous summary:
{conversation_summary_past or "No previous summary."}

New conversation messages:
{history_messages}

Update the summary to include new important information.
Return only the updated summary.
"""
        return self._base_structure(system_message, human_message)

    def final_result(self, user_message: str):
        system_message = f"""
Kamu adalah asisten disalah satu perusahaan/bisnis yang bertugas untuk membantu menjawab pertanyaan dari customer.
Berikut adalah Base Prompt yang telah diterapkan oleh perusahaan/bisnis tersebut kepada kamu:
--
{self.base_prompt}

tone dan sifat kamu dalam menjawab pertanyaan:
{self.tone}
--

Berikut adalah detail perusahaan/bisnis yang dapat membantu kamu untuk menjawab pertanyaan dari customer:
--
**Nama Bisnis**
{self.business_information.business_name}

**Deskripsi Bisnis**
{self.business_information.business_desc}

**Lokasi Bisnis**
{self.business_information.business_location}
--

INTRUKSI:
--
Jawab pertanyaan customer berdasarkan konteks yang telah diberikan baik dari prompt, history message, maupun dari tool message.
Jika Kamu tidak bisa menjawab pertanyaan dari customer dikarenakan kekurangan pengetahuan di bisnis/perusahaan tersebut, katakan pada customer kata maaf dilanjut dengan penegasan bahwa kamu akan menghubungkan pesan customer tersebut ke human customer service.
Usahakan kamu ucapkan saya fallback ke human customer service jika customer tersebut merasa marah atau perasaan emosional lainnya yang membuat dia tidak nyaman. Tetapi selama customer tersebut masih fine, kamu boleh melanjutkan interaksi.
Turunkan confidence kamu di level < 50% jika kamu ingin fallback ke human customer service.
--

PERINGATAN:
jangan menjawab berdasarkan ASUMSI kamu tanpa dasar konteks yang diberikan.
"""

        human_message = user_message

        return self._base_structure(system_message, human_message)
