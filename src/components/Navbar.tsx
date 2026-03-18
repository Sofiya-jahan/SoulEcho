import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, BookOpen, Calendar, History, BarChart3, LogOut, PlusCircle } from 'lucide-react';
import { auth } from '../services/firebase';
import { signOut } from 'firebase/auth';
import { useAuth } from '../services/AuthContext';

const Navbar: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!user) return null;

  return (
    <nav className="w-full bg-white/80 backdrop-blur-md border-b border-black/5 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="p-1.5 bg-[#5A5A40] rounded-full shadow-sm">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <span className="serif text-xl font-medium text-[#5A5A40]">SoulEcho</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/write" icon={<PlusCircle className="w-4 h-4" />} label="Write" />
            <NavLink to="/history" icon={<History className="w-4 h-4" />} label="History" />
            <NavLink to="/calendar" icon={<Calendar className="w-4 h-4" />} label="Calendar" />
            <NavLink to="/analysis" icon={<BarChart3 className="w-4 h-4" />} label="Analysis" />
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-400 hover:text-[#5A5A40] transition-colors text-sm font-medium uppercase tracking-widest"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => (
  <Link
    to={to}
    className="flex items-center gap-2 text-gray-400 hover:text-[#5A5A40] transition-colors text-sm font-medium uppercase tracking-widest"
  >
    {icon}
    {label}
  </Link>
);

export default Navbar;
