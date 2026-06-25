import { useEffect } from 'react'
import { applySeoMetadata } from './seo.ts'
import './LegalPages.css'

type LegalPageType = 'privacy' | 'terms'

type LegalSection = {
  title: string
  body: string[]
  bullets?: string[]
}

type LegalPageProps = {
  type: LegalPageType
}

const HOME_OG_IMAGE_URL = 'https://redpill.software/og-image.png'

const privacySections: LegalSection[] = [
  {
    title: '1. Who We Are',
    body: [
      'Red Pill Software provides enterprise knowledge architecture, ontology engineering, knowledge graph engineering, and AI transformation services.',
    ],
  },
  {
    title: '2. Information We Collect',
    body: [],
    bullets: [
      'Contact information you submit (name, email, company, subject, message, and related business inquiry details).',
      'Website interaction and device data collected through analytics and similar technologies (for example, pages viewed, referral source, and browser metadata).',
      'Operational and security logs necessary to protect systems and prevent abuse.',
    ],
  },
  {
    title: '3. How We Use Information',
    body: [],
    bullets: [
      'Respond to inquiries and provide requested business or product information.',
      'Operate, secure, and improve website performance and user experience.',
      'Measure engagement and site usage trends to improve content and service delivery.',
      'Comply with legal obligations, enforce terms, and protect our rights.',
    ],
  },
  {
    title: '4. Legal Bases (Where Applicable)',
    body: [
      'Where GDPR or similar laws apply, our legal bases may include consent, legitimate interests, contract performance, and legal obligations depending on the processing activity.',
    ],
  },
  {
    title: '5. Cookies and Analytics',
    body: [
      'We use Google Tag Manager, cookie-consent tooling, and related analytics technologies to understand website usage and improve performance.',
      'Your browser settings and applicable consent mechanisms may allow you to control certain data collection.',
    ],
  },
  {
    title: '6. Sharing and Disclosures',
    body: [
      'We may share data with trusted service providers that support website hosting, analytics, and communications.',
      'We do not sell personal information. We may disclose information if required by law or to protect legal rights and security.',
    ],
  },
  {
    title: '7. Data Retention',
    body: [
      'We retain information only as long as reasonably necessary for business purposes, legal compliance, dispute resolution, security, and contract administration.',
    ],
  },
  {
    title: '8. Security',
    body: [
      'We apply reasonable administrative, technical, and organizational safeguards appropriate to the nature of our services. No transmission or storage system can be guaranteed 100% secure.',
    ],
  },
  {
    title: '9. International Transfers',
    body: [
      'If data is processed outside your jurisdiction, we take reasonable steps to ensure appropriate protections, consistent with applicable law.',
    ],
  },
  {
    title: '10. Your Privacy Rights',
    body: [
      'Depending on your jurisdiction, you may have rights to access, correct, delete, restrict, object, or request portability of personal data.',
      'You may also have rights related to certain analytics or marketing activities.',
    ],
  },
  {
    title: "11. Children's Privacy",
    body: ['Our services and website are intended for business users and not directed to children.'],
  },
  {
    title: '12. Changes to This Policy',
    body: ['We may update this Privacy Policy from time to time. Updates will be posted on this page with a revised effective date.'],
  },
  {
    title: '13. Contact',
    body: ['For privacy requests or questions, contact: hello@ontoligent.io'],
  },
]

