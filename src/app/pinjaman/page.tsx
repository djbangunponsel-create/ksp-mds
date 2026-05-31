'use client';

import { useState, useEffect } from 'react';
import PrintButton from '@/components/PrintButton';

const formatRupiah = (value: number): string => {
  return Math.round(value).toLocaleString('id-ID');
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
  potongan_insentifPJP: number;
  potongan_materai: number;
  potongan_legalNotaris: number;
  potongan_bpjstk: number;
  jumlah_potongan: number;
  jumlah_bersih: number;
  opsi_agunan: string;
  jenis_agunan: string;
  detail_agunan: string;
  agunan_no_dokumen: string;
  agunan_nama_pemilik: string;
  agunan_luas_tanah: string;
  agunan_luas_bangunan: string;
  agunan_lokasi: string;
  agunan_no_bpkb: string;
  agunan_identitas_kendaraan: string;
  agunan_no_polisi: string;
  agunan_no_rangka: string;
  agunan_no_mesin: string;
  agunan_total_saldo: number;
  agunan_tgl_terbit: string;
  agunan_berlaku_sampai: string;
  agunan_atas_nama: string;
  harga_likuidasi: number;
  harga_est_fisik: number;
  harga_est_bpkb: number;
  harga_est_lain: number;
}

const jenisPinjamanOptions = [
  { value: 'Flat', label: 'Pinjaman Flat' },
  { value: 'Musiman', label: 'Pinjaman Musiman' },
];

const bungaFlatOptions = [1.65, 1.7, 1.75, 1.8, 1.85, 2];
const tenorFlatOptions = Array.from({ length: 36 }, (_, i) => i + 1);
const tenorMusimanOptions = Array.from({ length: 8 }, (_, i) => i + 1);

const jenisAgunanOptions = [
  'Pendiri', 'SHM', 'Akta Tanah', 'BPKB Roda 2', 'BPKB Roda 4',
  'BPKB Roda 6/8', 'Surat 3 Serangkai', 'Simpanan (Semua jenis simpanan)',
];

