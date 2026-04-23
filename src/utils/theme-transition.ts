// Enable smooth transitions after page load
export function enableThemeTransitions() {
  // Add 'loaded' class to html element after page load
  if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
      document.documentElement.classList.add('loaded');
    });
  }
}

// Call the function to enable transitions
enableThemeTransitions();
