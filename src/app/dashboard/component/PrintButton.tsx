// components/PrintButton.tsx
"use client";

import { Printer } from "lucide-react";

type PrintButtonProps = {
  contentId: string;
};

export default function PrintButton({ contentId }: PrintButtonProps) {
    const handlePrint = () => {
        const contentElement = document.getElementById(contentId);
        const printContent = contentElement?.innerHTML;
      
        if (!printContent) return;
      
        const headContent = document.head.innerHTML; // Ambil semua <style> dan <link>
      
        const printWindow = window.open("", "_blank");
        if (!printWindow) return;
      
        printWindow.document.write(`
          <html>
            <head>
              ${headContent}
              <title>Cetak Jadwal</title>
              <style>
                @media print {
                  @page { size: landscape; margin: 20mm; }
                  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                }
              </style>
            </head>
            <body class="p-8 text-black">
              ${printContent}
            </body>
          </html>
        `);
      
        printWindow.document.close();
        printWindow.focus();
      
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 250);
      };
      
  return (
    <button
      onClick={handlePrint}
      className="flex items-center gap-2 px-3 py-2 bg-black text-white rounded hover:bg-gray-800 text-sm"
    >
      <Printer className="w-4 h-4" />
      Cetak
    </button>
  );
}
