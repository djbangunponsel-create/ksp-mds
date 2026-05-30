'use client';

import { useState, useEffect } from 'react';

interface Anggota {
  No_Anggota: string;
  NAMA_ANGGOTA: string;
  [key: string]: string;
}

interface TransaksiSimpanan {
  id: string;
  No_Anggota: string;
  Nama_Anggota: string;
  Jenis_Simpanan: string;
  Nominal: number;
  Tenor?: number;
  Suku_Bunga: number;
  Tanggal: string;
}

const jenisSimpananOptions = [
  { value: 'SP', label: 'Simpanan Pokok (SP)' },
  { value: 'SW', label: 'Simpanan Wajib (SW)' },
  { value: 'SWK', label: 'Simpanan Wajib Kapitalisasi (SWK)' },
  { value: 'SKS', label: 'Simpanan Kapitalisasi Sukarela (SKS)' },
  { value: 'Sibuhar', label: 'Simpanan Bunga Harian (Sibuhar)' },
  { value: 'Simapan', label: 'Simpanan Masa Depan (Simapan)' },
  { value: 'Sihat', label: 'Simpanan Hari Tua (Sihat)' },
  { value: 'Sihar', label: 'Simpanan Hari Raya (Sihar)' },
  { value: 'Sisujang', label: 'Simpanan Sukarela Berjangka (Sisujang)' },
];

const tenorOptions = [1, 3, 6, 12, 24];

const getSukuBungaSisujang = (nominal: number, tenor: number): number => {
  if (nominal >= 250000000) {
    if (tenor === 1) return 7;
    if (tenor === 3) return 7.5;
    if (tenor === 6) return 8;
    if (tenor === 12) return 8.5;
    if (tenor === 24) return 9;
  } else if (nominal >= 100000000) {
    if (tenor === 1) return 6.5;
    if (tenor === 3) return 7;
    if (tenor === 6) return 7.5;
    if (tenor === 12) return 8;
    if (tenor === 24) return 8.5;
  } else if (nominal >= 50000000) {
    if (tenor === 1) return 6;
    if (tenor === 3) return 6.5;
    if (tenor === 6) return 7;
    if (tenor === 12) return 7.5;
    if (tenor === 24) return 8;
  } else if (nominal >= 20000000) {
    if (tenor === 1) return 5.5;
    if (tenor === 3) return 6;
    if (tenor === 6) return 6.5;
    if (tenor === 12) return 7;
    if (tenor === 24) return 7.5;
  } else if (nominal >= 5000000) {
    if (tenor === 1) return 5;
    if (tenor === 3) return 5.5;
    if (tenor === 6) return 6;
    if (tenor === 12) return 6.5;
    if (tenor === 24) return 7;
  } else if (nominal >= 2000000) {
    if (tenor === 1) return 4.5;
    if (tenor === 3) return 5;
    if (tenor === 6) return 5.5;
    if (tenor === 12) return 6;
    if (tenor === 24) return 6.5;
  }
  return 0;
};

const getSukuBungaByJenis = (jenis: string): number => {
  if (jenis === 'Sisujang') return 0;
  if (jenis === 'Sibuhar') return 3;
  if (jenis === 'Simapan') return 5;
  if (jenis === 'Sihat') return 6;
  if (jenis === 'Sihar') return 4;
  return 0;
};

