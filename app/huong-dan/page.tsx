import { Metadata } from 'next';
import Link from 'next/link';
import { db } from '@/lib/db';
import { BookOpen, Clock, CheckCircle, AlertTriangle, Users } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Hướng Dẫn Định Cư Hawaii | Settlement Guide',
  description: 'Cẩm nang toàn diện cho người Việt định cư tại Hawaii. Comprehensive guide for Vietnamese settling in Hawaii.',
  openGraph: {
    title: 'Hướng Dẫn Định Cư Hawaii',
    description: 'Cẩm nang toàn diện cho người Việt định cư tại Hawaii',
  },
};

async function getGuideParts() {
  try {
    const parts = await db.guidePart.findMany({
      where: { published: true },
      include: {
        chapters: {
          where: { published: true },
          orderBy: { order: 'asc' },
          select: {
            id: true,
            slug: true,
            chapterNumber: true,
            title: true,
            titleEn: true,
            excerpt: true,
            excerptEn: true,
            readTime: true,
            hasCaseStudy: true,
            hasChecklist: true,
            hasMistakes: true,
          },
        },
      },
      orderBy: { order: 'asc' },
    });
    return parts;
  } catch {
    // Database not seeded yet, return empty
    return [];
  }
}

export default async function GuidePage() {
  const parts = await getGuideParts();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-red-600 via-red-700 to-yellow-500 text-white py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Hướng Dẫn Định Cư Hawaii
              </h1>
              <p className="text-xl text-red-100 mb-2">
                Hawaii Settlement Guide
              </p>
              <p className="text-lg text-red-100 max-w-2xl mx-auto">
                Cẩm nang toàn diện giúp bạn chuẩn bị và hòa nhập cuộc sống tại xứ sở Aloha
              </p>
              <div className="flex justify-center gap-6 mt-8 text-sm">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  <span>31 Chương</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>8 Phần</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>Miễn Phí</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            {parts.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                  Nội dung đang được cập nhật
                </h2>
                <p className="text-gray-500">
                  Hướng dẫn định cư sẽ sớm có mặt. Vui lòng quay lại sau!
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {parts.map((part) => (
                  <div key={part.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-4">
                      <div className="flex items-center gap-3">
                        {part.icon && <span className="text-2xl">{part.icon}</span>}
                        <div>
                          <h2 className="text-xl font-bold">
                            Phần {part.order}: {part.title}
                          </h2>
                          {part.titleEn && (
                            <p className="text-red-100 text-sm">{part.titleEn}</p>
                          )}
                        </div>
                      </div>
                      {part.description && (
                        <p className="mt-2 text-red-100">{part.description}</p>
                      )}
                    </div>

                    <div className="divide-y">
                      {part.chapters.map((chapter) => (
                        <Link
                          key={chapter.id}
                          href={`/huong-dan/${part.slug}/${chapter.slug}`}
                          className="block px-6 py-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-grow">
                              <div className="flex items-center gap-2">
                                <span className="text-red-600 font-semibold">
                                  Chương {chapter.chapterNumber}
                                </span>
                                <h3 className="font-medium text-gray-900">
                                  {chapter.title}
                                </h3>
                              </div>
                              {chapter.titleEn && (
                                <p className="text-sm text-gray-500">{chapter.titleEn}</p>
                              )}
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {chapter.excerpt}
                              </p>
                              <div className="flex items-center gap-4 mt-2">
                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {chapter.readTime} phút
                                </span>
                                {chapter.hasCaseStudy && (
                                  <span className="text-xs text-green-600 flex items-center gap-1">
                                    <Users className="w-3 h-3" />
                                    Câu chuyện thực
                                  </span>
                                )}
                                {chapter.hasChecklist && (
                                  <span className="text-xs text-blue-600 flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" />
                                    Checklist
                                  </span>
                                )}
                                {chapter.hasMistakes && (
                                  <span className="text-xs text-amber-600 flex items-center gap-1">
                                    <AlertTriangle className="w-3 h-3" />
                                    Lỗi cần tránh
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-gray-400">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
