import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const guidePath = path.join(__dirname, '..', 'Rupaiya_101_Complete_Guide.md');
const dbOutputPath = path.join(__dirname, '..', 'src', 'data', 'rupaiya_guide_db.json');

function parseGuide() {
  console.log(`Reading guide from: ${guidePath}`);
  const content = fs.readFileSync(guidePath, 'utf-8');
  
  const db = {
    meta: {
      title: "Rupaiya 101: Complete Financial Literacy Guide",
      version: "2025-26 Edition",
      totalModules: 11
    },
    modules: []
  };

  // Split by MODULE sections
  const moduleSections = content.split(/# MODULE /gi);
  // The first section might be intro/Table of Contents before any "# MODULE" header
  
  let moduleCount = 0;

  for (let i = 1; i < moduleSections.length; i++) {
    const section = moduleSections[i];
    const lines = section.split('\n');
    const firstLine = lines[0].trim();
    
    // Header format: "1: PAISE KI BASIC SAMAJH (FOUNDATION)"
    const headerMatch = firstLine.match(/^(\d+)[\s:]+(.*)$/);
    if (!headerMatch) continue;
    
    const moduleId = parseInt(headerMatch[1], 10);
    const moduleTitle = headerMatch[2].replace(/[()]/g, '').trim();
    
    const moduleObj = {
      id: moduleId,
      title: moduleTitle,
      description: "",
      topics: [],
      mistakes: [],
      takeaways: [],
      misconceptions: []
    };

    // Reconstruct raw content for processing
    const rawSectionContent = lines.slice(1).join('\n');
    
    // Split into sub-sections by "##"
    const subSections = rawSectionContent.split(/\n## /g);
    
    // The first sub-section might contain general module description before any "##" topic
    if (subSections[0] && subSections[0].trim()) {
      moduleObj.description = subSections[0].trim();
    }

    for (let j = 0; j < subSections.length; j++) {
      const subSection = subSections[j];
      const subLines = subSection.split('\n');
      const subHeader = subLines[0].trim();
      const subBody = subLines.slice(1).join('\n');
      
      // Check if it's a topic, like: "1.1 Money Kya Hai —"
      const topicMatch = subHeader.match(/^(\d+\.\d+)[\s:]+(.*?)(?:—|$)/);
      if (topicMatch) {
        const topicId = topicMatch[1];
        const topicTitle = topicMatch[2].trim();
        
        // Parse tables from topic body
        const tables = [];
        const tableRegex = /\|[^\n]+\|\n\|[ \t]*:?---+:?[ \t]*\|[^\n]*\n(?:\|[^\n]+\|\n)*/g;
        let match;
        while ((match = tableRegex.exec(subBody)) !== null) {
          const tableStr = match[0];
          const tableLines = tableStr.trim().split('\n');
          if (tableLines.length >= 2) {
            const headers = tableLines[0].split('|').map(h => h.trim()).filter(h => h);
            const rows = tableLines.slice(2).map(r => r.split('|').map(col => col.trim()).filter((_, colIndex) => colIndex > 0 && colIndex <= headers.length));
            tables.push({
              raw: tableStr,
              headers,
              rows
            });
          }
        }

        moduleObj.topics.push({
          id: topicId,
          title: topicTitle,
          content: subBody.trim(),
          tables: tables
        });
      } else {
        // Check for special sections like mistakes, takeaways, misconceptions
        const upperHeader = subHeader.toUpperCase();
        if (upperHeader.includes('YAHAN PE LOG GALTI KARTE HAIN')) {
          moduleObj.mistakes = subLines.slice(1).map(l => l.trim()).filter(l => l && l.match(/^\d+\./));
        } else if (upperHeader.includes('KEY TAKEAWAYS')) {
          moduleObj.takeaways = subLines.slice(1).map(l => l.trim()).filter(l => l && l.match(/^\d+\./));
        } else if (upperHeader.includes('COMMON MISCONCEPTIONS')) {
          moduleObj.misconceptions = subLines.slice(1).map(l => l.trim()).filter(l => l && l.match(/^\d+\./));
        }
      }
    }

    db.modules.push(moduleObj);
    moduleCount++;
  }

  console.log(`Parsed ${moduleCount} modules successfully.`);
  fs.writeFileSync(dbOutputPath, JSON.stringify(db, null, 2), 'utf-8');
  console.log(`Database saved to: ${dbOutputPath}`);
}

try {
  parseGuide();
} catch (error) {
  console.error("Error parsing guide:", error);
  process.exit(1);
}
