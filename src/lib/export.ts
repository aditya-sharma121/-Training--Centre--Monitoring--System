import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

export interface AttendanceExportRow {
  Date: string;
  Batch: string;
  RegistrationNo: string;
  StudentName: string;
  Status: string;
  VerificationMethod: string;
  GeoVerified: string;
}

export function exportToExcel(data: any[], fileName: string) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
}

export function exportAttendancePdf(
  rows: AttendanceExportRow[],
  title: string,
  summary: { total: number; present: number; absent: number; rate: string }
) {
  const doc = new jsPDF();

  // Header banner
  doc.setFillColor(0, 71, 171); // Govt blue
  doc.rect(0, 0, 210, 24, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.text("TCMS – Training Centre Monitoring System", 14, 12);
  doc.setFontSize(9);
  doc.text("Ministry of Skill Development & Entrepreneurship | Govt. of India", 14, 18);

  // Report Title
  doc.setTextColor(33, 33, 33);
  doc.setFontSize(13);
  doc.text(title, 14, 34);

  // Summary row
  doc.setFontSize(9);
  doc.text(
    `Total Records: ${summary.total} | Present: ${summary.present} | Absent: ${summary.absent} | Attendance Rate: ${summary.rate}`,
    14,
    41
  );

  const tableHeaders = [
    ["Date", "Batch", "Reg No", "Student Name", "Status", "Method", "Geo Valid"],
  ];
  const tableData = rows.map((r) => [
    r.Date,
    r.Batch,
    r.RegistrationNo,
    r.StudentName,
    r.Status,
    r.VerificationMethod,
    r.GeoVerified,
  ]);

  (doc as any).autoTable({
    startY: 46,
    head: tableHeaders,
    body: tableData,
    theme: "striped",
    headStyles: { fillColor: [0, 71, 171], textColor: 255 },
    styles: { fontSize: 8 },
  });

  doc.save(`${title.toLowerCase().replace(/\s+/g, "_")}.pdf`);
}
