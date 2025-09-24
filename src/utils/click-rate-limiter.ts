/**
 * Global click rate limiter to prevent Safari freezing issues
 * This utility helps prevent rapid successive clicks that can overwhelm the browser
 */

class ClickRateLimiter {
    private static instance: ClickRateLimiter;
    private clickTimestamps: number[] = [];
    private readonly maxClicksPerSecond = 2; // Further reduced to 2 clicks per second for stronger Safari protection
    private readonly timeWindow = 1000; // 1 second

    private constructor() {}

    public static getInstance(): ClickRateLimiter {
        if (!ClickRateLimiter.instance) {
            ClickRateLimiter.instance = new ClickRateLimiter();
        }
        return ClickRateLimiter.instance;
    }

    public canClick(): boolean {
        const now = Date.now();

        // Remove timestamps older than the time window
        this.clickTimestamps = this.clickTimestamps.filter(timestamp => now - timestamp < this.timeWindow);

        // Check if we've exceeded the rate limit
        if (this.clickTimestamps.length >= this.maxClicksPerSecond) {
            return false;
        }

        // Record this click
        this.clickTimestamps.push(now);
        return true;
    }

    public reset(): void {
        this.clickTimestamps = [];
    }
}

export const clickRateLimiter = ClickRateLimiter.getInstance();
