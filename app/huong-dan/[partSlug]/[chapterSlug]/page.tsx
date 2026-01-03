import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import { Clock, ChevronLeft, ChevronRight, BookOpen, CheckCircle, AlertTriangle, Users, Store } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ReactMarkdown from 'react-markdown';

interface PageProps {
  params: Promise<{
    partSlug: string;
    chapterSlug: string;
  }>;
}

async function getChapter(partSlug: string, chapterSlug: string) {
  try {
    const part = await db.guidePart.findUnique({
      where: { slug: partSlug },
      select: { id: true, title: true, titleEn: true },
    });

    if (!part) return null;

    const chapter = await db.guideChapter.findUnique({
      where: {
        partId_slug: {
          partId: part.id,
          slug: chapterSlug,
        },
      },
      include: {
        part: {
          select: { slug: true, title: true, titleEn: true },
        },
      },
    });

    if (!chapter) return null;

    // Get adjacent chapters for navigation
    const allChapters = await db.guideChapter.findMany({
      where: { published: true },
      orderBy: { chapterNumber: 'asc' },
      select: {
        slug: true,
        chapterNumber: true,
        title: true,
        part: { select: { slug: true } },
      },
    });

    const currentIndex = allChapters.findIndex(c => c.chapterNumber === chapter.chapterNumber);
    const prevChapter = currentIndex > 0 ? allChapters[currentIndex - 1] : null;
    const nextChapter = currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1] : null;

    return { chapter, prevChapter, nextChapter };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { partSlug, chapterSlug } = await params;
  const data = await getChapter(partSlug, chapterSlug);

  if (!data) {
    return {
      title: 'Không tìm thấy | VietHawaii',
    };
  }

  const { chapter } = data;
  return {
    title: `${chapter.title} | Hướng Dẫn Định Cư`,
    description: chapter.excerpt,
    openGraph: {
      title: chapter.title,
      description: chapter.excerpt,
    },
  };
}

export default async function ChapterPage({ params }: PageProps) {
  const { partSlug, chapterSlug } = await params;
  const data = await getChapter(partSlug, chapterSlug);

  if (!data) {
    notFound();
  }

  const { chapter, prevChapter, nextChapter } = data;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Breadcrumb */}
        <div className="bg-gray-50 border-b">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <nav className="flex items-center gap-2 text-sm text-gray-600">
              <Link href="/huong-dan" className="hover:text-red-600">
                Hướng Dẫn
              </Link>
              <span>/</span>
              <span className="text-gray-400">{chapter.part.title}</span>
              <span>/</span>
              <span className="text-gray-900 font-medium">Chương {chapter.chapterNumber}</span>
            </nav>
          </div>
        </div>

        {/* Chapter Header */}
        <section className="bg-gradient-to-br from-red-600 to-red-700 text-white py-12">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-center gap-2 text-red-200 text-sm mb-2">
              <BookOpen className="w-4 h-4" />
              <span>{chapter.part.title}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Chương {chapter.chapterNumber}: {chapter.title}
            </h1>
            {chapter.titleEn && (
              <p className="text-red-200 text-lg">{chapter.titleEn}</p>
            )}
            <div className="flex items-center gap-4 mt-4 text-sm text-red-100">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {chapter.readTime} phút đọc
              </span>
              {chapter.hasCaseStudy && (
                <span className="flex items-center gap-1 bg-red-500/30 px-2 py-0.5 rounded">
                  <Users className="w-4 h-4" />
                  Câu chuyện thực
                </span>
              )}
              {chapter.hasChecklist && (
                <span className="flex items-center gap-1 bg-red-500/30 px-2 py-0.5 rounded">
                  <CheckCircle className="w-4 h-4" />
                  Checklist
                </span>
              )}
              {chapter.hasMistakes && (
                <span className="flex items-center gap-1 bg-red-500/30 px-2 py-0.5 rounded">
                  <AlertTriangle className="w-4 h-4" />
                  Lỗi cần tránh
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Chapter Content */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4">
            <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-red-600 prose-strong:text-gray-900">
              <ReactMarkdown>{chapter.content}</ReactMarkdown>
            </div>

            {/* Related Businesses */}
            {chapter.relatedBusinessCategories.length > 0 && (
              <div className="mt-12 p-6 bg-gray-50 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                  <Store className="w-5 h-5 text-red-600" />
                  Doanh Nghiệp Liên Quan
                </h3>
                <p className="text-gray-600 mb-4">
                  Tìm các doanh nghiệp trong danh mục: {chapter.relatedBusinessCategories.join(', ')}
                </p>
                <Link
                  href={`/businesses?category=${chapter.relatedBusinessCategories[0]}`}
                  className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
                >
                  Xem doanh nghiệp
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Chapter Navigation */}
        <section className="bg-gray-50 py-8 border-t">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-center justify-between">
              {prevChapter ? (
                <Link
                  href={`/huong-dan/${prevChapter.part.slug}/${prevChapter.slug}`}
                  className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <div className="text-right">
                    <div className="text-sm text-gray-400">Chương trước</div>
                    <div className="font-medium">{prevChapter.title}</div>
                  </div>
                </Link>
              ) : (
                <div />
              )}

              <Link
                href="/huong-dan"
                className="hidden md:flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                Mục Lục
              </Link>

              {nextChapter ? (
                <Link
                  href={`/huong-dan/${nextChapter.part.slug}/${nextChapter.slug}`}
                  className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
                >
                  <div>
                    <div className="text-sm text-gray-400">Chương tiếp</div>
                    <div className="font-medium">{nextChapter.title}</div>
                  </div>
                  <ChevronRight className="w-5 h-5" />
                </Link>
              ) : (
                <div />
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
