import os
import re
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from pydantic import BaseModel
from typing import Optional, List
from fastapi import HTTPException


BUCKET_COUNT = 6

load_dotenv()


class HistogramData(BaseModel):
    metric_key: str
    unit: Optional[str]
    higher_is_better: bool
    player_value: float
    sample_size: int
    min_value: float
    max_value: float
    buckets: List[float]
    counts: List[int]
    percentile: float


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


def create_stat() -> None:
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


def get_stats(metric_key, player_uuid) -> HistogramData:
    engine = get_engine()
    with engine.begin() as conn:
        metric_row = conn.execute(
            text(
                """
            SELECT id, unit, higher_is_better
            FROM metrics
            WHERE key = :metric_key;
            """
            ),
            {"metric_key": metric_key},
        ).fetchone()
        metric_id = metric_row.id
        unit = metric_row.unit
        higher_is_better = metric_row.higher_is_better

        try:
            player_value = conn.execute(
                text(
                    """
                    SELECT value
                    FROM metric_values
                    WHERE metric_id = :metric_id
                    AND player_uuid = :player_uuid
                    """
                ),
                {"metric_id": metric_id, "player_uuid": player_uuid},
            ).fetchone()[0]
            # print(player_value)
        except TypeError:
            raise HTTPException(404, "Player not found in database")

        bounds = conn.execute(
            text(
                """
                SELECT MIN(value) AS min_value,
                    MAX(value) AS max_value,
                    COUNT(*) AS sample_size
                FROM metric_values 
                WHERE metric_id = :metric_id
                """
            ),
            {"metric_id": metric_id},
        ).fetchone()
        # print(bounds)

        min_value = bounds.min_value
        max_value = bounds.max_value
        sample_size = bounds.sample_size

        buckets_row = conn.execute(
            text(
                """
                WITH bounds AS (
                SELECT MIN(log10(value + 1)) AS mn,
                        MAX(log10(value + 1)) AS mx
                FROM metric_values
                WHERE metric_id = :metric_id
                ),
                hist AS (
                SELECT LEAST(width_bucket(log10(value + 1), b.mn, b.mx + 1e-9, :bucket_count), :bucket_count) AS bucket,
                        COUNT(*) AS c
                FROM metric_values v
                CROSS JOIN bounds b
                WHERE v.metric_id = :metric_id
                GROUP BY bucket
                ),
                series AS (
                SELECT generate_series(1, :bucket_count) AS bucket
                )
                SELECT s.bucket, COALESCE(h.c, 0) AS count
                FROM series s
                LEFT JOIN hist h ON h.bucket = s.bucket
                ORDER BY s.bucket;
                """
            ),
            {"bucket_count": BUCKET_COUNT, "metric_id": metric_id},
        ).fetchall()

        buckets = [float(item[1]) for item in buckets_row]

        # print(buckets)
        bucket_edges_row = conn.execute(
            text(
                """
                WITH bounds AS (
                SELECT MIN(log10(value + 1)) AS mn,
                        MAX(log10(value + 1)) AS mx
                FROM metric_values
                WHERE metric_id = :metric_id
                )
                SELECT power(10, mn + (mx - mn) * (i::float / :bucket_count)) - 1 AS bucket_edge
                FROM bounds, generate_series(0, :bucket_count) AS i;
                """
            ),
            {"bucket_count": BUCKET_COUNT, "metric_id": metric_id},
        ).fetchall()
        bucket_edges = [float(item[0]) for item in bucket_edges_row]
        # print(bucket_edges)

        percentile_row = conn.execute(
            text(
                """
                SELECT
                100.0 * COUNT(*) FILTER (WHERE value <= :pv) / COUNT(*) AS pct
                FROM metric_values
                WHERE metric_id = :metric_id
            """
            ),
            {"pv": player_value, "metric_id": metric_id},
        ).fetchone()

        percentile = percentile_row.pct

        # print(percentile)
        histogram_data = HistogramData(
            metric_key=metric_key,
            unit=unit,
            higher_is_better=higher_is_better,
            sample_size=sample_size,
            min_value=float(min_value),
            max_value=float(max_value),
            buckets=bucket_edges,
            counts=buckets,
            percentile=float(percentile),
            player_value=float(player_value),
        )
        # print(histogram_data)
        return histogram_data


if __name__ == "__main__":
    get_stats("wynncraft_hours_played", "1ed075fc5aa942e0a29f640326c1d80c")
    # add_value("3ff2e63ad63045e0b96f57cd0eae708d", 7, 52)
