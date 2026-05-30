'use client';

import { useState, useEffect } from 'react';

const formatRupiah = (value: string | number): string => {
  const num = typeof value === 'string' ? value.replace(/\./g, '') : value;
  const parsed = parseInt(num.toString()) || 0;
  return parsed.toLocaleString('id-ID');
};

interface Anggota {
  No_Anggota: string;
  NAMA_ANGGOTA: string;
  [key: string]: string;
}

interface Pinjaman {
  id: string;
  No_Anggota: string;
  Jenis_Pinjaman: string;
  Nominal_Pinjaman: number;
  Tenor: number;
  Bunga: number;
  Status: 'Aktif' | 'Lunas';
  Tanggal: string;
  potongan_administrasi: number;
  potongan_danaSosial: number;
  potongan_danaRisiko: number;
  potongan_insentifPJ: number;
  potongan_materai: number;
  potongan_legalNotaris: number;
  potongan_bpjstk: number;
  jumlah_potongan: number;
  jumlah_bersih: number;
  opsi_agunan: string;
  jenis_agunan: string;
  detail_agunan: string;
}

const jenisPinjamanOptions = [
  { value: 'Flat', label: 'Pinjaman Flat' },
  { value: 'Musiman', label: 'Pinjaman Musiman' },
];

const bungaFlatOptions = [1.65, 1.7, 1.75, 1.8, 1.85, 2];

const tenorFlatOptions = Array.from({ length: 36 }, (_, i) => i + 1);
const tenorMusimanOptions = Array.from({ length: 8 }, (_, i) => i + 1);
const bpjstkBulanOptions = Array.from({ length: 12 }, (_, i) => i + 1);

const jenisAgunanOptions = [
  'Pendiri',
  'SHM',
  'Akta Tanah',
  'BPKB Roda 2',
  'BPKB Roda 4',
  'BPKB Roda 6/8',
  'Surat 3 Serangkai',
  'Simpanan (Semua jenis simpanan)',
];

