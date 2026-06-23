import { NavLink } from 'react-router-dom';
import { Heart, LayoutDashboard, Users, Settings, LogOut } from 'lucide-react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/invites', label: 'Invites', icon: Users },
  { to: '/setup', label: 'Setup', icon: Settings },
];

export default function Navbar({ onLogout }) {
  return (
    <nav className="bg-white border-b border-rose-100 shadow-sm sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="bg-rose-100 rounded-full p-1.5">
            <Heart className="w-5 h-5 text-rose-600 fill-rose-400" />
          </div>
          <span className="font-bold text-gray-800 text-base hidden sm:block">Wedding Invitation</span>
        </div>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-rose-100 text-rose-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </NavLink>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </nav>
  );
}
