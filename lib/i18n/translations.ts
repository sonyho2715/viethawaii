// Vietnamese/English translations for VietHawaii platform
// Vietnamese is the primary language

export type Language = 'vi' | 'en';

export interface Translations {
  // Navigation
  nav: {
    home: string;
    businesses: string;
    guide: string;
    classifieds: string;
    tools: string;
    community: string;
    news: string;
    blog: string;
    contact: string;
    login: string;
    register: string;
    dashboard: string;
    logout: string;
  };
  // Guide Section
  guide: {
    title: string;
    subtitle: string;
    readTime: string;
    chapters: string;
    tableOfContents: string;
    nextChapter: string;
    previousChapter: string;
    bookmark: string;
    bookmarked: string;
    relatedBusinesses: string;
    caseStudy: string;
    checklist: string;
    commonMistakes: string;
  };
  // Classifieds Section
  classifieds: {
    title: string;
    subtitle: string;
    postAd: string;
    categories: {
      jobs: string;
      housing: string;
      forSale: string;
      services: string;
      community: string;
    };
    filters: {
      island: string;
      city: string;
      priceRange: string;
      sortBy: string;
      newest: string;
      priceLowHigh: string;
      priceHighLow: string;
    };
    listing: {
      price: string;
      free: string;
      negotiable: string;
      contact: string;
      location: string;
      postedOn: string;
      views: string;
      report: string;
      save: string;
      share: string;
      sendMessage: string;
    };
    form: {
      title: string;
      description: string;
      category: string;
      price: string;
      images: string;
      contactInfo: string;
      submit: string;
    };
  };
  // Tools Section
  tools: {
    title: string;
    subtitle: string;
    costOfLiving: {
      title: string;
      description: string;
    };
    mortgage: {
      title: string;
      description: string;
    };
    tax: {
      title: string;
      description: string;
    };
    remittance: {
      title: string;
      description: string;
    };
    calculate: string;
    reset: string;
    save: string;
    results: string;
  };
  // Community Section
  community: {
    title: string;
    subtitle: string;
    events: {
      title: string;
      upcoming: string;
      past: string;
      addEvent: string;
      when: string;
      where: string;
      free: string;
      tickets: string;
    };
    organizations: {
      title: string;
      religious: string;
      cultural: string;
      business: string;
      social: string;
      addOrg: string;
    };
  };
  // Common
  common: {
    search: string;
    searchPlaceholder: string;
    loading: string;
    error: string;
    noResults: string;
    seeAll: string;
    learnMore: string;
    readMore: string;
    back: string;
    next: string;
    previous: string;
    submit: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
    close: string;
    featured: string;
    verified: string;
    new: string;
    urgent: string;
  };
  // Islands
  islands: {
    oahu: string;
    maui: string;
    bigIsland: string;
    kauai: string;
    molokai: string;
    lanai: string;
  };
  // Footer
  footer: {
    about: string;
    contact: string;
    privacy: string;
    terms: string;
    copyright: string;
  };
}

