/**
 * Comprehensive XSS Protection Utility
 *
 * This module provides robust XSS protection with multiple layers of defense:
 * - HTML entity encoding
 * - Event handler removal
 * - URL scheme blocking
 * - Multi-pass sanitization
 * - DOMPurify integration for complex content
 */

import DOMPurify from 'dompurify';

/**
 * Configuration for XSS protection levels
 */
export interface XSSProtectionConfig {
    allowedTags?: string[];
    allowedAttributes?: string[];
    allowedSchemes?: string[];
    maxLength?: number;
    multiPass?: boolean;
}

/**
 * Default configuration for basic text sanitization
 */
const DEFAULT_CONFIG: XSSProtectionConfig = {
    allowedTags: [],
    allowedAttributes: [],
    allowedSchemes: ['http', 'https'],
    maxLength: 1000,
    multiPass: true,
};

/**
 * Dangerous URL schemes that should be blocked
 */
const DANGEROUS_SCHEMES = [
    'javascript:',
    'data:',
    'vbscript:',
    'file:',
    'about:',
    'chrome:',
    'chrome-extension:',
    'moz-extension:',
    'ms-appx:',
    'ms-appx-web:',
    'res:',
    'resource:',
    'moz-icon:',
    'moz-filedata:',
    'jar:',
    'view-source:',
    'wyciwyg:',
    'ms-its:',
    'mk:',
    'itmss:',
    'feed:',
    'livescript:',
];

/**
 * Event handlers that should be removed
 */
const EVENT_HANDLERS = [
    'onabort',
    'onactivate',
    'onafterprint',
    'onafterupdate',
    'onbeforeactivate',
    'onbeforecopy',
    'onbeforecut',
    'onbeforedeactivate',
    'onbeforeeditfocus',
    'onbeforepaste',
    'onbeforeprint',
    'onbeforeunload',
    'onbeforeupdate',
    'onblur',
    'onbounce',
    'oncellchange',
    'onchange',
    'onclick',
    'oncontextmenu',
    'oncontrolselect',
    'oncopy',
    'oncut',
    'ondataavailable',
    'ondatasetchanged',
    'ondatasetcomplete',
    'ondblclick',
    'ondeactivate',
    'ondrag',
    'ondragend',
    'ondragenter',
    'ondragleave',
    'ondragover',
    'ondragstart',
    'ondrop',
    'onerror',
    'onerrorupdate',
    'onfilterchange',
    'onfinish',
    'onfocus',
    'onfocusin',
    'onfocusout',
    'onhelp',
    'onkeydown',
    'onkeypress',
    'onkeyup',
    'onlayoutcomplete',
    'onload',
    'onlosecapture',
    'onmousedown',
    'onmouseenter',
    'onmouseleave',
    'onmousemove',
    'onmouseout',
    'onmouseover',
    'onmouseup',
    'onmousewheel',
    'onmove',
    'onmoveend',
    'onmovestart',
    'onpaste',
    'onpropertychange',
    'onreadystatechange',
    'onreset',
    'onresize',
    'onresizeend',
    'onresizestart',
    'onrowenter',
    'onrowexit',
    'onrowsdelete',
    'onrowsinserted',
    'onscroll',
    'onselect',
    'onselectionchange',
    'onselectstart',
    'onstart',
    'onstop',
    'onsubmit',
    'onunload',
];

/**
 * HTML entities mapping for encoding
 */
const HTML_ENTITIES: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;',
    '\n': '&#10;',
    '\r': '&#13;',
    '\t': '&#9;',
};

/**
 * Advanced HTML entities for additional protection
 */
const EXTENDED_HTML_ENTITIES: Record<string, string> = {
    ...HTML_ENTITIES,
    '(': '&#40;',
    ')': '&#41;',
    '[': '&#91;',
    ']': '&#93;',
    '{': '&#123;',
    '}': '&#125;',
    '\\': '&#92;',
    '%': '&#37;',
    '#': '&#35;',
    '+': '&#43;',
    '*': '&#42;',
    '?': '&#63;',
    '!': '&#33;',
    '@': '&#64;',
    $: '&#36;',
    '^': '&#94;',
    '|': '&#124;',
    '~': '&#126;',
};

/**
 * Basic HTML entity encoding
 */
export function encodeHtmlEntities(input: string, extended = false): string {
    if (typeof input !== 'string') {
        return '';
    }

    if (extended) {
        return input.replace(/[&<>"'/`=\n\r\t()[\]{}\\%#+*?!@$^|~]/g, match => {
            return EXTENDED_HTML_ENTITIES[match] || match;
        });
    } else {
        return input.replace(/[&<>"'/`=\n\r\t]/g, match => {
            return HTML_ENTITIES[match] || match;
        });
    }
}

