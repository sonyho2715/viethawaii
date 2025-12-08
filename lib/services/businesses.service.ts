/**
 * Businesses Service Module
 * Handles all business-related business logic
 */

import { prisma } from '@/lib/prisma';
import type { Business, Prisma } from '@prisma/client';

export interface CreateBusinessInput {
  name: string;
  nameVi?: string;
  slug: string;
  description: string;
  descriptionVi?: string;
  category: string;
  subcategory?: string;
  address: string;
  city: string;
  island: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  website?: string;
  image?: string;
  images?: string[];
  priceRange?: string;
  features?: string[];
  hours?: Record<string, string>;
  lat?: number;
  lng?: number;
  ownerId?: string;
}

export interface UpdateBusinessInput extends Partial<CreateBusinessInput> {
  status?: 'pending' | 'active' | 'inactive';
  featured?: boolean;
  verified?: boolean;
}

export interface BusinessFilters {
  island?: string;
  category?: string;
  subcategory?: string;
  search?: string;
  featured?: boolean;
  verified?: boolean;
  status?: 'pending' | 'active' | 'inactive';
  priceRange?: string;
  page?: number;
  limit?: number;
}

export class BusinessesService {
  /**
   * Create a new business
   */
  async createBusiness(input: CreateBusinessInput): Promise<Business> {
    return prisma.business.create({
      data: {
        ...input,
        status: 'pending',
        rating: 0,
        reviewCount: 0,
        featured: false,
        verified: false,
      },
    });
  }

  /**
   * Get businesses with filters
   */
  async getBusinesses(filters: BusinessFilters): Promise<{
    businesses: Business[];
    pagination: {
      page: number;
      limit: number;
      totalCount: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  }> {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const where: Prisma.BusinessWhereInput = {
      status: filters.status || 'active',
    };

    if (filters.island && filters.island !== 'All') {
      where.island = filters.island;
    }

    if (filters.category && filters.category !== 'All') {
      where.category = filters.category;
    }

    if (filters.subcategory && filters.subcategory !== 'All') {
      where.subcategory = filters.subcategory;
    }

    if (filters.featured !== undefined) {
      where.featured = filters.featured;
    }

    if (filters.verified !== undefined) {
      where.verified = filters.verified;
    }

    if (filters.priceRange && filters.priceRange !== 'All') {
      where.priceRange = filters.priceRange;
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { city: { contains: filters.search, mode: 'insensitive' } },
        { category: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [businesses, totalCount] = await Promise.all([
      prisma.business.findMany({
        where,
        orderBy: [
          { featured: 'desc' },
          { rating: 'desc' },
        ],
        skip,
        take: limit,
      }),
      prisma.business.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      businesses,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  /**
   * Get a single business by ID
   */
  async getBusinessById(id: string): Promise<Business | null> {
    return prisma.business.findUnique({
      where: { id },
    });
  }

  /**
   * Get a single business by slug
   */
  async getBusinessBySlug(slug: string): Promise<Business | null> {
    return prisma.business.findUnique({
      where: { slug },
    });
  }

  /**
   * Update a business
   */
  async updateBusiness(id: string, input: UpdateBusinessInput): Promise<Business> {
    return prisma.business.update({
      where: { id },
      data: input,
    });
  }

  /**
   * Delete a business
   */
  async deleteBusiness(id: string): Promise<Business> {
    return prisma.business.delete({
      where: { id },
    });
  }

  /**
   * Search businesses with full-text search capabilities
   */
  async searchBusinesses(query: string, filters?: BusinessFilters): Promise<Business[]> {
    const where: Prisma.BusinessWhereInput = {
      status: filters?.status || 'active',
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { nameVi: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { descriptionVi: { contains: query, mode: 'insensitive' } },
        { city: { contains: query, mode: 'insensitive' } },
        { category: { contains: query, mode: 'insensitive' } },
        { subcategory: { contains: query, mode: 'insensitive' } },
      ],
    };

    if (filters?.island && filters.island !== 'All') {
      where.island = filters.island;
    }

    if (filters?.category && filters.category !== 'All') {
      where.category = filters.category;
    }

    return prisma.business.findMany({
      where,
      orderBy: [
        { featured: 'desc' },
        { rating: 'desc' },
      ],
      take: filters?.limit || 50,
    });
  }

  /**
   * Get featured businesses
   */
  async getFeaturedBusinesses(limit: number = 10): Promise<Business[]> {
    return prisma.business.findMany({
      where: {
        status: 'active',
        featured: true,
      },
      orderBy: {
        rating: 'desc',
      },
      take: limit,
    });
  }

  /**
   * Get top-rated businesses
   */
  async getTopRatedBusinesses(limit: number = 10): Promise<Business[]> {
    return prisma.business.findMany({
      where: {
        status: 'active',
        reviewCount: {
          gte: 3, // Minimum 3 reviews to be considered
        },
      },
      orderBy: {
        rating: 'desc',
      },
      take: limit,
    });
  }

  /**
   * Get businesses by island
   */
  async getBusinessesByIsland(island: string): Promise<Business[]> {
    return prisma.business.findMany({
      where: {
        status: 'active',
        island,
      },
      orderBy: [
        { featured: 'desc' },
        { rating: 'desc' },
      ],
    });
  }

  /**
   * Get businesses by category
   */
  async getBusinessesByCategory(category: string): Promise<Business[]> {
    return prisma.business.findMany({
      where: {
        status: 'active',
        category,
      },
      orderBy: [
        { featured: 'desc' },
        { rating: 'desc' },
      ],
    });
  }
}

// Export singleton instance
export const businessesService = new BusinessesService();
