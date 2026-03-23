from typing import Generic, TypeVar, Optional, Any
from pydantic.generics import GenericModel

T = TypeVar("T")

class Response(GenericModel, Generic[T]):
    success: bool = True
    message: str = "Operation successful"
    data: Optional[T] = None
    error: Optional[Any] = None
