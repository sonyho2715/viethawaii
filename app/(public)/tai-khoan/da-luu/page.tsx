import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { Heart, Search, MapPin, Clock, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { RemoveSavedButton } from './RemoveSavedButton';

export default async function SavedItemsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/dang-nhap?callbackUrl=/tai-khoan/da-luu');
  }

  // Fetch saved listings
  const savedListings = await db.savedItem.findMany({
    where: {
      userId: session.user.id,
      itemType: 'LISTING',
    },
    orderBy: { savedAt: 'desc' },
  });

  // Fetch the actual listings
  const listingIds = savedListings.map((s) => s.itemId);
  const listings = listingIds.length > 0
    ? await db.listing.findMany({
        where: {
          id: { in: listingIds },
          status: 'ACTIVE',
        },
        include: {
          images: {
            where: { isPrimary: true },
            take: 1,
          },
          category: true,
        },
      })
    : [];

  // Fetch saved articles
  const savedArticles = await db.savedItem.findMany({
    where: {
      userId: session.user.id,
      itemType: 'ARTICLE',
    },
    orderBy: { savedAt: 'desc' },
  });

  // Fetch the actual articles
  const articleIds = savedArticles.map((s) => s.itemId);
  const articles = articleIds.length > 0
    ? await db.article.findMany({
        where: {
          id: { in: articleIds },
          status: 'PUBLISHED',
        },
        include: {
          category: true,
        },
      })
    : [];

  const hasItems = listings.length > 0 || articles.length > 0;

  // Helper to get listing URL based on type
  const getListingUrl = (listing: typeof listings[0]) => {
    const prefix = listing.listingType === 'JOB' ? 'viec-lam'
      : listing.listingType === 'HOUSING' ? 'nha-o'
      : listing.listingType === 'SERVICE' ? 'dich-vu'
      : 'rao-vat';
    return `/${prefix}/${listing.id}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tin đã lưu</h1>
        <p className="text-gray-600">
          {hasItems
            ? `${listings.length} tin đăng • ${articles.length} bài viết`
            : 'Saved Items'}
        </p>
      </div>

      {!hasItems ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Heart className="h-8 w-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Chưa có tin đã lưu
          </h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Lưu những tin đăng bạn quan tâm để xem lại sau. Nhấn vào biểu tượng trái tim
            trên mỗi tin để lưu.
          </p>
          <p className="text-gray-500 text-sm mb-6">
            Save listings you&apos;re interested in to view later. Click the heart icon on any listing to save it.
          </p>
          <Button asChild>
            <Link href="/rao-vat">
              <Search className="h-4 w-4 mr-2" />
              Tìm tin đăng
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Saved Listings */}
          {listings.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Tin đăng đã lưu ({listings.length})
              </h2>
              <div className="space-y-4">
                {listings.map((listing) => {
                  const savedItem = savedListings.find((s) => s.itemId === listing.id);
                  const imageUrl = listing.images[0]?.imageUrl;

                  return (
                    <div
                      key={listing.id}
                      className="bg-white rounded-xl border border-gray-200 p-4 flex gap-4 hover:shadow-md transition-shadow"
                    >
                      {/* Image */}
                      <Link href={getListingUrl(listing)} className="flex-shrink-0">
                        <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                          {imageUrl ? (
                            <Image
                              src={imageUrl}
                              alt={listing.title}
                              width={96}
                              height={96}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <FileText className="w-8 h-8" />
                            </div>
                          )}
                        </div>
                      </Link>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <Link href={getListingUrl(listing)}>
                          <h3 className="font-semibold text-gray-900 hover:text-orange-600 truncate">
                            {listing.title}
                          </h3>
                        </Link>

                        {listing.price && (
                          <p className="text-orange-600 font-bold mt-1">
                            ${Number(listing.price).toLocaleString()}
                          </p>
                        )}

                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          {listing.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {listing.location}
                            </span>
                          )}
                          {savedItem && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Đã lưu {formatDistanceToNow(savedItem.savedAt, { locale: vi, addSuffix: true })}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-gray-400 mt-1">
                          {listing.category.nameVn}
                        </p>
                      </div>

                      {/* Remove button */}
                      <RemoveSavedButton
                        itemType="LISTING"
                        itemId={listing.id}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Saved Articles */}
          {articles.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                Bài viết đã lưu ({articles.length})
              </h2>
              <div className="space-y-4">
                {articles.map((article) => {
                  const savedItem = savedArticles.find((s) => s.itemId === article.id);

                  return (
                    <div
                      key={article.id}
                      className="bg-white rounded-xl border border-gray-200 p-4 flex gap-4 hover:shadow-md transition-shadow"
                    >
                      {/* Image */}
                      <Link href={`/tin-tuc/${article.slug}`} className="flex-shrink-0">
                        <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                          {article.featuredImage ? (
                            <Image
                              src={article.featuredImage}
                              alt={article.titleVn}
                              width={96}
                              height={96}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <FileText className="w-8 h-8" />
                            </div>
                          )}
                        </div>
                      </Link>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <Link href={`/tin-tuc/${article.slug}`}>
                          <h3 className="font-semibold text-gray-900 hover:text-blue-600 truncate">
                            {article.titleVn}
                          </h3>
                        </Link>

                        {article.excerptVn && (
                          <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                            {article.excerptVn}
                          </p>
                        )}

                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                            {article.category.nameVn}
                          </span>
                          {savedItem && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Đã lưu {formatDistanceToNow(savedItem.savedAt, { locale: vi, addSuffix: true })}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Remove button */}
                      <RemoveSavedButton
                        itemType="ARTICLE"
                        itemId={article.id}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Info Box */}
      <div className="bg-teal-50 rounded-xl border border-teal-100 p-4">
        <h3 className="font-semibold text-teal-800 mb-2">Mẹo sử dụng</h3>
        <ul className="text-sm text-teal-700 space-y-1">
          <li>• Lưu tin để so sánh nhiều lựa chọn</li>
          <li>• Tin đã lưu sẽ được giữ lại khi bạn đăng nhập lại</li>
          <li>• Bạn sẽ nhận thông báo nếu tin đã lưu có cập nhật</li>
        </ul>
      </div>
    </div>
  );
}
