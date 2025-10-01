/**
 * Utility functions for safe DOM manipulation
 */

/**
 * Safely adds an event listener to an element, checking if the element exists first
 * @param elementId - The ID of the element
 * @param event - The event type
 * @param handler - The event handler function
 * @param options - Event listener options
 */
export function safeAddEventListener<K extends keyof HTMLElementEventMap>(
  elementId: string,
  event: K,
  handler: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions
): void {
  const element = document.getElementById(elementId);
  if (element) {
    element.addEventListener(event, handler, options);
  } else {
    console.warn(`Element with ID '${elementId}' not found when trying to add ${event} event listener`);
  }
}

/**
 * Safely adds an event listener to an element by selector
 * @param selector - The CSS selector
 * @param event - The event type
 * @param handler - The event handler function
 * @param options - Event listener options
 */
export function safeAddEventListenerBySelector<K extends keyof HTMLElementEventMap>(
  selector: string,
  event: K,
  handler: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions
): void {
  const element = document.querySelector(selector) as HTMLElement;
  if (element) {
    element.addEventListener(event, handler, options);
  } else {
    console.warn(`Element with selector '${selector}' not found when trying to add ${event} event listener`);
  }
}

/**
 * Safely gets an element by ID with type checking
 * @param elementId - The ID of the element
 * @returns The element or null if not found
 */
export function safeGetElementById<T extends HTMLElement = HTMLElement>(elementId: string): T | null {
  const element = document.getElementById(elementId);
  if (!element) {
    console.warn(`Element with ID '${elementId}' not found`);
    return null;
  }
  return element as T;
}

/**
 * Waits for DOM to be ready and then executes callback
 * @param callback - Function to execute when DOM is ready
 */
export function onDOMReady(callback: () => void): void {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback);
  } else {
    callback();
  }
}