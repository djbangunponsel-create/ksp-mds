'use client';

import { useState, useEffect } from 'react';

const formatRupiah = (value: string | number): string => {
  const num = typeof value === 'string' ? value.replace(/\./g, '') : value;
  const parsed = parseInt(num.toString()) || 0;
  return parsed.toLocaleString('id-ID');
};

interface Angsuran {
  id: string;
  No_Anggota: string;
  Angsuran_Pokok: number;
  Angsuran_Bunga: number;
  Tanggal: string;
}

export default function PinjamanAngsuranPage() {
  const [angsuran, setAngsuran] = useState<Angsuran[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('transaksi-angsuran');
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });
  const [formData, setFormData] = useState({
    No_Anggota: '',
    Angsuran_Pokok: 0,
    Angsuran_Bunga: 0,
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('transaksi-angsuran', JSON.stringify(angsuran));
      } catch {}
    }
  }, [angsuran]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'Angsuran_Pokok' || name === 'Angsuran_Bunga') {
      const rawValue = value.replace(/\./g, '');
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(rawValue) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.No_Anggota || formData.Angsuran_Pokok <= 0 || formData.Angsuran_Bunga <= 0) {
      alert('Semua field harus diisi dengan benar');
      return;
    }

    const newAngsuran: Angsuran = {
      id: Date.now().toString(),
      ...formData,
      Tanggal: new Date().toISOString().split('T')[0],
    };

    setAngsuran(prev => [...prev, newAngsuran]);
    setFormData({
      No_Anggota: '',
      Angsuran_Pokok: 0,
      Angsuran_Bunga: 0,
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data angsuran ini?')) {
      setAngsuran(prev => prev.filter(a => a.id !== id));
    }
  };

  return (
    <main className="min-h-screen bg-neutral-900 text-neutral-100 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Transaksi - Pinjaman & Angsuran</h1>
        
        <form onSubmit={handleSubmit} className="bg-neutral-800 p-6 rounded-lg mb-6 max-w-2xl">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">No_Anggota</label>
              <input
                type="text"
                name="No_Anggota"
                value={formData.No_Anggota}
                onChange={handleFormChange}
                className="w-full px-3 py-2 bg-neutral-700 text-neutral-100 rounded border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Angsuran_Pokok</label>
              <input
                type="text"
                name="Angsuran_Pokok"
                value={formData.Angsuran_Pokok ? formatRupiah(formData.Angsuran_Pokok) : ''}
                onChange={handleFormChange}
                className="w-full px-3 py-2 bg-neutral-700 text-neutral-100 rounded border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Contoh: 500.000"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Angsuran_Bunga</label>
              <input
                type="text"
                name="Angsuran_Bunga"
                value={formData.Angsuran_Bunga ? formatRupiah(formData.Angsuran_Bunga) : ''}
                onChange={handleFormChange}
                className="w-full px-3 py-2 bg-neutral-700 text-neutral-100 rounded border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Contoh: 50.000"
                required
              />
            </div>
            <div className="flex items-end">
              <span className="text-sm text-neutral-400">Total: Rp {formatRupiah(formData.Angsuran_Pokok + formData.Angsuran_Bunga)}</span>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Simpan Angsuran
            </button>
          </div>
        </form>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-neutral-800 border border-neutral-700">
          <thead>
            <tr className="bg-neutral-700">
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-300 border-b border-neutral-600">Tanggal</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-300 border-b border-neutral-600">No_Anggota</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-300 border-b border-neutral-600">Angsuran_Pokok</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-300 border-b border-neutral-600">Angsuran_Bunga</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-300 border-b border-neutral-600">Total</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-300 border-b border-neutral-600">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {angsuran.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-4 text-center text-neutral-400">Belum ada data angsuran</td>
              </tr>
            ) : (
              angsuran.map((item) => (
                <tr key={item.id} className="border-t border-neutral-700">
                  <td className="px-4 py-3 text-sm text-neutral-100 border-b border-neutral-600">{item.Tanggal}</td>
                  <td className="px-4 py-3 text-sm text-neutral-100 border-b border-neutral-600">{item.No_Anggota}</td>
                  <td className="px-4 py-3 text-sm text-neutral-100 border-b border-neutral-600">Rp {formatRupiah(item.Angsuran_Pokok)}</td>
                  <td className="px-4 py-3 text-sm text-neutral-100 border-b border-neutral-600">Rp {formatRupiah(item.Angsuran_Bunga)}</td>
                  <td className="px-4 py-3 text-sm text-neutral-100 border-b border-neutral-600">Rp {formatRupiah(item.Angsuran_Pokok + item.Angsuran_Bunga)}</td>
                  <td className="px-4 py-3 text-sm text-neutral-100 border-b border-neutral-600">
                    <button onClick={() => handleDelete(item.id)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">Hapus</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}