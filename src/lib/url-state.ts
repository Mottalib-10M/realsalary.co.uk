/**
 * URL State Encoding/Decoding
 *
 * Encodes calculator state into URL query params for shareable, bookmarkable URLs.
 * Uses history.replaceState to avoid polluting browser history.
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

  const params = new URLSearchParams(window.location.search);
  const result: Record<string, ParamValue> = {};

  for (const [key, cfg] of Object.entries(config)) {
    const raw = params.get(key);

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
    const url = new URL(window.location.href);

    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === '' || value === false) {
        url.searchParams.delete(key);
      } else if (Array.isArray(value)) {
        if (value.length === 0) {
          url.searchParams.delete(key);
        } else {
          url.searchParams.set(key, value.join(','));
        }
      } else {
        url.searchParams.set(key, String(value));
      }
    }

    window.history.replaceState({}, '', url.toString());
  }, debounceMs);
}
