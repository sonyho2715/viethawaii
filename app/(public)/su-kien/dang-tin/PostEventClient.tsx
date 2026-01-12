'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Calendar,
  MapPin,
  Clock,
  ArrowLeft,
  ArrowRight,
  Upload,
  X,
  Check,
  Phone,
  Mail,
  Globe,
  Ticket,
  DollarSign,
  Loader2,
  PartyPopper,
  Users,
  Church,
  Palette,
  Briefcase,
  CalendarDays,
  ImageIcon,
  FileText,
  Info,
} from 'lucide-react';
import { toast } from 'sonner';

export interface Neighborhood {
  id: number;
  name: string;
  slug: string;
}

interface PostEventClientProps {
  neighborhoods: Neighborhood[];
  userId: string;
}

interface EventFormData {
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  eventType: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  isAllDay: boolean;
  location: string;
  address: string;
  neighborhoodId: string;
  contactPhone: string;
  contactEmail: string;
  website: string;
  ticketUrl: string;
  price: string;
  isFree: boolean;
  imageUrl: string;
}

const EVENT_TYPES = [
  { value: 'FESTIVAL', labelVn: 'Lễ hội', labelEn: 'Festival', icon: PartyPopper },
  { value: 'COMMUNITY', labelVn: 'Cộng đồng', labelEn: 'Community', icon: Users },
  { value: 'RELIGIOUS', labelVn: 'Tôn giáo', labelEn: 'Religious', icon: Church },
  { value: 'CULTURAL', labelVn: 'Văn hóa', labelEn: 'Cultural', icon: Palette },
  { value: 'BUSINESS', labelVn: 'Kinh doanh', labelEn: 'Business', icon: Briefcase },
  { value: 'OTHER', labelVn: 'Khác', labelEn: 'Other', icon: CalendarDays },
];

const STEPS = [
  { id: 1, labelVn: 'Loại sự kiện', labelEn: 'Event Type', icon: Calendar },
  { id: 2, labelVn: 'Thông tin', labelEn: 'Details', icon: FileText },
  { id: 3, labelVn: 'Thời gian', labelEn: 'Date & Time', icon: Clock },
  { id: 4, labelVn: 'Địa điểm', labelEn: 'Location', icon: MapPin },
  { id: 5, labelVn: 'Liên hệ', labelEn: 'Contact', icon: Phone },
  { id: 6, labelVn: 'Vé & Giá', labelEn: 'Tickets', icon: Ticket },
  { id: 7, labelVn: 'Hình ảnh', labelEn: 'Image', icon: ImageIcon },
  { id: 8, labelVn: 'Xác nhận', labelEn: 'Confirm', icon: Check },
];

