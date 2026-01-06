import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { SettingsForm } from './SettingsForm';

// Default settings structure
const DEFAULT_SETTINGS = {
  siteName: 'VietHawaii',
  siteDescription: 'Cong dong nguoi Viet tai Hawaii',
  siteDescriptionEn: 'Vietnamese Community in Hawaii',
  contactEmail: '',
  contactPhone: '',
  contactAddress: '',
  socialFacebook: '',
  socialInstagram: '',
  socialYoutube: '',
  socialTiktok: '',
  seoTitle: 'VietHawaii - Cong dong nguoi Viet tai Hawaii',
  seoDescription: 'Rao vat, tin tuc, cong cu tinh toan cho nguoi Viet tai Hawaii',
  enableListings: true,
  enableNews: true,
  enableTools: true,
  maintenanceMode: false,
  exchangeRateApiKey: '',
};

export default async function AdminSettingsPage() {
  const session = await auth();
  if (!session?.user || !['ADMIN', 'SUPERADMIN'].includes(session.user.role)) {
    redirect('/dang-nhap');
  }

  // Only SUPERADMIN can access all settings
  const isSuperAdmin = session.user.role === 'SUPERADMIN';

  // Get all settings from database
  const dbSettings = await db.siteSetting.findMany();

  // Merge default settings with database settings
  const settings: Record<string, any> = { ...DEFAULT_SETTINGS };
  for (const setting of dbSettings) {
    settings[setting.key] = setting.value;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Cai dat he thong</h1>
        <p className="text-gray-600 mt-1">Quan ly cau hinh website</p>
      </div>

      <SettingsForm settings={settings} isSuperAdmin={isSuperAdmin} />
    </div>
  );
}
