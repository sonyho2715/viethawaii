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
import { Checkbox } from '@/components/ui/checkbox';
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
  Briefcase,
  FileText,
  MapPin,
  Phone,
  Image as ImageIcon,
  Eye,
  DollarSign,
  Clock,
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

interface PostJobClientProps {
  categories: Category[];
  neighborhoods: Neighborhood[];
  userId: string;
}

const JOB_TYPES = [
  { value: 'full-time', labelVn: 'Toàn thời gian', labelEn: 'Full-time' },
  { value: 'part-time', labelVn: 'Bán thời gian', labelEn: 'Part-time' },
  { value: 'contract', labelVn: 'Hợp đồng', labelEn: 'Contract' },
  { value: 'temporary', labelVn: 'Tạm thời', labelEn: 'Temporary' },
];

const COMMON_BENEFITS = [
  { id: 'health', labelVn: 'Bảo hiểm sức khỏe', labelEn: 'Health Insurance' },
  { id: 'dental', labelVn: 'Bảo hiểm nha khoa', labelEn: 'Dental Insurance' },
  { id: 'vision', labelVn: 'Bảo hiểm mắt', labelEn: 'Vision Insurance' },
  { id: '401k', labelVn: '401(k)', labelEn: '401(k)' },
  { id: 'pto', labelVn: 'Nghỉ phép có lương', labelEn: 'Paid Time Off' },
  { id: 'flexible', labelVn: 'Giờ linh hoạt', labelEn: 'Flexible Hours' },
  { id: 'meals', labelVn: 'Bữa ăn miễn phí', labelEn: 'Free Meals' },
  { id: 'tips', labelVn: 'Tiền tip', labelEn: 'Tips' },
  { id: 'training', labelVn: 'Đào tạo', labelEn: 'Training Provided' },
];

interface FormData {
  categoryId: string;
  title: string;
  titleEn: string;
  description: string;
  jobType: string;
  salary: string;
  benefits: string[];
  otherBenefits: string;
  location: string;
  neighborhoodId: string;
  contactPhone: string;
  contactEmail: string;
  contactName: string;
  companyName: string;
  images: { url: string; file?: File }[];
}

const STEPS = [
  { id: 1, label: 'Danh mục', labelEn: 'Category', icon: Briefcase },
  { id: 2, label: 'Công việc', labelEn: 'Job Details', icon: FileText },
  { id: 3, label: 'Lương & Phúc lợi', labelEn: 'Salary & Benefits', icon: DollarSign },
  { id: 4, label: 'Địa điểm', labelEn: 'Location', icon: MapPin },
  { id: 5, label: 'Liên hệ', labelEn: 'Contact', icon: Phone },
  { id: 6, label: 'Hình ảnh', labelEn: 'Images', icon: ImageIcon },
  { id: 7, label: 'Xem lại', labelEn: 'Preview', icon: Eye },
];

