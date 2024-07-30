const config = {
    apiUrl: window.location.hostname.includes('localhost') ? 'http://localhost:5000/api' : 'https://bounty-hunter-mfbg.onrender.com/api'
};

// For usage in non-module script
if (typeof module !== 'undefined') {
    module.exports = config;
}
