import React, { useState, useEffect } from 'react';
import { getDynamicRecommendations } from '../services/geminiService';
import { Heart, Play, BookOpen, Music, Film, ExternalLink, Sparkles, Loader2, RotateCw } from 'lucide-react';

const Resources = ({ checkIns }) => {
    const [filter, setFilter] = useState('all');
    const [aiTips, setAiTips] = useState([]);
    const [resourcesMap, setResourcesMap] = useState({
        all: [],
        article: [],
        video: [],
        movie: [],
        song: []
    });
    const [savedIds, setSavedIds] = useState([]);
    const [loadingMap, setLoadingMap] = useState({
        all: false,
        article: false,
        video: false,
        movie: false,
        song: false
    });
    const [lastFetchedMood, setLastFetchedMood] = useState(null);

    const latestMood = checkIns?.[0]?.mood || 'Calm';
    const latestFactors = React.useMemo(() => checkIns?.[0]?.factors || [], [checkIns]);

    // 1. Fetch AI Highlights for the top banner (3 items)
    useEffect(() => {
        const fetchTips = async () => {
            if (checkIns?.length > 0) {
                try {
                    const tips = await getDynamicRecommendations(latestMood, latestFactors, 'all', 3);
                    setAiTips(tips);
                } catch (err) {
                    console.error("Failed to fetch tips:", err);
                }
            }
        };

        if (latestMood !== lastFetchedMood || aiTips.length === 0) {
            fetchTips();
        }
    }, [latestMood, lastFetchedMood, aiTips.length, checkIns?.length, latestFactors]);

    const [refreshCategoryTrigger, setRefreshCategoryTrigger] = useState(0);

    // 2. Fetch content for the active filter
    useEffect(() => {
        const fetchContentForFilter = async () => {
            // Set loading just for this category
            setLoadingMap(prev => ({ ...prev, [filter]: true }));

            // Optional: Clear old results for this category to ensure the user sees "new" ones
            setResourcesMap(prev => ({ ...prev, [filter]: [] }));

            try {
                const token = localStorage.getItem('token');

                // Add a small artificial minimum delay (800ms) to ensure the loading effect 
                // is "smooth" and visible as requested by the user.
                const [results] = await Promise.all([
                    getDynamicRecommendations(latestMood, latestFactors, filter, 12),
                    new Promise(resolve => setTimeout(resolve, 800))
                ]);

                setResourcesMap(prev => ({ ...prev, [filter]: results }));

                // Fetch favorites once if not already fetched
                if (savedIds.length === 0) {
                    const favResponse = await fetch('/api/resources/favorites', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const favData = await favResponse.json();
                    if (favData.success) {
                        setSavedIds(favData.data.map(f => f.id || f._id));
                    }
                }

                setLastFetchedMood(latestMood);

            } catch (err) {
                console.error(`Failed to fetch resources for ${filter}:`, err);
            } finally {
                setLoadingMap(prev => ({ ...prev, [filter]: false }));
            }
        };

        // Fetch if mood changed or if we don't have data for this category yet
        // OR fetch every time if we want the "load every time" behavior the user mentioned
        // Given the request: "load every time when i click the categories", I will fetch every time.
        fetchContentForFilter();

    }, [latestMood, filter, refreshCategoryTrigger, latestFactors, savedIds.length]);

    const handleFilterClick = (newFilter) => {
        if (newFilter === filter) {
            // If already on this filter, force a refresh to show the loading state again
            setRefreshCategoryTrigger(prev => prev + 1);
        } else {
            setFilter(newFilter);
        }
    };

    const onSave = async (resource) => {
        const token = localStorage.getItem('token');
        const resourceId = resource._id || resource.id;
        const isSaved = savedIds.includes(resourceId);

        // 1. Optimistic UI Update: Toggle state immediately for instant feedback
        if (isSaved) {
            setSavedIds(prev => prev.filter(sid => sid !== resourceId));
        } else {
            setSavedIds(prev => [...prev, resourceId]);
        }

        try {
            if (isSaved) {
                const response = await fetch(`/api/resources/favorites/${resourceId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error("Delete failed");
            } else {
                const body = {
                    resource_id: resource._id ? resourceId : null,
                    resource_data: !resource._id ? { ...resource, mood: latestMood } : null
                };

                const response = await fetch('/api/resources/favorites', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(body)
                });
                const resData = await response.json();

                if (resData.success) {
                    const newDatabaseId = resData.data?.resource_id;
                    if (newDatabaseId && newDatabaseId !== resourceId) {
                        // Replace temp ID with real DB ID if needed
                        setSavedIds(prev => prev.map(sid => sid === resourceId ? newDatabaseId : sid));
                        if (!resource._id) resource._id = newDatabaseId;
                    }
                } else {
                    throw new Error("Save failed");
                }
            }
        } catch (err) {
            console.error("Error toggling favorite:", err);
            // 2. Revert state if the server call fails
            if (isSaved) {
                setSavedIds(prev => [...prev, resourceId]);
            } else {
                setSavedIds(prev => prev.filter(sid => sid !== resourceId));
            }
        }
    };

    const isLoading = loadingMap[filter];

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* AI Recommendation Header */}
            <div className="bg-gradient-to-br from-indigo-500 to-primary-600 rounded-[40px] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden transition-all hover:scale-[1.01] duration-500">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <Sparkles size={24} className="text-yellow-300 animate-pulse" />
                        <span className="uppercase tracking-widest font-bold text-sm text-indigo-100">AI Personal Recommendations</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">
                        Because you're feeling <span className="text-yellow-300 italic">{latestMood}</span> today...
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6">
                        {aiTips.length > 0 ? aiTips.map((tip, idx) => (
                            <a
                                key={idx}
                                href={tip.url || "#"}
                                target="_blank"
                                rel="noreferrer"
                                className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 hover:bg-white/20 transition-all cursor-pointer group flex flex-col h-full animate-in fade-in zoom-in-95 duration-500"
                                style={{ animationDelay: `${idx * 150}ms` }}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold uppercase">{tip.type}</span>
                                    <ExternalLink size={16} className="text-white/40 group-hover:text-yellow-300 transition-colors" />
                                </div>
                                <h4 className="text-xl font-bold mb-2 group-hover:text-yellow-300 transition-colors">{tip.title}</h4>
                                <p className="text-indigo-100 text-sm italic line-clamp-3 leading-relaxed">"{tip.reason}"</p>
                                <div className="mt-auto pt-4 flex items-center gap-2 text-xs font-bold text-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {tip.type === 'video' ? 'Watch Now' : tip.type === 'song' ? 'Listen Now' : 'Read More'}
                                    <ExternalLink size={12} />
                                </div>
                            </a>
                        )) : (
                            <div className="col-span-3 py-10 flex flex-col items-center justify-center space-y-4">
                                <Loader2 className="animate-spin text-white/50" size={32} />
                                <p className="text-indigo-100 font-medium animate-pulse">Curating your AI highlights...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* AI-Powered Discovery Grid */}
            <div className="px-4 md:px-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div className="flex items-center gap-4">
                        <div className="space-y-1">
                            <h3 className="text-2xl font-bold">Recommended for You</h3>
                            <p className="text-slate-400 text-xs">AI-driven discovery feed tailored to your vibe</p>
                        </div>
                    </div>
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                        {[
                            { id: 'all', label: 'All', icon: <Sparkles size={16} /> },
                            { id: 'article', label: 'Articles', icon: <BookOpen size={16} /> },
                            { id: 'video', label: 'Videos', icon: <Play size={16} fill="currentColor" /> },
                            { id: 'movie', label: 'Movies', icon: <Film size={16} /> },
                            { id: 'song', label: 'Music', icon: <Music size={16} /> },
                        ].map((type, idx) => (
                            <button
                                key={type.id}
                                onClick={() => handleFilterClick(type.id)}
                                disabled={isLoading}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold whitespace-nowrap transition-all duration-300 ${filter === type.id
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105'
                                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 hover:bg-slate-50'
                                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                style={{ transitionDelay: `${idx * 50}ms` }}
                            >
                                {type.id === filter && isLoading ? <Loader2 size={16} className="animate-spin" /> : type.icon}
                                {type.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="relative">
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="bg-slate-50 dark:bg-slate-800/50 rounded-[32px] h-[400px] animate-pulse flex flex-col p-6 border border-slate-100 dark:border-slate-800">
                                    <div className="h-48 bg-slate-200 dark:bg-slate-700 rounded-2xl mb-6"></div>
                                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-4"></div>
                                    <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-full mb-4"></div>
                                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-auto"></div>
                                    <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-xl w-1/3"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {(resourcesMap[filter] || []).map((resource, index) => (
                                <div
                                    key={resource.id || index}
                                    className="group bg-white dark:bg-slate-900/50 rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-200 dark:border-slate-800 flex flex-col animate-in fade-in zoom-in-95 duration-500"
                                    style={{ animationDelay: `${(index % 8) * 100}ms` }}
                                >
                                    <div className="relative h-48 overflow-hidden">
                                        <div className="w-full h-full bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center relative">
                                            {/* Fallback Icon */}
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
                                        <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 shadow-sm">
                                            {resource.type === 'video' && <Play size={10} fill="currentColor" />}
                                            {resource.type === 'article' && <BookOpen size={10} />}
                                            {resource.type === 'song' && <Music size={10} />}
                                            {resource.type === 'movie' && <Film size={10} />}
                                            {resource.category || resource.type}
                                        </div>
                                        <button
                                            onClick={() => onSave(resource)}
                                            className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-md transition-all ${savedIds.includes(resource._id || resource.id)
                                                ? 'bg-red-500 text-white'
                                                : 'bg-white/90 text-slate-400 hover:text-red-500'
                                                }`}
                                        >
                                            <Heart size={18} fill={savedIds.includes(resource._id || resource.id) ? "white" : "none"} />
                                        </button>
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex items-start justify-between mb-4">
                                            <span className="px-4 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs font-black rounded-full uppercase tracking-wider border border-primary-100 dark:border-primary-800/50">
                                                {resource.category}
                                            </span>
                                            <button
                                                onClick={() => onSave(resource)}
                                                className={`p-2 rounded-xl transition-all ${savedIds.includes(resource._id || resource.id)
                                                    ? 'text-rose-500 bg-rose-50 dark:bg-rose-900/20'
                                                    : 'text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                                                    }`}
                                            >
                                                <Heart size={20} fill={savedIds.includes(resource._id || resource.id) ? "currentColor" : "none"} />
                                            </button>
                                        </div>

                                        <h3 className="text-xl font-black text-slate-800 dark:text-white mb-3 leading-tight group-hover:text-primary-500 transition-colors">
                                            {resource.title}
                                        </h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-6 line-clamp-2">
                                            {resource.description || resource.reason}
                                        </p>

                                        <div className="mt-auto pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between font-black text-xs uppercase tracking-widest">
                                            <div className="flex items-center gap-2 text-slate-400">
                                                {resource.type === 'video' && <Play size={14} />}
                                                {resource.type === 'article' && <BookOpen size={14} />}
                                                {resource.type === 'song' && <Music size={14} />}
                                                {resource.type === 'movie' && <Film size={14} />}
                                                <span>{resource.type}</span>
                                            </div>
                                            <a
                                                href={resource.url || "#"}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-indigo-600 font-bold text-sm hover:translate-x-2 transition-transform"
                                            >
                                                Explore
                                                <ExternalLink size={14} />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {(resourcesMap[filter] || []).length === 0 && (
                                <div className="col-span-full py-20 text-center text-slate-400 font-medium">
                                    No discovery resources found for this filter.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Resources;