/**
 * Remove dangerous URL schemes
 */
export function sanitizeUrl(url: string): string {
    if (typeof url !== 'string') {
        return '';
    }

    const trimmedUrl = url.trim().toLowerCase();

    // Check for dangerous schemes
    for (const scheme of DANGEROUS_SCHEMES) {
        if (trimmedUrl.startsWith(scheme)) {
            return '';
        }
    }

    // Additional checks for encoded schemes
    const decodedUrl = decodeURIComponent(trimmedUrl);
    for (const scheme of DANGEROUS_SCHEMES) {
        if (decodedUrl.startsWith(scheme)) {
            return '';
        }
    }

    return url;
}

/**
 * Remove event handlers from HTML attributes
 */
export function removeEventHandlers(input: string): string {
    if (typeof input !== 'string') {
        return '';
    }

    let sanitized = input;

    // Remove event handlers (case-insensitive)
    for (const handler of EVENT_HANDLERS) {
        const regex = new RegExp(`\\s*${handler}\\s*=\\s*[^\\s>]*`, 'gi');
        sanitized = sanitized.replace(regex, '');
    }

    // Remove javascript: URLs in attributes - more comprehensive
    sanitized = sanitized.replace(/javascript\s*:[^"'>]*/gi, '');
    sanitized = sanitized.replace(/href\s*=\s*["']javascript:[^"']*["']/gi, 'href=""');

    // Remove data: URLs that might contain scripts
    sanitized = sanitized.replace(/data\s*:[^;]*;[^,]*,/gi, '');

    // Remove javascript: from CSS url() functions
    sanitized = sanitized.replace(/url\s*\(\s*javascript:[^)]*\)/gi, 'url()');

    return sanitized;
}

/**
 * Multi-pass sanitization to catch nested attacks
 */
export function multiPassSanitize(input: string, passes = 5): string {
    if (typeof input !== 'string') {
        return '';
    }

    let sanitized = input;

    for (let i = 0; i < passes; i++) {
        const previous = sanitized;

        // Remove event handlers
        sanitized = removeEventHandlers(sanitized);

        // Remove script tags and their content - more comprehensive
        sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        sanitized = sanitized.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
        sanitized = sanitized.replace(/<script[^>]*>/gi, '');
        sanitized = sanitized.replace(/<\/script>/gi, '');

        // Remove style tags and their content - more comprehensive
        sanitized = sanitized.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');
        sanitized = sanitized.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
        sanitized = sanitized.replace(/<style[^>]*>/gi, '');
        sanitized = sanitized.replace(/<\/style>/gi, '');

        // Additional cleanup for any remaining CSS content that might have been left behind
        sanitized = sanitized.replace(/body\s*\{[^}]*\}/gi, '');
        sanitized = sanitized.replace(/[a-zA-Z-]+\s*:\s*url\([^)]*\)/gi, '');

        // Clean up any remaining broken CSS patterns
        sanitized = sanitized.replace(/\{[^}]*url\([^)]*\)[^}]*\}/gi, '');
        sanitized = sanitized.replace(/background\s*:\s*url\([^)]*\)/gi, '');

        // Remove iframe tags
        sanitized = sanitized.replace(/<iframe\b[^>]*>.*?<\/iframe>/gi, '');
        sanitized = sanitized.replace(/<iframe[^>]*>/gi, '');

        // Remove object and embed tags
        sanitized = sanitized.replace(/<(object|embed)\b[^>]*>.*?<\/\1>/gi, '');
        sanitized = sanitized.replace(/<(object|embed)[^>]*>/gi, '');

        // Remove form tags
        sanitized = sanitized.replace(/<form\b[^>]*>.*?<\/form>/gi, '');
        sanitized = sanitized.replace(/<form[^>]*>/gi, '');

        // Remove link tags that might load external resources
        sanitized = sanitized.replace(/<link\b[^>]*>/gi, '');

        // Remove meta tags
        sanitized = sanitized.replace(/<meta\b[^>]*>/gi, '');

        // Handle nested tags like <scr<script>ipt>
        sanitized = sanitized.replace(/<scr[^>]*ipt[^>]*>/gi, '');
        sanitized = sanitized.replace(/<\/scr[^>]*ipt>/gi, '');

        // If no changes were made, we can stop early
        if (sanitized === previous) {
            break;
        }
    }

    return sanitized;
}

/**
 * Basic XSS protection for simple text content
 */
