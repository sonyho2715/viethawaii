'use client';

import React from 'react';

interface StructuredDataProps {
  data: Record<string, any>;
}

/**
 * Reusable component for injecting JSON-LD structured data into the page.
 * Uses the recommended Next.js pattern for SEO.
 */
export default function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
