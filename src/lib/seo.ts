/**
 * SEO utilities for generating structured data and meta tags.
 */

import { TAX_YEAR } from '../data/tax-rules-2026-27';

export const SITE_NAME = 'Real Salary';
export const SITE_URL = 'https://realsalary.co.uk';
export const SITE_DESCRIPTION = 'Free UK salary, tax, and finance calculators. See what you actually take home.';
export const OG_IMAGE = `${SITE_URL}/og-default.svg`;
export const OG_IMAGE_WIDTH = '1200';
export const OG_IMAGE_HEIGHT = '630';

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
    dateModified: options.dateModified ?? '2025-05-12',
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': options.url,
    },
  };
}
