from app import create_app
from app.extensions import db
import os

app = create_app()

db_path = os.path.join(app.instance_path, 'dev.db')
if os.path.exists(db_path):
    print(f"Removing existing database at {db_path}")
    os.remove(db_path)

with app.app_context():
    print("Creating all tables...")
    db.create_all()
    print("Database reset successful.")
