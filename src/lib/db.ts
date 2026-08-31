import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { 
  User, 
  SafeUser, 
  DocumentRecord, 
  PlagiarismReport, 
  SimilarityMatch, 
  SystemSettings,
  FullReportData
} from '@/types';

interface DatabaseSchema {
  users: User[];
  documents: DocumentRecord[];
  plagiarism_reports: PlagiarismReport[];
  similarity_matches: SimilarityMatch[];
  system_settings: SystemSettings;
}

import os from 'os';

const DEFAULT_SETTINGS: SystemSettings = {
  id: 'global-settings',
  ngram_size: 3,
  similarity_threshold_low: 15,
  similarity_threshold_moderate: 30,
  similarity_threshold_high: 50,
  min_passage_length: 20,
  exact_match_weight: 0.40,
  ngram_weight: 0.35,
  cosine_weight: 0.25,
  allow_student_delete: true,
  updated_at: new Date().toISOString(),
};

const DEFAULT_ACADEMIC_CORPUS = [
  {
    title: 'Distributed Consensus and Raft Protocol Analysis in Modern Microservices',
    author: 'Prof. A. Vance, Distributed Computing Review (2023)',
    text: `Distributed consensus algorithms form the bedrock of fault-tolerant replicated systems. The Raft consensus algorithm is designed to be more understandable than Paxos while providing equivalent fault tolerance and performance. Raft achieves consensus through an elected leader that manages the replicated log. When a leader fails or disconnects, a new leader is elected through randomized election timers. Raft decomposes consensus into three independent subproblems: leader election, log replication, and safety. Log entries flow only in one direction, from the leader to the followers. Follower nodes accept entries from the leader and acknowledge them. Once a majority of followers acknowledge an entry, the leader commits it and applies it to its state machine. State machine safety ensures that if a server has applied a particular log entry to its state machine, no other server will ever apply a different log entry for the same log index. Network partitions and Byzantine faults pose distinct challenges to distributed state machines. Raft guarantees safety under non-Byzantine network delays, partitions, packet loss, duplication, and reordering.`
  },
  {
    title: 'Comparative Study of Asymptotic Complexity in Graph Algorithms',
    author: 'Dr. E. Dijkstra & Dr. R. Tarjan, Journal of Algorithms (2022)',
    text: `Graph traversal and shortest path computation are fundamental problems in computer science. Dijkstra algorithm computes single-source shortest paths in weighted directed graphs with non-negative edge weights. By utilizing a min-priority heap or Fibonacci heap, Dijkstra achieves a time complexity of O(V log V + E). In contrast, the Bellman-Ford algorithm handles negative edge weights and detects negative cycles with a time complexity of O(V times E). For all-pairs shortest paths, the Floyd-Warshall dynamic programming algorithm operates in O(V cubed) time and O(V squared) auxiliary memory. Minimum spanning trees can be computed efficiently using Kruskal algorithm with a Disjoint Set Union (Union-Find) data structure in O(E log V) time, or Prim algorithm using an indexed binary heap. Topological sorting in Directed Acyclic Graphs (DAGs) relies on Kahn algorithm or Depth-First Search with an O(V + E) linear runtime complexity.`
  },
  {
    title: 'Memory Virtualization and Paging Architectures in Modern Operating Systems',
    author: 'Dept. of Computer Science, MIT Press Review (2021)',
    text: `Virtual memory provides an abstraction of physical storage, allowing each running process to operate within its own contiguous, private address space. Modern operating systems implement multilevel page tables to map virtual addresses to physical frame numbers. The Translation Lookaside Buffer (TLB) serves as a hardware cache for recent virtual-to-physical address translations, dramatically mitigating the performance overhead of multi-level page table walks. Page faults trigger hardware traps when a requested virtual page is not currently resident in physical RAM. The operating system kernel page fault handler reads the missing page from swap storage or disk into an available physical frame and updates the page table entry. Page replacement policies, such as Least Recently Used (LRU), Clock Algorithm, and Second-Chance, determine which resident page to evict under high memory pressure. Thrashing occurs when the collective working sets of active processes exceed physical RAM, causing the operating system to spend excessive CPU cycles servicing page faults rather than executing user instructions.`
  },
  {
    title: 'Deep Learning Optimization Techniques: Adam vs Stochastic Gradient Descent with Momentum',
    author: 'Stanford AI Lab Technical Notes (2024)',
    text: `Optimization of deep neural network architectures relies heavily on first-order gradient descent methods. Stochastic Gradient Descent (SGD) computes noisy parameter updates using small mini-batches of training examples. The addition of Polyak momentum accelerates gradient vectors in the relevant directions and dampens oscillations across steep ravines. Adam (Adaptive Moment Estimation) combines the benefits of AdaGrad and RMSProp by maintaining exponentially decaying averages of past gradients (first raw moment) as well as past squared gradients (second uncentered moment). Adam computes individual adaptive learning rates for distinct parameters. However, empirical studies demonstrate that while Adam converges faster during initial training epochs, well-tuned SGD with momentum frequently achieves superior generalization on unseen validation benchmarks. Weight decay regularization and cosine annealing learning rate schedules further enhance model generalization and prevent overfitting on complex datasets.`
  },
  {
    title: 'Principles of Object-Oriented Software Design and SOLID Architectural Patterns',
    author: 'Robert C. Martin & Software Engineering Institute (2020)',
    text: `Software maintainability, modularity, and extensibility are governed by fundamental design principles known as SOLID. The Single Responsibility Principle (SRP) dictates that a module, class, or function should have one, and only one, reason to change. The Open/Closed Principle (OCP) asserts that software entities should be open for extension but closed for modification. The Liskov Substitution Principle (LSP) requires that subclasses must be substitutable for their base types without altering program correctness. The Interface Segregation Principle (ISP) states that clients should not be forced to depend on interfaces they do not use. Finally, the Dependency Inversion Principle (DIP) states that high-level modules should not depend on low-level modules; both should depend on abstractions. Employing design patterns such as Factory Method, Strategy, Decorator, and Observer reduces coupling, facilitates automated unit testing, and promotes clean architectural separation of concerns.`
  },
  {
    title: 'Relational vs NoSQL Database Systems: CAP Theorem Tradeoffs in Web Architecture',
    author: 'ACM Transactions on Database Systems (2023)',
    text: `Modern data architectures require careful tradeoffs between consistency, availability, and partition tolerance as formulated by Brewer CAP theorem. Relational Database Management Systems (RDBMS) such as PostgreSQL and MySQL enforce strict ACID properties (Atomicity, Consistency, Isolation, Durability) using write-ahead logging (WAL) and multi-version concurrency control (MVCC). In contrast, distributed NoSQL databases, including MongoDB, Apache Cassandra, and DynamoDB, prioritize horizontal scalability and partition tolerance, adopting BASE semantics (Basically Available, Soft state, Eventual consistency). Key-value stores and document stores provide low-latency queries for denormalized datasets, whereas relational models excel at complex multi-table joins and transactional integrity. Polyglot persistence strategies combine relational and non-relational stores within a unified microservices ecosystem.`
  }
];

