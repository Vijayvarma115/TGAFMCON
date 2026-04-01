import React, { useState, useEffect, useCallback, useRef } from 'react';

import { 

  BookOpen, ShieldCheck, Search, Menu, X, ArrowRight, 

  Download, Award, Database, Mail, MapPin, Plus, Trash2, 

  Lock, CheckCircle, Info, FileText, Loader2, Wifi, WifiOff,

  AlertTriangle, RefreshCw, Users, ScrollText, Landmark, Target,

  Gavel, GraduationCap, Handshake, Scale, HeartPulse, HardHat, Calendar,

  Ticket, Microscope, Building2, QrCode, Share2, Film, BrainCircuit, 

  ExternalLink, ChevronDown, UserCheck, Bell, History, ChevronRight, FileDown,

  Megaphone, PenTool, Eye, Settings, ShieldAlert, Unlock

} from 'lucide-react';



// Backend Server Port: 5001

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const ADMIN_TOKEN_KEY = 'tgafmAdminToken';



// --- FORM LINKS ---

const MEMBERSHIP_FORM_LINK = "https://docs.google.com/forms/d/e/1FAIpQLScxmzkrzjct3TlcftIPLKBprg8VUxkhaenRXOzGQ5nRqng77A/viewform?usp=header";

const CONFERENCE_FORM_LINK = "https://docs.google.com/forms/d/e/1FAIpQLSfvefhMeMhYkJQWz22NZU11Ck0koWQh3aTRJKDXH2Mhmxvw0Q/viewform";



// --- STATIC DATA ---

const PRESENT_BODY = {

  term: "Dec, 2025 to Dec, 2027",

  leaders: [

    { role: "President", name: "Dr. B. Vasanth Nayak" },

    { role: "General Secretary", name: "Dr. G. Mahender" },

    { role: "Treasurer", name: "Dr. S. Suraj" },

  ],

  advisory: ["Dr. T. Krupal Singh", "Dr. B. V. Naga Mohan Rao", "Dr. Ch. Laxman Rao"],

  vicePresidents: ["Dr. Raza Malik Khan", "Dr. J. Kranthi Chaithanya"],

  jointSecretaries: ["Dr. K. Venkat Nagaraju", "Dr. K. Ramu", "Dr. Nagula Karthik"],

  academicChairman: "Dr. R Sridhara Chary",

  journalChairman: "Dr. M. Prashanth",

  executiveMembers: [

    "Dr. K. Krishna Murthy", "Dr. J. Shruthi", "Dr. G. Kishore Kumar", "Dr. Ambi Srinivas", 

    "Dr. M. Nirvisha", "Dr. Boda Crystal", "Dr. D. Chakrapani", "Dr. K. Ashok Kumar", 

    "Dr. M. Deenadayal", "Dr. More Vamshi Krishna", "Dr. Kommu Rahul", "Dr. Kemsaram Kiranmai", "Dr. Rudra Vijay"

  ]

};



const PAST_BODIES = [

  {

    term: "Dec, 2023 to Dec, 2025",

    president: "Dr. Abhijit Subhedar",

    details: {

      vicePresidents: ["Dr. Jhansi Lakshmi", "Dr. M. Prashanth"],

      generalSecretary: "Dr. Ch. Laxman Rao",

      treasurer: "Dr. S. Suraj",

      jointSecretaries: ["Dr. B. Lakshmi Prasanna", "Dr. B. Vasanth Nayak", "Dr. G. Mahender"],

      academicChairman: "Dr. R Sridhara Chary",

      journalChairman: "Dr. M. Prashanth",

      members: ["Dr. R. Sudha", "Dr. K. Ramu", "Dr. K. Rajesham", "Dr. Ch. Sandeep", "Dr. D. Sunil Kumar", "Dr. Abdul Rahman Omer Siddiqui", "Dr. K. Krishna Murthy", "Dr. G. Kishore Kumar", "Dr. J. Kranthi Chaitanya", "Dr. Nagula Karthik", "Dr. T. Nagendra Babu"]

    }

  },

  {

    term: "Dec, 2014 to Dec, 2023",

    president: "Dr. T. Krupal Singh",

    details: {

      vicePresidents: ["Dr. T.K.K Naidu", "Dr. K. Parvathi"],

      generalSecretary: "Dr. P. Vijaya Sagar",

      treasurer: "Dr. W. Sandhya Manohar",

      jointSecretaries: ["Dr. Durdana Begam", "Dr. Sravana Kumar", "Dr J Kranthi Chaitanya"],

      members: ["Dr. P. Vani Shree", "Dr. B. Shekar Rao", "Dr. T. Anurag", "Dr. S. Suraj", "Dr.Swapnika Enugala"],

      journalEditor: "Dr. T. Venkata Ramanaiah",

      seniorAdvisory: ["Dr. K. S. Narayan Reddy", "Dr. G. Surendar Reddy", "Dr. B. Raj Mohan Lal"]

    }

  }

];



const OBJECTIVES = [

  { icon: GraduationCap, title: "Promotion of Forensic Medicine", desc: "Encourage study and application in academic and professional domains." },

  { icon: Scale, title: "Enhancement of Medico-Legal Standards", desc: "Improve quality and reliability for fair administration of justice." },

  { icon: BookOpen, title: "Research and Publication", desc: "Support original research, case reports, and scholarly articles." },

  { icon: Award, title: "Educational Development", desc: "Workshops, seminars, CME programs and symposia." },

  { icon: Handshake, title: "Collaboration", desc: "Work with national bodies to establish uniform codes and SOPs." },

  { icon: Gavel, title: "Advisory Role", desc: "Expert advice to government bodies on forensic matters." },

  { icon: ShieldCheck, title: "Ethical Standards", desc: "Highest standards of professional ethics and integrity." },

  { icon: HeartPulse, title: "Risk Allowance Advocacy", desc: "Fair allowances for professionals engaged in autopsy work." },

  { icon: HardHat, title: "Qualified Mortuary Assistants", desc: "Promote trained roles to improve autopsy dignity and hygiene." }

];



const CME_ACTIVITIES = [

  { year: "2026", title: "TGAFMCON-2026: Standard Medicolegal Practices (Upcoming - Not Yet Completed)", host: "Kakatiya Medical College", place: "Warangal", date: "11th & 12th July" },

  { year: "2024", title: "Insights into the Criminal Intent", host: "KAMSRC", place: "Hyderabad", date: "27th January" },

  { year: "2023", title: "Contemporary Medico-Legal Issues", host: "Surabhi Institute", place: "Siddipet", date: "30th September" },

  { year: "2023", title: "Interface with Allied Specialties", host: "Apollo Medical College", place: "Hyderabad", date: "12th May" },

  { year: "2022", title: "Forensic Radiology", host: "AIIMS, Bibinagar", place: "Bibinagar", date: "18th July" },

  { year: "2021", title: "Modern Tools in Identification", host: "Kakatiya Medical College", place: "Warangal", date: "18th December" },

];



