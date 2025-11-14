'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Mail, Phone, MapPin, Send, MessageSquare, User } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email || !formData.message) {
      setStatus('error');
      setStatusMessage('Please fill in all required fields');
      return;
    }

    if (!formData.email.includes('@')) {
      setStatus('error');
      setStatusMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');

    // TODO: Implement contact form API
    // For now, simulate API call
    setTimeout(() => {
      setStatus('success');
      setStatusMessage('Thank you for your message! We\'ll get back to you soon.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });

      // Reset status after 5 seconds
      setTimeout(() => {
        setStatus('idle');
        setStatusMessage('');
      }, 5000);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'info@viethawaii.com',
      link: 'mailto:info@viethawaii.com'
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '(808) 555-0123',
      link: 'tel:8085550123'
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'Honolulu, Hawaii',
      link: null
    }
  ];

  const subjects = [
    'General Inquiry',
    'Business Listing',
    'Event Submission',
    'Partnership',
    'Advertising',
    'Technical Support',
    'Other'
  ];

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

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                <MessageSquare className="w-16 h-16" />
              </div>
            </div>
            <h1 className="text-5xl font-black mb-4">Get in Touch</h1>
            <p className="text-xl text-orange-100 max-w-2xl mx-auto">
              Have questions or want to contribute? We'd love to hear from you!
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-black text-gray-900 mb-6">Send us a message</h2>

              {status === 'success' ? (
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <Send className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-700">{statusMessage}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        disabled={status === 'loading'}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-rose-500 focus:ring-4 focus:ring-rose-100 outline-none transition-all disabled:opacity-50"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  {/* Email and Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          disabled={status === 'loading'}
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-rose-500 focus:ring-4 focus:ring-rose-100 outline-none transition-all disabled:opacity-50"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          disabled={status === 'loading'}
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-rose-500 focus:ring-4 focus:ring-rose-100 outline-none transition-all disabled:opacity-50"
                          placeholder="(808) 555-0123"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-bold text-gray-700 mb-2">
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      disabled={status === 'loading'}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-rose-500 focus:ring-4 focus:ring-rose-100 outline-none transition-all disabled:opacity-50 font-semibold"
                    >
                      <option value="">Select a subject...</option>
                      {subjects.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2">
                      Message <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      disabled={status === 'loading'}
                      rows={6}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-rose-500 focus:ring-4 focus:ring-rose-100 outline-none transition-all disabled:opacity-50 resize-none"
                      placeholder="Tell us what you're thinking..."
                    />
                  </div>

                  {/* Error Message */}
                  {status === 'error' && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 text-red-700">
                      {statusMessage}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full bg-gradient-to-r from-rose-500 to-orange-500 text-white py-4 rounded-lg font-bold text-lg hover:from-rose-600 hover:to-orange-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {status === 'loading' ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Contact Info Sidebar */}
          <div className="space-y-6">
            {/* Contact Details */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-black text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="p-2 bg-rose-100 rounded-lg">
                      <info.icon className="w-5 h-5 text-rose-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600">{info.label}</p>
                      {info.link ? (
                        <a
                          href={info.link}
                          className="text-gray-900 font-bold hover:text-rose-600 transition-colors"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-gray-900 font-bold">{info.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-gradient-to-br from-rose-500 to-orange-500 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-xl font-black mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link
                  href="/businesses"
                  className="block py-2 px-4 bg-white/20 rounded-lg hover:bg-white/30 transition-colors font-semibold"
                >
                  Browse Businesses
                </Link>
                <Link
                  href="/news"
                  className="block py-2 px-4 bg-white/20 rounded-lg hover:bg-white/30 transition-colors font-semibold"
                >
                  Read News
                </Link>
                <Link
                  href="/blog"
                  className="block py-2 px-4 bg-white/20 rounded-lg hover:bg-white/30 transition-colors font-semibold"
                >
                  Explore Blog
                </Link>
                <Link
                  href="/events"
                  className="block py-2 px-4 bg-white/20 rounded-lg hover:bg-white/30 transition-colors font-semibold"
                >
                  View Events
                </Link>
              </div>
            </div>

            {/* Office Hours */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-black text-gray-900 mb-4">Response Time</h3>
              <p className="text-gray-700 leading-relaxed">
                We typically respond to all inquiries within 24-48 hours during business days.
              </p>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm font-bold text-gray-600 mb-2">Business Hours:</p>
                <p className="text-sm text-gray-700">Monday - Friday: 9am - 5pm HST</p>
                <p className="text-sm text-gray-700">Saturday - Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
