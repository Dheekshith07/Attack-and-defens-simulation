import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Activity, Shield, Crosshair, LayoutDashboard } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import AttackPanel from './pages/AttackPanel';
import DefensePanel from './pages/DefensePanel';

function App() {
  return (
    <Router>
      <div className="app-container">
        <aside className="sidebar">
          <div className="sidebar-title">
            <Activity className="live-indicator" style={{ marginRight: '8px', verticalAlign: 'middle' }}/>
            Cyber Range
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              <LayoutDashboard size={20} /> Dashboard
            </NavLink>
            <NavLink to="/attack" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              <Crosshair size={20} /> Red Team (Attack)
            </NavLink>
            <NavLink to="/defense" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              <Shield size={20} /> Blue Team (Defense)
            </NavLink>
          </nav>
        </aside>
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/attack" element={<AttackPanel />} />
            <Route path="/defense" element={<DefensePanel />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
