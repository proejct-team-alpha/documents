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
    let m, zIdx = 0;
    console.log(`=== Slide ${num}: button and header shapes ===`);
    while ((m = re.exec(xml)) !== null) {
      const s = m[0];
      const nm = s.match(/name="([^"]+)"/);
      const name = nm ? nm[1] : '?';
      if (['Text 22', 'Shape 33', 'Text 34', 'Shape 39', 'Text 40', 'Shape 35', 'Text 36'].includes(name) || name.startsWith('SB_')) {
        const pos = s.match(/<a:off x="(\d+)" y="(\d+)"\/>/);
        const t = s.match(/<a:t>([^<]*)<\/a:t>/g);
        const txt = t ? t.map(x => x.replace(/<\/?a:t>/g, '')).join('').substring(0, 30) : '';
        console.log(`  z=${zIdx} "${name}" y=${pos ? pos[2] : '?'} text=[${txt}]`);
      }
      zIdx++;
    }
    console.log('');
  }
}

main().catch(console.error);
