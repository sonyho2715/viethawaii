import { getClientIP, RATE_LIMITS } from '@/lib/rate-limit';

describe('Rate Limit Utilities', () => {
  describe('getClientIP', () => {
    it('should extract IP from x-vercel-forwarded-for header', () => {
      const request = new Request('http://localhost', {
        headers: {
          'x-vercel-forwarded-for': '192.168.1.1',
        },
      });
      expect(getClientIP(request)).toBe('192.168.1.1');
    });

    it('should extract first IP from comma-separated x-forwarded-for', () => {
      const request = new Request('http://localhost', {
        headers: {
          'x-forwarded-for': '192.168.1.1, 10.0.0.1',
        },
      });
      expect(getClientIP(request)).toBe('192.168.1.1');
    });

    it('should extract IP from x-real-ip header', () => {
      const request = new Request('http://localhost', {
        headers: {
          'x-real-ip': '192.168.1.1',
        },
      });
      expect(getClientIP(request)).toBe('192.168.1.1');
    });

    it('should return unknown when no IP headers are present', () => {
      const request = new Request('http://localhost');
      expect(getClientIP(request)).toBe('unknown');
    });

    it('should prioritize x-vercel-forwarded-for over other headers', () => {
      const request = new Request('http://localhost', {
        headers: {
          'x-vercel-forwarded-for': '10.0.0.1',
          'x-forwarded-for': '192.168.1.1',
          'x-real-ip': '172.16.0.1',
        },
      });
      expect(getClientIP(request)).toBe('10.0.0.1');
    });
  });

  describe('RATE_LIMITS', () => {
    it('should have login limit of 5 per minute', () => {
      expect(RATE_LIMITS.login.limit).toBe(5);
      expect(RATE_LIMITS.login.windowSeconds).toBe(60);
    });

    it('should have register limit of 3 per 5 minutes', () => {
      expect(RATE_LIMITS.register.limit).toBe(3);
      expect(RATE_LIMITS.register.windowSeconds).toBe(300);
    });

    it('should have createListing limit of 10 per hour', () => {
      expect(RATE_LIMITS.createListing.limit).toBe(10);
      expect(RATE_LIMITS.createListing.windowSeconds).toBe(3600);
    });

    it('should have upload limit of 20 per hour', () => {
      expect(RATE_LIMITS.upload.limit).toBe(20);
      expect(RATE_LIMITS.upload.windowSeconds).toBe(3600);
    });

    it('should have forgotPassword limit of 3 per hour', () => {
      expect(RATE_LIMITS.forgotPassword.limit).toBe(3);
      expect(RATE_LIMITS.forgotPassword.windowSeconds).toBe(3600);
    });

    it('should have api limit of 100 per minute', () => {
      expect(RATE_LIMITS.api.limit).toBe(100);
      expect(RATE_LIMITS.api.windowSeconds).toBe(60);
    });
  });
});
