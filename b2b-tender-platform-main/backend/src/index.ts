import * as dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import multer from "multer";
import path from "path";
import fs from "fs";
import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.options("*", cors());

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const PORT = process.env.PORT || 5000;

const upload = multer({ storage: multer.memoryStorage() });

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
app.use("/uploads", express.static(uploadDir));

const allowedOrigins = [
  "https://b2b-tender-platform-vishaljturi.vercel.app/"
  "https://b2b-tender-platform-vishaljituri.onrender.com",
  "http://localhost:3000"
];

app.use(helmet());
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
app.use(express.json());

interface Company {
  id: number;
  name: string;
  industry: string;
  description: string;
  email: string;
  logo: string | null;
  products?: string[];
  services?: string[];
}
interface User {
  id: number;
  email: string;
  password: string;
  companyId: number;
}
interface Tender {
  id: number;
  title: string;
  description: string;
  deadline: string;
  budget: number;
  status: string;
  companyId: number;
}
interface Application {
  id: number;
  tenderId: number;
  companyId: number;
  proposalText: string;
  bidAmount: number;
}

const companies: Company[] = [
  { id: 1, name: "Tech Solutions Inc.", industry: "IT Services", description: "Full-service technology consulting firm", email: "contact@techsolutions.com", logo: null, products: ["Web App"], services: ["Consulting"] },
  { id: 2, name: "Digital Innovators", industry: "Software Development", description: "Specializing in custom SaaS applications", email: "hello@digitalinnovators.com", logo: null, products: ["SaaS Platform"], services: ["Development"] },
  { id: 3, name: "Cloud Experts Ltd.", industry: "Cloud Computing", description: "AWS and Azure cloud migration specialists", email: "info@cloudexperts.com", logo: null, products: ["Cloud Migration"], services: ["Cloud Consulting"] }
];
const users: User[] = [];
const tenders: Tender[] = [
  { id: 1, title: "Website Development", description: "Require a new company website with e-commerce functionality", budget: 15000, deadline: "2025-08-15", status: "open", companyId: 1 },
  { id: 2, title: "Cloud Migration", description: "Migrate existing infrastructure to AWS cloud platform", budget: 25000, deadline: "2025-09-01", status: "open", companyId: 2 },
  { id: 3, title: "Mobile App Development", description: "Build a cross-platform mobile application", budget: 18000, deadline: "2025-10-15", status: "open", companyId: 1 }
];
const applications: Application[] = [];

// --- JWT Middleware ---
function authenticateJWT(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });
  const token = authHeader.split(" ")[1];
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    req.user = decoded as any;
    next();
  });
}

// --- Profile Save Route (PUT /api/profile) ---
app.put("/api/profile", authenticateJWT, (req: Request, res: Response) => {
  try {
    const companyId = req.user?.companyId;
    if (!companyId) {
      return res.status(401).json({ error: "Not authenticated or company not linked." });
    }
    const allowedFields = ["name", "industry", "description", "logo", "email"];
    const updates: Record<string, unknown> = {};
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No valid fields provided for update." });
    }
    const company = companies.find(c => c.id === companyId);
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }
    Object.assign(company, updates);
    res.json(company);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: message });
  }
});

// --- Company CRUD ---
app.get("/api/companies", (_req, res) => res.json(companies));
app.get("/api/companies/:id", (req, res) => {
  const company = companies.find(c => c.id === +req.params.id);
  if (!company) return res.status(404).json({ error: "Company not found" });
  res.json(company);
});
app.post("/api/companies", authenticateJWT, (req: Request, res: Response) => {
  const { name, industry, description, email, logo } = req.body;
  const newCompany: Company = {
    id: companies.length + 1, name, industry, description, email, logo: logo || null
  };
  companies.push(newCompany);
  res.status(201).json(newCompany);
});
app.put("/api/companies/:id", authenticateJWT, (req: Request, res: Response) => {
  const company = companies.find(c => c.id === +req.params.id);
  if (!company) return res.status(404).json({ error: "Company not found" });
  const { name, industry, description, logo, logo_url } = req.body;
  if (name !== undefined) company.name = name;
  if (industry !== undefined) company.industry = industry;
  if (description !== undefined) company.description = description;
  if (logo_url !== undefined) company.logo = logo_url;
  else if (logo !== undefined) company.logo = logo;
  res.json(company);
});
app.delete("/api/companies/:id", authenticateJWT, (req: Request, res: Response) => {
  const idx = companies.findIndex(c => c.id === +req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Company not found" });
  companies.splice(idx, 1);
  res.json({ success: true });
});

// --- Company Logo Upload (Supabase Storage) ---
app.post("/api/upload/logo", authenticateJWT, upload.single("file"), async (req: Request, res: Response) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  const fileExt = req.file.originalname.split(".").pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
  const { error } = await supabase.storage
    .from("company-logos")
    .upload(fileName, req.file.buffer, {
      contentType: req.file.mimetype,
      upsert: false,
    });
  if (error) return res.status(500).json({ error: error.message });
  const { data: publicUrlData } = supabase.storage
    .from("company-logos")
    .getPublicUrl(fileName);
  res.json({ url: publicUrlData.publicUrl, filename: fileName });
});

