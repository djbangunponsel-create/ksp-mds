'use client';

import { useState, useEffect } from 'react';

const formatRupiah = (value: string | number): string => {
  const num = typeof value === 'string' ? value.replace(/\./g, '') : value;
  const parsed = parseInt(num.toString()) || 0;
  return parsed.toLocaleString('id-ID');
};

interface Pinjaman {
  id: string;
  No_Anggota: string;
  Nominal_Pinjaman: number;
  Tenor: number;
  Bunga: number;
  Status: 'Aktif' | 'Lunas';
  Tanggal: string;
}

interface Angsuran {
  id: string;
  No_Anggota: string;
  Angsuran_Pokok: number;
  Angsuran_Bunga: number;
  Tanggal: string;
}

export default function PinjamanAngsuranPage() {
  const [pinjaman, setPinjaman] = useState<Pinjaman[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('transaksi-pinjaman');
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });
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
  const [pinjamanForm, setPinjamanForm] = useState({
    No_Anggota: '',
    Nominal_Pinjaman: 0,
    Tenor: 0,
  });
  const [angsuranForm, setAngsuranForm] = useState({
    No_Anggota: '',
    Angsuran_Pokok: 0,
    Angsuran_Bunga: 0,
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('transaksi-pinjaman', JSON.stringify(pinjaman));
      } catch {}
    }
  }, [pinjaman]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('transaksi-angsuran', JSON.stringify(angsuran));
      } catch {}
    }
  }, [angsuran]);

  const handlePinjamanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'Nominal_Pinjaman') {
      const rawValue = value.replace(/\./g, '');
      setPinjamanForm(prev => ({
        ...prev,
        [name]: parseInt(rawValue) || 0
      }));
    } else {
      setPinjamanForm(prev => ({
        ...prev,
        [name]: name === 'Tenor' ? parseFloat(value) || 0 : value
      }));
    }
  };

  const handleAngsuranChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'Angsuran_Pokok' || name === 'Angsuran_Bunga') {
      const rawValue = value.replace(/\./g, '');
      setAngsuranForm(prev => ({
        ...prev,
        [name]: parseInt(rawValue) || 0
      }));
    } else {
      setAngsuranForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePinjamanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinjamanForm.No_Anggota || pinjamanForm.Nominal_Pinjaman <= 0 || pinjamanForm.Tenor <= 0) {
      alert('Semua field harus diisi dengan benar');
      return;
    }

    const newPinjaman: Pinjaman = {
      id: Date.now().toString(),
      ...pinjamanForm,
      Bunga: 0,
      Status: 'Aktif',
      Tanggal: new Date().toISOString().split('T')[0],
    };

    const existing = localStorage.getItem('transaksi-pinjaman');
    const data = existing ? JSON.parse(existing) : [];
    const updated = [...data, newPinjaman];
    setPinjaman(updated);

    setPinjamanForm({
      No_Anggota: '',
      Nominal_Pinjaman: 0,
      Tenor: 0,
    });
  };

  const handleAngsuranSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!angsuranForm.No_Anggota || angsuranForm.Angsuran_Pokok <= 0 || angsuranForm.Angsuran_Bunga <= 0) {
      alert('Semua field harus diisi dengan benar');
      return;
    }

    const newAngsuran: Angsuran = {
      id: Date.now().toString(),
      ...angsuranForm,
      Tanggal: new Date().toISOString().split('T')[0],
    };

    const existing = localStorage.getItem('transaksi-angsuran');
    const data = existing ? JSON.parse(existing) : [];
    const updated = [...data, newAngsuran];
    setAngsuran(updated);

    setAngsuranForm({
      No_Anggota: '',
      Angsuran_Pokok: 0,
      Angsuran_Bunga: 0,
    });
  };

  const handleDeletePinjaman = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data pinjaman ini?')) {
      const updated = pinjaman.filter(p => p.id !== id);
      setPinjaman(updated);
    }
  };

  const handleDeleteAngsuran = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data angsuran ini?')) {
      const updated = angsuran.filter(a => a.id !== id);
      setAngsuran(updated);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-900 text-neutral-100 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Transaksi - Pinjaman & Angsuran</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-neutral-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Form Pinjaman</h2>
            <form onSubmit={handlePinjamanSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">No_Anggota</label>
                <input
                  type="text"
                  name="No_Anggota"
                  value={pinjamanForm.No_Anggota}
                  onChange={handlePinjamanChange}
                  className="w-full px-3 py-2 bg-neutral-700 text-neutral-100 rounded border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nominal_Pinjaman</label>
                <input
                  type="text"
                  name="Nominal_Pinjaman"
                  value={pinjamanForm.Nominal_Pinjaman ? formatRupiah(pinjamanForm.Nominal_Pinjaman) : ''}
                  onChange={handlePinjamanChange}
                  className="w-full px-3 py-2 bg-neutral-700 text-neutral-100 rounded border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: 10.000.000"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tenor (bulan)</label>
                <input
                  type="number"
                  name="Tenor"
                  value={pinjamanForm.Tenor}
                  onChange={handlePinjamanChange}
                  className="w-full px-3 py-2 bg-neutral-700 text-neutral-100 rounded border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Simpan Pinjaman
              </button>
            </form>
          </div>

          <div className="bg-neutral-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Form Bayar Angsuran</h2>
            <form onSubmit={handleAngsuranSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">No_Anggota</label>
                <input
                  type="text"
                  name="No_Anggota"
                  value={angsuranForm.No_Anggota}
                  onChange={handleAngsuranChange}
                  className="w-full px-3 py-2 bg-neutral-700 text-neutral-100 rounded border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Angsuran_Pokok</label>
                <input
                  type="text"
                  name="Angsuran_Pokok"
                  value={angsuranForm.Angsuran_Pokok ? formatRupiah(angsuranForm.Angsuran_Pokok) : ''}
                  onChange={handleAngsuranChange}
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
                  value={angsuranForm.Angsuran_Bunga ? formatRupiah(angsuranForm.Angsuran_Bunga) : ''}
                  onChange={handleAngsuranChange}
                  className="w-full px-3 py-2 bg-neutral-700 text-neutral-100 rounded border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: 50.000"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Simpan Angsuran
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Data Pinjaman</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-neutral-800 border border-neutral-700">
            <thead>
              <tr className="bg-neutral-700">
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-300 border-b border-neutral-600">Tanggal</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-300 border-b border-neutral-600">No_Anggota</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-300 border-b border-neutral-600">Nominal_Pinjaman</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-300 border-b border-neutral-600">Tenor</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-300 border-b border-neutral-600">Bunga</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-300 border-b border-neutral-600">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-300 border-b border-neutral-600">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pinjaman.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-4 text-center text-neutral-400">Belum ada data pinjaman</td>
                </tr>
              ) : (
                pinjaman.map((item) => (
                  <tr key={item.id} className="border-t border-neutral-700">
                    <td className="px-4 py-3 text-sm text-neutral-100 border-b border-neutral-600">{item.Tanggal}</td>
                    <td className="px-4 py-3 text-sm text-neutral-100 border-b border-neutral-600">{item.No_Anggota}</td>
                    <td className="px-4 py-3 text-sm text-neutral-100 border-b border-neutral-600">Rp {formatRupiah(item.Nominal_Pinjaman)}</td>
                    <td className="px-4 py-3 text-sm text-neutral-100 border-b border-neutral-600">{item.Tenor} bulan</td>
                    <td className="px-4 py-3 text-sm text-neutral-100 border-b border-neutral-600">{item.Bunga}%</td>
                    <td className="px-4 py-3 text-sm text-neutral-100 border-b border-neutral-600">{item.Status}</td>
                    <td className="px-4 py-3 text-sm text-neutral-100 border-b border-neutral-600">
                      <button onClick={() => handleDeletePinjaman(item.id)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">Hapus</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Data Angsuran</h2>
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
                      <button onClick={() => handleDeleteAngsuran(item.id)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">Hapus</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}