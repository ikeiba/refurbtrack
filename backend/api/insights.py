# backend/api/insights.py
"""
Capa de datos/servicio reutilizable para estadísticas de precios.

Estas funciones son PURAS: reciben números (int/float/Decimal/str/None) o
secuencias de números y devuelven float o None. Nunca acceden a la base de
datos, por lo que son trivialmente testeables y no pueden inventar datos:
cuando no hay valores válidos devuelven None (no 0).
"""

from typing import Optional, Sequence


def num(value) -> Optional[float]:
    """Convierte un valor (Decimal, str, int, float, None) a float válido.

    Devuelve None si el valor es None, inválido o NaN.
    """
    if value is None:
        return None
    try:
        f = float(value)
    except (TypeError, ValueError):
        return None
    if f != f:  # Detecta NaN
        return None
    return f


def _positive(values: Sequence) -> list:
    """Filtra valores válidos y > 0."""
    return [n for n in (num(v) for v in values) if n is not None and n > 0]


def current_price(values: Sequence) -> Optional[float]:
    """Precio actual más bajo entre un conjunto de ofertas.

    Devuelve el mínimo de los precios válidos (> 0), o None si no hay ninguno.
    """
    valid = _positive(values)
    return min(valid) if valid else None


def min_30d(value) -> Optional[float]:
    """Mínimo de los últimos 30 días (normaliza el valor)."""
    return num(value)


def max_30d(value) -> Optional[float]:
    """Máximo de los últimos 30 días (normaliza el valor)."""
    return num(value)


def avg_30d(values: Sequence) -> Optional[float]:
    """Media aritmética de un conjunto de precios válidos (> 0)."""
    valid = _positive(values)
    if not valid:
        return None
    return round(sum(valid) / len(valid), 2)


def percentage_vs_average(current, average) -> Optional[float]:
    """(current - average) / average * 100. None si falta algún dato."""
    c, a = num(current), num(average)
    if c is None or a is None or a == 0:
        return None
    return round((c - a) / a * 100, 1)


def percentage_vs_minimum(current, minimum) -> Optional[float]:
    """(current - minimum) / minimum * 100. None si falta algún dato."""
    c, m = num(current), num(minimum)
    if c is None or m is None or m == 0:
        return None
    return round((c - m) / m * 100, 1)


def percentage_vs_maximum(current, maximum) -> Optional[float]:
    """(current - maximum) / maximum * 100. None si falta algún dato."""
    c, m = num(current), num(maximum)
    if c is None or m is None or m == 0:
        return None
    return round((c - m) / m * 100, 1)


def price_position(current, minimum, maximum) -> Optional[float]:
    """Posición normalizada del precio actual en el rango [min, max] (0=min, 100=max).

    None si falta algún dato o el rango es nulo (min == max).
    """
    c, mn, mx = num(current), num(minimum), num(maximum)
    if c is None or mn is None or mx is None or mx == mn:
        return None
    return round((c - mn) / (mx - mn) * 100, 1)


def position_label(position: Optional[float]) -> Optional[str]:
    """Etiqueta prudente de la posición del precio actual respecto al rango."""
    if position is None:
        return None
    if position <= 15:
        return "cerca del mínimo reciente"
    if position <= 45:
        return "por debajo de la media reciente"
    if position <= 55:
        return "en torno a la media reciente"
    if position <= 85:
        return "por encima de la media reciente"
    return "cerca del máximo reciente"
