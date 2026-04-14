export const getGeminiCompanionResponse = async (userName, history, latestMood) => {
    try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ userName, history, latestMood })
        });
        const data = await res.json();
        if (data.success) {
            return data.data?.response || data.data?.text || data.text;
        } else {
            console.error("Backend AI Error:", data.message);
            return `AI Error: ${data.message}`;
        }
    } catch (e) {
        console.error("Connection Error:", e);
        return "I am having trouble connecting right now, but I am still here for you.";
    }
};

export const getDynamicRecommendations = async (mood, factors, category = 'all', count = 3) => {
    try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/chat/recommendations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ mood, factors, category, count })
        });
        const data = await res.json();
        return data.data || [];
    } catch (e) {
        console.error("Error calling dynamic recommendations API:", e);
        return [];
    }
};

