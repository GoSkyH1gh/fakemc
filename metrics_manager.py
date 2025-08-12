import os
import re
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()


def get_engine():
    # Use psycopg2 for sync PostgreSQL
    db_url = os.getenv("DATABASE_URL").split("?")[0]
    db_url = re.sub(r"^postgresql\+asyncpg:", "postgresql+psycopg2:", db_url)
    db_url = re.sub(r"^postgresql:", "postgresql+psycopg2:", db_url)

    engine = create_engine(
        db_url,
        connect_args={"sslmode": "require"},
        echo=False,
    )
    return engine


def add_value(conn, uuid, id, value) -> None:
    conn.execute(
        text(
            """
            INSERT INTO metric_values (player_uuid, metric_id, value)
            VALUES(:player_uuid, :metric_id, :value)
            ON CONFLICT (player_uuid, metric_id)
            DO UPDATE SET value = EXCLUDED.value
            """
        ),
        {"player_uuid": uuid, "metric_id": id, "value": value},
    )


def add_stat() -> None:
    engine = get_engine()
    with engine.begin() as conn:
        conn.execute(
            text(
                "INSERT INTO metrics (key, label, source, unit) VALUES(:key, :label, :source, :unit)"
            ),
            {
                "key": "wynncraft_raids_completed",
                "label": "Raids Completed",
                "source": "wynncraft",
                "unit": None,
            },
        )


if __name__ == "__main__":
    pass
    # add_value("3ff2e63ad63045e0b96f57cd0eae708d", 7, 52)
