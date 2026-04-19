import dotenv from 'dotenv';
// Load environment variables FIRST before any other imports
dotenv.config();
import express from 'express';
import cors from 'cors';
import storyRouter from './routes/story.route.js';
const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);
// Allow all origins
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.options('*', cors());
app.use(express.json());
// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', message: 'Bedtime Story API is running' });
});
// AI Service health check
app.get('/health/ai', async (_req, res) => {
    try {
        const { AIService } = await import('./services/ai.service.js');
        const aiService = new AIService();
        const health = await aiService.checkHealth();
        res.json(health);
    }
    catch (error) {
        res.status(500).json({ running: false, error: error.message });
    }
});
// Routes
app.use('/api/story', storyRouter);
// Error handling middleware
app.use((err, _req, res, _next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
//# sourceMappingURL=index.js.map