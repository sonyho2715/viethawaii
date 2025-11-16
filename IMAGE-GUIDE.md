# VietHawaii Image Guide

This guide shows you exactly what images to download from Envato Elements and where to save them.

## Modern UI Update Summary

I've updated the businesses page (`/app/businesses/page.tsx`) with a modern, professional design featuring:

- **Full-width hero section** with background image and gradient overlay
- **Glassmorphism search bar** in the hero
- **Floating stats cards** overlaying the hero
- **Interactive island selection cards** with images
- **Modern filters** with better UX
- **CTA section** with background image
- **Smooth animations and transitions**
- **Responsive design** for all devices

## Images You Need to Download

### From Envato Elements (elements.envato.com)

Go to Envato Elements and search for the following images. Download high-resolution versions (1920px+ width recommended).

---

## 1. HERO BACKGROUND IMAGE

**What to search**: "vietnamese pho overhead" OR "vietnamese food flat lay" OR "banh mi fresh"

**Suggested keywords on Envato**:
- "vietnamese pho bowl overhead"
- "vietnamese food restaurant table"
- "pho soup fresh herbs"
- "vietnamese cuisine flat lay"

**What to look for**:
- Beautiful, appetizing Vietnamese food
- Overhead or flat lay composition
- Vibrant colors (greens, reds, whites)
- Professional food photography
- Wide format (landscape orientation)

**Recommended specs**:
- Resolution: 1920x1080px minimum (or larger)
- Format: JPG or PNG
- Landscape orientation

**Save as**: `/public/images/hero/businesses-hero.jpg`

**Alternative options**:
- Vietnamese restaurant interior with warm lighting
- Family dining at Vietnamese restaurant
- Multiple Vietnamese dishes on table

---

## 2. ISLAND IMAGES (6 images needed)

For each Hawaiian island, find tropical/beach images that represent that island.

**What to search**: "hawaii beach" "tropical island" "palm trees sunset" "hawaii ocean"

**Suggested keywords**:
- "waikiki beach oahu"
- "maui coastline"
- "hawaii big island volcano"
- "kauai napali coast"
- "molokai beach"
- "lanai island"

**What to look for**:
- Beautiful Hawaii scenery
- Beaches, palm trees, ocean views
- Square or portrait orientation works best
- Vibrant, inviting imagery

**Recommended specs**:
- Resolution: 800x800px minimum (square format preferred)
- Format: JPG
- Can all be same image or different for variety

### Save locations:

1. **Oahu**: `/public/images/islands/oahu.jpg`
   - Waikiki beach, Diamond Head, or Honolulu skyline

2. **Maui**: `/public/images/islands/maui.jpg`
   - Beach sunset, palm trees, ocean view

3. **Big Island**: `/public/images/islands/big-island.jpg`
   - Volcanic landscape or tropical beach

4. **Kauai**: `/public/images/islands/kauai.jpg`
   - Lush green mountains, Napali coast

5. **Molokai**: `/public/images/islands/molokai.jpg`
   - Pristine beach, tropical scenery

6. **Lanai**: `/public/images/islands/lanai.jpg`
   - Secluded beach, palm trees

**Quick tip**: You can use the same tropical beach image for all 6 if you want consistency, or use different images for variety.

---

## 3. CTA SECTION BACKGROUND

**What to search**: "vietnamese community" OR "asian business owner" OR "vietnamese restaurant people"

**Suggested keywords**:
- "vietnamese family gathering"
- "asian community celebration"
- "vietnamese restaurant customers"
- "small business owner smiling"
- "vietnamese chef cooking"

**What to look for**:
- People-focused imagery
- Warm, inviting atmosphere
- Community/family feel
- Can be slightly blurred (will have overlay)
- Landscape orientation

**Recommended specs**:
- Resolution: 1920x600px minimum
- Format: JPG
- Landscape orientation

**Save as**: `/public/images/cta/community.jpg`

---

## Temporary Placeholders

If you want to test the design before downloading images, you can use these free placeholder images:

```bash
# From your terminal, create placeholder images:

# Hero image
curl "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1920&h=1080&fit=crop" -o public/images/hero/businesses-hero.jpg

# Island images (using same image for now)
curl "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=800&fit=crop" -o public/images/islands/oahu.jpg
curl "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=800&fit=crop" -o public/images/islands/maui.jpg
curl "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=800&fit=crop" -o public/images/islands/big-island.jpg
curl "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=800&fit=crop" -o public/images/islands/kauai.jpg
curl "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=800&fit=crop" -o public/images/islands/molokai.jpg
curl "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=800&fit=crop" -o public/images/islands/lanai.jpg

# CTA image
curl "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1920&h=600&fit=crop" -o public/images/cta/community.jpg
```

---

## Image Optimization Tips

Once you have your images:

1. **Resize if needed**:
   - Hero: 1920x1080px or 1920x1200px
   - Islands: 800x800px (square)
   - CTA: 1920x600px

2. **Compress for web**:
   - Use TinyPNG.com or similar
   - Target: 200-500KB per image
   - Keep quality at 80-85%

3. **File names**:
   - Use lowercase
   - Use hyphens for spaces
   - Keep names descriptive

---

## Quick Setup Checklist

- [ ] Download hero background image from Envato
- [ ] Download 6 island images (or use same image 6 times)
- [ ] Download CTA background image
- [ ] Save all images to correct folders
- [ ] Optimize images for web (compress)
- [ ] Test the page locally
- [ ] Deploy to production

---

## Envato Elements Direct Links

1. **Vietnamese Food**: https://elements.envato.com/photos/vietnamese
2. **Business**: https://elements.envato.com/photos/business
3. **Community**: https://elements.envato.com/photos/community
4. **Hawaii/Tropical**: Search "hawaii beach" or "tropical island"

---

## After Adding Images

Once you've placed all images in the correct folders, rebuild and deploy:

```bash
npm run build
vercel --prod
```

The new modern UI will be live with your Envato images!

---

## Need Help?

If images don't show up:
1. Check file paths match exactly
2. Verify file extensions (.jpg vs .jpeg)
3. Clear browser cache
4. Rebuild with `npm run build`

If you need different aspect ratios or sizes, let me know and I can adjust the CSS.
