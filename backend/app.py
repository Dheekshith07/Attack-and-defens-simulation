from flask import Flask, jsonify, request
from flask_cors import CORS
from models import db, User, EventLog, SystemState
from attack_module.simulator import AttackSimulator
from defense_module.monitor import DefenseMonitor
from ai_module.anomaly_detector import AnomalyDetector
import os

app = Flask(__name__)
CORS(app)

# Database Configuration
basedir = os.path.abspath(os.path.dirname(__file__))
db_path = os.path.join(basedir, 'database', 'cyber_range.db')
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

# Initialize Modules
attack_sim = AttackSimulator()
defense_mon = DefenseMonitor()
ai_detector = AnomalyDetector()

with app.app_context():
    # Ensure database directory exists
    os.makedirs(os.path.dirname(db_path), exist_ok=True)
    db.create_all()
    # Create default user if not exists
    if not User.query.first():
        default_user = User(username="Defender", score=0)
        db.session.add(default_user)
        db.session.commit()


@app.route('/api/status', methods=['GET'])
def get_status():
    user = User.query.first()
    recent_logs = EventLog.query.order_by(EventLog.timestamp.desc()).limit(10).all()
    blocked_ips = SystemState.query.filter(SystemState.key.like('blocked_ip_%'), SystemState.value == 'True').all()
    
    anomalies = EventLog.query.filter_by(is_anomaly=True).order_by(EventLog.timestamp.desc()).limit(5).all()

    return jsonify({
        "score": user.score if user else 0,
        "logs": [{"id": l.id, "ip": l.source_ip, "type": l.event_type, "severity": l.severity, "blocked": l.is_blocked, "anomaly": l.is_anomaly, "time": l.timestamp.strftime("%Y-%m-%d %H:%M:%S")} for l in recent_logs],
        "blocked_ips": [b.key.replace("blocked_ip_", "") for b in blocked_ips],
        "recent_anomalies": len(anomalies)
    })

@app.route('/api/attack/start', methods=['POST'])
def start_attack():
    data = request.json
    attack_type = data.get('type')
    if not attack_type:
        return jsonify({"error": "Attack type required"}), 400
    
    result = attack_sim.launch_attack(attack_type)
    return jsonify(result)

@app.route('/api/defense/action', methods=['POST'])
def perform_defense():
    data = request.json
    action_type = data.get('action')
    target_ip = data.get('ip')
    
    if not action_type:
        return jsonify({"error": "Action required"}), 400
        
    result = defense_mon.perform_action(action_type, target_ip)
    return jsonify(result)

@app.route('/api/ai/analyze', methods=['GET'])
def run_ai_analysis():
    anomalies = ai_detector.analyze_logs()
    return jsonify({"found_anomalies": len(anomalies), "details": anomalies})

@app.route('/api/logs', methods=['GET'])
def get_logs():
    logs = EventLog.query.order_by(EventLog.timestamp.desc()).limit(100).all()
    return jsonify([{
        "id": l.id,
        "ip": l.source_ip,
        "type": l.event_type,
        "severity": l.severity,
        "blocked": l.is_blocked,
        "anomaly": l.is_anomaly,
        "details": l.details,
        "time": l.timestamp.strftime("%Y-%m-%d %H:%M:%S")
    } for l in logs])

if __name__ == '__main__':
    app.run(debug=True, port=5000)
