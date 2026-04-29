import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';

// Load environment variables from .env file
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ADMIN_CODE = process.env.ADMIN_CODE || 'TGAFM-ADMIN-2026';
const JWT_SECRET = process.env.JWT_SECRET || 'replace-this-jwt-secret-in-production';
const JOURNAL_DIR = path.join(__dirname, 'public', 'journals');
const DIST_DIR = path.join(__dirname, 'dist');
const PUBLIC_SITE_URL = (process.env.PUBLIC_SITE_URL || 'https://ajfm-tgafm.org').replace(/\/$/, '');
const hasCloudinaryConfig = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

const JOURNAL_SITEMAP_TABS = [
  'journal',
  'aims-scope',
  'editorial-board',
  'policy-editorial-process',
  'instr-editors',
  'instr-reviewers',
  'instr-authors',
  'policy-open-access',
  'policy-copyright',
  'policy-publication-ethics',
  'policy-author-charges',
  'publisher-info'
];

// Map tab names to clean URL paths (matching frontend PATH_TO_TAB)
const TAB_TO_PATH = {
  'journal': '/journal',
  'aims-scope': '/aims-scope',
  'editorial-board': '/editorial-board',
  'policy-editorial-process': '/editorial-process',
  'instr-editors': '/instr-editors',
  'instr-reviewers': '/instr-reviewers',
  'instr-authors': '/instr-authors',
  'policy-open-access': '/open-access',
  'policy-copyright': '/copyright',
  'policy-publication-ethics': '/publication-ethics',
  'policy-author-charges': '/author-charges',
  'publisher-info': '/publisher-info'
};

if (!fs.existsSync(JOURNAL_DIR)) {
  fs.mkdirSync(JOURNAL_DIR, { recursive: true });
}

const normalizeFileName = (name = '') =>
  name
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-zA-Z0-9\s-_]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 120)
    .toLowerCase();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const isPdf = file.mimetype === 'application/pdf' || path.extname(file.originalname).toLowerCase() === '.pdf';
    if (!isPdf) return cb(new Error('Only PDF uploads are allowed'));
    cb(null, true);
  }
});

const uploadPdfToCloudinary = (fileBuffer, baseName) =>
  new Promise((resolve, reject) => {
    const publicId = `${normalizeFileName(baseName)}-${Date.now()}`;
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'raw',
        folder: 'tgafm/journals',
        public_id: publicId,
        format: 'pdf',
        overwrite: true
      },
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );

    uploadStream.end(fileBuffer);
  });

// --- MIDDLEWARE ---
// CORS allows your React frontend (on port 5173) to talk to this server (on port 5001)
app.use(cors()); 
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const requireAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) return res.status(401).json({ error: 'Missing admin token' });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (!payload?.isAdmin) return res.status(403).json({ error: 'Invalid admin token' });
    req.admin = payload;
    next();
  } catch (_err) {
    res.status(401).json({ error: 'Invalid or expired admin token' });
  }
};

// --- MONGODB CONNECTION ---
// Using the connection string provided in your .env configuration
const mongoURI = process.env.MONGO_URI || "mongodb+srv://chatbpt_user:Devi503@cluster0.vfhtz.mongodb.net/tafm?retryWrites=true&w=majority";

mongoose.connect(mongoURI)
  .then(() => {
    console.log("✅ SUCCESS: Connected to TAFM MongoDB Atlas");
  })
  .catch(err => {
    console.error("❌ MongoDB Connection Error:", err.message);
  });

// --- ARTICLE SCHEMA ---
// This schema maps exactly to the data displayed in your App.jsx
const ArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  authors: { type: String, required: true },
  affiliations: { type: String, required: true },
  abstract: { type: String, required: true },
  keywords: { type: [String], default: [] },
  doi: { type: String, default: "" },
  publishedDate: { type: String, default: () => new Date().toLocaleDateString('en-GB') },
  articleType: { type: String, default: "Original Research" },
  pdfUrl: { type: String, default: "#" },
  license: { type: String, default: "CC-BY 4.0" }
});

const Article = mongoose.model('Article', ArticleSchema);

const escapeXml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

// --- API ROUTES ---

/**
 * @route   GET /sitemap.xml
 * @desc    Dynamic sitemap for homepage + journal tabs + article detail URLs
 */
