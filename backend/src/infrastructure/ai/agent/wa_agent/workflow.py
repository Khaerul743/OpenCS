from langgraph.checkpoint.base import BaseCheckpointSaver
from langgraph.graph import END, START, StateGraph

from src.infrastructure.ai.agent.base import BaseWorkflow

from .models import WhatsappAgentState
from .nodes import WhatsappAgentNode


class WhatsappAgentWorkflow(BaseWorkflow):
    def __init__(self, state_saver: BaseCheckpointSaver, node: WhatsappAgentNode):
        self.state_saver = state_saver
        self.node = node
        self.build = self._build_workflow()

    def _build_workflow(self):
        graph = StateGraph(WhatsappAgentState)
        graph.add_node("main_agent", self.node.main_agent)
        graph.add_node("say_sorry", self.node.say_sorry)
        graph.add_node("human_fallback", self.node.human_fallback)
        graph.add_node(
            "update_state_aftet_main_agent", self.node.update_state_after_main_agent
        )
        graph.add_node("call_preparation_tool", self.node.call_preparation_tool)
        graph.add_node("get_business_knowladge", self.node.get_business_knowladge)
        graph.add_node("get_rag_query", self.node.get_rag_query)
        graph.add_node("merge_tool_result", self.node.merge_tool_result)
        graph.add_node("final_result", self.node.final_result)

        graph.add_edge(START, "main_agent")
        graph.add_conditional_edges(
            "main_agent",
            self.node.router,
            {
                "end": END,
                "next": "update_state_aftet_main_agent",
                "human_fallback": "human_fallback",
            },
        )
        graph.add_edge("human_fallback", END)
        graph.add_edge("say_sorry", END)
        graph.add_edge("update_state_aftet_main_agent", "call_preparation_tool")
        graph.add_edge("call_preparation_tool", "get_business_knowladge")
        graph.add_edge("call_preparation_tool", "get_rag_query")

        graph.add_edge("get_business_knowladge", "merge_tool_result")
        graph.add_edge("get_rag_query", "merge_tool_result")
        graph.add_edge("merge_tool_result", "final_result")
        graph.add_conditional_edges(
            "final_result",
            self.node.final_result_router,
            {
                "say_sorry": "say_sorry",
                "next": "call_preparation_tool",
                "human_fallback": "human_fallback",
                "end": END,
            },
        )

        return graph.compile(self.state_saver)

    def run(self, state: WhatsappAgentState, thread_id: str):
        return self.build.invoke(
            state,
            config={"configurable": {"thread_id": thread_id}},
        )

    def show(self):
        pass
