from models import EventLog, SystemState, User, db

class DefenseMonitor:
    def __init__(self):
        pass

    def perform_action(self, action_type, target_ip=None):
        """
        Performs a defense action like blocking an IP.
        """
        user = User.query.first() # Assume single user for scoring
        
        if action_type == "block_ip" and target_ip:
            # Check if already blocked
            existing = SystemState.query.filter_by(key=f"blocked_ip_{target_ip}").first()
            if existing and existing.value == "True":
                 return {"status": "Already blocked"}

            if existing:
                 existing.value = "True"
            else:
                 new_state = SystemState(key=f"blocked_ip_{target_ip}", value="True")
                 db.session.add(new_state)

            # Update past unblocked logs to reflect that action was taken (optional context)
            # Add defense points
            if user:
                 user.score += 10
                 db.session.add(user)
                 
            db.session.commit()
            return {"status": f"Successfully blocked IP: {target_ip}"}

        elif action_type == "unblock_ip" and target_ip:
             existing = SystemState.query.filter_by(key=f"blocked_ip_{target_ip}").first()
             if existing:
                 existing.value = "False"
                 db.session.commit()
                 return {"status": f"Successfully unblocked IP: {target_ip}"}
             return {"status": "IP not found in blocklist"}
             
        elif action_type == "clear_logs":
             EventLog.query.delete()
             db.session.commit()
             return {"status": "Logs cleared"}

        return {"error": "Invalid action"}
