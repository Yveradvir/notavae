from enum import Enum
from typing import Union


def enum_check(value: Union[str, int], enum: Enum) -> bool:
    """
    Function to check if enum's name or value match with given value
    
    Parameters:
        value (str or int): value that will be checked.
        enum (Enum): child of an enumeration.

    Example:
        class ExampleEnum(Enum):
            a = auto()
            b = auto()

        enum_check("a", ExampleEnum.a) >> True # due to "a" == ExampleEnum.a.name
        enum_check(1, ExampleEnum.a) >> True # due to 1 == ExampleEnum.a.value
        enum_check(2, ExampleEnum.a) >> False # due to neither 2 == ExampleEnum.b.value is True nor 2 == ExampleEnum.b.name
        enum_check("c", ExampleEnum.b) >> False # due to neither "c" == ExampleEnum.b.value is True nor "c" == ExampleEnum.b.name
        enum_check("noneresulted", 12) >> raise ValueError # due to typing checking
    """

    if not isinstance(enum, Enum):
        raise ValueError(f"Should be enum's child, but given {type(enum)}")

    return enum.name == value or enum.value == value