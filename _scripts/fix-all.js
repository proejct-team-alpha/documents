const JSZip = require('jszip');
const fs = require('fs');
const path = require('path');

const PPTX_PATH = path.join(__dirname, '..', '08_스토리보드', '🏥_병원_예약_&_내부_업무_시스템_—_스토리보드.pptx');

// Y positions for 6 menu items (gap: 457200)
const Y = [2176272, 2633472, 3090672, 3547872, 4005072, 4462272];

function makeIcon(id, name, y, emoji) {
  return `<p:sp><p:nvSpPr><p:cNvPr id="${id}" name="${name}"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr><p:spPr><a:xfrm><a:off x="274320" y="${y}"/><a:ext cx="237744" cy="237744"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/><a:ln/></p:spPr><p:txBody><a:bodyPr wrap="square" lIns="0" tIns="0" rIns="0" bIns="0" rtlCol="0" anchor="ctr"/><a:lstStyle/><a:p><a:pPr algn="ctr" indent="0" marL="0"><a:buNone/></a:pPr><a:r><a:rPr lang="en-US" sz="1000" dirty="0"><a:solidFill><a:srgbClr val="000000"/></a:solidFill></a:rPr><a:t>${emoji}</a:t></a:r><a:endParaRPr lang="en-US" sz="1000" dirty="0"/></a:p></p:txBody></p:sp>`;
}

function makeLabel(id, name, y, text, active) {
  const color = active ? 'FFFFFF' : '94A3B8';
  const bold = active ? ' b="1"' : '';
  return `<p:sp><p:nvSpPr><p:cNvPr id="${id}" name="${name}"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr><p:spPr><a:xfrm><a:off x="512064" y="${y}"/><a:ext cx="493776" cy="237744"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/><a:ln/></p:spPr><p:txBody><a:bodyPr wrap="square" lIns="0" tIns="0" rIns="0" bIns="0" rtlCol="0" anchor="ctr"/><a:lstStyle/><a:p><a:pPr indent="0" marL="0"><a:buNone/></a:pPr><a:r><a:rPr lang="en-US" sz="650"${bold} dirty="0"><a:solidFill><a:srgbClr val="${color}"/></a:solidFill></a:rPr><a:t>${text}</a:t></a:r><a:endParaRPr lang="en-US" sz="650" dirty="0"/></a:p></p:txBody></p:sp>`;
}

function makeHighlight(id, name, y) {
  return `<p:sp><p:nvSpPr><p:cNvPr id="${id}" name="${name}"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr><p:spPr><a:xfrm><a:off x="228600" y="${y}"/><a:ext cx="822960" cy="274320"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:solidFill><a:srgbClr val="991B1B"/></a:solidFill><a:ln w="12700"><a:solidFill><a:srgbClr val="991B1B"/></a:solidFill><a:prstDash val="solid"/></a:ln></p:spPr></p:sp>`;
}

function makeBackground(id, name) {
  // Same height as admin slides (2496312) - stops at footer line
  return `<p:sp><p:nvSpPr><p:cNvPr id="${id}" name="${name}"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr><p:spPr><a:xfrm><a:off x="228600" y="2139696"/><a:ext cx="822960" cy="2496312"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:solidFill><a:srgbClr val="1E293B"/></a:solidFill><a:ln w="12700"><a:solidFill><a:srgbClr val="1E293B"/></a:solidFill><a:prstDash val="solid"/></a:ln></p:spPr></p:sp>`;
}

function buildSidebarBG() {
  return makeBackground(200, 'SB_BG');
}

function buildSidebarItems() {
  const items = [
    { emoji: '📅', text: '대시보드',      active: false },
    { emoji: '📋', text: '예약관리',      active: false },
    { emoji: '👥', text: '직원관리',      active: false },
    { emoji: '🏥', text: '진료과관리',    active: false },
    { emoji: '📜', text: '규칙관리',      active: false },
    { emoji: '🏷️', text: '규칙 카테고리', active: true  },
  ];

  let id = 201;
  const shapes = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.active) {
      shapes.push(makeHighlight(id++, 'SB_HL', Y[i] - 18288));
    }
    shapes.push(makeIcon(id++, `SB_Icon${i}`, Y[i], item.emoji));
    shapes.push(makeLabel(id++, `SB_Label${i}`, Y[i], item.text, item.active));
  }
  return shapes.join('');
}