app.get('/sitemap.xml', async (_req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const articles = await Article.find({}, { _id: 1 }).sort({ _id: -1 }).lean();

    const baseEntries = [
      {
        loc: `${PUBLIC_SITE_URL}/`,
        changefreq: 'daily',
        priority: '1.0'
      }
    ];

    const journalSectionEntries = JOURNAL_SITEMAP_TABS.map((tab) => ({
      loc: `${PUBLIC_SITE_URL}${TAB_TO_PATH[tab] || '/'}`,
      changefreq: 'weekly',
      priority: tab === 'journal' ? '0.9' : '0.7'
    }));

    const articleEntries = articles.map((article) => ({
      loc: `${PUBLIC_SITE_URL}/journal/article?id=${encodeURIComponent(String(article._id))}`,
      changefreq: 'weekly',
      priority: '0.8'
    }));

    const urls = [...baseEntries, ...journalSectionEntries, ...articleEntries]
      .map(
        (entry) => `  <url>\n    <loc>${escapeXml(entry.loc)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${entry.changefreq}</changefreq>\n    <priority>${entry.priority}</priority>\n  </url>`
      )
      .join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

    res.set('Content-Type', 'application/xml');
    res.send(xml);
  } catch (_err) {
    res.status(500).send('Failed to generate sitemap');
  }
});

/**
 * @route   POST /api/admin/login
 * @desc    Validate admin code and return a short-lived token
 */
app.post('/api/admin/login', (req, res) => {
  const { code } = req.body || {};

  if (!code || code !== ADMIN_CODE) {
    return res.status(401).json({ error: 'Invalid secretariat code' });
  }

  const token = jwt.sign({ isAdmin: true }, JWT_SECRET, { expiresIn: '12h' });
  res.json({ token });
});

/**
 * @route   GET /api/articles
 * @desc    Get all research articles for the Journal Archive
 */
app.get('/api/articles', async (req, res) => {
  try {
    const articles = await Article.find().sort({ _id: -1 }); // Newest first
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch articles from database" });
  }
});

/**
 * @route   POST /api/articles
 * @desc    Create a new article (Used by the Admin/Secretariat panel)
 */
app.post('/api/articles', requireAdmin, async (req, res) => {
  try {
    const newArticle = new Article(req.body);
    const savedArticle = await newArticle.save();
    res.status(201).json(savedArticle);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @route   POST /api/admin/upload-journal
 * @desc    Upload PDF + create journal entry (Admin only)
 */
app.post('/api/admin/upload-journal', requireAdmin, upload.single('journalPdf'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'PDF file is required' });

    const {
      title,
      authors,
      affiliations,
      abstract,
      keywords,
      doi,
      publishedDate,
      articleType,
      license
    } = req.body;

    if (!title || !authors || !affiliations || !abstract) {
      return res.status(400).json({ error: 'title, authors, affiliations and abstract are required' });
    }

    const keywordArray = Array.isArray(keywords)
      ? keywords
      : String(keywords || '')
          .split(',')
          .map((k) => k.trim())
          .filter(Boolean);

    let pdfUrl = '';

    if (hasCloudinaryConfig) {
      const uploadResult = await uploadPdfToCloudinary(req.file.buffer, title || req.file.originalname);
      pdfUrl = uploadResult?.secure_url || uploadResult?.url || '';
    }

    if (!pdfUrl) {
      const safeFileBase = normalizeFileName(title || req.file.originalname) || 'journal';
      const fileName = `${safeFileBase}-${Date.now()}.pdf`;
      const destinationPath = path.join(JOURNAL_DIR, fileName);
      await fs.promises.writeFile(destinationPath, req.file.buffer);
      pdfUrl = `/journals/${encodeURIComponent(fileName)}`;
    }

    const newArticle = new Article({
      title: title.trim(),
      authors: authors.trim(),
      affiliations: affiliations.trim(),
      abstract: abstract.trim(),
      keywords: keywordArray,
      doi: (doi || '').trim(),
      publishedDate: (publishedDate || '').trim() || new Date().toLocaleDateString('en-GB'),
      articleType: (articleType || '').trim() || 'Original Research',
      pdfUrl,
      license: (license || '').trim() || 'CC-BY 4.0'
    });

    const savedArticle = await newArticle.save();
    res.status(201).json(savedArticle);
  } catch (err) {
    res.status(400).json({ error: err.message || 'Upload failed' });
  }
});

/**
 * @route   DELETE /api/articles/:id
 * @desc    Remove an article by its ID
 */
app.delete('/api/articles/:id', requireAdmin, async (req, res) => {
  try {
    const deleted = await Article.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Article not found" });
    res.json({ message: "Article successfully removed from archive" });
  } catch (err) {
    res.status(500).json({ error: "Delete operation failed" });
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'tafm-api' });
});

if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(DIST_DIR, 'index.html'));
  });
}

// --- SERVER START ---
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 TAFM Backend is running on http://localhost:${PORT}`);
  console.log(`📡 Use http://localhost:${PORT}/api/articles to view raw JSON data`);
});