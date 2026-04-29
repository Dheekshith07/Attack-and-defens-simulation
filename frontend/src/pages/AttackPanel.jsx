import { useState, useEffect } from 'react';
import { startAttack, getLogs } from '../services/api';

export default function AttackPanel() {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchLogs = async () => {
    try {
      const data = await getLogs();
      setLogs(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAttack = async (type) => {
    setLoading(true);
    try {
      await startAttack(type);
      await fetchLogs();
    } catch (e) {
      alert("Failed to launch attack." + e.message);
    }
    setLoading(false);
  };

  return (
    <div>
      <h1 className="page-title" style={{ color: 'var(--danger)' }}>Red Team: Attack Panel</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Launch simulated attacks against the system. These will generate logs and trigger AI anomaly detection if repeated.
      </p>

      <div className="attack-grid">
        <div className="card attack-card">
          <h3 style={{ color: 'var(--danger)' }}>Brute Force Login</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Attempts to guess admin passwords rapidly. Triggers AI after multiple attempts from the same IP.
          </p>
          <button className="btn btn-danger" onClick={() => handleAttack("Brute Force")} disabled={loading}>
            Launch Brute Force
          </button>
        </div>

        <div className="card attack-card">
          <h3 style={{ color: 'var(--danger)' }}>SQL Injection</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Simulates sending a malicious SQL payload ' OR 1=1 -- in the username field. High severity.
          </p>
          <button className="btn btn-danger" onClick={() => handleAttack("SQL Injection")} disabled={loading}>
            Inject Payload
          </button>
        </div>

        <div className="card attack-card">
          <h3 style={{ color: 'var(--danger)' }}>Phishing Sim</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Simulates a user clicking a bad link. Low severity, harder to detect purely via network.
          </p>
          <button className="btn btn-danger" onClick={() => handleAttack("Phishing")} disabled={loading}>
            Deploy Phishing
          </button>
        </div>
      </div>

      <h2 style={{ marginTop: '3rem', marginBottom: '1rem' }}>Recent Actions</h2>
      <div className="card table-container">
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Target Type</th>
              <th>Severity</th>
              <th>Response</th>
            </tr>
          </thead>
          <tbody>
            {logs.slice(0, 10).map((log) => (
              <tr key={log.id}>
                <td>{log.time}</td>
                <td>{log.type}</td>
                <td><span className={`badge ${log.severity ? log.severity.toLowerCase() : ''}`}>{log.severity}</span></td>
                <td style={{ color: log.blocked ? 'var(--danger)' : 'var(--success)' }}>
                  {log.blocked ? "Connection Dropped (Blocked)" : "Success (Logged)"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
