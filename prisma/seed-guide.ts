import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Ebook location
const EBOOK_PATH = '/Users/sonyho/vietnam-hawaii-ebook';

// Define the 8 parts with metadata
const parts = [
  {
    order: 1,
    slug: 'chao-mung',
    title: 'Chào Mừng Đến Hawaii',
    titleEn: 'Welcome to Hawaii',
    description: 'Tổng quan về Hawaii, chi phí sinh hoạt, văn hóa Aloha, và cộng đồng người Việt',
    descriptionEn: 'Overview of Hawaii, cost of living, Aloha culture, and Vietnamese community',
    icon: '🌺',
    folder: 'phan-1-welcome',
  },
  {
    order: 2,
    slug: 'giao-duc',
    title: 'Giáo Dục & Đào Tạo',
    titleEn: 'Education & Training',
    description: 'Hệ thống trường công, tư, đại học, và việc dạy tiếng Việt cho thế hệ sau',
    descriptionEn: 'Public schools, private schools, universities, and Vietnamese language education',
    icon: '📚',
    folder: 'phan-2-education',
  },
  {
    order: 3,
    slug: 'suc-khoe',
    title: 'Sức Khỏe & Y Tế',
    titleEn: 'Health & Medical',
    description: 'Hệ thống y tế Hawaii, wellness, và chăm sóc sức khỏe tâm thần',
    descriptionEn: 'Hawaii healthcare system, wellness, and mental health care',
    icon: '🏥',
    folder: 'phan-3-healthcare',
  },
  {
    order: 4,
    slug: 'tai-chinh',
    title: 'Tài Chính Cá Nhân',
    titleEn: 'Personal Finance',
    description: 'Ngân hàng, thuế, bảo hiểm, và mua nhà tại Hawaii',
    descriptionEn: 'Banking, taxes, insurance, and home buying in Hawaii',
    icon: '💰',
    folder: 'phan-4-finances',
  },
  {
    order: 5,
    slug: 'kinh-doanh',
    title: 'Kinh Doanh & Việc Làm',
    titleEn: 'Business & Employment',
    description: 'Khởi nghiệp, tìm việc làm, và marketing tại Hawaii',
    descriptionEn: 'Starting a business, employment, and marketing in Hawaii',
    icon: '💼',
    folder: 'phan-5-business',
  },
  {
    order: 6,
    slug: 'phap-ly',
    title: 'Pháp Lý & Quyền Lợi',
    titleEn: 'Legal & Rights',
    description: 'Quyền cơ bản, quốc tịch, luật giao thông, nhà ở, và lao động',
    descriptionEn: 'Fundamental rights, citizenship, driving laws, housing, and labor rights',
    icon: '⚖️',
    folder: 'phan-6-laws',
  },
  {
    order: 7,
    slug: 'tinh-than',
    title: 'Đời Sống Tinh Thần',
    titleEn: 'Spiritual Life',
    description: 'Cộng đồng tôn giáo, bảo tồn văn hóa, và kết nối thế hệ',
    descriptionEn: 'Religious communities, cultural preservation, and connecting generations',
    icon: '🙏',
    folder: 'phan-7-spiritual',
  },
  {
    order: 8,
    slug: 'hoa-nhap',
    title: 'Hòa Nhập & Phát Triển',
    titleEn: 'Integration & Development',
    description: 'Hòa nhập xã hội, phát triển bản thân, đóng góp cộng đồng, và tầm nhìn tương lai',
    descriptionEn: 'Social integration, personal development, community contribution, and future vision',
    icon: '🌟',
    folder: 'phan-8-integration',
  },
];

