'use client';

import { useState } from 'react';
import { Printer } from 'lucide-react';

interface PrintItemProps {
  id: string;
  Tanggal: string;
  No_Anggota: string;
  Jenis_Pinjaman: string;
  Nominal_Pinjaman: number;
  Tenor: number;
  Bunga: number;
  opsi_agunan: string;
  jenis_agunan: string;
  Status: string;
}

interface PrintButtonProps {
  data: PrintItemProps[];
  title?: string;
  className?: string;
}

const formatRupiah = (value: number): string => {
  return Math.round(value).toLocaleString('id-ID');
};

export default function PrintButton({ data = [], title = 'Cetak / Simpan PDF', className = '' }: PrintButtonProps) {
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = async () => {
    setIsPrinting(true);

    try {
      const rows = (data || []).map(item => `
        <tr>
          <td style="padding:7px 10px;text-align:left;font-size:11px;border-bottom:1px solid #f1f5f9;border-right:1px solid #f1f5f9;">${item.Tanggal}</td>
          <td style="padding:7px 10px;text-align:left;font-size:11px;border-bottom:1px solid #f1f5f9;border-right:1px solid #f1f5f9;">${item.No_Anggota}</td>
          <td style="padding:7px 10px;text-align:center;font-size:11px;border-bottom:1px solid #f1f5f9;border-right:1px solid #f1f5f9;">${item.Jenis_Pinjaman}</td>
          <td style="padding:7px 10px;text-align:right;font-size:11px;border-bottom:1px solid #f1f5f9;border-right:1px solid #f1f5f9;">${formatRupiah(item.Nominal_Pinjaman)}</td>
          <td style="padding:7px 10px;text-align:center;font-size:11px;border-bottom:1px solid #f1f5f9;border-right:1px solid #f1f5f9;">${item.Tenor} bln</td>
          <td style="padding:7px 10px;text-align:center;font-size:11px;border-bottom:1px solid #f1f5f9;border-right:1px solid #f1f5f9;">${item.Bunga}%</td>
          <td style="padding:7px 10px;text-align:left;font-size:11px;border-bottom:1px solid #f1f5f9;border-right:1px solid #f1f5f9;">${item.opsi_agunan}</td>
          <td style="padding:7px 10px;text-align:left;font-size:11px;border-bottom:1px solid #f1f5f9;border-right:1px solid #f1f5f9;">${item.jenis_agunan}</td>
          <td style="padding:7px 10px;text-align:center;font-size:11px;border-bottom:1px solid #f1f5f9;border-right:1px solid #f1f5f9;">
            <span style="display:inline-flex;padding:2px 8px;border-radius:9999px;font-size:10px;font-weight:600;${item.Status === 'Aktif' ? 'background:rgba(59,130,246,0.1);color:#60a5fa;' : 'background:rgba(16,185,129,0.1);color:#34d399;'}">${item.Status}</span>
          </td>
          <td style="padding:7px 10px;text-align:center;font-size:11px;border-bottom:1px solid #f1f5f9;">
            <button style="color:#f87171;font-weight:600;background:transparent;border:1px solid #fecaca;padding:2px 8px;border-radius:4px;font-size:10px;cursor:pointer;">Hapus</button>
          </td>
        </tr>
      `).join('');

      const printHTML = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>${title}</title>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

              * { box-sizing: border-box; }
              html, body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                padding: 24px;
                color: #0f172a;
                background: #ffffff;
                line-height: 1.5;
              }
              .print-container {
                max-width: 900px;
                margin: 0 auto;
              }
              .print-header {
                text-align: center;
                margin-bottom: 24px;
                padding-bottom: 16px;
                border-bottom: 2px solid #e2e8f0;
              }
              .print-header h1 {
                font-size: 20px;
                font-weight: 700;
                color: #0f172a;
                margin: 0 0 4px 0;
              }
              .print-header p {
                font-size: 11px;
                color: #64748b;
                margin: 0;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                font-size: 11px;
                margin-top: 8px;
              }
              table thead th {
                background: #f1f5f9;
                padding: 8px 10px;
                text-align: left;
                font-weight: 600;
                color: #475569;
                border-bottom: 1px solid #cbd5e1;
                border-right: 1px solid #e2e8f0;
                width: 100px;
              }
              table thead th:nth-child(4) { width: 140px; }
              table thead th:last-child {
                border-right: none;
                width: 75px;
              }
              table tbody td {
                padding: 7px 10px;
                border-bottom: 1px solid #f1f5f9;
                border-right: 1px solid #f1f5f9;
                vertical-align: top;
              }
              table tbody td:last-child {
                border-right: none;
              }
              table tbody tr:nth-child(even) {
                background: #fafafa;
              }
              .signature-area {
                margin-top: 40px;
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 40px;
              }
              .signature-box {
                text-align: center;
              }
              .signature-line {
                border-bottom: 1px solid #94a3b8;
                height: 64px;
                margin-bottom: 6px;
              }
              .signature-label {
                font-size: 11px;
                color: #64748b;
                font-weight: 500;
              }
              @media print {
                html, body { padding: 0; background: #fff; }
              }
            </style>
          </head>
          <body>
            <div class="print-container">
              <div class="print-header">
                <h1>Data Pinjaman Aktif</h1>
                <p>Dicetak pada ${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} | ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
              <table>
                <thead>
                  <tr>
                    <th style="width:100px;">Tanggal</th>
                    <th style="width:90px;">No. Anggota</th>
                    <th style="width:90px;text-align:center;">Jenis</th>
                    <th style="width:140px;text-align:right;">Nominal</th>
                    <th style="width:70px;text-align:center;">Tenor</th>
                    <th style="width:70px;text-align:center;">Bunga</th>
                    <th style="width:130px;text-align:center;">Opsi Agunan</th>
                    <th style="text-align:left;">Jenis Agunan</th>
                    <th style="width:85px;text-align:center;">Status</th>
                    <th style="width:75px;text-align:center;">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  ${rows || '<tr><td colspan="10" style="text-align:center;padding:20px;color:#94a3b8;">Tidak ada data</td></tr>'}
                </tbody>
              </table>
              <div class="signature-area">
                <div class="signature-box">
                  <div class="signature-line"></div>
                  <div class="signature-label">Peminjam</div>
                </div>
                <div class="signature-box">
                  <div class="signature-line"></div>
                  <div class="signature-label">Petugas KSP</div>
                </div>
              </div>
            </div>
            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                  setTimeout(function() { window.close(); }, 100);
                }, 50);
              };
            </script>
          </body>
        </html>
      `;

      const blob = new Blob([printHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const printWindow = window.open(url, '_blank', 'width=1024,height=768,scrollbars=yes,resizable=yes');
      if (!printWindow) {
        alert('Gagal membuka jendela cetak. Izinkan pop-up untuk situs ini.');
        setIsPrinting(false);
        return;
      }

      printWindow.onload = () => {
        setIsPrinting(false);
      };

      setTimeout(() => {
        URL.revokeObjectURL(url);
        setIsPrinting(false);
      }, 5000);
    } catch (err) {
      alert('Gagal mencetak: ' + (err instanceof Error ? err.message : 'Unknown error'));
      setIsPrinting(false);
    }
  };

  return (
    <button
      onClick={handlePrint}
      disabled={isPrinting}
      className={`inline-flex items-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-800 disabled:text-zinc-500 text-zinc-200 text-xs font-medium rounded-lg transition-colors border border-zinc-700 ${className}`}
      title={title}
    >
      {isPrinting ? (
        <>
          <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Mempersiapkan...
        </>
      ) : (
        <>
          <Printer className="h-3.5 w-3.5" />
          Cetak / PDF
        </>
      )}
    </button>
  );
}
