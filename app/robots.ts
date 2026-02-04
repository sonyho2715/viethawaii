import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://viethawaii.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/tai-khoan/',
          '/cai-dat/',
          '/dang-nhap',
          '/dang-ky',
          '/quen-mat-khau',
          '/dat-lai-mat-khau',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
