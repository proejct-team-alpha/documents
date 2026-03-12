const JSZip = require('jszip');
const fs = require('fs');
const path = require('path');

const PPTX_PATH = path.join(__dirname, '..', '08_스토리보드', '🏥_병원_예약_&_내부_업무_시스템_—_스토리보드.pptx');

async function main() {
  const data = fs.readFileSync(PPTX_PATH);
  const zip = await JSZip.loadAsync(data);

  // =========================================================
  // 1. Compare background colors: slide 57 (admin) vs 61 (new, from template 41)
  // =========================================================
  console.log('=== BACKGROUND COLOR COMPARISON ===\n');
  for (const num of [57, 41, 61]) {
    const xml = await zip.file(`ppt/slides/slide${num}.xml`).async('string');
    const shapeRegex = /<p:sp>[\s\S]*?<\/p:sp>/g;
    let m;
    const shapes = [];
    while ((m = shapeRegex.exec(xml)) !== null) {
      const shape = m[0];
      const nameMatch = shape.match(/name="([^"]+)"/);
      const idMatch = shape.match(/<p:cNvPr id="(\d+)"/);
      const xMatch = shape.match(/<a:off x="(\d+)" y="(\d+)"\/>/);
      const extMatch = shape.match(/<a:ext cx="(\d+)" cy="(\d+)"\/>/);
      const fills = (shape.match(/<a:srgbClr val="([^"]+)"\/>/g) || []).map(f => f.match(/val="([^"]+)"/)[1]);
      shapes.push({
        name: nameMatch ? nameMatch[1] : '?',
        id: idMatch ? idMatch[1] : '?',
        x: xMatch ? xMatch[1] : '?',
        y: xMatch ? xMatch[2] : '?',
        cx: extMatch ? extMatch[1] : '?',
        cy: extMatch ? extMatch[2] : '?',
        fills,
        order: m.index
      });
    }

    console.log(`--- Slide ${num}: First 25 shapes (with fills) ---`);
    shapes.slice(0, 25).forEach((s, i) => {
      if (s.fills.length > 0) {
        console.log(`  [${i}] id=${s.id} "${s.name}" x=${s.x} y=${s.y} cx=${s.cx} cy=${s.cy} fills=[${s.fills}]`);
      }
    });
    console.log('');
  }

  // =========================================================
  // 2. Check slide 41 button positions around header area
  // =========================================================
  console.log('=== SLIDE 41: BUTTON POSITION CHECK ===\n');
  const xml41 = await zip.file('ppt/slides/slide41.xml').async('string');
  const shapeRegex = /<p:sp>[\s\S]*?<\/p:sp>/g;
  let m;
  while ((m = shapeRegex.exec(xml41)) !== null) {
    const shape = m[0];
    const textM = shape.match(/<a:t>([^<]*)<\/a:t>/g);
    if (textM) {
      const texts = textM.map(t => t.replace(/<\/?a:t>/g, ''));
      const combined = texts.join(' ');
      if (combined.includes('로그아웃') || combined.includes('카테고리 등록') || combined.includes('김담당') || combined.includes('○○병원')) {
        const xMatch = shape.match(/<a:off x="(\d+)" y="(\d+)"\/>/);
        const extMatch = shape.match(/<a:ext cx="(\d+)" cy="(\d+)"\/>/);
        const nameMatch = shape.match(/name="([^"]+)"/);
        console.log(`  "${nameMatch ? nameMatch[1] : '?'}" x=${xMatch ? xMatch[1] : '?'} y=${xMatch ? xMatch[2] : '?'} cx=${extMatch ? extMatch[1] : '?'} cy=${extMatch ? extMatch[2] : '?'} text=[${combined}]`);
      }
    }
  }

  // =========================================================
  // 3. Z-order analysis for slide 61
  // =========================================================
  console.log('\n=== SLIDE 61: SHAPE ORDER (z-order) ===\n');
  const xml61 = await zip.file('ppt/slides/slide61.xml').async('string');
  const regex2 = /<p:sp>[\s\S]*?<\/p:sp>/g;
  let zOrder = 0;
  while ((m = regex2.exec(xml61)) !== null) {
    const shape = m[0];
    const nameMatch = shape.match(/name="([^"]+)"/);
    const name = nameMatch ? nameMatch[1] : '?';
    const textM = shape.match(/<a:t>([^<]*)<\/a:t>/);
    const text = textM ? textM[1].substring(0, 30) : '';
    const xMatch = shape.match(/<a:off x="(\d+)" y="(\d+)"\/>/);
    // Only show relevant shapes
    if (name.startsWith('SB') || name === 'Shape 0' || name === 'Shape 31' || name === 'Text 32' || zOrder < 5 || text.includes('○○병원') || text.includes('로그아웃') || text.includes('관리자')) {
      console.log(`  z=${zOrder} "${name}" x=${xMatch ? xMatch[1] : '?'} y=${xMatch ? xMatch[2] : '?'} text=[${text}]`);
    }
    zOrder++;
  }
}

main().catch(console.error);
