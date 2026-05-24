import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";

/**
 * Generates and downloads a PDF of the specified DOM element.
 * Format is designed to target A4 width.
 */
export async function generatePDF(elementId: string, filename: string = "spend-audit-report.pdf") {
  if (typeof window === "undefined") return;

  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`PDF Generation Error: Element with ID "${elementId}" not found.`);
    return;
  }

  try {
    // Renders the element to a canvas
    // scale: 2 improves image resolution so fonts aren't fuzzy
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#fdf8e2", // Matches the SpendLens cream/sand background color
      windowWidth: 794, // Lock window width to A4 reference width for consistent responsive behavior
    });

    const imgData = canvas.toDataURL("image/png");

    // Standard A4 dimensions in mm
    const pdfWidth = 210;
    const pdfHeight = 297;

    // Calculate height based on A4 aspect ratio
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;
    let heightLeft = imgHeight;

    const doc = new jsPDF("p", "mm", "a4");
    let position = 0;

    // First page
    doc.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight, undefined, "FAST");
    heightLeft -= pdfHeight;

    // Handle multiple pages if height exceeds A4 height
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      doc.addPage();
      doc.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight, undefined, "FAST");
      heightLeft -= pdfHeight;
    }

    doc.save(filename);
  } catch (error) {
    console.error("Failed to generate PDF:", error);
    throw error;
  }
}
