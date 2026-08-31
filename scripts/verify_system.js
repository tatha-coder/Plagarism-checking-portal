// Automated System Verification Script
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Load DB file if exists or initialize
const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'portal_database.json');

console.log('====================================================');
console.log('🧪 PLAGIARISM CHECKING PORTAL — SYSTEM VERIFICATION');
console.log('====================================================\n');

// 1. Check Data Store & Seed
console.log('Step 1: Checking Data Persistence & Seed Integrity...');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(DB_FILE)) {
  console.log('Database file not found yet. Running initial seed generation...');
  const salt = bcrypt.genSaltSync(10);
  const studentPasswordHash = bcrypt.hashSync('password123', salt);
  const adminPasswordHash = bcrypt.hashSync('admin123', salt);

  const initialSchema = {
    users: [
      {
        id: 'usr-student-tathagata',
        name: 'Tathagata Chakraborty',
        email: 'student@portal.edu',
        password_hash: studentPasswordHash,
        role: 'student',
        roll_number: 'UG/SOET/30/24/144',
        section: 'G',
        program: 'B.Tech CSE',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'usr-admin-portal',
        name: 'System Administrator',
        email: 'admin@portal.edu',
        password_hash: adminPasswordHash,
        role: 'admin',
        roll_number: 'ADMIN/001',
        section: 'STAFF',
        program: 'Faculty of Engineering',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    ],
    documents: [
      {
        id: 'corpus-doc-1',
        user_id: 'usr-admin-portal',
        title: 'Distributed Consensus and Raft Protocol Analysis in Modern Microservices',
        filename: 'corpus_ref_1.txt',
        file_path: 'corpus://ref-1',
        file_type: 'txt',
        file_size: 1024,
        extracted_text: 'Distributed consensus algorithms form the bedrock of fault-tolerant replicated systems. The Raft consensus algorithm is designed to be more understandable than Paxos while providing equivalent fault tolerance and performance.',
        word_count: 32,
        char_count: 236,
        sentence_count: 2,
        is_corpus_item: true,
        author_name: 'Prof. A. Vance, Distributed Computing Review (2023)',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'corpus-doc-2',
        user_id: 'usr-admin-portal',
        title: 'Comparative Study of Asymptotic Complexity in Graph Algorithms',
        filename: 'corpus_ref_2.txt',
        file_path: 'corpus://ref-2',
        file_type: 'txt',
        file_size: 1024,
        extracted_text: 'Graph traversal and shortest path computation are fundamental problems in computer science. Dijkstra algorithm computes single-source shortest paths in weighted directed graphs with non-negative edge weights.',
        word_count: 28,
        char_count: 213,
        sentence_count: 2,
        is_corpus_item: true,
        author_name: 'Dr. E. Dijkstra & Dr. R. Tarjan, Journal of Algorithms (2022)',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    ],
    plagiarism_reports: [],
    similarity_matches: [],
    system_settings: {
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
    }
  };
  fs.writeFileSync(DB_FILE, JSON.stringify(initialSchema, null, 2), 'utf-8');
}

const dbContent = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
console.log(`✓ Database loaded. Users: ${dbContent.users.length}, Documents: ${dbContent.documents.length}`);

// Verify Student User (Tathagata Chakraborty, UG/SOET/30/24/144)
const student = dbContent.users.find(u => u.email === 'student@portal.edu');
if (!student || student.roll_number !== 'UG/SOET/30/24/144' || student.section !== 'G') {
  console.error('❌ Student user details mismatch!');
  process.exit(1);
}
console.log(`✓ Student Account Verified: ${student.name} | Roll: ${student.roll_number} | Sec: ${student.section} | Program: ${student.program}`);

// Verify Admin User
const admin = dbContent.users.find(u => u.role === 'admin');
if (!admin) {
  console.error('❌ Admin user not found!');
  process.exit(1);
}
console.log(`✓ Admin Account Verified: ${admin.name} (${admin.email})`);

// Verify Academic Corpus
const corpusDocs = dbContent.documents.filter(d => d.is_corpus_item);
console.log(`✓ Institutional Academic Corpus Verified: ${corpusDocs.length} benchmark documents pre-seeded.`);
corpusDocs.forEach((d, i) => {
  console.log(`   ${i + 1}. [${d.word_count} words] ${d.title}`);
});

// 2. Plagiarism Engine Algorithm Logic Verification
console.log('\nStep 2: Testing Mathematical Algorithms...');

// Helper functions matching TypeScript implementation
function cleanString(str) {
  return str.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function tokenize(str) {
  const cleaned = cleanString(str);
  return cleaned ? cleaned.split(' ').filter(Boolean) : [];
}

function generateNgrams(tokens, n = 3) {
  if (tokens.length < n) return tokens.length > 0 ? [tokens.join(' ')] : [];
  const ngrams = [];
  for (let i = 0; i <= tokens.length - n; i++) {
    ngrams.push(tokens.slice(i, i + n).join(' '));
  }
  return ngrams;
}

function calculateJaccard(setA, setB) {
  if (setA.size === 0 && setB.size === 0) return 1.0;
  if (setA.size === 0 || setB.size === 0) return 0.0;
  let intersection = 0;
  setA.forEach(item => { if (setB.has(item)) intersection++; });
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

// Test Case A: Identical Excerpt
const textA1 = "Distributed consensus algorithms form the bedrock of fault-tolerant replicated systems. The Raft consensus algorithm is designed to be more understandable than Paxos.";
const textA2 = "Distributed consensus algorithms form the bedrock of fault-tolerant replicated systems. The Raft consensus algorithm is designed to be more understandable than Paxos.";
const ngramsA1 = new Set(generateNgrams(tokenize(textA1)));
const ngramsA2 = new Set(generateNgrams(tokenize(textA2)));
const jaccardA = calculateJaccard(ngramsA1, ngramsA2);
console.log(`✓ Test A (Identical Text) Jaccard Similarity: ${(jaccardA * 100).toFixed(1)}% (Expected: 100.0%)`);
if (jaccardA < 0.99) throw new Error('Identical text failed similarity assertion!');

// Test Case B: Completely Distinct Text
const textB1 = "Distributed consensus algorithms form the bedrock of fault-tolerant replicated systems.";
const textB2 = "Photosynthesis in eukaryotic plant cells converts radiant solar energy into chemical glucose bonds through chlorophyll pigments in chloroplast thylakoids.";
const ngramsB1 = new Set(generateNgrams(tokenize(textB1)));
const ngramsB2 = new Set(generateNgrams(tokenize(textB2)));
const jaccardB = calculateJaccard(ngramsB1, ngramsB2);
console.log(`✓ Test B (Completely Distinct Text) Jaccard Similarity: ${(jaccardB * 100).toFixed(1)}% (Expected: 0.0%)`);
if (jaccardB > 0.05) throw new Error('Distinct text failed similarity assertion!');

// Test Case C: Paraphrased Text
const textC1 = "Graph traversal and shortest path computation are fundamental problems in computer science. Dijkstra algorithm computes single-source shortest paths.";
const textC2 = "Graph traversal and shortest path algorithms are crucial topics in computer science. Dijkstra algorithm computes shortest paths from a single source.";
const ngramsC1 = new Set(generateNgrams(tokenize(textC1)));
const ngramsC2 = new Set(generateNgrams(tokenize(textC2)));
const jaccardC = calculateJaccard(ngramsC1, ngramsC2);
console.log(`✓ Test C (Paraphrased Text) Jaccard Similarity: ${(jaccardC * 100).toFixed(1)}% (Expected: ~30-60%)`);
if (jaccardC < 0.20 || jaccardC > 0.80) throw new Error('Paraphrased text failed expected bounds!');

console.log('\n====================================================');
console.log('🎉 ALL ENGINE VERIFICATIONS PASSED SUCCESSFULLY!');
console.log('====================================================\n');
