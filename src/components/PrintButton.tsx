'use client';

import { useState } from 'react';
import { Printer } from 'lucide-react';

interface PrintButtonProps {
  title?: string
  className?: string
}

export default function PrintButton({ title = 'Cetak / Simpan PDF', className = '' }: PrintButtonProps) {
  const [isPrinting, setIsPrinting] = useState(false)

  const handlePrint = () => {
    setIsPrinting(true)
    
    const printWindow = window.open('', '_blank', 'width=900,height=600,scrollbars=yes,resizable=yes')
    if (!printWindow) {
      alert('Pop-up diblokir. Izinkan pop-up untuk mencetak.')
      setIsPrinting(false)
      return
    }

    const selectedText = window.getSelection()
    const range = selectedText?.rangeCount ? selectedText.getRangeAt(0) : null
    
    const clone = document.getElementById('print-area')?.cloneNode(true) || null
    
    const styles = Array.from(document.styleSheets)
      .map(sheet => {
        try {
          return Array.from(sheet.cssRules)
            .map(rule => rule.cssText)
            .join('\n')
        } catch {
          return ''
        }
      })
      .join('\n')

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Cetak - ${title}</title>
          <style>
            ${styles}
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            
            * { box-sizing: border-box; }
            body {
              font-family: 'Inter', sans-serif;
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
            .print-meta {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 16px;
              font-size: 11px;
              color: #64748b;
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
            }
            table thead th:last-child {
              border-right: none;
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
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            .font-semibold { font-weight: 600; }
            .text-xs { font-size: 11px; }
            .text-zinc-500 { color: #64748b; }
            .text-white { color: #ffffff; }
            .text-blue-400 { color: #60a5fa; }
            .text-emerald-400 { color: #34d399; }
            .text-red-400 { color: #f87171; }
            .bg-blue-500\\/10 { background: rgba(59,130,246,0.1); }
            .bg-emerald-500\\/10 { background: rgba(16,185,129,0.1); }
            .bg-red-500\\/10 { background: rgba(239,68,68,0.1); }
            .bg-amber-500\\/10 { background: rgba(245,158,11,0.1); }
            .border { border-width: 1px; border-style: solid; border-color: #e2e8f0; }
            .rounded { border-radius: 4px; }
            .px-2 { padding-left: 8px; padding-right: 8px; }
            .py-0\\.5 { padding-top: 2px; padding-bottom: 2px; }
            .inline-flex { display: inline-flex; }
            .truncate {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              max-width: 160px;
            }
            .signature-area {
              margin-top: 32px;
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 32px;
            }
            .signature-box {
              text-align: center;
            }
            .signature-line {
              border-bottom: 1px solid #94a3b8;
              height: 48px;
              margin-bottom: 4px;
            }
            .signature-label {
              font-size: 11px;
              color: #64748b;
              font-weight: 500;
            }
            @media print {
              body { padding: 0; }
              .no-print { display: none !important; }
              table { page-break-inside: auto; }
              table tr { page-break-inside: avoid; page-break-after: auto; }
              table thead { display: table-header-group; }
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            <div class="print-header">
              <h1>Data Pinjaman Aktif</h1>
              <p>Dicetak pada ${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} | ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
            <div id="print-content"></div>
            <div class="signature-area">
              <div class="signature-box">
                <div class="signature-line"></div>
                <div class="signature-label">Peminjam</div>
              </div>
              <div class="signature-box">
                <div class="signature-line"></div>
                <div class="signature-label">Petugas</div>
              </div>
            </div>
          </div>
          <script>
            const source = document.getElementById('print-area');
            const target = document.getElementById('print-content');
            if (source && target) {
              target.innerHTML = source.innerHTML;
            }
            window.onload = function() {
              window.print();
              setTimeout(() => window.close(), 100);
            };
          </script>
        </body>
      </html>
    `

    printWindow.document.write(printContent)
    printWindow.document.close()
    
    setTimeout(() => setIsPrinting(false), 500)
  }

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
  )
}
