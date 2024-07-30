const config = {
    apiUrl: window.location.hostname.includes('localhost') ? 'http://localhost:5000/api' : 'https://bounty-hunter-mfbg.onrender.com/api'
};

export default config; // Use ES6 export for client-side