// --- Tender CRUD + Pagination + Company-specific ---
app.get("/api/tenders", (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const start = (page - 1) * limit;
  const paginated = tenders.slice(start, start + limit);
  res.json({ tenders: paginated, total: tenders.length });
});
app.get("/api/tenders/:id", (req: Request, res: Response) => {
  const tender = tenders.find(t => t.id === +req.params.id);
  if (!tender) return res.status(404).json({ error: "Tender not found" });
  res.json(tender);
});
app.post("/api/tenders", authenticateJWT, (req: Request, res: Response) => {
  const { title, description, deadline, budget, companyId } = req.body;
  const newTender: Tender = {
    id: tenders.length + 1, title, description, deadline, budget, status: "open", companyId
  };
  tenders.push(newTender);
  res.status(201).json(newTender);
});
app.put("/api/tenders/:id", authenticateJWT, (req: Request, res: Response) => {
  const tender = tenders.find(t => t.id === +req.params.id);
  if (!tender) return res.status(404).json({ error: "Tender not found" });
  Object.assign(tender, req.body);
  res.json(tender);
});
app.delete("/api/tenders/:id", authenticateJWT, (req: Request, res: Response) => {
  const idx = tenders.findIndex(t => t.id === +req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Tender not found" });
  tenders.splice(idx, 1);
  res.json({ success: true });
});
app.get("/api/companies/:companyId/tenders", (req: Request, res: Response) => {
  const companyTenders = tenders.filter(t => t.companyId === +req.params.companyId);
  res.json(companyTenders);
});

// --- Application Workflow ---
app.post("/api/tenders/:tenderId/applications", authenticateJWT, (req: Request, res: Response) => {
  const { companyId, proposalText, bidAmount } = req.body;
  const newApp: Application = {
    id: applications.length + 1,
    tenderId: +req.params.tenderId,
    companyId,
    proposalText,
    bidAmount,
  };
  applications.push(newApp);
  res.status(201).json(newApp);
});
app.get("/api/tenders/:tenderId/applications", (req: Request, res: Response) => {
  const tenderApps = applications.filter(a => a.tenderId === +req.params.tenderId);
  res.json(tenderApps);
});

// --- Company Search ---
app.get("/api/search/companies", (req: Request, res: Response) => {
  const q = (req.query.q as string || "").toLowerCase();
  const results = companies.filter(
    c =>
      c.name.toLowerCase().includes(q) ||
      c.industry.toLowerCase().includes(q) ||
      (c.products && c.products.some((p: string) => p.toLowerCase().includes(q))) ||
      (c.services && c.services.some((s: string) => s.toLowerCase().includes(q)))
  );
  res.json(results);
});

// --- Authentication ---
app.post("/api/auth/register", (req: Request, res: Response) => {
  const { email, password, companyName } = req.body;
  if (!email || !password || !companyName) {
    return res.status(400).json({ error: "Email, password, and company name are required" });
  }
  const existingUser = users.find(u => u.email === email);
  if (existingUser) return res.status(400).json({ error: "User already exists" });
  const newCompany: Company = {
    id: companies.length + 1,
    name: companyName,
    industry: "General",
    description: `${companyName} company profile`,
    email,
    logo: null
  };
  companies.push(newCompany);
  const newUser: User = {
    id: users.length + 1,
    email,
    password,
    companyId: newCompany.id
  };
  users.push(newUser);
  const token = jwt.sign(
    { userId: newUser.id, companyId: newUser.companyId, email: newUser.email },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
  res.status(201).json({
    token,
    user: { id: newUser.id, email: newUser.email, company: newCompany }
  });
});
app.post("/api/auth/login", (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  const company = companies.find(c => c.id === user.companyId);
  const token = jwt.sign(
    { userId: user.id, companyId: user.companyId, email: user.email },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
  res.json({
    token,
    user: { id: user.id, email: user.email, company }
  });
});

// --- Misc ---
app.get("/", (_req, res) => res.send("B2B Tender Platform backend is running!"));
app.get("/health", (_req, res) => res.json({ status: "OK", timestamp: new Date().toISOString() }));

// --- Always return JSON for 404 and errors ---
app.use((_req, res) => res.status(404).json({ error: "Route not found" }));
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
