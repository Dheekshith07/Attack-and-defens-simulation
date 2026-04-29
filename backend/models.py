from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False, unique=True)
    score = db.Column(db.Integer, default=0)

class EventLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    source_ip = db.Column(db.String(50), nullable=False)
    event_type = db.Column(db.String(50), nullable=False) # e.g. "Brute Force", "SQL Injection", "Phishing"
    severity = db.Column(db.String(20), nullable=False) # e.g. "Low", "Medium", "High"
    details = db.Column(db.Text, nullable=True)
    is_blocked = db.Column(db.Boolean, default=False)
    is_anomaly = db.Column(db.Boolean, default=False)

class SystemState(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String(50), unique=True, nullable=False)
    value = db.Column(db.String(255), nullable=True)
