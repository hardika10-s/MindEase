import React, { useState } from 'react';
import { MOOD_EMOJIS } from '../utils/constants';
import { Camera, ChevronRight, ChevronLeft, Send, Sparkles, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Mood = {
    HAPPY: 'Happy',
    CALM: 'Calm',
    STRESSED: 'Stressed',
    ANXIOUS: 'Anxious',
    LONELY: 'Lonely',
    OVERWHELMED: 'Overwhelmed',
    SAD: 'Sad'
};

const SleepQuality = {
    EXCELLENT: 'Excellent',
    OKAY: 'Okay',
    POOR: 'Poor'
};

const MoodCheckIn = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        mood: Mood.CALM,
        sleepQuality: SleepQuality.OKAY,
        sleepHours: 7,
        factors: [],
        energyLevel: 'Medium',
        description: '',
        date: new Date().toISOString()
    });

    const [error, setError] = useState(null);

    const factors = ['Studies / Work', 'Family', 'Relationships', 'Health', 'Finance', 'Unknown'];
    const energyLevels = [
        { label: 'High', emoji: '⚡' },
        { label: 'Medium', emoji: '🌤️' },
        { label: 'Low', emoji: '🌙' }
    ];

    const toggleFactor = (factor) => {
        setFormData(prev => {
            const existing = prev.factors || [];
            return {
                ...prev,
                factors: existing.includes(factor)
                    ? existing.filter(f => f !== factor)
                    : [...existing, factor]
            };
        });
    };

    const handleFinish = async () => {
        setIsSubmitting(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/checkins', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.success) {
                // Success: Redirect to dashboard
                navigate('/dashboard');
            }
        } catch {
            setError("Connection error. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-10">
            <div className="bg-white dark:bg-slate-800 rounded-[40px] shadow-xl overflow-hidden border border-slate-100 dark:border-slate-700">

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 flex">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div
                            key={i}
                            className={`flex-1 transition-all duration-500 ${step >= i ? 'bg-primary-500' : ''}`}
                        />
                    ))}
                </div>

                <div className="p-10 md:p-16">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-500 rounded-2xl font-bold text-center">
                            {error}
                        </div>
                    )}

                    {step === 1 && (
                        <div className="space-y-12 animate-scale-in">
                            <div className="text-center">
                                <span className="inline-block px-4 py-1.5 bg-primary-100/50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-xs font-black uppercase tracking-widest mb-6">Step 1 of 5</span>
                                <h2 className="text-5xl font-black mb-4 tracking-tight">How are you feeling today?</h2>
                                <p className="text-slate-400 dark:text-slate-500 font-bold">Your heart's weather matters to us.</p>
                            </div>

                            <div className="grid grid-cols-3 md:grid-cols-6 gap-8">
                                {Object.values(Mood).map((m, idx) => (
                                    <button
                                        key={m}
                                        onClick={() => setFormData(prev => ({ ...prev, mood: m }))}
                                        className={`flex flex-col items-center p-6 rounded-[32px] transition-all duration-500 hover-lift animate-fade-in-up stagger-${idx + 1} ${formData.mood === m
                                            ? 'bg-primary-500 text-white shadow-[0_20px_40px_-10px_rgba(59,130,246,0.4)] scale-110 z-10'
                                            : 'bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:text-primary-500'
                                            }`}
                                    >
                                        <span className="text-5xl mb-4 group-hover:scale-125 transition-transform">{MOOD_EMOJIS[m]}</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest">{m}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-10 animate-in fade-in slide-in-from-right duration-500">
                            <div className="text-center">
                                <span className="inline-block px-4 py-1 bg-primary-100 text-primary-600 rounded-full text-sm font-bold mb-4">Step 2 of 5</span>
                                <h2 className="text-4xl font-bold mb-4">How was your sleep?</h2>
                                <p className="text-slate-500">Sleep is a huge factor in mental well-being.</p>
                            </div>

                            <div className="space-y-8 max-w-md mx-auto">
                                <div className="flex gap-4">
                                    {Object.values(SleepQuality).map(sq => (
                                        <button
                                            key={sq}
                                            onClick={() => setFormData(prev => ({ ...prev, sleepQuality: sq }))}
                                            className={`flex-1 py-4 rounded-2xl font-bold transition-all ${formData.sleepQuality === sq
                                                ? 'bg-indigo-500 text-white shadow-lg'
                                                : 'bg-slate-100 dark:bg-slate-800'
                                                }`}
                                        >
                                            {sq}
                                        </button>
                                    ))}
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center px-2">
                                        <span className="font-bold">Sleep Duration</span>
                                        <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-bold">{formData.sleepHours} hrs</span>
                                    </div>
                                    <input
                                        type="range" min="0" max="12" step="0.5"
                                        value={formData.sleepHours}
                                        onChange={(e) => setFormData(prev => ({ ...prev, sleepHours: parseFloat(e.target.value) }))}
                                        className="w-full h-3 bg-slate-100 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-primary-500"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-10 animate-in fade-in slide-in-from-right duration-500">
                            <div className="text-center">
                                <span className="inline-block px-4 py-1 bg-primary-100 text-primary-600 rounded-full text-sm font-bold mb-4">Step 3 of 5</span>
                                <h2 className="text-4xl font-bold mb-4">What's on your mind?</h2>
                                <p className="text-slate-500">Select any factors affecting your mood today.</p>
                            </div>

                            <div className="flex flex-wrap justify-center gap-4">
                                {factors.map(f => (
                                    <button
                                        key={f}
                                        onClick={() => toggleFactor(f)}
                                        className={`px-6 py-3 rounded-full font-bold transition-all border-2 ${formData.factors?.includes(f)
                                            ? 'bg-primary-500 border-primary-500 text-white'
                                            : 'border-slate-200 dark:border-slate-700'
                                            }`}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-10 animate-in fade-in slide-in-from-right duration-500">
                            <div className="text-center">
                                <span className="inline-block px-4 py-1 bg-primary-100 text-primary-600 rounded-full text-sm font-bold mb-4">Step 4 of 5</span>
                                <h2 className="text-4xl font-bold mb-4">Energy Check</h2>
                                <p className="text-slate-500">How would you describe your energy level?</p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6 max-w-xl mx-auto">
                                {energyLevels.map(el => (
                                    <button
                                        key={el.label}
                                        onClick={() => setFormData(prev => ({ ...prev, energyLevel: el.label }))}
                                        className={`p-8 rounded-[32px] flex flex-col items-center gap-4 transition-all ${formData.energyLevel === el.label
                                            ? 'bg-slate-900 text-white shadow-2xl scale-105'
                                            : 'bg-slate-50 dark:bg-slate-700'
                                            }`}
                                    >
                                        <span className="text-5xl">{el.emoji}</span>
                                        <span className="font-bold text-lg">{el.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 5 && (
                        <div className="space-y-10 animate-in fade-in slide-in-from-right duration-500">
                            <div className="text-center">
                                <span className="inline-block px-4 py-1 bg-primary-100 text-primary-600 rounded-full text-sm font-bold mb-4">Last Step</span>
                                <h2 className="text-4xl font-bold mb-4">Add a memory?</h2>
                                <p className="text-slate-500">Write a note or add a photo/video for your calendar.</p>
                            </div>

                            <div className="space-y-6">
                                <textarea
                                    rows={4}
                                    className="w-full p-6 bg-slate-50 dark:bg-slate-700 border-none rounded-[32px] focus:ring-2 focus:ring-primary-500 focus:outline-none text-lg italic"
                                    placeholder="I felt really..."
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                />

                                <div className="flex gap-4">
                                    <div className="flex-1 p-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[32px] flex flex-col items-center justify-center gap-3 text-slate-400 hover:text-primary-500 hover:border-primary-500 transition-all cursor-pointer">
                                        <Camera size={40} />
                                        <span className="font-bold">Capture or Upload Media</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-16 flex justify-between items-center pt-8 border-t border-slate-100 dark:border-slate-700">
                        {step > 1 && (
                            <button
                                onClick={() => setStep(step - 1)}
                                className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-800"
                                disabled={isSubmitting}
                            >
                                <ChevronLeft size={20} />
                                Back
                            </button>
                        )}
                        <div className="flex-1" />
                        {step < 5 ? (
                            <button
                                onClick={() => setStep(step + 1)}
                                className="px-10 py-4 bg-primary-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-primary-200 hover:bg-primary-600 transition-all flex items-center gap-2"
                            >
                                Next
                                <ChevronRight size={20} />
                            </button>
                        ) : (
                            <button
                                onClick={handleFinish}
                                disabled={isSubmitting}
                                className="px-12 py-4 bg-green-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-green-200 hover:bg-green-600 transition-all flex items-center gap-2 disabled:opacity-50"
                            >
                                {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
                                Finish Check-in
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MoodCheckIn;