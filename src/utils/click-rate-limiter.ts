/**
 * Global click throttler to prevent Safari freezing issues
 * This utility uses throttling instead of debouncing for better Safari performance
 */

class ClickThrottler {
    private static instance: ClickThrottler;
    private lastClickTime = 0;
    private readonly throttleDelay = 500; // 500ms throttle for Safari protection

    private constructor() {}

    public static getInstance(): ClickThrottler {
        if (!ClickThrottler.instance) {
            ClickThrottler.instance = new ClickThrottler();
        }
        return ClickThrottler.instance;
    }

    public canClick(): boolean {
        const now = Date.now();

        // Check if enough time has passed since last click
        if (now - this.lastClickTime < this.throttleDelay) {
            return false;
        }

        // Update last click time
        this.lastClickTime = now;
        return true;
    }

    public reset(): void {
        this.lastClickTime = 0;
    }
}

export const clickRateLimiter = ClickThrottler.getInstance();
