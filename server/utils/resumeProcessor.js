const pdfParse = require('pdf-parse');

function cleanText(text) {
    // Add space between lowercase and uppercase letters
    text = text.replace(/([a-z])([A-Z])/g, '$1 $2');
    // Add space between letters and numbers
    text = text.replace(/([a-zA-Z])(\d)/g, '$1 $2');
    // Add space between numbers and letters
    text = text.replace(/(\d)([a-zA-Z])/g, '$1 $2');
    // Add space before capital followed by lowercase
    text = text.replace(/(\S)([A-Z][a-z])/g, '$1 $2');
    
    // Remove incorrect spaces within words that may have been caused by the above replacements
    text = text.replace(/\b([A-Z])\s+([a-z])\b/g, '$1$2');

    // Preserve line breaks and avoid collapsing them into a single line
    text = text.replace(/\s*\n\s*/g, '\n'); // Remove excessive spaces around line breaks

    // Ensure multiple spaces are reduced to a single space
    text = text.replace(/\s{2,}/g, ' ');

    return text.trim();
}

async function processResume(buffer) {
    try {
        const pdfData = await pdfParse(buffer);
        let resumeText = pdfData.text;

        // Apply text cleaning
        resumeText = cleanText(resumeText);

        return resumeText;
    } catch (error) {
        throw new Error('Error processing resume: ' + error.message);
    }
}

module.exports = {
    processResume
};
