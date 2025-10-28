import { jsPDF } from 'jspdf';
import { CraftIdea } from './geminiService';

const MARGIN = 15; // mm
const FONT_SIZES = {
  title: 22,
  h1: 16,
  h2: 14,
  body: 12,
};
const LINE_HEIGHT = 1.4;

export const exportToPdf = async (idea: CraftIdea, fileName: string): Promise<[boolean, string | null]> => {
  if (!idea) {
    return [false, 'No craft idea data provided to generate PDF.'];
  }

  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const contentWidth = pageWidth - MARGIN * 2;
    let cursorY = MARGIN;

    const checkAndAddPage = (requiredHeight: number) => {
      if (cursorY + requiredHeight > pageHeight - MARGIN) {
        pdf.addPage();
        cursorY = MARGIN;
      }
    };

    pdf.setFont('helvetica', 'normal');

    // 1. Title
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(FONT_SIZES.title);
    const titleLines = pdf.splitTextToSize(idea.title, contentWidth);
    checkAndAddPage(titleLines.length * 10);
    pdf.text(titleLines, pageWidth / 2, cursorY, { align: 'center' });
    cursorY += titleLines.length * 10 + 10;

    // 2. Materials Needed
    checkAndAddPage(10);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(FONT_SIZES.h1);
    pdf.text('Materials Needed', MARGIN, cursorY);
    cursorY += 8;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(FONT_SIZES.body);
    idea.materials.forEach(material => {
      const materialLines = pdf.splitTextToSize(`• ${material}`, contentWidth - 5);
      const requiredHeight = materialLines.length * (FONT_SIZES.body * 0.35 * LINE_HEIGHT);
      checkAndAddPage(requiredHeight);
      pdf.text(materialLines, MARGIN + 5, cursorY, { lineHeightFactor: LINE_HEIGHT });
      cursorY += requiredHeight;
    });
    cursorY += 10;

    // 3. Instructions
    checkAndAddPage(15);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(FONT_SIZES.h1);
    pdf.text('Instructions', MARGIN, cursorY);
    cursorY += 10;

    // 4. Steps
    for (const [index, step] of idea.steps.entries()) {
      if (index > 0) cursorY += 5;

      checkAndAddPage(8);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(FONT_SIZES.h2);
      pdf.text(`Step ${index + 1}`, MARGIN, cursorY);
      cursorY += 7;

      if (step.imageUrl) {
        try {
          const imgProps = pdf.getImageProperties(step.imageUrl);
          const aspectRatio = imgProps.width / imgProps.height;
          const imgWidth = Math.min(contentWidth * 0.75, 120);
          const imgHeight = imgWidth / aspectRatio;

          checkAndAddPage(imgHeight + 5);
          const imgX = (pageWidth - imgWidth) / 2;
          pdf.addImage(step.imageUrl, 'PNG', imgX, cursorY, imgWidth, imgHeight);
          cursorY += imgHeight + 5;
        } catch (e) {
          console.error(`Could not add image for step ${index + 1}`, e);
          checkAndAddPage(6);
          pdf.setFont('helvetica', 'italic');
          pdf.text('[Image not available]', MARGIN, cursorY);
          cursorY += 6;
        }
      }

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(FONT_SIZES.body);
      const textLines = pdf.splitTextToSize(step.text, contentWidth);
      const textHeight = textLines.length * (FONT_SIZES.body * 0.35 * LINE_HEIGHT);
      checkAndAddPage(textHeight);
      pdf.text(textLines, MARGIN, cursorY, { lineHeightFactor: LINE_HEIGHT });
      cursorY += textHeight + 5;
    }

    pdf.save(`${fileName.replace(/ /g, '_')}.pdf`);
    return [true, null];
  } catch (error) {
    console.error("Error generating PDF:", error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred.';
    return [false, `An error occurred while generating the PDF: ${message}`];
  }
};