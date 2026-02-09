from fastapi import APIRouter, Depends, status

from src.app.controllers import AgentController
from src.app.middlewares.rbac import require_roles
from src.app.validators.agent_schema import CreateAgentIn
from src.core.utils.factory import controller_factory
from src.core.utils.response import success_response
from src.core.utils.security import jwtHandler

router = APIRouter(prefix="/api/agent", tags=["agent"])

get_agent_controller = controller_factory(AgentController)


@router.post("", status_code=status.HTTP_200_OK)
async def create_agent(
    payload: CreateAgentIn,
    _: None = Depends(jwtHandler.jwt_required),
    __: None = Depends(require_roles("admin", "user")),
    controller: AgentController = Depends(get_agent_controller),
):
    result = await controller.create_new_agent_handler(payload)
    return success_response(result, "Create new agent is successfully")


@router.get("/analytic/me", status_code=status.HTTP_200_OK)
async def get_analytic_agent(
    _: None = Depends(jwtHandler.jwt_required),
    __: None = Depends(require_roles("admin", "user")),
    controller: AgentController = Depends(get_agent_controller),
):
    result = await controller.get_agent_analytic()
    return success_response(result, "Get analytic agent is successfully")


@router.get("/status/me", status_code=status.HTTP_200_OK)
async def get_status_agent(
    _: None = Depends(jwtHandler.jwt_required),
    __: None = Depends(require_roles("admin", "user")),
    controller: AgentController = Depends(get_agent_controller),
):
    result = await controller.get_status_agent_handler()
    return success_response(result, "get status agent is successfully")


@router.put("/status/me", status_code=status.HTTP_200_OK)
async def update_status_agent(
    status: bool,
    _: None = Depends(jwtHandler.jwt_required),
    __: None = Depends(require_roles("admin", "user")),
    controller: AgentController = Depends(get_agent_controller),
):
    result = await controller.update_status_agent_handler(status)
    return success_response(result, "Update status agent is successfully")
