const JSZip = require('jszip');
const fs = require('fs');
const path = require('path');

const PPTX_PATH = path.join(__dirname, '..', '08_스토리보드', '🏥_병원_예약_&_내부_업무_시스템_—_스토리보드.pptx');

async function main() {
  const data = fs.readFileSync(PPTX_PATH);
  const zip = await JSZip.loadAsync(data);

  const xml61 = await zip.file('ppt/slides/slide61.xml').async('string');

  // List ALL shape names and IDs
  const shapeRegex = /<p:sp>[\s\S]*?<\/p:sp>/g;
  let m;
  let count = 0;
  while ((m = shapeRegex.exec(xml61)) !== null) {
    const shape = m[0];
    const nameMatch = shape.match(/name="([^"]+)"/);
    const idMatch = shape.match(/<p:cNvPr id="(\d+)"/);
    const textM = shape.match(/<a:t>([^<]*)<\/a:t>/);
    const xMatch = shape.match(/<a:off x="(\d+)" y="(\d+)"\/>/);
    count++;
    const id = idMatch ? idMatch[1] : '?';
    const name = nameMatch ? nameMatch[1] : '?';
    const x = xMatch ? xMatch[1] : '?';
    const y = xMatch ? xMatch[2] : '?';
    const text = textM ? textM[1] : '';
    if (parseInt(x) < 1100000 || name.startsWith('SB')) {
      console.log(`id=${id} name="${name}" x=${x} y=${y} text=[${text}]`);
    }
  }
  console.log('\nTotal shapes:', count);

  // Also check for any remaining old sidebar shapes
  const hasOldSidebar = xml61.includes('name="Sidebar');
  const hasOldShape23 = xml61.includes('name="Shape 23"');
  const hasNewSB = xml61.includes('name="SB_BG"');
  console.log('\nOld Sidebar shapes:', hasOldSidebar);
  console.log('Old Shape 23:', hasOldShape23);
  console.log('New SB_BG shape:', hasNewSB);

  // Show first 500 chars after </p:grpSpPr>
  const insertPoint = xml61.indexOf('</p:grpSpPr>');
  if (insertPoint >= 0) {
    console.log('\n--- After </p:grpSpPr> (first 500 chars) ---');
    console.log(xml61.substring(insertPoint, insertPoint + 500));
  }
}

main().catch(console.error);
