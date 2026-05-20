/**
 * URL State Encoding/Decoding
 *
 * Encodes calculator state into the URL hash fragment (#) for shareable,
 * bookmarkable URLs. Hash fragments are invisible to search-engine crawlers,
 * so Google never indexes query-string variants of calculator pages.
 *
 * For backward compatibility, readUrlParams also checks query-string params
 * (e.g. old shared links with ?gross=30000) and migrates them to the hash.
 */

type ParamValue = string | number | boolean | string[] | undefined;

export interface UrlStateConfig {
  [key: string]: {
    type: 'string' | 'number' | 'boolean' | 'string[]';
    default: ParamValue;
  };
}

export function readUrlParams<T extends Record<string, ParamValue>>(
  config: UrlStateConfig,
): T {
  if (typeof window === 'undefined') {
    // SSR fallback: return defaults
    const defaults: Record<string, ParamValue> = {};
    for (const [key, cfg] of Object.entries(config)) {
      defaults[key] = cfg.default;
    }
    return defaults as T;
  }

  // Prefer hash params; fall back to query-string params (legacy shared URLs).
  const hashString = window.location.hash.startsWith('#')
    ? window.location.hash.slice(1)
    : '';
  const hashParams = new URLSearchParams(hashString);
  const queryParams = new URLSearchParams(window.location.search);

  const result: Record<string, ParamValue> = {};
  let hadLegacyQueryParams = false;

  for (const [key, cfg] of Object.entries(config)) {
    // Hash takes priority, then query-string.
    let raw = hashParams.get(key);
    if (raw === null && queryParams.has(key)) {
      raw = queryParams.get(key);
      hadLegacyQueryParams = true;
    }

    if (raw === null) {
      result[key] = cfg.default;
      continue;
    }

    switch (cfg.type) {
      case 'number': {
        const num = parseFloat(raw);
        result[key] = isNaN(num) ? cfg.default : num;
        break;
      }
      case 'boolean':
        result[key] = raw === 'true' || raw === '1';
        break;
      case 'string[]':
        result[key] = raw.split(',').filter(Boolean);
        break;
      case 'string':
      default:
        result[key] = raw;
        break;
    }
  }

  // Migrate: strip query params and move values into the hash so the clean
  // canonical URL stays in the address bar (and any subsequent share uses #).
  if (hadLegacyQueryParams) {
    const url = new URL(window.location.href);
    for (const key of Object.keys(config)) {
      url.searchParams.delete(key);
    }
    // Build hash from parsed result (non-default values only).
    const hash = new URLSearchParams();
    for (const [key, cfg] of Object.entries(config)) {
      const val = result[key];
      if (val === undefined || val === cfg.default) continue;
      if (Array.isArray(val)) {
        if (val.length > 0) hash.set(key, val.join(','));
      } else if (typeof val === 'boolean') {
        if (val) hash.set(key, 'true');
      } else {
        hash.set(key, String(val));
      }
    }
    const hashStr = hash.toString();
    url.hash = hashStr ? hashStr : '';
    window.history.replaceState({}, '', url.toString());
  }

  return result as T;
}

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

export function writeUrlParams(
  params: Record<string, ParamValue>,
  debounceMs: number = 300,
): void {
  if (typeof window === 'undefined') return;

  if (debounceTimer) clearTimeout(debounceTimer);

  debounceTimer = setTimeout(() => {
    const hash = new URLSearchParams(
      window.location.hash.startsWith('#')
        ? window.location.hash.slice(1)
        : '',
    );

    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === '' || value === false) {
        hash.delete(key);
      } else if (Array.isArray(value)) {
        if (value.length === 0) {
          hash.delete(key);
        } else {
          hash.set(key, value.join(','));
        }
      } else {
        hash.set(key, String(value));
      }
    }

    const hashStr = hash.toString();
    const url = new URL(window.location.href);
    // Also clean up any leftover query params.
    for (const key of Object.keys(params)) {
      url.searchParams.delete(key);
    }
    url.hash = hashStr ? hashStr : '';
    window.history.replaceState({}, '', url.toString());
  }, debounceMs);
}
