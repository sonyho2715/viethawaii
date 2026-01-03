'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n';
import { createListing, updateListing } from '@/app/rao-vat/actions';
import {
  hawaiiIslands,
  priceTypes,
  contactMethods,
} from '@/lib/validations/classified';
import {
  Loader2,
  DollarSign,
  MapPin,
  Phone,
  Mail,
  ImagePlus,
  AlertCircle,
  Check,
} from 'lucide-react';

interface Category {
  id: string;
  slug: string;
  name: string;
  nameEn: string | null;
  icon: string | null;
  parentId: string | null;
  parent?: Category | null;
  children?: Category[];
}

interface ListingFormProps {
  categories: Category[];
  initialData?: any;
  mode?: 'create' | 'edit';
}

export default function ListingForm({
  categories,
  initialData,
  mode = 'create',
}: ListingFormProps) {
  const router = useRouter();
  const { language, getText } = useLanguage();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [selectedMainCategory, setSelectedMainCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [price, setPrice] = useState(initialData?.price || '');
  const [priceType, setPriceType] = useState(initialData?.priceType || 'fixed');
  const [island, setIsland] = useState(initialData?.island || 'oahu');
  const [city, setCity] = useState(initialData?.city || '');
  const [zipCode, setZipCode] = useState(initialData?.zipCode || '');
  const [neighborhood, setNeighborhood] = useState(initialData?.neighborhood || '');
  const [contactEmail, setContactEmail] = useState(initialData?.contactEmail || '');
  const [contactPhone, setContactPhone] = useState(initialData?.contactPhone || '');
  const [contactMethod, setContactMethod] = useState(initialData?.contactMethod || 'email');
  const [hideExactLocation, setHideExactLocation] = useState(
    initialData?.hideExactLocation ?? true
  );
  const [urgent, setUrgent] = useState(initialData?.urgent || false);

  // Type-specific state
  const [jobDetails, setJobDetails] = useState(initialData?.jobDetails || {});
  const [housingDetails, setHousingDetails] = useState(initialData?.housingDetails || {});
  const [vehicleDetails, setVehicleDetails] = useState(initialData?.vehicleDetails || {});

  // Get main categories (no parent)
  const mainCategories = categories.filter((c) => !c.parentId);

  // Get subcategories for selected main category
  const subcategories = categories.filter((c) => {
    const mainCat = mainCategories.find((m) => m.id === selectedMainCategory);
    return mainCat && c.parentId === mainCat.id;
  });

  // Determine category type for showing type-specific fields
  const getCategoryType = (): 'job' | 'housing' | 'vehicle' | 'general' => {
    const mainCat = mainCategories.find((c) => c.id === selectedMainCategory);
    if (!mainCat) return 'general';
    if (mainCat.slug === 'viec-lam') return 'job';
    if (mainCat.slug === 'nha-o') return 'housing';
    if (mainCat.slug === 'mua-ban') {
      const subCat = categories.find((c) => c.id === selectedSubCategory);
      if (subCat?.slug.includes('xe-hoi') || subCat?.slug.includes('xe-may')) {
        return 'vehicle';
      }
    }
    return 'general';
  };

  const categoryType = getCategoryType();

  // Handle initial data for edit mode
  useEffect(() => {
    if (initialData?.categoryId) {
      const cat = categories.find((c) => c.id === initialData.categoryId);
      if (cat?.parentId) {
        setSelectedMainCategory(cat.parentId);
        setSelectedSubCategory(cat.id);
      } else if (cat) {
        setSelectedMainCategory(cat.id);
      }
    }
  }, [initialData, categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const categoryId = selectedSubCategory || selectedMainCategory;

      if (!categoryId) {
        setError(language === 'vi' ? 'Vui lòng chọn danh mục' : 'Please select a category');
        setIsSubmitting(false);
        return;
      }

      const data = {
        categoryId,
        title,
        description,
        price: price ? parseFloat(price) : undefined,
        priceType,
        island,
        city: city || undefined,
        zipCode: zipCode || undefined,
        neighborhood: neighborhood || undefined,
        contactEmail: contactEmail || undefined,
        contactPhone: contactPhone || undefined,
        contactMethod,
        hideExactLocation,
        urgent,
        images: [],
        ...(categoryType === 'job' && { jobDetails }),
        ...(categoryType === 'housing' && { housingDetails }),
        ...(categoryType === 'vehicle' && { vehicleDetails }),
      };

      let result;
      if (mode === 'edit' && initialData?.id) {
        result = await updateListing(initialData.id, data);
      } else {
        result = await createListing(data);
      }

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/rao-vat');
        }, 2000);
      } else {
        setError(result.error || 'Có lỗi xảy ra');
      }
    } catch (err) {
      setError('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-green-800 mb-2">
          {mode === 'edit'
            ? language === 'vi'
              ? 'Đã cập nhật tin đăng!'
              : 'Listing Updated!'
            : language === 'vi'
            ? 'Đã đăng tin thành công!'
            : 'Listing Posted Successfully!'}
        </h3>
        <p className="text-green-600">
          {language === 'vi'
            ? 'Tin đăng của bạn đang chờ duyệt...'
            : 'Your listing is pending review...'}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Category Selection */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          {language === 'vi' ? 'Danh Mục' : 'Category'}
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {language === 'vi' ? 'Danh mục chính *' : 'Main Category *'}
            </label>
            <select
              value={selectedMainCategory}
              onChange={(e) => {
                setSelectedMainCategory(e.target.value);
                setSelectedSubCategory('');
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              required
            >
              <option value="">
                {language === 'vi' ? '-- Chọn danh mục --' : '-- Select category --'}
              </option>
              {mainCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {getText(cat.name, cat.nameEn)}
                </option>
              ))}
            </select>
          </div>

          {subcategories.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {language === 'vi' ? 'Danh mục phụ' : 'Subcategory'}
              </label>
              <select
                value={selectedSubCategory}
                onChange={(e) => setSelectedSubCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              >
                <option value="">
                  {language === 'vi' ? '-- Chọn danh mục phụ --' : '-- Select subcategory --'}
                </option>
                {subcategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {getText(cat.name, cat.nameEn)}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Basic Info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          {language === 'vi' ? 'Thông Tin Cơ Bản' : 'Basic Information'}
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {language === 'vi' ? 'Tiêu đề *' : 'Title *'}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                language === 'vi'
                  ? 'Nhập tiêu đề tin đăng...'
                  : 'Enter listing title...'
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              required
              minLength={5}
              maxLength={100}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {language === 'vi' ? 'Mô tả chi tiết *' : 'Description *'}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                language === 'vi'
                  ? 'Mô tả chi tiết về tin đăng của bạn...'
                  : 'Describe your listing in detail...'
              }
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              required
              minLength={20}
              maxLength={5000}
            />
            <p className="text-sm text-gray-500 mt-1">
              {description.length}/5000
            </p>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          {language === 'vi' ? 'Giá Cả' : 'Pricing'}
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {language === 'vi' ? 'Giá ($)' : 'Price ($)'}
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {language === 'vi' ? 'Loại giá' : 'Price Type'}
            </label>
            <select
              value={priceType}
              onChange={(e) => setPriceType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            >
              {priceTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {language === 'vi' ? type.labelVi : type.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          {language === 'vi' ? 'Địa Điểm' : 'Location'}
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {language === 'vi' ? 'Đảo *' : 'Island *'}
            </label>
            <select
              value={island}
              onChange={(e) => setIsland(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              required
            >
              {hawaiiIslands.map((isl) => (
                <option key={isl.value} value={isl.value}>
                  {language === 'vi' ? isl.labelVi : isl.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {language === 'vi' ? 'Thành phố' : 'City'}
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Honolulu, Waipahu..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {language === 'vi' ? 'Khu vực' : 'Neighborhood'}
            </label>
            <input
              type="text"
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              placeholder="Chinatown, Kalihi..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              ZIP Code
            </label>
            <input
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="96813"
              maxLength={10}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={hideExactLocation}
              onChange={(e) => setHideExactLocation(e.target.checked)}
              className="w-4 h-4 text-rose-600 rounded"
            />
            <span className="text-sm text-gray-700">
              {language === 'vi'
                ? 'Ẩn địa chỉ chính xác (chỉ hiện khu vực)'
                : 'Hide exact address (show area only)'}
            </span>
          </label>
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Phone className="w-5 h-5" />
          {language === 'vi' ? 'Thông Tin Liên Hệ' : 'Contact Information'}
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="email@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {language === 'vi' ? 'Điện thoại' : 'Phone'}
            </label>
            <input
              type="tel"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="(808) 123-4567"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {language === 'vi' ? 'Phương thức liên hệ' : 'Contact Method'}
            </label>
            <select
              value={contactMethod}
              onChange={(e) => setContactMethod(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            >
              {contactMethods.map((method) => (
                <option key={method.value} value={method.value}>
                  {language === 'vi' ? method.labelVi : method.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Job Details (conditional) */}
      {categoryType === 'job' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            {language === 'vi' ? 'Chi Tiết Việc Làm' : 'Job Details'}
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {language === 'vi' ? 'Loại hình' : 'Employment Type'}
              </label>
              <select
                value={jobDetails.employmentType || ''}
                onChange={(e) =>
                  setJobDetails({ ...jobDetails, employmentType: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              >
                <option value="">-- {language === 'vi' ? 'Chọn' : 'Select'} --</option>
                <option value="full-time">
                  {language === 'vi' ? 'Toàn thời gian' : 'Full-time'}
                </option>
                <option value="part-time">
                  {language === 'vi' ? 'Bán thời gian' : 'Part-time'}
                </option>
                <option value="contract">
                  {language === 'vi' ? 'Hợp đồng' : 'Contract'}
                </option>
                <option value="temporary">
                  {language === 'vi' ? 'Tạm thời' : 'Temporary'}
                </option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {language === 'vi' ? 'Lương ($/giờ hoặc tháng)' : 'Salary'}
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={jobDetails.salaryMin || ''}
                  onChange={(e) =>
                    setJobDetails({ ...jobDetails, salaryMin: e.target.value })
                  }
                  placeholder="Min"
                  className="w-1/2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
                <input
                  type="number"
                  value={jobDetails.salaryMax || ''}
                  onChange={(e) =>
                    setJobDetails({ ...jobDetails, salaryMax: e.target.value })
                  }
                  placeholder="Max"
                  className="w-1/2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {language === 'vi' ? 'Kinh nghiệm yêu cầu' : 'Experience Required'}
              </label>
              <input
                type="text"
                value={jobDetails.experienceRequired || ''}
                onChange={(e) =>
                  setJobDetails({ ...jobDetails, experienceRequired: e.target.value })
                }
                placeholder={language === 'vi' ? '1-2 năm...' : '1-2 years...'}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {language === 'vi' ? 'Lịch làm việc' : 'Schedule'}
              </label>
              <input
                type="text"
                value={jobDetails.schedule || ''}
                onChange={(e) =>
                  setJobDetails({ ...jobDetails, schedule: e.target.value })
                }
                placeholder={language === 'vi' ? 'Thứ 2-6, 9am-5pm' : 'Mon-Fri, 9am-5pm'}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      )}

      {/* Housing Details (conditional) */}
      {categoryType === 'housing' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            {language === 'vi' ? 'Chi Tiết Nhà Ở' : 'Housing Details'}
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {language === 'vi' ? 'Phòng ngủ' : 'Bedrooms'}
              </label>
              <input
                type="number"
                value={housingDetails.bedrooms || ''}
                onChange={(e) =>
                  setHousingDetails({ ...housingDetails, bedrooms: e.target.value })
                }
                min="0"
                max="20"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {language === 'vi' ? 'Phòng tắm' : 'Bathrooms'}
              </label>
              <input
                type="number"
                value={housingDetails.bathrooms || ''}
                onChange={(e) =>
                  setHousingDetails({ ...housingDetails, bathrooms: e.target.value })
                }
                min="0"
                max="10"
                step="0.5"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {language === 'vi' ? 'Diện tích (sqft)' : 'Square Feet'}
              </label>
              <input
                type="number"
                value={housingDetails.sqft || ''}
                onChange={(e) =>
                  setHousingDetails({ ...housingDetails, sqft: e.target.value })
                }
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {language === 'vi' ? 'Chỗ đậu xe' : 'Parking'}
              </label>
              <input
                type="number"
                value={housingDetails.parking || ''}
                onChange={(e) =>
                  setHousingDetails({ ...housingDetails, parking: e.target.value })
                }
                min="0"
                max="10"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {language === 'vi' ? 'Ngày có phòng' : 'Available Date'}
              </label>
              <input
                type="date"
                value={housingDetails.availableDate || ''}
                onChange={(e) =>
                  setHousingDetails({ ...housingDetails, availableDate: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-4 mt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={housingDetails.furnished || false}
                onChange={(e) =>
                  setHousingDetails({ ...housingDetails, furnished: e.target.checked })
                }
                className="w-4 h-4 text-rose-600 rounded"
              />
              <span className="text-sm text-gray-700">
                {language === 'vi' ? 'Có nội thất' : 'Furnished'}
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={housingDetails.petsAllowed || false}
                onChange={(e) =>
                  setHousingDetails({ ...housingDetails, petsAllowed: e.target.checked })
                }
                className="w-4 h-4 text-rose-600 rounded"
              />
              <span className="text-sm text-gray-700">
                {language === 'vi' ? 'Cho phép thú cưng' : 'Pets Allowed'}
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={housingDetails.utilitiesIncluded || false}
                onChange={(e) =>
                  setHousingDetails({
                    ...housingDetails,
                    utilitiesIncluded: e.target.checked,
                  })
                }
                className="w-4 h-4 text-rose-600 rounded"
              />
              <span className="text-sm text-gray-700">
                {language === 'vi' ? 'Bao tiền điện nước' : 'Utilities Included'}
              </span>
            </label>
          </div>
        </div>
      )}

      {/* Vehicle Details (conditional) */}
      {categoryType === 'vehicle' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            {language === 'vi' ? 'Chi Tiết Xe' : 'Vehicle Details'}
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {language === 'vi' ? 'Hãng xe' : 'Make'}
              </label>
              <input
                type="text"
                value={vehicleDetails.make || ''}
                onChange={(e) =>
                  setVehicleDetails({ ...vehicleDetails, make: e.target.value })
                }
                placeholder="Toyota, Honda..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {language === 'vi' ? 'Dòng xe' : 'Model'}
              </label>
              <input
                type="text"
                value={vehicleDetails.model || ''}
                onChange={(e) =>
                  setVehicleDetails({ ...vehicleDetails, model: e.target.value })
                }
                placeholder="Camry, Civic..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {language === 'vi' ? 'Năm' : 'Year'}
              </label>
              <input
                type="number"
                value={vehicleDetails.year || ''}
                onChange={(e) =>
                  setVehicleDetails({ ...vehicleDetails, year: e.target.value })
                }
                min="1900"
                max={new Date().getFullYear() + 1}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {language === 'vi' ? 'Số dặm' : 'Mileage'}
              </label>
              <input
                type="number"
                value={vehicleDetails.mileage || ''}
                onChange={(e) =>
                  setVehicleDetails({ ...vehicleDetails, mileage: e.target.value })
                }
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {language === 'vi' ? 'Tình trạng' : 'Condition'}
              </label>
              <select
                value={vehicleDetails.condition || ''}
                onChange={(e) =>
                  setVehicleDetails({ ...vehicleDetails, condition: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              >
                <option value="">-- {language === 'vi' ? 'Chọn' : 'Select'} --</option>
                <option value="new">{language === 'vi' ? 'Mới' : 'New'}</option>
                <option value="like-new">{language === 'vi' ? 'Như mới' : 'Like New'}</option>
                <option value="excellent">
                  {language === 'vi' ? 'Xuất sắc' : 'Excellent'}
                </option>
                <option value="good">{language === 'vi' ? 'Tốt' : 'Good'}</option>
                <option value="fair">
                  {language === 'vi' ? 'Bình thường' : 'Fair'}
                </option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {language === 'vi' ? 'Hộp số' : 'Transmission'}
              </label>
              <select
                value={vehicleDetails.transmission || ''}
                onChange={(e) =>
                  setVehicleDetails({ ...vehicleDetails, transmission: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              >
                <option value="">-- {language === 'vi' ? 'Chọn' : 'Select'} --</option>
                <option value="automatic">
                  {language === 'vi' ? 'Tự động' : 'Automatic'}
                </option>
                <option value="manual">{language === 'vi' ? 'Số sàn' : 'Manual'}</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Options */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          {language === 'vi' ? 'Tùy Chọn' : 'Options'}
        </h3>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={urgent}
            onChange={(e) => setUrgent(e.target.checked)}
            className="w-5 h-5 text-rose-600 rounded"
          />
          <div>
            <span className="font-semibold text-gray-900">
              {language === 'vi' ? 'Đánh dấu KHẨN CẤP' : 'Mark as URGENT'}
            </span>
            <p className="text-sm text-gray-500">
              {language === 'vi'
                ? 'Tin đăng sẽ được đánh dấu nổi bật'
                : 'Your listing will be highlighted'}
            </p>
          </div>
        </label>
      </div>

      {/* Submit Button */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition"
        >
          {language === 'vi' ? 'Hủy' : 'Cancel'}
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-lg font-bold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {language === 'vi' ? 'Đang đăng...' : 'Posting...'}
            </>
          ) : mode === 'edit' ? (
            language === 'vi' ? 'Cập Nhật Tin' : 'Update Listing'
          ) : (
            language === 'vi' ? 'Đăng Tin' : 'Post Listing'
          )}
        </button>
      </div>
    </form>
  );
}