// Determine writable data directory (local 'data' if writable, otherwise OS tmpdir for Vercel / Lambda)
function resolveDataDir(): string {
  const localDataDir = path.join(process.cwd(), 'data');
  // If running on Vercel / AWS Lambda / read-only container
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.LAMBDA_TASK_ROOT || process.cwd().startsWith('/var/task')) {
    return path.join(os.tmpdir(), 'plagiarism_portal_data');
  }
  return localDataDir;
}

const DATA_DIR = resolveDataDir();
const DB_FILE = path.join(DATA_DIR, 'portal_database.json');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');

// Bundled static file path
const BUNDLED_DB_FILE = path.join(process.cwd(), 'data', 'portal_database.json');

// In-memory runtime database cache to guarantee uninterrupted operation
let memoryDb: DatabaseSchema | null = null;

function ensureDataDirectories() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }
  } catch (err) {
    // If mkdir fails due to read-only root, ensure tmp fallback
    try {
      const fallbackDir = path.join(os.tmpdir(), 'plagiarism_portal_data');
      if (!fs.existsSync(fallbackDir)) {
        fs.mkdirSync(fallbackDir, { recursive: true });
      }
    } catch (e) {
      // Memory DB will handle storage
    }
  }
}

function loadDatabase(): DatabaseSchema {
  if (memoryDb) {
    return memoryDb;
  }

  ensureDataDirectories();

  // Try loading from primary DB_FILE
  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      memoryDb = {
        users: parsed.users || [],
        documents: parsed.documents || [],
        plagiarism_reports: parsed.plagiarism_reports || [],
        similarity_matches: parsed.similarity_matches || [],
        system_settings: parsed.system_settings || DEFAULT_SETTINGS,
      };
      return memoryDb;
    } catch (err) {
      console.warn('Could not parse runtime database file:', err);
    }
  }

  // Try loading from bundled DB file
  if (fs.existsSync(BUNDLED_DB_FILE)) {
    try {
      const content = fs.readFileSync(BUNDLED_DB_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      memoryDb = {
        users: parsed.users || [],
        documents: parsed.documents || [],
        plagiarism_reports: parsed.plagiarism_reports || [],
        similarity_matches: parsed.similarity_matches || [],
        system_settings: parsed.system_settings || DEFAULT_SETTINGS,
      };
      return memoryDb;
    } catch (err) {
      console.warn('Could not parse bundled database file:', err);
    }
  }

  // Seed default database if not existing
  memoryDb = seedDatabase();
  return memoryDb;
}

