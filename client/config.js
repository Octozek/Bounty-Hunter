const config = {
    apiUrl: window.location.hostname.includes('127.0.0.1') || window.location.hostname.includes('localhost')
        ? 'http://localhost:5000/api'
        : 'https://bounty-hunter-mfbg.onrender.com/api'
};

// Attach config to the global window object
window.config = config;