// Chapter metadata mapping
const chapterMeta: Record<number, {
  slug: string;
  titleEn?: string;
  excerptEn?: string;
  relatedBusinessCategories?: string[];
  hasCaseStudy?: boolean;
  hasChecklist?: boolean;
  hasMistakes?: boolean;
}> = {
  1: { slug: 'tong-quan-hawaii', titleEn: 'Overview of Hawaii', relatedBusinessCategories: ['travel', 'services'] },
  2: { slug: 'chi-phi-sinh-hoat', titleEn: 'Cost of Living', relatedBusinessCategories: ['grocery', 'services'], hasCaseStudy: true, hasMistakes: true },
  3: { slug: 'van-hoa-aloha', titleEn: 'Aloha Culture', relatedBusinessCategories: ['community', 'cultural'], hasCaseStudy: true },
  4: { slug: 'cong-dong-nguoi-viet', titleEn: 'Vietnamese Community', relatedBusinessCategories: ['restaurants', 'grocery', 'community'], hasCaseStudy: true },
  5: { slug: 'truong-cong-lap', titleEn: 'Public Schools', relatedBusinessCategories: ['education'], hasChecklist: true, hasMistakes: true },
  6: { slug: 'truong-tu-thuc', titleEn: 'Private Schools', relatedBusinessCategories: ['education'], hasCaseStudy: true },
  7: { slug: 'dai-hoc-hawaii', titleEn: 'University of Hawaii', relatedBusinessCategories: ['education'], hasCaseStudy: true },
  8: { slug: 'cac-truong-khac', titleEn: 'Other Colleges', relatedBusinessCategories: ['education'] },
  9: { slug: 'day-tieng-viet', titleEn: 'Vietnamese Language Schools', relatedBusinessCategories: ['education', 'community'], hasCaseStudy: true },
  10: { slug: 'he-thong-y-te', titleEn: 'Healthcare System', relatedBusinessCategories: ['health'], hasChecklist: true, hasMistakes: true },
  11: { slug: 'wellness', titleEn: 'Wellness & Fitness', relatedBusinessCategories: ['health', 'wellness'], hasCaseStudy: true },
  12: { slug: 'suc-khoe-tam-than', titleEn: 'Mental Health', relatedBusinessCategories: ['health', 'services'] },
  13: { slug: 'ngan-hang', titleEn: 'Banking', relatedBusinessCategories: ['financial'], hasChecklist: true, hasMistakes: true },
  14: { slug: 'thue', titleEn: 'Taxes', relatedBusinessCategories: ['financial', 'professional'], hasMistakes: true },
  15: { slug: 'bao-hiem', titleEn: 'Insurance & Planning', relatedBusinessCategories: ['insurance', 'financial'], hasCaseStudy: true },
  16: { slug: 'mua-nha', titleEn: 'Home Buying', relatedBusinessCategories: ['real-estate'], hasCaseStudy: true, hasChecklist: true, hasMistakes: true },
  17: { slug: 'khoi-nghiep', titleEn: 'Starting a Business', relatedBusinessCategories: ['professional', 'services'], hasCaseStudy: true, hasChecklist: true, hasMistakes: true },
  18: { slug: 'viec-lam', titleEn: 'Employment', relatedBusinessCategories: ['professional'], hasCaseStudy: true },
  19: { slug: 'marketing-cong-nghe', titleEn: 'Marketing & Technology', relatedBusinessCategories: ['technology', 'services'] },
  20: { slug: 'quyen-co-ban', titleEn: 'Fundamental Rights', relatedBusinessCategories: ['legal', 'professional'], hasMistakes: true },
  21: { slug: 'quoc-tich', titleEn: 'Citizenship', relatedBusinessCategories: ['legal', 'immigration'], hasChecklist: true, hasMistakes: true },
  22: { slug: 'luat-giao-thong', titleEn: 'Driving Laws', relatedBusinessCategories: ['automotive'], hasChecklist: true, hasMistakes: true },
  23: { slug: 'luat-nha-o', titleEn: 'Housing Laws', relatedBusinessCategories: ['real-estate', 'legal'], hasMistakes: true },
  24: { slug: 'quyen-lao-dong', titleEn: 'Labor Rights', relatedBusinessCategories: ['legal', 'professional'], hasMistakes: true },
  25: { slug: 'cong-dong-ton-giao', titleEn: 'Religious Communities', relatedBusinessCategories: ['community', 'religious'], hasCaseStudy: true },
  26: { slug: 'bao-ton-van-hoa', titleEn: 'Preserving Culture', relatedBusinessCategories: ['cultural', 'community'], hasCaseStudy: true },
  27: { slug: 'ket-noi-the-he', titleEn: 'Connecting Generations', relatedBusinessCategories: ['community', 'education'], hasCaseStudy: true },
  28: { slug: 'hoa-nhap-xa-hoi', titleEn: 'Social Integration', relatedBusinessCategories: ['community'], hasCaseStudy: true },
  29: { slug: 'phat-trien-ban-than', titleEn: 'Personal Development', relatedBusinessCategories: ['education', 'services'], hasCaseStudy: true },
  30: { slug: 'dong-gop-cong-dong', titleEn: 'Community Contribution', relatedBusinessCategories: ['community', 'non-profit'], hasCaseStudy: true },
  31: { slug: 'tam-nhin-tuong-lai', titleEn: 'Future Vision', relatedBusinessCategories: ['community'], hasCaseStudy: true },
};

