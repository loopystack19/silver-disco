import { jsPDF } from 'jspdf';

export interface CertificateData {
  studentName: string;
  courseTitle: string;
  provider: string;
  completionDate: string;
  certificateId: string;
}

export function generateCertificatePDF(data: CertificateData): jsPDF {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Background
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Border
  doc.setDrawColor(59, 130, 246); // Blue
  doc.setLineWidth(2);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

  // Inner decorative border
  doc.setDrawColor(99, 102, 241); // Indigo
  doc.setLineWidth(0.5);
  doc.rect(15, 15, pageWidth - 30, pageHeight - 30);

  // Header - "Certificate of Completion"
  doc.setFontSize(40);
  doc.setTextColor(59, 130, 246);
  doc.text('Certificate of Completion', pageWidth / 2, 40, { align: 'center' });

  // Decorative line
  doc.setDrawColor(59, 130, 246);
  doc.setLineWidth(1);
  doc.line(pageWidth / 2 - 60, 45, pageWidth / 2 + 60, 45);

  // This certifies that
  doc.setFontSize(14);
  doc.setTextColor(107, 114, 128); // Gray
  doc.text('This certifies that', pageWidth / 2, 60, { align: 'center' });

  // Student Name
  doc.setFontSize(32);
  doc.setTextColor(31, 41, 55); // Dark gray
  doc.setFont('helvetica', 'bold');
  doc.text(data.studentName, pageWidth / 2, 75, { align: 'center' });

  // Has successfully completed
  doc.setFontSize(14);
  doc.setTextColor(107, 114, 128);
  doc.setFont('helvetica', 'normal');
  doc.text('has successfully completed the course', pageWidth / 2, 90, { align: 'center' });

  // Course Title
  doc.setFontSize(24);
  doc.setTextColor(59, 130, 246);
  doc.setFont('helvetica', 'bold');
  const lines = doc.splitTextToSize(data.courseTitle, pageWidth - 80);
  doc.text(lines, pageWidth / 2, 105, { align: 'center' });

  // Provider
  doc.setFontSize(16);
  doc.setTextColor(99, 102, 241);
  doc.setFont('helvetica', 'normal');
  doc.text(`Provided by ${data.provider}`, pageWidth / 2, 125, { align: 'center' });

  // Date and UmojaHub branding
  doc.setFontSize(12);
  doc.setTextColor(107, 114, 128);
  doc.text(`Date of Completion: ${data.completionDate}`, pageWidth / 2, 145, {
    align: 'center',
  });

  // UmojaHub Logo/Text
  doc.setFontSize(20);
  doc.setTextColor(0, 127, 78); // UmojaHub green
  doc.setFont('helvetica', 'bold');
  doc.text('UmojaHub', pageWidth / 2, 165, { align: 'center' });

  doc.setFontSize(10);
  doc.setTextColor(107, 114, 128);
  doc.setFont('helvetica', 'normal');
  doc.text('Empowering Africa through Education', pageWidth / 2, 172, {
    align: 'center',
  });

  // Certificate ID
  doc.setFontSize(8);
  doc.setTextColor(156, 163, 175);
  doc.text(`Certificate ID: ${data.certificateId}`, pageWidth / 2, pageHeight - 15, {
    align: 'center',
  });

  // Signature line (decorative)
  doc.setDrawColor(156, 163, 175);
  doc.setLineWidth(0.5);
  doc.line(40, pageHeight - 30, 90, pageHeight - 30);

  doc.setFontSize(10);
  doc.setTextColor(107, 114, 128);
  doc.text('Director', 65, pageHeight - 25, { align: 'center' });

  return doc;
}

export function downloadCertificate(doc: jsPDF, filename: string) {
  doc.save(filename);
}

export function getCertificateBlob(doc: jsPDF): Blob {
  return doc.output('blob');
}

export function getCertificateDataUri(doc: jsPDF): string {
  return doc.output('datauristring');
}