export default function PostJobClient({
  categories,
  neighborhoods,
  userId,
}: PostJobClientProps) {
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
    jobType: '',
    salary: '',
    benefits: [],
    otherBenefits: '',
    location: '',
    neighborhoodId: '',
    contactPhone: '',
    contactEmail: '',
    contactName: '',
    companyName: '',
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

  const toggleBenefit = (benefitId: string) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.includes(benefitId)
        ? prev.benefits.filter(b => b !== benefitId)
        : [...prev.benefits, benefitId],
    }));
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
          setError(language === 'vn' ? 'Vui lòng nhập tiêu đề công việc' : 'Please enter a job title');
          return false;
        }
        if (formData.title.length < 10) {
          setError(language === 'vn' ? 'Tiêu đề phải có ít nhất 10 ký tự' : 'Title must be at least 10 characters');
          return false;
        }
        if (!formData.jobType) {
          setError(language === 'vn' ? 'Vui lòng chọn loại công việc' : 'Please select job type');
          return false;
        }
        break;
      case 5:
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

    const newImages = Array.from(files).slice(0, 5 - formData.images.length).map(file => ({
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

      // Combine benefits
      const selectedBenefits = formData.benefits.map(id => {
        const benefit = COMMON_BENEFITS.find(b => b.id === id);
        return benefit ? (language === 'vn' ? benefit.labelVn : benefit.labelEn) : id;
      });
      if (formData.otherBenefits.trim()) {
        selectedBenefits.push(formData.otherBenefits.trim());
      }

      // Create job listing
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryId: parseInt(formData.categoryId, 10),
          title: formData.title,
          titleEn: formData.titleEn || null,
          description: formData.description || null,
          listingType: 'JOB',
          jobType: formData.jobType,
          salary: formData.salary || null,
          benefits: selectedBenefits.join(', ') || null,
          location: formData.location || null,
          neighborhoodId: formData.neighborhoodId ? parseInt(formData.neighborhoodId, 10) : null,
          contactPhone: formData.contactPhone?.trim() || null,
          contactEmail: formData.contactEmail?.trim() || null,
          images: uploadedImageUrls,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create job listing');
      }

      const { data: listing } = await res.json();
      router.push(`/viec-lam/chi-tiet/${listing.id}?success=true`);
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
  const selectedJobType = JOB_TYPES.find(j => j.value === formData.jobType);

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/viec-lam" className="text-gray-500 hover:text-blue-600 text-sm mb-2 inline-flex items-center">
            <ChevronLeft className="h-4 w-4 mr-1" />
            {language === 'vn' ? 'Quay lại danh sách việc làm' : 'Back to jobs'}
          </Link>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-blue-600" />
            {language === 'vn' ? 'Đăng tin tuyển dụng' : 'Post a Job'}
          </h1>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between overflow-x-auto pb-2">
            {STEPS.map((step, idx) => (
              <div key={step.id} className="flex items-center flex-shrink-0">
                <div
                  className={`flex items-center justify-center w-9 h-9 rounded-full border-2 ${
                    currentStep > step.id
                      ? 'bg-green-600 border-green-600 text-white'
                      : currentStep === step.id
                      ? 'bg-blue-600 border-blue-600 text-white'
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
                    className={`hidden sm:block w-8 h-1 mx-1 ${
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
                  <CardTitle>{language === 'vn' ? 'Chọn ngành nghề' : 'Select Industry'}</CardTitle>
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
                          onClick={() => updateField('categoryId', String(cat.id))}
                          className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Briefcase className={`h-8 w-8 mb-2 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
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
                                    ? 'bg-blue-600 text-white'
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

            {/* Step 2: Job Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <CardHeader className="p-0 pb-4">
                  <CardTitle>{language === 'vn' ? 'Thông tin công việc' : 'Job Details'}</CardTitle>
                </CardHeader>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">
                      {language === 'vn' ? 'Tiêu đề công việc' : 'Job Title'} *
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={e => updateField('title', e.target.value)}
                      placeholder={language === 'vn' ? 'VD: Tuyển nhân viên phục vụ nhà hàng' : 'E.g., Hiring Restaurant Server'}
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
                    <Label>{language === 'vn' ? 'Loại công việc' : 'Job Type'} *</Label>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      {JOB_TYPES.map(type => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => updateField('jobType', type.value)}
                          className={`p-3 rounded-lg border-2 text-left flex items-center gap-2 ${
                            formData.jobType === type.value
                              ? 'border-blue-600 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Clock className="h-4 w-4" />
                          <span className="font-medium">
                            {language === 'vn' ? type.labelVn : type.labelEn}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="companyName">
                      {language === 'vn' ? 'Tên công ty/doanh nghiệp (tùy chọn)' : 'Company Name (optional)'}
                    </Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="companyName"
                        value={formData.companyName}
                        onChange={e => updateField('companyName', e.target.value)}
                        placeholder={language === 'vn' ? 'Tên doanh nghiệp' : 'Business name'}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">
                      {language === 'vn' ? 'Mô tả công việc' : 'Job Description'}
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={e => updateField('description', e.target.value)}
                      placeholder={language === 'vn'
                        ? 'Mô tả chi tiết công việc, yêu cầu kinh nghiệm, trách nhiệm...'
                        : 'Describe the job responsibilities, requirements, experience needed...'}
                      rows={6}
                      maxLength={5000}
                    />
                    <p className="text-xs text-gray-500 mt-1">{formData.description.length}/5000</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Salary & Benefits */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <CardHeader className="p-0 pb-4">
                  <CardTitle>{language === 'vn' ? 'Lương & Phúc lợi' : 'Salary & Benefits'}</CardTitle>
                </CardHeader>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="salary">{language === 'vn' ? 'Mức lương' : 'Salary/Wage'}</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="salary"
                        value={formData.salary}
                        onChange={e => updateField('salary', e.target.value)}
                        placeholder={language === 'vn' ? 'VD: $18-22/giờ, $3000-4000/tháng' : 'E.g., $18-22/hr, $3000-4000/mo'}
                        className="pl-10"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {language === 'vn' ? 'Để trống nếu muốn thương lượng' : 'Leave blank for negotiable'}
                    </p>
                  </div>

                  <div>
                    <Label className="mb-3 block">{language === 'vn' ? 'Phúc lợi' : 'Benefits'}</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {COMMON_BENEFITS.map(benefit => (
                        <label
                          key={benefit.id}
                          className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                            formData.benefits.includes(benefit.id)
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Checkbox
                            checked={formData.benefits.includes(benefit.id)}
                            onCheckedChange={() => toggleBenefit(benefit.id)}
                          />
                          <span className="text-sm">
                            {language === 'vn' ? benefit.labelVn : benefit.labelEn}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="otherBenefits">
                      {language === 'vn' ? 'Phúc lợi khác (tùy chọn)' : 'Other Benefits (optional)'}
                    </Label>
                    <Input
                      id="otherBenefits"
                      value={formData.otherBenefits}
                      onChange={e => updateField('otherBenefits', e.target.value)}
                      placeholder={language === 'vn' ? 'VD: Thưởng cuối năm, parking miễn phí' : 'E.g., Year-end bonus, free parking'}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Location */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <CardHeader className="p-0 pb-4">
                  <CardTitle>{language === 'vn' ? 'Địa điểm làm việc' : 'Work Location'}</CardTitle>
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
                      placeholder={language === 'vn' ? 'VD: Khu vực Ala Moana' : 'E.g., Ala Moana area'}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Contact Info */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <CardHeader className="p-0 pb-4">
                  <CardTitle>{language === 'vn' ? 'Thông tin liên hệ' : 'Contact Information'}</CardTitle>
                </CardHeader>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="contactName">{language === 'vn' ? 'Người liên hệ' : 'Contact Person'}</Label>
                    <Input
                      id="contactName"
                      value={formData.contactName}
                      onChange={e => updateField('contactName', e.target.value)}
                      placeholder={language === 'vn' ? 'Tên của bạn hoặc HR' : 'Your name or HR contact'}
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
                      placeholder="hr@company.com"
                    />
                  </div>

                  <p className="text-sm text-gray-500">
                    {language === 'vn'
                      ? '* Vui lòng cung cấp ít nhất số điện thoại hoặc email để ứng viên liên hệ'
                      : '* Please provide at least a phone number or email for applicants to contact'}
                  </p>
                </div>
              </div>
            )}

            {/* Step 6: Images */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <CardHeader className="p-0 pb-4">
                  <CardTitle>{language === 'vn' ? 'Hình ảnh (tùy chọn)' : 'Images (optional)'}</CardTitle>
                </CardHeader>

                <div>
                  <Label>
                    {language === 'vn'
                      ? `Tải lên hình ảnh nơi làm việc (${formData.images.length}/5)`
                      : `Upload workplace images (${formData.images.length}/5)`}
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
                      </div>
                    ))}

                    {formData.images.length < 5 && (
                      <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-blue-600 hover:bg-blue-50 transition-colors">
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
                      ? 'Hình ảnh nơi làm việc giúp thu hút ứng viên'
                      : 'Workplace images help attract applicants'}
                  </p>
                </div>
              </div>
            )}

            {/* Step 7: Preview */}
            {currentStep === 7 && (
              <div className="space-y-6">
                <CardHeader className="p-0 pb-4">
                  <CardTitle>{language === 'vn' ? 'Xem lại tin tuyển dụng' : 'Review Your Job Posting'}</CardTitle>
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
                      <span className="text-sm text-gray-500">{language === 'vn' ? 'Ngành nghề:' : 'Industry:'}</span>
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

                    <div className="flex gap-4">
                      <div>
                        <span className="text-sm text-gray-500">{language === 'vn' ? 'Loại:' : 'Type:'}</span>
                        <p className="font-medium">
                          {selectedJobType && (language === 'vn' ? selectedJobType.labelVn : selectedJobType.labelEn)}
                        </p>
                      </div>
                      {formData.salary && (
                        <div>
                          <span className="text-sm text-gray-500">{language === 'vn' ? 'Lương:' : 'Salary:'}</span>
                          <p className="font-bold text-blue-600">{formData.salary}</p>
                        </div>
                      )}
                    </div>

                    {formData.benefits.length > 0 && (
                      <div>
                        <span className="text-sm text-gray-500">{language === 'vn' ? 'Phúc lợi:' : 'Benefits:'}</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {formData.benefits.map(id => {
                            const benefit = COMMON_BENEFITS.find(b => b.id === id);
                            return benefit ? (
                              <span key={id} className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm">
                                {language === 'vn' ? benefit.labelVn : benefit.labelEn}
                              </span>
                            ) : null;
                          })}
                          {formData.otherBenefits && (
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm">
                              {formData.otherBenefits}
                            </span>
                          )}
                        </div>
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
            <Button onClick={nextStep} className="bg-blue-600 hover:bg-blue-700">
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
                  {language === 'vn' ? 'Đăng tin' : 'Post Job'}
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
