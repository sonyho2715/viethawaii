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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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
  Tag,
  FileText,
  MapPin,
  Phone,
  Image as ImageIcon,
  Eye,
} from 'lucide-react';
import type { Category, Neighborhood } from '@prisma/client';

interface PostListingClientProps {
  categories: Category[];
  neighborhoods: Neighborhood[];
  userId: string;
}

type PriceType = 'FIXED' | 'NEGOTIABLE' | 'FREE' | 'HOURLY' | 'MONTHLY';

interface FormData {
  categoryId: string;
  title: string;
  titleEn: string;
  description: string;
  price: string;
  priceType: PriceType;
  location: string;
  neighborhoodId: string;
  contactPhone: string;
  contactEmail: string;
  contactName: string;
  images: { url: string; file?: File }[];
}

const STEPS = [
  { id: 1, label: 'Danh mục', labelEn: 'Category', icon: Tag },
  { id: 2, label: 'Thông tin', labelEn: 'Details', icon: FileText },
  { id: 3, label: 'Vị trí', labelEn: 'Location', icon: MapPin },
  { id: 4, label: 'Liên hệ', labelEn: 'Contact', icon: Phone },
  { id: 5, label: 'Hình ảnh', labelEn: 'Images', icon: ImageIcon },
  { id: 6, label: 'Xem lại', labelEn: 'Preview', icon: Eye },
];

