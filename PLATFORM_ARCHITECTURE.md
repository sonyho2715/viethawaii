# VietHawaii.com Platform Architecture

## Vision: Vietnamese Community Hub for Hawaii

Transform from business directory into comprehensive platform with:
- **Guide**: 31-chapter settlement guide (from ebook)
- **Classifieds**: Craigslist-style marketplace
- **Tools**: Practical calculators
- **Community**: Events and organizations

## Primary Language: Vietnamese (with English toggle)

## Route Structure

```
/huong-dan/                 # Settlement Guide
/rao-vat/                   # Classifieds
  /viec-lam                 # Jobs
  /nha-o                    # Housing
  /mua-ban                  # For Sale
  /dich-vu                  # Services
  /cong-dong                # Community
/cong-cu/                   # Tools
  /chi-phi-sinh-hoat        # Cost of living
  /tinh-vay-nha             # Mortgage
  /tinh-thue                # Tax
  /chuyen-tien              # Remittance
/cong-dong/                 # Community
  /su-kien                  # Events
  /to-chuc                  # Organizations
```

## Database Models

See prisma/schema.prisma for:
- GuidePart, GuideChapter
- ClassifiedCategory, ClassifiedListing, ClassifiedInquiry
- CommunityEvent, CommunityOrganization
- SavedCalculation

## Implementation Phases

1. Foundation (schema, routes)
2. Guide (ebook integration)
3. Classifieds
4. Moderation
5. Tools
6. Community
7. Monetization
8. Launch

## Content Source

Ebook: /Users/sonyho/vietnam-hawaii-ebook/
- 31 chapters in 8 parts
- Vietnamese primary, English secondary
