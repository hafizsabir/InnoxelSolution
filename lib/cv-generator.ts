// lib/cv-generator.ts
// Generates PDF and Word files from structured CV data

import type { ParsedCVData } from './cv-parser';

// ─── PDF Generation (jsPDF) ──────────────────────────────────────────────────

export async function downloadAsPDF(cv: ParsedCVData): Promise<void> {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'pt', format: 'a4', compress: true });

  const PAGE_W = 595;
  const MARGIN  = 50;
  const CONTENT_W = PAGE_W - MARGIN * 2;
  let y = 50;

  const addPage = () => { doc.addPage(); y = 50; };
  const checkY  = (needed = 20) => { if (y + needed > 820) addPage(); };

  // ── Header ───────────────────────────────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(30, 50, 160);
  doc.text(cv.name || 'Your Name', MARGIN, y);
  y += 28;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  const contactLine = [cv.email, cv.phone, cv.location, cv.linkedin, cv.github]
    .filter(Boolean).join('  |  ');
  doc.text(contactLine, MARGIN, y, { maxWidth: CONTENT_W });
  y += 12;

  doc.setDrawColor(67, 97, 238);
  doc.setLineWidth(1.5);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 16;

  const sectionTitle = (title: string) => {
    checkY(30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30, 50, 160);
    doc.text(title.toUpperCase(), MARGIN, y);
    doc.setDrawColor(200, 210, 255);
    doc.setLineWidth(0.5);
    doc.line(MARGIN, y + 3, PAGE_W - MARGIN, y + 3);
    y += 18;
  };

  const bodyText = (text: string, indent = 0) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(40, 40, 40);
    const lines = doc.splitTextToSize(text, CONTENT_W - indent);
    checkY(lines.length * 13);
    doc.text(lines, MARGIN + indent, y);
    y += lines.length * 13;
  };

  // ── Summary ──────────────────────────────────────────────────────────────
  if (cv.summary) {
    sectionTitle('Professional Summary');
    bodyText(cv.summary);
    y += 8;
  }

  // ── Skills ───────────────────────────────────────────────────────────────
  if (cv.skills.length > 0) {
    sectionTitle('Skills');
    bodyText(cv.skills.join('  ·  '));
    y += 8;
  }

  // ── Experience ───────────────────────────────────────────────────────────
  if (cv.experience.length > 0) {
    sectionTitle('Work Experience');
    for (const exp of cv.experience) {
      checkY(40);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(30, 30, 30);
      doc.text(`${exp.title} — ${exp.company}`, MARGIN, y);
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(`${exp.startDate} – ${exp.endDate}`, PAGE_W - MARGIN, y, { align: 'right' });
      y += 14;
      for (const bullet of exp.bullets) {
        checkY(14);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(40, 40, 40);
        const lines = doc.splitTextToSize(`• ${bullet}`, CONTENT_W - 12);
        doc.text(lines, MARGIN + 12, y);
        y += lines.length * 13;
      }
      y += 6;
    }
  }

  // ── Education ────────────────────────────────────────────────────────────
  if (cv.education.length > 0) {
    sectionTitle('Education');
    for (const edu of cv.education) {
      checkY(30);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(30, 30, 30);
      doc.text(`${edu.degree} ${edu.field}`, MARGIN, y);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      doc.text(`${edu.institution}  |  ${edu.year}`, MARGIN, y + 13);
      y += 26;
    }
    y += 4;
  }

  // ── Certifications ───────────────────────────────────────────────────────
  if (cv.certifications.length > 0) {
    sectionTitle('Certifications');
    for (const cert of cv.certifications) {
      bodyText(`• ${cert}`, 12);
    }
  }

  doc.save(`${cv.name || 'CV'}_ATS_Optimized.pdf`);
}

// ─── Word Generation (docx) ──────────────────────────────────────────────────

