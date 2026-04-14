import React from 'react';
import { Smile, Meh, Frown, CloudRain, Zap, Moon, Sun, Layout, BookOpen, Calendar, Heart, MessageCircle, Briefcase, GraduationCap, Users, Coffee, Utensils, Dumbbell, Activity, HeartPulse } from 'lucide-react';
import { Mood } from './types';

export const LANGUAGES = ['English', 'Tamil', 'Hindi', 'Spanish', 'French', 'German'];

export const MOOD_EMOJIS = {
    [Mood.HAPPY]: <Smile size={24} color="#f59e0b" />,
    [Mood.CALM]: <Sun size={24} color="#1877F2" />,
    [Mood.STRESSED]: <Zap size={24} color="#f97316" />,
    [Mood.ANXIOUS]: <CloudRain size={24} color="#6366f1" />,
    [Mood.LONELY]: <Moon size={24} color="#94a3b8" />,
    [Mood.OVERWHELMED]: <Meh size={24} color="#a855f7" />,
    [Mood.SAD]: <Frown size={24} color="#3b82f6" />
};

export const MOCK_RESOURCES = [
    {
        id: '1',
        title: '5-Minute Mindfulness Meditation',
        description: 'A quick guide to bring your awareness back to the present moment.',
        type: 'video',
        category: 'Mindfulness',
        thumbnail: 'https://picsum.photos/seed/meditate1/400/225',
        tags: ['Meditation', 'Relaxation'],
        moodTags: [Mood.CALM, Mood.STRESSED, Mood.OVERWHELMED],
        url: 'https://www.youtube.com/watch?v=inpok4MKVLM'
    },
    {
        id: '2',
        title: 'Coping with Academic Pressure',
        description: 'Strategies for students to manage stress during exams and assignments.',
        type: 'article',
        category: 'Stress Management',
        thumbnail: 'https://picsum.photos/seed/study1/400/225',
        tags: ['Student Life', 'Stress'],
        moodTags: [Mood.STRESSED, Mood.OVERWHELMED],
    },
    {
        id: '3',
        title: 'The Power of Vulnerability',
        description: 'Brené Brown discusses how vulnerability is the key to connection.',
        type: 'video',
        category: 'Motivation',
        thumbnail: 'https://picsum.photos/seed/ted1/400/225',
        tags: ['Confidence', 'Emotion'],
        moodTags: [Mood.LONELY, Mood.SAD, Mood.ANXIOUS],
    },
    {
        id: '4',
        title: 'Weightless - Marconi Union',
        description: 'Statistically the most relaxing song ever recorded.',
        type: 'song',
        category: 'Relaxation Music',
        thumbnail: 'https://picsum.photos/seed/song1/400/225',
        tags: ['Ambient', 'Sleep'],
        moodTags: [Mood.ANXIOUS, Mood.CALM],
        language: 'English'
    },
    {
        id: '5',
        title: 'The Internal Sunshine',
        description: 'A feel-good story about finding joy in small things.',
        type: 'movie',
        category: 'Feel-good',
        thumbnail: 'https://picsum.photos/seed/movie1/400/225',
        tags: ['Inspiring', 'Happy'],
        moodTags: [Mood.HAPPY, Mood.SAD],
        language: 'Tamil'
    }
];

export const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: <Layout size={20} /> },
    { id: 'checkin', label: 'Check-in', icon: <Smile size={20} /> },
    { id: 'resources', label: 'Resources', icon: <BookOpen size={20} /> },
    { id: 'chatbot', label: 'Companion', icon: <MessageCircle size={20} /> },
    { id: 'calendar', label: 'Mood Log', icon: <Calendar size={20} /> },
    { id: 'favorites', label: 'Favorites', icon: <Heart size={20} /> },
];

export const FACTORS = [
    { id: 'work', label: 'Work', icon: <Briefcase size={20} /> },
    { id: 'school', label: 'School', icon: <GraduationCap size={20} /> },
    { id: 'family', label: 'Family', icon: <Heart size={20} /> },
    { id: 'social', label: 'Social', icon: <Users size={20} /> },
    { id: 'food', label: 'Food', icon: <Utensils size={20} /> },
    { id: 'exercise', label: 'Exercise', icon: <Dumbbell size={20} /> },
    { id: 'health', label: 'Health', icon: <HeartPulse size={20} /> },
    { id: 'caffeine', label: 'Caffeine', icon: <Coffee size={20} /> },
];

export const SLEEP_QUALITY_STAGES = [
    { id: 'poor', label: 'Poor', icon: <Frown size={24} /> },
    { id: 'okay', label: 'Okay', icon: <Meh size={24} /> },
    { id: 'very_good', label: 'Very Good', icon: <Smile size={24} /> },
];

export const AFFIRMATIONS = [
    "You are capable of handling whatever this day throws at you.",
    "Your mistakes don't define your value.",
    "It's okay to take a break and breathe.",
    "You are worthy of love, especially from yourself.",
    "Small progress is still progress.",
    "Your feelings are valid, even if they're difficult."
];
