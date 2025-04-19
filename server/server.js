import './config/instrument.js';
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import * as Sentry from "@sentry/node";
import { clerkWebhooks } from './controllers/webhooks.js';
import companyRoutes from './routes/companyRoutes.js';
import connectCloudinary from './config/cloudinary.js';
import jobRoutes from './routes/jobRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { clerkMiddleware } from '@clerk/express';

// Initialize Express
const app = express();

// Connect to database and Cloudinary
connectDB();
await connectCloudinary();

// ✅ CORS Configuration (Allow localhost and production)
const allowedOrigins = [
  'http://localhost:5173',
  'https://mernjp-client.vercel.app' // 🔁 Replace with actual frontend deployment URL
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(clerkMiddleware());

// Routes
app.get('/', (req, res) => res.send("✅ API Working"));

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

app.post('/webhooks', clerkWebhooks);
app.use('/api/company', companyRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/users', userRoutes);

// Port
const PORT = process.env.PORT || 5000;

// Sentry error handler
Sentry.setupExpressErrorHandler(app);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
