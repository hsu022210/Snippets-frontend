export const unfocusActiveElement = () => {
  if (document.activeElement instanceof HTMLElement) {
    // Use setTimeout to ensure blur happens after Safari's focus handling
    setTimeout(() => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }, 0);
  }
}; 