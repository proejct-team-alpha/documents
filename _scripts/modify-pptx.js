const JSZip = require('jszip');
const fs = require('fs');
const path = require('path');

const PPTX_PATH = path.join(__dirname, '..', '08_스토리보드', '🏥_병원_예약_&_내부_업무_시스템_—_스토리보드.pptx');

function replaceAll(str, find, replace) {
  if (str.includes(find)) {
    return str.split(find).join(replace);
  }
  const encoded = find.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  if (encoded !== find && str.includes(encoded)) {
    const encodedReplace = replace.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return str.split(encoded).join(encodedReplace);
  }
  return str;
}

// Replace exact <a:t>text</a:t> tag only (for sidebar items etc.)
function replaceExactTag(str, find, replace) {
  const tag = `<a:t>${find}</a:t>`;
  const tagReplace = `<a:t>${replace}</a:t>`;
  if (str.includes(tag)) {
    return str.split(tag).join(tagReplace);
  }
  return str;
}

async function main() {
  const data = fs.readFileSync(PPTX_PATH);
  const zip = await JSZip.loadAsync(data);

  // Save originals BEFORE any modifications
  const orig41 = await zip.file('ppt/slides/slide41.xml').async('string');
  const orig42 = await zip.file('ppt/slides/slide42.xml').async('string');
  const orig43 = await zip.file('ppt/slides/slide43.xml').async('string');

  // ============================================================
  // 1. Slide 41: 화면 C-1 → 화면 37 (물품 카테고리 목록)
  // ============================================================
  let s41 = orig41;
  s41 = replaceAll(s41, '화면 C-1', '화면 37');
  s41 = replaceAll(s41, '카테고리 목록', '물품 카테고리 목록');
  s41 = replaceAll(s41, '— 카테고리 관리', '— 물품 카테고리 관리');
  zip.file('ppt/slides/slide41.xml', s41);
  console.log('Slide 41: C-1 → 37, 물품 카테고리 목록');

  // ============================================================
  // 2. Slide 42: 화면 C-2 → 화면 38 (물품 카테고리 등록)
  // ============================================================
  let s42 = orig42;
  s42 = replaceAll(s42, '화면 C-2', '화면 38');
  s42 = replaceAll(s42, '카테고리 등록', '물품 카테고리 등록');
  zip.file('ppt/slides/slide42.xml', s42);
  console.log('Slide 42: C-2 → 38, 물품 카테고리 등록');

  // ============================================================
  // 3. Slide 43: 화면 C-3 → 화면 39 (물품 카테고리 상세·수정)
  // ============================================================
  let s43 = orig43;
  s43 = replaceAll(s43, '화면 C-3', '화면 39');
  s43 = replaceAll(s43, '카테고리 상세·수정', '물품 카테고리 상세·수정');
  zip.file('ppt/slides/slide43.xml', s43);
  console.log('Slide 43: C-3 → 39, 물품 카테고리 상세·수정');

  // ============================================================
  // 4. Slide 34: 물품 담당자 Overview update
  // ============================================================
  let s34 = await zip.file('ppt/slides/slide34.xml').async('string');
  s34 = replaceAll(s34, '카테고리(C-1~C-3)', '화면 37·38·39');
  zip.file('ppt/slides/slide34.xml', s34);
  console.log('Slide 34: overview updated');

  // ============================================================
  // 5. Slide 45: 관리자 Overview - add screens 40·41·42
  // ============================================================
  let s45 = await zip.file('ppt/slides/slide45.xml').async('string');
  s45 = replaceAll(s45,
    '화면 05 · 17 · 18 · 19 · 22 · 23 · 24 · 25 · 26 · 30 · 31 · 32',
    '화면 05 · 17 · 18 · 19 · 22 · 23 · 24 · 25 · 26 · 30 · 31 · 32 · 40 · 41 · 42');
  zip.file('ppt/slides/slide45.xml', s45);
  console.log('Slide 45: admin overview updated');

  // ============================================================
  // 6. Create new slides 61, 62, 63 from ORIGINALS
  //    Use orig41/42/43 as base → 규칙 카테고리 (화면 40/41/42)
  // ============================================================

  // --- Slide 61: 규칙 카테고리 목록 (화면 40) from orig41 ---
  let n61 = orig41;
  // Header
  n61 = replaceAll(n61, '물품 담당자 (ADMIN) 화면 상세', '관리자 (ADMIN) 화면 상세');
  // Screen number
  n61 = replaceAll(n61, '화면 C-1', '화면 40');
  // Title & header bar
  n61 = replaceAll(n61, '카테고리 목록', '규칙 카테고리 목록');
  n61 = replaceAll(n61, '— 카테고리 관리', '— 규칙 카테고리 관리');
  // URLs
  n61 = replaceAll(n61, '/admin/category/list', '/admin/rule-category/list');
  n61 = replaceAll(n61, '/admin/category/new', '/admin/rule-category/new');
  n61 = replaceAll(n61, '/admin/category/deactivate', '/admin/rule-category/deactivate');
  n61 = replaceAll(n61, '/admin/category/detail', '/admin/rule-category/detail');
  // Template
  n61 = replaceAll(n61, 'admin/category-list.mustache', 'admin/rule-category-list.mustache');
  // Table data
  n61 = replaceAll(n61, '물품 수', '규칙 수');
  n61 = replaceAll(n61, '의료 소모품', '응급 처치');
  n61 = replaceAll(n61, '의료 장비', '물품·비품');
  n61 = replaceAll(n61, '일반 소모품', '당직·근무');
  n61 = replaceAll(n61, '총 3건', '총 5건');
  // DTO
  n61 = replaceAll(n61, 'ItemCategoryDto', 'RuleCategoryDto');
  // Username
  n61 = replaceAll(n61, '김담당', '관리자');
  // Sidebar: exact <a:t> tag replacements (won't affect partial matches)
  n61 = replaceExactTag(n61, '카테고리', '규칙 카테고리');
  n61 = replaceExactTag(n61, '물품관리', '규칙관리');
  zip.file('ppt/slides/slide61.xml', n61);
  console.log('Slide 61: 화면 40 규칙 카테고리 목록');

  // --- Slide 62: 규칙 카테고리 등록 (화면 41) from orig42 ---
  let n62 = orig42;
  // Header
  n62 = replaceAll(n62, '물품 담당자 (ADMIN) 화면 상세', '관리자 (ADMIN) 화면 상세');
  // Screen number
  n62 = replaceAll(n62, '화면 C-2', '화면 41');
  // Title & descriptions (this also changes "— 카테고리 등록" since it contains "카테고리 등록")
  n62 = replaceAll(n62, '카테고리 등록', '규칙 카테고리 등록');
  // URLs
  n62 = replaceAll(n62, '/admin/category/new', '/admin/rule-category/new');
  n62 = replaceAll(n62, '/admin/category/create', '/admin/rule-category/create');
  n62 = replaceAll(n62, '/admin/category/list', '/admin/rule-category/list');
  // Template
  n62 = replaceAll(n62, 'admin/category-new.mustache', 'admin/rule-category-new.mustache');
  // Flash message
  n62 = replaceAll(n62, '카테고리가 등록되었습니다', '규칙 카테고리가 등록되었습니다');
  // DTO
  n62 = replaceAll(n62, 'CategoryFormDto', 'RuleCategoryFormDto');
  // Username
  n62 = replaceAll(n62, '김담당', '관리자');
  // Sidebar
  n62 = replaceExactTag(n62, '카테고리', '규칙 카테고리');
  n62 = replaceExactTag(n62, '물품관리', '규칙관리');
  zip.file('ppt/slides/slide62.xml', n62);
  console.log('Slide 62: 화면 41 규칙 카테고리 등록');

  // --- Slide 63: 규칙 카테고리 상세·수정 (화면 42) from orig43 ---
  let n63 = orig43;
  // Header
  n63 = replaceAll(n63, '물품 담당자 (ADMIN) 화면 상세', '관리자 (ADMIN) 화면 상세');
  // Screen number
  n63 = replaceAll(n63, '화면 C-3', '화면 42');
  // Title & descriptions
  n63 = replaceAll(n63, '카테고리 상세·수정', '규칙 카테고리 상세·수정');
  // URLs
  n63 = replaceAll(n63, '/admin/category/detail', '/admin/rule-category/detail');
  n63 = replaceAll(n63, '/admin/category/update', '/admin/rule-category/update');
  n63 = replaceAll(n63, '/admin/category/deactivate', '/admin/rule-category/deactivate');
  n63 = replaceAll(n63, '/admin/category/list', '/admin/rule-category/list');
  // Template
  n63 = replaceAll(n63, 'admin/category-detail.mustache', 'admin/rule-category-detail.mustache');
  // Table data
  n63 = replaceAll(n63, '의료 소모품', '응급 처치');
  n63 = replaceAll(n63, '소속 물품 수', '소속 규칙 수');
  n63 = replaceAll(n63, '기존 물품 FK', '기존 규칙 FK');
  // DTO
  n63 = replaceAll(n63, 'ItemCategoryDto', 'RuleCategoryDto');
  // Username
  n63 = replaceAll(n63, '김담당', '관리자');
  // Sidebar
  n63 = replaceExactTag(n63, '카테고리', '규칙 카테고리');
  n63 = replaceExactTag(n63, '물품관리', '규칙관리');
  zip.file('ppt/slides/slide63.xml', n63);
  console.log('Slide 63: 화면 42 규칙 카테고리 상세·수정');

  // ============================================================
  // 7. Copy slide rels from template for new slides
  // ============================================================
  const rels41 = await zip.file('ppt/slides/_rels/slide41.xml.rels').async('string');
  zip.file('ppt/slides/_rels/slide61.xml.rels', rels41);
  zip.file('ppt/slides/_rels/slide62.xml.rels', rels41);
  zip.file('ppt/slides/_rels/slide63.xml.rels', rels41);

  // ============================================================
  // 8. Update presentation relationships
  // ============================================================
  let presRels = await zip.file('ppt/_rels/presentation.xml.rels').async('string');
  const rIdNums = presRels.match(/rId(\d+)/g).map(r => parseInt(r.replace('rId', '')));
  const maxRId = Math.max(...rIdNums);
  const r1 = maxRId + 1, r2 = maxRId + 2, r3 = maxRId + 3;

  const newRels = `<Relationship Id="rId${r1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide61.xml"/>` +
    `<Relationship Id="rId${r2}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide62.xml"/>` +
    `<Relationship Id="rId${r3}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide63.xml"/>`;
  presRels = presRels.replace('</Relationships>', newRels + '</Relationships>');
  zip.file('ppt/_rels/presentation.xml.rels', presRels);
  console.log('Presentation rels: rId' + r1 + ', rId' + r2 + ', rId' + r3);

  // ============================================================
  // 9. Update presentation.xml slide IDs
  //    Insert new slides after slide59 (규칙관리 마지막 슬라이드)
  // ============================================================
  let presXml = await zip.file('ppt/presentation.xml').async('string');
  const sldIds = presXml.match(/p:sldId id="(\d+)"/g).map(s => parseInt(s.match(/\d+/)[0]));
  const maxSldId = Math.max(...sldIds);

  // Find the rId for slide59.xml
  const s59match = presRels.match(/Id="(rId\d+)"[^>]*Target="slides\/slide59\.xml"/);
  const rId59 = s59match ? s59match[1] : null;
  console.log('slide59 rId:', rId59);

  const newSldIds = `<p:sldId id="${maxSldId + 1}" r:id="rId${r1}"/>` +
    `<p:sldId id="${maxSldId + 2}" r:id="rId${r2}"/>` +
    `<p:sldId id="${maxSldId + 3}" r:id="rId${r3}"/>`;

  if (rId59) {
    presXml = presXml.replace(
      `r:id="${rId59}"/>`,
      `r:id="${rId59}"/>` + newSldIds
    );
  } else {
    presXml = presXml.replace('</p:sldIdLst>', newSldIds + '</p:sldIdLst>');
  }
  zip.file('ppt/presentation.xml', presXml);
  console.log('Presentation.xml: sldIds ' + (maxSldId + 1) + '-' + (maxSldId + 3));

  // ============================================================
  // 10. Update [Content_Types].xml
  // ============================================================
  let ct = await zip.file('[Content_Types].xml').async('string');
  const newCT = '<Override PartName="/ppt/slides/slide61.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>' +
    '<Override PartName="/ppt/slides/slide62.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>' +
    '<Override PartName="/ppt/slides/slide63.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>';
  ct = ct.replace('</Types>', newCT + '</Types>');
  zip.file('[Content_Types].xml', ct);

  // ============================================================
  // Save
  // ============================================================
  const output = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  fs.writeFileSync(PPTX_PATH, output);
  console.log('\nSaved:', PPTX_PATH);
  console.log('Total slides: 63');
}

main().catch(err => { console.error(err); process.exit(1); });