export default function PinjamanPage() {
  const [anggota, setAnggota] = useState<Anggota[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('members');
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });
  const [pinjaman, setPinjaman] = useState<Pinjaman[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('data_pinjaman_aktif');
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });
  const [formData, setFormData] = useState({
    No_Anggota: '',
    Jenis_Pinjaman: 'Flat',
    Nominal_Pinjaman: 0,
    Tenor: 0,
    Bunga: 0,
    tanpaAgunan: false,
    materaiLembar: 0,
    legalNotaris: '',
    bpjstkBulan: 0,
    opsi_agunan: '',
    jenis_agunan: '',
    detail_agunan: '',
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('data_pinjaman_aktif', JSON.stringify(pinjaman));
      } catch {}
    }
  }, [pinjaman]);

  const isMusiman = formData.Jenis_Pinjaman === 'Musiman';
  const bungaTerkunci = isMusiman ? 2.5 : formData.Bunga;
  const menggunakanAgunan = formData.opsi_agunan === 'Ya (Pakai Agunan)';
  
  const angsuranPokokPerBulan = formData.Nominal_Pinjaman && formData.Tenor
    ? Math.round(formData.Nominal_Pinjaman / formData.Tenor)
    : 0;
  
  const angsuranBungaPerBulan = formData.Nominal_Pinjaman && bungaTerkunci > 0
    ? Math.round((formData.Nominal_Pinjaman * bungaTerkunci) / 100)
    : 0;

  const potonganAdministrasi = formData.Nominal_Pinjaman ? Math.round(formData.Nominal_Pinjaman * 0.02) : 0;
  const potonganDanaSosial = formData.Nominal_Pinjaman ? Math.round(formData.Nominal_Pinjaman * 0.01) : 0;
  const potonganDanaRisiko = formData.Nominal_Pinjaman ? Math.round(formData.Nominal_Pinjaman * 0.01) : 0;
  const potonganInsentifPJ = formData.tanpaAgunan && formData.Nominal_Pinjaman ? Math.round(formData.Nominal_Pinjaman * 0.01) : 0;
  const potonganMaterai = formData.materaiLembar > 0 ? formData.materaiLembar * 12000 : 0;
  const potonganLegalNotaris = formData.legalNotaris === 'Ya' ? 400000 : 0;
  const potonganBpjstk = formData.bpjstkBulan > 0 ? formData.bpjstkBulan * 20000 : 0;

  const totalPotongan = potonganAdministrasi + potonganDanaSosial + potonganDanaRisiko + potonganInsentifPJ + potonganMaterai + potonganLegalNotaris + potonganBpjstk;
  const jumlahBersih = formData.Nominal_Pinjaman - totalPotongan;

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (name === 'Nominal_Pinjaman') {
      const rawValue = value.replace(/\./g, '');
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(rawValue) || 0
      }));
    } else if (name === 'Bunga') {
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));
    } else if (name === 'Tenor' || name === 'materaiLembar' || name === 'bpjstkBulan') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value) || 0
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
    if (!formData.No_Anggota || formData.Nominal_Pinjaman <= 0 || formData.Tenor <= 0) {
      alert('Semua field harus diisi dengan benar');
      return;
    }
    if (!isMusiman && formData.Bunga <= 0) {
      alert('Bunga harus diisi untuk Pinjaman Flat');
      return;
    }

    // eslint-disable-next-line react-hooks/purity
    const timestamp = Date.now();
    const newPinjaman: Pinjaman = {
      id: `pinjaman-${timestamp}`,
      No_Anggota: formData.No_Anggota,
      Jenis_Pinjaman: formData.Jenis_Pinjaman,
      Nominal_Pinjaman: formData.Nominal_Pinjaman,
      Tenor: formData.Tenor,
      Bunga: bungaTerkunci,
      Status: 'Aktif',
      Tanggal: new Date().toISOString().split('T')[0],
      potongan_administrasi: potonganAdministrasi,
      potongan_danaSosial: potonganDanaSosial,
      potongan_danaRisiko: potonganDanaRisiko,
      potongan_insentifPJ: potonganInsentifPJ,
      potongan_materai: potonganMaterai,
      potongan_legalNotaris: potonganLegalNotaris,
      potongan_bpjstk: potonganBpjstk,
      jumlah_potongan: totalPotongan,
      jumlah_bersih: jumlahBersih,
      opsi_agunan: formData.opsi_agunan,
      jenis_agunan: formData.jenis_agunan,
      detail_agunan: formData.detail_agunan,
    };

    setPinjaman(prev => [...prev, newPinjaman]);
    setFormData({
      No_Anggota: '',
      Jenis_Pinjaman: 'Flat',
      Nominal_Pinjaman: 0,
      Tenor: 0,
      Bunga: 0,
      tanpaAgunan: false,
      materaiLembar: 0,
      legalNotaris: '',
      bpjstkBulan: 0,
      opsi_agunan: '',
      jenis_agunan: '',
      detail_agunan: '',
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data pinjaman ini?')) {
      setPinjaman(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <main className="min-h-screen bg-neutral-900 text-neutral-100 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Pinjaman</h1>
        
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
              <label className="block text-sm font-medium mb-1">Jenis Pinjaman</label>
              <select
                name="Jenis_Pinjaman"
                value={formData.Jenis_Pinjaman}
                onChange={handleFormChange}
                className="w-full px-3 py-2 bg-neutral-700 text-neutral-100 rounded border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {jenisPinjamanOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Nominal Pinjaman</label>
              <input
                type="text"
                name="Nominal_Pinjaman"
                value={formData.Nominal_Pinjaman ? formatRupiah(formData.Nominal_Pinjaman) : ''}
                onChange={handleFormChange}
                className="w-full px-3 py-2 bg-neutral-700 text-neutral-100 rounded border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Contoh: 10.000.000"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Opsi Agunan</label>
              <select
                name="opsi_agunan"
                value={formData.opsi_agunan}
                onChange={handleFormChange}
                className="w-full px-3 py-2 bg-neutral-700 text-neutral-100 rounded border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Pilih Opsi</option>
                <option value="Tidak Pakai Agunan">Tidak Pakai Agunan</option>
                <option value="Ya (Pakai Agunan)">Ya (Pakai Agunan)</option>
              </select>
            </div>
            {menggunakanAgunan && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Jenis Agunan</label>
                  <select
                    name="jenis_agunan"
                    value={formData.jenis_agunan}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 bg-neutral-700 text-neutral-100 rounded border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Pilih Jenis Agunan</option>
                    {jenisAgunanOptions.map(jenis => (
                      <option key={jenis} value={jenis}>{jenis}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Detail / No. Agunan</label>
                  <input
                    type="text"
                    name="detail_agunan"
                    value={formData.detail_agunan}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 bg-neutral-700 text-neutral-100 rounded border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan nomor/keterangan agunan"
                  />
                </div>
              </>
            )}
            {isMusiman ? (
              <div>
                <label className="block text-sm font-medium mb-1">Bunga (% per bulan) - Terkunci</label>
                <input
                  type="text"
                  value={bungaTerkunci}
                  readOnly
                  className="w-full px-3 py-2 bg-neutral-600 text-neutral-300 rounded border border-neutral-600 focus:outline-none"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium mb-1">Suku Bunga (% per bulan)</label>
                <select
                  name="Bunga"
                  value={formData.Bunga}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 bg-neutral-700 text-neutral-100 rounded border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={0}>Pilih Bunga</option>
                  {bungaFlatOptions.map(bunga => (
                    <option key={bunga} value={bunga}>{bunga}%</option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1">Jangka Waktu (bulan)</label>
              <select
                name="Tenor"
                value={formData.Tenor}
                onChange={handleFormChange}
                className="w-full px-3 py-2 bg-neutral-700 text-neutral-100 rounded border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value={0}>Pilih Tenor</option>
                {(isMusiman ? tenorMusimanOptions : tenorFlatOptions).map(t => (
                  <option key={t} value={t}>{t} Bulan</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Materai (lembar)</label>
              <input
                type="number"
                name="materaiLembar"
                value={formData.materaiLembar}
                onChange={handleFormChange}
                className="w-full px-3 py-2 bg-neutral-700 text-neutral-100 rounded border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                placeholder="Jumlah lembar"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Legalisasi Notaris</label>
              <select
                name="legalNotaris"
                value={formData.legalNotaris}
                onChange={handleFormChange}
                className="w-full px-3 py-2 bg-neutral-700 text-neutral-100 rounded border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tidak</option>
                <option value="Ya">Ya</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Iuran BPJSTK (bulan)</label>
              <select
                name="bpjstkBulan"
                value={formData.bpjstkBulan}
                onChange={handleFormChange}
                className="w-full px-3 py-2 bg-neutral-700 text-neutral-100 rounded border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={0}>Pilih Bulan</option>
                {bpjstkBulanOptions.map(b => (
                  <option key={b} value={b}>{b} Bulan</option>
                ))}
              </select>
            </div>
            
            <div className="col-span-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="tanpaAgunan"
                  checked={formData.tanpaAgunan}
                  onChange={handleFormChange}
                  className="w-4 h-4"
                />
                <span className="text-sm">Tanpa Agunan / Nilai Jual Agunan Kurang (potong 1%)</span>
              </label>
            </div>
          </div>
          
          {formData.Nominal_Pinjaman > 0 && (
            <div className="col-span-2 bg-neutral-700 p-3 rounded mt-4">
              <div className="text-sm font-medium text-neutral-200 mb-2">Estimasi Potongan & Pencairan:</div>
              <div className="text-xs space-y-1">
                <div className="border-b border-neutral-600 pb-1">Total Nominal Pinjaman: <span className="font-bold">Rp {formatRupiah(formData.Nominal_Pinjaman)}</span></div>
                <div className="text-red-300">Potongan Administrasi (2%): Rp {formatRupiah(potonganAdministrasi)}</div>
                <div className="text-red-300">Potongan Dana Sosial (1%): Rp {formatRupiah(potonganDanaSosial)}</div>
                <div className="text-red-300">Potongan Dana Risiko (1%): Rp {formatRupiah(potonganDanaRisiko)}</div>
                {formData.tanpaAgunan && <div className="text-red-300">Potongan Insentif PJ (1%): Rp {formatRupiah(potonganInsentifPJ)}</div>}
                <div className="text-red-300">Potongan Materai: Rp {formatRupiah(potonganMaterai)}</div>
                <div className="text-red-300">Potongan Legal Notaris: Rp {formatRupiah(potonganLegalNotaris)}</div>
                <div className="text-red-300">Potongan BPJSTK: Rp {formatRupiah(potonganBpjstk)}</div>
                <div className="border-t border-neutral-600 pt-1">Total Potongan: <span className="font-bold">Rp {formatRupiah(totalPotongan)}</span></div>
                <div className="border-t-2 border-blue-500 pt-1 text-blue-300">Jumlah Bersih Diterima Anggota: <span className="font-bold">Rp {formatRupiah(jumlahBersih)}</span></div>
              </div>
            </div>
          )}
          
          {formData.Nominal_Pinjaman > 0 && formData.Tenor > 0 && (
            <div className="col-span-2 bg-neutral-700 p-3 rounded mt-2">
              <div className="text-sm font-medium text-neutral-200 mb-2">Estimasi Angsuran per Bulan:</div>
              <div className="text-xs space-y-1">
                <div>Angsuran Pokok: <span className="font-bold">Rp {formatRupiah(angsuranPokokPerBulan)}</span></div>
                <div>Angsuran Bunga: <span className="font-bold">Rp {formatRupiah(angsuranBungaPerBulan)}</span></div>
                <div className="border-t border-neutral-600 pt-1">Total: <span className="font-bold">Rp {formatRupiah(angsuranPokokPerBulan + angsuranBungaPerBulan)}</span></div>
              </div>
            </div>
          )}
          
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Simpan Pinjaman
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
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-300 border-b border-neutral-600">Jenis_Pinjaman</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-300 border-b border-neutral-600">Nominal</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-300 border-b border-neutral-600">Jangka Waktu</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-300 border-b border-neutral-600">Bunga</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-300 border-b border-neutral-600">Opsi Agunan</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-300 border-b border-neutral-600">Jenis Agunan</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-300 border-b border-neutral-600">Detail Agunan</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-300 border-b border-neutral-600">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-300 border-b border-neutral-600">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {pinjaman.length === 0 ? (
              <tr>
                <td colSpan={11} className="px-4 py-4 text-center text-neutral-400">Belum ada data pinjaman</td>
              </tr>
            ) : (
              pinjaman.map((item) => (
                <tr key={item.id} className="border-t border-neutral-700">
                  <td className="px-4 py-3 text-sm text-neutral-100 border-b border-neutral-600">{item.Tanggal}</td>
                  <td className="px-4 py-3 text-sm text-neutral-100 border-b border-neutral-600">{item.No_Anggota}</td>
                  <td className="px-4 py-3 text-sm text-neutral-100 border-b border-neutral-600">{item.Jenis_Pinjaman}</td>
                  <td className="px-4 py-3 text-sm text-neutral-100 border-b border-neutral-600">Rp {formatRupiah(item.Nominal_Pinjaman)}</td>
                  <td className="px-4 py-3 text-sm text-neutral-100 border-b border-neutral-600">{item.Tenor} bulan</td>
                  <td className="px-4 py-3 text-sm text-neutral-100 border-b border-neutral-600">{item.Bunga}%</td>
                  <td className="px-4 py-3 text-sm text-neutral-100 border-b border-neutral-600">{item.opsi_agunan}</td>
                  <td className="px-4 py-3 text-sm text-neutral-100 border-b border-neutral-600">{item.jenis_agunan}</td>
                  <td className="px-4 py-3 text-sm text-neutral-100 border-b border-neutral-600">{item.detail_agunan}</td>
                  <td className="px-4 py-3 text-sm text-neutral-100 border-b border-neutral-600">{item.Status}</td>
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