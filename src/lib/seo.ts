/**
 * SEO utilities for generating structured data and meta tags.
 */

import { TAX_YEAR } from '../data/tax-rules-2026-27';

export const SITE_NAME = 'Real Salary';
export const SITE_URL = 'https://realsalary.co.uk';
export const SITE_DESCRIPTION = 'Free UK salary, tax, and finance calculators. See what you actually take home.';
export const OG_IMAGE = `${SITE_URL}/og-default.png`;
export const OG_IMAGE_WIDTH = '1200';
export const OG_IMAGE_HEIGHT = '630';

/** Google Analytics 4 measurement ID — leave empty to disable */
export const GA4_MEASUREMENT_ID = 'G-1N5EQ2ENPS';

/** Microsoft Clarity project ID — leave empty to disable */
export const CLARITY_PROJECT_ID = 'xa15ozu4w9';

/** Bing Webmaster verification code — leave empty to disable */
export const BING_VERIFY_CODE = '15b1d26333aa4cd7a1cdba8e813bfc7f';

export interface PageMeta {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
}

/** Returns the page title as-is — no site name appended for maximum keyword density. */
export function buildTitle(pageTitle: string): string {
  return pageTitle;
}

export function buildCanonical(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const withSlash = cleanPath.endsWith('/') ? cleanPath : `${cleanPath}/`;
  return `${SITE_URL}${withSlash}`;
}

export function webApplicationSchema(name: string, description: string, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name,
    description,
    url,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'GBP',
    },
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export const LAST_UPDATED = `Updated for ${TAX_YEAR} tax year`;

export function websiteSearchSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: 'en-GB',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/salary/{salary}/`,
      },
      'query-input': 'required name=salary',
    },
  };
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/og-default.png`,
      width: 1200,
      height: 630,
    },
    sameAs: [
      `${SITE_URL}/about/`,
    ],
    founder: {
      '@type': 'Person',
      name: 'Mottalib Radif',
      jobTitle: 'Personal Finance and Taxation Expert',
      description: 'Personal finance and taxation expert, MBA INSEAD graduate. Specialized in UK income tax, National Insurance, and pension contribution analysis.',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'contact@realsalary.co.uk',
      contactType: 'customer support',
    },
  };
}

export function personSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Mottalib Radif',
    jobTitle: 'Personal Finance and Taxation Expert',
    description: 'Personal finance and taxation expert, MBA INSEAD graduate. Specialized in UK income tax, National Insurance, and pension contribution analysis.',
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: 'INSEAD',
    },
    image: `${SITE_URL}/team/mottalib-radif.jpg`,
    url: `${SITE_URL}/about/`,
  };
}

export function articleSchema(options: {
  headline: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: options.headline,
    description: options.description,
    datePublished: options.datePublished ?? '2025-05-12',
    dateModified: options.dateModified ?? '2026-06-19',
    inLanguage: 'en-GB',
    author: {
      '@type': 'Person',
      name: 'Mottalib Radif',
      url: `${SITE_URL}/about/`,
      image: `${SITE_URL}/team/mottalib-radif.jpg`,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/og-default.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': options.url,
    },
  };
}
