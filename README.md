# VietHawaii 🌺

**Your comprehensive guide to Vietnamese businesses across the Hawaiian Islands**

[![Live Site](https://img.shields.io/badge/Live-www.viethawaii.com-success)](https://www.viethawaii.com)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## About

VietHawaii is a community-driven platform connecting people with Vietnamese-owned businesses, services, and cultural experiences across Hawaii. From authentic phở restaurants to professional services, we help you discover and support the vibrant Vietnamese community in the Aloha State.

## Features

### 🏪 **Business Directory**
- **18+ Vietnamese businesses** across Oahu, Maui, Big Island, and Kauai
- Search by name, category, or location
- Filter by island and business type
- Detailed business profiles with hours, contact info, and features
- Verified business badges

### 📰 **Community News**
- Latest updates about Vietnamese community events
- Tết Festival announcements
- New business openings
- Cultural celebrations

### ✍️ **Blog & Articles**
- Food guides (Ultimate Pho Guide in Honolulu)
- Cultural insights
- How-to guides for Vietnamese cuisine
- Community history and heritage

### 🧭 **Discover Section**
- Chinatown Food Tours
- Vietnamese Coffee Culture
- Traditional Markets
- Cultural Events (Mid-Autumn Festival, etc.)

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: Vercel
- **Version Control**: GitHub

## Project Structure

```
viethawaii/
├── app/
│   ├── page.tsx                 # Enhanced homepage
│   └── business/[slug]/         # Business detail pages
├── components/
│   ├── BusinessCard.tsx         # Business listing card
│   ├── NewsCard.tsx            # News article card
│   ├── BlogCard.tsx            # Blog post card
│   ├── DiscoverCard.tsx        # Discover item card
│   ├── SearchBar.tsx           # Search component
│   └── IslandSelector.tsx      # Island filter
├── lib/
│   ├── sampleData.ts           # Sample business data
│   └── enhancedData.ts         # Real businesses, news, blog content
└── tailwind.config.ts          # Vietnamese-themed colors
```

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Visit [http://localhost:3000](http://localhost:3000) to see the app.

## Featured Businesses

### Restaurants
- **Pho Que Huong** - Authentic pho in Chinatown
- **The Pig and The Lady** - Modern Vietnamese fusion
- **Pate Vietnamese Cuisine** - Hủ Tiếu Mì specialty
- **Pho Vietnam** - Traditional family recipes
- **Pho Viet Hawaii** - Multiple locations
- And many more...

## Roadmap

### Phase 1: MVP ✅
- [x] Business directory
- [x] Search and filtering
- [x] Business detail pages
- [x] News section
- [x] Blog section
- [x] Discover section
- [x] Real business data
- [x] Responsive design
- [x] Custom domain (www.viethawaii.com)

### Phase 2: Database & User Features 🚧
- [ ] PostgreSQL database with Railway
- [ ] User accounts and authentication
- [ ] Business owner dashboard
- [ ] User reviews and ratings
- [ ] Photo uploads
- [ ] Business submission form

### Phase 3: Enhanced Features 📅
- [ ] Google Maps integration
- [ ] "Near me" geolocation search
- [ ] Email notifications
- [ ] Event calendar
- [ ] Progressive Web App (PWA)

### Phase 4: Monetization 💰
- [ ] Premium business listings
- [ ] Featured placements
- [ ] Analytics dashboard
- [ ] Advertising system

## Contributing

We welcome contributions from the community! Here's how you can help:

1. **Add Businesses**: Know a Vietnamese business that should be listed? Submit it!
2. **Report Issues**: Found a bug or incorrect information? Let us know.
3. **Suggest Features**: Have ideas for new features? We'd love to hear them.
4. **Translate Content**: Help us improve Vietnamese translations.

## Community Guidelines

- All businesses must be Vietnamese-owned or serve the Vietnamese community
- Information must be accurate and up-to-date
- Respectful and constructive reviews only
- No spam or inappropriate content

## Support

- **Website**: [www.viethawaii.com](https://www.viethawaii.com)
- **GitHub**: [github.com/sonyho2715/viethawaii](https://github.com/sonyho2715/viethawaii)
- **Email**: Contact through website

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

Built with ❤️ for the Vietnamese community in Hawaii

Special thanks to:
- Vietnamese Professionals of Hawaii
- All the businesses featured on our platform
- The amazing Vietnamese community across the islands

---

**Khám phá cộng đồng Việt Nam tại Hawaii** 🌺

© 2025 VietHawaii. A community project.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
