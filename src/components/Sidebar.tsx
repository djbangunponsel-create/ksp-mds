import Link from 'next/link';
import { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Banknote, 
  HandCoins, 
  Settings,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Sidebar = () => {
  const [transaksiOpen, setTransaksiOpen] = useState(false);

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200">
      <nav className="p-4">
        <ul className="space-y-1">
          <li>
            <Link href="/dashboard" className={twMerge(clsx(
              'flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900',
              'transition-colors duration-150'
            ))}>
              <LayoutDashboard className="mr-3 h-4 w-4" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/anggota" className={twMerge(clsx(
              'flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900',
              'transition-colors duration-150'
            ))}>
              <Users className="mr-3 h-4 w-4" />
              Anggota
            </Link>
          </li>
          <li>
            <Link href="/simpanan" className={twMerge(clsx(
              'flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900',
              'transition-colors duration-150'
            ))}>
              <Banknote className="mr-3 h-4 w-4" />
              Simpanan
            </Link>
          </li>
          <li>
            <Link href="/pinjaman" className={twMerge(clsx(
              'flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900',
              'transition-colors duration-150'
            ))}>
              <HandCoins className="mr-3 h-4 w-4" />
              Pinjaman
            </Link>
          </li>
          <li>
            <button
              onClick={() => setTransaksiOpen(!transaksiOpen)}
              className={twMerge(clsx(
                'flex items-center w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900',
                'transition-colors duration-150'
              ))}
            >
              <Banknote className="mr-3 h-4 w-4" />
              Transaksi
              {transaksiOpen ? (
                <ChevronDown className="ml-auto h-4 w-4 text-gray-500" />
              ) : (
                <ChevronRight className="ml-auto h-4 w-4 text-gray-500" />
              )}
            </button>
            {transaksiOpen && (
              <ul className="mt-1 ml-7 space-y-0.5 border-l-2 border-gray-100 pl-3">
                <li>
                  <Link href="/transaksi/simpanan" className="block px-3 py-2 rounded-md text-xs font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150">
                    Simpanan
                  </Link>
                </li>
                <li>
                  <Link href="/transaksi/pinjaman-angsuran" className="block px-3 py-2 rounded-md text-xs font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150">
                    Pinjaman & Angsuran
                  </Link>
                </li>
                <li>
                  <Link href="/transaksi/kas-operasional" className="block px-3 py-2 rounded-md text-xs font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150">
                    Kas Operasional
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <li className="pt-4 mt-4 border-t border-gray-100">
            <Link href="/pengaturan-ksp" className={twMerge(clsx(
              'flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900',
              'transition-colors duration-150'
            ))}>
              <Settings className="mr-3 h-4 w-4" />
              Pengaturan KSP
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;