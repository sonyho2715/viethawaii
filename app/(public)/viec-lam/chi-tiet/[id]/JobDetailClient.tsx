'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import ListingCard, { type ListingWithRelations } from '@/components/public/ListingCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  ChevronLeft,
  MapPin,
  Clock,
  Eye,
  Phone,
  Mail,
  MessageCircle,
  Heart,
  User,
  Calendar,
  Building,
  DollarSign,
  Briefcase,
  CheckCircle,
  Edit,
  Copy,
  CheckCircle2,
  Star,
} from 'lucide-react';
import ReportButton from '@/components/public/ReportButton';
import ShareButtons from '@/components/public/ShareButtons';

export interface JobListing {
  id: number;
  userId: string;
  title: string;
  titleEn: string | null;
  description: string | null;
  price: number | null;
  priceType: string;
  location: string | null;
  jobType: string | null;
  salary: string | null;
  benefits: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  zaloNumber: string | null;
  hidePhone: boolean;
  preferredContact: string | null;
  status: string;
  isFeatured: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
  category: {
    id: number;
    slug: string;
    nameVn: string;
    nameEn: string | null;
  };
  neighborhood: {
    id: number;
    name: string;
    slug: string;
  } | null;
  images: {
    id: number;
    imageUrl: string;
    thumbnailUrl: string | null;
  }[];
  user: {
    id: string;
    name: string | null;
    image: string | null;
    createdAt: string;
    _count: {
      listings: number;
    };
  };
}

interface JobDetailClientProps {
  listing: JobListing;
  relatedJobs: ListingWithRelations[];
  isOwner?: boolean;
}

const JOB_TYPES: Record<string, { vn: string; en: string }> = {
  'full-time': { vn: 'Toàn thời gian', en: 'Full-time' },
  'part-time': { vn: 'Bán thời gian', en: 'Part-time' },
  'contract': { vn: 'Hợp đồng', en: 'Contract' },
  'temporary': { vn: 'Tạm thời', en: 'Temporary' },
};

