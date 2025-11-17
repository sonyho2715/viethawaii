import { API_ROUTES } from './constants';
import type {
  ApiResponse,
  PaginatedResponse,
  BusinessFormData,
  ReviewFormData,
  BusinessFilters,
  LoginCredentials,
  SessionUser,
} from './types';
import type { Business, Review, NewsArticle, BlogPost, DiscoverItem } from '@prisma/client';

class ApiClient {
  private csrfToken: string | null = null;

  /**
   * Get CSRF token from server
   */
  private async getCsrfToken(): Promise<string> {
    if (this.csrfToken) {
      return this.csrfToken;
    }

    try {
      const response = await fetch('/api/csrf-token');
      const data = await response.json();
      this.csrfToken = data.csrfToken;
      return this.csrfToken;
    } catch (error) {
      console.error('Failed to get CSRF token:', error);
      throw new Error('Failed to get CSRF token');
    }
  }

  /**
   * Delay helper for retries
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async request<T>(
    url: string,
    options: RequestInit = {},
    retries: number = 3
  ): Promise<ApiResponse<T>> {
    // Add CSRF token for state-changing methods
    const stateMutatingMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (stateMutatingMethods.includes(options.method || 'GET')) {
      try {
        const csrfToken = await this.getCsrfToken();
        headers['x-csrf-token'] = csrfToken;
      } catch (error) {
        console.error('CSRF token error:', error);
      }
    }

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url, {
          ...options,
          headers,
        });

        // Handle rate limiting
        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After');
          const delay = retryAfter ? parseInt(retryAfter) * 1000 : 1000 * Math.pow(2, attempt);

          if (attempt < retries) {
            await this.delay(delay);
            continue;
          }
        }

        const data = await response.json();

        if (!response.ok) {
          return {
            success: false,
            error: data.error || data.message || 'Request failed',
          };
        }

        return {
          success: true,
          data: data.data || data,
        };
      } catch (error) {
        lastError = error as Error;

        if (attempt < retries) {
          await this.delay(1000 * Math.pow(2, attempt));
        }
      }
    }

    return {
      success: false,
      error: lastError?.message || 'Network error',
    };
  }

  // Business APIs
  async getBusinesses(filters?: BusinessFilters): Promise<ApiResponse<Business[]>> {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.category && filters.category !== 'All') params.append('category', filters.category);
    if (filters?.island && filters.island !== 'All') params.append('island', filters.island);
    if (filters?.priceRange && filters.priceRange !== 'All') params.append('priceRange', filters.priceRange);
    if (filters?.featured) params.append('featured', 'true');
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.pageSize) params.append('pageSize', filters.pageSize.toString());

    const url = `${API_ROUTES.businesses}${params.toString() ? `?${params}` : ''}`;
    return this.request<Business[]>(url);
  }

  async getBusiness(slug: string): Promise<ApiResponse<Business>> {
    return this.request<Business>(API_ROUTES.business(slug));
  }

  async createBusiness(data: BusinessFormData): Promise<ApiResponse<Business>> {
    return this.request<Business>(API_ROUTES.businesses, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBusiness(id: string, data: Partial<BusinessFormData>): Promise<ApiResponse<Business>> {
    return this.request<Business>(API_ROUTES.admin.business(id), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteBusiness(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(API_ROUTES.admin.business(id), {
      method: 'DELETE',
    });
  }

  // Review APIs
  async getReviews(businessId?: string): Promise<ApiResponse<Review[]>> {
    const url = businessId
      ? `${API_ROUTES.reviews}?businessId=${businessId}`
      : API_ROUTES.reviews;
    return this.request<Review[]>(url);
  }

  async createReview(data: ReviewFormData): Promise<ApiResponse<Review>> {
    return this.request<Review>(API_ROUTES.reviews, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // News APIs
  async getNews(category?: string): Promise<ApiResponse<NewsArticle[]>> {
    const url = category
      ? `${API_ROUTES.news}?category=${category}`
      : API_ROUTES.news;
    return this.request<NewsArticle[]>(url);
  }

  async getNewsArticle(slug: string): Promise<ApiResponse<NewsArticle>> {
    return this.request<NewsArticle>(API_ROUTES.newsArticle(slug));
  }

  // Blog APIs
  async getBlogPosts(category?: string): Promise<ApiResponse<BlogPost[]>> {
    const url = category
      ? `${API_ROUTES.blog}?category=${category}`
      : API_ROUTES.blog;
    return this.request<BlogPost[]>(url);
  }

  async getBlogPost(slug: string): Promise<ApiResponse<BlogPost>> {
    return this.request<BlogPost>(API_ROUTES.blogPost(slug));
  }

  // Discover APIs
  async getDiscoverItems(): Promise<ApiResponse<DiscoverItem[]>> {
    return this.request<DiscoverItem[]>(API_ROUTES.discover);
  }

  // Auth APIs
  async login(credentials: LoginCredentials): Promise<ApiResponse<SessionUser>> {
    return this.request<SessionUser>(API_ROUTES.auth.login, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout(): Promise<ApiResponse<void>> {
    return this.request<void>(API_ROUTES.auth.logout, {
      method: 'POST',
    });
  }

  async getSession(): Promise<ApiResponse<SessionUser | null>> {
    return this.request<SessionUser | null>(API_ROUTES.auth.session);
  }

  // Admin APIs
  async getAdminBusinesses(filters?: { island?: string; category?: string; status?: string }): Promise<ApiResponse<Business[]>> {
    const params = new URLSearchParams();
    if (filters?.island && filters.island !== 'All') params.append('island', filters.island);
    if (filters?.category && filters.category !== 'All') params.append('category', filters.category);
    if (filters?.status) params.append('status', filters.status);

    const url = `${API_ROUTES.admin.businesses}${params.toString() ? `?${params}` : ''}`;
    return this.request<Business[]>(url);
  }

  async updateBusinessStatus(id: string, status: string, rejectionReason?: string): Promise<ApiResponse<Business>> {
    return this.request<Business>(API_ROUTES.admin.business(id), {
      method: 'PATCH',
      body: JSON.stringify({ status, rejectionReason }),
    });
  }

  async getAdminStats(): Promise<ApiResponse<any>> {
    return this.request<any>(API_ROUTES.admin.stats);
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export utility functions for easier use
export const api = {
  businesses: {
    getAll: (filters?: BusinessFilters) => apiClient.getBusinesses(filters),
    getOne: (slug: string) => apiClient.getBusiness(slug),
    create: (data: BusinessFormData) => apiClient.createBusiness(data),
    update: (id: string, data: Partial<BusinessFormData>) => apiClient.updateBusiness(id, data),
    delete: (id: string) => apiClient.deleteBusiness(id),
  },
  reviews: {
    getAll: (businessId?: string) => apiClient.getReviews(businessId),
    create: (data: ReviewFormData) => apiClient.createReview(data),
  },
  news: {
    getAll: (category?: string) => apiClient.getNews(category),
    getOne: (slug: string) => apiClient.getNewsArticle(slug),
  },
  blog: {
    getAll: (category?: string) => apiClient.getBlogPosts(category),
    getOne: (slug: string) => apiClient.getBlogPost(slug),
  },
  discover: {
    getAll: () => apiClient.getDiscoverItems(),
  },
  auth: {
    login: (credentials: LoginCredentials) => apiClient.login(credentials),
    logout: () => apiClient.logout(),
    getSession: () => apiClient.getSession(),
  },
  admin: {
    businesses: {
      getAll: (filters?: { island?: string; category?: string; status?: string }) => apiClient.getAdminBusinesses(filters),
      updateStatus: (id: string, status: string, rejectionReason?: string) => apiClient.updateBusinessStatus(id, status, rejectionReason),
    },
    stats: () => apiClient.getAdminStats(),
  },
};