function saveDatabase(data: DatabaseSchema): void {
  memoryDb = data;
  try {
    ensureDataDirectories();
    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    // Ignore disk write errors in read-only serverless runtimes
  }
}

function seedDatabase(): DatabaseSchema {
  ensureDataDirectories();
  const salt = bcrypt.genSaltSync(10);
  const studentPasswordHash = bcrypt.hashSync('password123', salt);
  const adminPasswordHash = bcrypt.hashSync('admin123', salt);

  const studentUser: User = {
    id: 'usr-student-tathagata',
    name: 'Tathagata Chakraborty',
    email: 'student@portal.edu',
    password_hash: studentPasswordHash,
    role: 'student',
    roll_number: 'UG/SOET/30/24/144',
    section: 'G',
    program: 'B.Tech CSE',
    created_at: new Date('2026-08-01T09:00:00Z').toISOString(),
    updated_at: new Date('2026-08-01T09:00:00Z').toISOString(),
  };

  const adminUser: User = {
    id: 'usr-admin-portal',
    name: 'System Administrator',
    email: 'admin@portal.edu',
    password_hash: adminPasswordHash,
    role: 'admin',
    roll_number: 'ADMIN/001',
    section: 'STAFF',
    program: 'Faculty of Engineering',
    created_at: new Date('2026-08-01T09:00:00Z').toISOString(),
    updated_at: new Date('2026-08-01T09:00:00Z').toISOString(),
  };

  // Seed academic reference documents into the corpus
  const corpusDocuments: DocumentRecord[] = DEFAULT_ACADEMIC_CORPUS.map((doc, idx) => {
    const words = doc.text.trim().split(/\s+/).filter(Boolean);
    const sentences = doc.text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    return {
      id: `corpus-doc-${idx + 1}`,
      user_id: 'usr-admin-portal',
      title: doc.title,
      filename: `corpus_ref_${idx + 1}.txt`,
      file_path: `corpus://ref-${idx + 1}`,
      file_type: 'txt',
      file_size: Buffer.byteLength(doc.text, 'utf-8'),
      extracted_text: doc.text,
      word_count: words.length,
      char_count: doc.text.length,
      sentence_count: sentences.length,
      is_corpus_item: true,
      author_name: doc.author,
      created_at: new Date('2026-08-01T10:00:00Z').toISOString(),
      updated_at: new Date('2026-08-01T10:00:00Z').toISOString(),
    };
  });

  const schema: DatabaseSchema = {
    users: [studentUser, adminUser],
    documents: [...corpusDocuments],
    plagiarism_reports: [],
    similarity_matches: [],
    system_settings: DEFAULT_SETTINGS,
  };

  saveDatabase(schema);
  return schema;
}

