/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    200: '#bae6fd',
                    300: '#7dd3fc',
                    400: '#38bdf8',
                    500: '#0ea5e9',
                },
                soft: {
                    pink: '#FFDEE9',
                    blue: '#B5FFFC',
                    lavender: '#E6E6FA',
                    mint: '#F0FFF0'
                }
            },
        },
    },
    plugins: [],
    darkMode: 'class',
}
