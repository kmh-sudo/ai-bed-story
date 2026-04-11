import dotenv from 'dotenv';

// Load environment variables FIRST before any other imports
dotenv.config();

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import storyRouter from './routes/story.route.js';

const app: Express = express();
const PORT = process.env.PORT || 3002;

// Allow all origins
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.options('*', cors());
app.use(express.json());

// Health check
app.get('/health', (_req: Request, res: Response): void => {
    res.json({ status: 'ok', message: 'Bedtime Story API is running' });
});

// AI Service health check
app.get('/health/ai', async (_req: Request, res: Response): Promise<void> => {
    try {
        const { AIService } = await import('./services/ai.service.js');
        const aiService = new AIService();
        const health = await aiService.checkHealth();
        res.json(health);
    } catch (error) {
        res.status(500).json({ running: false, error: (error as Error).message });
    }
});

// Routes
app.use('/api/story', storyRouter);

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction): void => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

app.listen(PORT,'0.0.0.0', () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
