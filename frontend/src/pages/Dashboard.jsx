import { useState, useEffect } from 'react';
import { getStatus, getLogs } from '../services/api';

export default function Dashboard() {
  const [status, setStatus] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getStatus();
        setStatus(data);
      } catch (err) {
        console.error(err);
      }
    };
    
    fetchData();
    const interval = setInterval(fetchData, 2000); // Polling every 2s
    return () => clearInterval(interval);
  }, []);

  if (!status) return <div>Loading dashboard...</div>;

  return (
    <div>
      <h1 className="page-title">System Dashboard</h1>
      <div className="dashboard-grid">
        <div className="card">
          <h3>Defense Score</h3>
          <div className="stat-value">{status.score}</div>
        </div>
        <div className="card">
          <h3>AI Anomalies Detected</h3>
          <div className="stat-value" style={{ color: 'var(--danger)' }}>{status.recent_anomalies}</div>
        </div>
        <div className="card">
          <h3>Currently Blocked IPs</h3>
          <div className="stat-value" style={{ color: 'var(--success)' }}>{status.blocked_ips.length}</div>
        </div>
      </div>

      <h2 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Live Event Feed</h2>
      <div className="card table-container">
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Source IP</th>
              <th>Event Type</th>
              <th>Severity</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {status.logs.map((log) => (
              <tr key={log.id}>
                <td>{log.time}</td>
                <td>{log.ip}</td>
                <td>{log.type}</td>
                <td>
                  <span className={`badge ${log.severity ? log.severity.toLowerCase() : ''}`}>
                    {log.severity}
                  </span>
                </td>
                <td>
                  {log.blocked ? (
                    <span className="badge blocked">Blocked</span>
                  ) : log.anomaly ? (
                    <span className="badge anomaly">Anomaly FW</span>
                  ) : (
                    <span className="badge low">Allowed</span>
                  )}
                </td>
              </tr>
            ))}
            {status.logs.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No recent events</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
