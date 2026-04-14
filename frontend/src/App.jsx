import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation, Link } from 'react-router-dom';
import { Heart, Bell, User as UserIcon, LogOut, Moon, Sun, ShieldCheck, PhoneCall, Layout, Smile, BookOpen, MessageCircle, Calendar } from 'lucide-react';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import MoodCheckIn from './pages/MoodCheckIn';
import Resources from './pages/Resources';
import Chatbot from './pages/Chatbot';
import MoodCalendar from './pages/MoodCalendar';
import Favorites from './pages/Favorites';
import { NAV_ITEMS, AFFIRMATIONS } from './utils/constants';

const App = () => {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(!!localStorage.getItem('token'));
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [checkIns, setCheckIns] = useState([]);
  const [savedResourceIds, setSavedResourceIds] = useState([]);
  const [, setNotifications] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setUser(data.data);
          } else {
            localStorage.removeItem('token');
          }
        } else {
          localStorage.removeItem('token');
        }
      } catch (err) {
        console.error("Session check failed:", err);
      } finally {
        setIsAuthLoading(false);
      }
    };
    checkSession();
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const fetchCheckIns = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch('/api/checkins', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            const sortedData = json.data.sort((a, b) => new Date(b.date) - new Date(a.date));
            setCheckIns(sortedData);
          }
        }
      } catch (err) {
        console.error("Error fetching checkins:", err);
      }
    };
    if (user) fetchCheckIns();
  }, [user]);

  const handleLogin = (userData) => {
    setUser(userData);
    setNotifications([`Welcome back, ${userData.name}! Ready for today's check-in?`]);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    navigate('/');
  };

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const handleNewCheckIn = async (checkIn) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/checkins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(checkIn)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setCheckIns(prev => [json.data, ...prev]);
          navigate('/dashboard');
          setNotifications(prev => [`Thanks for checking in! 🌱`, ...prev]);
        }
      }
    } catch (err) {
      console.error("Error posting checkin:", err);
    }
  };

  const toggleFavorite = (id) => {
    setSavedResourceIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  if (isAuthLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-primary-200 dark:border-primary-800 border-t-primary-500 rounded-full animate-spin"></div>
          <Heart className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary-500 animate-pulse" size={24} fill="currentColor" />
        </div>
        <p className="mt-6 text-slate-500 dark:text-slate-400 font-bold animate-pulse">Initializing MindEase...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage onLogin={handleLogin} view="landing" />} />
        <Route path="/login" element={<LandingPage onLogin={handleLogin} view="login" />} />
        <Route path="/signup" element={<LandingPage onLogin={handleLogin} view="signup" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <div className="flex w-full h-full bg-slate-50 dark:bg-black transition-colors duration-500 selection:bg-primary-100 selection:text-primary-700 text-slate-900 dark:text-slate-100">
      {/* Sidebar */}
      <aside className="sticky top-0 h-screen w-64 bg-white dark:bg-slate-900/50 border-r border-slate-200 dark:border-slate-800 hidden md:flex flex-col z-50 animate-scale-in">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center text-white shadow-2xl shadow-primary-500/30 group cursor-pointer">
            <Heart size={20} fill="white" className="group-hover:scale-125 transition-transform duration-300" />
          </div>
          <span className="font-black text-2xl tracking-tighter text-slate-800 dark:text-white">MindEase</span>
        </div>

        <nav className="flex-1 px-4 py-2 flex flex-col gap-2">
          {NAV_ITEMS.map((item, idx) => {
            const isActive = location.pathname === `/${item.id}`;
            return (
              <Link
                key={item.id}
                to={`/${item.id}`}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-black transition-all duration-300 hover-lift animate-fade-in-up ${isActive
                  ? 'bg-primary-500 text-white shadow-xl shadow-primary-500/40 translate-x-1'
                  : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-primary-500'
                  }`}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary-500'} transition-colors`}>
                  {React.cloneElement(item.icon, { size: 20, strokeWidth: 2.5 })}
                </div>
                <span className="text-base tracking-wide">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-slate-50 dark:border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-3 w-full text-red-500 font-black hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-300"
          >
            <LogOut size={20} strokeWidth={2.5} />
            <span className="text-base tracking-wide">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="p-8 pb-4 flex justify-between items-center relative z-10 animate-fade-in-up">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Hey, {user?.name.split(' ')[0] || 'Guest'} <span className="animate-float inline-block">👋</span>
            </h1>
            <p className="text-slate-400 dark:text-slate-400 font-bold tracking-wide uppercase text-xs">Your sanctuary is ready</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative cursor-pointer text-slate-400 hover:text-primary-500 transition-all hover:scale-110 active:scale-90">
              <Bell size={24} strokeWidth={2} />
              <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 rounded-full border-[3px] border-white dark:border-slate-900 ring-2 ring-red-500 animate-pulse"></div>
            </div>

            <button
              onClick={toggleDarkMode}
              className="p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 text-slate-400 hover:text-primary-500 shadow-sm transition-all hover-lift"
            >
              {isDarkMode ? <Sun size={22} strokeWidth={2.5} /> : <Moon size={22} strokeWidth={2.5} />}
            </button>

            <div className="flex items-center gap-5 pl-8 border-l border-slate-100 dark:border-slate-800">
              <div className="text-right hidden lg:block">
                <p className="text-sm font-black text-slate-900 dark:text-white">{user?.name || 'Guest User'}</p>
                <p className="text-[10px] text-primary-500 font-black tracking-[0.2em] uppercase">{user?.preferredLanguage || 'ENGLISH'}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-indigo-500 rounded-xl p-0.5 shadow-lg shadow-primary-500/20 hover:rotate-6 transition-transform cursor-pointer">
                <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[10px] flex items-center justify-center text-primary-500">
                  <UserIcon size={26} strokeWidth={2.5} />
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 px-4 md:px-10 pt-4 pb-24 md:pb-10 overflow-y-auto no-scrollbar relative z-0 animate-scale-in">
          <Routes>
            <Route path="/dashboard" element={<Dashboard checkIns={checkIns} />} />
            <Route path="/checkin" element={<MoodCheckIn onSubmit={handleNewCheckIn} />} />
            <Route path="/resources" element={<Resources onSave={toggleFavorite} savedIds={savedResourceIds} checkIns={checkIns} />} />
            <Route path="/chatbot" element={<Chatbot latestMood={checkIns[0]?.mood} />} />
            <Route path="/calendar" element={<MoodCalendar checkIns={checkIns} />} />
            <Route path="/favorites" element={<Favorites onSave={toggleFavorite} savedIds={savedResourceIds} />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>

        {/* Mobile Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 md:hidden flex justify-around items-center h-20 px-4 z-50">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === `/${item.id}`;
            return (
              <Link
                key={item.id}
                to={`/${item.id}`}
                className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive ? 'text-primary-600 scale-110' : 'text-slate-400'}`}
              >
                {React.cloneElement(item.icon, { size: 24, strokeWidth: isActive ? 3 : 2 })}
                <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </main>
    </div>
  );
};

export default App;