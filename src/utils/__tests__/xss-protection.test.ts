/**
 * Comprehensive XSS Protection Test Suite
 *
 * Tests all XSS protection functions against various attack vectors
 */

import {
    encodeHtmlEntities,
    multiPassSanitize,
    removeEventHandlers,
    sanitize,
    sanitizeHtml,
    sanitizeParameterValue,
    sanitizeText,
    sanitizeUrl,
    sanitizeUrlComprehensive,
    validateSanitization,
} from '../xss-protection';

describe('XSS Protection', () => {
    describe('encodeHtmlEntities', () => {
        it('should encode basic HTML entities', () => {
            expect(encodeHtmlEntities('<script>alert("xss")</script>')).toBe(
                '&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;'
            );
        });

        it('should encode extended entities when requested', () => {
            expect(encodeHtmlEntities('test()', true)).toBe('test&#40;&#41;');
        });

        it('should handle empty and null inputs', () => {
            expect(encodeHtmlEntities('')).toBe('');
            expect(encodeHtmlEntities(null as any)).toBe('');
            expect(encodeHtmlEntities(undefined as any)).toBe('');
        });

        it('should encode special characters', () => {
            expect(encodeHtmlEntities('&<>"\'`=\n\r\t')).toBe('&amp;&lt;&gt;&quot;&#x27;&#x60;&#x3D;&#10;&#13;&#9;');
        });
    });

    describe('sanitizeUrl', () => {
        it('should allow safe URLs', () => {
            expect(sanitizeUrl('https://example.com')).toBe('https://example.com');
            expect(sanitizeUrl('http://test.com/path?param=value')).toBe('http://test.com/path?param=value');
        });

        it('should block dangerous schemes', () => {
            expect(sanitizeUrl('javascript:alert("xss")')).toBe('');
            expect(sanitizeUrl('data:text/html,<script>alert("xss")</script>')).toBe('');
            expect(sanitizeUrl('vbscript:msgbox("xss")')).toBe('');
            expect(sanitizeUrl('file:///etc/passwd')).toBe('');
        });

        it('should block encoded dangerous schemes', () => {
            expect(sanitizeUrl('java%73cript:alert("xss")')).toBe('');
            expect(sanitizeUrl('JAVASCRIPT:alert("xss")')).toBe('');
        });

        it('should handle empty and invalid inputs', () => {
            expect(sanitizeUrl('')).toBe('');
            expect(sanitizeUrl(null as any)).toBe('');
            expect(sanitizeUrl(undefined as any)).toBe('');
        });
    });

    describe('removeEventHandlers', () => {
        it('should remove onclick handlers', () => {
            expect(removeEventHandlers('<div onclick="alert(1)">test</div>')).toBe('<div>test</div>');
        });

        it('should remove multiple event handlers', () => {
            const input = '<div onclick="alert(1)" onmouseover="alert(2)" onload="alert(3)">test</div>';
            const result = removeEventHandlers(input);
            expect(result).not.toContain('onclick');
            expect(result).not.toContain('onmouseover');
            expect(result).not.toContain('onload');
        });

        it('should remove javascript: URLs', () => {
            expect(removeEventHandlers('<a href="javascript:alert(1)">link</a>')).toBe('<a href="">link</a>');
        });

        it('should remove data: URLs with scripts', () => {
            const input = '<img src="data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==">';
            const result = removeEventHandlers(input);
            expect(result).not.toContain('data:');
        });

        it('should handle case-insensitive event handlers', () => {
            expect(removeEventHandlers('<div ONCLICK="alert(1)">test</div>')).toBe('<div>test</div>');
            expect(removeEventHandlers('<div OnClick="alert(1)">test</div>')).toBe('<div>test</div>');
        });
    });

    describe('multiPassSanitize', () => {
        it('should remove script tags', () => {
            expect(multiPassSanitize('<script>alert("xss")</script>')).toBe('');
        });

        it('should remove nested script tags', () => {
            expect(multiPassSanitize('<script><script>alert("xss")</script></script>')).toBe('');
        });

        it('should remove style tags', () => {
            const result = multiPassSanitize('<style>body{background:url(javascript:alert(1))}</style>');
            // Should remove the dangerous javascript: part and style tags
            expect(result).not.toContain('<style>');
            expect(result).not.toContain('</style>');
            expect(result).not.toContain('javascript:');
            expect(result).not.toContain('alert');
        });

        it('should remove iframe tags', () => {
            expect(multiPassSanitize('<iframe src="javascript:alert(1)"></iframe>')).toBe('');
        });

        it('should remove object and embed tags', () => {
            expect(multiPassSanitize('<object data="javascript:alert(1)"></object>')).toBe('');
            expect(multiPassSanitize('<embed src="javascript:alert(1)"></embed>')).toBe('');
        });

        it('should remove form tags', () => {
            expect(multiPassSanitize('<form action="javascript:alert(1)"><input></form>')).toBe('');
        });

        it('should handle multiple passes for complex attacks', () => {
            const complexAttack = '<scr<script>ipt>alert("xss")</scr</script>ipt>';
            expect(multiPassSanitize(complexAttack)).toBe('');
        });
    });

    describe('sanitizeText', () => {
        it('should sanitize basic XSS attempts', () => {
            const result = sanitizeText('<script>alert("xss")</script>');
            expect(result).not.toContain('<script>');
            expect(result).not.toContain('alert');
        });

        it('should handle null and undefined inputs', () => {
            expect(sanitizeText(null)).toBe('');
            expect(sanitizeText(undefined)).toBe('');
        });

        it('should convert non-string inputs to strings', () => {
            expect(sanitizeText(123)).toBe('123');
            expect(sanitizeText(true)).toBe('true');
        });

        it('should respect length limits', () => {
            const longString = 'a'.repeat(2000);
            const result = sanitizeText(longString, { maxLength: 100 });
            expect(result.length).toBeLessThanOrEqual(100);
        });

        it('should handle complex XSS payloads', () => {
            const payloads = [
                '<img src=x onerror=alert(1)>',
                '<svg onload=alert(1)>',
                '<iframe src="javascript:alert(1)">',
                '<object data="data:text/html,<script>alert(1)</script>">',
                '<link rel=stylesheet href="javascript:alert(1)">',
                '<meta http-equiv=refresh content="0;url=javascript:alert(1)">',
            ];

            payloads.forEach(payload => {
                const result = sanitizeText(payload);
                expect(result).not.toContain('alert');
                expect(result).not.toContain('javascript:');
                expect(result).not.toContain('onerror');
                expect(result).not.toContain('onload');
            });
        });
    });

    describe('sanitizeHtml', () => {
        it('should use DOMPurify for HTML sanitization', () => {
            const result = sanitizeHtml('<p>Safe content</p><script>alert("xss")</script>');
            expect(result).toContain('Safe content');
            expect(result).not.toContain('<script>');
            expect(result).not.toContain('alert');
        });

        it('should respect allowed tags configuration', () => {
            const result = sanitizeHtml('<p>Paragraph</p><div>Div</div>', {
                allowedTags: ['p'],
            });
            expect(result).toContain('<p>');
            expect(result).not.toContain('<div>');
        });

        it('should handle malformed HTML', () => {
            const malformed = '<p><div><span>unclosed tags';
            const result = sanitizeHtml(malformed);
            expect(result).toBeDefined();
            expect(typeof result).toBe('string');
        });

        it.todo('should fallback to text sanitization on DOMPurify failure - needs proper DOMPurify mocking');
    });

    describe('sanitizeUrlComprehensive', () => {
        it('should sanitize URL parameters', () => {
            const result = sanitizeUrlComprehensive('https://example.com?param=<script>alert(1)</script>');
            expect(result).toContain('https://example.com');
            expect(result).not.toContain('<script>');
        });

        it('should handle invalid URLs gracefully', () => {
            const result = sanitizeUrlComprehensive('not-a-url');
            expect(result).toBeDefined();
            expect(typeof result).toBe('string');
        });

        it('should block dangerous schemes in comprehensive mode', () => {
            expect(sanitizeUrlComprehensive('javascript:alert(1)')).toBe('');
            expect(sanitizeUrlComprehensive('data:text/html,<script>alert(1)</script>')).toBe('');
        });
    });

    describe('sanitizeParameterValue', () => {
        it('should be backward compatible', () => {
            const result = sanitizeParameterValue('<script>alert("xss")</script>');
            expect(result).not.toContain('<script>');
            expect(result).not.toContain('alert');
        });

        it('should handle various input types', () => {
            expect(sanitizeParameterValue(null)).toBe('');
            expect(sanitizeParameterValue(undefined)).toBe('');
            expect(sanitizeParameterValue(123)).toBe('123');
            expect(sanitizeParameterValue(true)).toBe('true');
        });

        it('should respect length limits', () => {
            const longString = 'a'.repeat(2000);
            const result = sanitizeParameterValue(longString);
            expect(result.length).toBeLessThanOrEqual(1000);
        });
    });

    describe('validateSanitization', () => {
        it('should validate successful sanitization', () => {
            const original = '<script>alert("xss")</script>';
            const sanitized = '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;';
            expect(validateSanitization(original, sanitized)).toBe(true);
        });

        it('should detect failed sanitization', () => {
            const original = '<script>alert("xss")</script>';
            const sanitized = '<script>alert("xss")</script>'; // Not sanitized
            expect(validateSanitization(original, sanitized)).toBe(false);
        });

        it('should handle safe content', () => {
            const original = 'Safe content';
            const sanitized = 'Safe content';
            expect(validateSanitization(original, sanitized)).toBe(true);
        });
    });

    describe('sanitize (main function)', () => {
        it('should route to correct sanitization method', () => {
            expect(sanitize('<script>alert(1)</script>', 'text')).not.toContain('<script>');
            expect(sanitize('<p>test</p>', 'html')).toBeDefined();
            expect(sanitize('javascript:alert(1)', 'url')).toBe('');
        });

        it('should default to text sanitization', () => {
            const result = sanitize('<script>alert(1)</script>');
            expect(result).not.toContain('<script>');
        });
    });

    describe('Edge Cases and Attack Vectors', () => {
        it('should handle Unicode attacks', () => {
            const unicodeAttack = '\u003cscript\u003ealert(1)\u003c/script\u003e';
            const result = sanitizeText(unicodeAttack);
            expect(result).not.toContain('script');
            expect(result).not.toContain('alert');
        });

        it('should handle HTML entity attacks', () => {
            const entityAttack = '&#60;script&#62;alert(1)&#60;/script&#62;';
            const result = sanitizeText(entityAttack);
            // The entities should be double-encoded for safety
            expect(result).toContain('&amp;#60;');
            expect(result).not.toContain('<script>');
        });

        it('should handle mixed case attacks', () => {
            const mixedCaseAttack = '<ScRiPt>AlErT(1)</ScRiPt>';
            const result = sanitizeText(mixedCaseAttack);
            expect(result).not.toContain('ScRiPt');
            expect(result).not.toContain('AlErT');
        });

        it('should handle nested tag attacks', () => {
            const nestedAttack = '<scr<script>ipt>alert(1)</scr</script>ipt>';
            const result = sanitizeText(nestedAttack);
            expect(result).not.toContain('script');
            expect(result).not.toContain('alert');
        });

        it('should handle attribute-based attacks', () => {
            const attributeAttacks = [
                '<img src="x" onerror="alert(1)">',
                '<div style="background:url(javascript:alert(1))">',
                '<a href="javascript:alert(1)">click</a>',
                '<form action="javascript:alert(1)">',
            ];

            attributeAttacks.forEach(attack => {
                const result = sanitizeText(attack);
                expect(result).not.toContain('javascript:');
                expect(result).not.toContain('alert');
                expect(result).not.toContain('onerror');
            });
        });

        it('should handle CSS-based attacks', () => {
            const cssAttack = '<style>@import "javascript:alert(1)";</style>';
            const result = sanitizeText(cssAttack);
            expect(result).not.toContain('javascript:');
            expect(result).not.toContain('alert');
        });

        it('should handle SVG-based attacks', () => {
            const svgAttack = '<svg><script>alert(1)</script></svg>';
            const result = sanitizeText(svgAttack);
            expect(result).not.toContain('script');
            expect(result).not.toContain('alert');
        });

        it('should handle data URI attacks', () => {
            const dataUriAttack = '<iframe src="data:text/html,<script>alert(1)</script>"></iframe>';
            const result = sanitizeText(dataUriAttack);
            expect(result).not.toContain('data:');
            expect(result).not.toContain('script');
        });

        it('should handle very long inputs', () => {
            const veryLongAttack = '<script>alert(1)</script>'.repeat(1000);
            const result = sanitizeText(veryLongAttack, { maxLength: 500 });
            expect(result.length).toBeLessThanOrEqual(500);
            expect(result).not.toContain('script');
        });

        it('should handle null bytes and control characters', () => {
            const controlCharAttack = '<script\x00>alert(1)</script>';
            const result = sanitizeText(controlCharAttack);
            expect(result).not.toContain('script');
        });
    });

    describe('Performance Tests', () => {
        it('should handle large inputs efficiently', () => {
            const largeInput = 'safe text '.repeat(10000);
            const startTime = Date.now();
            const result = sanitizeText(largeInput);
            const endTime = Date.now();

            expect(result).toBeDefined();
            expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
        });

        it('should handle multiple sanitization calls efficiently', () => {
            const inputs = Array(100).fill('<script>alert(1)</script>');
            const startTime = Date.now();

            inputs.forEach(input => sanitizeText(input));

            const endTime = Date.now();
            expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
        });
    });
});
