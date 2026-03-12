const JSZip = require('jszip');
const fs = require('fs');
const path = require('path');

const PPTX_PATH = path.join(__dirname, '..', '08_스토리보드', '🏥_병원_예약_&_내부_업무_시스템_—_스토리보드.pptx');

async function main() {
  const data = fs.readFileSync(PPTX_PATH);
  const zip = await JSZip.loadAsync(data);
  const xml57 = await zip.file('ppt/slides/slide57.xml').async('string');

  // Extract the exact 12 sidebar shapes (id 25-36)
  const shapeRegex = /<p:sp>[\s\S]*?<\/p:sp>/g;
  let match;
  const sidebarIds = new Set([25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36]);
  const sidebarShapes = [];

  while ((match = shapeRegex.exec(xml57)) !== null) {
    const shape = match[0];
    const idMatch = shape.match(/<p:cNvPr id="(\d+)"/);
    if (idMatch && sidebarIds.has(parseInt(idMatch[1]))) {
      sidebarShapes.push({ id: parseInt(idMatch[1]), xml: shape });
    }
  }

  sidebarShapes.sort((a, b) => a.id - b.id);

  // Print each shape
  sidebarShapes.forEach(s => {
    console.log(`\n=== Shape ID ${s.id} ===`);
    console.log(s.xml);
  });

  // Also check the footer shape in slide 61
  const xml61 = await zip.file('ppt/slides/slide61.xml').async('string');
  const shapes61 = [];
  while ((match = shapeRegex.exec(xml61)) !== null) {
    const shape = match[0];
    if (shape.includes('○○병원 내부 시스템') || shape.includes('Shape 23')) {
      const nameMatch = shape.match(/name="([^"]+)"/);
      const idMatch = shape.match(/<p:cNvPr id="(\d+)"/);
      console.log(`\n=== Slide 61: ${nameMatch ? nameMatch[1] : '?'} (id=${idMatch ? idMatch[1] : '?'}) ===`);
      console.log(shape);
    }
  }
}

main().catch(console.error);
