const JSZip = require('jszip');
const fs = require('fs');
const path = require('path');
const PPTX_PATH = path.join(__dirname, '..', '08_스토리보드', '🏥_병원_예약_&_내부_업무_시스템_—_스토리보드.pptx');
const data = fs.readFileSync(PPTX_PATH);
JSZip.loadAsync(data).then(async (zip) => {
  const slides = [34, 41, 42, 43, 45, 61, 62, 63];
  for (const num of slides) {
    const f = zip.file('ppt/slides/slide' + num + '.xml');
    if (f === null) { console.log('=== Slide ' + num + ': MISSING ==='); continue; }
    const xml = await f.async('string');
    const matches = xml.match(/<a:t>([^<]*)<\/a:t>/g) || [];
    const texts = matches.map(x => x.replace(/<\/?a:t>/g, ''));
    console.log('=== Slide ' + num + ' ===');
    texts.forEach((t, i) => console.log(i + ': [' + t + ']'));
    console.log('');
  }
});
