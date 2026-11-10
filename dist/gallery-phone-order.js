// Swap only these two gallery cards on phones; keep tablet and desktop order.
(() => {
  const cards = [...document.querySelectorAll('.gallery-grid figure')];
  const sweet = cards.find(card => card.querySelector('figcaption')?.textContent.trim() === 'Something Sweet');
  const toast = cards.find(card => card.querySelector('figcaption')?.textContent.trim() === 'A Colorful Toast');
  if (!sweet || !toast || sweet.parentNode !== toast.parentNode) return;
  const sweetPosition = document.createComment('Something Sweet original position');
  const toastPosition = document.createComment('A Colorful Toast original position');
  sweet.before(sweetPosition);
  toast.before(toastPosition);
  const phone = window.matchMedia('(max-width: 600px)');
  const updateOrder = () => {
    sweetPosition.after(phone.matches ? toast : sweet);
    toastPosition.after(phone.matches ? sweet : toast);
  };
  updateOrder();
  phone.addEventListener('change', updateOrder);
})();
