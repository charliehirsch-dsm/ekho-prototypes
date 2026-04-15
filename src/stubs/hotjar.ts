/**
 * Hotjar stub: no-op replacement for @hotjar/browser.
 * Buyer Portal inits Hotjar for session recording.
 */

export function init(): void {}
export function identify(): void {}
export function event(): void {}
export function stateChange(): void {}
export default { init, identify, event, stateChange };
