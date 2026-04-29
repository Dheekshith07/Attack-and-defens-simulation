import { useState, useEffect } from 'react';
import { getLogs, performDefense, analyzeAI, getStatus } from '../services/api';
import { AlertCircle, ShieldAlert, Cpu } from 'lucide-react';

export default function DefensePanel() {
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ipToBlock, setIpToBlock] = useState('');

  const fetchData = async () => {
    try {
      const logsData = await getLogs();
      setLogs(logsData);
      const statusData = await getStatus();
      setStatus(statusData);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleBlock = async (ip) => {
    setLoading(true);
    await performDefense('block_ip', ip);
    await fetchData();
    setLoading(false);
    setIpToBlock('');
  };

  const handleUnblock = async (ip) => {
    setLoading(true);
    await performDefense('unblock_ip', ip);
    await fetchData();
    setLoading(false);
  };

  const handleRunAI = async () => {
    setLoading(true);
    const res = await analyzeAI();
    alert(`AI Analysis Complete. Found ${res.found_anomalies} anomalies.`);
    await fetchData();
    setLoading(false);
  };

  return (
    <div>
      <h1 className="page-title" style={{ color: 'var(--primary)' }}>Blue Team: Defense Panel</h1>
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button className="btn btn-primary" onClick={handleRunAI} disabled={loading}>
          <Cpu size={18} /> Run AI Analysis
        </button>
      </div>

      <div className="dashboard-grid" style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
          <h3>Manual IP Block</h3>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <input 
              type="text" 
              className="input" 
              placeholder="e.g. 192.168.1.100" 
              value={ipToBlock}
              onChange={(e) => setIpToBlock(e.target.value)}
              style={{ marginBottom: 0 }}
            />
            <button className="btn btn-danger" onClick={() => handleBlock(ipToBlock)} disabled={!ipToBlock || loading}>
               Block
            </button>
          </div>
        </div>

        <div className="card">
          <h3>Active Blocklist</h3>
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {status?.blocked_ips?.length > 0 ? (
               status.blocked_ips.map(ip => (
                 <div key={ip} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-input)', padding: '0.5rem 1rem', borderRadius: '0.5rem' }}>
                    <span style={{ fontFamily: 'monospace' }}>{ip}</span>
                    <button className="btn btn-success" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }} onClick={() => handleUnblock(ip)}>Unblock</button>
                 </div>
               ))
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>No IPs blocked currently.</p>
            )}
          </div>
        </div>
      </div>

      <h2>Alerts & Logs</h2>
      <div className="card table-container" style={{ marginTop: '1rem' }}>
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>IP Address</th>
              <th>Type</th>
              <th>AI Flag</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>{log.time}</td>
                <td style={{ fontFamily: 'monospace' }}>{log.ip}</td>
                <td>{log.type}</td>
                <td>
                  {log.anomaly ? <span className="badge anomaly" style={{ display: 'flex', alignItems: 'center', width: 'fit-content', gap: '0.25rem' }}><ShieldAlert size={14}/> Anomaly</span> : '-'}
                </td>
                <td>
                  {!log.blocked ? (
                    <button className="btn btn-primary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }} onClick={() => handleBlock(log.ip)}>
                       Block IP
                    </button>
                  ) : <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>Blocked</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