const termsSections: LegalSection[] = [
  {
    title: '1. Acceptance of Terms',
    body: ['By accessing or using this website, you agree to these Terms. If you do not agree, do not use the site.'],
  },
  {
    title: '2. Scope of Services',
    body: [
      'Red Pill Software provides enterprise consulting and product-related services in areas such as semantic architecture, ontology engineering, knowledge graph engineering, and AI transformation.',
    ],
  },
  {
    title: '3. No Professional Advice',
    body: [
      'Website content is provided for general informational purposes and does not constitute legal, tax, accounting, investment, regulatory, or other professional advice.',
    ],
  },
  {
    title: '4. Acceptable Use',
    body: [],
    bullets: [
      'Do not use the site for unlawful, fraudulent, abusive, or harmful activities.',
      'Do not attempt unauthorized access, interference, scraping abuse, or security circumvention.',
      'Do not submit misleading, infringing, or malicious content through forms or communications.',
    ],
  },
  {
    title: '5. Intellectual Property',
    body: [
      'Unless otherwise stated, site content, branding, design, and materials are owned by Red Pill Software or its licensors and are protected by applicable intellectual property laws.',
    ],
  },
  {
    title: '6. Third-Party Services and Links',
    body: [
      'The site may reference or link to third-party services (for example, analytics, communication tools, social platforms, or external product pages).',
      'We are not responsible for third-party content, terms, or privacy practices.',
    ],
  },
  {
    title: '7. Availability and Changes',
    body: ['We may modify, suspend, or discontinue site features, content, and links at any time without notice.'],
  },
  {
    title: '8. Disclaimers',
    body: ['The website is provided on an "as is" and "as available" basis, without warranties of any kind to the extent permitted by law.'],
  },
  {
    title: '9. Limitation of Liability',
    body: [
      'To the maximum extent permitted by law, Red Pill Software will not be liable for indirect, incidental, special, consequential, or punitive damages arising out of or related to website use.',
    ],
  },
  {
    title: '10. Indemnification',
    body: [
      'You agree to indemnify and hold harmless Red Pill Software from claims, losses, liabilities, and expenses resulting from your violation of these Terms or misuse of the site.',
    ],
  },
  {
    title: '11. Privacy',
    body: ['Your use of the site is also governed by our Privacy Policy available at /legal/privacy-policy.'],
  },
  {
    title: '12. Governing Law',
    body: [
      'These Terms are governed by the laws of the State of Florida, USA, without regard to conflict-of-laws principles, unless otherwise required by applicable law.',
    ],
  },
  {
    title: '13. Contact',
    body: ['For legal or terms inquiries, contact: hello@ontoligent.io'],
  },
]

function LegalPages({ type }: LegalPageProps) {
  const isPrivacy = type === 'privacy'
  const title = isPrivacy ? 'Privacy Policy' : 'Terms and Conditions'
  const canonicalPath = isPrivacy ? '/legal/privacy-policy' : '/legal/terms-and-conditions'
  const description = isPrivacy
    ? 'Privacy Policy for Red Pill Software services, including enterprise consulting, Ontoligent product interactions, analytics, and contact processing.'
    : 'Terms and Conditions governing the use of Red Pill Software website, consulting services, and related materials.'
  const sections = isPrivacy ? privacySections : termsSections

  useEffect(() => {
    const fullUrl = `https://redpill.software${canonicalPath}`

    applySeoMetadata({
      title: `${title} | Red Pill Software`,
      description,
      canonicalUrl: fullUrl,
      ogUrl: fullUrl,
      ogImage: HOME_OG_IMAGE_URL,
    })
  }, [canonicalPath, description, title])

  return (
    <main className="legal-shell">
      <article className="legal-wrap" aria-label={title}>
        <header className="legal-header">
          <p className="legal-kicker">Red Pill Software Legal</p>
          <h1 className="legal-title">{title}</h1>
          <p className="legal-meta">Effective date: 2026-06-25</p>
        </header>

        <p className="legal-lead">
          {isPrivacy
            ? 'This Privacy Policy explains how Red Pill Software collects, uses, discloses, and protects information when you use our website, request consulting services, evaluate our Ontoligent product materials, or communicate with us.'
            : 'These Terms and Conditions govern your use of the Red Pill Software website and your interaction with our service information, product materials, and business inquiry channels.'}
        </p>

        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="legal-section-title">{section.title}</h2>
            {section.body.map((paragraph) => {
              const hasEmail = paragraph.includes('hello@ontoligent.io')
              if (!hasEmail) {
                return <p key={paragraph}>{paragraph}</p>
              }

              const [before] = paragraph.split('hello@ontoligent.io')
              return (
                <p key={paragraph}>
                  {before}
                  <a href="mailto:hello@ontoligent.io">hello@ontoligent.io</a>
                </p>
              )
            })}
            {section.bullets && (
              <ul>
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            )}
          </section>
        ))}

        <nav className="legal-links" aria-label="Legal links">
          <a href="/">Back to Home</a>
          {isPrivacy ? (
            <a href="/legal/terms-and-conditions">Terms and Conditions</a>
          ) : (
            <a href="/legal/privacy-policy">Privacy Policy</a>
          )}
        </nav>
      </article>
    </main>
  )
}

export default LegalPages
