export const dispatchNotification = (message: string) => {
  const event = new CustomEvent('pos-notification', { detail: message });
  window.dispatchEvent(event);
};
