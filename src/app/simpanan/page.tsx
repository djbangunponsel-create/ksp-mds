'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SimpananPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/transaksi/simpanan');
  }, [router]);
  return null;
}