export const translations: Record<Language, Translations> = {
  vi: {
    nav: {
      home: 'Trang Chủ',
      businesses: 'Doanh Nghiệp',
      guide: 'Hướng Dẫn Định Cư',
      classifieds: 'Rao Vặt',
      tools: 'Công Cụ',
      community: 'Cộng Đồng',
      news: 'Tin Tức',
      blog: 'Blog',
      contact: 'Liên Hệ',
      login: 'Đăng Nhập',
      register: 'Đăng Ký',
      dashboard: 'Bảng Điều Khiển',
      logout: 'Đăng Xuất',
    },
    guide: {
      title: 'Hướng Dẫn Định Cư Hawaii',
      subtitle: 'Cẩm nang toàn diện cho người Việt định cư tại Hawaii',
      readTime: 'phút đọc',
      chapters: 'chương',
      tableOfContents: 'Mục Lục',
      nextChapter: 'Chương Tiếp Theo',
      previousChapter: 'Chương Trước',
      bookmark: 'Đánh Dấu',
      bookmarked: 'Đã Đánh Dấu',
      relatedBusinesses: 'Doanh Nghiệp Liên Quan',
      caseStudy: 'Câu Chuyện Thực Tế',
      checklist: 'Danh Sách Kiểm Tra',
      commonMistakes: 'Lỗi Thường Gặp',
    },
    classifieds: {
      title: 'Rao Vặt',
      subtitle: 'Mua bán, việc làm, nhà ở cho cộng đồng người Việt Hawaii',
      postAd: 'Đăng Tin',
      categories: {
        jobs: 'Việc Làm',
        housing: 'Nhà Ở',
        forSale: 'Mua Bán',
        services: 'Dịch Vụ',
        community: 'Cộng Đồng',
      },
      filters: {
        island: 'Đảo',
        city: 'Thành Phố',
        priceRange: 'Khoảng Giá',
        sortBy: 'Sắp Xếp',
        newest: 'Mới Nhất',
        priceLowHigh: 'Giá Thấp - Cao',
        priceHighLow: 'Giá Cao - Thấp',
      },
      listing: {
        price: 'Giá',
        free: 'Miễn Phí',
        negotiable: 'Thương Lượng',
        contact: 'Liên Hệ',
        location: 'Địa Điểm',
        postedOn: 'Đăng Ngày',
        views: 'lượt xem',
        report: 'Báo Cáo',
        save: 'Lưu',
        share: 'Chia Sẻ',
        sendMessage: 'Gửi Tin Nhắn',
      },
      form: {
        title: 'Tiêu Đề',
        description: 'Mô Tả',
        category: 'Danh Mục',
        price: 'Giá',
        images: 'Hình Ảnh',
        contactInfo: 'Thông Tin Liên Hệ',
        submit: 'Đăng Tin',
      },
    },
    tools: {
      title: 'Công Cụ Hữu Ích',
      subtitle: 'Các công cụ tính toán giúp bạn chuẩn bị cho cuộc sống Hawaii',
      costOfLiving: {
        title: 'Chi Phí Sinh Hoạt',
        description: 'So sánh chi phí sinh hoạt giữa Hawaii và nơi bạn đang sống',
      },
      mortgage: {
        title: 'Tính Vay Nhà',
        description: 'Tính toán khoản vay mua nhà và lãi suất hàng tháng',
      },
      tax: {
        title: 'Tính Thuế',
        description: 'Ước tính thuế thu nhập liên bang và tiểu bang Hawaii',
      },
      remittance: {
        title: 'Chuyển Tiền',
        description: 'So sánh phí và tỷ giá chuyển tiền về Việt Nam',
      },
      calculate: 'Tính Toán',
      reset: 'Đặt Lại',
      save: 'Lưu Kết Quả',
      results: 'Kết Quả',
    },
    community: {
      title: 'Cộng Đồng',
      subtitle: 'Kết nối với cộng đồng người Việt Hawaii',
      events: {
        title: 'Sự Kiện',
        upcoming: 'Sắp Tới',
        past: 'Đã Qua',
        addEvent: 'Thêm Sự Kiện',
        when: 'Thời Gian',
        where: 'Địa Điểm',
        free: 'Miễn Phí',
        tickets: 'Mua Vé',
      },
      organizations: {
        title: 'Tổ Chức',
        religious: 'Tôn Giáo',
        cultural: 'Văn Hóa',
        business: 'Kinh Doanh',
        social: 'Xã Hội',
        addOrg: 'Thêm Tổ Chức',
      },
    },
    common: {
      search: 'Tìm Kiếm',
      searchPlaceholder: 'Tìm kiếm...',
      loading: 'Đang tải...',
      error: 'Có lỗi xảy ra',
      noResults: 'Không tìm thấy kết quả',
      seeAll: 'Xem Tất Cả',
      learnMore: 'Tìm Hiểu Thêm',
      readMore: 'Đọc Thêm',
      back: 'Quay Lại',
      next: 'Tiếp',
      previous: 'Trước',
      submit: 'Gửi',
      cancel: 'Hủy',
      save: 'Lưu',
      delete: 'Xóa',
      edit: 'Sửa',
      close: 'Đóng',
      featured: 'Nổi Bật',
      verified: 'Đã Xác Minh',
      new: 'Mới',
      urgent: 'Gấp',
    },
    islands: {
      oahu: 'Oahu',
      maui: 'Maui',
      bigIsland: 'Big Island',
      kauai: 'Kauai',
      molokai: 'Molokai',
      lanai: 'Lanai',
    },
    footer: {
      about: 'Về Chúng Tôi',
      contact: 'Liên Hệ',
      privacy: 'Chính Sách Bảo Mật',
      terms: 'Điều Khoản Sử Dụng',
      copyright: '© 2024 VietHawaii. Bản quyền thuộc về VietHawaii.',
    },
  },
  en: {
    nav: {
      home: 'Home',
      businesses: 'Businesses',
      guide: 'Settlement Guide',
      classifieds: 'Classifieds',
      tools: 'Tools',
      community: 'Community',
      news: 'News',
      blog: 'Blog',
      contact: 'Contact',
      login: 'Login',
      register: 'Register',
      dashboard: 'Dashboard',
      logout: 'Logout',
    },
    guide: {
      title: 'Hawaii Settlement Guide',
      subtitle: 'Comprehensive guide for Vietnamese settling in Hawaii',
      readTime: 'min read',
      chapters: 'chapters',
      tableOfContents: 'Table of Contents',
      nextChapter: 'Next Chapter',
      previousChapter: 'Previous Chapter',
      bookmark: 'Bookmark',
      bookmarked: 'Bookmarked',
      relatedBusinesses: 'Related Businesses',
      caseStudy: 'Real Story',
      checklist: 'Checklist',
      commonMistakes: 'Common Mistakes',
    },
    classifieds: {
      title: 'Classifieds',
      subtitle: 'Buy, sell, jobs, housing for Hawaiian Vietnamese community',
      postAd: 'Post Ad',
      categories: {
        jobs: 'Jobs',
        housing: 'Housing',
        forSale: 'For Sale',
        services: 'Services',
        community: 'Community',
      },
      filters: {
        island: 'Island',
        city: 'City',
        priceRange: 'Price Range',
        sortBy: 'Sort By',
        newest: 'Newest',
        priceLowHigh: 'Price: Low to High',
        priceHighLow: 'Price: High to Low',
      },
      listing: {
        price: 'Price',
        free: 'Free',
        negotiable: 'Negotiable',
        contact: 'Contact',
        location: 'Location',
        postedOn: 'Posted on',
        views: 'views',
        report: 'Report',
        save: 'Save',
        share: 'Share',
        sendMessage: 'Send Message',
      },
      form: {
        title: 'Title',
        description: 'Description',
        category: 'Category',
        price: 'Price',
        images: 'Images',
        contactInfo: 'Contact Info',
        submit: 'Post Ad',
      },
    },
    tools: {
      title: 'Useful Tools',
      subtitle: 'Calculators to help you prepare for Hawaii life',
      costOfLiving: {
        title: 'Cost of Living',
        description: 'Compare cost of living between Hawaii and your current location',
      },
      mortgage: {
        title: 'Mortgage Calculator',
        description: 'Calculate home loan payments and monthly interest',
      },
      tax: {
        title: 'Tax Calculator',
        description: 'Estimate federal and Hawaii state income taxes',
      },
      remittance: {
        title: 'Remittance',
        description: 'Compare fees and rates for sending money to Vietnam',
      },
      calculate: 'Calculate',
      reset: 'Reset',
      save: 'Save Results',
      results: 'Results',
    },
    community: {
      title: 'Community',
      subtitle: 'Connect with the Hawaiian Vietnamese community',
      events: {
        title: 'Events',
        upcoming: 'Upcoming',
        past: 'Past',
        addEvent: 'Add Event',
        when: 'When',
        where: 'Where',
        free: 'Free',
        tickets: 'Buy Tickets',
      },
      organizations: {
        title: 'Organizations',
        religious: 'Religious',
        cultural: 'Cultural',
        business: 'Business',
        social: 'Social',
        addOrg: 'Add Organization',
      },
    },
    common: {
      search: 'Search',
      searchPlaceholder: 'Search...',
      loading: 'Loading...',
      error: 'An error occurred',
      noResults: 'No results found',
      seeAll: 'See All',
      learnMore: 'Learn More',
      readMore: 'Read More',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      submit: 'Submit',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      close: 'Close',
      featured: 'Featured',
      verified: 'Verified',
      new: 'New',
      urgent: 'Urgent',
    },
    islands: {
      oahu: 'Oahu',
      maui: 'Maui',
      bigIsland: 'Big Island',
      kauai: 'Kauai',
      molokai: 'Molokai',
      lanai: 'Lanai',
    },
    footer: {
      about: 'About Us',
      contact: 'Contact',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      copyright: '© 2024 VietHawaii. All rights reserved.',
    },
  },
};
