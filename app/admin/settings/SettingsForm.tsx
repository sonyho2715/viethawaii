'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Loader2, Globe, Phone, Share2, Search, Settings2 } from 'lucide-react';

interface SettingsFormProps {
  settings: Record<string, any>;
  isSuperAdmin: boolean;
}

export function SettingsForm({ settings, isSuperAdmin }: SettingsFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    // General
    siteName: settings.siteName || '',
    siteDescription: settings.siteDescription || '',
    siteDescriptionEn: settings.siteDescriptionEn || '',
    // Contact
    contactEmail: settings.contactEmail || '',
    contactPhone: settings.contactPhone || '',
    contactAddress: settings.contactAddress || '',
    // Social
    socialFacebook: settings.socialFacebook || '',
    socialInstagram: settings.socialInstagram || '',
    socialYoutube: settings.socialYoutube || '',
    socialTiktok: settings.socialTiktok || '',
    // SEO
    seoTitle: settings.seoTitle || '',
    seoDescription: settings.seoDescription || '',
    // Features
    enableListings: settings.enableListings ?? true,
    enableNews: settings.enableNews ?? true,
    enableTools: settings.enableTools ?? true,
    maintenanceMode: settings.maintenanceMode ?? false,
    // API Keys (only for superadmin)
    exchangeRateApiKey: settings.exchangeRateApiKey || '',
  });

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Co loi xay ra');
      }

      setMessage({ type: 'success', text: 'Da luu cai dat thanh cong!' });
      router.refresh();
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Co loi xay ra' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* General Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
          <Globe className="h-5 w-5 text-teal-600" />
          <h2 className="text-lg font-semibold text-gray-900">Thong tin chung</h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ten website
            </label>
            <input
              type="text"
              value={formData.siteName}
              onChange={(e) => handleChange('siteName', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="VietHawaii"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mo ta (Tieng Viet)
              </label>
              <textarea
                value={formData.siteDescription}
                onChange={(e) => handleChange('siteDescription', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Cong dong nguoi Viet tai Hawaii"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (English)
              </label>
              <textarea
                value={formData.siteDescriptionEn}
                onChange={(e) => handleChange('siteDescriptionEn', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Vietnamese Community in Hawaii"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Contact Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
          <Phone className="h-5 w-5 text-teal-600" />
          <h2 className="text-lg font-semibold text-gray-900">Thong tin lien he</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => handleChange('contactEmail', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="contact@viethawaii.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                So dien thoai
              </label>
              <input
                type="text"
                value={formData.contactPhone}
                onChange={(e) => handleChange('contactPhone', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="(808) xxx-xxxx"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dia chi
            </label>
            <input
              type="text"
              value={formData.contactAddress}
              onChange={(e) => handleChange('contactAddress', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Honolulu, Hawaii"
            />
          </div>
        </div>
      </div>

      {/* Social Media */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
          <Share2 className="h-5 w-5 text-teal-600" />
          <h2 className="text-lg font-semibold text-gray-900">Mang xa hoi</h2>
        </div>
        <div className="p-6 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Facebook
            </label>
            <input
              type="url"
              value={formData.socialFacebook}
              onChange={(e) => handleChange('socialFacebook', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="https://facebook.com/viethawaii"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instagram
            </label>
            <input
              type="url"
              value={formData.socialInstagram}
              onChange={(e) => handleChange('socialInstagram', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="https://instagram.com/viethawaii"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              YouTube
            </label>
            <input
              type="url"
              value={formData.socialYoutube}
              onChange={(e) => handleChange('socialYoutube', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="https://youtube.com/@viethawaii"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              TikTok
            </label>
            <input
              type="url"
              value={formData.socialTiktok}
              onChange={(e) => handleChange('socialTiktok', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="https://tiktok.com/@viethawaii"
            />
          </div>
        </div>
      </div>

      {/* SEO Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
          <Search className="h-5 w-5 text-teal-600" />
          <h2 className="text-lg font-semibold text-gray-900">SEO</h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SEO Title
            </label>
            <input
              type="text"
              value={formData.seoTitle}
              onChange={(e) => handleChange('seoTitle', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="VietHawaii - Cong dong nguoi Viet tai Hawaii"
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.seoTitle.length}/60 ky tu
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SEO Description
            </label>
            <textarea
              value={formData.seoDescription}
              onChange={(e) => handleChange('seoDescription', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Rao vat, tin tuc, cong cu tinh toan cho nguoi Viet tai Hawaii"
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.seoDescription.length}/160 ky tu
            </p>
          </div>
        </div>
      </div>

      {/* Feature Toggles */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
          <Settings2 className="h-5 w-5 text-teal-600" />
          <h2 className="text-lg font-semibold text-gray-900">Tinh nang</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Rao vat</p>
              <p className="text-sm text-gray-500">Cho phep dang tin rao vat</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.enableListings}
                onChange={(e) => handleChange('enableListings', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Tin tuc</p>
              <p className="text-sm text-gray-500">Hien thi muc tin tuc</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.enableNews}
                onChange={(e) => handleChange('enableNews', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Cong cu</p>
              <p className="text-sm text-gray-500">Hien thi cac cong cu tinh toan</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.enableTools}
                onChange={(e) => handleChange('enableTools', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-red-600">Che do bao tri</p>
              <p className="text-sm text-gray-500">Tat website tam thoi de bao tri</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.maintenanceMode}
                onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* API Keys - Only for SuperAdmin */}
      {isSuperAdmin && (
        <div className="bg-white rounded-xl shadow-sm border border-amber-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-amber-200 bg-amber-50 flex items-center gap-3">
            <Settings2 className="h-5 w-5 text-amber-600" />
            <h2 className="text-lg font-semibold text-amber-800">API Keys (SuperAdmin Only)</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exchange Rate API Key
              </label>
              <input
                type="password"
                value={formData.exchangeRateApiKey}
                onChange={(e) => handleChange('exchangeRateApiKey', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent font-mono"
                placeholder="API key cho ty gia tien te"
              />
              <p className="text-xs text-gray-500 mt-1">
                Dung cho cong cu doi tien. De trong neu khong can.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Save className="h-5 w-5" />
          )}
          Luu cai dat
        </button>
      </div>
    </form>
  );
}
