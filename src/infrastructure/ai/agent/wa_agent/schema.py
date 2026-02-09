from pydantic import BaseModel


class BusinessDetailInformation(BaseModel):
    business_name: str
    business_desc: str
    business_location: str