export const db = {
  // Users
  getUsers: (): User[] => {
    return loadDatabase().users;
  },

  getUserById: (id: string): User | undefined => {
    const dbData = loadDatabase();
    return dbData.users.find(u => u.id === id);
  },

  getUserByEmail: (email: string): User | undefined => {
    const dbData = loadDatabase();
    return dbData.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  createUser: (userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): User => {
    const dbData = loadDatabase();
    const newUser: User = {
      ...userData,
      id: `usr-${crypto.randomUUID()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    dbData.users.push(newUser);
    saveDatabase(dbData);
    return newUser;
  },

  updateUser: (id: string, updates: Partial<Omit<User, 'id' | 'created_at'>>): User | null => {
    const dbData = loadDatabase();
    const index = dbData.users.findIndex(u => u.id === id);
    if (index === -1) return null;
    dbData.users[index] = {
      ...dbData.users[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    saveDatabase(dbData);
    return dbData.users[index];
  },

  deleteUser: (id: string): boolean => {
    const dbData = loadDatabase();
    const prevLen = dbData.users.length;
    dbData.users = dbData.users.filter(u => u.id !== id);
    if (dbData.users.length !== prevLen) {
      saveDatabase(dbData);
      return true;
    }
    return false;
  },

  // Documents
  getDocuments: (filter?: { userId?: string; isCorpus?: boolean }): DocumentRecord[] => {
    const dbData = loadDatabase();
    return dbData.documents.filter(doc => {
      if (filter?.userId && doc.user_id !== filter.userId) return false;
      if (filter?.isCorpus !== undefined && doc.is_corpus_item !== filter.isCorpus) return false;
      return true;
    });
  },

  getDocumentById: (id: string): DocumentRecord | undefined => {
    const dbData = loadDatabase();
    return dbData.documents.find(d => d.id === id);
  },

  createDocument: (docData: Omit<DocumentRecord, 'id' | 'created_at' | 'updated_at'>): DocumentRecord => {
    const dbData = loadDatabase();
    const newDoc: DocumentRecord = {
      ...docData,
      id: `doc-${crypto.randomUUID()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    dbData.documents.push(newDoc);
    saveDatabase(dbData);
    return newDoc;
  },

  deleteDocument: (id: string): boolean => {
    const dbData = loadDatabase();
    const doc = dbData.documents.find(d => d.id === id);
    if (!doc) return false;

    // Delete associated reports and matches
    const reportsToDelete = dbData.plagiarism_reports.filter(r => r.document_id === id).map(r => r.id);
    dbData.similarity_matches = dbData.similarity_matches.filter(m => !reportsToDelete.includes(m.report_id));
    dbData.plagiarism_reports = dbData.plagiarism_reports.filter(r => r.document_id !== id);
    dbData.documents = dbData.documents.filter(d => d.id !== id);

    // If local file exists, remove it
    if (doc.file_path && !doc.file_path.startsWith('corpus://') && fs.existsSync(doc.file_path)) {
      try {
        fs.unlinkSync(doc.file_path);
      } catch (e) {
        console.warn('Failed to delete physical file:', e);
      }
    }

    saveDatabase(dbData);
    return true;
  },

  // Reports
  getReports: (): PlagiarismReport[] => {
    return loadDatabase().plagiarism_reports;
  },

  getReportById: (id: string): PlagiarismReport | undefined => {
    const dbData = loadDatabase();
    return dbData.plagiarism_reports.find(r => r.id === id);
  },

  getReportByDocumentId: (documentId: string): PlagiarismReport | undefined => {
    const dbData = loadDatabase();
    return dbData.plagiarism_reports.find(r => r.document_id === documentId);
  },

  createReport: (reportData: Omit<PlagiarismReport, 'id' | 'created_at'>): PlagiarismReport => {
    const dbData = loadDatabase();
    const newReport: PlagiarismReport = {
      ...reportData,
      id: `rep-${crypto.randomUUID()}`,
      created_at: new Date().toISOString(),
    };
    dbData.plagiarism_reports.push(newReport);
    saveDatabase(dbData);
    return newReport;
  },

  deleteReport: (id: string): boolean => {
    const dbData = loadDatabase();
    dbData.similarity_matches = dbData.similarity_matches.filter(m => m.report_id !== id);
    dbData.plagiarism_reports = dbData.plagiarism_reports.filter(r => r.id !== id);
    saveDatabase(dbData);
    return true;
  },

  // Similarity Matches
  getMatchesByReportId: (reportId: string): SimilarityMatch[] => {
    const dbData = loadDatabase();
    return dbData.similarity_matches.filter(m => m.report_id === reportId);
  },

  createMatches: (matches: Omit<SimilarityMatch, 'id' | 'created_at'>[]): SimilarityMatch[] => {
    const dbData = loadDatabase();
    const createdMatches: SimilarityMatch[] = matches.map(m => ({
      ...m,
      id: `match-${crypto.randomUUID()}`,
      created_at: new Date().toISOString(),
    }));
    dbData.similarity_matches.push(...createdMatches);
    saveDatabase(dbData);
    return createdMatches;
  },

  // Settings
  getSettings: (): SystemSettings => {
    return loadDatabase().system_settings || DEFAULT_SETTINGS;
  },

  updateSettings: (settings: Partial<SystemSettings>): SystemSettings => {
    const dbData = loadDatabase();
    dbData.system_settings = {
      ...dbData.system_settings,
      ...settings,
      updated_at: new Date().toISOString(),
    };
    saveDatabase(dbData);
    return dbData.system_settings;
  },

  // Full aggregate retrieval for reports
  getFullReportData: (reportId: string): FullReportData | null => {
    const dbData = loadDatabase();
    const report = dbData.plagiarism_reports.find(r => r.id === reportId);
    if (!report) return null;

    const document = dbData.documents.find(d => d.id === report.document_id);
    if (!document) return null;

    const student = dbData.users.find(u => u.id === document.user_id);
    if (!student) return null;

    const matches = dbData.similarity_matches.filter(m => m.report_id === report.id);

    // Group matches by source
    const sourceMap = new Map<string, {
      source_document_id: string;
      source_title: string;
      source_author: string;
      source_type: string;
      totalSimilarity: number;
      match_count: number;
    }>();

    for (const match of matches) {
      const existing = sourceMap.get(match.source_document_id);
      if (existing) {
        existing.totalSimilarity += match.similarity_percentage;
        existing.match_count += 1;
      } else {
        sourceMap.set(match.source_document_id, {
          source_document_id: match.source_document_id,
          source_title: match.source_title,
          source_author: match.source_author,
          source_type: match.source_type,
          totalSimilarity: match.similarity_percentage,
          match_count: 1,
        });
      }
    }

    const sourcesSummary = Array.from(sourceMap.values()).map(s => ({
      source_document_id: s.source_document_id,
      source_title: s.source_title,
      source_author: s.source_author,
      source_type: s.source_type,
      matched_percentage: Math.min(100, Math.round((s.totalSimilarity / Math.max(1, s.match_count)) * 10) / 10),
      match_count: s.match_count,
    })).sort((a, b) => b.matched_percentage - a.matched_percentage);

    const safeStudent: SafeUser = {
      id: student.id,
      name: student.name,
      email: student.email,
      role: student.role,
      roll_number: student.roll_number,
      section: student.section,
      program: student.program,
      created_at: student.created_at,
      updated_at: student.updated_at,
    };

    return {
      report,
      document,
      student: safeStudent,
      matches,
      sourcesSummary,
    };
  }
};
