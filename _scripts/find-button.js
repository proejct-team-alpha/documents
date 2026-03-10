const JSZip = require('jszip');
const fs = require('fs');
const path = require('path');
const PPTX_PATH = path.join(__dirname, '..', '08_스토리보드', '🏥_병원_예약_&_내부_업무_시스템_—_스토리보드.pptx');
JSZip.loadAsync(fs.readFileSync(PPTX_PATH)).then(async zip => {
  // Check slide 57 for + 규칙 등록 button
  const xml57 = await zip.file('ppt/slides/slide57.xml').async('string');
  const re = /<p:sp>[\s\S]*?<\/p:sp>/g;
  let m;
  console.log('=== Slide 57: + button and header area ===');
  while ((m = re.exec(xml57)) !== null) {
    const s = m[0];
    const t = s.match(/<a:t>([^<]*)<\/a:t>/g);
    if (t) {
      const txt = t.map(x => x.replace(/<\/?a:t>/g, '')).join(' ');
      if (txt.includes('등록') || txt.includes('로그아웃') || txt.includes('관리자') || txt.includes('○○병원')) {
        const pos = s.match(/<a:off x="(\d+)" y="(\d+)"\/>/);
        const ext = s.match(/<a:ext cx="(\d+)" cy="(\d+)"\/>/);
        const nm = s.match(/name="([^"]+)"/);
        console.log(`  ${nm[1]}: x=${pos[1]} y=${pos[2]} cx=${ext[1]} cy=${ext[2]} text=[${txt}]`);
      }
    }
  }

  // Check slide 41 for overlapping shapes
  const xml41 = await zip.file('ppt/slides/slide41.xml').async('string');
  console.log('\n=== Slide 41: header area shapes ===');
  const re2 = /<p:sp>[\s\S]*?<\/p:sp>/g;
  while ((m = re2.exec(xml41)) !== null) {
    const s = m[0];
    const pos = s.match(/<a:off x="(\d+)" y="(\d+)"\/>/);
    if (pos && parseInt(pos[2]) >= 1900000 && parseInt(pos[2]) <= 2200000) {
      const t = s.match(/<a:t>([^<]*)<\/a:t>/g);
      const txt = t ? t.map(x => x.replace(/<\/?a:t>/g, '')).join(' ') : '(no text)';
      const ext = s.match(/<a:ext cx="(\d+)" cy="(\d+)"\/>/);
      const nm = s.match(/name="([^"]+)"/);
      const fills = (s.match(/<a:srgbClr val="([^"]+)"\/>/g) || []).map(f => f.match(/val="([^"]+)"/)[1]);
      console.log(`  ${nm[1]}: x=${pos[1]} y=${pos[2]} cx=${ext[1]} cy=${ext[2]} fills=[${fills}] text=[${txt}]`);
    }
  }
});
