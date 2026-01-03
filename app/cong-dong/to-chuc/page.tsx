import { Metadata } from 'next';
import Link from 'next/link';
import { db } from '@/lib/db';
import { ChevronRight, MapPin, Phone, Globe, Building2, Users, Church, Briefcase, GraduationCap, Heart, CheckCircle, Plus } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Tổ Chức Cộng Đồng | Community Organizations | VietHawaii',
  description: 'Tìm kiếm các tổ chức cộng đồng người Việt tại Hawaii. Nhà thờ, chùa, hội đoàn, và tổ chức kinh doanh.',
  openGraph: {
    title: 'Tổ Chức Cộng Đồng Người Việt Hawaii',
    description: 'Kết nối với các tổ chức tôn giáo, văn hóa và kinh doanh của cộng đồng Việt',
  },
};

interface SearchParams {
  type?: string;
  island?: string;
}

const organizationTypes = [
  { value: 'all', label: 'Tất Cả', labelEn: 'All', icon: Building2 },
  { value: 'religious', label: 'Tôn Giáo', labelEn: 'Religious', icon: Church },
  { value: 'cultural', label: 'Văn Hóa', labelEn: 'Cultural', icon: Heart },
  { value: 'business', label: 'Kinh Doanh', labelEn: 'Business', icon: Briefcase },
  { value: 'social', label: 'Xã Hội', labelEn: 'Social', icon: Users },
  { value: 'educational', label: 'Giáo Dục', labelEn: 'Educational', icon: GraduationCap },
];

const islands = [
  { value: 'all', label: 'Tất Cả Đảo' },
  { value: 'oahu', label: "O'ahu" },
  { value: 'maui', label: 'Maui' },
  { value: 'big-island', label: 'Big Island' },
  { value: 'kauai', label: "Kaua'i" },
];

const subtypeLabels: Record<string, string> = {
  catholic: 'Công Giáo',
  buddhist: 'Phật Giáo',
  protestant: 'Tin Lành',
  caodai: 'Cao Đài',
  hoahao: 'Hòa Hảo',
};

async function getOrganizations(searchParams: SearchParams) {
  const where: Record<string, unknown> = {
    published: true,
  };

  if (searchParams.type && searchParams.type !== 'all') {
    where.type = searchParams.type;
  }

  if (searchParams.island && searchParams.island !== 'all') {
    where.island = searchParams.island;
  }

  try {
    const organizations = await db.communityOrganization.findMany({
      where,
      orderBy: [
        { featured: 'desc' },
        { verified: 'desc' },
        { name: 'asc' },
      ],
    });
    return organizations;
  } catch {
    return [];
  }
}

export default async function OrganizationsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const organizations = await getOrganizations(params);
  const currentType = params.type || 'all';
  const currentIsland = params.island || 'all';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-600 text-white py-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center gap-2 text-blue-200 mb-4">
              <Link href="/cong-dong" className="hover:text-white">Cộng Đồng</Link>
              <ChevronRight className="w-4 h-4" />
              <span>Tổ Chức</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold mb-2">Tổ Chức Cộng Đồng</h1>
                <p className="text-blue-100">Community Organizations</p>
              </div>
              <Link
                href="/cong-dong/to-chuc/them-moi"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition"
              >
                <Plus className="w-5 h-5" />
                Thêm Tổ Chức
              </Link>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="bg-white border-b py-4 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-wrap items-center gap-4">
              {/* Type Filter */}
              <div className="flex flex-wrap gap-2">
                {organizationTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <Link
                      key={type.value}
                      href={`/cong-dong/to-chuc?type=${type.value}${currentIsland !== 'all' ? `&island=${currentIsland}` : ''}`}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition ${
                        currentType === type.value
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {type.label}
                    </Link>
                  );
                })}
              </div>

              <div className="h-6 w-px bg-gray-300" />

              {/* Island Filter */}
              <select
                defaultValue={currentIsland}
                onChange={(e) => {
                  window.location.href = `/cong-dong/to-chuc?type=${currentType}&island=${e.target.value}`;
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
              >
                {islands.map((island) => (
                  <option key={island.value} value={island.value}>
                    {island.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Organizations List */}
        <section className="py-8 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            {organizations.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center">
                <Building2 className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Không tìm thấy tổ chức
                </h3>
                <p className="text-gray-500 mb-6">
                  Không có tổ chức nào phù hợp với bộ lọc. Hãy thử thay đổi bộ lọc hoặc thêm tổ chức của bạn!
                </p>
                <Link
                  href="/cong-dong/to-chuc/them-moi"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                >
                  <Plus className="w-5 h-5" />
                  Thêm Tổ Chức Mới
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {organizations.map((org) => {
                  const TypeIcon = organizationTypes.find((t) => t.value === org.type)?.icon || Building2;
                  return (
                    <Link
                      key={org.id}
                      href={`/cong-dong/to-chuc/${org.slug}`}
                      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                      {/* Image/Logo */}
                      <div className="aspect-video relative overflow-hidden">
                        {org.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={org.image}
                            alt={org.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                            {org.logo ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={org.logo}
                                alt={org.name}
                                className="w-24 h-24 object-contain"
                              />
                            ) : (
                              <TypeIcon className="w-16 h-16 text-white/50" />
                            )}
                          </div>
                        )}

                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                          {org.verified && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                              <CheckCircle className="w-3 h-3" />
                              Xác Thực
                            </span>
                          )}
                          {org.featured && (
                            <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded-full">
                              Nổi Bật
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            org.type === 'religious' ? 'bg-purple-100 text-purple-700' :
                            org.type === 'cultural' ? 'bg-pink-100 text-pink-700' :
                            org.type === 'business' ? 'bg-blue-100 text-blue-700' :
                            org.type === 'social' ? 'bg-green-100 text-green-700' :
                            'bg-orange-100 text-orange-700'
                          }`}>
                            {organizationTypes.find((t) => t.value === org.type)?.label || org.type}
                          </span>
                          {org.subtype && subtypeLabels[org.subtype] && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                              {subtypeLabels[org.subtype]}
                            </span>
                          )}
                        </div>

                        <h2 className="text-lg font-bold text-gray-900 mb-1">
                          {org.name}
                        </h2>
                        {org.nameEn && (
                          <p className="text-sm text-gray-500 mb-3">{org.nameEn}</p>
                        )}

                        <div className="space-y-2 text-sm text-gray-600">
                          {org.address && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              <span className="truncate">{org.city || org.island}</span>
                            </div>
                          )}
                          {org.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <span>{org.phone}</span>
                            </div>
                          )}
                          {org.website && (
                            <div className="flex items-center gap-2">
                              <Globe className="w-4 h-4 text-gray-400" />
                              <span className="truncate text-blue-600">{org.website.replace(/^https?:\/\//, '')}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Info Section */}
        <section className="py-12 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Church className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Tổ Chức Tôn Giáo</h3>
                <p className="text-gray-600">
                  Nhà thờ Công giáo, chùa Phật giáo, và các cơ sở tôn giáo khác phục vụ cộng đồng Việt
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-pink-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Hội Đoàn Văn Hóa</h3>
                <p className="text-gray-600">
                  Các hội đoàn bảo tồn và phát huy văn hóa Việt Nam tại Hawaii
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Hiệp Hội Doanh Nghiệp</h3>
                <p className="text-gray-600">
                  Kết nối các doanh nghiệp và chuyên gia người Việt tại Hawaii
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
