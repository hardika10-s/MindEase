import React, { useState } from 'react';
import { Heart, ArrowRight } from 'lucide-react';

const Login = ({ onSwitch, onLoginSuccess }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
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
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (data.success) {
                localStorage.setItem('token', data.data.token);
                onLoginSuccess(data.data.user);
            } else {
                setError(data.message || 'Invalid credentials');
            }
        } catch (error) {
            console.error(error);
            setError("Invalid credentials or server error");
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
                <h2 className="text-3xl font-bold text-slate-800">Welcome Back</h2>
                <p className="text-slate-500 mt-2">Continue your wellness journey</p>
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
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Email Address</label>
                    <input
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-bold placeholder:text-slate-300 dark:placeholder:text-slate-600"
                        placeholder="name@example.com"
                    />
                </div>

                <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Password</label>
                    <input
                        required
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-bold placeholder:text-slate-300 dark:placeholder:text-slate-600"
                        placeholder="••••••••"
                    />
                </div>

                <div className="pt-4">
                    <button
                        disabled={loading}
                        className="w-full h-14 bg-primary-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-primary-200 hover:bg-primary-600 disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 overflow-hidden"
                    >
                        <span className="relative z-10">{loading ? 'Logging in...' : 'Login'}</span>
                        {!loading && <ArrowRight size={20} className="relative z-10" />}
                    </button>
                </div>
            </form>

            <p className="text-center mt-8 text-slate-500">
                Don't have an account?{" "}
                <button
                    onClick={onSwitch}
                    className="text-primary-600 font-bold hover:underline"
                >
                    Sign Up
                </button>
            </p>
        </div>
    );
};

export default Login;