const App = () => {

  const [activeTab, setActiveTab] = useState('home');

  const [isAcademyOpen, setIsAcademyOpen] = useState(false);

  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);

  const [isPoliciesOpen, setIsPoliciesOpen] = useState(false);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [articles, setArticles] = useState([]);

  const [loading, setLoading] = useState(true);

  const [adminCode, setAdminCode] = useState('');

  const [adminToken, setAdminToken] = useState(() => localStorage.getItem(ADMIN_TOKEN_KEY) || '');

  const [adminAuthError, setAdminAuthError] = useState('');

  const [adminStatusMessage, setAdminStatusMessage] = useState('');

  const [isAdminLoading, setIsAdminLoading] = useState(false);

  const [isUploadingJournal, setIsUploadingJournal] = useState(false);

  const [journalFile, setJournalFile] = useState(null);
  const [selectedArticleId, setSelectedArticleId] = useState('');

  const [journalForm, setJournalForm] = useState({
    title: '',
    authors: '',
    affiliations: '',
    abstract: '',
    keywords: '',
    doi: '',
    publishedDate: '',
    articleType: 'Original Research',
    license: 'CC-BY 4.0'
  });

  const academyDropdownRef = useRef(null);

  const instructionsDropdownRef = useRef(null);

  const policiesDropdownRef = useRef(null);



  const fetchData = useCallback(async () => {

    setLoading(true);

    try {

      const res = await fetch(`${API_BASE_URL}/articles`);

      if (res.ok) setArticles(await res.json());

    } catch (err) {

      setArticles([{ _id: "demo", title: "Archive Offline", authors: "TGAFM System", abstract: "Connecting to database...", articleType: "Alert" }]);

    }

    setLoading(false);

  }, []);



  useEffect(() => { 

    fetchData(); 

    const handleClickOutside = (event) => {

      if (academyDropdownRef.current && !academyDropdownRef.current.contains(event.target)) setIsAcademyOpen(false);

      if (instructionsDropdownRef.current && !instructionsDropdownRef.current.contains(event.target)) setIsInstructionsOpen(false);

      if (policiesDropdownRef.current && !policiesDropdownRef.current.contains(event.target)) setIsPoliciesOpen(false);

    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);

  }, [fetchData]);

  useEffect(() => {
    const syncFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const articleId = params.get('article') || '';

      if (articleId) {
        setSelectedArticleId(articleId);
        setActiveTab('journal-article');
      }
    };

    syncFromUrl();
    window.addEventListener('popstate', syncFromUrl);

    return () => window.removeEventListener('popstate', syncFromUrl);
  }, []);

  const resetJournalForm = () => {
    setJournalForm({
      title: '',
      authors: '',
      affiliations: '',
      abstract: '',
      keywords: '',
      doi: '',
      publishedDate: '',
      articleType: 'Original Research',
      license: 'CC-BY 4.0'
    });
    setJournalFile(null);
  };

  const handleAdminLogin = async () => {
    setAdminAuthError('');
    setAdminStatusMessage('');

    if (!adminCode.trim()) {
      setAdminAuthError('Please enter the secretariat code.');
      return;
    }

    setIsAdminLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: adminCode.trim() })
      });

      const data = await res.json();
      if (!res.ok || !data?.token) {
        setAdminAuthError(data?.error || 'Authentication failed.');
        return;
      }

      setAdminToken(data.token);
      localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
      setAdminCode('');
      setAdminStatusMessage('Authentication successful. You can now upload journals.');
    } catch (_err) {
      setAdminAuthError('Server unavailable. Please try again.');
    } finally {
      setIsAdminLoading(false);
    }
  };

  const handleAdminLogout = () => {
    setAdminToken('');
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    setAdminStatusMessage('Logged out from secretariat session.');
  };

  const handleJournalUpload = async (e) => {
    e.preventDefault();
    setAdminStatusMessage('');

    if (!adminToken) {
      setAdminAuthError('Session expired. Please login again.');
      return;
    }

    if (!journalFile) {
      setAdminAuthError('Please choose a PDF file.');
      return;
    }

    if (!journalForm.title || !journalForm.authors || !journalForm.affiliations || !journalForm.abstract) {
      setAdminAuthError('Please fill title, authors, affiliations and abstract.');
      return;
    }

    setAdminAuthError('');
    setIsUploadingJournal(true);

    try {
      const formData = new FormData();
      formData.append('journalPdf', journalFile);
      Object.entries(journalForm).forEach(([key, value]) => formData.append(key, value));

      const res = await fetch(`${API_BASE_URL}/admin/upload-journal`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` },
        body: formData
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          handleAdminLogout();
        }
        setAdminAuthError(data?.error || 'Upload failed.');
        return;
      }

      setAdminStatusMessage(`Journal uploaded: ${data.title}`);
      resetJournalForm();
      fetchData();
    } catch (_err) {
      setAdminAuthError('Upload failed. Please check network and try again.');
    } finally {
      setIsUploadingJournal(false);
    }
  };

  const handleJournalInputChange = (field, value) => {
    setJournalForm((prev) => ({ ...prev, [field]: value }));
  };

  const resolvePdfUrl = (pdfUrl) => {
    if (!pdfUrl || pdfUrl === '#') return null;
    if (pdfUrl.startsWith('http://') || pdfUrl.startsWith('https://')) return pdfUrl;
    if (pdfUrl.startsWith('/')) return `${window.location.origin}${pdfUrl}`;
    return `${window.location.origin}/${pdfUrl}`;
  };

  const getDownloadName = (article) => {
    if (article?.pdfUrl) {
      const cleanPath = article.pdfUrl.split('?')[0];
      const fileName = cleanPath.substring(cleanPath.lastIndexOf('/') + 1);
      if (fileName && fileName.includes('.')) return decodeURIComponent(fileName);
    }
    return `${(article?.title || 'journal').replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.pdf`;
  };

  const openJournalArchive = () => {
    setActiveTab('journal');
    setSelectedArticleId('');

    const url = new URL(window.location.href);
    url.searchParams.delete('article');
    const query = url.searchParams.toString();
    window.history.pushState({}, '', `${url.pathname}${query ? `?${query}` : ''}`);
  };

  const openArticleDetails = (article) => {
    if (!article?._id) return;

    setSelectedArticleId(article._id);
    setActiveTab('journal-article');

    const url = new URL(window.location.href);
    url.searchParams.set('article', article._id);
    window.history.pushState({}, '', `${url.pathname}?${url.searchParams.toString()}`);
  };

  const selectedArticle = articles.find((art) => String(art._id) === String(selectedArticleId));



  const Navbar = () => (

    <nav className="bg-white border-b sticky top-0 z-50 shadow-sm font-sans text-slate-900">

      <div className="max-w-7xl mx-auto px-4 flex justify-between h-20 items-center">

        <div className="flex items-center gap-4 cursor-pointer" onClick={() => setActiveTab('home')}>

          <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center border p-1 shadow-sm overflow-hidden">

            <img src="/logo.png" alt="TGAFM" className="w-full h-full object-contain" onError={(e) => { e.target.src = 'https://via.placeholder.com/100?text=Logo'; }} />

          </div>

          <div>

            <h1 className="text-blue-900 font-black text-2xl leading-none uppercase tracking-tighter">TGAFM</h1>

            <p className="text-xs font-black text-red-600 tracking-wider leading-tight mt-1">Telangana Academy of <br className="lg:hidden" /> Forensic Medicine</p>

          </div>

        </div>

        

        <div className="hidden lg:flex space-x-1 items-center">
          <button onClick={() => setActiveTab('home')} className="px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all hover:text-blue-900 text-slate-600 bg-transparent border-none shadow-none">Home</button>

          <div className="group relative z-40">
            <button className="px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all hover:text-blue-900 text-slate-600 flex items-center gap-1 bg-transparent border-none shadow-none">
              About us <ChevronDown size={14} className="group-hover:rotate-180 transition-transform"/>
            </button>
            <div className="absolute top-full left-0 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl py-3 hidden group-hover:block transition-opacity opacity-100">
              <button onClick={() => setActiveTab('academy-about')} className="w-full text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-600 hover:bg-neutral-50 hover:text-blue-900 block border-none shadow-none bg-transparent">About TGAFM</button>
              <button onClick={() => setActiveTab('academy-present')} className="w-full text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-600 hover:bg-neutral-50 hover:text-blue-900 block border-none shadow-none bg-transparent">Present Executive Body</button>
              <div className="group/past relative w-full">
                <button className="w-full text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-600 hover:bg-neutral-50 hover:text-blue-900 flex items-center justify-between border-none shadow-none bg-transparent">
                  Past Executive Body <ChevronRight size={14} />
                </button>
                <div className="absolute top-0 left-full w-48 bg-white border border-slate-100 rounded-2xl shadow-xl py-3 hidden group-hover/past:block">
                  <button onClick={() => setActiveTab('academy-past-1')} className="w-full text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-600 hover:bg-neutral-50 hover:text-blue-900 block border-none shadow-none bg-transparent">2014 - 2024</button>
                  <button onClick={() => setActiveTab('academy-past-2')} className="w-full text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-600 hover:bg-neutral-50 hover:text-blue-900 block border-none shadow-none bg-transparent">2024 - 2026</button>
                </div>
              </div>
            </div>
          </div>

          <div className="group relative z-40">
            <button className="px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all hover:text-blue-900 text-slate-600 flex items-center gap-1 bg-transparent border-none shadow-none">
              Journal <ChevronDown size={14} className="group-hover:rotate-180 transition-transform"/>
            </button>
            <div className="absolute top-full left-0 w-64 bg-white border border-slate-100 rounded-2xl shadow-xl py-3 hidden group-hover:block transition-opacity opacity-100">
              <button onClick={() => setActiveTab('aims-scope')} className="w-full text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-600 hover:bg-neutral-50 hover:text-blue-900 block border-none shadow-none bg-transparent">Aims & Scope</button>
              <button onClick={() => setActiveTab('editorial-board')} className="w-full text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-600 hover:bg-neutral-50 hover:text-blue-900 block border-none shadow-none bg-transparent">Editorial Board</button>
              <button onClick={() => setActiveTab('policy-editorial-process')} className="w-full text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-600 hover:bg-neutral-50 hover:text-blue-900 block border-none shadow-none bg-transparent">Editorial Process & Peer Review</button>
              <div className="group/instr relative w-full">
                <button className="w-full text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-600 hover:bg-neutral-50 hover:text-blue-900 flex items-center justify-between border-none shadow-none bg-transparent">
                  Instructions <ChevronRight size={14} />
                </button>
                <div className="absolute top-0 left-full w-48 bg-white border border-slate-100 rounded-2xl shadow-xl py-3 hidden group-hover/instr:block">
                  <button onClick={() => setActiveTab('instr-editors')} className="w-full text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-600 hover:bg-neutral-50 hover:text-blue-900 block border-none shadow-none bg-transparent">Editors</button>
                  <button onClick={() => setActiveTab('instr-reviewers')} className="w-full text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-600 hover:bg-neutral-50 hover:text-blue-900 block border-none shadow-none bg-transparent">Reviewers</button>
                  <button onClick={() => setActiveTab('instr-authors')} className="w-full text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-600 hover:bg-neutral-50 hover:text-blue-900 block border-none shadow-none bg-transparent">Authors</button>
                </div>
              </div>
              <div className="group/pub relative w-full">
                <button className="w-full text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-600 hover:bg-neutral-50 hover:text-blue-900 flex items-center justify-between border-none shadow-none bg-transparent">
                  Publications <ChevronRight size={14} />
                </button>
                <div className="absolute top-0 left-full w-48 bg-white border border-slate-100 rounded-2xl shadow-xl py-3 hidden group-hover/pub:block">
                  <button onClick={() => setActiveTab('journal')} className="w-full text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-600 hover:bg-neutral-50 hover:text-blue-900 block border-none shadow-none bg-transparent">2025</button>
                  <button onClick={() => setActiveTab('journal')} className="w-full text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-600 hover:bg-neutral-50 hover:text-blue-900 block border-none shadow-none bg-transparent">2026</button>
                </div>
              </div>
              <div className="group/pol relative w-full">
                <button className="w-full text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-600 hover:bg-neutral-50 hover:text-blue-900 flex items-center justify-between border-none shadow-none bg-transparent">
                  Policies <ChevronRight size={14} />
                </button>
                <div className="absolute top-0 left-full w-64 bg-white border border-slate-100 rounded-2xl shadow-xl py-3 hidden group-hover/pol:block">
                  <button onClick={() => setActiveTab('policy-open-access')} className="w-full text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-600 hover:bg-neutral-50 hover:text-blue-900 block border-none shadow-none bg-transparent">Open Access</button>
                  <div className="group/copy relative w-full">
                    <button onClick={() => setActiveTab('policy-copyright')} className="w-full text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-600 hover:bg-neutral-50 hover:text-blue-900 flex items-center justify-between border-none shadow-none bg-transparent">
                      Copyright Policy <ChevronRight size={14} />
                    </button>
                    <div className="absolute top-0 left-full w-56 bg-white border border-slate-100 rounded-2xl shadow-xl py-3 hidden group-hover/copy:block">
                      <button onClick={() => setActiveTab('policy-publication-ethics')} className="w-full text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-600 hover:bg-neutral-50 hover:text-blue-900 block border-none shadow-none bg-transparent">Publication Ethics</button>
                    </div>
                  </div>
                  <button onClick={() => setActiveTab('policy-author-charges')} className="w-full text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-600 hover:bg-neutral-50 hover:text-blue-900 block border-none shadow-none bg-transparent">Publication Charges</button>
                  <button onClick={() => setActiveTab('publisher-info')} className="w-full text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-600 hover:bg-neutral-50 hover:text-blue-900 block border-none shadow-none bg-transparent">Publisher Information</button>
                </div>
              </div>
            </div>
          </div>

          <div className="group relative z-40">
            <button className="px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all hover:text-blue-900 text-slate-600 flex items-center gap-1 bg-transparent border-none shadow-none">
              Members <ChevronDown size={14} className="group-hover:rotate-180 transition-transform"/>
            </button>
            <div className="absolute top-full left-0 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl py-3 hidden group-hover:block transition-opacity opacity-100">
              <button onClick={() => setActiveTab('academy-members')} className="w-full text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-600 hover:bg-neutral-50 hover:text-blue-900 block border-none shadow-none bg-transparent">List of Members</button>
              <button onClick={() => setActiveTab('academy-registration')} className="w-full text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-600 hover:bg-neutral-50 hover:text-blue-900 block border-none shadow-none bg-transparent">Form</button>
            </div>
          </div>

          <div className="group relative z-40">
            <button className="px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all hover:text-blue-900 text-slate-600 flex items-center gap-1 bg-transparent border-none shadow-none">
              Conferences <ChevronDown size={14} className="group-hover:rotate-180 transition-transform"/>
            </button>
            <div className="absolute top-full left-0 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl py-3 hidden group-hover:block transition-opacity opacity-100">
              <div className="group/conf25 relative w-full">
                <button className="w-full text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-600 hover:bg-neutral-50 hover:text-blue-900 flex items-center justify-between border-none shadow-none bg-transparent">
                  2025 <ChevronRight size={14} />
                </button>
                <div className="absolute top-0 left-full w-48 bg-white border border-slate-100 rounded-2xl shadow-xl py-3 hidden group-hover/conf25:block">
                  <button onClick={() => setActiveTab('conference')} className="w-full text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-600 hover:bg-neutral-50 hover:text-blue-900 block border-none shadow-none bg-transparent">About</button>
                  <button onClick={() => setActiveTab('conference')} className="w-full text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-600 hover:bg-neutral-50 hover:text-blue-900 block border-none shadow-none bg-transparent">Glimpses</button>
                </div>
              </div>
              <button onClick={() => setActiveTab('conference')} className="w-full text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-600 hover:bg-neutral-50 hover:text-blue-900 block border-none shadow-none bg-transparent">2026</button>
              <button onClick={() => setActiveTab('conference')} className="w-full text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-600 hover:bg-neutral-50 hover:text-blue-900 block border-none shadow-none bg-transparent">Upcoming</button>
            </div>
          </div>

          <button onClick={() => setActiveTab('academic-activities')} className="px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all hover:text-blue-900 text-slate-600 bg-transparent border-none shadow-none">Pg Corner / Academic Activities</button>

          <button onClick={() => setActiveTab('academy-notices')} className="px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all hover:text-blue-900 text-slate-600 bg-transparent border-none shadow-none">Announcements</button>

          <button onClick={() => setActiveTab('sitemap')} className="px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all hover:text-blue-900 text-slate-600 bg-transparent border-none shadow-none">Site Map</button>

          <div className="h-6 w-[1px] bg-slate-200 mx-3"></div>
          <button onClick={() => setActiveTab('admin')} className="ml-4 bg-blue-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition flex items-center gap-2 shadow-lg">
            <Plus size={14}/> Admin
          </button>
        </div>
        <button className="lg:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}> {isMenuOpen ? <X /> : <Menu />} </button>

      </div>

    </nav>

  );



  return (

    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100">

      <Navbar />

      

      <main className="max-w-7xl mx-auto px-4 py-12">

        {/* HOME */}

        {activeTab === 'home' && (

          <div className="py-12 md:py-20 text-center animate-in fade-in duration-1000 flex flex-col items-center">  

            {/* Official Logo */}
            <div className="w-40 h-40 md:w-56 md:h-56 mb-8 flex items-center justify-center">
              <img src="/logo.png" alt="TGAFM Logo" className="w-full h-full object-contain drop-shadow-xl" onError={(e) => { e.target.src = 'https://via.placeholder.com/200?text=Logo'; }} />
            </div>

            {/* Main Organization Title */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-blue-900 mb-4 uppercase tracking-tighter leading-tight max-w-4xl">
              Telangana Academy of <br className="hidden md:block" /> Forensic Medicine
            </h2>

            {/* Subtitle / Abbreviation */}
            <h3 className="text-2xl md:text-3xl font-bold text-red-600 tracking-[0.2em] uppercase mb-8">
              TGAFM
            </h3>

            {/* Description */}
            <p className="text-slate-600 font-medium mb-12 max-w-2xl mx-auto text-lg leading-relaxed">
              The official digital secretariat, scholarly repository, and professional body representing forensic medicine experts across Telangana.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-5 w-full sm:w-auto px-4">

              <button onClick={openJournalArchive} className="bg-red-600 text-white px-10 py-4 w-full sm:w-auto rounded-2xl font-black uppercase text-[10px] sm:text-xs tracking-widest shadow-xl hover:bg-red-700 transition">Browse Journal</button>

              <button onClick={() => setActiveTab('academy-registration')} className="bg-white border-2 border-slate-200 text-slate-800 px-10 py-4 w-full sm:w-auto rounded-2xl font-black uppercase text-[10px] sm:text-xs tracking-widest hover:bg-slate-50 transition shadow-sm">Join TGAFM</button>

            </div>

          </div>

        )}



        {/* INSTRUCTIONS - FOR AUTHORS (Detailed Version) */}

        {activeTab === 'instr-authors' && (

          <div className="max-w-5xl mx-auto py-10 animate-in fade-in space-y-12">

            <div className="text-center mb-16">

              <span className="text-red-600 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Author Guidelines</span>

              <h2 className="text-5xl font-black text-blue-900 tracking-tighter uppercase leading-none">Instructions to Authors</h2>

            </div>



            <div className="bg-white p-12 rounded-[3rem] border shadow-sm space-y-10 leading-relaxed text-slate-600 font-medium text-justify">

              <section>

                <h3 className="text-2xl font-black text-blue-900 uppercase mb-4 border-b-2 border-red-600 inline-block pb-1">Manuscript Guidelines</h3>

                <p className="mb-4">Authors are encouraged to follow the <strong>ICMJE Recommendations</strong> for the Conduct, Reporting, Editing, and Publication of Scholarly Work in Medical Journals. Accepted manuscript types include <strong>Original Research Articles, Review Articles, Case Reports, Short Communications,</strong> and <strong>Letters to the Editor</strong>.</p>

              </section>



              <section>

                <h3 className="text-2xl font-black text-blue-900 uppercase mb-6 border-b-2 border-red-600 inline-block pb-1">Formatting Requirements</h3>

                <div className="grid md:grid-cols-2 gap-6">

                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">

                    <h4 className="font-black text-blue-900 uppercase mb-3 text-sm">File Format</h4>

                    <p className="text-sm">Microsoft Word (.doc/.docx)</p>

                  </div>

                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">

                    <h4 className="font-black text-blue-900 uppercase mb-3 text-sm">Typography</h4>

                    <p className="text-sm">Times New Roman, 12-point font, double-spaced, with 1-inch margins</p>

                  </div>

                </div>

                <div className="mt-6 bg-blue-50 p-6 rounded-2xl border border-blue-100">

                  <h4 className="font-black text-blue-900 uppercase mb-3 text-sm">Structure</h4>

                  <p className="text-sm">Manuscripts must include a title page, abstract (maximum 250 words), keywords, introduction, materials and methods, results, discussion, conclusions, acknowledgments, references (Vancouver style), tables, and figures where applicable.</p>

                </div>

                <div className="mt-6 bg-red-50 p-6 rounded-2xl border border-red-100">

                  <h4 className="font-black text-blue-900 uppercase mb-3 text-sm flex items-center gap-2"><ShieldCheck size={18} className="text-red-600"/> Ethical Approval</h4>

                  <p className="text-sm">For studies involving human or animal subjects, a statement of ethical approval from an appropriate institutional ethics committee is required.</p>

                </div>

              </section>



              <section className="bg-blue-50 p-10 rounded-[2.5rem] border border-blue-100">

                <h3 className="text-xl font-black text-blue-900 uppercase mb-6">Submission Process</h3>

                <p className="mb-4">Manuscripts should be submitted electronically to the editorial office via email at <strong className="text-blue-600">tgafm.journal@gmail.com</strong>.</p>

                <p className="text-sm">Submissions must include a cover letter, declaration of conflicts of interest, author contribution statement, and a signed copyright agreement.</p>

              </section>



              <section className="bg-green-50 p-10 rounded-[2.5rem] border border-green-100">

                <h3 className="text-xl font-black text-blue-900 uppercase mb-6 flex items-center gap-3"><CheckCircle size={24} className="text-green-600"/> Author Charges</h3>

                <p className="mb-4 text-slate-700 font-bold">The Academy Journal of Forensic Medicine does not levy any fees on authors.</p>

                <div className="grid md:grid-cols-2 gap-4">

                  <div className="flex items-center gap-2 text-sm">

                    <CheckCircle size={16} className="text-green-600 shrink-0"/>

                    <span><strong>Submission Fees:</strong> None</span>

                  </div>

                  <div className="flex items-center gap-2 text-sm">

                    <CheckCircle size={16} className="text-green-600 shrink-0"/>

                    <span><strong>Publication Charges (APCs):</strong> None</span>

                  </div>

                  <div className="flex items-center gap-2 text-sm">

                    <CheckCircle size={16} className="text-green-600 shrink-0"/>

                    <span><strong>Page Charges:</strong> None</span>

                  </div>

                  <div className="flex items-center gap-2 text-sm">

                    <CheckCircle size={16} className="text-green-600 shrink-0"/>

                    <span><strong>Colour Print Charges:</strong> None</span>

                  </div>

                </div>

              </section>

            </div>

          </div>

        )}



        {/* INSTRUCTIONS - FOR REVIEWERS */}

        {activeTab === 'instr-reviewers' && (

          <div className="max-w-5xl mx-auto py-10 animate-in fade-in">

            <div className="text-center mb-16">

              <span className="text-red-600 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Reviewer Guidelines</span>

              <h2 className="text-5xl font-black text-blue-900 tracking-tighter uppercase leading-none">Instructions to Reviewers</h2>

              <p className="text-slate-500 mt-4 max-w-2xl mx-auto">

                Thank you for contributing your expertise to the Academy Journal of Forensic Medicine (AJFM). As a reviewer, you play a vital role in maintaining the academic integrity and quality of the research we publish.

              </p>

            </div>



            <div className="bg-white p-12 rounded-[3rem] border shadow-sm space-y-10 leading-relaxed text-slate-600 font-medium">

              <section className="bg-blue-50 p-10 rounded-[2.5rem] border border-blue-100">

                <h3 className="text-2xl font-black text-blue-900 uppercase mb-6">1. Peer Review Model</h3>

                <p className="mb-4 text-slate-700">AJFM operates a <strong>double-blind peer review process</strong>.</p>

                <div className="space-y-4">

                  <div className="bg-white p-5 rounded-2xl border border-blue-100">

                    <h4 className="font-black text-sm text-blue-900 mb-2">Anonymity</h4>

                    <p className="text-sm">The identity of the authors is concealed from the reviewers, and the identity of the reviewers is concealed from the authors. Please ensure that your comments to the author do not accidentally reveal your identity.</p>

                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-blue-100">

                    <h4 className="font-black text-sm text-blue-900 mb-2">Evaluation Team</h4>

                    <p className="text-sm">Each manuscript is evaluated by at least two subject experts to ensure a balanced perspective.</p>

                  </div>

                </div>

              </section>



              <section>

                <h3 className="text-2xl font-black text-blue-900 uppercase mb-6 border-b-2 border-red-600 inline-block pb-2">2. Reviewer Responsibilities & Ethics</h3>

                <p className="mb-6">We adhere to the ethical guidelines of the <strong>Committee on Publication Ethics (COPE)</strong>. Reviewers are expected to:</p>

                <div className="grid md:grid-cols-3 gap-6">

                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">

                    <Lock size={24} className="text-blue-600 mb-3"/>

                    <h4 className="font-black text-sm text-slate-900 mb-2">Confidentiality</h4>

                    <p className="text-sm">Treat the manuscript and the review process as strictly confidential. Do not share or discuss the manuscript with colleagues without permission.</p>

                  </div>

                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">

                    <AlertTriangle size={24} className="text-red-600 mb-3"/>

                    <h4 className="font-black text-sm text-slate-900 mb-2">Conflict of Interest</h4>

                    <p className="text-sm">Declare any potential conflicts of interest (financial, institutional, or personal) that might interfere with an objective review.</p>

                  </div>

                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">

                    <Scale size={24} className="text-green-600 mb-3"/>

                    <h4 className="font-black text-sm text-slate-900 mb-2">Objectivity</h4>

                    <p className="text-sm">Provide constructive, unbiased feedback supported by arguments and evidence. Avoid personal criticism.</p>

                  </div>

                </div>

              </section>



              <section>

                <h3 className="text-2xl font-black text-blue-900 uppercase mb-6 border-b-2 border-red-600 inline-block pb-2">3. Criteria for Evaluation</h3>

                <p className="mb-6">Please assess the manuscript based on the following key areas:</p>

                <div className="space-y-4">

                  {[

                    { title: 'Scope & Relevance', desc: 'Does the article align with the journal\'s focus on Forensic Medicine, Legal Medicine, Toxicology, Anthropology, or related bio-ethical fields?' },

                    { title: 'Originality', desc: 'Is the research novel? The journal prioritizes novel research articles and original contributions.' },

                    { title: 'Methodology', desc: 'Are the methods clear, scientifically sound, and reproducible?' },

                    { title: 'Ethical Compliance', desc: 'For studies involving human or animal subjects, verify that the authors have provided a statement of ethical approval from an appropriate institutional committee.' },

                    { title: 'Clarity', desc: 'Is the manuscript written in clear, professional English?' },

                  ].map((criterion, i) => (

                    <div key={i} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-start gap-3">

                      <CheckCircle size={18} className="text-blue-600 mt-1 shrink-0"/>

                      <div>

                        <h4 className="font-black text-sm text-slate-900 mb-1">{criterion.title}</h4>

                        <p className="text-sm">{criterion.desc}</p>

                      </div>

                    </div>

                  ))}

                </div>

              </section>



              <section className="bg-red-50 p-10 rounded-[2.5rem] border border-red-100">

                <h3 className="text-2xl font-black text-red-900 uppercase mb-6 flex items-center gap-3">

                  <ShieldAlert size={28} className="text-red-600"/> 4. Plagiarism & Misconduct

                </h3>

                <p className="mb-6 text-slate-700">AJFM has a <strong>zero-tolerance policy for plagiarism</strong>.</p>

                <p className="mb-4 text-sm">While the editorial office conducts preliminary checks using software (e.g., iThenticate/Turnitin), please report any suspected plagiarism, redundancy (duplicate publication), or data fabrication you detect during your review.</p>

                <p className="text-sm font-bold">Note that manuscripts with major similarity (&gt;15%) or verbatim copying are subject to immediate rejection.</p>

              </section>



              <section>

                <h3 className="text-2xl font-black text-blue-900 uppercase mb-6 border-b-2 border-red-600 inline-block pb-2">5. Timeline</h3>

                <p className="mb-4">The journal aims for a rapid turnaround, with a first decision provided to authors within <strong>4–6 weeks</strong>.</p>

                <ul className="space-y-2 text-sm ml-6">

                  <li className="flex items-start gap-3">

                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 shrink-0"></div>

                    <p>Please accept the invitation to review only if you can complete the assignment within the specified timeframe.</p>

                  </li>

                  <li className="flex items-start gap-3">

                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 shrink-0"></div>

                    <p>If you anticipate a delay, kindly notify the editorial office immediately at <strong className="text-blue-600">tgafm.journal@gmail.com</strong>.</p>

                  </li>

                </ul>

              </section>



              <section className="bg-blue-50 p-10 rounded-[2.5rem] border border-blue-100">

                <h3 className="text-2xl font-black text-blue-900 uppercase mb-6">6. Submission of Recommendation</h3>

                <p className="mb-6 text-slate-700">Upon completing your assessment, please submit your report to the editorial office. Your recommendation should guide the Editorial Board in making the final decision. Typical recommendations include:</p>

                <div className="grid md:grid-cols-2 gap-4">

                  <div className="bg-green-50 p-5 rounded-2xl border border-green-100">

                    <h4 className="font-black text-sm text-slate-900 mb-2">✓ Accept</h4>

                    <p className="text-sm">No changes required.</p>

                  </div>

                  <div className="bg-yellow-50 p-5 rounded-2xl border border-yellow-100">

                    <h4 className="font-black text-sm text-slate-900 mb-2">◐ Minor Revisions</h4>

                    <p className="text-sm">Small corrections or clarifications needed (e.g., &lt;15% similarity issues).</p>

                  </div>

                  <div className="bg-orange-50 p-5 rounded-2xl border border-orange-100">

                    <h4 className="font-black text-sm text-slate-900 mb-2">● Major Revisions</h4>

                    <p className="text-sm">Significant re-work required.</p>

                  </div>

                  <div className="bg-red-50 p-5 rounded-2xl border border-red-100">

                    <h4 className="font-black text-sm text-slate-900 mb-2">✗ Reject</h4>

                    <p className="text-sm">Serious flaws, lack of novelty, or ethical breaches.</p>

                  </div>

                </div>

              </section>

            </div>

          </div>

        )}



        {/* INSTRUCTIONS - FOR EDITORS */}

        {activeTab === 'instr-editors' && (

          <div className="max-w-4xl mx-auto py-10 animate-in fade-in">

            <div className="bg-blue-900 p-16 rounded-[4rem] shadow-2xl text-center text-white relative overflow-hidden">

              <Settings size={200} className="absolute -bottom-20 -right-20 opacity-10" />

              <div className="relative z-10">

                <Settings size={64} className="mx-auto mb-8 text-blue-200"/>

                <h2 className="text-4xl font-black tracking-tighter uppercase mb-6">For Editors</h2>

                <p className="text-blue-100 font-medium leading-relaxed mb-8 text-lg">

                  Editors oversee the scientific integrity of the journal. They ensure an impartial review cycle and adherence to **COPE** standards for research publishing.

                </p>

                <div className="inline-flex items-center gap-2 bg-white/10 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest">

                  <ShieldCheck size={14}/> Editorial Oversight Policy Active

                </div>

              </div>

            </div>

          </div>

        )}



        {/* ACADEMY - ANNOUNCEMENTS & NOTICES (Simplified with Download Button) */}

        {activeTab === 'academy-notices' && (

          <div className="max-w-4xl mx-auto py-20 animate-in fade-in">

             <div className="bg-white p-16 rounded-[4rem] border shadow-2xl text-center relative overflow-hidden">

                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-32 -mt-32 opacity-50"></div>

                <div className="relative z-10">

                   <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 mx-auto mb-8 shadow-inner">

                      <Megaphone size={40}/>

                   </div>

                   <h2 className="text-4xl font-black text-blue-900 tracking-tighter uppercase mb-2">Announcements</h2>

                   <p className="text-slate-400 font-bold uppercase tracking-[0.3em] mb-12 text-[10px]">TGAFMCON - 2026 Updates</p>

                   

                   <p className="text-slate-500 text-lg leading-relaxed mb-12 max-w-md mx-auto font-medium">

                      The official brochure for the 2nd Annual State Conference (TGAFMCON - 2026) is now available for download.

                   </p>



                   <div className="flex flex-col items-center gap-6">

                      <a 

                        href="/TGAFMCON-2026.pdf" 

                        download 

                        className="inline-flex items-center gap-4 bg-blue-900 text-white px-12 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-red-600 hover:scale-105 transition-all shadow-2xl shadow-blue-100"

                      >

                        <Download size={20}/> Download Conference Brochure

                      </a>

                   </div>

                </div>

             </div>

          </div>

        )}



        {/* ACADEMY - LIFE MEMBERS */}

        {activeTab === 'academy-members' && (

          <div className="max-w-4xl mx-auto py-20 animate-in fade-in">

             <div className="bg-white p-16 rounded-[4rem] border shadow-2xl text-center relative overflow-hidden">

                <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full -mr-32 -mt-32 opacity-50"></div>

                <div className="relative z-10">

                   <UserCheck size={80} className="text-red-600 mx-auto mb-8"/>

                   <h2 className="text-4xl font-black text-blue-900 tracking-tighter uppercase mb-2">Life Members</h2>

                   <p className="text-slate-400 font-bold uppercase tracking-[0.3em] mb-12 text-[10px]">Official Registry</p>

                   

                   <div className="mb-12">

                      <h3 className="text-8xl font-black text-blue-900 leading-none mb-4">217</h3>

                      <p className="text-lg font-bold text-slate-500 uppercase tracking-widest">Registered Life Members</p>

                   </div>



                   <div className="h-[1px] bg-slate-100 max-w-sm mx-auto mb-12"></div>

                   

                   <p className="text-slate-500 text-sm leading-relaxed mb-12 max-w-md mx-auto font-medium">

                      The complete directory of all 217 life members is available for download as an official PDF list.

                   </p>



                   <a 

                     href="/life-members-list.pdf" 

                     download 

                     className="inline-flex items-center gap-4 bg-blue-900 text-white px-12 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-red-600 hover:scale-105 transition-all shadow-2xl shadow-blue-100"

                   >

                     <FileDown size={20}/> Download Full Member List (PDF)

                   </a>

                </div>

             </div>

          </div>

        )}



        {/* ACADEMY - REGISTRATION / MEMBERSHIP FORM */}

        {activeTab === 'academy-registration' && (

          <div className="max-w-4xl mx-auto py-20 animate-in fade-in">

             <div className="bg-white p-16 rounded-[4rem] border shadow-2xl text-center relative overflow-hidden">

                <div className="absolute top-0 left-0 w-64 h-64 bg-red-50 rounded-full -mr-32 -mt-32 opacity-50"></div>

                <div className="relative z-10">

                   <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center text-red-600 mx-auto mb-8 shadow-inner">

                      <FileText size={40}/>

                   </div>

                   <h2 className="text-4xl font-black text-blue-900 tracking-tighter uppercase mb-2">Join the Academy</h2>

                   <p className="text-slate-400 font-bold uppercase tracking-[0.3em] mb-12 text-[10px]">Life Membership Application Form</p>

                   

                   <p className="text-slate-500 text-lg leading-relaxed mb-12 max-w-md mx-auto font-medium">

                      Apply for life membership of the Telangana Academy of Forensic Medicine by filling out our official digital application form.

                   </p>



                   <div className="flex flex-col items-center gap-6">

                      <a 

                        href={MEMBERSHIP_FORM_LINK} 

                        target="_blank" 

                        rel="noreferrer" 

                        className="inline-flex items-center gap-4 bg-blue-900 text-white px-12 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-red-600 hover:scale-105 transition-all shadow-2xl shadow-blue-100"

                      >

                        <ExternalLink size={20}/> Open Application Form

                      </a>

                   </div>

                </div>

             </div>

          </div>

        )}



        {/* ACADEMY - PRESENT BODY */}

        {activeTab === 'academy-present' && (

          <div className="max-w-5xl mx-auto py-10 animate-in fade-in">

             <h2 className="text-4xl font-black text-blue-900 tracking-tighter uppercase text-center mb-4">Present Executive Body</h2>

             <p className="text-center text-red-600 font-bold mb-16 uppercase tracking-widest text-sm">{PRESENT_BODY.term}</p>

             <div className="grid md:grid-cols-3 gap-8 mb-16 text-center">

                {PRESENT_BODY.leaders.map((m, i) => (

                  <div key={i} className="bg-white p-8 rounded-[2.5rem] border shadow-sm"><h4 className="font-black text-lg text-slate-900">{m.name}</h4><p className="text-red-600 text-[9px] font-black uppercase mt-2">{m.role}</p></div>

                ))}

             </div>

             <div className="grid md:grid-cols-2 gap-10">

                <div className="bg-white p-8 rounded-[2rem] border shadow-sm"><h4 className="text-blue-900 font-black text-xs uppercase tracking-widest mb-6 border-b pb-3">Advisory Committee</h4><ul className="space-y-2">{PRESENT_BODY.advisory.map((n, i) => <li key={i} className="text-sm font-bold text-slate-600">• {n}</li>)}</ul></div>

                <div className="bg-white p-8 rounded-[2rem] border shadow-sm"><h4 className="text-blue-900 font-black text-xs uppercase tracking-widest mb-6 border-b pb-3">Committees</h4><p className="text-[10px] font-black text-red-600 uppercase mb-1">Academic Chairman</p><p className="text-sm font-bold mb-4">{PRESENT_BODY.academicChairman}</p><p className="text-[10px] font-black text-red-600 uppercase mb-1">Journal Chairman</p><p className="text-sm font-bold">{PRESENT_BODY.journalChairman}</p></div>

             </div>

             <div className="mt-12 bg-slate-100 p-10 rounded-[3rem] text-center"><h4 className="font-black text-blue-900 uppercase tracking-[0.3em] mb-10 text-xs">Executive Members</h4><div className="grid grid-cols-2 md:grid-cols-4 gap-4">{PRESENT_BODY.executiveMembers.map((n, i) => <div key={i} className="bg-white p-4 rounded-xl border text-[10px] font-bold text-slate-500 hover:text-red-600 transition-colors">{n}</div>)}</div></div>

          </div>

        )}



        {/* ACADEMY - PAST BODIES */}

        {(activeTab === 'academy-past' || activeTab === 'academy-past-1' || activeTab === 'academy-past-2') && (
          <div className="max-w-5xl mx-auto py-10 animate-in fade-in">
             <h2 className="text-4xl font-black text-blue-900 tracking-tighter uppercase text-center mb-16">Past Executive Bodies</h2>
             <div className="space-y-12">
                {PAST_BODIES.filter((_, idx) =>
                   activeTab === 'academy-past' || 
                   (activeTab === 'academy-past-1' && idx === 1) || 
                   (activeTab === 'academy-past-2' && idx === 0)
                ).map((body, idx) => (

                  <div key={idx} className="bg-white rounded-[3rem] border shadow-sm overflow-hidden"><div className="bg-blue-900 p-8 text-white flex justify-between items-center"><div><p className="text-[10px] font-black uppercase tracking-widest opacity-60">Term</p><h4 className="text-2xl font-black">{body.term}</h4></div><div className="text-right"><p className="text-[10px] font-black uppercase tracking-widest opacity-60">President</p><p className="text-xl font-bold">{body.president}</p></div></div><div className="p-10 grid md:grid-cols-3 gap-8"><div className="space-y-2"><p className="text-[10px] font-black text-red-600 uppercase border-b pb-2">Sub-Council</p>{body.details.vicePresidents?.map((n, i) => <p key={i} className="text-[10px] font-bold text-slate-500">{n} (VP)</p>)}{body.details.jointSecretaries?.map((n, i) => <p key={i} className="text-[10px] font-bold text-slate-500">{n} (JS)</p>)}</div><div className="col-span-2 space-y-2"><p className="text-[10px] font-black text-red-600 uppercase border-b pb-2">Executive Members</p><p className="text-[10px] font-medium text-slate-400 leading-relaxed italic">{body.details.members.join(", ")}</p></div></div></div>

                ))}

             </div>

          </div>

        )}



        {/* ACADEMY - ABOUT */}

        {activeTab === 'academy-about' && (

          <div className="max-w-5xl mx-auto py-10 animate-in fade-in">

             <div className="flex flex-col md:flex-row items-center gap-10 mb-20">

                <div className="md:w-2/3"><span className="text-red-600 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Institutional Profile</span><h2 className="text-4xl font-black text-blue-900 tracking-tighter uppercase mb-6 leading-tight">About TGAFM</h2><p className="text-slate-600 leading-relaxed font-medium mb-8 text-justify">The Telangana Academy of Forensic Medicine (TGAFM) is a professional organization dedicated to the advancement of Forensic Medicine. Officially registered on **5th June 2014** under the Andhra Pradesh Societies Registration Act, 2001. Today, 217 members have become life members, serving as a platform for excellence.</p></div>

                <div className="md:w-1/3 p-8 bg-white rounded-[4rem] border shadow-2xl flex items-center justify-center"><img src="/logo.png" alt="TGAFM" className="w-full h-full object-contain" /></div>

             </div>

             <h3 className="text-2xl font-black text-slate-900 mb-10 flex items-center gap-3 uppercase tracking-tighter"><Target className="text-red-600"/> Objectives</h3>

             <div className="grid md:grid-cols-3 gap-6">{OBJECTIVES.map((obj, i) => (<div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 hover:border-red-100 transition-all"><obj.icon size={24} className="text-blue-900 mb-4"/><h4 className="font-bold text-xs text-slate-800 leading-tight mb-2 uppercase">{obj.title}</h4><p className="text-[10px] text-slate-500 leading-relaxed">{obj.desc}</p></div>))}</div>

          </div>

        )}



        {/* ACADEMY - ACTIVITIES (CMEs) */}

        {activeTab === 'academic-activities' && (

          <div className="animate-in fade-in duration-500 max-w-5xl mx-auto">

             <h2 className="text-4xl font-black text-blue-900 tracking-tighter uppercase mb-16 text-center">Academic Activities</h2>

             <div className="space-y-6">

                {CME_ACTIVITIES.map((cme, i) => (

                  <div key={i} className="bg-white p-8 rounded-[2rem] border shadow-sm flex flex-col md:flex-row gap-6 items-center group hover:border-blue-900 transition">

                     <div className="w-20 h-20 bg-blue-900 rounded-3xl shrink-0 flex flex-col items-center justify-center text-white">

                        <p className="text-[10px] font-black opacity-50 uppercase">{cme.year}</p>

                        <Microscope size={24}/>

                     </div>

                     <div className="flex-grow text-center md:text-left">

                        <h4 className="font-black text-xl text-slate-900 mb-2 leading-tight uppercase">{cme.title}</h4>

                        <div className="flex flex-wrap justify-center md:justify-start gap-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">

                           <span className="flex items-center gap-1"><Building2 size={12}/> {cme.host}</span>

                           <span className="flex items-center gap-1 text-red-600"><Calendar size={12}/> {cme.date}</span>

                        </div>

                     </div>

                  </div>

                ))}

             </div>

          </div>

        )}



        {/* JOURNAL */}

        {activeTab === 'journal' && (

          <div className="grid lg:grid-cols-4 gap-12 animate-in slide-in-from-bottom-5">

             <aside className="lg:col-span-1 space-y-6"><div className="bg-white p-8 rounded-[2.5rem] border shadow-sm"><h3 className="font-black text-[10px] uppercase text-slate-400 mb-6 tracking-widest">Journal Archive</h3><ul className="space-y-4 text-xs font-black uppercase tracking-widest"><li className="text-red-600 border-l-4 border-red-600 pl-3">Volume 1 (2025)</li><li className="text-slate-200 pl-4 cursor-not-allowed">Volume 2 (2026)</li></ul></div></aside>

             <div className="lg:col-span-3 space-y-6">
               {articles.map((art) => {
                 const pdfLink = resolvePdfUrl(art.pdfUrl);
                 const canOpenPdf = Boolean(pdfLink);

                 return (
                   <div key={art._id} className="bg-white p-10 rounded-[2.5rem] border border-slate-50 hover:shadow-2xl transition group">
                     <span className="text-[9px] font-black text-red-600 uppercase tracking-[0.2em] mb-3 block">{art.articleType}</span>
                     <button type="button" onClick={() => openArticleDetails(art)} className="text-left w-full">
                       <h4 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-900 transition leading-snug">{art.title}</h4>
                     </button>
                     <p className="text-sm text-slate-400 font-medium mb-2">{Array.isArray(art.authors) ? art.authors.join(', ') : art.authors}</p>
                     {art.affiliations && (
                       <div className="text-xs text-slate-400 mb-2 italic">
                         {Array.isArray(art.affiliations) 
                           ? art.affiliations.map((aff, i) => <p key={i}>{aff}</p>)
                           : <p>{art.affiliations}</p>
                         }
                       </div>
                     )}
                     <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500 mb-4">
                       <p>Published: {art.publishedDate ? new Date(art.publishedDate).toLocaleDateString() : 'Not specified'}</p>
                       {art.doi && (
                         <p>
                           DOI: <a href={art.doi} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{art.doi}</a>
                         </p>
                       )}
                     </div>
                     {art.abstract && (
                       <div className="mb-6">
                         <p className="text-xs font-semibold text-slate-700 mb-1">Abstract:</p>
                         <p className="text-xs text-slate-600 line-clamp-3 hover:line-clamp-none transition-all">{art.abstract}</p>
                       </div>
                     )}
                     {art.keywords && (
                       <div className="flex gap-2 flex-wrap mb-8">
                         {Array.isArray(art.keywords)
                           ? art.keywords.map((kw, i) => (
                               <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded-full border border-slate-200">
                                 {kw}
                               </span>
                             ))
                           : <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded-full border border-slate-200">{art.keywords}</span>
                         }
                       </div>
                     )}

                     <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 text-[10px] font-black text-blue-900 uppercase tracking-[0.2em] border-t pt-8 mt-4">
                       <span className="text-slate-300">ISSN (Print): 3107-7633</span>

                       <div className="flex flex-wrap items-center gap-3">
                         <button
                           type="button"
                           onClick={() => openArticleDetails(art)}
                           className="flex items-center gap-2 border-b-2 border-red-600 pb-1 hover:text-red-600 transition"
                         >
                           Article Details <ArrowRight size={16} />
                         </button>

                         {canOpenPdf ? (
                           <>
                             <a
                               href={pdfLink}
                               target="_blank"
                               rel="noreferrer"
                               className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-xl tracking-widest hover:border-blue-900 transition"
                             >
                               <ExternalLink size={14} /> View PDF
                             </a>

                             <a
                               href={pdfLink}
                               download={getDownloadName(art)}
                               className="flex items-center gap-2 bg-blue-900 text-white px-4 py-2 rounded-xl tracking-widest hover:bg-red-600 transition"
                             >
                               <FileDown size={14} /> Download
                             </a>
                           </>
                         ) : (
                           <span className="text-red-500">PDF unavailable</span>
                         )}
                       </div>
                     </div>
                   </div>
                 );
               })}
             </div>

          </div>

        )}



        {/* ARTICLE DETAILS */}

        {activeTab === 'journal-article' && (

          <div className="max-w-5xl mx-auto animate-in fade-in">

            <button onClick={openJournalArchive} className="mb-8 text-[10px] font-black uppercase tracking-widest text-blue-900 hover:text-red-600 transition flex items-center gap-2">

              <ChevronRight size={14} className="rotate-180"/> Back to Journal Archive

            </button>

            {selectedArticle ? (

              <article className="bg-white p-12 rounded-[3rem] border shadow-sm space-y-10">

                <header className="border-b pb-8">

                  <p className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em] mb-3">{selectedArticle.articleType || 'Article'}</p>

                  <h2 className="text-4xl font-black text-blue-900 tracking-tight leading-tight mb-4">{selectedArticle.title}</h2>

                  <p className="text-slate-600 font-bold mb-2">{selectedArticle.authors}</p>

                  <p className="text-sm text-slate-500">{selectedArticle.affiliations}</p>

                </header>

                <section>

                  <h3 className="text-xl font-black text-blue-900 uppercase mb-4">Abstract</h3>

                  <p className="text-slate-700 leading-relaxed whitespace-pre-line">{selectedArticle.abstract || 'Not available.'}</p>

                </section>

                <section className="grid md:grid-cols-2 gap-6">

                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">

                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">DOI</p>

                    <p className="font-semibold text-slate-700 break-all">{selectedArticle.doi || 'Not assigned'}</p>

                  </div>

                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">

                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Published Date</p>

                    <p className="font-semibold text-slate-700">{selectedArticle.publishedDate || 'Not specified'}</p>

                  </div>

                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 md:col-span-2">

                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Keywords</p>

                    <div className="flex flex-wrap gap-2">

                      {(selectedArticle.keywords || []).length > 0 ? (

                        selectedArticle.keywords.map((kw, idx) => (

                          <span key={`${kw}-${idx}`} className="px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold uppercase tracking-wider">{kw}</span>

                        ))

                      ) : (

                        <span className="text-slate-500 font-semibold">Not specified</span>

                      )}

                    </div>

                  </div>

                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">

                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">License</p>

                    <p className="font-semibold text-slate-700">{selectedArticle.license || 'CC BY 4.0'}</p>

                  </div>

                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">

                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">ISSN (Print)</p>

                    <p className="font-semibold text-slate-700">3107-7633</p>

                  </div>

                </section>

                <section className="flex flex-wrap gap-3 pt-2">

                  {resolvePdfUrl(selectedArticle.pdfUrl) ? (

                    <>

                      <a

                        href={resolvePdfUrl(selectedArticle.pdfUrl)}

                        target="_blank"

                        rel="noreferrer"

                        className="bg-blue-900 text-white px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-red-600 transition flex items-center gap-2"

                      >

                        <ExternalLink size={16} /> View Full PDF

                      </a>

                      <a

                        href={resolvePdfUrl(selectedArticle.pdfUrl)}

                        download={getDownloadName(selectedArticle)}

                        className="bg-white border border-slate-300 text-slate-800 px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:border-blue-900 transition flex items-center gap-2"

                      >

                        <Download size={16} /> Download PDF

                      </a>

                    </>

                  ) : (

                    <p className="text-red-600 font-bold text-sm">PDF is currently unavailable for this article.</p>

                  )}

                </section>

              </article>

            ) : (

              <div className="bg-white p-12 rounded-[3rem] border shadow-sm text-center">

                <AlertTriangle size={36} className="text-red-600 mx-auto mb-4"/>

                <h3 className="text-2xl font-black text-blue-900 mb-3 uppercase">Article Not Found</h3>

                <p className="text-slate-600 mb-8">This article link may be outdated or the record has been removed.</p>

                <button onClick={openJournalArchive} className="bg-blue-900 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition">Open Journal Archive</button>

              </div>

            )}

          </div>

        )}



        {/* AIMS & SCOPE */}

        {activeTab === 'aims-scope' && (

          <div className="max-w-5xl mx-auto py-10 animate-in fade-in">

            <div className="text-center mb-16">

              <span className="text-red-600 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Journal Information</span>

              <h2 className="text-5xl font-black text-blue-900 tracking-tighter uppercase leading-none">Aims & Scope</h2>

            </div>



            <div className="bg-white p-12 rounded-[3rem] border shadow-sm space-y-10 leading-relaxed text-slate-600 font-medium">

              <div className="bg-blue-50 p-10 rounded-[2.5rem] border border-blue-100">

                <h3 className="text-2xl font-black text-blue-900 uppercase mb-6">Academy Journal of Forensic Medicine (AJFM)</h3>

                <p className="mb-4 text-slate-700 leading-relaxed">

                  The <strong>Academy Journal of Forensic Medicine (AJFM)</strong> is the official publication of the Telangana Academy of Forensic Medicine (TGAFM). The journal serves as a comprehensive global platform for publishing high-quality, original contributions in the following fields:

                </p>

              </div>



              <div>

                <h4 className="text-xl font-black text-blue-900 uppercase mb-6 border-b-2 border-red-600 inline-block pb-2">Subject Coverage</h4>

                <div className="grid md:grid-cols-2 gap-4 mt-6">

                  {[

                    'Forensic Medicine',

                    'Legal Medicine',

                    'Pathological Forensics',

                    'Toxicological Investigations',

                    'Forensic Anthropology',

                    'Dental Forensics',

                    'Radiological Forensics',

                    'Bioethics',

                    'Medical Jurisprudence',

                    'Forensic Applications within the Life Sciences'

                  ].map((field, i) => (

                    <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">

                      <CheckCircle size={18} className="text-blue-600 shrink-0" />

                      <span className="font-bold text-slate-700 text-sm">{field}</span>

                    </div>

                  ))}

                </div>

              </div>



              <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100">

                <h4 className="text-lg font-black text-blue-900 uppercase mb-4">Publication Types</h4>

                <p className="text-slate-600">

                  The journal invites <strong>novel research articles</strong>, <strong>systematic reviews</strong>, <strong>case reports</strong>, and <strong>short communications</strong>.

                </p>

              </div>



              <div className="text-center bg-blue-900 text-white p-8 rounded-[2.5rem]">

                <p className="text-[10px] font-black uppercase tracking-widest mb-2">ISSN (Print)</p>

                <p className="text-3xl font-black">3107-7633</p>

              </div>

            </div>

          </div>

        )}



        {/* EDITORIAL BOARD */}

        {activeTab === 'editorial-board' && (

          <div className="max-w-6xl mx-auto py-10 animate-in fade-in">

            <div className="text-center mb-16">

              <span className="text-red-600 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Leadership & Expertise</span>

              <h2 className="text-5xl font-black text-blue-900 tracking-tighter uppercase leading-none">Editorial Board</h2>

            </div>



            <div className="space-y-12">

              {/* Chief Editorial Team */}

              <div className="bg-white p-12 rounded-[3rem] border shadow-sm">

                <h3 className="text-2xl font-black text-blue-900 uppercase mb-8 border-b-2 border-red-600 inline-block pb-2">Chief Editorial Team</h3>

                <div className="grid md:grid-cols-2 gap-8 mt-8">

                  <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">

                    <p className="text-[10px] font-black text-blue-900 uppercase tracking-widest mb-2">Chief Editor</p>

                    <h4 className="text-xl font-bold text-slate-900 mb-1">Dr. Prashanth Mada</h4>

                    <p className="text-sm text-slate-500">AIIMS, Bibinagar</p>

                  </div>

                  <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">

                    <p className="text-[10px] font-black text-blue-900 uppercase tracking-widest mb-2">Joint Editor</p>

                    <h4 className="text-xl font-bold text-slate-900 mb-1">Dr. R. Sridhara Chary</h4>

                    <p className="text-sm text-slate-500">OMC, Hyderabad</p>

                  </div>

                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">

                    <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-2">Associate Editor</p>

                    <h4 className="text-lg font-bold text-slate-900 mb-1">Dr. A. Bharath Kumar Reddy</h4>

                    <p className="text-sm text-slate-500">ESIC, Hyderabad</p>

                  </div>

                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">

                    <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-2">Statistical Editor</p>

                    <h4 className="text-lg font-bold text-slate-900 mb-1">Dr. Radhika Soanker</h4>

                    <p className="text-sm text-slate-500">AIIMS, Bibinagar</p>

                  </div>

                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">

                    <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-2">Assistant Editor</p>

                    <h4 className="text-lg font-bold text-slate-900 mb-1">Dr. Abdul Rahman Omer Siddiqui</h4>

                    <p className="text-sm text-slate-500">GMC, Nalgonda</p>

                  </div>

                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">

                    <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-2">Language Editor</p>

                    <h4 className="text-lg font-bold text-slate-900 mb-1">Dr. Roopali Somani</h4>

                    <p className="text-sm text-slate-500">NIMS, Hyderabad</p>

                  </div>

                </div>

              </div>



              {/* International Advisory Board */}

              <div className="bg-white p-12 rounded-[3rem] border shadow-sm">

                <h3 className="text-2xl font-black text-blue-900 uppercase mb-8 border-b-2 border-red-600 inline-block pb-2">International Advisory Board</h3>

                <div className="grid md:grid-cols-3 gap-6 mt-8">

                  {[

                    { name: 'Valeri Gunas', country: 'Ukraine'},

                    { name: 'Eva Montanari', country: 'Italy' },

                    { name: 'Teresa Tess De Guzman', country: 'Philippines' },

                    { name: 'Summaiya Tariq', country: 'Pakistan' },

                    { name: 'B.Pr. Benyagoub Massinissa', country: 'Algeria' },

                  ].map((member, i) => (

                    <div key={i} className="bg-slate-50 p-5 rounded-2xl border border-slate-100">

                      <h4 className="text-sm font-bold text-slate-900 mb-1">{member.name}</h4>

                      <p className="text-xs text-slate-500">{member.country}</p>

                    </div>

                  ))}

                </div>

              </div>



              {/* National Advisory Board */}

              <div className="bg-white p-12 rounded-[3rem] border shadow-sm">

                <h3 className="text-2xl font-black text-blue-900 uppercase mb-8 border-b-2 border-red-600 inline-block pb-2">National Advisory Board</h3>

                <div className="grid md:grid-cols-2 gap-6 mt-8">

                  {[

                    { name: 'Prof. (Dr.) Adarsh Kumar', inst: 'AIIMS New Delhi' },

                    { name: 'Dr. T. Mahender Reddy', inst: 'Hyderabad' },

                    { name: 'Dr. Tanuj Kanchan', inst: 'AIIMS Jodhpur' },

                    { name: 'Dr. Sai Sudhir', inst: 'Andhra Pradesh' },

                    { name: 'Dr. Yadukul S', inst: 'AIIMS, Bibinagar' },

                  ].map((member, i) => (

                    <div key={i} className="bg-slate-50 p-5 rounded-2xl border border-slate-100">

                      <h4 className="text-sm font-bold text-slate-900 mb-1">{member.name}</h4>

                      <p className="text-xs text-slate-500">{member.inst}</p>

                    </div>

                  ))}

                </div>

              </div>



              {/* State Advisory Board */}

              <div className="bg-white p-12 rounded-[3rem] border shadow-sm">

                <h3 className="text-2xl font-black text-blue-900 uppercase mb-8 border-b-2 border-red-600 inline-block pb-2">State Advisory Board</h3>

                <div className="grid md:grid-cols-2 gap-6 mt-8">

                  {[

                    { name: 'Dr. Md Taqiuddin Khan', inst: 'OMC, Hyderabad' },

                    { name: 'Dr. T. Venkata Ramanaiah', inst: 'MNR, Sangareddy' },

                    { name: 'Dr. Abhjit Subhedar', inst: 'OMC, Hyderabad' },

                    { name: 'Dr. T Krupal Singh', inst: 'GMC, Secunderabad' },

                    { name: 'Dr. B. Karunakar', inst: 'RIMS, Adilabad' },

                    { name: 'Dr. B. V. Naga Mohan Rao', inst: 'GMC, Nizambad' },

                    { name: 'Dr. Venkataramana Murthy Kurasam', inst: 'OMC, Hyderabad' },

                    { name: 'Dr. Ch. Laxman Rao', inst: 'KMC, Warangal' },

                    { name: 'Dr. G. Bharath Kumar', inst: 'MMC, Khammam' },

                    { name: 'Dr. K. Parvathi', inst: 'GMC, Mahabubnagar' },

                  ].map((member, i) => (

                    <div key={i} className="bg-slate-50 p-5 rounded-2xl border border-slate-100">

                      <h4 className="text-sm font-bold text-slate-900 mb-1">{member.name}</h4>

                      <p className="text-xs text-slate-500">{member.inst}</p>

                    </div>

                  ))}

                </div>

              </div>

            </div>

          </div>

        )}



        {/* OPEN ACCESS POLICY*/}

        {activeTab === 'policy-open-access' && (

          <div className="max-w-5xl mx-auto py-10 animate-in fade-in">

            <div className="text-center mb-16">

              <span className="text-red-600 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Diamond Open Access</span>

              <h2 className="text-5xl font-black text-blue-900 tracking-tighter uppercase leading-none">Open Access Policy</h2>

            </div>



            <div className="bg-white p-12 rounded-[3rem] border shadow-sm space-y-10 leading-relaxed text-slate-600 font-medium">

              <div className="bg-blue-50 p-10 rounded-[2.5rem] border border-blue-100">

                <h3 className="text-2xl font-black text-blue-900 uppercase mb-6 flex items-center gap-3"><Unlock size={28} className="text-blue-600"/> General Statement</h3>

                <p className="text-slate-700">

                  The <strong>Academy Journal of Forensic Medicine (AJFM)</strong> is committed to serving as a global comprehensive platform for the advancement of forensic medicine. To support the exchange of knowledge and ensure the widest possible dissemination of research, AJFM provides <strong>immediate, free access to its content</strong>.

                </p>

              </div>



              <section>

                <h4 className="text-xl font-black text-blue-900 uppercase mb-6 border-b-2 border-red-600 inline-block pb-2">Fee Policy (Diamond Open Access)</h4>

                <p className="mb-6">AJFM is a peer-reviewed journal that does not charge authors or readers.</p>

                <div className="grid md:grid-cols-3 gap-6">

                  <div className="bg-green-50 p-6 rounded-2xl border border-green-100">

                    <CheckCircle size={24} className="text-green-600 mb-3"/>

                    <h5 className="font-black text-sm text-slate-900 mb-2 uppercase">Article Processing Charges (APCs)</h5>

                    <p className="text-sm text-slate-600">The journal does not levy any publication charges.</p>

                  </div>

                  <div className="bg-green-50 p-6 rounded-2xl border border-green-100">

                    <CheckCircle size={24} className="text-green-600 mb-3"/>

                    <h5 className="font-black text-sm text-slate-900 mb-2 uppercase">Submission Charges</h5>

                    <p className="text-sm text-slate-600">There are no fees for submitting manuscripts to the journal.</p>

                  </div>

                  <div className="bg-green-50 p-6 rounded-2xl border border-green-100">

                    <CheckCircle size={24} className="text-green-600 mb-3"/>

                    <h5 className="font-black text-sm text-slate-900 mb-2 uppercase">Waivers</h5>

                    <p className="text-sm text-slate-600">As there are no fees charged at any stage, a waiver policy is not applicable.</p>

                  </div>

                </div>

              </section>



              <section>

                <h4 className="text-xl font-black text-blue-900 uppercase mb-6 border-b-2 border-red-600 inline-block pb-2">Copyright and Licensing</h4>

                <p className="mb-4">AJFM applies CC BY 4.0 to all published content and follows an author-rights-first model:</p>

                <ul className="space-y-3 ml-6">

                  <li className="flex items-start gap-3">

                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 shrink-0"></div>

                    <p><strong>Copyright Ownership:</strong> Authors retain copyright of their work after publication.</p>

                  </li>

                  <li className="flex items-start gap-3">

                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 shrink-0"></div>

                    <p><strong>Publishing License:</strong> Authors grant AJFM a non-exclusive right to publish, distribute, and archive the article with proper attribution.</p>

                  </li>

                </ul>

              </section>



              <section className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100">

                <h4 className="text-xl font-black text-blue-900 uppercase mb-6">Access Rights</h4>

                <p>

                  All articles published in AJFM are freely available to the public, aligning with the journal's aim to disseminate novel research, systematic reviews, and case reports to the global medical community.

                </p>

              </section>

            </div>

          </div>

        )}
        {/* COPYRIGHT POLICY */}

        {activeTab === 'policy-copyright' && (

          <div className="max-w-5xl mx-auto py-10 animate-in fade-in">

            <div className="text-center mb-16">

              <span className="text-red-600 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Intellectual Property</span>

              <h2 className="text-5xl font-black text-blue-900 tracking-tighter uppercase leading-none">Copyright Policy</h2>

            </div>



            <div className="bg-white p-12 rounded-[3rem] border shadow-sm space-y-10 leading-relaxed text-slate-600 font-medium">

              <div className="grid md:grid-cols-3 gap-6">

                <div className="bg-blue-50 p-8 rounded-2xl border border-blue-100">

                  <ShieldCheck size={32} className="text-blue-600 mb-4"/>

                  <h4 className="font-black text-sm text-blue-900 uppercase mb-3">Copyright Ownership</h4>

                  <p className="text-sm">Authors retain copyright of their published work. AJFM requires a signed publication license agreement for record and publication rights.</p>

                </div>

                <div className="bg-blue-50 p-8 rounded-2xl border border-blue-100">

                  <Building2 size={32} className="text-blue-600 mb-4"/>

                  <h4 className="font-black text-sm text-blue-900 uppercase mb-3">Publisher Rights</h4>

                  <p className="text-sm">Authors grant the Telangana Academy of Forensic Medicine (TGAFM) a non-exclusive right to publish, distribute, and preserve the article.</p>

                </div>

                <div className="bg-green-50 p-8 rounded-2xl border border-green-100">

                  <Users size={32} className="text-green-600 mb-4"/>

                  <h4 className="font-black text-sm text-blue-900 uppercase mb-3">Author Rights</h4>

                  <p className="text-sm">Authors may share and archive the final published version with citation to AJFM, consistent with CC BY 4.0 terms.</p>

                </div>

              </div>

            </div>

          </div>

        )}



        {/* PUBLICATION ETHICS */}

        {activeTab === 'policy-publication-ethics' && (

          <div className="max-w-5xl mx-auto py-10 animate-in fade-in">

            <div className="text-center mb-16">

              <span className="text-red-600 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Research Integrity</span>

              <h2 className="text-5xl font-black text-blue-900 tracking-tighter uppercase leading-none">Publication Ethics</h2>

            </div>



            <div className="bg-white p-12 rounded-[3rem] border shadow-sm space-y-10 leading-relaxed text-slate-600 font-medium">

              <section className="bg-red-50 p-10 rounded-[2.5rem] border border-red-100">

                <h3 className="text-2xl font-black text-blue-900 uppercase mb-4">COPE-Aligned Ethics Framework</h3>

                <p className="text-slate-700">AJFM follows COPE principles for editors, reviewers, and authors. Any allegation of misconduct is assessed using documented editorial procedures and evidence review.</p>

              </section>

              <section>

                <h4 className="text-xl font-black text-blue-900 uppercase mb-6 border-b-2 border-red-600 inline-block pb-2">Core Ethics Policies</h4>

                <div className="grid md:grid-cols-2 gap-6">

                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">

                    <h5 className="font-black text-sm text-slate-900 mb-2 uppercase">Conflicts of Interest</h5>

                    <p className="text-sm">Authors, reviewers, and editors must disclose all financial or non-financial conflicts before editorial decisions are made.</p>

                  </div>

                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">

                    <h5 className="font-black text-sm text-slate-900 mb-2 uppercase">Human and Animal Ethics</h5>

                    <p className="text-sm">Studies involving humans or animals must include ethics committee approval and informed consent statements where applicable.</p>

                  </div>

                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">

                    <h5 className="font-black text-sm text-slate-900 mb-2 uppercase">Data Integrity</h5>

                    <p className="text-sm">Fabrication, falsification, manipulated images, and undeclared duplication are grounds for rejection or post-publication action.</p>

                  </div>

                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">

                    <h5 className="font-black text-sm text-slate-900 mb-2 uppercase">Plagiarism Screening</h5>

                    <p className="text-sm">All submissions are screened prior to peer review. Similarity concerns are investigated with author clarification and editorial documentation.</p>

                  </div>

                </div>

              </section>

              <section>

                <h4 className="text-xl font-black text-blue-900 uppercase mb-6 border-b-2 border-red-600 inline-block pb-2">Corrections and Retractions</h4>

                <div className="space-y-4 text-sm">

                  <p><strong>Corrections:</strong> Minor errors that do not affect interpretation are corrected through a dated correction notice.</p>

                  <p><strong>Retractions:</strong> Articles with unreliable findings, serious ethical violations, or confirmed misconduct are retracted with a transparent public statement.</p>

                  <p><strong>Expression of Concern:</strong> AJFM may issue an interim notice while a formal investigation is ongoing.</p>

                </div>

              </section>

              <section className="bg-blue-50 p-8 rounded-[2.5rem] border border-blue-100">

                <h4 className="text-lg font-black text-blue-900 uppercase mb-3">Appeals and Complaints</h4>

                <p className="text-sm text-slate-700">Authors may appeal editorial decisions by submitting a reasoned statement to the editorial office. Complaints regarding review quality, editorial conduct, or publication ethics are handled by the editorial leadership with documented outcomes.</p>

              </section>

            </div>

          </div>

        )}



        {/* LICENSING TERMS */}

        {activeTab === 'policy-licensing' && (

          <div className="max-w-5xl mx-auto py-10 animate-in fade-in">

            <div className="text-center mb-16">

              <span className="text-red-600 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Usage Rights</span>

              <h2 className="text-5xl font-black text-blue-900 tracking-tighter uppercase leading-none">Licensing Terms</h2>

            </div>



            <div className="bg-white p-12 rounded-[3rem] border shadow-sm space-y-10 leading-relaxed text-slate-600 font-medium">

              <div className="bg-blue-50 p-10 rounded-[2.5rem] border border-blue-100">

                <h3 className="text-2xl font-black text-blue-900 uppercase mb-6">Creative Commons Attribution 4.0 International License (CC BY 4.0)</h3>

                <p className="text-slate-700 mb-6">

                  To promote the global advancement of forensic medicine and ensure the widest possible dissemination of research, the <strong>Academy Journal of Forensic Medicine (AJFM)</strong> applies the <strong>Creative Commons Attribution 4.0 International License (CC BY 4.0)</strong> to all published articles.

                </p>

              </div>



              <section>

                <h4 className="text-xl font-black text-blue-900 uppercase mb-6 border-b-2 border-red-600 inline-block pb-2">Under this license:</h4>

                <div className="space-y-6">

                  <div className="flex items-start gap-4">

                    <div className="bg-blue-100 p-4 rounded-2xl shrink-0">

                      <Share2 size={24} className="text-blue-600"/>

                    </div>

                    <div>

                      <h5 className="font-black text-slate-900 mb-2">Share</h5>

                      <p>Anyone is free to copy and redistribute the material in any medium or format.</p>

                    </div>

                  </div>

                  <div className="flex items-start gap-4">

                    <div className="bg-green-100 p-4 rounded-2xl shrink-0">

                      <RefreshCw size={24} className="text-green-600"/>

                    </div>

                    <div>

                      <h5 className="font-black text-slate-900 mb-2">Adapt</h5>

                      <p>Anyone is free to remix, transform, and build upon the material for any purpose, even commercially.</p>

                    </div>

                  </div>

                  <div className="flex items-start gap-4">

                    <div className="bg-red-100 p-4 rounded-2xl shrink-0">

                      <Award size={24} className="text-red-600"/>

                    </div>

                    <div>

                      <h5 className="font-black text-slate-900 mb-2">Attribution</h5>

                      <p>Users must give appropriate credit to the original author(s) and the source, provide a link to the Creative Commons license, and indicate if changes were made.</p>

                    </div>

                  </div>

                </div>

              </section>

            </div>

          </div>

        )}



        {/* EDITORIAL PROCESS & PEER REVIEW */}

        {activeTab === 'policy-editorial-process' && (

          <div className="max-w-5xl mx-auto py-10 animate-in fade-in">

            <div className="text-center mb-16">

              <span className="text-red-600 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Quality Assurance</span>

              <h2 className="text-5xl font-black text-blue-900 tracking-tighter uppercase leading-none">Editorial Process & Peer Review</h2>

            </div>



            <div className="bg-white p-12 rounded-[3rem] border shadow-sm space-y-10 leading-relaxed text-slate-600 font-medium">

              <div className="bg-blue-50 p-10 rounded-[2.5rem] border border-blue-100">

                <h3 className="text-2xl font-black text-blue-900 uppercase mb-6">Double-Blind Peer Review</h3>

                <p className="text-slate-700">

                  The journal adheres to a rigorous <strong>double-blind peer review process</strong> to ensure academic and ethical integrity.

                </p>

              </div>



              <section>

                <h4 className="text-xl font-black text-blue-900 uppercase mb-6 border-b-2 border-red-600 inline-block pb-2">Review Flow</h4>

                <div className="grid md:grid-cols-2 gap-6">

                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">

                    <Eye size={24} className="text-blue-600 mb-3"/>

                    <h5 className="font-black text-sm text-slate-900 mb-2">Expert Review</h5>

                    <p className="text-sm">Each manuscript is reviewed by at least two subject experts. The editorial board makes the final decision based on reviewer recommendations.</p>

                  </div>

                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">

                    <Calendar size={24} className="text-green-600 mb-3"/>

                    <h5 className="font-black text-sm text-slate-900 mb-2">Timeline</h5>

                    <p className="text-sm">The turnaround time for the first decision is typically <strong>4–6 weeks</strong>.</p>

                  </div>

                </div>

              </section>



              <section className="bg-red-50 p-10 rounded-[2.5rem] border border-red-100">

                <h4 className="text-xl font-black text-red-900 uppercase mb-6 flex items-center gap-3">

                  <ShieldAlert size={28} className="text-red-600"/> Plagiarism Policy

                </h4>

                <p className="mb-6 text-slate-700">

                  The journal has a <strong>zero-tolerance policy for plagiarism</strong>. All submissions are screened using detection software (e.g., iThenticate or Turnitin).

                </p>

                <div className="grid md:grid-cols-2 gap-6">

                  <div className="bg-white p-6 rounded-2xl border border-red-100">

                    <h5 className="font-black text-sm text-slate-900 mb-2">Minor Similarity (&lt;15%)</h5>

                    <p className="text-sm">Sent back to authors for correction.</p>

                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-red-100">

                    <h5 className="font-black text-sm text-slate-900 mb-2">Major Similarity (&gt;15%)</h5>

                    <p className="text-sm">Immediate rejection and possible blacklisting.</p>

                  </div>

                </div>

                <p className="mt-6 text-sm text-slate-600 italic">

                  <strong>Misconduct:</strong> The journal adheres to COPE ethical guidelines for handling suspected misconduct.

                </p>

              </section>

            </div>

          </div>

        )}



        {/* AUTHOR CHARGES */}

        {activeTab === 'policy-author-charges' && (

          <div className="max-w-4xl mx-auto py-10 animate-in fade-in">

            <div className="text-center mb-16">

              <span className="text-red-600 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Free for All</span>

              <h2 className="text-5xl font-black text-blue-900 tracking-tighter uppercase leading-none">Author Charges</h2>

            </div>



            <div className="bg-white p-16 rounded-[4rem] border shadow-2xl text-center">

              <div className="w-24 h-24 bg-green-50 rounded-3xl flex items-center justify-center text-green-600 mx-auto mb-8 shadow-inner">

                <CheckCircle size={48}/>

              </div>

              <h3 className="text-3xl font-black text-blue-900 mb-6">NO CHARGES</h3>

              <p className="text-slate-600 text-lg mb-12 max-w-2xl mx-auto">

                The Academy Journal of Forensic Medicine does not levy any fees on authors.

              </p>

              <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">

                <div className="bg-green-50 p-6 rounded-2xl border border-green-100">

                  <h4 className="font-black text-blue-900 mb-2 uppercase text-sm">Submission Fees</h4>

                  <p className="text-2xl font-black text-green-600">None</p>

                </div>

                <div className="bg-green-50 p-6 rounded-2xl border border-green-100">

                  <h4 className="font-black text-blue-900 mb-2 uppercase text-sm">Publication Charges (APCs)</h4>

                  <p className="text-2xl font-black text-green-600">None</p>

                </div>

                <div className="bg-green-50 p-6 rounded-2xl border border-green-100">

                  <h4 className="font-black text-blue-900 mb-2 uppercase text-sm">Page Charges</h4>

                  <p className="text-2xl font-black text-green-600">None</p>

                </div>

                <div className="bg-green-50 p-6 rounded-2xl border border-green-100">

                  <h4 className="font-black text-blue-900 mb-2 uppercase text-sm">Colour Print Charges</h4>

                  <p className="text-2xl font-black text-green-600">None</p>

                </div>

              </div>

              <p className="mt-12 text-sm font-bold text-slate-500 uppercase tracking-widest">

                There are no charges for authors of any kind

              </p>

            </div>

          </div>

        )}



        {/* PUBLISHER INFORMATION */}

        {activeTab === 'publisher-info' && (

          <div className="max-w-4xl mx-auto py-10 animate-in fade-in">

            <div className="text-center mb-16">

              <span className="text-red-600 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Contact Details</span>

              <h2 className="text-5xl font-black text-blue-900 tracking-tighter uppercase leading-none">Publisher Information</h2>

            </div>



            <div className="bg-white p-16 rounded-[4rem] border shadow-2xl">

              <div className="text-center mb-12">

                <Building2 size={64} className="text-blue-600 mx-auto mb-6"/>

                <h3 className="text-3xl font-black text-blue-900 mb-2">Telangana Academy of Forensic Medicine</h3>

                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Publisher & Owner</p>

              </div>



              <div className="grid md:grid-cols-2 gap-8">

                <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">

                  <MapPin size={24} className="text-red-600 mb-4"/>

                  <h4 className="font-black text-blue-900 uppercase text-sm mb-3">Address</h4>

                  <p className="text-slate-600 leading-relaxed">

                    301, Armsburg Alluri, Kakateeyanagar,<br/>

                    Street No. 3, Habsiguda,<br/>

                    Hyderabad-500007,<br/>

                    Telangana, India

                  </p>

                </div>

                <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">

                  <Users size={24} className="text-blue-600 mb-4"/>

                  <h4 className="font-black text-blue-900 uppercase text-sm mb-3">Responsible Person</h4>

                  <p className="text-slate-600 font-bold mb-4">Dr. Prashanth Mada</p>

                  <div className="space-y-2">

                    <div className="flex items-center gap-2">

                      <Mail size={16} className="text-slate-400"/>

                      <a href="mailto:prashanth.fmt@aiimsbibinagar.edu.in" className="text-blue-600 hover:text-red-600 text-sm font-bold">

                        prashanth.fmt@aiimsbibinagar.edu.in

                      </a>

                    </div>

                    <div className="flex items-center gap-2">

                      <Mail size={16} className="text-slate-400"/>

                      <p className="text-slate-600 text-sm font-bold">+91 98497 30345</p>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        )}



        {/* CONFERENCE HUB */}

        {activeTab === 'conference' && (

          <div className="max-w-6xl mx-auto py-10 animate-in slide-in-from-bottom-5">

             <div className="bg-blue-900 rounded-[3rem] p-12 text-white mb-12 relative overflow-hidden shadow-2xl">

                <Landmark size={300} className="absolute -bottom-20 -right-20 opacity-10" />

                <div className="relative z-10">

                   <span className="bg-red-600 px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase mb-6 inline-block">2nd Annual State Conference</span>

                   <h2 className="text-5xl font-black tracking-tighter mb-4 leading-tight uppercase">TGAFMCON - 2026</h2>

                   <p className="text-xl font-bold text-blue-200 mb-8 italic">Theme: Holistic Forensics - Bridging Crime, Clinic & Court</p>

                </div>

             </div>

             <div className="bg-white p-12 rounded-[3rem] border text-center shadow-sm">

                <QrCode size={40} className="text-red-600 mx-auto mb-6"/>

                <h4 className="text-2xl font-black text-blue-900 uppercase mb-4">TGAFMCON 2026 Registration</h4>

                <p className="text-slate-500 font-medium mb-10 max-w-2xl mx-auto leading-relaxed">

                   Registration, early bird discounts, and scientific programme details are active. 

                   Block your dates: 11th & 12th April, 2026.

                </p>

                <div className="flex flex-col items-center gap-6">

                  <div className="flex flex-wrap justify-center gap-4">

                    <a href={CONFERENCE_FORM_LINK} target="_blank" rel="noreferrer" className="bg-blue-900 text-white px-12 py-5 rounded-[2.5rem] font-black uppercase tracking-widest text-[10px] shadow-2xl hover:bg-red-600 transition-all hover:scale-105 flex items-center justify-center gap-3">

                      <QrCode size={18}/> Online Registration Form

                    </a>

                    <button onClick={() => setActiveTab('academy-registration')} className="bg-white border-2 border-slate-200 text-blue-900 px-12 py-5 rounded-[2.5rem] font-black uppercase tracking-widest text-[10px] hover:bg-slate-50 transition-all hover:scale-105">

                      Member Registration

                    </button>

                  </div>

                  <a href="/tgafmcon-2026-brochure.pdf" download="TGAFMCON_2026_Brochure.pdf" className="bg-red-600 text-white px-16 py-4 rounded-[2.5rem] font-black uppercase tracking-widest text-[11px] shadow-lg hover:bg-red-700 transition-all hover:scale-105 flex items-center justify-center gap-3 border-4 border-red-100 animate-pulse mt-2">
                    <FileText size={20}/> Download Official 2026 Brochure
                  </a>

                </div>

             </div>

          </div>

        )}



        {/* ADMIN */}

        {activeTab === 'admin' && (

          <div className="max-w-2xl mx-auto py-10 animate-in fade-in">

            <h2 className="text-3xl font-black text-blue-900 tracking-tighter uppercase mb-10 text-center">Secretariat Access</h2>

            <div className="bg-white p-16 rounded-[4rem] border shadow-2xl text-center">

              {!adminToken ? (
                <>
                  <Lock size={40} className="text-red-600 mx-auto mb-6"/>

                  <h4 className="text-xl font-black text-blue-900 uppercase mb-4">Editorial Authentication</h4>

                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-10 leading-relaxed">Access restricted to Editorial Secretariat only.</p>

                  <input
                    type="password"
                    value={adminCode}
                    onChange={(e) => setAdminCode(e.target.value)}
                    placeholder="Enter Secretariat Code"
                    className="w-full p-5 bg-slate-50 border rounded-3xl mb-6 text-center font-bold outline-none focus:ring-4 focus:ring-red-100 transition-all"
                  />

                  {adminAuthError && (
                    <p className="text-red-600 font-bold text-xs mb-4">{adminAuthError}</p>
                  )}

                  <button
                    onClick={handleAdminLogin}
                    disabled={isAdminLoading}
                    className="w-full bg-blue-900 text-white py-5 rounded-[2.5rem] font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-red-600 transition-all disabled:opacity-60"
                  >
                    {isAdminLoading ? 'Verifying...' : 'Verify & Enter Dashboard'}
                  </button>
                </>
              ) : (
                <form onSubmit={handleJournalUpload} className="text-left space-y-5">
                  <div className="text-center mb-8">
                    <CheckCircle size={36} className="text-green-600 mx-auto mb-4"/>
                    <h4 className="text-xl font-black text-blue-900 uppercase">Editorial Dashboard</h4>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">Upload a journal PDF and publish in archive</p>
                  </div>

                  <input
                    type="text"
                    placeholder="Journal Title"
                    value={journalForm.title}
                    onChange={(e) => handleJournalInputChange('title', e.target.value)}
                    className="w-full p-4 bg-slate-50 border rounded-2xl font-semibold outline-none focus:ring-4 focus:ring-blue-100"
                  />

                  <input
                    type="text"
                    placeholder="Authors"
                    value={journalForm.authors}
                    onChange={(e) => handleJournalInputChange('authors', e.target.value)}
                    className="w-full p-4 bg-slate-50 border rounded-2xl font-semibold outline-none focus:ring-4 focus:ring-blue-100"
                  />

                  <input
                    type="text"
                    placeholder="Affiliations"
                    value={journalForm.affiliations}
                    onChange={(e) => handleJournalInputChange('affiliations', e.target.value)}
                    className="w-full p-4 bg-slate-50 border rounded-2xl font-semibold outline-none focus:ring-4 focus:ring-blue-100"
                  />

                  <textarea
                    placeholder="Abstract"
                    rows={4}
                    value={journalForm.abstract}
                    onChange={(e) => handleJournalInputChange('abstract', e.target.value)}
                    className="w-full p-4 bg-slate-50 border rounded-2xl font-semibold outline-none focus:ring-4 focus:ring-blue-100"
                  />

                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Keywords (comma separated)"
                      value={journalForm.keywords}
                      onChange={(e) => handleJournalInputChange('keywords', e.target.value)}
                      className="w-full p-4 bg-slate-50 border rounded-2xl font-semibold outline-none focus:ring-4 focus:ring-blue-100"
                    />

                    <input
                      type="text"
                      placeholder="DOI (optional)"
                      value={journalForm.doi}
                      onChange={(e) => handleJournalInputChange('doi', e.target.value)}
                      className="w-full p-4 bg-slate-50 border rounded-2xl font-semibold outline-none focus:ring-4 focus:ring-blue-100"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Published Date (DD/MM/YYYY)"
                      value={journalForm.publishedDate}
                      onChange={(e) => handleJournalInputChange('publishedDate', e.target.value)}
                      className="w-full p-4 bg-slate-50 border rounded-2xl font-semibold outline-none focus:ring-4 focus:ring-blue-100"
                    />

                    <input
                      type="text"
                      placeholder="Article Type"
                      value={journalForm.articleType}
                      onChange={(e) => handleJournalInputChange('articleType', e.target.value)}
                      className="w-full p-4 bg-slate-50 border rounded-2xl font-semibold outline-none focus:ring-4 focus:ring-blue-100"
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="License"
                    value={journalForm.license}
                    onChange={(e) => handleJournalInputChange('license', e.target.value)}
                    className="w-full p-4 bg-slate-50 border rounded-2xl font-semibold outline-none focus:ring-4 focus:ring-blue-100"
                  />

                  <div className="border-2 border-dashed border-slate-200 rounded-2xl p-5 bg-slate-50">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500 block mb-3">Journal PDF</label>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => setJournalFile(e.target.files?.[0] || null)}
                      className="w-full text-sm font-semibold"
                    />
                    {journalFile && <p className="text-xs font-bold text-blue-700 mt-2">Selected: {journalFile.name}</p>}
                  </div>

                  {adminAuthError && <p className="text-red-600 font-bold text-xs">{adminAuthError}</p>}
                  {adminStatusMessage && <p className="text-green-700 font-bold text-xs">{adminStatusMessage}</p>}

                  <div className="grid md:grid-cols-2 gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={isUploadingJournal}
                      className="w-full bg-blue-900 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-red-600 transition-all disabled:opacity-60"
                    >
                      {isUploadingJournal ? 'Uploading...' : 'Upload & Publish Journal'}
                    </button>

                    <button
                      type="button"
                      onClick={handleAdminLogout}
                      className="w-full bg-white border border-slate-300 text-slate-700 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-100 transition"
                    >
                      Logout
                    </button>
                  </div>
                </form>
              )}

            </div>

          </div>

        )}

        {/* SITE MAP */}
        {activeTab === 'sitemap' && (
          <div className="max-w-5xl mx-auto py-10 animate-in fade-in space-y-12">
            <div className="text-center mb-16">
              <span className="text-red-600 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Navigation</span>
              <h2 className="text-5xl font-black text-blue-900 tracking-tighter uppercase leading-none">Site Map</h2>
            </div>
            
            <div className="bg-white p-12 rounded-[3rem] border shadow-sm grid md:grid-cols-2 gap-10">
              {/* Column 1 */}
              <div className="space-y-8">
                <div>
                  <button onClick={() => setActiveTab('home')} className="text-2xl font-black text-blue-900 uppercase hover:text-red-600 transition block text-left">Home</button>
                </div>
                
                <div>
                  <h3 className="text-2xl font-black text-blue-900 uppercase mb-4 border-b-2 border-red-600 inline-block pb-1">About Us</h3>
                  <ul className="space-y-3 font-medium text-slate-600 ml-4 border-l-2 border-slate-100 pl-4">
                    <li><button onClick={() => setActiveTab('academy-about')} className="hover:text-red-600 transition block text-left">About TGAFM</button></li>
                    <li><button onClick={() => setActiveTab('academy-present')} className="hover:text-red-600 transition block text-left">Present Executive Body</button></li>
                    <li>
                      <span className="block text-slate-800 font-bold mb-2">Past Executive Body</span>
                      <ul className="space-y-2 ml-4">
                        <li><button onClick={() => setActiveTab('academy-past-1')} className="text-sm hover:text-red-600 transition block text-left">- 2014 - 2024</button></li>
                        <li><button onClick={() => setActiveTab('academy-past-2')} className="text-sm hover:text-red-600 transition block text-left">- 2024 - 2026</button></li>
                      </ul>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-black text-blue-900 uppercase mb-4 border-b-2 border-red-600 inline-block pb-1">Members</h3>
                  <ul className="space-y-3 font-medium text-slate-600 ml-4 border-l-2 border-slate-100 pl-4">
                    <li><button onClick={() => setActiveTab('academy-members')} className="hover:text-red-600 transition block text-left">List of Members</button></li>
                    <li><button onClick={() => setActiveTab('academy-registration')} className="hover:text-red-600 transition block text-left">Registration Form</button></li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-2xl font-black text-blue-900 uppercase mb-4 border-b-2 border-red-600 inline-block pb-1">Conferences</h3>
                  <ul className="space-y-3 font-medium text-slate-600 ml-4 border-l-2 border-slate-100 pl-4">
                    <li>
                      <span className="block text-slate-800 font-bold mb-2">2025</span>
                      <ul className="space-y-2 ml-4">
                        <li><button onClick={() => setActiveTab('conference')} className="text-sm hover:text-red-600 transition block text-left">- About</button></li>
                        <li><button onClick={() => setActiveTab('conference')} className="text-sm hover:text-red-600 transition block text-left">- Glimpses</button></li>
                      </ul>
                    </li>
                    <li><button onClick={() => setActiveTab('conference')} className="hover:text-red-600 transition block text-left">2026</button></li>
                    <li><button onClick={() => setActiveTab('conference')} className="hover:text-red-600 transition block text-left">Upcoming</button></li>
                  </ul>
                </div>
              </div>

              {/* Column 2 */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-black text-blue-900 uppercase mb-4 border-b-2 border-red-600 inline-block pb-1">Journal</h3>
                  <ul className="space-y-3 font-medium text-slate-600 ml-4 border-l-2 border-slate-100 pl-4">
                    <li><button onClick={() => setActiveTab('aims-scope')} className="hover:text-red-600 transition block text-left">Aims & Scope</button></li>
                    <li><button onClick={() => setActiveTab('editorial-board')} className="hover:text-red-600 transition block text-left">Editorial Board</button></li>
                    <li><button onClick={() => setActiveTab('policy-editorial-process')} className="hover:text-red-600 transition block text-left">Editorial Process & Peer Review</button></li>
                    
                    <li>
                      <span className="block text-slate-800 font-bold mb-2">Instructions</span>
                      <ul className="space-y-2 ml-4">
                        <li><button onClick={() => setActiveTab('instr-editors')} className="text-sm hover:text-red-600 transition block text-left">- Editors</button></li>
                        <li><button onClick={() => setActiveTab('instr-reviewers')} className="text-sm hover:text-red-600 transition block text-left">- Reviewers</button></li>
                        <li><button onClick={() => setActiveTab('instr-authors')} className="text-sm hover:text-red-600 transition block text-left">- Authors</button></li>
                      </ul>
                    </li>
                    
                    <li>
                      <span className="block text-slate-800 font-bold mb-2">Publications</span>
                      <ul className="space-y-2 ml-4">
                        <li><button onClick={() => setActiveTab('journal')} className="text-sm hover:text-red-600 transition block text-left">- 2025</button></li>
                        <li><button onClick={() => setActiveTab('journal')} className="text-sm hover:text-red-600 transition block text-left">- 2026</button></li>
                      </ul>
                    </li>

                    <li>
                      <span className="block text-slate-800 font-bold mb-2">Policies</span>
                      <ul className="space-y-2 ml-4">
                        <li><button onClick={() => setActiveTab('policy-open-access')} className="text-sm hover:text-red-600 transition block text-left">- Open Access</button></li>
                        <li><button onClick={() => setActiveTab('policy-copyright')} className="text-sm hover:text-red-600 transition block text-left">- Copyright Policy</button></li>
                        <li><button onClick={() => setActiveTab('policy-publication-ethics')} className="text-sm hover:text-red-600 transition block text-left">- Publication Ethics</button></li>
                        <li><button onClick={() => setActiveTab('policy-author-charges')} className="text-sm hover:text-red-600 transition block text-left">- Publication Charges</button></li>
                        <li><button onClick={() => setActiveTab('publisher-info')} className="text-sm hover:text-red-600 transition block text-left">- Publisher Information</button></li>
                      </ul>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <button onClick={() => setActiveTab('academic-activities')} className="text-2xl font-black text-blue-900 uppercase hover:text-red-600 transition block text-left">Pg Corner / Academic Activities</button>
                </div>
                
                <div>
                  <button onClick={() => setActiveTab('academy-notices')} className="text-2xl font-black text-blue-900 uppercase hover:text-red-600 transition block text-left">Announcements</button>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>



      <footer className="bg-slate-900 text-slate-500 py-24 px-4 mt-20">

        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">

          <div className="space-y-6">

            <h4 className="font-black text-2xl text-white tracking-tighter uppercase leading-none">TGAFM</h4>

            <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed mt-2">Advancing Forensic Medicine and Toxicology in Telangana Through Integrity, Scientific Rigor, and Scholarly Standards Since 2014.</p>

            <div className="mt-6 bg-white/5 p-4 rounded-2xl border border-white/10">

              <p className="text-[9px] font-black text-white uppercase tracking-wider mb-1">ISSN (Print)</p>

              <p className="text-sm font-black text-red-500">3107-7633</p>

            </div>

          </div>

          <div><h5 className="text-white font-black mb-10 text-[10px] uppercase tracking-widest">Academy</h5><ul className="space-y-4 text-[9px] font-black uppercase tracking-widest"><li className="hover:text-white cursor-pointer" onClick={() => setActiveTab('academy-about')}>About TGAFM</li><li className="hover:text-white cursor-pointer" onClick={() => setActiveTab('academy-present')}>Present Body</li><li className="hover:text-white cursor-pointer" onClick={() => setActiveTab('academy-past')}>Past Bodies</li><li className="hover:text-white cursor-pointer" onClick={() => setActiveTab('academy-members')}>Life Members</li><li className="hover:text-white cursor-pointer" onClick={() => setActiveTab('academic-activities')}>Academic Activities</li><li className="hover:text-white cursor-pointer" onClick={() => setActiveTab('academy-notices')}>Announcements</li><li className="hover:text-white cursor-pointer" onClick={() => setActiveTab('academy-registration')}>Registration</li></ul></div>

          <div><h5 className="text-white font-black mb-10 text-[10px] uppercase tracking-widest">Policies & Journal</h5><ul className="space-y-4 text-[9px] font-black uppercase tracking-widest"><li className="hover:text-white cursor-pointer" onClick={openJournalArchive}>Journal Archives</li><li className="hover:text-white cursor-pointer" onClick={() => setActiveTab('aims-scope')}>Aims & Scope</li><li className="hover:text-white cursor-pointer" onClick={() => setActiveTab('editorial-board')}>Editorial Board</li><li className="hover:text-white cursor-pointer" onClick={() => setActiveTab('policy-open-access')}>Open Access Policy</li><li className="hover:text-white cursor-pointer" onClick={() => setActiveTab('policy-publication-ethics')}>Publication Ethics</li><li className="hover:text-white cursor-pointer" onClick={() => setActiveTab('policy-author-charges')}>Author Charges</li><li className="hover:text-white cursor-pointer" onClick={() => setActiveTab('publisher-info')}>Publisher Info</li></ul></div>

          <div className="bg-white/5 p-10 rounded-[2.5rem] border border-white/10 text-xs text-slate-400">

            <p className="text-white font-black mb-4 uppercase tracking-widest text-[9px]">Secretariat</p>

            <p className="mb-4 text-slate-400 text-[10px] leading-relaxed">Department of Forensic Medicine,<br/>Osmania Medical College, Hyderabad.</p>

            <a href="mailto:tgafm.journal@gmail.com" className="text-red-500 font-bold flex items-center gap-2 hover:text-white transition uppercase text-[10px] mb-3"><Mail size={16}/> tgafm.journal@gmail.com</a>

            {/* <a href="mailto:editor@tafm.org" className="text-red-500 font-bold flex items-center gap-2 hover:text-white transition uppercase text-[10px]"><Mail size={16}/> editor@tafm.org</a> */}

          </div>

        </div>

        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 text-center text-[8px] font-black uppercase tracking-[0.5em] text-zinc-600">

          © 2026 Telangana Academy of Forensic Medicine | Built for Global Research Indexing

        </div>

      </footer>

    </div>

  );

};



export default App;