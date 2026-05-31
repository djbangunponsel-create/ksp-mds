'use client';

import { useState } from 'react';
import * as XLSX from 'xlsx';

interface Anggota {
  [key: string]: string;
  No_Anggota: string;
  NAMA_ANGGOTA: string;
  Jenis_Kelamin: string;
  Agama: string;
  NIK: string;
  Tempat_Lahir: string;
  Tanggal_Lahir: string;
  TELEPON: string;
  Alamat: string;
  Tanggal_Masuk: string;
  Status_Perkawinan: string;
  Nama_Pasangan: string;
  Jumlah_Anak: string;
  Nama_Ibu_Kandung: string;
  Nama_Saudara: string;
  No_HP_Saudara: string;
  Hubungan_Saudara: string;
  Pekerjaan: string;
  PENGHASILAN_per_Bulan: string;
}

export default function AnggotaPage() {
  const [members, setMembers] = useState<Anggota[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<Anggota>({
    No_Anggota: '',
    NAMA_ANGGOTA: '',
    Jenis_Kelamin: '',
    Agama: '',
    NIK: '',
    Tempat_Lahir: '',
    Tanggal_Lahir: '',
    TELEPON: '',
    Alamat: '',
    Tanggal_Masuk: '',
    Status_Perkawinan: '',
    Nama_Pasangan: '',
    Jumlah_Anak: '',
    Nama_Ibu_Kandung: '',
    Nama_Saudara: '',
    No_HP_Saudara: '',
    Hubungan_Saudara: '',
    Pekerjaan: '',
    PENGHASILAN_per_Bulan: '',
  });

  const columns = [
    'No_Anggota',
    'NAMA_ANGGOTA',
    'Jenis_Kelamin',
    'Agama',
    'NIK',
    'Tempat_Lahir',
    'Tanggal_Lahir',
    'TELEPON',
    'Alamat',
    'Tanggal_Masuk',
    'Status_Perkawinan',
    'Nama_Pasangan',
    'Jumlah_Anak',
    'Nama_Ibu_Kandung',
    'Nama_Saudara',
    'No_HP_Saudara',
    'Hubungan_Saudara',
    'Pekerjaan',
    'PENGHASILAN_per_Bulan',
  ];

  const columnLabels: Record<string, string> = {
    No_Anggota: 'No. Anggota',
    NAMA_ANGGOTA: 'Nama Anggota',
    Jenis_Kelamin: 'Jenis Kelamin',
    Agama: 'Agama',
    NIK: 'NIK',
    Tempat_Lahir: 'Tempat Lahir',
    Tanggal_Lahir: 'Tanggal Lahir',
    TELEPON: 'No. Telepon',
    Alamat: 'Alamat',
    Tanggal_Masuk: 'Tanggal Masuk',
    Status_Perkawinan: 'Status Perkawinan',
    Nama_Pasangan: 'Nama Pasangan',
    Jumlah_Anak: 'Jumlah Anak',
    Nama_Ibu_Kandung: 'Nama Ibu Kandung',
    Nama_Saudara: 'Nama Saudara Kontrak / Darurat',
    No_HP_Saudara: 'No. HP Saudara',
    Hubungan_Saudara: 'Hubungan Saudara',
    Pekerjaan: 'Pekerjaan',
    PENGHASILAN_per_Bulan: 'Penghasilan per Bulan',
  };

  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as (string | number)[][];

        // Assuming first row is header, second row onwards is data
        if (jsonData.length < 2) {
          alert('File Excel tidak memiliki data yang cukup');
          return;
        }

        const headers = jsonData[0];
        const dataRows = jsonData.slice(1);

        // Validate headers match expected columns (case-insensitive)
        const expectedHeaders = columns.map(h => h.toUpperCase());
        const actualHeaders = headers.map(h => String(h).toUpperCase().trim());

        if (!expectedHeaders.every((h, i) => h === actualHeaders[i])) {
          alert('Format file Excel tidak sesuai. Pastikan kolom sesuai dengan urutan yang ditentukan.');
          return;
        }

        const parsedMembers: Anggota[] = dataRows.map(row => {
          const member: Anggota = {
            No_Anggota: '',
            NAMA_ANGGOTA: '',
            Jenis_Kelamin: '',
            Agama: '',
            NIK: '',
            Tempat_Lahir: '',
            Tanggal_Lahir: '',
            TELEPON: '',
            Alamat: '',
            Tanggal_Masuk: '',
            Status_Perkawinan: '',
            Nama_Pasangan: '',
            Jumlah_Anak: '',
            Nama_Ibu_Kandung: '',
            Nama_Saudara: '',
            No_HP_Saudara: '',
            Hubungan_Saudara: '',
            Pekerjaan: '',
            PENGHASILAN_per_Bulan: '',
          };
          
          columns.forEach((col, index) => {
            member[col] = row[index] !== undefined ? String(row[index]) : '';
          });
          return member;
        });

        setMembers(parsedMembers);
        e.target.value = ''; // Reset file input
        alert(`Berhasil mengimpor ${parsedMembers.length} anggota dari Excel`);
      } catch (error) {
        console.error('Error reading Excel file:', error);
        alert('Gagal membaca file Excel. Pastikan file tidak rusak dan dalam format .xlsx atau .xls');
      }
    };
    reader.onerror = () => {
      alert('Gagal membaca file');
    };
    reader.readAsArrayBuffer(file);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!formData.No_Anggota || !formData.NAMA_ANGGOTA) {
      alert('Nomor Anggota dan Nama Anggota harus diisi');
      return;
    }

    setMembers(prev => [...prev, { ...formData }]);
    setShowModal(false);
    // Reset form
    setFormData({
      No_Anggota: '',
      NAMA_ANGGOTA: '',
      Jenis_Kelamin: '',
      Agama: '',
      NIK: '',
      Tempat_Lahir: '',
      Tanggal_Lahir: '',
      TELEPON: '',
      Alamat: '',
      Tanggal_Masuk: '',
      Status_Perkawinan: '',
      Nama_Pasangan: '',
      Jumlah_Anak: '',
      Nama_Ibu_Kandung: '',
      Nama_Saudara: '',
      No_HP_Saudara: '',
      Hubungan_Saudara: '',
      Pekerjaan: '',
      PENGHASILAN_per_Bulan: '',
    });
  };

  const handleDelete = (index: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus anggota ini?')) {
      setMembers(prev => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <main className="min-h-screen bg-neutral-900 text-neutral-100 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Manajemen Anggota KSP Mulia Dana Sejahtera</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Tambah Anggota Manual
          </button>
          <label className="flex items-center gap-2">
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleExcelUpload}
              className="hidden"
            />
            <button
              type="button"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Impor dari Excel
            </button>
          </label>
        </div>
      </div>

      {/* Modal for manual add */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-neutral-800 rounded-lg p-6 w-full max-w-5xl">
            <h2 className="text-xl font-bold mb-4">Tambah Anggota Baru</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1 text-neutral-300">No. Anggota</label>
                  <input
                    type="text"
                    name="No_Anggota"
                    value={formData.No_Anggota}
                    onChange={handleFormChange}
                    className="w-full py-1.5 px-3 bg-neutral-700 text-neutral-100 rounded border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium mb-1 text-neutral-300">Nama Anggota</label>
                  <input
                    type="text"
                    name="NAMA_ANGGOTA"
                    value={formData.NAMA_ANGGOTA}
                    onChange={handleFormChange}
                    className="w-full py-1.5 px-3 bg-neutral-700 text-neutral-100 rounded border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-neutral-300">Jenis Kelamin</label>
                  <select
                    name="Jenis_Kelamin"
                    value={formData.Jenis_Kelamin}
                    onChange={handleFormChange}
                    className="w-full py-1.5 px-3 bg-neutral-700 text-neutral-100 rounded border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">Pilih</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-neutral-300">Agama</label>
                  <select
                    name="Agama"
                    value={formData.Agama}
                    onChange={handleFormChange}
                    className="w-full py-1.5 px-3 bg-neutral-700 text-neutral-100 rounded border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">Pilih</option>
                    <option value="Islam">Islam</option>
                    <option value="Kristen Protestan">Kristen Protestan</option>
                    <option value="Kristen Katolik">Kristen Katolik</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Buddha">Buddha</option>
                    <option value="Khonghucu">Khonghucu</option>
                  </select>
                </div>
                <div></div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1 text-neutral-300">Tempat Lahir</label>
                  <input
                    type="text"
                    name="Tempat_Lahir"
                    value={formData.Tempat_Lahir}
                    onChange={handleFormChange}
                    className="w-full py-1.5 px-3 bg-neutral-700 text-neutral-100 rounded border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-neutral-300">Tanggal Lahir</label>
                  <input
                    type="date"
                    name="Tanggal_Lahir"
                    value={formData.Tanggal_Lahir}
                    onChange={handleFormChange}
                    className="w-full py-1.5 px-3 bg-neutral-700 text-neutral-100 rounded border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-neutral-300">Tanggal Masuk</label>
                  <input
                    type="date"
                    name="Tanggal_Masuk"
                    value={formData.Tanggal_Masuk}
                    onChange={handleFormChange}
                    className="w-full py-1.5 px-3 bg-neutral-700 text-neutral-100 rounded border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div></div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1 text-neutral-300">No. Telepon</label>
                  <input
                    type="tel"
                    name="TELEPON"
                    value={formData.TELEPON}
                    onChange={handleFormChange}
                    className="w-full py-1.5 px-3 bg-neutral-700 text-neutral-100 rounded border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium mb-1 text-neutral-300">Alamat</label>
                  <input
                    type="text"
                    name="Alamat"
                    value={formData.Alamat}
                    onChange={handleFormChange}
                    className="w-full py-1.5 px-3 bg-neutral-700 text-neutral-100 rounded border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div></div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1 text-neutral-300">Status Perkawinan</label>
                  <select
                    name="Status_Perkawinan"
                    value={formData.Status_Perkawinan}
                    onChange={handleFormChange}
                    className="w-full py-1.5 px-3 bg-neutral-700 text-neutral-100 rounded border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">Pilih</option>
                    <option value="Belum Kawin">Belum Kawin</option>
                    <option value="Kawin">Kawin</option>
                    <option value="Cerai Hidup">Cerai Hidup</option>
                    <option value="Cerai Mati">Cerai Mati</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-neutral-300">Nama Pasangan</label>
                  <input
                    type="text"
                    name="Nama_Pasangan"
                    value={formData.Nama_Pasangan}
                    onChange={handleFormChange}
                    className="w-full py-1.5 px-3 bg-neutral-700 text-neutral-100 rounded border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-neutral-300">Jumlah Anak</label>
                  <input
                    type="number"
                    name="Jumlah_Anak"
                    value={formData.Jumlah_Anak}
                    onChange={handleFormChange}
                    className="w-full py-1.5 px-3 bg-neutral-700 text-neutral-100 rounded border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div></div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1 text-neutral-300">Nama Ibu Kandung</label>
                  <input
                    type="text"
                    name="Nama_Ibu_Kandung"
                    value={formData.Nama_Ibu_Kandung}
                    onChange={handleFormChange}
                    className="w-full py-1.5 px-3 bg-neutral-700 text-neutral-100 rounded border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-neutral-300">Pekerjaan</label>
                  <input
                    type="text"
                    name="Pekerjaan"
                    value={formData.Pekerjaan}
                    onChange={handleFormChange}
                    className="w-full py-1.5 px-3 bg-neutral-700 text-neutral-100 rounded border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-neutral-300">Penghasilan per Bulan</label>
                  <input
                    type="text"
                    name="PENGHASILAN_per_Bulan"
                    value={formData.PENGHASILAN_per_Bulan}
                    onChange={handleFormChange}
                    className="w-full py-1.5 px-3 bg-neutral-700 text-neutral-100 rounded border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div></div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1 text-neutral-300">Nama Saudara Kontrak / Darurat</label>
                  <input
                    type="text"
                    name="Nama_Saudara"
                    value={formData.Nama_Saudara}
                    onChange={handleFormChange}
                    className="w-full py-1.5 px-3 bg-neutral-700 text-neutral-100 rounded border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-neutral-300">No. HP Saudara</label>
                  <input
                    type="tel"
                    name="No_HP_Saudara"
                    value={formData.No_HP_Saudara}
                    onChange={handleFormChange}
                    className="w-full py-1.5 px-3 bg-neutral-700 text-neutral-100 rounded border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-neutral-300">Hubungan Saudara</label>
                  <select
                    name="Hubungan_Saudara"
                    value={formData.Hubungan_Saudara}
                    onChange={handleFormChange}
                    className="w-full py-1.5 px-3 bg-neutral-700 text-neutral-100 rounded border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">Pilih</option>
                    <option value="Orang Tua">Orang Tua</option>
                    <option value="Suami / Istri">Suami / Istri</option>
                    <option value="Anak">Anak</option>
                    <option value="Kakak / Adik">Kakak / Adik</option>
                    <option value="Paman / Bibi">Paman / Bibi</option>
                    <option value="Keponakan">Keponakan</option>
                  </select>
                </div>
                <div></div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Simpan Anggota
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Members Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-neutral-800 border border-neutral-700">
          <thead>
            <tr className="bg-neutral-700">
              {columns.map(col => (
                <th
                  key={col}
                  className="px-4 py-3 text-left text-sm font-medium text-neutral-300 border-b border-neutral-600"
                >
                  {columnLabels[col] || col}
                </th>
              ))}
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-300 border-b border-neutral-600">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {members.length === 0 ? (
              <tr>
                <td colSpan={20} className="px-4 py-4 text-center text-neutral-400">
                  Belum ada data anggota. Silakan tambah anggota atau impor dari Excel.
                </td>
              </tr>
            ) : (
              members.map((member, index) => (
                <tr key={index} className="border-t border-neutral-700">
                  {columns.map(col => (
                    <td
                      key={col}
                      className="px-4 py-3 text-sm text-neutral-100 border-b border-neutral-600"
                    >
                      {member[col] || '-'}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-sm text-neutral-100 border-b border-neutral-600">
                    <button
                      onClick={() => handleDelete(index)}
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