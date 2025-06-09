"use client"

import { useLanguage } from "@/components/language-provider"

export default function TermsContent() {
  const { t } = useLanguage()

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last updated: April 1, 2025</p>

        <div className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none">
          <h2>1. Introduction</h2>
          <p>
            Welcome to TravelEase. These Terms of Service ("Terms") govern your use of our website, mobile applications,
            and services (collectively, the "Services"). By accessing or using our Services, you agree to be bound by
            these Terms. If you do not agree to these Terms, please do not use our Services.
          </p>

          <h2>2. Definitions</h2>
          <p>
            <strong>"TravelEase"</strong>, <strong>"we"</strong>, <strong>"us"</strong>, or <strong>"our"</strong>{" "}
            refers to TravelEase Company Limited, a company registered in Vietnam.
          </p>
          <p>
            <strong>"User"</strong>, <strong>"you"</strong>, or <strong>"your"</strong> refers to any individual or
            entity that accesses or uses our Services.
          </p>
          <p>
            <strong>"Content"</strong> refers to all information, text, images, data, links, software, or other material
            that is available through our Services.
          </p>

          <h2>3. Account Registration</h2>
          <p>
            To access certain features of our Services, you may need to register for an account. You agree to provide
            accurate, current, and complete information during the registration process and to update such information
            to keep it accurate, current, and complete.
          </p>
          <p>
            You are responsible for safeguarding your account credentials and for all activities that occur under your
            account. You agree to notify us immediately of any unauthorized use of your account.
          </p>

          <h2>4. Booking and Payments</h2>
          <p>
            When you make a booking through our Services, you agree to pay all fees and charges associated with that
            booking. All payments are processed securely through our payment providers.
          </p>
          <p>
            Prices for tours and services are subject to change without notice. We reserve the right to modify or
            discontinue any service without notice at any time.
          </p>
          <p>
            Certain bookings may require a deposit or full payment in advance. The specific payment terms will be
            provided during the booking process.
          </p>

          <h2>5. Cancellation and Refund Policy</h2>
          <p>Our standard cancellation policy is as follows:</p>
          <ul>
            <li>Cancellations made 30 days or more before the tour start date: Full refund</li>
            <li>Cancellations made 15-29 days before the tour start date: 50% refund</li>
            <li>Cancellations made less than 15 days before the tour start date: No refund</li>
          </ul>
          <p>
            Some tours may have specific cancellation policies, which will be clearly stated during the booking process.
          </p>
          <p>
            If we cancel a tour for any reason, you will be offered a full refund or the option to transfer to another
            tour or date.
          </p>

          <h2>6. User Conduct</h2>
          <p>You agree not to use our Services to:</p>
          <ul>
            <li>Violate any applicable laws or regulations</li>
            <li>Infringe the rights of any third party</li>
            <li>Distribute viruses, malware, or other harmful code</li>
            <li>Interfere with or disrupt the integrity or performance of our Services</li>
            <li>Harass, abuse, or harm another person</li>
            <li>Submit false or misleading information</li>
          </ul>

          <h2>7. Intellectual Property</h2>
          <p>
            All content, features, and functionality of our Services, including but not limited to text, graphics,
            logos, icons, images, audio clips, digital downloads, and software, are the exclusive property of TravelEase
            or its licensors and are protected by copyright, trademark, and other intellectual property laws.
          </p>
          <p>
            You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform,
            republish, download, store, or transmit any of the material on our Services without our prior written
            consent.
          </p>

          <h2>8. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, TravelEase shall not be liable for any indirect, incidental,
            special, consequential, or punitive damages, including but not limited to, loss of profits, data, use,
            goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use
            the Services.
          </p>

          <h2>9. Indemnification</h2>
          <p>
            You agree to indemnify, defend, and hold harmless TravelEase and its officers, directors, employees, agents,
            and affiliates from and against any and all claims, liabilities, damages, losses, costs, expenses, or fees
            (including reasonable attorneys' fees) that such parties may incur as a result of or arising from your
            violation of these Terms.
          </p>

          <h2>10. Modifications to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. If we make changes, we will provide notice by
            posting the updated Terms on our Services and updating the "Last updated" date. Your continued use of our
            Services after any such changes constitutes your acceptance of the new Terms.
          </p>

          <h2>11. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of Vietnam, without regard to its
            conflict of law provisions.
          </p>

          <h2>12. Contact Information</h2>
          <p>If you have any questions about these Terms, please contact us at:</p>
          <p>
            TravelEase Company Limited
            <br />
            123 Travel Street, District 1<br />
            Ho Chi Minh City, Vietnam
            <br />
            Email: legal@travelease.com
            <br />
            Phone: +84 123 456 789
          </p>
        </div>
      </div>
    </div>
  )
}

