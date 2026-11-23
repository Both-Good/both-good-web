document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.image-stack').forEach(stack => {
      const back  = stack.querySelector('.image.back img');   // optional (single-image widgets have none)
      const front = stack.querySelector('.image.front img');
      if (!front) return;

      front.addEventListener('mouseenter', () => {
        front.style.transform = back ? 'scale(1.1)' : 'scale(1.05)';
        if (back) back.style.transform = 'scale(1.05)';
      });
      front.addEventListener('mouseleave', () => {
        front.style.transform = 'scale(1)';
        if (back) back.style.transform = 'scale(1)';
      });
    });
  });
