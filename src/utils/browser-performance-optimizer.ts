/**
 * Browser-specific performance optimizations
 * Safari and Firefox have unique performance characteristics that require special handling
 */

class BrowserPerformanceOptimizer {
    private static instance: BrowserPerformanceOptimizer;
    private isSafari: boolean;
    private isFirefox: boolean;
    private needsOptimization: boolean;
    private pendingOperations: Set<string> = new Set();
    private operationQueue: Array<() => void> = [];
    private isProcessingQueue = false;

    private constructor() {
        // Detect browsers that need performance optimizations
        this.isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        this.isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
        this.needsOptimization = this.isSafari || this.isFirefox;
    }

    public static getInstance(): BrowserPerformanceOptimizer {
        if (!BrowserPerformanceOptimizer.instance) {
            BrowserPerformanceOptimizer.instance = new BrowserPerformanceOptimizer();
        }
        return BrowserPerformanceOptimizer.instance;
    }

    public isSafariBrowser(): boolean {
        return this.isSafari;
    }

    public isFirefoxBrowser(): boolean {
        return this.isFirefox;
    }

    public needsPerformanceOptimization(): boolean {
        return this.needsOptimization;
    }

    /**
     * Browser-specific operation queuing to prevent overwhelming Safari/Firefox
     */
    public queueOperation(operationId: string, operation: () => void): void {
        if (!this.needsOptimization) {
            // For Chrome and other optimized browsers, execute immediately
            operation();
            return;
        }

        // Prevent duplicate operations
        if (this.pendingOperations.has(operationId)) {
            return;
        }

        this.pendingOperations.add(operationId);
        this.operationQueue.push(() => {
            try {
                operation();
            } finally {
                this.pendingOperations.delete(operationId);
            }
        });

        this.processQueue();
    }

    /**
     * Process operations with browser-friendly timing
     */
    private processQueue(): void {
        if (this.isProcessingQueue || this.operationQueue.length === 0) {
            return;
        }

        this.isProcessingQueue = true;

        const processNext = () => {
            if (this.operationQueue.length === 0) {
                this.isProcessingQueue = false;
                return;
            }

            const operation = this.operationQueue.shift();
            if (operation) {
                operation();
            }

            // Browser-specific delays: Safari needs moderate, Firefox needs slight
            let delay = 16; // Default for Chrome
            if (this.isSafari) {
                delay = 25; // Reduced delay for Safari (was 50ms)
            } else if (this.isFirefox) {
                delay = 20; // Reduced delay for Firefox (was 30ms)
            }

            setTimeout(processNext, delay);
        };

        // Start processing with initial delay for problematic browsers
        let initialDelay = 0;
        if (this.isSafari) {
            initialDelay = 50; // Reduced initial delay for Safari (was 100ms)
        } else if (this.isFirefox) {
            initialDelay = 25; // Reduced initial delay for Firefox (was 50ms)
        }

        setTimeout(processNext, initialDelay);
    }

    /**
     * Browser-specific DOM operation wrapper
     */
    public safeDOMOperation(operation: () => void): void {
        if (!this.needsOptimization) {
            operation();
            return;
        }

        // For Safari and Firefox, wrap DOM operations in requestAnimationFrame with minimal delays
        requestAnimationFrame(() => {
            const delay = this.isSafari ? 5 : this.isFirefox ? 2 : 0; // Reduced delays
            setTimeout(operation, delay);
        });
    }

    /**
     * Clear all pending operations (useful for cleanup)
     */
    public clearPendingOperations(): void {
        this.operationQueue = [];
        this.pendingOperations.clear();
        this.isProcessingQueue = false;
    }

    /**
     * Get browser-appropriate debounce delay
     */
    public getDebounceDelay(): number {
        if (this.isSafari) {
            return 400; // Reduced delay for Safari (was 750ms)
        } else if (this.isFirefox) {
            return 250; // Reduced delay for Firefox (was 500ms)
        }
        return 200; // Reduced default for Chrome and others (was 300ms)
    }

    /**
     * Get browser-appropriate throttle delay
     */
    public getThrottleDelay(): number {
        if (this.isSafari) {
            return 50; // Reduced throttle for Safari (was 100ms)
        } else if (this.isFirefox) {
            return 25; // Reduced throttle for Firefox (was 50ms)
        }
        return 16; // Default for Chrome and others (~60fps)
    }
}

export const browserOptimizer = BrowserPerformanceOptimizer.getInstance();
// Maintain backward compatibility
export const safariOptimizer = browserOptimizer;
