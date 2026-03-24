import inspect
import sys
import os
from uuid import UUID

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../')))

from src.domain.repositories.agent_repository import AgentRepository
from src.domain.repositories.business_repository import BusinessRepository
from src.domain.repositories.conversation_repository import ConversationRepository
from src.domain.repositories.message_repository import MessageRepository
from src.domain.repositories.user_repository import UserRepository
from src.domain.repositories.agent_configuration_repository import AgentConfigurationRepository
from src.domain.repositories.analytic_repository import AnalyticsRepository
from src.domain.repositories.business_knowladges_repository import BusinessKnowladgeRepository
from src.domain.repositories.customer_repository import CustomerRepository
from src.domain.repositories.document_knowladge_repository import DocumentKnowladgeRepository
from src.domain.repositories.human_fallback_repository import HumanFallbackRepository

def check_signature(cls, method_name, param_name):
    method = getattr(cls, method_name, None)
    if not method:
        print(f"Method {method_name} not found in {cls.__name__}")
        return
    
    sig = inspect.signature(method)
    param = sig.parameters.get(param_name)
    if not param:
        print(f"Parameter {param_name} not found in {cls.__name__}.{method_name}")
        return

    if param.annotation == UUID or param.annotation == UUID | None:
        print(f"{cls.__name__}.{method_name}({param_name}): OK (UUID)")
    else:
        print(f"{cls.__name__}.{method_name}({param_name}): FAILED (Expected UUID, got {param.annotation})")

def test_repositories():
    print("Verifying Repository Signatures...\n")

    check_signature(AgentRepository, 'get_agent_id_by_user_id', 'user_id')
    check_signature(BusinessRepository, 'get_business_by_id', 'business_id')
    check_signature(ConversationRepository, 'get_conversation_by_id', 'conversation_id')
    check_signature(MessageRepository, 'insert_new_message', 'conversation_id')
    check_signature(UserRepository, 'get_user_by_id', 'user_id')
    check_signature(AgentConfigurationRepository, 'get_agent_conf_by_agent_id', 'agent_id')
    check_signature(AnalyticsRepository, 'get_agent_analytics', 'agent_id')
    check_signature(BusinessKnowladgeRepository, 'get_all_business_knowladge_by_business_id', 'business_id')
    check_signature(CustomerRepository, 'get_all_customer_by_business_id', 'business_id')
    check_signature(DocumentKnowladgeRepository, 'get_all_document_knowladge_by_agent_id', 'agent_id')
    check_signature(HumanFallbackRepository, 'get_all_human_fallback_by_business_id', 'business_id')

if __name__ == "__main__":
    test_repositories()