export default function PostListingClient({
  categories,
  neighborhoods,
  userId,
}: PostListingClientProps) {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    categoryId: '',
    title: '',
    titleEn: '',
    description: '',
    price: '',
    priceType: 'FIXED',
    location: '',
    neighborhoodId: '',
    contactPhone: '',
    contactEmail: '',
    contactName: '',
    images: [],
  });

  // Get main categories and subcategories
  const mainCategories = categories.filter(c => !c.parentId);
  const categoryIdNum = formData.categoryId ? parseInt(formData.categoryId, 10) : null;
  const selectedMainCategory = categories.find(c => c.id === categoryIdNum);
  const selectedSubCategory = categories.find(c => c.id === categoryIdNum && c.parentId);
  const parentCategory = selectedSubCategory
    ? categories.find(c => c.id === selectedSubCategory.parentId)
    : null;

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
          setError(language === 'vn' ? 'Vui lòng chọn danh mục' : 'Please select a category');
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

      // Create listing
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryId: formData.categoryId,
          title: formData.title,
          titleEn: formData.titleEn || null,
          description: formData.description || null,
          price: formData.price ? parseFloat(formData.price) : null,
          priceType: formData.priceType,
          location: formData.location || null,
          neighborhoodId: formData.neighborhoodId || null,
          contactPhone: formData.contactPhone || null,
          contactEmail: formData.contactEmail || null,
          contactName: formData.contactName || null,
          images: uploadedImageUrls,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create listing');
      }

      const { data: listing } = await res.json();
      router.push(`/rao-vat/chi-tiet/${listing.id}?success=true`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCategory = categories.find(c => c.id === categoryIdNum);
  const neighborhoodIdNum = formData.neighborhoodId ? parseInt(formData.neighborhoodId, 10) : null;
  const selectedNeighborhood = neighborhoods.find(n => n.id === neighborhoodIdNum);

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/rao-vat" className="text-gray-500 hover:text-red-600 text-sm mb-2 inline-flex items-center">
            <ChevronLeft className="h-4 w-4 mr-1" />
            {language === 'vn' ? 'Quay lại danh sách' : 'Back to listings'}
          </Link>
          <h1 className="text-2xl font-bold">
            {language === 'vn' ? 'Đăng tin rao vặt' : 'Post a Listing'}
          </h1>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, idx) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep > step.id
                      ? 'bg-green-600 border-green-600 text-white'
                      : currentStep === step.id
                      ? 'bg-red-600 border-red-600 text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                {idx < STEPS.length - 1 && (
                  <div
                    className={`hidden sm:block w-12 h-1 mx-2 ${
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
            {/* Step 1: Category Selection */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <CardHeader className="p-0 pb-4">
                  <CardTitle>{language === 'vn' ? 'Chọn danh mục' : 'Select Category'}</CardTitle>
                </CardHeader>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {mainCategories.map(cat => {
                    const subcats = getSubcategories(cat.id);
                    const isSelected = categoryIdNum === cat.id ||
                      subcats.some(s => s.id === categoryIdNum);

                    return (
                      <div key={cat.id}>
                        <button
                          type="button"
                          onClick={() => {
                            if (subcats.length === 0) {
                              updateField('categoryId', String(cat.id));
                            }
                          }}
                          className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                            isSelected
                              ? 'border-red-600 bg-red-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <span className="text-2xl mb-2 block">{cat.icon || '📦'}</span>
                          <span className="font-medium">
                            {language === 'vn' ? cat.nameVn : cat.nameEn || cat.nameVn}
                          </span>
                        </button>

                        {/* Subcategories */}
                        {isSelected && subcats.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {subcats.map(sub => (
                              <button
                                key={sub.id}
                                type="button"
                                onClick={() => updateField('categoryId', String(sub.id))}
                                className={`w-full p-2 rounded text-sm text-left ${
                                  categoryIdNum === sub.id
                                    ? 'bg-red-600 text-white'
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

            {/* Step 2: Listing Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <CardHeader className="p-0 pb-4">
                  <CardTitle>{language === 'vn' ? 'Thông tin tin đăng' : 'Listing Details'}</CardTitle>
                </CardHeader>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">
                      {language === 'vn' ? 'Tiêu đề (tiếng Việt)' : 'Title (Vietnamese)'} *
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={e => updateField('title', e.target.value)}
                      placeholder={language === 'vn' ? 'VD: Bán iPhone 15 Pro Max mới 100%' : 'E.g., Selling iPhone 15 Pro Max brand new'}
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
                        ? 'Mô tả chi tiết về sản phẩm/dịch vụ của bạn...'
                        : 'Describe your product/service in detail...'}
                      rows={5}
                      maxLength={5000}
                    />
                    <p className="text-xs text-gray-500 mt-1">{formData.description.length}/5000</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">{language === 'vn' ? 'Giá (USD)' : 'Price (USD)'}</Label>
                      <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={e => updateField('price', e.target.value)}
                        placeholder="0"
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div>
                      <Label>{language === 'vn' ? 'Loại giá' : 'Price Type'}</Label>
                      <Select
                        value={formData.priceType}
                        onValueChange={v => updateField('priceType', v as PriceType)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FIXED">{language === 'vn' ? 'Giá cố định' : 'Fixed price'}</SelectItem>
                          <SelectItem value="NEGOTIABLE">{language === 'vn' ? 'Thương lượng' : 'Negotiable'}</SelectItem>
                          <SelectItem value="FREE">{language === 'vn' ? 'Miễn phí' : 'Free'}</SelectItem>
                          <SelectItem value="HOURLY">{language === 'vn' ? 'Theo giờ' : 'Per hour'}</SelectItem>
                          <SelectItem value="MONTHLY">{language === 'vn' ? 'Theo tháng' : 'Per month'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Location */}
            {currentStep === 3 && (
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
                      {language === 'vn' ? 'Địa chỉ cụ thể (tùy chọn)' : 'Specific address (optional)'}
                    </Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={e => updateField('location', e.target.value)}
                      placeholder={language === 'vn' ? 'VD: Gần Ala Moana Center' : 'E.g., Near Ala Moana Center'}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Contact Info */}
            {currentStep === 4 && (
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

            {/* Step 5: Images */}
            {currentStep === 5 && (
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
                      <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-red-600 hover:bg-red-50 transition-colors">
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
                      ? 'Hình đầu tiên sẽ là hình chính. Kéo thả để sắp xếp lại.'
                      : 'First image will be the main image. Drag to reorder.'}
                  </p>
                </div>
              </div>
            )}

            {/* Step 6: Preview */}
            {currentStep === 6 && (
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
                      <span className="text-sm text-gray-500">{language === 'vn' ? 'Danh mục:' : 'Category:'}</span>
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
                      <span className="text-sm text-gray-500">{language === 'vn' ? 'Giá:' : 'Price:'}</span>
                      <p className="font-bold text-xl text-red-600">
                        {formData.priceType === 'FREE'
                          ? (language === 'vn' ? 'Miễn phí' : 'Free')
                          : formData.priceType === 'NEGOTIABLE'
                          ? (language === 'vn' ? 'Thương lượng' : 'Negotiable')
                          : formData.price
                          ? `$${formData.price}${formData.priceType === 'HOURLY' ? '/hr' : formData.priceType === 'MONTHLY' ? '/mo' : ''}`
                          : (language === 'vn' ? 'Liên hệ' : 'Contact')}
                      </p>
                    </div>

                    {formData.description && (
                      <div>
                        <span className="text-sm text-gray-500">{language === 'vn' ? 'Mô tả:' : 'Description:'}</span>
                        <p className="whitespace-pre-wrap">{formData.description}</p>
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
            <Button onClick={nextStep} className="bg-red-600 hover:bg-red-700">
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
