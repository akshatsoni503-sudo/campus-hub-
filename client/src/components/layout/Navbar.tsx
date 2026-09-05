import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Bell, Search, User, LogOut, Shield, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { notificationAPI } from '../../services/api';
import Badge from '../ui/Badge';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAuthenticated) {
      notificationAPI.getUnreadCount().then(res => setUnreadCount(res.data.count || 0)).catch(() => {});
    }
  }, [isAuthenticated, location]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => { if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const isActive = (path: string) => location.pathname === path;
  const navLink = (to: string, label: string, pill = false) => (
    <Link to={to} className={`px-4 py-2 text-sm font-medium transition-colors ${pill ? 'border border-gray-300 rounded-full hover:border-[#17105F] hover:text-[#17105F]' : 'hover:text-[#1769E0]'} ${isActive(to) ? 'text-[#1769E0] font-semibold' + (pill ? ' border-[#17105F] text-[#17105F]' : '') : 'text-gray-700'}`}>{label}</Link>
  );

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left */}
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"><Menu className="w-5 h-5" /></button>
            <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#17105F] rounded-lg flex items-center justify-center"><span className="text-white font-bold text-sm">CH</span></div>
              <span className="text-xl font-bold text-[#17105F]">Campus <span className="font-extrabold">Hub</span></span>
            </Link>
          </div>

          {/* Center nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLink(isAuthenticated ? '/dashboard' : '/', 'Home')}
            {navLink('/explore', 'Explore')}
            {navLink('/teams', 'Teams', true)}
            {navLink('/clubs', 'Clubs', true)}
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link to="/notifications" className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Bell className="w-5 h-5 text-gray-600" />
                  {unreadCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{unreadCount > 9 ? '9+' : unreadCount}</span>}
                </Link>
                <div ref={profileRef} className="relative">
                  <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-full transition-colors">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#17105F] to-[#1769E0] rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">{user?.name?.charAt(0)}</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500 hidden sm:block" />
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-fadeIn">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                        {user?.verificationStatus === 'VERIFIED' && <Badge variant="green" className="mt-1">✓ Verified</Badge>}
                      </div>
                      <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setProfileOpen(false)}><User className="w-4 h-4" /> Profile</Link>
                      <Link to="/copilot" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setProfileOpen(false)}>🤖 Campus Copilot</Link>
                      {user?.role === 'ADMIN' && <Link to="/admin" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setProfileOpen(false)}><Shield className="w-4 h-4" /> Admin Panel</Link>}
                      <hr className="my-1" />
                      <button onClick={() => { logout(); navigate('/'); setProfileOpen(false); }} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"><LogOut className="w-4 h-4" /> Sign Out</button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link to="/login" className="px-5 py-2 text-sm font-semibold border-2 border-[#17105F] text-[#17105F] rounded-full hover:bg-[#17105F] hover:text-white transition-colors">Student Login</Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl animate-slideIn">
            <div className="flex items-center justify-between p-4 border-b">
              <span className="text-lg font-bold text-[#17105F]">Campus Hub</span>
              <button onClick={() => setMobileOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="p-4 space-y-1">
              {[{ to: isAuthenticated ? '/dashboard' : '/', label: 'Home' }, { to: '/explore', label: 'Explore' }, { to: '/teams', label: 'Teams' }, { to: '/clubs', label: 'Clubs' },
                ...(isAuthenticated ? [{ to: '/profile', label: 'Profile' }, { to: '/copilot', label: 'Campus Copilot' }, { to: '/notifications', label: 'Notifications' }] : []),
                ...(user?.role === 'ADMIN' ? [{ to: '/admin', label: 'Admin Panel' }] : []),
              ].map(item => (
                <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium ${isActive(item.to) ? 'bg-[#F5F3FF] text-[#17105F]' : 'text-gray-700 hover:bg-gray-50'}`}>{item.label}</Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
