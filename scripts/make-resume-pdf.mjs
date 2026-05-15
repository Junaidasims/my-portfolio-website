/**
 * Writes a tiny valid PDF to frontend/public/resume.pdf (no extra dependencies).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, "../frontend/public/resume.pdf");

let pdf = "%PDF-1.4\n";
const objOffsets = [];

function addObject(num, inner) {
  objOffsets[num] = Buffer.byteLength(pdf, "binary");
  pdf += `${num} 0 obj\n${inner}\nendobj\n`;
}

addObject(1, "<< /Type /Catalog /Pages 2 0 R >>");
addObject(2, "<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
addObject(
  3,
  "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >> >>"
);

const stream = "BT /F1 20 Tf 72 720 Td (Replace this file with your real resume.) Tj ET\n";
const streamBytes = Buffer.byteLength(stream, "binary");
addObject(
  4,
  `<< /Length ${streamBytes} >>\nstream\n${stream}endstream`
);

const xrefPos = Buffer.byteLength(pdf, "binary");
const maxNum = 4;
pdf += "xref\n";
pdf += `0 ${maxNum + 1}\n`;
pdf += "0000000000 65535 f \n";
for (let i = 1; i <= maxNum; i++) {
  const off = objOffsets[i];
  pdf += `${String(off).padStart(10, "0")} 00000 n \n`;
}
pdf += "trailer\n";
pdf += `<< /Size ${maxNum + 1} /Root 1 0 R >>\n`;
pdf += "startxref\n";
pdf += `${xrefPos}\n`;
pdf += "%%EOF\n";

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, pdf, "binary");
console.log("Wrote", outPath);
