import pandas as pd
from sklearn.ensemble import IsolationForest
from models import EventLog, db
import logging

class AnomalyDetector:
    def __init__(self):
        # We use IsolationForest for unsupervised anomaly detection
        # We will fit it on recent event frequencies per IP
        self.model = IsolationForest(contamination=0.1, random_state=42)
        self.is_fitted = False

    def analyze_logs(self):
        """
        Analyzes the unflagged EventLogs to find anomalies.
        Returns a list of anomalies found.
        """
        # Get logs from last hour (for simplicity, we'll get all logs here, 
        # but in a real system we'd filter by time)
        logs = EventLog.query.all()
        if len(logs) < 10:
            return [] # Not enough data to find anomalies reliably

        # Extract features for anomaly detection
        # Basic features: count of events per source_ip
        data = []
        for log in logs:
            data.append({
                'id': log.id,
                'source_ip': log.source_ip,
                'event_type': log.event_type
            })
        
        df = pd.DataFrame(data)
        
        # Group by IP to get frequency of attacks
        ip_counts = df.groupby('source_ip').size().reset_index(name='count')
        
        # If we have very few unique IPs, isolation forest might not work well
        if len(ip_counts) < 3:
             # Heuristic fallback: if an IP has > 5 attacks, mark as anomaly
             anomalies = []
             for index, row in ip_counts.iterrows():
                 if row['count'] > 5:
                     anomalous_logs = df[df['source_ip'] == row['source_ip']]
                     for _, log_row in anomalous_logs.iterrows():
                          log = EventLog.query.get(log_row['id'])
                          if not log.is_anomaly:
                              log.is_anomaly = True
                              anomalies.append({
                                  'id': log.id,
                                  'source_ip': log.source_ip,
                                  'reason': 'High frequency of events detected via heuristic rule.'
                              })
             if anomalies:
                  db.session.commit()
             return anomalies

        # Fit model
        X = ip_counts[['count']]
        self.model.fit(X)
        ip_counts['anomaly'] = self.model.predict(X)

        # -1 indicates anomaly
        anomalous_ips = ip_counts[ip_counts['anomaly'] == -1]['source_ip'].tolist()

        anomalies = []
        for ip in anomalous_ips:
            anomalous_logs = df[df['source_ip'] == ip]
            for _, log_row in anomalous_logs.iterrows():
                 log = EventLog.query.get(log_row['id'])
                 if not log.is_anomaly:
                      log.is_anomaly = True
                      anomalies.append({
                          'id': log.id,
                          'source_ip': log.source_ip,
                          'reason': 'Statistically anomalous frequency of events detected via AI model.'
                      })
        
        if anomalies:
             db.session.commit()

        return anomalies
