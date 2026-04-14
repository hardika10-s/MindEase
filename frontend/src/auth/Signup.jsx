import React, { useState } from 'react';
import { Heart, ArrowRight } from 'lucide-react';
import { LANGUAGES } from '../utils/constants';

const Signup = ({ onSwitch, onSignupSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        language: 'English'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (data.success) {
                localStorage.setItem('token', data.data.token);
                onSignupSuccess(data.data.user);
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (error) {
            console.error(error);
            setError("Signup failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in-up">
            <div className="text-center mb-10">
                <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center text-white shadow-lg mx-auto mb-6">
                    <Heart fill="white" size={32} />
                </div>
                <h2 className="text-3xl font-bold text-slate-800">Create Account</h2>
                <p className="text-slate-500 mt-2">Start your peaceful journey today</p>
            </div>

            <div className="h-16 flex items-center mb-6">
                {error && (
                    <div className="w-full p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl text-xs font-black border border-red-100 dark:border-red-900/30 italic text-center">
                        {error}
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Full Name</label>
                    <input
                        required
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-bold placeholder:text-slate-300 dark:placeholder:text-slate-600"
                        placeholder="How should we call you?"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                    <input
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-5 py-4 bg-slate-50 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium"
                        placeholder="name@example.com"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
                    <input
                        required
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-5 py-4 bg-slate-50 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium"
                        placeholder="••••••••"
                    />
                </div>

                <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Preferred Language</label>
                    <select
                        name="language"
                        value={formData.language}
                        onChange={handleChange}
                        className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-bold text-slate-800 dark:text-white"
                    >
                        {LANGUAGES.map(lang => <option key={lang} value={lang} className="bg-white dark:bg-slate-900">{lang}</option>)}
                    </select>
                </div>

                <div className="pt-4">
                    <button
                        disabled={loading}
                        className="w-full h-14 bg-primary-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-primary-200 hover:bg-primary-600 disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 overflow-hidden"
                    >
                        <span>{loading ? 'Creating Account...' : 'Sign Up'}</span>
                        {!loading && <ArrowRight size={20} />}
                    </button>
                </div>
            </form>

            <p className="text-center mt-8 text-slate-500">
                Already have an account?{" "}
                <button
                    onClick={onSwitch}
                    className="text-primary-600 font-bold hover:underline"
                >
                    Login
                </button>
            </p>
        </div>
    );
};

export default Signup;
