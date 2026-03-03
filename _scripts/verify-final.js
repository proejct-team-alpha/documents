const JSZip = require('jszip');
const fs = require('fs');
const path = require('path');

const PPTX_PATH = path.join(__dirname, '..', '08_스토리보드', '🏥_병원_예약_&_내부_업무_시스템_—_스토리보드.pptx');

async function main() {
  const data = fs.readFileSync(PPTX_PATH);
  const zip = await JSZip.loadAsync(data);

  console.log('=== COMPARISON: Slide 57 (Admin reference) vs Slides 61-63 (New) ===\n');

  // Check slide 57 sidebar
  for (const num of [57, 61, 62, 63]) {
    const xml = await zip.file(`ppt/slides/slide${num}.xml`).async('string');
    const shapeRegex = /<p:sp>[\s\S]*?<\/p:sp>/g;
    let m;
    const sidebarItems = [];
    while ((m = shapeRegex.exec(xml)) !== null) {
      const shape = m[0];
      const xMatch = shape.match(/<a:off x="(\d+)" y="(\d+)"\/>/);
      const x = xMatch ? parseInt(xMatch[1]) : 0;
      const y = xMatch ? parseInt(xMatch[2]) : 0;
      if (x < 1050000 && y >= 2139696 && y <= 4700000) {
        const textM = shape.match(/<a:t>([^<]*)<\/a:t>/);
        const fillM = shape.match(/<a:srgbClr val="([^"]+)"\/>/g);
        const fills = fillM ? fillM.map(f => f.match(/val="([^"]+)"/)[1]) : [];
        const isHighlight = fills.includes('991B1B') || fills.includes('6D28D9');
        const isBg = fills.includes('1E293B');
        const isWhite = fills.includes('FFFFFF');

        let type = 'menu';
        if (isBg) type = 'BG';
        if (isHighlight) type = 'HIGHLIGHT';

        if (textM) {
          const text = textM[1];
          sidebarItems.push({ y, text, type: isWhite ? 'ACTIVE' : 'normal', fills });
        } else if (type === 'BG' || type === 'HIGHLIGHT') {
          const cyM = shape.match(/<a:ext cx="\d+" cy="(\d+)"\/>/);
          sidebarItems.push({ y, text: `[${type}]`, type, cy: cyM ? cyM[1] : '?' });
        }
      }
    }

    sidebarItems.sort((a, b) => a.y - b.y);
    console.log(`--- Slide ${num} sidebar ---`);
    sidebarItems.forEach(item => {
      const extra = item.cy ? ` cy=${item.cy}` : '';
      const marker = item.type === 'ACTIVE' ? ' ★' : '';
      console.log(`  y=${item.y} ${item.text}${marker}${extra}`);
    });
    console.log('');
  }

  // Final text check for all modified slides
  console.log('=== KEY TEXT VERIFICATION ===\n');
  for (const num of [34, 41, 42, 43, 45, 61, 62, 63]) {
    const xml = await zip.file(`ppt/slides/slide${num}.xml`).async('string');
    const textMatches = xml.match(/<a:t>([^<]*)<\/a:t>/g) || [];
    const texts = textMatches.map(t => t.replace(/<\/?a:t>/g, ''));
    const key = texts.slice(0, 3).join(' | ');
    console.log(`Slide ${num}: ${key}`);
  }

  // Total slide count
  const slideFiles = Object.keys(zip.files).filter(f => f.match(/^ppt\/slides\/slide\d+\.xml$/));
  console.log('\nTotal slide files:', slideFiles.length);
}

main().catch(console.error);
