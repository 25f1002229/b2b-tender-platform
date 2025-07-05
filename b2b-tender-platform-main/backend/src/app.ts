import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes';

const app = express();

// List all allowed origins (add all Vercel preview/production domains as needed)
const allowedOrigins = [
  "https://b2b-tender-platform.vercel.app",
  "https://b2b-tender-platform-vishal-jituris-projects.vercel.app",
  "https://b2b-tender-platform-czptichiv-vishal-jituris-projects.vercel.app",
  "https://b2b-tender-platform-vishaljituri.onrender.com",
  "http://localhost:3000"
];

// CORS middleware: allow only whitelisted origins
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Handle preflight requests for all routes
app.options("*", cors());

app.use(helmet());
app.use(express.json());

app.use('/api', routes);

// Health check endpoint
app.get('/health', (_req, res) =>
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
);

// 404 handler (after all routes)
app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});
export default app;
