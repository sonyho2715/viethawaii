'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Upload,
  X,
  Loader2,
  Home,
  FileText,
  MapPin,
  Phone,
  Image as ImageIcon,
  Eye,
  DollarSign,
  Bed,
  Bath,
  Square,
  PawPrint,
  Calendar,
  Building2,
} from 'lucide-react';

export interface Category {
  id: number;
  parentId: number | null;
  slug: string;
  nameVn: string;
  nameEn: string | null;
  icon: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
}

export interface Neighborhood {
  id: number;
  slug: string;
  name: string;
  island: string;
  region: string | null;
  vietnameseCommunity: string | null;
  avgRent1br: number | null;
  avgRent2br: number | null;
  lat: string | null;
  lng: string | null;
  descriptionVn: string | null;
  descriptionEn: string | null;
}

interface PostHousingClientProps {
  categories: Category[];
  neighborhoods: Neighborhood[];
  userId: string;
}

const BEDROOM_OPTIONS = [
  { value: '0', labelVn: 'Studio', labelEn: 'Studio' },
  { value: '1', labelVn: '1 phòng ngủ', labelEn: '1 Bedroom' },
  { value: '2', labelVn: '2 phòng ngủ', labelEn: '2 Bedrooms' },
  { value: '3', labelVn: '3 phòng ngủ', labelEn: '3 Bedrooms' },
  { value: '4', labelVn: '4 phòng ngủ', labelEn: '4 Bedrooms' },
  { value: '5', labelVn: '5+ phòng ngủ', labelEn: '5+ Bedrooms' },
];

const BATHROOM_OPTIONS = [
  { value: '1', label: '1' },
  { value: '1.5', label: '1.5' },
  { value: '2', label: '2' },
  { value: '2.5', label: '2.5' },
  { value: '3', label: '3' },
  { value: '4', label: '4+' },
];

const UTILITIES_OPTIONS = [
  { value: 'included', labelVn: 'Bao gồm tất cả', labelEn: 'All Included' },
  { value: 'partial', labelVn: 'Bao gồm một phần', labelEn: 'Partially Included' },
  { value: 'not-included', labelVn: 'Không bao gồm', labelEn: 'Not Included' },
];

interface FormData {
  categoryId: string;
  title: string;
  titleEn: string;
  description: string;
  price: string;
  bedrooms: string;
  bathrooms: string;
  sqft: string;
  petFriendly: boolean;
  utilities: string;
  moveInDate: string;
  location: string;
  neighborhoodId: string;
  contactPhone: string;
  contactEmail: string;
  contactName: string;
  images: { url: string; file?: File }[];
}

const STEPS = [
  { id: 1, label: 'Loại nhà', labelEn: 'Type', icon: Home },
  { id: 2, label: 'Chi tiết', labelEn: 'Details', icon: FileText },
  { id: 3, label: 'Tiện nghi', labelEn: 'Amenities', icon: Bed },
  { id: 4, label: 'Giá thuê', labelEn: 'Rent', icon: DollarSign },
  { id: 5, label: 'Địa điểm', labelEn: 'Location', icon: MapPin },
  { id: 6, label: 'Liên hệ', labelEn: 'Contact', icon: Phone },
  { id: 7, label: 'Hình ảnh', labelEn: 'Images', icon: ImageIcon },
  { id: 8, label: 'Xem lại', labelEn: 'Preview', icon: Eye },
];

