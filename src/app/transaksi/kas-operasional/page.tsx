'use client';

import { useState, useEffect } from 'react';

const formatRupiah = (value: string | number): string => {
  const num = typeof value === 'string' ? value.replace(/\./g, '') : value;
  const parsed = parseInt(num.toString()) || 0;
  return parsed.toLocaleString('id-ID');
};

interface KasOperasional {
  id: string;
  Kategori: string;
  Jenis_Arus: 'Masuk' | 'Keluar';
  Nominal: number;
  Tanggal: string;
}

export default function KasOperasionalPage() {
  const [kas, setKas] = useState<KasOperasional[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('transaksi-kas-operasional');
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });
  const [formData, setFormData] = useState({
    Kategori: '',
    Jenis_Arus: 'Masuk' as 'Masuk' | 'Keluar',
    Nominal: 0,
  });

  const kategoriOptions = ['Operasional', 'Gaji', 'Listrik', 'Air', 'Internet', 'Sewa Kantor', 'Lainnya'];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('transaksi-kas-operasional', JSON.stringify(kas));
      } catch {}
    }
  }, [kas]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'Nominal') {
      const rawValue = value.replace(/\./g, '');
      setFormData(prev => ({ ...prev, [name]: parseInt(rawValue) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.Kategori || formData.Nominal <= 0) {
      alert('Kategori dan Nominal harus diisi dengan benar');
      return;
    }

    const newKas: KasOperasional = {
      id: Date.now().toString(),
      ...formData,
      Tanggal: new Date().toISOString().split('T')[0],
    };

    const existing = localStorage.getItem('transaksi-kas-operasional');
    const data = existing ? JSON.parse(existing) : [];
    setKas([...data, newKas]);

    setFormData({
      Kategori: '',
      Jenis_Arus: 'Masuk',
      Nominal: 0,
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      const updated = kas.filter(k => k.id !== id);
      setKas(updated);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-900 text-neutral-100 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Transaksi - Kas Operasional</h1>
        
        <form onSubmit={handleSubmit} className="bg-neutral-800 p-6 rounded-lg mb-6 max-w-2xl">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Kategori Biaya</label>
              <select
                name="Kategori"
                value={formData.Kategori}
                onChange={handleFormChange}
                className="w-full px-3 py-2 bg-neutral-700 text-neutral-100 rounded border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Pilih Kategori</option>
                {kategoriOptions.map(kat => (
                  <option key={kat} value={kat}>{kat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Jenis_Arus</label>
              <select
                name="Jenis_Arus"
                value={formData.Jenis_Arus}
                onChange={handleFormChange}
                className="w-full px-3 py-2 bg-neutral-700 text-neutral-100 rounded border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Masuk">Masuk</option>
                <option value="Keluar">Keluar</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Nominal</label>
              <input
                type="text"
                name="Nominal"
                value={formData.Nominal ? formatRupiah(formData.Nominal) : ''}
                onChange={handleFormChange}
                className="w-full px-3 py-2 bg-neutral-700 text-neutral-100 rounded border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Contoh: 10.000.000"
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Simpan Transaksi
            </button>
          </div>
        </form>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-neutral-800 border border-neutral-700">
          <thead>
            <tr className="bg-neutral-700">
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-300 border-b border-neutral-600">Tanggal</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-300 border-b border-neutral-600">Kategori</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-300 border-b border-neutral-600">Jenis_Arus</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-300 border-b border-neutral-600">Nominal</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-300 border-b border-neutral-600">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {kas.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-4 text-center text-neutral-400">Belum ada data kas operasional</td>
              </tr>
            ) : (
              kas.map((item) => (
                <tr key={item.id} className="border-t border-neutral-700">
                  <td className="px-4 py-3 text-sm text-neutral-100 border-b border-neutral-600">{item.Tanggal}</td>
                  <td className="px-4 py-3 text-sm text-neutral-100 border-b border-neutral-600">{item.Kategori}</td>
                  <td className="px-4 py-3 text-sm border-b border-neutral-600">
                    <span className={`px-2 py-1 rounded ${item.Jenis_Arus === 'Masuk' ? 'bg-green-600' : 'bg-red-600'} text-white`}>
                      {item.Jenis_Arus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-100 border-b border-neutral-600">Rp {formatRupiah(item.Nominal)}</td>
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