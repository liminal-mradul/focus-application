const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const app = express();

app.use(express.json());
app.use(express.static('public')); 

const genAI = new GoogleGenerativeAI(process.env.API_KEY || '<Replace With Yours>');
const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash-001',
    generationConfig: { maxOutputTokens: 200 }
});

app.post('/api/query', async (req, res) => {
    const { prompt } = req.body;
    const guidedPrompt = `You are a tutor who helps students learn by providing hints, asking guiding questions, or suggesting steps to solve problems without giving direct answers. For the query "${prompt}", respond with a concise hint, question, or step-by-step guidance to encourage critical thinking. Avoid providing complete solutions. Keep responses under 200 words.`;
    try {
        const result = await model.generateContent(guidedPrompt);
        const response = await result.response;
        res.json({ response: response.text() });
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ response: 'Sorry, I couldn’t process that. Try rephrasing your question!' });
    }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