export async function downloadAsWord(cv: ParsedCVData): Promise<void> {
  const {
    Document, Packer, Paragraph, TextRun, HeadingLevel,
    AlignmentType, BorderStyle, Table, TableRow, TableCell,
    WidthType, ShadingType,
  } = await import('docx');

  const BRAND_COLOR = '4361EE';
  const DARK        = '1a1a2e';

  const dividerParagraph = () =>
    new Paragraph({
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: BRAND_COLOR, space: 4 } },
      spacing: { after: 120 },
    });

  const sectionHeading = (title: string) => [
    new Paragraph({
      children: [new TextRun({ text: title.toUpperCase(), bold: true, size: 22, color: BRAND_COLOR, font: 'Calibri' })],
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 240, after: 60 },
    }),
    dividerParagraph(),
  ];

  const bulletParagraph = (text: string) =>
    new Paragraph({
      children: [new TextRun({ text, size: 20, color: DARK, font: 'Calibri' })],
      bullet: { level: 0 },
      spacing: { after: 60 },
    });

  // Using a broad type since Paragraph is dynamically imported (not statically available as a type)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const children: InstanceType<typeof Paragraph>[] = [];

  // ── Name ────────────────────────────────────────────────────────────────
  children.push(
    new Paragraph({
      children: [new TextRun({ text: cv.name || 'Your Name', bold: true, size: 40, color: BRAND_COLOR, font: 'Calibri' })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
    })
  );

  // ── Contact ──────────────────────────────────────────────────────────────
  const contactParts = [cv.email, cv.phone, cv.location, cv.linkedin, cv.github].filter(Boolean);
  children.push(
    new Paragraph({
      children: [new TextRun({ text: contactParts.join('  |  '), size: 18, color: '555555', font: 'Calibri' })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
    }),
    dividerParagraph()
  );

  // ── Summary ──────────────────────────────────────────────────────────────
  if (cv.summary) {
    children.push(...sectionHeading('Professional Summary'));
    children.push(
      new Paragraph({
        children: [new TextRun({ text: cv.summary, size: 20, color: DARK, font: 'Calibri' })],
        spacing: { after: 120 },
      })
    );
  }

  // ── Skills ───────────────────────────────────────────────────────────────
  if (cv.skills.length > 0) {
    children.push(...sectionHeading('Skills'));
    children.push(
      new Paragraph({
        children: [new TextRun({ text: cv.skills.join('  ·  '), size: 20, color: DARK, font: 'Calibri' })],
        spacing: { after: 120 },
      })
    );
  }

  // ── Experience ───────────────────────────────────────────────────────────
  if (cv.experience.length > 0) {
    children.push(...sectionHeading('Work Experience'));
    for (const exp of cv.experience) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${exp.title} — ${exp.company}`, bold: true, size: 22, color: DARK, font: 'Calibri' }),
            new TextRun({ text: `\t${exp.startDate} – ${exp.endDate}`, italics: true, size: 18, color: '888888', font: 'Calibri' }),
          ],
          spacing: { after: 60 },
          tabStops: [{ type: 'right', position: 9000 }],
        })
      );
      for (const bullet of exp.bullets) {
        children.push(bulletParagraph(bullet));
      }
      children.push(new Paragraph({ spacing: { after: 80 } }));
    }
  }

  // ── Education ────────────────────────────────────────────────────────────
  if (cv.education.length > 0) {
    children.push(...sectionHeading('Education'));
    for (const edu of cv.education) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: `${edu.degree} ${edu.field} — ${edu.institution}`, bold: true, size: 22, color: DARK, font: 'Calibri' })],
          spacing: { after: 40 },
        }),
        new Paragraph({
          children: [new TextRun({ text: edu.year, size: 18, color: '888888', font: 'Calibri' })],
          spacing: { after: 100 },
        })
      );
    }
  }

  // ── Certifications ───────────────────────────────────────────────────────
  if (cv.certifications.length > 0) {
    children.push(...sectionHeading('Certifications'));
    for (const cert of cv.certifications) {
      children.push(bulletParagraph(cert));
    }
  }

  const doc = new Document({
    sections: [{ properties: { page: { margin: { top: 720, bottom: 720, left: 900, right: 900 } } }, children }],
  });

  const blob = await Packer.toBlob(doc);
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `${cv.name || 'CV'}_ATS_Optimized.docx`;
  a.click();
  URL.revokeObjectURL(url);
}