// Parse chapter file
function parseChapterFile(filePath: string): { title: string; content: string; excerpt: string } | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');

    // Extract title from first line (e.g., "# Chương 1: Tổng Quan Về Hawaii")
    const titleMatch = content.match(/^#\s+(?:Chương\s+\d+:\s*)?(.+)/m);
    const title = titleMatch ? titleMatch[1].trim() : 'Untitled';

    // Get first paragraph as excerpt (skip title and empty lines)
    const lines = content.split('\n');
    let excerpt = '';
    let inParagraph = false;

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line && !line.startsWith('#') && !line.startsWith('>') && !line.startsWith('-') && !line.startsWith('*')) {
        if (!inParagraph) {
          inParagraph = true;
        }
        excerpt += line + ' ';
        if (excerpt.length > 200) break;
      } else if (inParagraph && !line) {
        break;
      }
    }

    // Truncate excerpt to ~200 chars
    excerpt = excerpt.trim();
    if (excerpt.length > 250) {
      excerpt = excerpt.substring(0, 250).replace(/\s+\S*$/, '') + '...';
    }

    return { title, content, excerpt };
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return null;
  }
}

// Estimate read time (words / 200 words per minute)
function estimateReadTime(content: string): number {
  const wordCount = content.split(/\s+/).length;
  return Math.max(5, Math.ceil(wordCount / 200));
}

async function seedGuide() {
  console.log('🌺 Starting Guide content import...\n');

  // Clear existing data
  console.log('Clearing existing guide data...');
  await prisma.guideBookmark.deleteMany({});
  await prisma.guideChapter.deleteMany({});
  await prisma.guidePart.deleteMany({});

  let totalChapters = 0;

  // Create parts and chapters
  for (const part of parts) {
    console.log(`\n📖 Creating Part ${part.order}: ${part.title}`);

    // Create the part
    const createdPart = await prisma.guidePart.create({
      data: {
        slug: part.slug,
        title: part.title,
        titleEn: part.titleEn,
        description: part.description,
        descriptionEn: part.descriptionEn,
        icon: part.icon,
        order: part.order,
        published: true,
      },
    });

    // Find chapter files in this part's folder
    const partFolder = path.join(EBOOK_PATH, part.folder);
    const files = fs.readdirSync(partFolder)
      .filter(f => f.startsWith('chapter-') && f.endsWith('.md'))
      .sort();

    let chapterOrder = 1;
    for (const file of files) {
      const chapterMatch = file.match(/chapter-(\d+)/);
      if (!chapterMatch) continue;

      const chapterNum = parseInt(chapterMatch[1], 10);
      const filePath = path.join(partFolder, file);
      const parsed = parseChapterFile(filePath);

      if (!parsed) {
        console.log(`  ⚠️ Skipping ${file} - could not parse`);
        continue;
      }

      const meta = chapterMeta[chapterNum] || { slug: `chuong-${chapterNum}` };

      await prisma.guideChapter.create({
        data: {
          partId: createdPart.id,
          slug: meta.slug,
          chapterNumber: chapterNum,
          title: parsed.title,
          titleEn: meta.titleEn || null,
          excerpt: parsed.excerpt,
          excerptEn: meta.excerptEn || null,
          content: parsed.content,
          contentEn: null,
          order: chapterOrder,
          readTime: estimateReadTime(parsed.content),
          hasCaseStudy: meta.hasCaseStudy || false,
          hasChecklist: meta.hasChecklist || false,
          hasMistakes: meta.hasMistakes || false,
          relatedBusinessCategories: meta.relatedBusinessCategories || [],
          published: true,
          featured: false,
        },
      });

      console.log(`  ✅ Chapter ${chapterNum}: ${parsed.title.substring(0, 40)}...`);
      totalChapters++;
      chapterOrder++;
    }
  }

  console.log(`\n🎉 Guide import complete!`);
  console.log(`   Created ${parts.length} parts`);
  console.log(`   Created ${totalChapters} chapters`);
}

async function main() {
  try {
    await seedGuide();
  } catch (error) {
    console.error('Error seeding guide:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