export default function PinjamanPage() {
  const [anggota] = useState<Anggota[]>(() => {
    if (typeof window !== 'undefined') {
      try { return JSON.parse(localStorage.getItem('members') || '[]'); } catch { return []; }
    }
    return [];
  });
  const [pinjaman, setPinjaman] = useState<Pinjaman[]>(() => {
    if (typeof window !== 'undefined') {
      try { return JSON.parse(localStorage.getItem('data_pinjaman_aktif') || '[]'); } catch { return []; }
    }
    return [];
  });
  const [formData, setFormData] = useState({
    No_Anggota: '' as string,
    Jenis_Pinjaman: 'Flat' as 'Flat' | 'Musiman',
    Nominal_Pinjaman: 0,
    Tenor: 0,
    Bunga: 0,
    tanpaAgunan: false,
    notaris: '',
    bpjstk: '',
    bpjstkBulan: 0,
    opsi_agunan: '',
    jenis_agunan: '',
    detail_agunan: '',
    agunan_no_dokumen: '',
    agunan_nama_pemilik: '',
    agunan_luas_tanah: '',
    agunan_luas_bangunan: '',
    agunan_lokasi: '',
    agunan_no_bpkb: '',
    agunan_identitas_kendaraan: '',
    agunan_no_polisi: '',
    agunan_no_rangka: '',
    agunan_no_mesin: '',
    agunan_total_saldo: 0,
    agunan_tgl_terbit: '',
    agunan_berlaku_sampai: '',
    agunan_atas_nama: '',
    harga_likuidasi: 0,
    harga_est_fisik: 0,
    harga_est_bpkb: 0,
    harga_est_lain: 0,
    swkOption: '1%',
    hargaPasarAgunan: 0,
  });

  const [useBulan, setUseBulan] = useState(false);

  useEffect(() => {
    localStorage.setItem('data_pinjaman_aktif', JSON.stringify(pinjaman));
  }, [pinjaman]);

  const isMusiman = formData.Jenis_Pinjaman === 'Musiman';
  const bungaTerkunci = isMusiman ? 2.5 : formData.Bunga;

  const nilaiMurni = Math.round(parseFloat((formData.Nominal_Pinjaman || 0).toLocaleString('id-ID').replace(/\./g, '')) || 0);

  const admin = Math.round(nilaiMurni * 0.02);
  const sosial = Math.round(nilaiMurni * 0.01);
  const risiko = Math.round(nilaiMurni * 0.01);
  const insentif = formData.tanpaAgunan ? Math.round(nilaiMurni * 0.01) : 0;

  const isAgunanFisik = ['SHM', 'Akta Tanah', 'Surat 3 Serangkai', 'BPKB Roda 2', 'BPKB Roda 4', 'BPKB Roda 6/8'].includes(formData.jenis_agunan);
  const isSimpanan = formData.jenis_agunan === 'Simpanan (Semua jenis simpanan)';
  const isPendiri = formData.jenis_agunan === 'Pendiri';
  const nonFisik = isPendiri || isSimpanan;
  const showHargaPasar = isAgunanFisik || isSimpanan;

  let batasMaksimal = 0;
  let hargaLik = 0;
  if (isAgunanFisik) {
    hargaLik = Math.round(formData.harga_likuidasi || formData.hargaPasarAgunan || 0);
    const pct = ['SHM', 'Akta Tanah', 'Surat 3 Serangkai'].includes(formData.jenis_agunan) ? 0.8 : 0.7;
    batasMaksimal = Math.round(hargaLik * pct);
  } else if (isSimpanan) {
    let totalSaldo = 0;
    if (typeof window !== 'undefined') {
      try {
        const members = JSON.parse(localStorage.getItem('members') || '[]');
        const anggota = members.find((m: any) => m.No_Anggota === formData.No_Anggota);
        if (anggota) {
          const keys = ['SWK', 'SKS', 'Sibuhar', 'Simpan', 'Sihat', 'Sihar', 'Sisujang'];
          for (const k of keys) {
            const v = parseFloat((anggota[k] || 0).toLocaleString('id-ID').replace(/\./g, '')) || 0;
            totalSaldo += v;
          }
        }
      } catch {}
    }
    batasMaksimal = Math.round(totalSaldo * 3);
  }

  const gagalLikuidasi = isAgunanFisik && hargaLik > 0 && nilaiMurni > hargaLik;
  const gagalBatas = nilaiMurni > batasMaksimal && batasMaksimal > 0;
  const gagalCair = gagalLikuidasi || gagalBatas;
  const needPJP = gagalCair || isPendiri;
  const insentifPJP = needPJP ? Math.round(nilaiMurni * 0.01) : 0;

  const materaiJumlah = nonFisik ? 1 : (formData.notaris === 'Ya' ? 2 : 1);
  const potMaterai = materaiJumlah * 12000;

  const potNotaris = formData.notaris === 'Ya' ? 400000 : 0;

  let potBpjstk = 0;
  if (formData.bpjstk === 'Ya') {
    potBpjstk = formData.bpjstkBulan * 20000;
  }

  const swkPct = Math.round((nilaiMurni * 1) / 100);
  const swk = formData.swkOption === '1%' ? Math.max(swkPct, 25000) : 25000;

  const totalPot = admin + sosial + risiko + insentif + insentifPJP + potMaterai + potNotaris + potBpjstk;
  const bersih = nilaiMurni - totalPot;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'Bunga') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else if (name === 'Tenor' || name === 'bpjstkBulan') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else if (name === 'Nominal_Pinjaman' || name === 'hargaPasarAgunan' || name === 'harga_likuidasi') {
      const raw = value.replace(/\./g, '');
      setFormData(prev => ({ ...prev, [name]: parseInt(raw) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.No_Anggota || nilaiMurni <= 0 || formData.Tenor <= 0) {
      alert('Semua field harus diisi dengan benar');
      return;
    }
    if (!isMusiman && formData.Bunga <= 0) {
      alert('Bunga harus diisi untuk Pinjaman Flat');
      return;
    }
    if (isSimpanan && nilaiMurni > batasMaksimal) {
      alert('OTOMATIS DIBLOKIR: Nominal pinjaman melebihi batas maksimal 3x lipat dari saldo simpanan!');
      return;
    }
    const newPinjaman: Pinjaman = {
      id: `pinjaman-${crypto.randomUUID()}`,
      No_Anggota: formData.No_Anggota,
      Jenis_Pinjaman: formData.Jenis_Pinjaman,
      Nominal_Pinjaman: nilaiMurni,
      Tenor: formData.Tenor,
      Bunga: bungaTerkunci,
      Status: 'Aktif',
      Tanggal: new Date().toISOString().split('T')[0],
      potongan_administrasi: admin,
      potongan_danaSosial: sosial,
      potongan_danaRisiko: risiko,
      potongan_insentifPJ: insentif,
      potongan_insentifPJP: insentifPJP,
      potongan_materai: potMaterai,
      potongan_legalNotaris: potNotaris,
      potongan_bpjstk: potBpjstk,
      jumlah_potongan: totalPot,
      jumlah_bersih: bersih,
      opsi_agunan: formData.opsi_agunan,
      jenis_agunan: formData.jenis_agunan,
      detail_agunan: formData.detail_agunan,
      agunan_no_dokumen: formData.agunan_no_dokumen,
      agunan_nama_pemilik: formData.agunan_nama_pemilik,
      agunan_luas_tanah: formData.agunan_luas_tanah,
      agunan_luas_bangunan: formData.agunan_luas_bangunan,
      agunan_lokasi: formData.agunan_lokasi,
      agunan_no_bpkb: formData.agunan_no_bpkb,
      agunan_identitas_kendaraan: formData.agunan_identitas_kendaraan,
      agunan_no_polisi: formData.agunan_no_polisi,
      agunan_no_rangka: formData.agunan_no_rangka,
      agunan_no_mesin: formData.agunan_no_mesin,
      agunan_total_saldo: formData.agunan_total_saldo,
      agunan_tgl_terbit: formData.agunan_tgl_terbit,
      agunan_berlaku_sampai: formData.agunan_berlaku_sampai,
      agunan_atas_nama: formData.agunan_atas_nama,
      harga_likuidasi: formData.harga_likuidasi,
      harga_est_fisik: formData.harga_est_fisik,
      harga_est_bpkb: formData.harga_est_bpkb,
      harga_est_lain: formData.harga_est_lain,
    };
    setPinjaman(prev => [...prev, newPinjaman]);
    setFormData({
      No_Anggota: '',
      Jenis_Pinjaman: 'Flat',
      Nominal_Pinjaman: 0,
      Tenor: 0,
      Bunga: 0,
      tanpaAgunan: false,
      notaris: '',
      bpjstk: '',
      bpjstkBulan: 0,
      opsi_agunan: '',
      jenis_agunan: '',
      detail_agunan: '',
      agunan_no_dokumen: '',
      agunan_nama_pemilik: '',
      agunan_luas_tanah: '',
      agunan_luas_bangunan: '',
      agunan_lokasi: '',
      agunan_no_bpkb: '',
      agunan_identitas_kendaraan: '',
      agunan_no_polisi: '',
      agunan_no_rangka: '',
      agunan_no_mesin: '',
      agunan_total_saldo: 0,
      agunan_tgl_terbit: '',
      agunan_berlaku_sampai: '',
      agunan_atas_nama: '',
      harga_likuidasi: 0,
      harga_est_fisik: 0,
      harga_est_bpkb: 0,
      harga_est_lain: 0,
      swkOption: '1%',
      hargaPasarAgunan: 0,
    });
    setUseBulan(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Hapus data pinjaman ini?')) {
      setPinjaman(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <main className="h-screen overflow-hidden bg-zinc-950 text-neutral-100 p-4 flex flex-col gap-3">
      <header className="shrink-0">
        <h1 className="text-2xl font-bold tracking-tight text-white">Pinjaman</h1>
        <p className="text-xs text-zinc-400 mt-0.5">Kelola data pinjaman anggota KSP</p>
      </header>

      <div className="flex-1 min-h-0 flex gap-3">
        <div className="w-[60%] shrink-0">
          <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 h-full flex flex-col">
            <h2 className="text-sm font-semibold text-zinc-200 mb-3">Form Pinjaman</h2>
            <div className="grid grid-cols-2 gap-2.5 flex-1">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Pilih Anggota</label>
                <select name="No_Anggota" value={formData.No_Anggota} onChange={handleChange} className="w-full py-2 px-3 bg-zinc-800 border border-zinc-700 text-neutral-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" required>
                  <option value="">Pilih Anggota</option>
                  {anggota.map(a => <option key={a.No_Anggota} value={a.No_Anggota}>{a.No_Anggota} - {a.NAMA_ANGGOTA}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Jenis Pinjaman</label>
                <select name="Jenis_Pinjaman" value={formData.Jenis_Pinjaman} onChange={handleChange} className="w-full py-2 px-3 bg-zinc-800 border border-zinc-700 text-neutral-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                  {jenisPinjamanOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Nominal Pinjaman</label>
                <input type="text" name="Nominal_Pinjaman" value={formData.Nominal_Pinjaman ? formatRupiah(formData.Nominal_Pinjaman) : ''} onChange={handleChange} className="w-full py-2 px-3 bg-zinc-800 border border-zinc-700 text-neutral-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" placeholder="Contoh: 10.000.000" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Suku Bunga (% per bulan)</label>
                {isMusiman ? (
                  <input type="text" value={bungaTerkunci} readOnly className="w-full py-2 px-3 bg-zinc-700 text-zinc-300 border border-zinc-600 rounded-lg text-sm" />
                ) : (
                  <select name="Bunga" value={formData.Bunga} onChange={handleChange} className="w-full py-2 px-3 bg-zinc-800 border border-zinc-700 text-neutral-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                    <option value={0}>Pilih Bunga</option>
                    {bungaFlatOptions.map(b => <option key={b} value={b}>{b}%</option>)}
                  </select>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Jangka Waktu (bulan)</label>
                <select name="Tenor" value={formData.Tenor} onChange={handleChange} className="w-full py-2 px-3 bg-zinc-800 border border-zinc-700 text-neutral-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" required>
                  <option value={0}>Pilih Tenor</option>
                  {(isMusiman ? tenorMusimanOptions : tenorFlatOptions).map(t => <option key={t} value={t}>{t} Bulan</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Opsi Agunan</label>
                <select name="opsi_agunan" value={formData.opsi_agunan} onChange={handleChange} className="w-full py-2 px-3 bg-zinc-800 border border-zinc-700 text-neutral-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                  <option value="">Pilih Opsi</option>
                  <option value="Tidak Pakai Agunan">Tidak Pakai Agunan</option>
                  <option value="Ya (Pakai Agunan)">Ya (Pakai Agunan)</option>
                </select>
              </div>
              {formData.opsi_agunan === 'Ya (Pakai Agunan)' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Jenis Agunan</label>
                    <select name="jenis_agunan" value={formData.jenis_agunan} onChange={handleChange} className="w-full py-2 px-3 bg-zinc-800 border border-zinc-700 text-neutral-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                      <option value="">Pilih Jenis</option>
                      {jenisAgunanOptions.map(j => <option key={j} value={j}>{j}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Detail / No. Agunan</label>
                    <input type="text" name="detail_agunan" value={formData.detail_agunan} onChange={handleChange} className="w-full py-2 px-3 bg-zinc-800 border border-zinc-700 text-neutral-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" placeholder="Nomor/Keterangan" />
                  </div>
                  {formData.jenis_agunan === 'SHM' || formData.jenis_agunan === 'Akta Tanah' || formData.jenis_agunan === 'Surat 3 Serangkai' ? (
                    <div className="col-span-2 bg-zinc-800/40 border border-zinc-700/50 rounded-lg px-3 py-2">
                      <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-2.5">Detail Jaminan - Tanah/Bangunan</p>
                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[10px] font-medium text-zinc-500 mb-1">Nomor Dokumen <span className="text-red-400/70">*</span></label>
                          <input type="text" name="agunan_no_dokumen" value={formData.agunan_no_dokumen} onChange={handleChange} className="w-full py-1.5 px-2.5 bg-zinc-900 border border-zinc-700 text-neutral-100 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/30" placeholder="No. SHM / Akta / Surat Kepemilikan" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-zinc-500 mb-1">Nama Pemilik <span className="text-red-400/70">*</span></label>
                          <input type="text" name="agunan_nama_pemilik" value={formData.agunan_nama_pemilik} onChange={handleChange} className="w-full py-1.5 px-2.5 bg-zinc-900 border border-zinc-700 text-neutral-100 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/30" placeholder="Nama sesuai surat tanah" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-zinc-500 mb-1">Luas Tanah (m²)</label>
                          <input type="text" name="agunan_luas_tanah" value={formData.agunan_luas_tanah} onChange={handleChange} className="w-full py-1.5 px-2.5 bg-zinc-900 border border-zinc-700 text-neutral-100 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/30" placeholder="Contoh: 120" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-zinc-500 mb-1">Luas Bangunan (m²)</label>
                          <input type="text" name="agunan_luas_bangunan" value={formData.agunan_luas_bangunan} onChange={handleChange} className="w-full py-1.5 px-2.5 bg-zinc-900 border border-zinc-700 text-neutral-100 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/30" placeholder="Contoh: 80" />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-[10px] font-medium text-zinc-500 mb-1">Lokasi / Alamat Lengkap</label>
                          <input type="text" name="agunan_lokasi" value={formData.agunan_lokasi} onChange={handleChange} className="w-full py-1.5 px-2.5 bg-zinc-900 border border-zinc-700 text-neutral-100 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/30" placeholder="Alamat / Kelurahan / Kecamatan" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-zinc-500 mb-1">Nilai Jual Pasar</label>
                          <input type="text" name="hargaPasarAgunan" value={formData.hargaPasarAgunan ? formatRupiah(formData.hargaPasarAgunan) : ''} onChange={(e) => handleChange(e)} className="w-full py-1.5 px-2.5 bg-zinc-900 border border-zinc-700 text-neutral-100 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/30" placeholder="Contoh: 250.000.000" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-zinc-500 mb-1">Harga Likuidasi</label>
                          <input type="text" name="harga_likuidasi" value={formData.harga_likuidasi ? formatRupiah(formData.harga_likuidasi) : ''} onChange={handleChange} className="w-full py-1.5 px-2.5 bg-zinc-900 border border-amber-500/40 text-amber-300 rounded text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500/40" placeholder="Contoh: 220.000.000" />
                          <p className="text-[9px] text-zinc-500 mt-0.5">Dipindai dari harga pasar sebagai dasar likuidasi.</p>
                        </div>
                      </div>
                    </div>
                  ) : (formData.jenis_agunan === 'BPKB Roda 2' || formData.jenis_agunan === 'BPKB Roda 4' || formData.jenis_agunan === 'BPKB Roda 6/8') ? (
                    <div className="col-span-2 bg-zinc-800/40 border border-zinc-700/50 rounded-lg px-3 py-2">
                      <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-2.5">Detail Jaminan - BPKB Kendaraan</p>
                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[10px] font-medium text-zinc-500 mb-1">Nomor BPKB <span className="text-red-400/70">*</span></label>
                          <input type="text" name="agunan_no_bpkb" value={formData.agunan_no_bpkb} onChange={handleChange} className="w-full py-1.5 px-2.5 bg-zinc-900 border border-zinc-700 text-neutral-100 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/30" placeholder="Nomor seri BPKB" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-zinc-500 mb-1">Identitas Kendaraan <span className="text-red-400/70">*</span></label>
                          <input type="text" name="agunan_identitas_kendaraan" value={formData.agunan_identitas_kendaraan} onChange={handleChange} className="w-full py-1.5 px-2.5 bg-zinc-900 border border-zinc-700 text-neutral-100 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/30" placeholder="Merek / Tipe / Warna / Tahun" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-zinc-500 mb-1">No. Polisi</label>
                          <input type="text" name="agunan_no_polisi" value={formData.agunan_no_polisi} onChange={handleChange} className="w-full py-1.5 px-2.5 bg-zinc-900 border border-zinc-700 text-neutral-100 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/30" placeholder="Contoh: DD 1234 AB" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-zinc-500 mb-1">No. Rangka</label>
                          <input type="text" name="agunan_no_rangka" value={formData.agunan_no_rangka} onChange={handleChange} className="w-full py-1.5 px-2.5 bg-zinc-900 border border-zinc-700 text-neutral-100 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/30" placeholder="Nomor rangka kendaraan" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-zinc-500 mb-1">No. Mesin</label>
                          <input type="text" name="agunan_no_mesin" value={formData.agunan_no_mesin} onChange={handleChange} className="w-full py-1.5 px-2.5 bg-zinc-900 border border-zinc-700 text-neutral-100 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/30" placeholder="Nomor mesin kendaraan" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-zinc-500 mb-1">Nama Pemegang BPKB</label>
                          <input type="text" name="agunan_nama_pemilik" value={formData.agunan_nama_pemilik} onChange={handleChange} className="w-full py-1.5 px-2.5 bg-zinc-900 border border-zinc-700 text-neutral-100 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/30" placeholder="Nama tertera di BPKB" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-zinc-500 mb-1">Nilai Jual Pasar</label>
                          <input type="text" name="hargaPasarAgunan" value={formData.hargaPasarAgunan ? formatRupiah(formData.hargaPasarAgunan) : ''} onChange={(e) => handleChange(e)} className="w-full py-1.5 px-2.5 bg-zinc-900 border border-zinc-700 text-neutral-100 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/30" placeholder="Contoh: 120.000.000" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-zinc-500 mb-1">Harga Likuidasi</label>
                          <input type="text" name="harga_likuidasi" value={formData.harga_likuidasi ? formatRupiah(formData.harga_likuidasi) : ''} onChange={handleChange} className="w-full py-1.5 px-2.5 bg-zinc-900 border border-amber-500/40 text-amber-300 rounded text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500/40" placeholder="Contoh: 100.000.000" />
                          <p className="text-[9px] text-zinc-500 mt-0.5">Dipindai dari nilai pasar sebagai dasar likuidasi.</p>
                        </div>
                      </div>
                    </div>
                  ) : formData.jenis_agunan === 'Simpanan (Semua jenis simpanan)' ? (
                    <div className="col-span-2 bg-emerald-500/5 border border-emerald-500/20 rounded-lg px-3 py-2">
                      <p className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider mb-2">Detail Jaminan - Simpanan Terikat</p>
                      <div className="grid grid-cols-2 gap-2.5">
                        <div className="col-span-1">
                          <label className="block text-[10px] font-medium text-zinc-500 mb-1">Nomor Anggota</label>
                          <input type="text" value={formData.No_Anggota} readOnly className="w-full py-1.5 px-2.5 bg-zinc-900/50 border border-zinc-700/60 text-zinc-400 rounded text-xs cursor-not-allowed" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-zinc-500 mb-1">Total Saldo Jaminan (Otomatis)</label>
                          <input type="text" readOnly value={`Rp ${formatRupiah(batasMaksimal / 3)}`} className="w-full py-1.5 px-2.5 bg-zinc-900/50 border border-emerald-500/30 text-emerald-400 rounded text-xs font-semibold cursor-not-allowed" />
                          <p className="text-[9px] text-zinc-500 mt-0.5">Batas maksimal pinjaman: 3x saldo = <span className="text-emerald-400/80">Rp {formatRupiah(batasMaksimal)}</span></p>
                        </div>
                      </div>
                    </div>
                  ) : formData.jenis_agunan === 'Pendiri' ? (
                    <div className="col-span-2 bg-amber-500/5 border border-amber-500/20 rounded-lg px-3 py-2">
                      <p className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider mb-1">Agunan Pendiri (Tanpa Fisik)</p>
                      <p className="text-[10px] text-zinc-500">Agunan ini menggunakan jaminan non-fisik. Insentif PJP 1% akan diterapkan otomatis.</p>
                    </div>
                  ) : null}
                </>
              )}
              {showHargaPasar && !isSimpanan && (
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Harga Pasar Agunan (Scan)</label>
                  <input type="text" name="hargaPasarAgunan" value={formData.hargaPasarAgunan ? formatRupiah(formData.hargaPasarAgunan) : ''} onChange={handleChange} className="w-full py-2 px-3 bg-zinc-800 border border-zinc-700 text-neutral-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" placeholder="Contoh: 50.000.000" />
                </div>
              )}
              {!showHargaPasar && <div></div>}
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Legalisasi Notaris</label>
                <select name="notaris" value={formData.notaris} onChange={handleChange} className="w-full py-2 px-3 bg-zinc-800 border border-zinc-700 text-neutral-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                  <option value="">Tidak</option>
                  <option value="Ya">Ya</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Iuran BPJSTK</label>
                <select name="bpjstk" value={formData.bpjstk} onChange={(e) => { handleChange(e); setUseBulan(e.target.value === 'Ya'); }} className="w-full py-2 px-3 bg-zinc-800 border border-zinc-700 text-neutral-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                  <option value="">Tidak</option>
                  <option value="Ya">Ya</option>
                </select>
              </div>
              {useBulan && (
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Jumlah Bulan BPJSTK</label>
                  <select name="bpjstkBulan" value={formData.bpjstkBulan} onChange={handleChange} className="w-full py-2 px-3 bg-zinc-800 border border-zinc-700 text-neutral-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                    <option value={0}>Pilih Bulan</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(b => <option key={b} value={b}>{b} Bulan</option>)}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Potongan Materai</label>
                <input type="text" readOnly value={`${materaiJumlah} lembar`} className="w-full py-2 px-3 bg-zinc-700 text-zinc-300 border border-zinc-600 rounded-lg text-sm cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Opsi SWK</label>
                <select name="swkOption" value={formData.swkOption} onChange={handleChange} className="w-full py-2 px-3 bg-zinc-800 border border-zinc-700 text-neutral-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                  <option value="1%">1% dari Pinjaman</option>
                  <option value="flat">Flat Rp 25.000</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="tanpaAgunan" checked={formData.tanpaAgunan} onChange={handleChange} className="w-4 h-4 rounded bg-zinc-800 border-zinc-600 text-blue-500 focus:ring-blue-500/50" />
                  <span className="text-xs text-zinc-300">Tanpa Agunan / Nilai Jual Agunan Kurang (potong 1%)</span>
                </label>
              </div>
              {needPJP && (
                <div className="col-span-2 bg-zinc-800/50 border border-amber-500/30 rounded-lg p-2.5">
                  <label className="block text-xs font-medium text-amber-400 mb-1">Insentif Penanggung Jawab Pinjaman (Insentif PJP) - 1%</label>
                  <div className="text-xs text-zinc-300">Nilai Insentif PJP: <span className="font-bold text-amber-400">Rp {formatRupiah(insentifPJP)}</span></div>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Dikenakan otomatis karena agunan tidak cover atau jenis agunan Pendiri/Simpanan.</p>
                </div>
              )}
              {gagalBatas && !isSimpanan && (
                <div className="col-span-2 bg-red-500/10 border border-red-500/30 rounded-lg p-2">
                  <p className="text-xs text-red-400 font-medium">Peringatan: Nilai agunan tidak mengcover nominal pinjaman!</p>
                </div>
              )}
              {gagalLikuidasi && (
                <div className="col-span-2 bg-red-500/10 border border-red-500/30 rounded-lg p-2">
                  <p className="text-xs text-red-400 font-medium">Peringatan: Harga Likuidasi lebih kecil dari nominal pinjaman!</p>
                </div>
              )}
              {isSimpanan && nilaiMurni > batasMaksimal && (
                <div className="col-span-2 bg-red-500/10 border border-red-500/30 rounded-lg p-2">
                  <p className="text-xs text-red-400 font-medium">OTOMATIS DIBLOKIR: Nominal pinjaman melebihi batas maksimal 3x lipat dari saldo simpanan anggota!</p>
                </div>
              )}
            </div>
          </form>
        </div>

        <div className="w-[40%] shrink-0 flex flex-col gap-3">
          <div className="flex-1 flex flex-col gap-3 min-h-0">
            {formData.Nominal_Pinjaman > 0 && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex-1">
                <h3 className="text-xs font-semibold text-zinc-300 mb-2 uppercase tracking-wider">Estimasi Potongan & Pencairan</h3>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-zinc-400">
                    <span>Jumlah Pinjaman Nominal</span>
                    <span className="font-semibold text-white">Rp {formatRupiah(nilaiMurni)}</span>
                  </div>
                  {(batasMaksimal > 0 || isSimpanan) && (
                    <div className="flex justify-between text-zinc-500 text-[10px]">
                      <span>Batas Maksimal Pinjaman</span>
                      <span>Rp {formatRupiah(batasMaksimal)} {isAgunanFisik ? <span className="text-amber-400/80">(Likuidasi: Rp {formatRupiah(hargaLik)})</span> : ''}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-red-400/80">
                    <span>Pot. Administrasi (2%)</span>
                    <span>Rp {formatRupiah(admin)}</span>
                  </div>
                  <div className="flex justify-between text-red-400/80">
                    <span>Pot. Dana Sosial (1%)</span>
                    <span>Rp {formatRupiah(sosial)}</span>
                  </div>
                  <div className="flex justify-between text-red-400/80">
                    <span>Pot. Dana Risiko (1%)</span>
                    <span>Rp {formatRupiah(risiko)}</span>
                  </div>
                  {formData.tanpaAgunan && (
                    <div className="flex justify-between text-red-400/80">
                      <span>Pot. Insentif PJ (1%)</span>
                      <span>Rp {formatRupiah(insentif)}</span>
                    </div>
                  )}
                  {(formData.jenis_agunan === 'Pendiri' || formData.jenis_agunan === 'Simpanan (Semua jenis simpanan)' || gagalBatas) && (
                    <div className="flex justify-between text-red-400/80">
                      <span>Pot. Insentif PJP (1%)</span>
                      <span>Rp {formatRupiah(insentifPJP)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-red-400/80">
                    <span>Pot. Materai ({materaiJumlah} lembar)</span>
                    <span>Rp {formatRupiah(potMaterai)}</span>
                  </div>
                  <div className="flex justify-between text-red-400/80">
                    <span>Pot. Legal Notaris</span>
                    <span>Rp {formatRupiah(potNotaris)}</span>
                  </div>
                  <div className="flex justify-between text-red-400/80">
                    <span>Pot. BPJSTK ({formData.bpjstkBulan} bln)</span>
                    <span>Rp {formatRupiah(potBpjstk)}</span>
                  </div>
                  <div className="border-t border-zinc-700 pt-1.5 flex justify-between text-zinc-200">
                    <span className="font-medium">Total Potongan</span>
                    <span className="font-bold">Rp {formatRupiah(totalPot)}</span>
                  </div>
                  <div className="border-t-2 border-blue-500/50 pt-1.5 flex justify-between text-emerald-400">
                    <span className="font-medium">Bersih Diterima</span>
                    <span className="font-bold">Rp {formatRupiah(bersih)}</span>
                  </div>
                </div>
              </div>
            )}

            {formData.Nominal_Pinjaman > 0 && formData.Tenor > 0 && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex-1">
                <h3 className="text-xs font-semibold text-zinc-300 mb-2 uppercase tracking-wider">Estimasi Angsuran per Bulan</h3>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-zinc-400">
                    <span>Angsuran Pokok</span>
                    <span className="font-semibold text-white">Rp {formatRupiah(Math.round(nilaiMurni / formData.Tenor))}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Angsuran Bunga</span>
                    <span className="font-semibold text-white">Rp {formatRupiah(Math.round((nilaiMurni * bungaTerkunci) / 100))}</span>
                  </div>
                  <div className="flex justify-between text-blue-400/80">
                    <span>SWK (1%)</span>
                    <span>Rp {formatRupiah(swk)}</span>
                  </div>
                  <div className="border-t border-zinc-700 pt-1.5 flex justify-between text-white">
                    <span className="font-medium">Total Angsuran per Bulan</span>
                    <span className="font-bold">Rp {formatRupiah(Math.round(nilaiMurni / formData.Tenor) + Math.round((nilaiMurni * bungaTerkunci) / 100) + swk)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSimpanan && nilaiMurni > batasMaksimal}
            className="shrink-0 w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors text-sm"
          >
            Simpan Pinjaman
          </button>
        </div>
      </div>

        <div className="shrink-0 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="px-3 py-2.5 bg-zinc-800/40 border-b border-zinc-700/60 flex items-center justify-between">
            <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Data Pinjaman Aktif</h3>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-zinc-500 font-mono">{pinjaman.length} record</span>
              <PrintButton />
            </div>
          </div>
          <div className="max-h-[150px] overflow-y-auto">
            <table className="min-w-full" id="print-area">
            <thead className="bg-zinc-800/30 sticky top-0">
              <tr>
                <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-zinc-500 uppercase tracking-wider border-b border-zinc-700/80 border-r border-r-zinc-700/40 bg-zinc-800/50 w-[100px]">Tanggal</th>
                <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-zinc-500 uppercase tracking-wider border-b border-zinc-700/80 border-r border-r-zinc-700/40 bg-zinc-800/50 w-[90px]">No. Anggota</th>
                <th className="px-3 py-2.5 text-center text-[10px] font-semibold text-blue-400/80 uppercase tracking-wider border-b border-zinc-700/80 border-r border-r-zinc-700/40 bg-blue-500/5 w-[90px]">Jenis</th>
                <th className="px-3 py-2.5 text-right text-[10px] font-semibold text-emerald-400/80 uppercase tracking-wider border-b border-zinc-700/80 border-r border-r-zinc-700/40 bg-emerald-500/5">Nominal</th>
                <th className="px-3 py-2.5 text-center text-[10px] font-semibold text-zinc-500 uppercase tracking-wider border-b border-zinc-700/80 border-r border-r-zinc-700/40 bg-zinc-800/50 w-[70px]">Tenor</th>
                <th className="px-3 py-2.5 text-center text-[10px] font-semibold text-zinc-500 uppercase tracking-wider border-b border-zinc-700/80 border-r border-r-zinc-700/40 bg-zinc-800/50 w-[70px]">Bunga</th>
                <th className="px-3 py-2.5 text-center text-[10px] font-semibold text-amber-400/80 uppercase tracking-wider border-b border-zinc-700/80 border-r border-r-zinc-700/40 bg-amber-500/5 w-[130px]">Opsi Agunan</th>
                <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-amber-400/80 uppercase tracking-wider border-b border-zinc-700/80 border-r border-r-zinc-700/40 bg-amber-500/5">Jenis Agunan</th>
                <th className="px-3 py-2.5 text-center text-[10px] font-semibold text-purple-400/80 uppercase tracking-wider border-b border-zinc-700/80 bg-purple-500/5 w-[85px]">Status</th>
                <th className="px-3 py-2.5 text-center text-[10px] font-semibold text-red-400/80 uppercase tracking-wider border-b border-zinc-700/80 bg-red-500/5 w-[75px]">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pinjaman.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-3 py-6 text-center text-xs text-zinc-500">
                    <div className="flex flex-col items-center gap-1">
                      <svg className="w-6 h-6 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>Belum ada data pinjaman</span>
                    </div>
                  </td>
                </tr>
              ) : pinjaman.map(item => (
                <tr key={item.id} className="border-t border-zinc-800/50 hover:bg-zinc-800/40 transition-colors group">
                  <td className="px-3 py-2.5 text-xs text-zinc-400 font-mono">{item.Tanggal}</td>
                  <td className="px-3 py-2.5 text-xs text-zinc-300 font-medium">{item.No_Anggota}</td>
                  <td className="px-3 py-2.5 text-xs text-center">
                    <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-semibold ${item.Jenis_Pinjaman === 'Flat' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-violet-500/10 text-violet-400 border border-violet-500/20'}`}>
                      {item.Jenis_Pinjaman}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-xs text-right text-white font-semibold tabular-nums">
                    Rp {formatRupiah(item.Nominal_Pinjaman)}
                  </td>
                  <td className="px-3 py-2.5 text-xs text-center text-zinc-300 tabular-nums">{item.Tenor} bln</td>
                  <td className="px-3 py-2.5 text-xs text-center text-zinc-300 tabular-nums">{item.Bunga}%</td>
                  <td className="px-3 py-2.5 text-xs text-center text-zinc-400">
                    <span className="truncate block max-w-[120px]" title={item.opsi_agunan}>{item.opsi_agunan}</span>
                  </td>
                  <td className="px-3 py-2.5 text-xs text-zinc-400">
                    <span className="truncate block max-w-[150px]" title={item.jenis_agunan}>{item.jenis_agunan || '-'}</span>
                  </td>
                  <td className="px-3 py-2.5 text-xs text-center">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${item.Status === 'Aktif' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                      {item.Status}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-xs text-center">
                    <button 
                      onClick={() => handleDelete(item.id)} 
                      className="text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all font-medium px-2 py-1 rounded"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}