function fixSlide61_63(xml) {
  // -------------------------------------------------------
  // Step 1: Remove ALL existing SB_* shapes
  // -------------------------------------------------------
  xml = xml.replace(/<p:sp><p:nvSpPr><p:cNvPr id="\d+" name="SB_[^"]*"\/>[^]*?<\/p:sp>/g, '');

  // -------------------------------------------------------
  // Step 2: Insert SB_BG AFTER Shape 17 (wireframe header bar bg)
  //   Shape 17 is at x=228600 y=1901952 - the last bg shape before sidebar area
  //   This ensures SB_BG renders ABOVE wireframe container but BELOW content
  // -------------------------------------------------------
  const shape17Pattern = /(<p:sp><p:nvSpPr><p:cNvPr id="19" name="Shape 17"\/>[\s\S]*?<\/p:sp>)/;
  const shape17Match = xml.match(shape17Pattern);
  if (shape17Match) {
    xml = xml.replace(shape17Match[0], shape17Match[0] + buildSidebarBG());
    console.log('    SB_BG inserted after Shape 17');
  } else {
    // Fallback: insert after grpSpPr
    console.log('    WARNING: Shape 17 not found, using fallback');
    if (xml.includes('<p:grpSpPr/>')) {
      xml = xml.replace('<p:grpSpPr/>', '<p:grpSpPr/>' + buildSidebarBG());
    }
  }

  // -------------------------------------------------------
  // Step 3: Insert menu items at the END (highest z-order, always visible)
  // -------------------------------------------------------
  xml = xml.replace('</p:spTree>', buildSidebarItems() + '</p:spTree>');

  // -------------------------------------------------------
  // Step 4: Fix accent colors: purple (C4B5FD) → red (B91C1C)
  //   Matches: header accent, accent line, border colors
  // -------------------------------------------------------
  xml = xml.split('C4B5FD').join('B91C1C');

  // Also fix the purple button bg color used in 물품담당자 template
  xml = xml.split('7C3AED').join('991B1B');
  xml = xml.split('6D28D9').join('991B1B');

  return xml;
}

function fixSlide41(xml) {
  // Move "+ 카테고리 등록" button and its bg from header area to content area
  // Current position: x=3355848 y=1938528 (overlaps 로그아웃)
  // New position: x=3355848 y=2194560 (content area, aligned with filter bar)

  // Shape 33: button background
  xml = xml.replace(
    /<p:sp><p:nvSpPr><p:cNvPr id="35" name="Shape 33"\/><p:cNvSpPr\/><p:nvPr\/><\/p:nvSpPr><p:spPr><a:xfrm><a:off x="3355848" y="1938528"\/>/,
    '<p:sp><p:nvSpPr><p:cNvPr id="35" name="Shape 33"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr><p:spPr><a:xfrm><a:off x="3355848" y="2194560"/>'
  );

  // Text 34: button text
  xml = xml.replace(
    /<p:sp><p:nvSpPr><p:cNvPr id="36" name="Text 34"\/><p:cNvSpPr\/><p:nvPr\/><\/p:nvSpPr><p:spPr><a:xfrm><a:off x="3355848" y="1938528"\/>/,
    '<p:sp><p:nvSpPr><p:cNvPr id="36" name="Text 34"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr><p:spPr><a:xfrm><a:off x="3355848" y="2194560"/>'
  );

  return xml;
}

async function main() {
  const data = fs.readFileSync(PPTX_PATH);
  const zip = await JSZip.loadAsync(data);

  // =======================================
  // Fix slide 41: reposition + button
  // =======================================
  console.log('--- Slide 41: fixing button position ---');
  let xml41 = await zip.file('ppt/slides/slide41.xml').async('string');
  const before41 = xml41.length;
  xml41 = fixSlide41(xml41);
  zip.file('ppt/slides/slide41.xml', xml41);
  console.log(`  Done (${before41} → ${xml41.length} chars)`);

  // =======================================
  // Fix slides 61-63: z-order + colors
  // =======================================
  for (const num of [61, 62, 63]) {
    console.log(`--- Slide ${num}: fixing z-order + colors ---`);
    let xml = await zip.file(`ppt/slides/slide${num}.xml`).async('string');
    const beforeLen = xml.length;
    xml = fixSlide61_63(xml);
    zip.file(`ppt/slides/slide${num}.xml`, xml);
    console.log(`  Done (${beforeLen} → ${xml.length} chars)`);
  }

  const output = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  fs.writeFileSync(PPTX_PATH, output);
  console.log('\nSaved:', PPTX_PATH);
}

main().catch(err => { console.error(err); process.exit(1); });
