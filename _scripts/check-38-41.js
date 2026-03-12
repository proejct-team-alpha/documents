const JSZip = require('jszip');
const fs = require('fs');
const path = require('path');
const PPTX_PATH = path.join(__dirname, '..', '08_스토리보드', '🏥_병원_예약_&_내부_업무_시스템_—_스토리보드.pptx');

async function main() {
  const data = fs.readFileSync(PPTX_PATH);
  const zip = await JSZip.loadAsync(data);

  for (const num of [38, 41, 57, 61]) {
    const xml = await zip.file(`ppt/slides/slide${num}.xml`).async('string');
    const re = /<p:sp>[\s\S]*?<\/p:sp>/g;
    let m;
    console.log(`=== Slide ${num}: all shapes in header/content area (y 1900000-2600000) ===`);
    let zIdx = 0;
    while ((m = re.exec(xml)) !== null) {
      const s = m[0];
      const pos = s.match(/<a:off x="(\d+)" y="(\d+)"\/>/);
      if (pos) {
        const y = parseInt(pos[2]);
        if (y >= 1900000 && y <= 2600000) {
          const ext = s.match(/<a:ext cx="(\d+)" cy="(\d+)"\/>/);
          const nm = s.match(/name="([^"]+)"/);
          const id = s.match(/<p:cNvPr id="(\d+)"/);
          const t = s.match(/<a:t>([^<]*)<\/a:t>/g);
          const txt = t ? t.map(x => x.replace(/<\/?a:t>/g, '')).join('') : '(no text)';
          const fills = (s.match(/<a:srgbClr val="([^"]+)"\/>/g) || []).map(f => f.match(/val="([^"]+)"/)[1]);
          console.log(`  z=${zIdx} id=${id[1]} "${nm[1]}" x=${pos[1]} y=${pos[2]} cx=${ext ? ext[1] : '?'} cy=${ext ? ext[2] : '?'} fills=[${fills}] text=[${txt.substring(0, 40)}]`);
        }
      }
      zIdx++;
    }
    console.log('');
  }
}

main().catch(console.error);
