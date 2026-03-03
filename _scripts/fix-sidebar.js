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
  // Extend panel height to accommodate 6 items
  // Original cy=2496312 (5 items), new cy=2953512 (6 items, +457200)
  return `<p:sp><p:nvSpPr><p:cNvPr id="${id}" name="${name}"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr><p:spPr><a:xfrm><a:off x="228600" y="2139696"/><a:ext cx="822960" cy="2953512"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:solidFill><a:srgbClr val="1E293B"/></a:solidFill><a:ln w="12700"><a:solidFill><a:srgbClr val="1E293B"/></a:solidFill><a:prstDash val="solid"/></a:ln></p:spPr></p:sp>`;
}

function buildAdminSidebar() {
  // 6-item admin sidebar with "규칙 카테고리" as active item
  const items = [
    { emoji: '📅', text: '대시보드',      active: false },
    { emoji: '📋', text: '예약관리',      active: false },
    { emoji: '👥', text: '직원관리',      active: false },
    { emoji: '🏥', text: '진료과관리',    active: false },
    { emoji: '📜', text: '규칙관리',      active: false },
    { emoji: '🏷️', text: '규칙 카테고리', active: true  },
  ];

  let id = 200;
  const shapes = [];

  // 1. Background panel
  shapes.push(makeBackground(id++, 'SB_BG'));

  // 2. Menu items (icon + label pairs)
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.active) {
      // Active highlight rect (must come before icon/label for z-order)
      shapes.push(makeHighlight(id++, 'SB_HL', Y[i] - 18288));
    }
    shapes.push(makeIcon(id++, `SB_Icon${i}`, Y[i], item.emoji));
    shapes.push(makeLabel(id++, `SB_Label${i}`, Y[i], item.text, item.active));
  }

  return shapes.join('');
}

function replaceSidebar(xml) {
  // Step 1: Remove old Sidebar* shapes (SidebarIcon/SidebarText/SidebarHL)
  // These are contiguous at the end of the file before </p:spTree>
  xml = xml.replace(/<p:sp><p:nvSpPr><p:cNvPr id="\d+" name="Sidebar[^"]*"\/>[^]*?<\/p:sp>/g, '');

  // Step 2: Remove old Shape 23 (sidebar background, id=25)
  // Match the specific shape with id="25" name="Shape 23"
  xml = xml.replace(/<p:sp><p:nvSpPr><p:cNvPr id="25" name="Shape 23"\/><p:cNvSpPr\/><p:nvPr\/><\/p:nvSpPr><p:spPr>[\s\S]*?<\/p:sp>/, '');

  // Step 3: Insert new sidebar shapes at the beginning of spTree
  // Support both self-closing <p:grpSpPr/> and open/close <p:grpSpPr>...</p:grpSpPr>
  const newSidebar = buildAdminSidebar();
  if (xml.includes('<p:grpSpPr/>')) {
    xml = xml.replace('<p:grpSpPr/>', '<p:grpSpPr/>' + newSidebar);
  } else {
    xml = xml.replace('</p:grpSpPr>', '</p:grpSpPr>' + newSidebar);
  }

  return xml;
}

async function main() {
  const data = fs.readFileSync(PPTX_PATH);
  const zip = await JSZip.loadAsync(data);

  for (const slideNum of [61, 62, 63]) {
    const fileName = `ppt/slides/slide${slideNum}.xml`;
    let xml = await zip.file(fileName).async('string');

    const beforeLen = xml.length;
    xml = replaceSidebar(xml);
    const afterLen = xml.length;

    zip.file(fileName, xml);
    console.log(`Slide ${slideNum}: sidebar replaced (${beforeLen} → ${afterLen} chars)`);
  }

  const output = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  fs.writeFileSync(PPTX_PATH, output);
  console.log('\nSaved:', PPTX_PATH);
}

main().catch(err => { console.error(err); process.exit(1); });
