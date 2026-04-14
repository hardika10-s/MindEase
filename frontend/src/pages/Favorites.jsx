import React, { useState, useEffect } from 'react';
import { Heart, Play, BookOpen, Music, Film, ExternalLink, Trash2, Loader2 } from 'lucide-react';

const Favorites = () => {
    const [favoriteResources, setFavoriteResources] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFavorites = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('/api/resources/favorites', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await res.json();
                if (data.success) {
                    const normalized = data.data.map(item => ({
                        ...item,
                        id: item.id || item._id
                    }));
                    setFavoriteResources(normalized);
                }
            } catch (err) {
                console.error("Failed to fetch favorites:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchFavorites();
    }, []);

    const onRemove = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/resources/favorites/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (data.success) {
                setFavoriteResources(prev => prev.filter(r => (r.id || r._id) !== id));
            }
        } catch (err) {
            console.error("Error removing favorite:", err);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="animate-spin text-primary-500" size={48} />
            </div>
        );
    }

    return (
        <div className="space-y-10">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Your Saved Peace</h2>
                    <p className="text-slate-500 dark:text-slate-400 font-bold">Content you've bookmarked for later.</p>
                </div>
                <div className="bg-red-50 dark:bg-red-950/20 px-4 py-2 rounded-2xl flex items-center gap-2 text-red-500 font-bold">
                    <Heart size={20} fill="currentColor" />
                    {favoriteResources.length} Items
                </div>
            </div>

            {favoriteResources.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {favoriteResources.map((resource, idx) => (
                        <div key={resource.id} className="group bg-white dark:bg-slate-900/50 rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-200 dark:border-slate-800 flex flex-col animate-fade-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                            <div className="relative h-48 overflow-hidden">
                                <div className="w-full h-full bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center relative">
                                    {/* Fallback Icon (Single Layer) */}
                                    <div className={`pointer-events-none ${resource.type === 'video' ? 'text-red-500/20' :
                                        resource.type === 'article' ? 'text-blue-500/20' :
                                            resource.type === 'song' ? 'text-indigo-500/20' :
                                                'text-amber-500/20'
                                        }`}>
                                        {resource.type === 'video' && <Play size={64} fill="currentColor" />}
                                        {resource.type === 'article' && <BookOpen size={64} />}
                                        {resource.type === 'song' && <Music size={64} />}
                                        {resource.type === 'movie' && <Film size={64} />}
                                    </div>
                                    <img
                                        src={resource.thumbnail}
                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 z-10"
                                        alt={resource.title}
                                        onError={(e) => e.target.style.display = 'none'}
                                    />
                                </div>

                                <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 shadow-sm z-20">
                                    {resource.type === 'video' && <Play size={10} fill="currentColor" />}
                                    {resource.type === 'article' && <BookOpen size={10} />}
                                    {resource.type === 'song' && <Music size={10} />}
                                    {resource.type === 'movie' && <Film size={10} />}
                                    {resource.category || resource.type}
                                </div>

                                <button
                                    onClick={() => onRemove(resource.id || resource._id)}
                                    className="absolute top-4 right-4 p-2 bg-white/90 dark:bg-slate-900/90 text-red-500 rounded-full backdrop-blur-md hover:bg-red-500 hover:text-white transition-all shadow-lg z-20"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <h4 className="text-xl font-bold mb-2 group-hover:text-indigo-600 transition-colors leading-tight">{resource.title}</h4>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 line-clamp-2 italic leading-relaxed">
                                    "{resource.description || resource.reason}"
                                </p>
                                <div className="mt-auto pt-6 border-t border-slate-50 dark:border-slate-700 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {resource.type === 'video' && <Play size={16} className="text-red-500" />}
                                        {resource.type === 'article' && <BookOpen size={16} className="text-blue-500" />}
                                        {resource.type === 'song' && <Music size={16} className="text-indigo-500" />}
                                        {resource.type === 'movie' && <Film size={16} className="text-amber-500" />}
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{resource.type}</span>
                                    </div>
                                    <a
                                        href={resource.url || "#"}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-2 text-indigo-600 font-bold text-sm hover:translate-x-1 transition-transform"
                                    >
                                        Explore
                                        <ExternalLink size={14} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-900/50 p-24 rounded-[48px] text-center border-2 border-dashed border-slate-200 dark:border-slate-800 animate-scale-in">
                    <div className="w-24 h-24 bg-primary-100/50 dark:bg-primary-900/20 text-primary-500 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-inner">
                        <Heart size={48} fill="currentColor" className="animate-pulse" />
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Nothing saved yet</h3>
                    <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto font-bold leading-relaxed">Browse the Resource portal and save articles, music, or videos that resonate with you.</p>
                </div>
            )}
        </div>
    );
};

export default Favorites;