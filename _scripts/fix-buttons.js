const JSZip = require('jszip');
const fs = require('fs');
const path = require('path');
const PPTX_PATH = path.join(__dirname, '..', '08_스토리보드', '🏥_병원_예약_&_내부_업무_시스템_—_스토리보드.pptx');

async function main() {
  const data = fs.readFileSync(PPTX_PATH);
  const zip = await JSZip.loadAsync(data);

  // =========================================================
  // 1. Analyze slide 42 (화면 38) and slide 62 (화면 41) button positions
  // =========================================================
  for (const num of [41, 42, 43, 57, 61, 62, 63]) {
    const xml = await zip.file(`ppt/slides/slide${num}.xml`).async('string');
    const re = /<p:sp>[\s\S]*?<\/p:sp>/g;
    let m;
    const buttons = [];
    while ((m = re.exec(xml)) !== null) {
      const s = m[0];
      const t = s.match(/<a:t>([^<]*)<\/a:t>/g);
      if (t) {
        const txt = t.map(x => x.replace(/<\/?a:t>/g, '')).join('');
        if (txt.includes('등록') || txt.includes('로그아웃') || txt.includes('취소') || txt.includes('저장') || txt.includes('비활성화')) {
          const pos = s.match(/<a:off x="(\d+)" y="(\d+)"\/>/);
          const ext = s.match(/<a:ext cx="(\d+)" cy="(\d+)"\/>/);
          const nm = s.match(/name="([^"]+)"/);
          const id = s.match(/<p:cNvPr id="(\d+)"/);
          const fills = (s.match(/<a:srgbClr val="([^"]+)"\/>/g) || []).map(f => f.match(/val="([^"]+)"/)[1]);
          if (pos && parseInt(pos[2]) >= 1900000 && parseInt(pos[2]) <= 2500000) {
            buttons.push({
              name: nm ? nm[1] : '?',
              id: id ? id[1] : '?',
              x: pos[1], y: pos[2],
              cx: ext ? ext[1] : '?', cy: ext ? ext[2] : '?',
              fills: fills.join(','),
              text: txt
            });
          }
        }
      }
    }
    if (buttons.length > 0) {
      console.log(`=== Slide ${num} header/content area buttons ===`);
      buttons.forEach(b => {
        console.log(`  id=${b.id} "${b.name}" x=${b.x} y=${b.y} cx=${b.cx} cy=${b.cy} fills=[${b.fills}] text=[${b.text}]`);
      });
      console.log('');
    }
  }
}

main().catch(console.error);
