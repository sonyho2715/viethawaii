import { Client } from '@googlemaps/google-maps-services-js';
import { PrismaClient } from '@prisma/client';

const client = new Client({});
const prisma = new PrismaClient();

// Hawaii islands coordinates
const HAWAII_LOCATIONS = [
  { name: 'Oahu', location: '21.4389,-157.8001', radius: 50000 },
  { name: 'Maui', location: '20.7984,-156.3319', radius: 40000 },
  { name: 'Hawaii Island', location: '19.5429,-155.6659', radius: 60000 },
  { name: 'Kauai', location: '22.0964,-159.5261', radius: 35000 },
];

interface ImportStats {
  total: number;
  created: number;
  skipped: number;
  errors: number;
}

const stats: ImportStats = {
  total: 0,
  created: 0,
  skipped: 0,
  errors: 0,
};

function extractCity(address: string): string {
  const parts = address.split(',').map(p => p.trim());
  if (parts.length >= 3) {
    return parts[parts.length - 3] || 'Honolulu';
  }
  return 'Honolulu';
}

function extractZipCode(address: string): string | null {
  const match = address.match(/\b\d{5}\b/);
  return match ? match[0] : null;
}

function determineIsland(lat: number, lng: number): string {
  // Simple geographic determination based on coordinates
  if (lat >= 21.2 && lat <= 21.7 && lng >= -158.3 && lng <= -157.6) return 'Oahu';
  if (lat >= 20.5 && lat <= 21.0 && lng >= -156.7 && lng <= -155.9) return 'Maui';
  if (lat >= 18.9 && lat <= 20.3 && lng >= -156.1 && lng <= -154.8) return 'Hawaii Island';
  if (lat >= 21.8 && lat <= 22.2 && lng >= -159.8 && lng <= -159.3) return 'Kauai';
  return 'Oahu'; // Default
}

function mapPriceLevel(priceLevel?: number): string {
  if (!priceLevel) return '$';
  switch (priceLevel) {
    case 1: return '$';
    case 2: return '$$';
    case 3: return '$$$';
    case 4: return '$$$$';
    default: return '$';
  }
}

function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

async function importRestaurants(
  location: string,
  island: string,
  radius: number = 10000,
  keyword: string = 'vietnamese restaurant'
) {
  console.log(`\n🔍 Searching for ${keyword} in ${island}...`);

  try {
    // Search for nearby places
    const response = await client.placesNearby({
      params: {
        location: location,
        radius: radius,
        type: 'restaurant',
        keyword: keyword,
        key: process.env.GOOGLE_PLACES_API_KEY || '',
      },
      timeout: 10000,
    });

    if (!response.data.results || response.data.results.length === 0) {
      console.log(`  ℹ️  No results found for ${island}`);
      return;
    }

    console.log(`  ✅ Found ${response.data.results.length} places`);

    for (const place of response.data.results) {
      if (!place.place_id) continue;

      stats.total++;

      try {
        // Get detailed information
        const detailsResponse = await client.placeDetails({
          params: {
            place_id: place.place_id,
            fields: [
              'name',
              'formatted_address',
              'formatted_phone_number',
              'website',
              'rating',
              'user_ratings_total',
              'price_level',
              'opening_hours',
              'photos',
              'geometry',
              'types',
              'editorial_summary',
            ],
            key: process.env.GOOGLE_PLACES_API_KEY || '',
          },
          timeout: 10000,
        });

        const detail = detailsResponse.data.result;

        if (!detail || !detail.name) {
          stats.skipped++;
          continue;
        }

        // Check if already exists
        const slug = createSlug(detail.name);
        const existing = await prisma.business.findUnique({
          where: { slug }
        });

        if (existing) {
          console.log(`  ⏭️  Skipped (exists): ${detail.name}`);
          stats.skipped++;
          continue;
        }

        // Get location
        const lat = detail.geometry?.location?.lat;
        const lng = detail.geometry?.location?.lng;
        const determinedIsland = lat && lng ? determineIsland(lat, lng) : island;

        // Get photos
        const photos: string[] = [];
        if (detail.photos && detail.photos.length > 0) {
          for (let i = 0; i < Math.min(5, detail.photos.length); i++) {
            const photo = detail.photos[i];
            if (photo.photo_reference) {
              photos.push(
                `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photoreference=${photo.photo_reference}&key=${process.env.GOOGLE_PLACES_API_KEY}`
              );
            }
          }
        }

        // Create business
        await prisma.business.create({
          data: {
            name: detail.name,
            slug: slug,
            description: detail.editorial_summary?.overview ||
                        `Vietnamese restaurant located in ${extractCity(detail.formatted_address || '')}`,
            category: 'Food & Dining',
            subcategory: 'Vietnamese Restaurant',
            address: detail.formatted_address || '',
            city: extractCity(detail.formatted_address || ''),
            island: determinedIsland,
            zipCode: extractZipCode(detail.formatted_address || ''),
            phone: detail.formatted_phone_number,
            website: detail.website,
            image: photos[0] || null,
            images: photos,
            lat: lat,
            lng: lng,
            rating: detail.rating || 0,
            reviewCount: detail.user_ratings_total || 0,
            priceRange: mapPriceLevel(detail.price_level),
            features: detail.types || [],
            hours: detail.opening_hours?.periods as any ?? undefined,
            verified: true,
            featured: false,
            status: 'active',
          },
        });

        console.log(`  ✅ Imported: ${detail.name} (${determinedIsland})`);
        stats.created++;

        // Rate limiting - wait 50ms between requests
        await new Promise(resolve => setTimeout(resolve, 50));

      } catch (error) {
        console.error(`  ❌ Error processing ${place.name}:`, error);
        stats.errors++;
      }
    }

  } catch (error) {
    console.error(`❌ Error searching ${island}:`, error);
  }
}

async function main() {
  console.log('🚀 Starting Vietnamese Restaurant Import from Google Places API\n');
  console.log('📍 Searching across Hawaiian Islands...\n');

  if (!process.env.GOOGLE_PLACES_API_KEY) {
    console.error('❌ Error: GOOGLE_PLACES_API_KEY environment variable is not set!');
    console.error('Please add it to your .env file:');
    console.error('GOOGLE_PLACES_API_KEY=your_api_key_here');
    process.exit(1);
  }

  const startTime = Date.now();

  // Import from each island
  for (const island of HAWAII_LOCATIONS) {
    await importRestaurants(island.location, island.name, island.radius);
  }

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  console.log('\n' + '='.repeat(60));
  console.log('📊 Import Complete!');
  console.log('='.repeat(60));
  console.log(`⏱️  Duration: ${duration}s`);
  console.log(`📝 Total places found: ${stats.total}`);
  console.log(`✅ Successfully imported: ${stats.created}`);
  console.log(`⏭️  Skipped (already exist): ${stats.skipped}`);
  console.log(`❌ Errors: ${stats.errors}`);
  console.log('='.repeat(60));

  await prisma.$disconnect();
}

main()
  .then(() => {
    console.log('\n✨ All done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  });
