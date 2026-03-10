const JSZip = require('jszip');
const fs = require('fs');
const path = require('path');

const PPTX_PATH = path.join(__dirname, '..', '08_스토리보드', '🏥_병원_예약_&_내부_업무_시스템_—_스토리보드.pptx');

async function main() {
  const data = fs.readFileSync(PPTX_PATH);
  const zip = await JSZip.loadAsync(data);

  // Extract admin sidebar from slide 57
  const xml57 = await zip.file('ppt/slides/slide57.xml').async('string');

  // Find all <p:sp> shapes containing sidebar items
  // The admin sidebar items from analysis:
  // Shape 23 (id=25): background panel
  // Text 24-34 (id=26-36): icon/label pairs + highlight

  // Find background panel shape (contains "1E293B" fill and is the sidebar container)
  const shapeRegex = /<p:sp>[\s\S]*?<\/p:sp>/g;
  const shapes = [];
  let match;
  while ((match = shapeRegex.exec(xml57)) !== null) {
    const shape = match[0];
    const offset = match.index;
    // Extract shape name
    const nameMatch = shape.match(/name="([^"]+)"/);
    const idMatch = shape.match(/<p:cNvPr id="(\d+)"/);
    const textMatches = shape.match(/<a:t>([^<]*)<\/a:t>/g);
    const texts = textMatches ? textMatches.map(t => t.replace(/<\/?a:t>/g, '')) : [];
    const xMatch = shape.match(/<a:off x="(\d+)" y="(\d+)"\/>/);
    const fillMatch = shape.match(/<a:srgbClr val="([^"]+)"\/>/);

    shapes.push({
      name: nameMatch ? nameMatch[1] : '?',
      id: idMatch ? idMatch[1] : '?',
      texts,
      x: xMatch ? xMatch[1] : '?',
      y: xMatch ? xMatch[2] : '?',
      fill: fillMatch ? fillMatch[1] : 'none',
      offset,
      length: shape.length,
      xml: shape
    });
  }

  // Filter sidebar shapes (y >= 2139696 and x < 1200000, which is left side)
  const sidebarShapes = shapes.filter(s => {
    const y = parseInt(s.y);
    const x = parseInt(s.x);
    return y >= 2100000 && x < 1200000;
  });

  console.log('=== Slide 57 Sidebar Shapes ===');
  sidebarShapes.forEach(s => {
    console.log(`${s.name} (id=${s.id}): x=${s.x} y=${s.y} fill=${s.fill} text=[${s.texts.join(', ')}] len=${s.length}`);
  });

  // Save sidebar shapes XML
  const sidebarXml = sidebarShapes.map(s => s.xml).join('\n');
  fs.writeFileSync('C:/tmp/sidebar57_shapes.xml', sidebarXml);
  console.log('\nSidebar XML saved to C:/tmp/sidebar57_shapes.xml');
  console.log('Total sidebar shapes:', sidebarShapes.length);

  // Now extract sidebar shapes from slide 61 to identify what to remove
  const xml61 = await zip.file('ppt/slides/slide61.xml').async('string');
  const shapes61 = [];
  while ((match = shapeRegex.exec(xml61)) !== null) {
    const shape = match[0];
    const nameMatch = shape.match(/name="([^"]+)"/);
    const idMatch = shape.match(/<p:cNvPr id="(\d+)"/);
    const textMatches = shape.match(/<a:t>([^<]*)<\/a:t>/g);
    const texts = textMatches ? textMatches.map(t => t.replace(/<\/?a:t>/g, '')) : [];
    const xMatch = shape.match(/<a:off x="(\d+)" y="(\d+)"\/>/);
    const fillMatch = shape.match(/<a:srgbClr val="([^"]+)"\/>/);

    shapes61.push({
      name: nameMatch ? nameMatch[1] : '?',
      id: idMatch ? idMatch[1] : '?',
      texts,
      x: xMatch ? xMatch[1] : '?',
      y: xMatch ? xMatch[2] : '?',
      fill: fillMatch ? fillMatch[1] : 'none',
      offset: match.index,
      length: shape.length,
      xml: shape
    });
  }

  const sidebarShapes61 = shapes61.filter(s => {
    const name = s.name;
    return name === 'Shape 23' || name.startsWith('Sidebar');
  });

  console.log('\n=== Slide 61 Sidebar Shapes (to remove) ===');
  sidebarShapes61.forEach(s => {
    console.log(`${s.name} (id=${s.id}): x=${s.x} y=${s.y} fill=${s.fill} text=[${s.texts.join(', ')}] offset=${s.offset}`);
  });

  // Check all shape IDs in slide 61 to find safe ID range
  const allIds61 = shapes61.map(s => parseInt(s.id)).filter(n => n > 0);
  console.log('\nAll shape IDs in slide 61:', allIds61.sort((a, b) => a - b).join(', '));
  console.log('Max ID:', Math.max(...allIds61));
}

main().catch(console.error);
