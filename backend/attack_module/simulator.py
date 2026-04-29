from models import EventLog, SystemState, db
import random

class AttackSimulator:
    def __init__(self):
        self.attacks = [
            {"type": "Brute Force", "severity": "Medium", "details": "Repeated login attempts to admin account."},
            {"type": "SQL Injection", "severity": "High", "details": "Suspicious payload in username field: ' OR 1=1 --"},
            {"type": "Phishing", "severity": "Low", "details": "Click on suspicious link from user email spoofing."}
        ]
        self.ips = ["192.168.1.100", "10.0.0.55", "172.16.0.4", "203.0.113.45"]

    def launch_attack(self, attack_type):
        """
        Simulates an attack by creating a log entry in the database.
        Returns the generated event log.
        """
        # Find the matching attack details
        attack_info = next((a for a in self.attacks if a["type"] == attack_type), None)
        if not attack_info:
            return {"error": "Invalid attack type."}

        source_ip = random.choice(self.ips)
        
        # Check if IP is currently blocked
        # (For simplicity in simulation, we'll still log blocked attacks but flag them as blocked)
        is_blocked = False
        blocked_state = SystemState.query.filter_by(key=f"blocked_ip_{source_ip}").first()
        if blocked_state and blocked_state.value == "True":
            is_blocked = True

        new_log = EventLog(
            source_ip=source_ip,
            event_type=attack_info["type"],
            severity=attack_info["severity"],
            details=attack_info["details"],
            is_blocked=is_blocked
        )

        db.session.add(new_log)
        db.session.commit()

        # Generate anomalies deliberately sometimes (if same IP bursts):
        # We'll randomly burst brute force to trigger AI
        if attack_type == "Brute Force" and random.random() > 0.5:
             for _ in range(6):
                 burst_log = EventLog(
                     source_ip=source_ip,
                     event_type=attack_info["type"],
                     severity=attack_info["severity"],
                     details="Burst attempt",
                     is_blocked=is_blocked
                 )
                 db.session.add(burst_log)
             db.session.commit()

        return {
             "id": new_log.id,
             "source_ip": new_log.source_ip,
             "event_type": new_log.event_type,
             "severity": new_log.severity,
             "is_blocked": new_log.is_blocked
        }