export default function JobDetailClient({
  listing: initialListing,
  relatedJobs,
  isOwner = false,
}: JobDetailClientProps) {
  const { t, language } = useLanguage();
  const [listing, setListing] = useState(initialListing);
  const [showPhone, setShowPhone] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleMarkAsSold = async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      const newStatus = listing.status === 'SOLD' ? 'ACTIVE' : 'SOLD';
      const response = await fetch(`/api/listings/${listing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        setListing((prev) => ({ ...prev, status: newStatus }));
      }
    } catch {
      // Handle error
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDuplicate = async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/listings/${listing.id}/duplicate`, {
        method: 'POST',
      });
      const data = await response.json();
      if (response.ok && data.data) {
        window.location.href = `/tai-khoan/tin-dang/${data.data.id}/sua`;
      }
    } catch {
      // Handle error
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat(language === 'vn' ? 'vi-VN' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(dateStr));
  };

  const formatSalary = () => {
    if (listing.salary) return listing.salary;
    if (listing.price) {
      const priceStr = `$${listing.price.toLocaleString()}`;
      if (listing.priceType === 'HOURLY') return `${priceStr}/hr`;
      if (listing.priceType === 'MONTHLY') return `${priceStr}/mo`;
      return priceStr;
    }
    return language === 'vn' ? 'Thương lượng' : 'Negotiable';
  };

  const getJobTypeLabel = () => {
    if (!listing.jobType) return null;
    return JOB_TYPES[listing.jobType]
      ? (language === 'vn' ? JOB_TYPES[listing.jobType].vn : JOB_TYPES[listing.jobType].en)
      : listing.jobType;
  };

  const primaryImage = listing.images[0];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-2 text-blue-200 text-sm mb-4">
            <Link href="/" className="hover:text-white">{t.home}</Link>
            <span>/</span>
            <Link href="/viec-lam" className="hover:text-white">
              {language === 'vn' ? 'Việc làm' : 'Jobs'}
            </Link>
            <span>/</span>
            <span className="text-white truncate">{listing.title}</span>
          </div>

          <div className="flex items-start gap-6">
            {/* Company Logo */}
            <div className="hidden md:block flex-shrink-0 w-24 h-24 bg-white rounded-lg overflow-hidden">
              {primaryImage ? (
                <Image
                  src={primaryImage.thumbnailUrl || primaryImage.imageUrl}
                  alt={listing.title}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <Building className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  {listing.isFeatured && (
                    <Badge className="bg-amber-400 text-amber-900 mb-2">
                      {language === 'vn' ? 'Nổi bật' : 'Featured'}
                    </Badge>
                  )}
                  <h1 className="text-2xl md:text-3xl font-bold">{listing.title}</h1>
                  <p className="text-blue-200 mt-1">
                    {language === 'vn' ? listing.category.nameVn : listing.category.nameEn || listing.category.nameVn}
                  </p>
                </div>
              </div>

              {/* Key Info */}
              <div className="flex flex-wrap items-center gap-4 mt-4 text-blue-100">
                {listing.neighborhood && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {listing.neighborhood.name}
                  </span>
                )}
                {getJobTypeLabel() && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {getJobTypeLabel()}
                  </span>
                )}
                <span className="flex items-center gap-1 text-white font-semibold">
                  <DollarSign className="h-4 w-4" />
                  {formatSalary()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Banner for non-active */}
      {isOwner && listing.status !== 'ACTIVE' && (
        <div className={`border-b ${listing.status === 'SOLD' ? 'bg-blue-50 border-blue-200' : 'bg-yellow-50 border-yellow-200'}`}>
          <div className={`container mx-auto px-4 py-3 text-sm font-medium ${listing.status === 'SOLD' ? 'text-blue-800' : 'text-yellow-800'}`}>
            {listing.status === 'SOLD'
              ? (language === 'vn' ? 'Vị trí này đã được tuyển.' : 'This position has been filled.')
              : (language === 'vn' ? 'Tin đăng đang chờ duyệt.' : 'This job is pending approval.')}
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Details Card */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">
                  {language === 'vn' ? 'Mô tả công việc' : 'Job Description'}
                </h2>
                <div className="prose prose-gray max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700">
                    {listing.description || (language === 'vn' ? 'Không có mô tả' : 'No description provided')}
                  </div>
                </div>

                {/* Benefits */}
                {listing.benefits && (
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      {language === 'vn' ? 'Quyền lợi' : 'Benefits'}
                    </h3>
                    <div className="whitespace-pre-wrap text-gray-700">
                      {listing.benefits}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Job Overview */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">
                  {language === 'vn' ? 'Thông tin công việc' : 'Job Overview'}
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Briefcase className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">
                        {language === 'vn' ? 'Loại công việc' : 'Job Type'}
                      </p>
                      <p className="font-medium">{getJobTypeLabel() || (language === 'vn' ? 'Liên hệ' : 'Contact')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-500">
                        {language === 'vn' ? 'Lương' : 'Salary'}
                      </p>
                      <p className="font-medium">{formatSalary()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="text-sm text-gray-500">
                        {language === 'vn' ? 'Địa điểm' : 'Location'}
                      </p>
                      <p className="font-medium">
                        {listing.location || listing.neighborhood?.name || 'Hawaii'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-500">
                        {language === 'vn' ? 'Ngày đăng' : 'Posted'}
                      </p>
                      <p className="font-medium">{formatDate(listing.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3">
              {isOwner ? (
                <>
                  {(listing.status === 'ACTIVE' || listing.status === 'SOLD') && (
                    <Button
                      variant={listing.status === 'SOLD' ? 'outline' : 'default'}
                      onClick={handleMarkAsSold}
                      disabled={isUpdating}
                      className={listing.status === 'SOLD' ? '' : 'bg-green-600 hover:bg-green-700'}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      {listing.status === 'SOLD'
                        ? (language === 'vn' ? 'Đăng lại' : 'Repost')
                        : (language === 'vn' ? 'Đã tuyển' : 'Mark Filled')}
                    </Button>
                  )}
                  <Button variant="outline" asChild>
                    <Link href={`/tai-khoan/tin-dang/${listing.id}/sua`}>
                      <Edit className="h-4 w-4 mr-2" />
                      {language === 'vn' ? 'Sửa tin' : 'Edit'}
                    </Link>
                  </Button>
                  <Button variant="outline" onClick={handleDuplicate} disabled={isUpdating}>
                    <Copy className="h-4 w-4 mr-2" />
                    {language === 'vn' ? 'Nhân bản' : 'Duplicate'}
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setIsSaved(!isSaved)}
                  className={isSaved ? 'text-red-600 border-red-600' : ''}
                >
                  <Heart className={`h-4 w-4 mr-2 ${isSaved ? 'fill-current' : ''}`} />
                  {isSaved ? (language === 'vn' ? 'Đã lưu' : 'Saved') : (language === 'vn' ? 'Lưu' : 'Save')}
                </Button>
              )}
              <ShareButtons title={listing.title} description={listing.description || undefined} />
              {!isOwner && (
                <ReportButton itemType="LISTING" itemId={listing.id} itemTitle={listing.title} />
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Card */}
            <Card className="border-2 border-blue-200">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">
                  {language === 'vn' ? 'Ứng tuyển ngay' : 'Apply Now'}
                </h3>

                {/* Poster Info */}
                <div className="flex items-center gap-3 mb-4 pb-4 border-b">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={listing.user.image || undefined} />
                    <AvatarFallback>
                      <User className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{listing.user.name || 'Nhà tuyển dụng'}</p>
                    <p className="text-sm text-gray-500">
                      {listing.user._count.listings} {language === 'vn' ? 'tin đăng' : 'listings'}
                    </p>
                  </div>
                </div>

                {/* Contact Methods */}
                <div className="space-y-3">
                  {listing.contactPhone && (
                    <Button
                      variant={listing.preferredContact === 'phone' ? 'default' : 'outline'}
                      className={`w-full ${listing.preferredContact === 'phone' ? 'bg-green-600 hover:bg-green-700' : ''}`}
                      onClick={() => setShowPhone(!showPhone)}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      {showPhone ? listing.contactPhone : (language === 'vn' ? 'Hiện số điện thoại' : 'Show phone')}
                      {listing.preferredContact === 'phone' && <Star className="h-3 w-3 ml-2 fill-current" />}
                    </Button>
                  )}

                  {listing.zaloNumber && (
                    <Button
                      variant={listing.preferredContact === 'zalo' ? 'default' : 'outline'}
                      className={`w-full ${listing.preferredContact === 'zalo' ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                      asChild
                    >
                      <a href={`https://zalo.me/${listing.zaloNumber}`} target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Zalo: {listing.zaloNumber}
                      </a>
                    </Button>
                  )}

                  {listing.contactEmail && (
                    <Button
                      variant={listing.preferredContact === 'email' ? 'default' : 'outline'}
                      className={`w-full ${listing.preferredContact === 'email' ? 'bg-teal-600 hover:bg-teal-700' : ''}`}
                      asChild
                    >
                      <a href={`mailto:${listing.contactEmail}?subject=${encodeURIComponent(`Ứng tuyển: ${listing.title}`)}`}>
                        <Mail className="h-4 w-4 mr-2" />
                        {language === 'vn' ? 'Gửi email ứng tuyển' : 'Send application email'}
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {language === 'vn' ? 'Lượt xem' : 'Views'}
                  </span>
                  <span className="font-medium">{listing.views}</span>
                </div>
              </CardContent>
            </Card>

            {/* Back to Jobs */}
            <Button variant="outline" className="w-full" asChild>
              <Link href="/viec-lam">
                <ChevronLeft className="h-4 w-4 mr-2" />
                {language === 'vn' ? 'Xem tất cả việc làm' : 'View all jobs'}
              </Link>
            </Button>
          </div>
        </div>

        {/* Related Jobs */}
        {relatedJobs.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-6">
              {language === 'vn' ? 'Việc làm tương tự' : 'Similar Jobs'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedJobs.map((job) => (
                <ListingCard key={job.id} listing={job} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
