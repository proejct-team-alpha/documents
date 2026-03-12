const JSZip = require('jszip');
const fs = require('fs');
const path = require('path');
const PPTX_PATH = path.join(__dirname, '..', '08_스토리보드', '🏥_병원_예약_&_내부_업무_시스템_—_스토리보드.pptx');

// Target position: y=2359152 (matches slide 57's + button)
// This is below the alert/info bar and above the filter bar
const TARGET_Y = '2359152';

function moveButton(xml, slideNum) {
  // Find Shape 33 (button bg) and Text 34 (button text)
  // They contain the "+" button at y=1938528 or y=2194560
  const shape33Re = /(<p:sp><p:nvSpPr><p:cNvPr id="\d+" name="Shape 33"\/>[\s\S]*?<a:off x=")(\d+)(" y=")(\d+)(")/;
  const text34Re = /(<p:sp><p:nvSpPr><p:cNvPr id="\d+" name="Text 34"\/>[\s\S]*?<a:off x=")(\d+)(" y=")(\d+)(")/;

  let changed = false;

  const sm = xml.match(shape33Re);
  if (sm && sm[4] !== TARGET_Y) {
    xml = xml.replace(shape33Re, `$1$2$3${TARGET_Y}$5`);
    console.log(`  Shape 33: y=${sm[4]} → ${TARGET_Y}`);
    changed = true;
  }

  const tm = xml.match(text34Re);
  if (tm && tm[4] !== TARGET_Y) {
    xml = xml.replace(text34Re, `$1$2$3${TARGET_Y}$5`);
    console.log(`  Text 34: y=${tm[4]} → ${TARGET_Y}`);
    changed = true;
  }

  if (!changed) {
    console.log(`  No changes needed (already at ${TARGET_Y} or not found)`);
  }

  // Move the button to the end of spTree for highest z-order
  // This ensures it renders ON TOP of alert bars and other shapes
  const shape33Full = xml.match(/<p:sp><p:nvSpPr><p:cNvPr id="\d+" name="Shape 33"\/>[^]*?<\/p:sp>/);
  const text34Full = xml.match(/<p:sp><p:nvSpPr><p:cNvPr id="\d+" name="Text 34"\/>[^]*?<\/p:sp>/);

  if (shape33Full && text34Full) {
    // Remove from current position
    xml = xml.replace(shape33Full[0], '');
    xml = xml.replace(text34Full[0], '');
    // Re-insert at end of spTree (highest z-order)
    xml = xml.replace('</p:spTree>', shape33Full[0] + text34Full[0] + '</p:spTree>');
    console.log(`  Moved button shapes to end of spTree (highest z-order)`);
  }

  return xml;
}

async function main() {
  const data = fs.readFileSync(PPTX_PATH);
  const zip = await JSZip.loadAsync(data);

  for (const num of [38, 41, 61]) {
    console.log(`--- Slide ${num} ---`);
    let xml = await zip.file(`ppt/slides/slide${num}.xml`).async('string');
    xml = moveButton(xml, num);
    zip.file(`ppt/slides/slide${num}.xml`, xml);
  }

  const output = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  fs.writeFileSync(PPTX_PATH, output);
  console.log('\nSaved:', PPTX_PATH);
}

main().catch(err => { console.error(err); process.exit(1); });
