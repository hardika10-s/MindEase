import React from 'react';
import { Heart, ArrowRight, Shield, Star, Users, MessageSquare, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Login from '../auth/Login';
import Signup from '../auth/Signup';

const LandingPage = ({ onLogin, view }) => {
    const navigate = useNavigate();

    if (view === 'landing') {
        return (
            <div className="h-screen w-full bg-white dark:bg-slate-950 overflow-y-auto overflow-x-hidden relative no-scrollbar selection:bg-primary-100 selection:text-primary-700 text-slate-900 dark:text-slate-100">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-200/40 dark:bg-primary-900/20 rounded-full blur-[120px] -mr-64 -mt-64 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-indigo-200/30 dark:bg-indigo-900/10 rounded-full blur-[150px] -ml-64 -mb-64 opacity-60"></div>

                <nav className="max-w-7xl mx-auto px-8 py-8 flex items-center justify-between relative z-10 animate-fade-in-up">
                    <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary-500/20 group-hover:rotate-12 transition-transform duration-300">
                            <Heart fill="white" size={24} />
                        </div>
                        <span className="text-2xl font-black tracking-tight text-slate-800 dark:text-white">MindEase</span>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={() => navigate('/login')} className="px-6 py-2.5 font-bold text-slate-600 dark:text-slate-400 hover:text-primary-500 transition-all">Login</button>
                        <button onClick={() => navigate('/signup')} className="px-8 py-2.5 bg-primary-500 text-white rounded-2xl font-bold shadow-xl shadow-primary-500/30 hover:bg-primary-600 hover:scale-105 active:scale-95 transition-all">Get Started</button>
                    </div>
                </nav>

                <main className="max-w-7xl mx-auto px-6 md:px-8 pt-10 md:pt-16 pb-32 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <div className="space-y-6 md:space-y-10">
                            <div className="inline-flex items-center gap-2 px-6 py-2 bg-primary-100/50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full font-bold text-xs md:text-sm tracking-wide animate-fade-in-up stagger-1">
                                <Sparkles size={16} className="text-amber-400" />
                                <span>Personalized Mental Wellness Journey</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 dark:text-white leading-[1.05] animate-fade-in-up stagger-2">
                                Prioritize <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-indigo-600">Your Peace </span> <br />
                                of Mind.
                            </h1>
                            <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed font-medium animate-fade-in-up stagger-3">
                                "Mental health is not a destination, but a process. It's about how you drive, not where you're going."
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 animate-fade-in-up stagger-4">
                                <button
                                    onClick={() => navigate('/signup')}
                                    className="px-8 md:px-10 py-4 md:py-5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-[24px] font-bold text-lg md:text-xl flex items-center justify-center gap-3 hover:shadow-2xl hover:shadow-primary-500/20 active:scale-95 transition-all group w-full sm:w-auto"
                                >
                                    Start Exploring
                                    <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" />
                                </button>
                            </div>

                            <div className="flex items-center gap-6 md:gap-10 pt-4 md:pt-6 animate-fade-in-up stagger-5">
                                <div className="flex -space-x-4">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <img key={i} src={`https://picsum.photos/seed/user${i}/100/100`} className="w-10 h-10 md:w-12 md:h-12 rounded-full border-4 border-white dark:border-slate-800 shadow-xl" alt="User" />
                                    ))}
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">15,000+</p>
                                    <p className="text-[10px] md:text-sm font-bold text-slate-400 uppercase tracking-widest">Active Seekers</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative animate-scale-in stagger-3 mt-12 lg:mt-0">
                            <div className="relative z-10 w-full rounded-[40px] md:rounded-[60px] overflow-hidden shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)]">
                                <img src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=1200" className="w-full h-[400px] md:h-[600px] lg:h-[700px] object-cover hover:scale-110 transition-transform duration-1000" alt="Calmness" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent flex flex-col justify-end p-6 md:p-12">
                                    <div className="glass-effect p-6 md:p-8 rounded-[30px] md:rounded-[40px] border border-white/20 shadow-2xl animate-fade-in-up">
                                        <p className="text-slate-800 dark:text-white text-lg md:text-2xl font-bold leading-tight italic">
                                            "MindEase transformed my daily routine. The check-ins are so intuitive, it feels like talking to a friend who truly understands."
                                        </p>
                                        <div className="flex items-center gap-4 mt-6">
                                            <div className="w-10 h-10 md:w-12 md:h-12 bg-primary-500 rounded-2xl flex items-center justify-center text-white font-bold text-sm md:text-base">EM</div>
                                            <div>
                                                <p className="text-slate-900 dark:text-white font-black text-base md:text-lg">Emma Miller</p>
                                                <p className="text-primary-500 font-bold text-[10px] md:text-sm tracking-wider uppercase">Verified Champion</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Stats - Hidden on Small Screens or Repositioned */}
                            <div className="hidden md:block absolute -top-10 -left-10 bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-2xl z-20 animate-float">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center text-green-600 text-2xl">😊</div>
                                    <div>
                                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Today's Pulse</p>
                                        <p className="text-xl font-bold text-slate-800 dark:text-white">Staying Calm</p>
                                    </div>
                                </div>
                            </div>

                            <div className="hidden md:block absolute bottom-10 -right-10 bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-2xl z-20 animate-float delay-700">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center text-amber-600">
                                        <Sparkles size={24} />
                                    </div>
                                    <span className="font-black text-slate-800 dark:text-white text-lg pr-4">AI Recommended</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-24 md:mt-48 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                        {[
                            { icon: <Shield className="w-6 h-6 md:w-8 md:h-8" />, title: "Secure & Private", desc: "Your vulnerability is respected. We use end-to-end encryption for every thought you share.", color: "primary" },
                            { icon: <Users className="w-6 h-6 md:w-8 md:h-8" />, title: "Expert Hub", desc: "Access a library of wisdom from top mental health professionals, curated just for you.", color: "rose" },
                            { icon: <MessageSquare className="w-6 h-6 md:w-8 md:h-8" />, title: "Empathetic AI", desc: "A companion that grows with you, learning how to best support your unique emotional path.", color: "emerald" }
                        ].map((feature, idx) => (
                            <div key={idx} className="p-8 md:p-10 bg-white dark:bg-slate-800 rounded-[32px] md:rounded-[48px] border border-slate-100 dark:border-slate-700 hover-lift group animate-fade-in-up" style={{ animationDelay: `${0.6 + (idx * 0.1)}s` }}>
                                <div className={`w-12 h-12 md:w-16 md:h-16 bg-${feature.color}-100 dark:bg-${feature.color}-900/30 text-${feature.color}-500 rounded-2xl flex items-center justify-center mb-6 md:mb-8 group-hover:rotate-6 transition-transform`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-4">{feature.title}</h3>
                                <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-primary-50 flex items-center justify-center p-6">
            <div className="w-full max-w-md max-h-[90vh] bg-white rounded-[40px] shadow-2xl overflow-y-auto no-scrollbar p-10 relative">
                <button
                    onClick={() => navigate('/')}
                    className="absolute top-8 left-8 p-2 rounded-full hover:bg-slate-100 transition-colors"
                >
                    <ArrowRight size={20} className="rotate-180" />
                </button>

                {view === 'login' ? (
                    <Login
                        onSwitch={() => navigate('/signup')}
                        onLoginSuccess={onLogin}
                    />
                ) : (
                    <Signup
                        onSwitch={() => navigate('/login')}
                        onSignupSuccess={onLogin}
                    />
                )}
            </div>
        </div>
    );
};

export default LandingPage;