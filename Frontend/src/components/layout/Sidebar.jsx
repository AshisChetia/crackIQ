import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Zap, History, FileText, Settings, LogOut, Brain } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'New Simulation', path: '/exam/setup', icon: <Zap size={20} /> },
    { name: 'Performance History', path: '/history', icon: <History size={20} /> },
    { name: 'Resume Intelligence', path: '/resume', icon: <FileText size={20} /> },
  ];

  const bottomItems = [
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <aside className="fixed top-0 left-0 h-screen w-[260px] bg-surface-lowest/80 backdrop-blur-2xl border-r border-outline-variant/20 flex flex-col justify-between py-8 px-5 z-50 transition-all duration-300">
      
      {/* Branding */}
      <div>
        <div className="flex items-center gap-3 px-3 mb-12">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center shadow-[0_0_15px_rgba(207,188,255,0.15)]">
            <Brain size={20} className="text-primary" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-light">CrackIQ</span>
        </div>

        {/* Main Navigation */}
        <div className="flex flex-col gap-2">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-outline px-3 mb-2">Cognitive Core</div>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-primary/10 text-primary border border-primary/20 shadow-[inset_0_0_20px_rgba(207,188,255,0.05)]'
                    : 'text-outline hover:bg-surface-container hover:text-light'
                }`
              }
            >
              <span className="shrink-0 transition-transform group-hover:scale-110">{item.icon}</span>
              <span className="truncate">{item.name}</span>
            </NavLink>
          ))}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col gap-2">
        <div className="text-[10px] font-semibold uppercase tracking-widest text-outline px-3 mb-2">System</div>
        {bottomItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-primary/10 text-primary border border-primary/20 shadow-[inset_0_0_20px_rgba(207,188,255,0.05)]'
                  : 'text-outline hover:bg-surface-container hover:text-light'
              }`
            }
          >
            <span className="shrink-0 transition-transform group-hover:scale-110">{item.icon}</span>
            <span className="truncate">{item.name}</span>
          </NavLink>
        ))}
        
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-danger/80 hover:bg-danger/10 hover:text-danger hover:border-danger/20 border border-transparent transition-all duration-200 group mt-2"
        >
          <span className="shrink-0 transition-transform group-hover:scale-110"><LogOut size={20} /></span>
          <span className="truncate">Terminate Session</span>
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;
