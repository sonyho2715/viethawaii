import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for VietHawaii - Read our terms and conditions for using our platform.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl">🌺</span>
              <span className="text-xl font-bold text-gray-900">VietHawaii</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Agreement to Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing or using VietHawaii ("the Service"), you agree to be bound by these Terms of Service
                ("Terms"). If you disagree with any part of these terms, you may not access the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Description of Service</h2>
              <p className="text-gray-700 mb-4">
                VietHawaii is a business directory platform that connects users with Vietnamese-owned and Vietnamese-focused
                businesses across the Hawaiian Islands. We provide business listings, contact information, reviews,
                and location-based services to help users discover local businesses.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">User Accounts</h2>
              <p className="text-gray-700 mb-4">
                When you create an account with us, you must provide accurate, complete, and current information.
                Failure to do so constitutes a breach of the Terms, which may result in immediate termination of
                your account on our Service.
              </p>
              <p className="text-gray-700 mb-4">
                You are responsible for safeguarding the password that you use to access the Service and for any
                activities or actions under your password.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Business Listings</h2>
              <p className="text-gray-700 mb-4">If you submit a business listing, you agree that:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>All information provided is accurate and truthful</li>
                <li>You have the right to represent the business</li>
                <li>You will maintain and update the listing information as needed</li>
                <li>Your listing complies with all applicable laws and regulations</li>
                <li>You will not post false, misleading, or deceptive information</li>
                <li>You grant VietHawaii the right to display and promote your business information</li>
              </ul>
              <p className="text-gray-700 mb-4">
                We reserve the right to review, modify, or remove any business listing at our discretion without
                prior notice.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">User Content and Reviews</h2>
              <p className="text-gray-700 mb-4">
                Users may submit reviews, ratings, and other content. By submitting content, you grant VietHawaii
                a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display such content.
              </p>
              <p className="text-gray-700 mb-4">You agree that your submitted content will:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Not contain false or misleading information</li>
                <li>Not violate any third-party rights, including copyright, trademark, privacy, or other rights</li>
                <li>Not contain hateful, threatening, or discriminatory content</li>
                <li>Not contain spam, advertising, or solicitations</li>
                <li>Not contain viruses or malicious code</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Prohibited Uses</h2>
              <p className="text-gray-700 mb-4">You may not use the Service:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>In any way that violates any applicable national or international law or regulation</li>
                <li>To transmit or procure the sending of any advertising or promotional material without our prior written consent</li>
                <li>To impersonate or attempt to impersonate VietHawaii, a VietHawaii employee, another user, or any other person or entity</li>
                <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Service</li>
                <li>To use automated systems to access the Service (scraping, bots, etc.)</li>
                <li>To collect or track the personal information of others</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Intellectual Property</h2>
              <p className="text-gray-700 mb-4">
                The Service and its original content (excluding content provided by users), features, and functionality
                are and will remain the exclusive property of VietHawaii and its licensors. The Service is protected
                by copyright, trademark, and other laws.
              </p>
              <p className="text-gray-700 mb-4">
                Our trademarks may not be used in connection with any product or service without the prior written
                consent of VietHawaii.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Third-Party Links</h2>
              <p className="text-gray-700 mb-4">
                Our Service may contain links to third-party websites or services that are not owned or controlled
                by VietHawaii. We have no control over, and assume no responsibility for, the content, privacy
                policies, or practices of any third-party websites or services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Disclaimer of Warranties</h2>
              <p className="text-gray-700 mb-4">
                The Service is provided on an "AS IS" and "AS AVAILABLE" basis. VietHawaii makes no warranties,
                expressed or implied, and hereby disclaims all warranties including, without limitation, implied
                warranties of merchantability, fitness for a particular purpose, or non-infringement.
              </p>
              <p className="text-gray-700 mb-4">
                We do not warrant that the Service will be uninterrupted, timely, secure, or error-free. We do not
                warrant the accuracy or completeness of business information provided on the platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                In no event shall VietHawaii, nor its directors, employees, partners, agents, suppliers, or affiliates,
                be liable for any indirect, incidental, special, consequential or punitive damages, including without
                limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your
                access to or use of or inability to access or use the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Indemnification</h2>
              <p className="text-gray-700 mb-4">
                You agree to defend, indemnify and hold harmless VietHawaii and its licensors and licensees, and their
                employees, contractors, agents, officers and directors, from and against any and all claims, damages,
                obligations, losses, liabilities, costs or debt, and expenses arising from your use of the Service or
                violation of these Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Termination</h2>
              <p className="text-gray-700 mb-4">
                We may terminate or suspend your account immediately, without prior notice or liability, for any reason
                whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use
                the Service will immediately cease.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Governing Law</h2>
              <p className="text-gray-700 mb-4">
                These Terms shall be governed and construed in accordance with the laws of the State of Hawaii,
                United States, without regard to its conflict of law provisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to Terms</h2>
              <p className="text-gray-700 mb-4">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will
                provide notice of any material changes by posting the new Terms on this page and updating the
                "Last updated" date.
              </p>
              <p className="text-gray-700 mb-4">
                Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms, please contact us:
              </p>
              <ul className="list-none text-gray-700 space-y-2">
                <li>Email: info@viethawaii.com</li>
                <li>Website: <Link href="/contact" className="text-rose-600 hover:underline">Contact Form</Link></li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Acknowledgment</h2>
              <p className="text-gray-700 mb-4">
                By using VietHawaii, you acknowledge that you have read these Terms of Service and agree to be bound by them.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
