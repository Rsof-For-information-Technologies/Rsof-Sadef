export function getDeviceType(): string {
    if (typeof window === 'undefined') {
        return 'unknown';
    }

    const userAgent = navigator.userAgent.toLowerCase();

    // Check for mobile devices
    if (/android/.test(userAgent)) {
        return 'android';
    }

    if (/iphone|ipad|ipod/.test(userAgent)) {
        return 'ios';
    }

    // Check for tablet
    if (/tablet|ipad/.test(userAgent) ||
        (navigator.maxTouchPoints && navigator.maxTouchPoints > 1 && /macintosh/.test(userAgent))) {
        return 'tablet';
    }

    // Check for mobile
    if (/mobile/.test(userAgent)) {
        return 'mobile';
    }

    // Default to desktop
    return 'desktop';
}

export function isMobileDevice(): boolean {
    const deviceType = getDeviceType();
    return ['android', 'ios', 'mobile'].includes(deviceType);
}