export function sanitizeText(input: any, config: Partial<XSSProtectionConfig> = {}): string {
    if (input === null || input === undefined) {
        return '';
    }

    const finalConfig = { ...DEFAULT_CONFIG, ...config };
    let sanitized = String(input);

    // Length limit
    if (finalConfig.maxLength && sanitized.length > finalConfig.maxLength) {
        sanitized = sanitized.substring(0, finalConfig.maxLength);
    }

    // Multi-pass sanitization if enabled
    if (finalConfig.multiPass) {
        sanitized = multiPassSanitize(sanitized);
    }

    // Remove event handlers
    sanitized = removeEventHandlers(sanitized);

    // HTML entity encoding
    sanitized = encodeHtmlEntities(sanitized);

    return sanitized;
}

/**
 * Advanced XSS protection using DOMPurify for HTML content
 */
export function sanitizeHtml(input: string, config: Partial<XSSProtectionConfig> = {}): string {
    if (typeof input !== 'string') {
        return '';
    }

    const finalConfig = { ...DEFAULT_CONFIG, ...config };

    // Length limit
    let sanitized = input;
    if (finalConfig.maxLength && sanitized.length > finalConfig.maxLength) {
        sanitized = sanitized.substring(0, finalConfig.maxLength);
    }

    // Multi-pass sanitization before DOMPurify
    if (finalConfig.multiPass) {
        sanitized = multiPassSanitize(sanitized);
    }

    // Use DOMPurify for comprehensive HTML sanitization
    const domPurifyConfig = {
        ALLOWED_TAGS: finalConfig.allowedTags || [],
        ALLOWED_ATTR: finalConfig.allowedAttributes || [],
        ALLOW_DATA_ATTR: false,
        ALLOW_UNKNOWN_PROTOCOLS: false,
        ALLOWED_URI_REGEXP: finalConfig.allowedSchemes
            ? new RegExp(`^(?:${finalConfig.allowedSchemes.join('|')}):`, 'i')
            : /^(?:https?):$/i,
        SANITIZE_DOM: true,
        SANITIZE_NAMED_PROPS: true,
        KEEP_CONTENT: true,
        IN_PLACE: false,
        RETURN_DOM: false,
        RETURN_DOM_FRAGMENT: false,
        RETURN_TRUSTED_TYPE: false,
    };

    try {
        sanitized = DOMPurify.sanitize(sanitized, domPurifyConfig);
    } catch (error) {
        console.error('DOMPurify sanitization failed:', error);
        // Fallback to basic text sanitization
        sanitized = sanitizeText(input, config);
    }

    return sanitized;
}

/**
 * Sanitize parameter values for error messages (backward compatibility)
 */
export function sanitizeParameterValue(value: any): string {
    return sanitizeText(value, {
        maxLength: 1000,
        multiPass: true,
    });
}

/**
 * Sanitize URLs with comprehensive protection
 */
export function sanitizeUrlComprehensive(url: string): string {
    if (typeof url !== 'string') {
        return '';
    }

    // First pass - basic URL sanitization
    let sanitized = sanitizeUrl(url);

    // If URL was blocked, return empty string
    if (!sanitized) {
        return '';
    }

    // Additional sanitization for URL parameters
    try {
        const urlObj = new URL(sanitized);

        // Check each parameter
        urlObj.searchParams.forEach((value, key) => {
            const sanitizedValue = sanitizeText(value);
            urlObj.searchParams.set(key, sanitizedValue);
        });

        sanitized = urlObj.toString();
    } catch (error) {
        // If URL parsing fails, apply basic text sanitization
        sanitized = sanitizeText(url, { maxLength: 2000 });
    }

    return sanitized;
}

/**
 * Comprehensive XSS protection function that chooses the appropriate method
 */
export function sanitize(
    input: any,
    type: 'text' | 'html' | 'url' = 'text',
    config: Partial<XSSProtectionConfig> = {}
): string {
    switch (type) {
        case 'html':
            return sanitizeHtml(String(input), config);
        case 'url':
            return sanitizeUrlComprehensive(String(input));
        case 'text':
        default:
            return sanitizeText(input, config);
    }
}

/**
 * Validate that a string is safe after sanitization
 */
export function validateSanitization(original: string, sanitized: string): boolean {
    // Check if sanitization removed dangerous content
    const dangerousPatterns = [
        /<script/i,
        /javascript:/i,
        /on\w+\s*=/i,
        /<iframe/i,
        /<object/i,
        /<embed/i,
        /data:\s*text\/html/i,
        /vbscript:/i,
    ];

    // If original contained dangerous patterns but sanitized doesn't, it's good
    const originalHadDangerous = dangerousPatterns.some(pattern => pattern.test(original));
    const sanitizedHasDangerous = dangerousPatterns.some(pattern => pattern.test(sanitized));

    return !sanitizedHasDangerous && (originalHadDangerous || original === sanitized);
}

/**
 * Export default sanitization function for backward compatibility
 */
export default sanitizeText;