export default function PostEventClient({
  neighborhoods,
  userId,
}: PostEventClientProps) {
  const router = useRouter();
  const { language } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    titleEn: '',
    description: '',
    descriptionEn: '',
    eventType: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    isAllDay: false,
    location: '',
    address: '',
    neighborhoodId: '',
    contactPhone: '',
    contactEmail: '',
    website: '',
    ticketUrl: '',
    price: '',
    isFree: true,
    imageUrl: '',
  });

  const updateFormData = (key: keyof EventFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(language === 'vn' ? 'File quá lớn (tối đa 5MB)' : 'File too large (max 5MB)');
      return;
    }

    setIsUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      updateFormData('imageUrl', data.url);
      toast.success(language === 'vn' ? 'Tải ảnh thành công!' : 'Image uploaded!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(language === 'vn' ? 'Không thể tải ảnh' : 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    updateFormData('imageUrl', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        if (!formData.eventType) {
          toast.error(language === 'vn' ? 'Vui lòng chọn loại sự kiện' : 'Please select event type');
          return false;
        }
        break;
      case 2:
        if (!formData.title.trim()) {
          toast.error(language === 'vn' ? 'Vui lòng nhập tên sự kiện' : 'Please enter event title');
          return false;
        }
        break;
      case 3:
        if (!formData.startDate) {
          toast.error(language === 'vn' ? 'Vui lòng chọn ngày bắt đầu' : 'Please select start date');
          return false;
        }
        if (!formData.isAllDay && !formData.startTime) {
          toast.error(language === 'vn' ? 'Vui lòng chọn giờ bắt đầu' : 'Please select start time');
          return false;
        }
        break;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Construct start and end datetime
      const startDateTime = formData.isAllDay
        ? new Date(`${formData.startDate}T00:00:00`)
        : new Date(`${formData.startDate}T${formData.startTime}`);

      let endDateTime = null;
      if (formData.endDate) {
        endDateTime = formData.isAllDay
          ? new Date(`${formData.endDate}T23:59:59`)
          : formData.endTime
            ? new Date(`${formData.endDate}T${formData.endTime}`)
            : null;
      }

      const eventData = {
        title: formData.title,
        titleEn: formData.titleEn || null,
        description: formData.description || null,
        descriptionEn: formData.descriptionEn || null,
        eventType: formData.eventType,
        startDate: startDateTime.toISOString(),
        endDate: endDateTime?.toISOString() || null,
        isAllDay: formData.isAllDay,
        location: formData.location || null,
        address: formData.address || null,
        neighborhoodId: formData.neighborhoodId ? parseInt(formData.neighborhoodId, 10) : null,
        contactPhone: formData.contactPhone || null,
        contactEmail: formData.contactEmail || null,
        website: formData.website || null,
        ticketUrl: formData.ticketUrl || null,
        price: formData.isFree ? null : formData.price || null,
        isFree: formData.isFree,
        imageUrl: formData.imageUrl || null,
        userId,
      };

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create event');
      }

      const result = await response.json();
      toast.success(language === 'vn' ? 'Đăng sự kiện thành công!' : 'Event posted successfully!');
      router.push(`/su-kien/${result.id}`);
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(language === 'vn' ? 'Không thể đăng sự kiện' : 'Failed to post event');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {language === 'vn' ? 'Chọn loại sự kiện' : 'Select Event Type'}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {EVENT_TYPES.map(type => {
                const IconComponent = type.icon;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => updateFormData('eventType', type.value)}
                    className={`p-4 rounded-lg border-2 text-center transition-all ${
                      formData.eventType === type.value
                        ? 'border-orange-600 bg-orange-50 text-orange-600'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <IconComponent className={`h-8 w-8 mx-auto mb-2 ${
                      formData.eventType === type.value ? 'text-orange-600' : 'text-gray-400'
                    }`} />
                    <span className="font-medium">
                      {language === 'vn' ? type.labelVn : type.labelEn}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {language === 'vn' ? 'Thông tin sự kiện' : 'Event Details'}
            </h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="title">
                  {language === 'vn' ? 'Tên sự kiện (Tiếng Việt) *' : 'Event Title (Vietnamese) *'}
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={e => updateFormData('title', e.target.value)}
                  placeholder={language === 'vn' ? 'VD: Tết Nguyên Đán 2026' : 'e.g., Lunar New Year 2026'}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="titleEn">
                  {language === 'vn' ? 'Tên sự kiện (Tiếng Anh)' : 'Event Title (English)'}
                </Label>
                <Input
                  id="titleEn"
                  value={formData.titleEn}
                  onChange={e => updateFormData('titleEn', e.target.value)}
                  placeholder={language === 'vn' ? 'Tùy chọn' : 'Optional'}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description">
                  {language === 'vn' ? 'Mô tả (Tiếng Việt)' : 'Description (Vietnamese)'}
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={e => updateFormData('description', e.target.value)}
                  placeholder={language === 'vn' ? 'Mô tả chi tiết về sự kiện...' : 'Describe the event in detail...'}
                  rows={4}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="descriptionEn">
                  {language === 'vn' ? 'Mô tả (Tiếng Anh)' : 'Description (English)'}
                </Label>
                <Textarea
                  id="descriptionEn"
                  value={formData.descriptionEn}
                  onChange={e => updateFormData('descriptionEn', e.target.value)}
                  placeholder={language === 'vn' ? 'Tùy chọn' : 'Optional'}
                  rows={4}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {language === 'vn' ? 'Thời gian sự kiện' : 'Event Date & Time'}
            </h2>

            <div className="flex items-center gap-2 mb-4">
              <Checkbox
                id="isAllDay"
                checked={formData.isAllDay}
                onCheckedChange={(checked) => updateFormData('isAllDay', checked as boolean)}
              />
              <Label htmlFor="isAllDay" className="text-sm cursor-pointer">
                {language === 'vn' ? 'Sự kiện cả ngày' : 'All-day event'}
              </Label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">
                  {language === 'vn' ? 'Ngày bắt đầu *' : 'Start Date *'}
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={e => updateFormData('startDate', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="mt-1"
                />
              </div>

              {!formData.isAllDay && (
                <div>
                  <Label htmlFor="startTime">
                    {language === 'vn' ? 'Giờ bắt đầu *' : 'Start Time *'}
                  </Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={e => updateFormData('startTime', e.target.value)}
                    className="mt-1"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="endDate">
                  {language === 'vn' ? 'Ngày kết thúc' : 'End Date'}
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={e => updateFormData('endDate', e.target.value)}
                  min={formData.startDate || new Date().toISOString().split('T')[0]}
                  className="mt-1"
                />
              </div>

              {!formData.isAllDay && (
                <div>
                  <Label htmlFor="endTime">
                    {language === 'vn' ? 'Giờ kết thúc' : 'End Time'}
                  </Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={e => updateFormData('endTime', e.target.value)}
                    className="mt-1"
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {language === 'vn' ? 'Địa điểm' : 'Location'}
            </h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="location">
                  {language === 'vn' ? 'Tên địa điểm' : 'Venue Name'}
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={e => updateFormData('location', e.target.value)}
                  placeholder={language === 'vn' ? 'VD: Hawaii Convention Center' : 'e.g., Hawaii Convention Center'}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="address">
                  {language === 'vn' ? 'Địa chỉ' : 'Address'}
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={e => updateFormData('address', e.target.value)}
                  placeholder={language === 'vn' ? 'VD: 1801 Kalakaua Ave, Honolulu, HI' : 'e.g., 1801 Kalakaua Ave, Honolulu, HI'}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="neighborhoodId">
                  {language === 'vn' ? 'Khu vực' : 'Neighborhood'}
                </Label>
                <Select
                  value={formData.neighborhoodId}
                  onValueChange={v => updateFormData('neighborhoodId', v)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder={language === 'vn' ? 'Chọn khu vực' : 'Select area'} />
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
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {language === 'vn' ? 'Thông tin liên hệ' : 'Contact Information'}
            </h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="contactPhone">
                  {language === 'vn' ? 'Số điện thoại' : 'Phone Number'}
                </Label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="contactPhone"
                    value={formData.contactPhone}
                    onChange={e => updateFormData('contactPhone', e.target.value)}
                    placeholder="(808) 555-1234"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="contactEmail">
                  Email
                </Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={e => updateFormData('contactEmail', e.target.value)}
                    placeholder="info@example.com"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="website">
                  Website
                </Label>
                <div className="relative mt-1">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={e => updateFormData('website', e.target.value)}
                    placeholder="https://example.com"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {language === 'vn' ? 'Vé & Giá' : 'Tickets & Pricing'}
            </h2>

            <div className="flex items-center gap-2 mb-4">
              <Checkbox
                id="isFree"
                checked={formData.isFree}
                onCheckedChange={(checked) => updateFormData('isFree', checked as boolean)}
              />
              <Label htmlFor="isFree" className="text-sm cursor-pointer">
                {language === 'vn' ? 'Sự kiện miễn phí' : 'Free event'}
              </Label>
            </div>

            {!formData.isFree && (
              <div>
                <Label htmlFor="price">
                  {language === 'vn' ? 'Giá vé' : 'Ticket Price'}
                </Label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="price"
                    value={formData.price}
                    onChange={e => updateFormData('price', e.target.value)}
                    placeholder="25.00"
                    className="pl-10"
                  />
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="ticketUrl">
                {language === 'vn' ? 'Link mua vé' : 'Ticket URL'}
              </Label>
              <div className="relative mt-1">
                <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="ticketUrl"
                  type="url"
                  value={formData.ticketUrl}
                  onChange={e => updateFormData('ticketUrl', e.target.value)}
                  placeholder="https://tickets.example.com"
                  className="pl-10"
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {language === 'vn' ? 'Để trống nếu không cần mua vé online' : 'Leave empty if no online tickets'}
              </p>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {language === 'vn' ? 'Hình ảnh sự kiện' : 'Event Image'}
            </h2>

            <div className="space-y-4">
              {formData.imageUrl ? (
                <div className="relative aspect-[16/9] rounded-lg overflow-hidden border">
                  <Image
                    src={formData.imageUrl}
                    alt="Event image"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-[16/9] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-colors"
                >
                  {isUploading ? (
                    <Loader2 className="h-10 w-10 text-orange-600 animate-spin" />
                  ) : (
                    <>
                      <Upload className="h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-gray-600 font-medium">
                        {language === 'vn' ? 'Nhấn để tải ảnh' : 'Click to upload'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {language === 'vn' ? 'PNG, JPG tối đa 5MB' : 'PNG, JPG up to 5MB'}
                      </p>
                    </>
                  )}
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-700">
                  {language === 'vn'
                    ? 'Hình ảnh đẹp sẽ giúp sự kiện của bạn thu hút hơn'
                    : 'A good image will help your event stand out'}
                </p>
              </div>
            </div>
          </div>
        );

      case 8:
        const selectedType = EVENT_TYPES.find(t => t.value === formData.eventType);
        const TypeIcon = selectedType?.icon || CalendarDays;

        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {language === 'vn' ? 'Xác nhận thông tin' : 'Confirm Details'}
            </h2>

            <Card>
              <CardContent className="p-6 space-y-4">
                {/* Event Type */}
                <div className="flex items-center gap-3 pb-4 border-b">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <TypeIcon className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      {language === 'vn' ? 'Loại sự kiện' : 'Event Type'}
                    </p>
                    <p className="font-medium">
                      {language === 'vn' ? selectedType?.labelVn : selectedType?.labelEn}
                    </p>
                  </div>
                </div>

                {/* Title */}
                <div className="pb-4 border-b">
                  <p className="text-sm text-gray-500 mb-1">
                    {language === 'vn' ? 'Tên sự kiện' : 'Event Title'}
                  </p>
                  <p className="font-semibold text-lg">{formData.title}</p>
                  {formData.titleEn && (
                    <p className="text-gray-600">{formData.titleEn}</p>
                  )}
                </div>

                {/* Date & Time */}
                <div className="flex items-start gap-3 pb-4 border-b">
                  <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">
                      {language === 'vn' ? 'Thời gian' : 'Date & Time'}
                    </p>
                    <p className="font-medium">
                      {formData.startDate}
                      {!formData.isAllDay && formData.startTime && ` • ${formData.startTime}`}
                      {formData.endDate && ` → ${formData.endDate}`}
                      {!formData.isAllDay && formData.endTime && ` • ${formData.endTime}`}
                      {formData.isAllDay && ` (${language === 'vn' ? 'Cả ngày' : 'All day'})`}
                    </p>
                  </div>
                </div>

                {/* Location */}
                {(formData.location || formData.address) && (
                  <div className="flex items-start gap-3 pb-4 border-b">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">
                        {language === 'vn' ? 'Địa điểm' : 'Location'}
                      </p>
                      {formData.location && <p className="font-medium">{formData.location}</p>}
                      {formData.address && <p className="text-gray-600">{formData.address}</p>}
                    </div>
                  </div>
                )}

                {/* Price */}
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">
                      {language === 'vn' ? 'Giá vé' : 'Price'}
                    </p>
                    <p className="font-medium">
                      {formData.isFree
                        ? (language === 'vn' ? 'Miễn phí' : 'Free')
                        : formData.price ? `$${formData.price}` : (language === 'vn' ? 'Chưa xác định' : 'TBD')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg">
              <Info className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-700">
                {language === 'vn'
                  ? 'Sự kiện sẽ được xem xét trước khi hiển thị công khai'
                  : 'Events are reviewed before being published'}
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white">
        <div className="container mx-auto px-4 py-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-orange-100 hover:text-white mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            {language === 'vn' ? 'Quay lại' : 'Back'}
          </button>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="h-7 w-7" />
            {language === 'vn' ? 'Đăng sự kiện' : 'Post Event'}
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {STEPS.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      currentStep >= step.id
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <step.icon className="h-5 w-5" />
                    )}
                  </div>
                  {index < STEPS.length - 1 && (
                    <div
                      className={`hidden md:block w-12 h-1 mx-1 ${
                        currentStep > step.id ? 'bg-orange-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <p className="text-center mt-4 text-gray-600">
              {language === 'vn'
                ? `Bước ${currentStep}/${STEPS.length}: ${STEPS[currentStep - 1].labelVn}`
                : `Step ${currentStep}/${STEPS.length}: ${STEPS[currentStep - 1].labelEn}`}
            </p>
          </div>

          {/* Form Content */}
          <Card>
            <CardContent className="p-6">
              {renderStepContent()}

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {language === 'vn' ? 'Quay lại' : 'Back'}
                </Button>

                {currentStep < STEPS.length ? (
                  <Button onClick={nextStep} className="bg-orange-600 hover:bg-orange-700">
                    {language === 'vn' ? 'Tiếp tục' : 'Continue'}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {language === 'vn' ? 'Đang đăng...' : 'Posting...'}
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        {language === 'vn' ? 'Đăng sự kiện' : 'Post Event'}
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
