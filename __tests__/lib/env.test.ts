import { getEnv, REQUIRED_ENV_VARS, RECOMMENDED_ENV_VARS } from '@/lib/env';

describe('Environment Configuration', () => {
  describe('getEnv', () => {
    it('should return environment configuration object', () => {
      const env = getEnv();
      expect(env).toHaveProperty('DATABASE_URL');
      expect(env).toHaveProperty('isDev');
      expect(env).toHaveProperty('isProd');
    });

    it('should correctly identify development mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const env = getEnv();
      expect(env.isDev).toBe(true);
      expect(env.isProd).toBe(false);

      process.env.NODE_ENV = originalEnv;
    });

    it('should correctly identify production mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const env = getEnv();
      expect(env.isDev).toBe(false);
      expect(env.isProd).toBe(true);

      process.env.NODE_ENV = originalEnv;
    });

    it('should detect Google OAuth configuration', () => {
      const env = getEnv();
      expect(typeof env.hasGoogleOAuth).toBe('boolean');
    });

    it('should detect Redis configuration', () => {
      const env = getEnv();
      expect(typeof env.hasRedis).toBe('boolean');
    });
  });

  describe('REQUIRED_ENV_VARS', () => {
    it('should include DATABASE_URL', () => {
      expect(REQUIRED_ENV_VARS).toContain('DATABASE_URL');
    });

    it('should include AUTH_SECRET', () => {
      expect(REQUIRED_ENV_VARS).toContain('AUTH_SECRET');
    });

    it('should include Cloudinary variables', () => {
      expect(REQUIRED_ENV_VARS).toContain('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME');
      expect(REQUIRED_ENV_VARS).toContain('CLOUDINARY_API_KEY');
      expect(REQUIRED_ENV_VARS).toContain('CLOUDINARY_API_SECRET');
    });

    it('should include Vercel Blob token', () => {
      expect(REQUIRED_ENV_VARS).toContain('BLOB_READ_WRITE_TOKEN');
    });

    it('should include Resend API key', () => {
      expect(REQUIRED_ENV_VARS).toContain('RESEND_API_KEY');
    });
  });

  describe('RECOMMENDED_ENV_VARS', () => {
    it('should include Google OAuth variables', () => {
      expect(RECOMMENDED_ENV_VARS).toContain('GOOGLE_CLIENT_ID');
      expect(RECOMMENDED_ENV_VARS).toContain('GOOGLE_CLIENT_SECRET');
    });

    it('should include Upstash Redis variables', () => {
      expect(RECOMMENDED_ENV_VARS).toContain('UPSTASH_REDIS_REST_URL');
      expect(RECOMMENDED_ENV_VARS).toContain('UPSTASH_REDIS_REST_TOKEN');
    });

    it('should include CRON_SECRET', () => {
      expect(RECOMMENDED_ENV_VARS).toContain('CRON_SECRET');
    });
  });
});
