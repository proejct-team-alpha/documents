const JSZip = require('jszip');
const fs = require('fs');
const path = require('path');

const PPTX_PATH = path.join(__dirname, '..', '08_스토리보드', '🏥_병원_예약_&_내부_업무_시스템_—_스토리보드.pptx');

async function main() {
  const data = fs.readFileSync(PPTX_PATH);
  const zip = await JSZip.loadAsync(data);

  for (const slideNum of [57, 61, 62, 63]) {
    const xml = await zip.file(`ppt/slides/slide${slideNum}.xml`).async('string');

    // Extract all text
    const textMatches = xml.match(/<a:t>([^<]*)<\/a:t>/g) || [];
    const texts = textMatches.map(t => t.replace(/<\/?a:t>/g, ''));

    // Check for sidebar-specific shapes
    const shapeRegex = /<p:sp>[\s\S]*?<\/p:sp>/g;
    let m;
    const sidebarShapes = [];
    while ((m = shapeRegex.exec(xml)) !== null) {
      const shape = m[0];
      const nameMatch = shape.match(/name="(SB_[^"]+|Shape 23|Sidebar[^"]*)"/);
      if (nameMatch) {
        const textM = shape.match(/<a:t>([^<]*)<\/a:t>/);
        const fillM = shape.match(/<a:srgbClr val="([^"]+)"\/>/);
        const yM = shape.match(/<a:off x="\d+" y="(\d+)"\/>/);
        sidebarShapes.push({
          name: nameMatch[1],
          text: textM ? textM[1] : '(rect)',
          fill: fillM ? fillM[1] : '-',
          y: yM ? yM[1] : '-'
        });
      }
    }

    console.log(`=== Slide ${slideNum} Sidebar Shapes ===`);
    sidebarShapes.forEach(s => {
      console.log(`  ${s.name}: y=${s.y} fill=${s.fill} text=[${s.text}]`);
    });

    // Also show last few text elements (typically sidebar menu items in original)
    console.log(`  --- All text (last 12) ---`);
    const last = texts.slice(-12);
    last.forEach((t, i) => {
      console.log(`  ${texts.length - 12 + i}: [${t}]`);
    });
    console.log('');
  }
}

main().catch(console.error);
