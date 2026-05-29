import Link from 'next/link';
import { 
  LayoutDashboard, 
  Users, 
  Banknote, 
  HandCoins, 
  Settings 
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Sidebar = () => {
  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200">
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <Link href="/dashboard" className={twMerge(clsx(
              'flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900',
              'active:bg-blue-50 active:text-blue-600'
            ))}>
              <LayoutDashboard className="mr-3 h-4 w-4" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/anggota" className={twMerge(clsx(
              'flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900',
              'active:bg-blue-50 active:text-blue-600'
            ))}>
              <Users className="mr-3 h-4 w-4" />
              Anggota
            </Link>
          </li>
          <li>
            <Link href="/simpanan" className={twMerge(clsx(
              'flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900',
              'active:bg-blue-50 active:text-blue-600'
            ))}>
              <Banknote className="mr-3 h-4 w-4" />
              Simpanan
            </Link>
          </li>
          <li>
            <Link href="/pinjaman" className={twMerge(clsx(
              'flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900',
              'active:bg-blue-50 active:text-blue-600'
            ))}>
              <HandCoins className="mr-3 h-4 w-4" />
              Pinjaman
            </Link>
          </li>
          <li>
            <Link href="/pengaturan-ksp" className={twMerge(clsx(
              'flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900',
              'active:bg-blue-50 active:text-blue-600'
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