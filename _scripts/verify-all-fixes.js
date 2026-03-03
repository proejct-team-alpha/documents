const JSZip = require('jszip');
const fs = require('fs');
const path = require('path');
const PPTX_PATH = path.join(__dirname, '..', '08_스토리보드', '🏥_병원_예약_&_내부_업무_시스템_—_스토리보드.pptx');

async function main() {
  const data = fs.readFileSync(PPTX_PATH);
  const zip = await JSZip.loadAsync(data);

  // =========================================================
  // 1. Slide 41: button position check
  // =========================================================
  console.log('=== FIX 1: Slide 41 button position ===');
  const xml41 = await zip.file('ppt/slides/slide41.xml').async('string');
  const re = /<p:sp>[\s\S]*?<\/p:sp>/g;
  let m;
  while ((m = re.exec(xml41)) !== null) {
    const s = m[0];
    const t = s.match(/<a:t>([^<]*)<\/a:t>/g);
    if (t) {
      const txt = t.map(x => x.replace(/<\/?a:t>/g, '')).join('');
      if (txt.includes('로그아웃') || txt.includes('카테고리 등록')) {
        const pos = s.match(/<a:off x="(\d+)" y="(\d+)"\/>/);
        const nm = s.match(/name="([^"]+)"/);
        console.log(`  ${nm[1]}: x=${pos[1]} y=${pos[2]} text=[${txt}]`);
      }
    }
  }

  // =========================================================
  // 2. Slide 61: z-order verification
  // =========================================================
  console.log('\n=== FIX 2: Slide 61 z-order ===');
  const xml61 = await zip.file('ppt/slides/slide61.xml').async('string');
  const re2 = /<p:cNvPr id="\d+" name="([^"]+)"/g;
  const names = [];
  while ((m = re2.exec(xml61)) !== null) names.push(m[1]);

  // Show key positions
  const keyShapes = ['Shape 0', 'Shape 11', 'Shape 12', 'Shape 17', 'SB_BG', 'Text 18', 'Shape 31', 'Text 32', 'SB_HL', 'SB_Icon5', 'SB_Label5'];
  keyShapes.forEach(name => {
    const idx = names.indexOf(name);
    if (idx >= 0) console.log(`  z=${idx}: ${name}`);
  });

  // =========================================================
  // 3. Slide 61: color check (accent)
  // =========================================================
  console.log('\n=== FIX 3: Slide 61 accent colors ===');
  const hasPurple = xml61.includes('C4B5FD');
  const hasRed = xml61.includes('B91C1C');
  const hasOldPurpleBtn = xml61.includes('7C3AED');
  console.log(`  Purple accent (C4B5FD): ${hasPurple ? 'STILL PRESENT (bad)' : 'removed'}`);
  console.log(`  Red accent (B91C1C): ${hasRed ? 'present' : 'MISSING (bad)'}`);
  console.log(`  Old purple button (7C3AED): ${hasOldPurpleBtn ? 'STILL PRESENT (bad)' : 'removed'}`);

  // Compare accent colors between slide 57 and 61
  const xml57 = await zip.file('ppt/slides/slide57.xml').async('string');
  const re3 = /<p:sp>[\s\S]*?<\/p:sp>/g;
  console.log('\n  --- Slide 57 header accent shapes ---');
  while ((m = re3.exec(xml57)) !== null) {
    const s = m[0];
    const nm = s.match(/name="([^"]+)"/);
    if (nm && ['Text 2', 'Shape 4', 'Shape 5', 'Text 6'].includes(nm[1])) {
      const fills = (s.match(/<a:srgbClr val="([^"]+)"\/>/g) || []).map(f => f.match(/val="([^"]+)"/)[1]);
      console.log(`    ${nm[1]}: fills=[${fills}]`);
    }
  }
  const re4 = /<p:sp>[\s\S]*?<\/p:sp>/g;
  console.log('  --- Slide 61 header accent shapes ---');
  while ((m = re4.exec(xml61)) !== null) {
    const s = m[0];
    const nm = s.match(/name="([^"]+)"/);
    if (nm && ['Text 2', 'Shape 4', 'Shape 5', 'Text 6'].includes(nm[1])) {
      const fills = (s.match(/<a:srgbClr val="([^"]+)"\/>/g) || []).map(f => f.match(/val="([^"]+)"/)[1]);
      console.log(`    ${nm[1]}: fills=[${fills}]`);
    }
  }
}

main().catch(console.error);
