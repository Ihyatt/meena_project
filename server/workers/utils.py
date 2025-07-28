from datetime import datetime, timezone


def backoff(
    attempt, base=1, factor=2, max_delay=60  # 1 second  # exponential
):  # optional cap
    delay = base * (factor**attempt)
    return min(delay, max_delay)
