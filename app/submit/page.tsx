'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Upload, CheckCircle, AlertCircle, Building2, MapPin, Phone, Mail, Globe, Clock, DollarSign, Star, Image as ImageIcon } from 'lucide-react';

interface FormData {
  // Basic Info
  businessName: string;
  businessNameVi: string;
  category: string;
  subcategory: string;

  // Location
  island: string;
  city: string;
  address: string;

  // Contact
  phone: string;
  email: string;
  website: string;

  // Details
  description: string;
  descriptionVi: string;
  priceRange: string;

  // Hours
  hours: {
    [key: string]: string;
  };

  // Features
  features: string[];

  // Owner Info
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
}

export default function SubmitBusinessPage() {
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    businessNameVi: '',
    category: '',
    subcategory: '',
    island: 'Oahu',
    city: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    description: '',
    descriptionVi: '',
    priceRange: '$$',
    hours: {
      Monday: '9:00 AM - 5:00 PM',
      Tuesday: '9:00 AM - 5:00 PM',
      Wednesday: '9:00 AM - 5:00 PM',
      Thursday: '9:00 AM - 5:00 PM',
      Friday: '9:00 AM - 5:00 PM',
      Saturday: 'Closed',
      Sunday: 'Closed'
    },
    features: [],
    ownerName: '',
    ownerEmail: '',
    ownerPhone: ''
  });

  const categories = ['Restaurant', 'Retail', 'Service', 'Healthcare', 'Education', 'Real Estate', 'Entertainment', 'Other'];
  const islands = ['Oahu', 'Maui', 'Hawaii Island', 'Kauai', 'Molokai', 'Lanai'];
  const priceRanges = ['$', '$$', '$$$', '$$$$'];
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const commonFeatures = [
    'Dine-in', 'Takeout', 'Delivery', 'Parking', 'WiFi', 'Outdoor Seating',
    'Wheelchair Accessible', 'Family Friendly', 'Pet Friendly', 'Reservations',
    'Credit Cards', 'Cash Only', 'Catering', 'Vietnamese Speaking Staff'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleHoursChange = (day: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      hours: { ...prev.hours, [day]: value }
    }));
  };

  const toggleFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const validateStep = (stepNum: number): boolean => {
    switch(stepNum) {
      case 1:
        if (!formData.businessName || !formData.category) {
          setErrorMessage('Please fill in business name and category');
          return false;
        }
        break;
      case 2:
        if (!formData.island || !formData.city || !formData.address) {
          setErrorMessage('Please fill in all location fields');
          return false;
        }
        break;
      case 3:
        if (!formData.phone || !formData.email) {
          setErrorMessage('Please provide phone and email');
          return false;
        }
        if (!formData.email.includes('@')) {
          setErrorMessage('Please provide a valid email');
          return false;
        }
        break;
      case 4:
        if (!formData.description || formData.description.length < 50) {
          setErrorMessage('Please provide a description (at least 50 characters)');
          return false;
        }
        break;
      case 5:
        if (!formData.ownerName || !formData.ownerEmail || !formData.ownerPhone) {
          setErrorMessage('Please fill in all owner information');
          return false;
        }
        if (!formData.ownerEmail.includes('@')) {
          setErrorMessage('Please provide a valid owner email');
          return false;
        }
        break;
    }
    setErrorMessage('');
    return true;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, 5));
    }
  };

  const prevStep = () => {
    setErrorMessage('');
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(5)) return;

    setStatus('loading');

    // TODO: Implement API call to submit business
    setTimeout(() => {
      setStatus('success');
    }, 2000);
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-amber-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-2xl text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-4">Submission Received!</h1>
          <p className="text-lg text-gray-700 mb-6">
            Thank you for submitting your business to VietHawaii. Our team will review your submission and get back to you within 2-3 business days.
          </p>
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700">
              <strong>What's next?</strong><br/>
              We'll send a confirmation email to <strong>{formData.ownerEmail}</strong> with details about the review process.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-6 py-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-lg font-bold hover:shadow-lg transition-all"
            >
              Back to Home
            </Link>
            <button
              onClick={() => {
                setStatus('idle');
                setStep(1);
                setFormData({
                  businessName: '', businessNameVi: '', category: '', subcategory: '',
                  island: 'Oahu', city: '', address: '', phone: '', email: '', website: '',
                  description: '', descriptionVi: '', priceRange: '$$',
                  hours: {
                    Monday: '9:00 AM - 5:00 PM', Tuesday: '9:00 AM - 5:00 PM',
                    Wednesday: '9:00 AM - 5:00 PM', Thursday: '9:00 AM - 5:00 PM',
                    Friday: '9:00 AM - 5:00 PM', Saturday: 'Closed', Sunday: 'Closed'
                  },
                  features: [], ownerName: '', ownerEmail: '', ownerPhone: ''
                });
              }}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition-all"
            >
              Submit Another Business
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-amber-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-md sticky top-0 z-50 border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-rose-600 transition-colors">
              <ChevronLeft className="w-5 h-5" />
              <span className="font-semibold">Back to Home</span>
            </Link>
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl">🌺</span>
              <h1 className="text-3xl font-black bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
                VietHawaii
              </h1>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4, 5].map(num => (
              <div key={num} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  step >= num ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {num}
                </div>
                {num < 5 && (
                  <div className={`w-12 md:w-24 h-1 ${step > num ? 'bg-gradient-to-r from-rose-500 to-orange-500' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs md:text-sm font-semibold text-gray-600">
            <span>Basic Info</span>
            <span>Location</span>
            <span>Contact</span>
            <span>Details</span>
            <span>Owner</span>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="mb-6">
            <h2 className="text-3xl font-black text-gray-900 mb-2">
              {step === 1 && 'Basic Business Information'}
              {step === 2 && 'Business Location'}
              {step === 3 && 'Contact Information'}
              {step === 4 && 'Business Details'}
              {step === 5 && 'Owner Information'}
            </h2>
            <p className="text-gray-600">
              {step === 1 && 'Tell us about your business'}
              {step === 2 && 'Where can customers find you?'}
              {step === 3 && 'How can customers reach you?'}
              {step === 4 && 'Additional information about your business'}
              {step === 5 && 'Your contact information for verification'}
            </p>
          </div>

          {errorMessage && (
            <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700">{errorMessage}</p>
            </div>
          )}

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Business Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-rose-500 focus:ring-4 focus:ring-rose-100 outline-none transition-all"
                  placeholder="e.g., Pho Restaurant"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Business Name (Vietnamese)
                </label>
                <input
                  type="text"
                  name="businessNameVi"
                  value={formData.businessNameVi}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-rose-500 focus:ring-4 focus:ring-rose-100 outline-none transition-all"
                  placeholder="e.g., Nhà Hàng Phở"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-rose-500 focus:ring-4 focus:ring-rose-100 outline-none transition-all font-semibold"
                  >
                    <option value="">Select category...</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Subcategory
                  </label>
                  <input
                    type="text"
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-rose-500 focus:ring-4 focus:ring-rose-100 outline-none transition-all"
                    placeholder="e.g., Vietnamese Restaurant"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Island <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="island"
                    value={formData.island}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-rose-500 focus:ring-4 focus:ring-rose-100 outline-none transition-all font-semibold"
                  >
                    {islands.map(island => (
                      <option key={island} value={island}>{island}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    City <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-rose-500 focus:ring-4 focus:ring-rose-100 outline-none transition-all"
                    placeholder="e.g., Honolulu"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Street Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-rose-500 focus:ring-4 focus:ring-rose-100 outline-none transition-all"
                  placeholder="e.g., 123 Main St, Honolulu, HI 96814"
                />
              </div>
            </div>
          )}

          {/* Step 3: Contact */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-rose-500 focus:ring-4 focus:ring-rose-100 outline-none transition-all"
                    placeholder="(808) 555-0123"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-rose-500 focus:ring-4 focus:ring-rose-100 outline-none transition-all"
                    placeholder="business@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-rose-500 focus:ring-4 focus:ring-rose-100 outline-none transition-all"
                  placeholder="https://yourbusiness.com"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-4">
                  Business Hours
                </label>
                <div className="space-y-3">
                  {daysOfWeek.map(day => (
                    <div key={day} className="flex items-center gap-4">
                      <span className="w-28 font-semibold text-gray-700">{day}</span>
                      <input
                        type="text"
                        value={formData.hours[day]}
                        onChange={(e) => handleHoursChange(day, e.target.value)}
                        className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-rose-500 focus:ring-4 focus:ring-rose-100 outline-none transition-all"
                        placeholder="9:00 AM - 5:00 PM or Closed"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Details */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Business Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-rose-500 focus:ring-4 focus:ring-rose-100 outline-none transition-all resize-none"
                  placeholder="Describe your business, specialties, what makes you unique... (minimum 50 characters)"
                />
                <p className="mt-2 text-sm text-gray-500">
                  {formData.description.length} / 50 characters minimum
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Description (Vietnamese)
                </label>
                <textarea
                  name="descriptionVi"
                  value={formData.descriptionVi}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-rose-500 focus:ring-4 focus:ring-rose-100 outline-none transition-all resize-none"
                  placeholder="Mô tả doanh nghiệp của bạn..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Price Range
                </label>
                <div className="flex gap-4">
                  {priceRanges.map(range => (
                    <button
                      key={range}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, priceRange: range }))}
                      className={`px-6 py-3 rounded-lg font-bold transition-all ${
                        formData.priceRange === range
                          ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Features & Amenities
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {commonFeatures.map(feature => (
                    <button
                      key={feature}
                      type="button"
                      onClick={() => toggleFeature(feature)}
                      className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                        formData.features.includes(feature)
                          ? 'bg-rose-100 text-rose-700 border-2 border-rose-300'
                          : 'bg-gray-50 text-gray-700 border-2 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {feature}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Owner Info */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-700">
                  <strong>Privacy Notice:</strong> This information is only used for verification and will not be publicly displayed.
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Your Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-rose-500 focus:ring-4 focus:ring-rose-100 outline-none transition-all"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Your Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  name="ownerEmail"
                  value={formData.ownerEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-rose-500 focus:ring-4 focus:ring-rose-100 outline-none transition-all"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Your Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  name="ownerPhone"
                  value={formData.ownerPhone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-rose-500 focus:ring-4 focus:ring-rose-100 outline-none transition-all"
                  placeholder="(808) 555-0123"
                />
              </div>

              <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4">
                <h4 className="font-bold text-gray-900 mb-2">Review Your Submission</h4>
                <div className="text-sm space-y-1 text-gray-700">
                  <p><strong>Business:</strong> {formData.businessName}</p>
                  <p><strong>Category:</strong> {formData.category}</p>
                  <p><strong>Location:</strong> {formData.city}, {formData.island}</p>
                  <p><strong>Contact:</strong> {formData.phone}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between">
            {step > 1 && (
              <button
                onClick={prevStep}
                disabled={status === 'loading'}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition-all disabled:opacity-50"
              >
                Previous
              </button>
            )}

            <div className={step === 1 ? 'ml-auto' : ''}>
              {step < 5 ? (
                <button
                  onClick={nextStep}
                  disabled={status === 'loading'}
                  className="px-8 py-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  Next Step
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={status === 'loading'}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {status === 'loading' ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Submit Business
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
