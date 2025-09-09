# db.py
import os
import re
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

db_url = os.getenv("DATABASE_URL").split("?")[0]
db_url = re.sub(r"^postgresql\+asyncpg:", "postgresql+psycopg2:", db_url)
db_url = re.sub(r"^postgresql:", "postgresql+psycopg2:", db_url)

engine = create_engine(
    db_url,
    connect_args={"sslmode": "require"},
    echo=False,
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
