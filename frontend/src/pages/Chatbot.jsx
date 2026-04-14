import React, { useState, useRef, useEffect } from 'react';
import { getGeminiCompanionResponse } from '../services/geminiService';
import { Send, Sparkles, User as UserIcon, Heart, Loader2 } from 'lucide-react';

const Chatbot = ({ user, latestMood }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        // Initial greeting
        const greet = async () => {
            setIsTyping(true);
            const greeting = `Hi ${user?.name || 'there'}! I'm MindEase, your digital companion. I heard you're feeling a bit ${latestMood || 'thoughtful'} today. How can I support you right now? 💙`;

            setTimeout(() => {
                setMessages([{
                    id: '1',
                    role: 'assistant',
                    text: greeting,
                    timestamp: new Date()
                }]);
                setIsTyping(false);
            }, 1000);
        };
        greet();
    }, [user?.name, latestMood]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isTyping) return;

        const userMsg = {
            id: Date.now().toString(),
            role: 'user',
            text: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            const response = await getGeminiCompanionResponse(user?.name || 'User', [...messages, userMsg], latestMood);
            const assistantMsg = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                text: response || "I'm here for you. Can you tell me more about that?",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, assistantMsg]);
        } catch (err) {
            console.error(err);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto h-[70vh] flex flex-col bg-white dark:bg-slate-900 rounded-[32px] shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-5 bg-gradient-to-r from-primary-500 to-indigo-600 text-white flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                        <Sparkles size={22} className="text-yellow-300" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black">MindEase Companion</h3>
                        <p className="text-indigo-100 text-xs font-bold italic opacity-80">Listening empathetically...</p>
                    </div>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-5 bg-slate-50/50 dark:bg-slate-950/20"
            >
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
                        <div className={`max-w-[85%] p-5 rounded-2xl flex gap-4 ${msg.role === 'user'
                            ? 'bg-primary-500 text-white rounded-tr-none'
                            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-100 dark:border-slate-700 shadow-sm'
                            }`}>
                            {msg.role === 'assistant' && <div className="mt-1 text-primary-500"><Sparkles size={18} /></div>}
                            <p className="text-base font-bold leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="max-w-[80%] flex gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-700 flex items-center justify-center shrink-0 shadow-sm">
                                <Loader2 size={20} className="animate-spin text-primary-500" />
                            </div>
                            <div className="p-5 bg-white dark:bg-slate-800 rounded-[28px] shadow-sm rounded-tl-none border border-slate-100 dark:border-slate-700">
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-100"></span>
                                    <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-200"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <form onSubmit={handleSend} className="p-6 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 flex gap-4 items-center">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Share your thoughts..."
                    className="flex-1 px-6 py-4 bg-slate-50 dark:bg-slate-700 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 focus:outline-none text-lg"
                />
                <button
                    disabled={!input.trim() || isTyping}
                    className="w-14 h-14 bg-primary-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary-200 hover:bg-primary-600 transition-all disabled:opacity-50"
                >
                    <Send size={24} />
                </button>
            </form>
        </div>
    );
};

export default Chatbot;