"use client"

import { useLanguage } from "@/components/language-provider"

export default function PrivacyContent() {
  const { t } = useLanguage()

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: April 1, 2025</p>

        <div className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none">
          <h2>1. Introduction</h2>
          <p>
            At TravelEase, we respect your privacy and are committed to protecting your personal data. This Privacy
            Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or
            use our services.
          </p>
          <p>
            Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please
            do not access our website or use our services.
          </p>

          <h2>2. Information We Collect</h2>
          <p>We collect several types of information from and about users of our website and services, including:</p>
          <h3>2.1 Personal Information</h3>
          <p>
            Personal information is data that can be used to identify you directly or indirectly. We may collect the
            following personal information:
          </p>
          <ul>
            <li>Name, email address, phone number, and postal address</li>
            <li>Date of birth and gender</li>
            <li>Passport or ID information (when required for booking)</li>
            <li>Payment information (credit card details, billing address)</li>
            <li>Travel preferences and special requirements</li>
            <li>Information provided when you communicate with us</li>
            <li>Account login details and profile information</li>
            <li>Information about your travel companions</li>
          </ul>

          <h3>2.2 Non-Personal Information</h3>
          <p>We also collect non-personal information that does not directly identify you, including:</p>
          <ul>
            <li>Browser type and version</li>
            <li>Operating system</li>
            <li>IP address</li>
            <li>Device information</li>
            <li>Usage data (pages visited, time spent on pages, etc.)</li>
            <li>Referral source</li>
          </ul>

          <h2>3. How We Collect Information</h2>
          <p>We collect information through various methods, including:</p>
          <ul>
            <li>
              Direct interactions when you provide information by filling in forms, creating an account, making
              bookings, or contacting us
            </li>
            <li>Automated technologies such as cookies, server logs, and similar technologies</li>
            <li>Third parties, including our business partners, service providers, and analytics providers</li>
          </ul>

          <h2>4. How We Use Your Information</h2>
          <p>We use the information we collect for various purposes, including:</p>
          <ul>
            <li>Processing and managing your bookings</li>
            <li>Creating and managing your account</li>
            <li>Providing customer support</li>
            <li>Sending administrative information</li>
            <li>Sending marketing and promotional communications (with your consent)</li>
            <li>Personalizing your experience</li>
            <li>Improving our website and services</li>
            <li>Conducting research and analysis</li>
            <li>Preventing fraud and enhancing security</li>
            <li>Complying with legal obligations</li>
          </ul>

          <h2>5. Disclosure of Your Information</h2>
          <p>We may share your information with:</p>
          <ul>
            <li>Service providers who perform services on our behalf</li>
            <li>Travel suppliers (hotels, tour operators, transportation providers) to fulfill your bookings</li>
            <li>Business partners with whom we offer co-branded services or joint marketing activities</li>
            <li>Legal authorities when required by law or to protect our rights</li>
            <li>Potential buyers in the event of a merger, acquisition, or sale of assets</li>
          </ul>

          <h2>6. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information from unauthorized access,
            alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic
            storage is 100% secure, and we cannot guarantee absolute security.
          </p>

          <h2>7. Data Retention</h2>
          <p>
            We retain your personal information for as long as necessary to fulfill the purposes outlined in this
            Privacy Policy, unless a longer retention period is required or permitted by law.
          </p>

          <h2>8. Your Rights</h2>
          <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
          <ul>
            <li>Right to access your personal information</li>
            <li>Right to correct inaccurate or incomplete information</li>
            <li>Right to delete your personal information</li>
            <li>Right to restrict or object to processing</li>
            <li>Right to data portability</li>
            <li>Right to withdraw consent</li>
          </ul>
          <p>To exercise these rights, please contact us using the information provided in the "Contact Us" section.</p>

          <h2>9. Cookies and Similar Technologies</h2>
          <p>
            We use cookies and similar technologies to enhance your experience on our website. You can set your browser
            to refuse all or some browser cookies, but this may prevent you from accessing certain parts of our website.
          </p>

          <h2>10. International Data Transfers</h2>
          <p>
            Your information may be transferred to and processed in countries other than the one in which you reside.
            These countries may have different data protection laws. We take appropriate measures to ensure that your
            personal information remains protected in accordance with this Privacy Policy.
          </p>

          <h2>11. Children's Privacy</h2>
          <p>
            Our services are not intended for individuals under the age of 18. We do not knowingly collect personal
            information from children. If you are a parent or guardian and believe that your child has provided us with
            personal information, please contact us.
          </p>

          <h2>12. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. The updated version will be indicated by an updated
            "Last updated" date. We encourage you to review this Privacy Policy periodically.
          </p>

          <h2>13. Contact Us</h2>
          <p>
            If you have any questions or concerns about this Privacy Policy or our privacy practices, please contact us
            at:
          </p>
          <p>
            TravelEase Company Limited
            <br />
            123 Travel Street, District 1<br />
            Ho Chi Minh City, Vietnam
            <br />
            Email: privacy@travelease.com
            <br />
            Phone: +84 123 456 789
          </p>
        </div>
      </div>
    </div>
  )
}