export default function PostHousingClient({
  categories,
  neighborhoods,
  userId: _userId,
}: PostHousingClientProps) {
  const router = useRouter();
  const { language } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    categoryId: '',
    title: '',
    titleEn: '',
    description: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    sqft: '',
    petFriendly: false,
    utilities: '',
    moveInDate: '',
    location: '',
    neighborhoodId: '',
    contactPhone: '',
    contactEmail: '',
    contactName: '',
    images: [],
  });

  const mainCategories = categories.filter(c => !c.parentId);
  const categoryIdNum = formData.categoryId ? parseInt(formData.categoryId, 10) : null;

  const getSubcategories = (parentId: number) => {
    return categories.filter(c => c.parentId === parentId);
  };

  const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    setError(null);
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.categoryId) {
          setError(language === 'vn' ? 'Vui lòng chọn loại nhà' : 'Please select housing type');
          return false;
        }
        break;
      case 2:
        if (!formData.title.trim()) {
          setError(language === 'vn' ? 'Vui lòng nhập tiêu đề' : 'Please enter a title');
          return false;
        }
        if (formData.title.length < 10) {
          setError(language === 'vn' ? 'Tiêu đề phải có ít nhất 10 ký tự' : 'Title must be at least 10 characters');
          return false;
        }
        break;
      case 4:
        if (!formData.price.trim()) {
          setError(language === 'vn' ? 'Vui lòng nhập giá thuê' : 'Please enter rent price');
          return false;
        }
        break;
      case 6:
        if (!formData.contactPhone.trim() && !formData.contactEmail.trim()) {
          setError(language === 'vn' ? 'Vui lòng nhập số điện thoại hoặc email' : 'Please enter phone or email');
          return false;
        }
        break;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setError(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages = Array.from(files).slice(0, 10 - formData.images.length).map(file => ({
      url: URL.createObjectURL(file),
      file,
    }));

    updateField('images', [...formData.images, ...newImages]);
  };

  const removeImage = (index: number) => {
    const newImages = [...formData.images];
    if (newImages[index].url.startsWith('blob:')) {
      URL.revokeObjectURL(newImages[index].url);
    }
    newImages.splice(index, 1);
    updateField('images', newImages);
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // Upload images first
      const uploadedImageUrls: string[] = [];

      for (const img of formData.images) {
        if (img.file) {
          const formDataUpload = new FormData();
          formDataUpload.append('file', img.file);

          const uploadRes = await fetch('/api/upload', {
            method: 'POST',
            body: formDataUpload,
          });

          if (!uploadRes.ok) {
            throw new Error('Failed to upload image');
          }

          const { url } = await uploadRes.json();
          uploadedImageUrls.push(url);
        } else {
          uploadedImageUrls.push(img.url);
        }
      }

      // Create housing listing
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryId: parseInt(formData.categoryId, 10),
          title: formData.title,
          titleEn: formData.titleEn || null,
          description: formData.description || null,
          listingType: 'HOUSING',
          price: formData.price ? parseFloat(formData.price) : null,
          priceType: 'MONTHLY',
          bedrooms: formData.bedrooms ? parseInt(formData.bedrooms, 10) : null,
          bathrooms: formData.bathrooms ? parseFloat(formData.bathrooms) : null,
          sqft: formData.sqft ? parseInt(formData.sqft, 10) : null,
          petFriendly: formData.petFriendly,
          utilities: formData.utilities || null,
          moveInDate: formData.moveInDate ? new Date(formData.moveInDate).toISOString() : null,
          location: formData.location || null,
          neighborhoodId: formData.neighborhoodId ? parseInt(formData.neighborhoodId, 10) : null,
          contactPhone: formData.contactPhone?.trim() || null,
          contactEmail: formData.contactEmail?.trim() || null,
          images: uploadedImageUrls,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create listing');
      }

      const { data: listing } = await res.json();
      router.push(`/nha-o/chi-tiet/${listing.id}?success=true`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCategory = categories.find(c => c.id === categoryIdNum);
  const selectedSubCategory = categories.find(c => c.id === categoryIdNum && c.parentId);
  const parentCategory = selectedSubCategory
    ? categories.find(c => c.id === selectedSubCategory.parentId)
    : null;
  const neighborhoodIdNum = formData.neighborhoodId ? parseInt(formData.neighborhoodId, 10) : null;
  const selectedNeighborhood = neighborhoods.find(n => n.id === neighborhoodIdNum);

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/nha-o" className="text-gray-500 hover:text-emerald-600 text-sm mb-2 inline-flex items-center">
            <ChevronLeft className="h-4 w-4 mr-1" />
            {language === 'vn' ? 'Quay lại danh sách' : 'Back to listings'}
          </Link>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Home className="h-6 w-6 text-emerald-600" />
            {language === 'vn' ? 'Đăng tin cho thuê nhà' : 'Post Rental Listing'}
          </h1>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between overflow-x-auto pb-2">
            {STEPS.map((step, idx) => (
              <div key={step.id} className="flex items-center flex-shrink-0">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    currentStep > step.id
                      ? 'bg-green-600 border-green-600 text-white'
                      : currentStep === step.id
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <step.icon className="h-4 w-4" />
                  )}
                </div>
                {idx < STEPS.length - 1 && (
                  <div
                    className={`hidden sm:block w-6 h-1 mx-1 ${
                      currentStep > step.id ? 'bg-green-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="mt-2 text-center">
            <span className="text-sm font-medium text-gray-900">
              {language === 'vn' ? STEPS[currentStep - 1].label : STEPS[currentStep - 1].labelEn}
            </span>
            <span className="text-sm text-gray-500 ml-2">
              ({currentStep}/{STEPS.length})
            </span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        {/* Step Content */}
        <Card>
          <CardContent className="p-6">
            {/* Step 1: Housing Type */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <CardHeader className="p-0 pb-4">
                  <CardTitle>{language === 'vn' ? 'Chọn loại nhà' : 'Select Housing Type'}</CardTitle>
                </CardHeader>

                <div className="grid grid-cols-2 gap-4">
                  {mainCategories.map(cat => {
                    const subcats = getSubcategories(cat.id);
                    const isSelected = categoryIdNum === cat.id ||
                      subcats.some(s => s.id === categoryIdNum);

                    return (
                      <div key={cat.id}>
                        <button
                          type="button"
                          onClick={() => updateField('categoryId', String(cat.id))}
                          className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                            isSelected
                              ? 'border-emerald-600 bg-emerald-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Building2 className={`h-8 w-8 mb-2 ${isSelected ? 'text-emerald-600' : 'text-gray-400'}`} />
                          <span className="font-medium block">
                            {language === 'vn' ? cat.nameVn : cat.nameEn || cat.nameVn}
                          </span>
                        </button>

                        {isSelected && subcats.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {subcats.map(sub => (
                              <button
                                key={sub.id}
                                type="button"
                                onClick={() => updateField('categoryId', String(sub.id))}
                                className={`w-full p-2 rounded text-sm text-left ${
                                  categoryIdNum === sub.id
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-gray-100 hover:bg-gray-200'
                                }`}
                              >
                                {language === 'vn' ? sub.nameVn : sub.nameEn || sub.nameVn}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 2: Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <CardHeader className="p-0 pb-4">
                  <CardTitle>{language === 'vn' ? 'Thông tin chi tiết' : 'Listing Details'}</CardTitle>
                </CardHeader>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">
                      {language === 'vn' ? 'Tiêu đề' : 'Title'} *
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={e => updateField('title', e.target.value)}
                      placeholder={language === 'vn' ? 'VD: Cho thuê phòng riêng gần Ala Moana' : 'E.g., Private room for rent near Ala Moana'}
                      maxLength={200}
                    />
                    <p className="text-xs text-gray-500 mt-1">{formData.title.length}/200</p>
                  </div>

                  <div>
                    <Label htmlFor="titleEn">
                      {language === 'vn' ? 'Tiêu đề (tiếng Anh - tùy chọn)' : 'Title (English - optional)'}
                    </Label>
                    <Input
                      id="titleEn"
                      value={formData.titleEn}
                      onChange={e => updateField('titleEn', e.target.value)}
                      placeholder="English title for wider reach"
                      maxLength={200}
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">
                      {language === 'vn' ? 'Mô tả chi tiết' : 'Description'}
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={e => updateField('description', e.target.value)}
                      placeholder={language === 'vn'
                        ? 'Mô tả chi tiết về phòng/căn hộ, tiện nghi, yêu cầu người thuê...'
                        : 'Describe the property, amenities, tenant requirements...'}
                      rows={6}
                      maxLength={5000}
                    />
                    <p className="text-xs text-gray-500 mt-1">{formData.description.length}/5000</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Amenities */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <CardHeader className="p-0 pb-4">
                  <CardTitle>{language === 'vn' ? 'Tiện nghi' : 'Amenities'}</CardTitle>
                </CardHeader>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>{language === 'vn' ? 'Phòng ngủ' : 'Bedrooms'}</Label>
                      <Select value={formData.bedrooms} onValueChange={v => updateField('bedrooms', v)}>
                        <SelectTrigger>
                          <SelectValue placeholder={language === 'vn' ? 'Chọn' : 'Select'} />
                        </SelectTrigger>
                        <SelectContent>
                          {BEDROOM_OPTIONS.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {language === 'vn' ? opt.labelVn : opt.labelEn}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>{language === 'vn' ? 'Phòng tắm' : 'Bathrooms'}</Label>
                      <Select value={formData.bathrooms} onValueChange={v => updateField('bathrooms', v)}>
                        <SelectTrigger>
                          <SelectValue placeholder={language === 'vn' ? 'Chọn' : 'Select'} />
                        </SelectTrigger>
                        <SelectContent>
                          {BATHROOM_OPTIONS.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="sqft">{language === 'vn' ? 'Diện tích (sqft)' : 'Square Feet'}</Label>
                    <div className="relative">
                      <Square className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="sqft"
                        type="number"
                        value={formData.sqft}
                        onChange={e => updateField('sqft', e.target.value)}
                        placeholder="500"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <PawPrint className={`h-6 w-6 ${formData.petFriendly ? 'text-emerald-600' : 'text-gray-400'}`} />
                      <div>
                        <p className="font-medium">{language === 'vn' ? 'Cho phép thú cưng' : 'Pet Friendly'}</p>
                        <p className="text-sm text-gray-500">
                          {language === 'vn' ? 'Có thể nuôi chó, mèo...' : 'Dogs, cats allowed...'}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={formData.petFriendly}
                      onCheckedChange={v => updateField('petFriendly', v)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Rent */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <CardHeader className="p-0 pb-4">
                  <CardTitle>{language === 'vn' ? 'Giá thuê' : 'Rent Price'}</CardTitle>
                </CardHeader>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="price">{language === 'vn' ? 'Giá thuê hàng tháng (USD)' : 'Monthly Rent (USD)'} *</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={e => updateField('price', e.target.value)}
                        placeholder="1500"
                        className="pl-10"
                        min="0"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>{language === 'vn' ? 'Tiện ích' : 'Utilities'}</Label>
                    <Select value={formData.utilities} onValueChange={v => updateField('utilities', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder={language === 'vn' ? 'Chọn' : 'Select'} />
                      </SelectTrigger>
                      <SelectContent>
                        {UTILITIES_OPTIONS.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {language === 'vn' ? opt.labelVn : opt.labelEn}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">
                      {language === 'vn' ? 'Điện, nước, internet, v.v.' : 'Electricity, water, internet, etc.'}
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="moveInDate">{language === 'vn' ? 'Ngày có thể dọn vào' : 'Available Move-in Date'}</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="moveInDate"
                        type="date"
                        value={formData.moveInDate}
                        onChange={e => updateField('moveInDate', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Location */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <CardHeader className="p-0 pb-4">
                  <CardTitle>{language === 'vn' ? 'Địa điểm' : 'Location'}</CardTitle>
                </CardHeader>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="neighborhood">{language === 'vn' ? 'Khu vực' : 'Neighborhood'}</Label>
                    <Select
                      value={formData.neighborhoodId}
                      onValueChange={v => updateField('neighborhoodId', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={language === 'vn' ? 'Chọn khu vực' : 'Select neighborhood'} />
                      </SelectTrigger>
                      <SelectContent>
                        {neighborhoods.map(n => (
                          <SelectItem key={n.id} value={String(n.id)}>
                            {n.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="location">
                      {language === 'vn' ? 'Địa chỉ hoặc mô tả vị trí' : 'Address or location description'}
                    </Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={e => updateField('location', e.target.value)}
                      placeholder={language === 'vn' ? 'VD: Gần trạm bus, cách Ala Moana 10 phút' : 'E.g., Near bus stop, 10 min from Ala Moana'}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Contact */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <CardHeader className="p-0 pb-4">
                  <CardTitle>{language === 'vn' ? 'Thông tin liên hệ' : 'Contact Information'}</CardTitle>
                </CardHeader>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="contactName">{language === 'vn' ? 'Tên liên hệ' : 'Contact Name'}</Label>
                    <Input
                      id="contactName"
                      value={formData.contactName}
                      onChange={e => updateField('contactName', e.target.value)}
                      placeholder={language === 'vn' ? 'Tên của bạn' : 'Your name'}
                    />
                  </div>

                  <div>
                    <Label htmlFor="contactPhone">
                      {language === 'vn' ? 'Số điện thoại' : 'Phone Number'} *
                    </Label>
                    <Input
                      id="contactPhone"
                      type="tel"
                      value={formData.contactPhone}
                      onChange={e => updateField('contactPhone', e.target.value)}
                      placeholder="(808) 555-1234"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contactEmail">{language === 'vn' ? 'Email' : 'Email'}</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={e => updateField('contactEmail', e.target.value)}
                      placeholder="your@email.com"
                    />
                  </div>

                  <p className="text-sm text-gray-500">
                    {language === 'vn'
                      ? '* Vui lòng cung cấp ít nhất số điện thoại hoặc email'
                      : '* Please provide at least a phone number or email'}
                  </p>
                </div>
              </div>
            )}

            {/* Step 7: Images */}
            {currentStep === 7 && (
              <div className="space-y-6">
                <CardHeader className="p-0 pb-4">
                  <CardTitle>{language === 'vn' ? 'Hình ảnh' : 'Images'}</CardTitle>
                </CardHeader>

                <div>
                  <Label>
                    {language === 'vn'
                      ? `Tải lên hình ảnh (${formData.images.length}/10)`
                      : `Upload images (${formData.images.length}/10)`}
                  </Label>

                  <div className="mt-2 grid grid-cols-3 sm:grid-cols-5 gap-4">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={img.url}
                          alt={`Image ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                        {idx === 0 && (
                          <span className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-2 py-0.5 rounded">
                            {language === 'vn' ? 'Chính' : 'Main'}
                          </span>
                        )}
                      </div>
                    ))}

                    {formData.images.length < 10 && (
                      <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-600 hover:bg-emerald-50 transition-colors">
                        <Upload className="h-6 w-6 text-gray-400" />
                        <span className="text-xs text-gray-500 mt-1">
                          {language === 'vn' ? 'Tải lên' : 'Upload'}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </label>
                    )}
                  </div>

                  <p className="text-sm text-gray-500 mt-2">
                    {language === 'vn'
                      ? 'Hình đầu tiên sẽ là hình chính. Hình ảnh rõ ràng giúp thu hút người thuê.'
                      : 'First image will be the main image. Clear photos attract more renters.'}
                  </p>
                </div>
              </div>
            )}

            {/* Step 8: Preview */}
            {currentStep === 8 && (
              <div className="space-y-6">
                <CardHeader className="p-0 pb-4">
                  <CardTitle>{language === 'vn' ? 'Xem lại tin đăng' : 'Review Your Listing'}</CardTitle>
                </CardHeader>

                <div className="space-y-4">
                  {/* Preview Image */}
                  {formData.images.length > 0 && (
                    <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={formData.images[0].url}
                        alt="Preview"
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}

                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-500">{language === 'vn' ? 'Loại:' : 'Type:'}</span>
                      <p className="font-medium">
                        {parentCategory && `${language === 'vn' ? parentCategory.nameVn : parentCategory.nameEn} > `}
                        {selectedCategory && (language === 'vn' ? selectedCategory.nameVn : selectedCategory.nameEn)}
                      </p>
                    </div>

                    <div>
                      <span className="text-sm text-gray-500">{language === 'vn' ? 'Tiêu đề:' : 'Title:'}</span>
                      <p className="font-medium text-lg">{formData.title}</p>
                      {formData.titleEn && <p className="text-gray-600">{formData.titleEn}</p>}
                    </div>

                    <div>
                      <span className="text-sm text-gray-500">{language === 'vn' ? 'Giá thuê:' : 'Rent:'}</span>
                      <p className="font-bold text-xl text-emerald-600">
                        ${formData.price}/{language === 'vn' ? 'tháng' : 'mo'}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-4">
                      {formData.bedrooms && (
                        <div className="flex items-center gap-1">
                          <Bed className="h-4 w-4 text-gray-500" />
                          <span>{BEDROOM_OPTIONS.find(o => o.value === formData.bedrooms)?.[language === 'vn' ? 'labelVn' : 'labelEn']}</span>
                        </div>
                      )}
                      {formData.bathrooms && (
                        <div className="flex items-center gap-1">
                          <Bath className="h-4 w-4 text-gray-500" />
                          <span>{formData.bathrooms} {language === 'vn' ? 'phòng tắm' : 'bath'}</span>
                        </div>
                      )}
                      {formData.sqft && (
                        <div className="flex items-center gap-1">
                          <Square className="h-4 w-4 text-gray-500" />
                          <span>{formData.sqft} sqft</span>
                        </div>
                      )}
                      {formData.petFriendly && (
                        <div className="flex items-center gap-1 text-emerald-600">
                          <PawPrint className="h-4 w-4" />
                          <span>{language === 'vn' ? 'Thú cưng OK' : 'Pet Friendly'}</span>
                        </div>
                      )}
                    </div>

                    {formData.utilities && (
                      <div>
                        <span className="text-sm text-gray-500">{language === 'vn' ? 'Tiện ích:' : 'Utilities:'}</span>
                        <p>{UTILITIES_OPTIONS.find(o => o.value === formData.utilities)?.[language === 'vn' ? 'labelVn' : 'labelEn']}</p>
                      </div>
                    )}

                    {formData.description && (
                      <div>
                        <span className="text-sm text-gray-500">{language === 'vn' ? 'Mô tả:' : 'Description:'}</span>
                        <p className="whitespace-pre-wrap text-sm">{formData.description}</p>
                      </div>
                    )}

                    {(selectedNeighborhood || formData.location) && (
                      <div>
                        <span className="text-sm text-gray-500">{language === 'vn' ? 'Địa điểm:' : 'Location:'}</span>
                        <p>
                          {formData.location && `${formData.location}, `}
                          {selectedNeighborhood?.name}
                        </p>
                      </div>
                    )}

                    <div>
                      <span className="text-sm text-gray-500">{language === 'vn' ? 'Liên hệ:' : 'Contact:'}</span>
                      <p>
                        {formData.contactName && `${formData.contactName} - `}
                        {formData.contactPhone}
                        {formData.contactEmail && ` / ${formData.contactEmail}`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1 || isSubmitting}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            {language === 'vn' ? 'Quay lại' : 'Back'}
          </Button>

          {currentStep < STEPS.length ? (
            <Button onClick={nextStep} className="bg-emerald-600 hover:bg-emerald-700">
              {language === 'vn' ? 'Tiếp tục' : 'Continue'}
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {language === 'vn' ? 'Đang đăng...' : 'Posting...'}
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  {language === 'vn' ? 'Đăng tin' : 'Post Listing'}
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