export default function TransaksiSimpananPage() {
  const [anggota, setAnggota] = useState<Anggota[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('members');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [transaksi, setTransaksi] = useState<TransaksiSimpanan[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('data_transaksi_simpanan');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [formData, setFormData] = useState({
    No_Anggota: '',
    Jenis_Simpanan: 'SP',
    Nominal: 0,
    Tenor: 0,
  });

  useEffect(() => {
    localStorage.setItem('data_transaksi_simpanan', JSON.stringify(transaksi));
  }, [transaksi]);

  const isSisujang = formData.Jenis_Simpanan === 'Sisujang';
  const selectedAnggota = anggota.find(a => a.No_Anggota === formData.No_Anggota);
  const sukuBungaOtomatis = isSisujang
    ? getSukuBungaSisujang(formData.Nominal, formData.Tenor)
    : getSukuBungaByJenis(formData.Jenis_Simpanan);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'Nominal' || name === 'Tenor' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.No_Anggota || formData.Nominal <= 0) {
      alert('Pilih Anggota dan isi Nominal Transaksi');
      return;
    }
    if (isSisujang && formData.Tenor === 0) {
      alert('Tenor harus diisi untuk Simpanan Sukarela Berjangka (Sisujang)');
      return;
    }

    const newTransaksi: TransaksiSimpanan = {
      id: Date.now().toString(),
      No_Anggota: formData.No_Anggota,
      Nama_Anggota: selectedAnggota?.NAMA_ANGGOTA || '',
      Jenis_Simpanan: formData.Jenis_Simpanan,
      Nominal: formData.Nominal,
      Tenor: isSisujang ? formData.Tenor : undefined,
      Suku_Bunga: sukuBungaOtomatis,
      Tanggal: new Date().toISOString().split('T')[0],
    };

    setTransaksi(prev => [...prev, newTransaksi]);
    setFormData({
      No_Anggota: '',
      Jenis_Simpanan: 'SP',
      Nominal: 0,
      Tenor: 0,
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      setTransaksi(prev => prev.filter(t => t.id !== id));
    }
  };

  return (
    <main className="min-h-screen bg-neutral-900 text-neutral-100 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Transaksi - Simpanan</h1>
        
        <form onSubmit={handleSubmit} className="bg-neutral-800 p-6 rounded-lg mb-6 max-w-2xl">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Pilih Anggota</label>
              <select
                name="No_Anggota"
                value={formData.No_Anggota}
                onChange={handleFormChange}
                className="w-full px-3 py-2 bg-neutral-700 text-neutral-100 rounded border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Pilih Anggota</option>
                {anggota.map(a => (
                  <option key={a.No_Anggota} value={a.No_Anggota}>
                    {a.No_Anggota} - {a.NAMA_ANGGOTA}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Jenis Simpanan</label>
              <select
                name="Jenis_Simpanan"
                value={formData.Jenis_Simpanan}
                onChange={handleFormChange}
                className="w-full px-3 py-2 bg-neutral-700 text-neutral-100 rounded border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {jenisSimpananOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Nominal Transaksi</label>
              <input
                type="number"
                name="Nominal"
                value={formData.Nominal}
                onChange={handleFormChange}
                className="w-full px-3 py-2 bg-neutral-700 text-neutral-100 rounded border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                required
              />
            </div>
            {isSisujang && (
              <div>
                <label className="block text-sm font-medium mb-1">Tenor (Bulan)</label>
                <select
                  name="Tenor"
                  value={formData.Tenor}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 bg-neutral-700 text-neutral-100 rounded border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value={0}>Pilih Tenor</option>
                  {tenorOptions.map(t => (
                    <option key={t} value={t}>{t} Bulan</option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1">Bunga Terkunci (% p.a)</label>
              <input
                type="text"
                value={sukuBungaOtomatis}
                readOnly
                className="w-full px-3 py-2 bg-neutral-600 text-neutral-300 rounded border border-neutral-600 focus:outline-none"
                placeholder="Bunga otomatis terisi"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
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
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-300 border-b border-neutral-600">No_Anggota</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-300 border-b border-neutral-600">Nama_Anggota</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-300 border-b border-neutral-600">Jenis_Simpanan</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-300 border-b border-neutral-600">Tenor</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-300 border-b border-neutral-600">Nominal</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-300 border-b border-neutral-600">Bunga_Terkunci (%)</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-300 border-b border-neutral-600">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {transaksi.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-4 text-center text-neutral-400">
                  Belum ada data transaksi simpanan
                </td>
              </tr>
            ) : (
              transaksi.map((item) => (
                <tr key={item.id} className="border-t border-neutral-700">
                  <td className="px-4 py-3 text-sm text-neutral-100 border-b border-neutral-600">{item.Tanggal}</td>
                  <td className="px-4 py-3 text-sm text-neutral-100 border-b border-neutral-600">{item.No_Anggota}</td>
                  <td className="px-4 py-3 text-sm text-neutral-100 border-b border-neutral-600">{item.Nama_Anggota}</td>
                  <td className="px-4 py-3 text-sm text-neutral-100 border-b border-neutral-600">{item.Jenis_Simpanan}</td>
                  <td className="px-4 py-3 text-sm text-neutral-100 border-b border-neutral-600">{item.Tenor ? `${item.Tenor} Bulan` : '-'}</td>
                  <td className="px-4 py-3 text-sm text-neutral-100 border-b border-neutral-600">Rp {item.Nominal.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-neutral-100 border-b border-neutral-600">{item.Suku_Bunga}%</td>
                  <td className="px-4 py-3 text-sm text-neutral-100 border-b border-neutral-600">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                    >
                      Hapus
                    </button>
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