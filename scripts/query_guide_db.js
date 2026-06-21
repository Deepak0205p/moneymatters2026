import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '..', 'src', 'data', 'rupaiya_guide_db.json');

if (!fs.existsSync(dbPath)) {
  console.error("Database file not found. Please run build_guide_db.js first.");
  process.exit(1);
}

const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

const args = process.argv.slice(2);
const command = args[0];
const param = args.slice(1).join(' ');

if (!command) {
  printHelp();
  process.exit(0);
}

switch (command.toLowerCase()) {
  case 'help':
    printHelp();
    break;
  case 'module':
    getModule(param);
    break;
  case 'search':
    searchDb(param);
    break;
  case 'table':
    findTables(param);
    break;
  case 'checklists':
    getChecklists();
    break;
  default:
    console.log(`Unknown command: ${command}`);
    printHelp();
}

function printHelp() {
  console.log(`
Rupaiya 101 Local Database Query Utility
========================================
Usage:
  node scripts/query_guide_db.js module <id_or_title>  - View details of a specific module
  node scripts/query_guide_db.js search <keyword>      - Search across all modules, topics, text, and tables
  node scripts/query_guide_db.js table <keyword>       - Search for data tables containing keyword
  node scripts/query_guide_db.js checklists            - Get age checklists
  node scripts/query_guide_db.js help                  - Show this help message
`);
}

function getModule(query) {
  const moduleId = parseInt(query, 10);
  const found = db.modules.find(m => m.id === moduleId || m.title.toLowerCase().includes(query.toLowerCase()));
  if (!found) {
    console.log(`Module not found for query: ${query}`);
    return;
  }
  
  console.log(`\n==================================================`);
  console.log(`MODULE ${found.id}: ${found.title}`);
  console.log(`==================================================`);
  console.log(`Description:\n${found.description.substring(0, 300)}...\n`);
  
  console.log(`Topics:`);
  found.topics.forEach(t => {
    console.log(`  - [${t.id}] ${t.title}`);
  });
  
  if (found.mistakes.length > 0) {
    console.log(`\nCommon Mistakes:`);
    found.mistakes.slice(0, 3).forEach(m => console.log(`  ${m}`));
    if (found.mistakes.length > 3) console.log(`  ... and ${found.mistakes.length - 3} more`);
  }
}

function searchDb(query) {
  if (!query) {
    console.log("Please specify a search term.");
    return;
  }
  console.log(`Searching for: "${query}"...\n`);
  let resultsCount = 0;
  
  db.modules.forEach(m => {
    // Search in module title
    if (m.title.toLowerCase().includes(query.toLowerCase())) {
      console.log(`[Module Match] MODULE ${m.id}: ${m.title}`);
      resultsCount++;
    }
    
    // Search in topics
    m.topics.forEach(t => {
      if (t.title.toLowerCase().includes(query.toLowerCase()) || t.content.toLowerCase().includes(query.toLowerCase())) {
        console.log(`[Topic Match] Topic ${t.id}: ${t.title} (Module ${m.id})`);
        const idx = t.content.toLowerCase().indexOf(query.toLowerCase());
        const context = t.content.substring(Math.max(0, idx - 40), Math.min(t.content.length, idx + 100));
        console.log(`  Context: "...${context.replace(/\n/g, ' ').trim()}..."`);
        resultsCount++;
      }
    });
  });
  
  console.log(`\nFound ${resultsCount} matching entries.`);
}

function findTables(query) {
  console.log(`Searching for tables containing: "${query}"...\n`);
  let tablesCount = 0;
  
  db.modules.forEach(m => {
    m.topics.forEach(t => {
      t.tables.forEach((tbl, index) => {
        const tableContentStr = tbl.headers.join(' ') + ' ' + tbl.rows.map(r => r.join(' ')).join(' ');
        if (!query || tableContentStr.toLowerCase().includes(query.toLowerCase())) {
          console.log(`[Table Match] Table found in Topic ${t.id}: ${t.title} (Module ${m.id})`);
          console.log(`Headers: ${tbl.headers.join(' | ')}`);
          tbl.rows.slice(0, 5).forEach(r => console.log(`Row: ${r.join(' | ')}`));
          if (tbl.rows.length > 5) console.log(`... and ${tbl.rows.length - 5} more rows`);
          console.log();
          tablesCount++;
        }
      });
    });
  });
  console.log(`Found ${tablesCount} tables.`);
}

function getChecklists() {
  console.log("\n==================================================");
  console.log("Financial Checklist by Life Stage (Module 11)");
  console.log("==================================================");
  
  const mod11 = db.modules.find(m => m.id === 11);
  if (!mod11) {
    console.log("Module 11 not found in database.");
    return;
  }
  
  const checklistTopic = mod11.topics.find(t => t.title.toLowerCase().includes("checklist"));
  if (checklistTopic) {
    console.log(checklistTopic.content);
  } else {
    console.log("Checklist topic not found.");
  }
}
