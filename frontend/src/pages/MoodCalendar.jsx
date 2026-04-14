import React, { useState, useEffect } from 'react';
import { MOOD_EMOJIS } from '../utils/constants';
import { ChevronLeft, ChevronRight, Image as ImageIcon, Info, Loader2 } from 'lucide-react';

const MoodCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState(null);
    const [checkIns, setCheckIns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCalendarData = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('/api/checkins', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const json = await res.json();
                if (json.success) {
                    setCheckIns(json.data);
                }
            } catch (err) {
                console.error("Failed to fetch calendar data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCalendarData();
    }, []);

    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const numDays = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const changeMonth = (offset) => {
        setCurrentDate(new Date(year, month + offset, 1));
    };



    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="animate-spin text-primary-500" size={48} />
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 md:gap-8 animate-scale-in">
            <div className="lg:col-span-2 bg-white dark:bg-slate-900/50 rounded-[24px] md:rounded-[32px] p-5 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300 overflow-x-auto">
                <div className="flex items-center justify-between mb-6 md:mb-8 min-w-[300px]">
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">{monthNames[month]} {year}</h2>
                    <div className="flex gap-2">
                        <button onClick={() => changeMonth(-1)} className="p-2 md:p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"><ChevronLeft className="w-5 h-5 md:w-6 md:h-6" /></button>
                        <button onClick={() => changeMonth(1)} className="p-2 md:p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"><ChevronRight className="w-5 h-5 md:w-6 md:h-6" /></button>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-2 md:gap-3 min-w-[300px]">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                        <div key={d} className="text-center text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest pb-2 md:pb-4">{d}</div>
                    ))}
                    {Array.from({ length: startDay }).map((_, i) => (
                        <div key={`empty-${i}`} className="h-12 md:h-16" />
                    ))}
                    {Array.from({ length: numDays }).map((_, i) => {
                        const dayNum = i + 1;
                        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                        const ci = checkIns.find(c => (c.date && c.date.startsWith(dateStr)));
                        const isSelected = selectedDay && (selectedDay.date && selectedDay.date.startsWith(dateStr));
                        return (
                            <button
                                key={dayNum}
                                onClick={() => ci ? setSelectedDay(ci) : setSelectedDay(null)}
                                className={`h-12 md:h-16 rounded-xl md:rounded-2xl flex flex-col items-center justify-center gap-0.5 md:gap-1 transition-all animate-fade-in-up border-2 ${isSelected
                                    ? 'bg-primary-500 border-primary-500 text-white shadow-lg scale-105'
                                    : ci
                                        ? 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-primary-300 text-slate-800 dark:text-white'
                                        : 'bg-slate-50/50 dark:bg-slate-900/30 border-transparent text-slate-300'
                                    }`}
                            >
                                <span className="text-sm md:text-base font-black">{dayNum}</span>
                                {ci && <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${isSelected ? 'bg-white' : 'bg-primary-500'}`} />}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900/50 rounded-[24px] md:rounded-[40px] p-6 md:p-10 border border-slate-200 dark:border-slate-800 shadow-sm h-fit lg:sticky lg:top-8 transition-all duration-300">
                {selectedDay ? (
                    <div className="animate-in fade-in slide-in-from-bottom duration-500">
                        <div className="flex items-center justify-between mb-6 md:mb-8">
                            <h3 className="text-xl md:text-2xl font-bold">Day Review</h3>
                            <button onClick={() => setSelectedDay(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold transition-colors">Close</button>
                        </div>

                        <div className="flex items-center gap-4 md:gap-6 mb-6 md:mb-8">
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-primary-100 dark:bg-primary-900/30 rounded-2xl md:rounded-3xl flex items-center justify-center text-4xl md:text-5xl">
                                {MOOD_EMOJIS[selectedDay.mood] || '😐'}
                            </div>
                            <div>
                                <p className="text-slate-400 text-[10px] md:text-sm font-bold uppercase mb-0.5 md:mb-1">{new Date(selectedDay.date).toDateString()}</p>
                                <h4 className="text-xl md:text-2xl font-bold">{selectedDay.mood}</h4>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="p-4 md:p-6 bg-slate-50 dark:bg-slate-700 rounded-[20px] md:rounded-[32px] italic text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed shadow-inner">
                                "{selectedDay.description || "No thoughts recorded for this day."}"
                            </div>

                            <div className="grid grid-cols-2 gap-3 md:gap-4">
                                <div className="p-3 md:p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl md:rounded-2xl border border-indigo-100 dark:border-indigo-800/50">
                                    <p className="text-[10px] font-bold uppercase text-indigo-400 mb-1">Sleep</p>
                                    <p className="font-bold text-xs md:text-sm lg:text-base">{selectedDay.sleepHours}h • {selectedDay.sleepQuality}</p>
                                </div>
                                <div className="p-3 md:p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl md:rounded-2xl border border-amber-100 dark:border-amber-800/50">
                                    <p className="text-[10px] font-bold uppercase text-amber-500 mb-1">Energy</p>
                                    <p className="font-bold text-xs md:text-sm lg:text-base">{selectedDay.energyLevel}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-[10px] font-bold uppercase text-slate-400 mb-2 md:mb-3 tracking-widest">Factors</p>
                                <div className="flex flex-wrap gap-1.5 md:gap-2">
                                    {selectedDay.factors?.map(f => (
                                        <span key={f} className="px-2.5 py-0.5 md:px-3 md:py-1 bg-white dark:bg-slate-600 border border-slate-200 dark:border-slate-500 rounded-full text-[9px] md:text-[10px] font-bold shadow-sm">
                                            {f}
                                        </span>
                                    ))}
                                    {(!selectedDay.factors || selectedDay.factors.length === 0) && (
                                        <span className="text-slate-400 text-xs italic">No factors recorded</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 md:py-20 text-center opacity-50">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
                            <Info size={32} className="text-slate-300" />
                        </div>
                        <p className="text-sm md:text-base text-slate-400 italic">Select a marked date to see your mood journey for that day.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MoodCalendar;