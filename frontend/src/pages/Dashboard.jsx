import React, { useState, useEffect } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from 'recharts';
import { TrendingUp, Moon, Zap, Calendar, Heart, Loader2 } from 'lucide-react';

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const MOOD_EMOJIS = {
        'Happy': '😊',
        'Calm': '😌',
        'Stressed': '😫',
        'Anxious': '😰',
        'Lonely': '😔',
        'Overwhelmed': '🤯',
        'Sad': '😢'
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('/api/dashboard', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const json = await res.json();
                if (json.success) {
                    setData(json.data);
                } else {
                    setError(json.message);
                }
            } catch (error) {
                console.error("Dashboard data load failed:", error);
                setError("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="space-y-8 animate-pulse">
                {/* Stats Skeletons */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-[32px] border border-slate-100 dark:border-slate-700 h-32"></div>
                    ))}
                </div>
                {/* Charts Skeletons */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-[40px] border border-slate-100 dark:border-slate-700 h-[400px]"></div>
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-[40px] border border-slate-100 dark:border-slate-700 h-[400px]"></div>
                </div>
                {/* Activity Skeleton */}
                <div className="bg-white dark:bg-slate-800 p-8 rounded-[40px] border border-slate-100 dark:border-slate-700 h-64"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20 text-red-500 font-bold">
                {error}
            </div>
        );
    }

    const { chartData, recent_checkins, avg_sleep, dominant_mood, streak, total_checkins } = data;

    return (
        <div className="space-y-8">
            {/* Top Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {[
                    { title: "Current Streak", value: `${streak} Days`, icon: <TrendingUp className="w-5 h-5 md:w-6 md:h-6" />, color: "primary", remark: "60%" },
                    { title: "Avg Sleep", value: `${avg_sleep} hrs`, icon: <Moon className="w-5 h-5 md:w-6 md:h-6" />, color: "indigo", remark: "+12% from last week" },
                    { title: "Dominant Mood", value: dominant_mood, icon: <Heart className="w-5 h-5 md:w-6 md:h-6" />, color: "rose", remark: "Last 30 entries" },
                    { title: "Total Entries", value: total_checkins, icon: <Calendar className="w-5 h-5 md:w-6 md:h-6" />, color: "amber", remark: "Growth journey" }
                ].map((stat, idx) => (
                    <div key={idx} className={`bg-white dark:bg-slate-900/50 p-5 md:p-6 rounded-[24px] md:rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm hover-lift animate-fade-in-up stagger-${idx + 1}`}>
                        <div className="flex items-center gap-4 md:gap-5 mb-4 md:mb-5">
                            <div className={`w-12 h-12 md:w-14 md:h-14 bg-${stat.color}-50 dark:bg-${stat.color}-900/20 rounded-xl flex items-center justify-center text-${stat.color}-500 shadow-inner`}>
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-[10px] md:text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-0.5 md:mb-1">{stat.title}</p>
                                <p className="text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-none">{stat.value}</p>
                            </div>
                        </div>
                        {stat.color === 'primary' ? (
                            <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 md:h-2 rounded-full overflow-hidden">
                                <div className="bg-primary-500 h-full w-[60%] shimmer-effect"></div>
                            </div>
                        ) : (
                            <p className={`text-[10px] md:text-xs font-bold ${stat.color === 'rose' || stat.color === 'amber' ? 'text-slate-400' : 'text-green-500'}`}>{stat.remark}</p>
                        )}
                    </div>
                ))}
            </div>

            {/* Main Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Mood Trend */}
                <div className="bg-white dark:bg-slate-800 p-8 rounded-[40px] border border-slate-100 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold">Mood Trends</h3>
                        <select className="bg-slate-50 dark:bg-slate-700 border-none rounded-xl text-sm px-4 py-2 font-medium">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                        </select>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis hide domain={[0, 5]} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="score"
                                    stroke="#0ea5e9"
                                    strokeWidth={4}
                                    dot={{ r: 6, fill: '#0ea5e9', strokeWidth: 3, stroke: '#fff' }}
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Sleep and Correlation */}
                <div className="bg-white dark:bg-slate-800 p-8 rounded-[40px] border border-slate-100 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold">Sleep Habits</h3>
                        <div className="flex items-center gap-2 text-primary-500 font-bold text-sm">
                            <Moon size={16} />
                            <span>Target: 8h</span>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="hours" radius={[10, 10, 0, 0]}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.hours >= 7 ? '#10b981' : '#f59e0b'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-[40px] border border-slate-100 dark:border-slate-700 shadow-sm">
                <h3 className="text-xl font-bold mb-6">Recent Check-ins</h3>
                <div className="space-y-4">
                    {recent_checkins.map(ci => (
                        <div key={ci.id} className="flex items-center gap-6 p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-2xl transition-all">
                            <div className="w-14 h-14 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center text-3xl shadow-sm">
                                {MOOD_EMOJIS[ci.mood] || '😐'}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <h4 className="font-bold text-lg">{ci.mood}</h4>
                                    <span className="text-slate-400 text-xs">{new Date(ci.date).toLocaleDateString()}</span>
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-1 italic">"{ci.description}"</p>
                                <div className="flex gap-2 mt-2">
                                    {ci.factors?.map(f => (
                                        <span key={f} className="px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-[10px] rounded-full font-bold uppercase tracking-widest">
                                            {f}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                    {recent_checkins.length === 0 && (
                        <div className="text-center py-10 text-slate-400">
                            No check-ins yet. Start by checking in today!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;