'use client';

/**
 * Magic UI Motion Engine
 * Handles Fly-to-Cart parabolic animation, sparkle burst particles,
 * cart bump elastic bounce, and Sonner-style floating toast notifications.
 */

export interface MagicToastItem {
  id: string;
  title: string;
  desc: string;
  emoji: string;
  actionText?: string;
  onAction?: () => void;
}

type ToastListener = (toast: MagicToastItem) => void;
const toastListeners = new Set<ToastListener>();

export function subscribeMagicToast(listener: ToastListener) {
  toastListeners.add(listener);
  return () => {
    toastListeners.delete(listener);
  };
}

export function showMagicToast(
  title: string,
  desc: string,
  emoji = '🌸',
  actionText?: string,
  onAction?: () => void
) {
  const item: MagicToastItem = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title,
    desc,
    emoji,
    actionText,
    onAction,
  };

  toastListeners.forEach((listener) => {
    try {
      listener(item);
    } catch (e) {
      console.error('Toast listener error:', e);
    }
  });
}

/**
 * Spawns 8 radial particle sparkles around (x, y) coordinates
 */
export function spawnSparkles(x: number, y: number) {
  if (typeof document === 'undefined') return;

  const sparkles = ['🌸', '✨', '💖', '🌷', '✨', '💐', '⭐', '🌸'];
  for (let i = 0; i < 8; i++) {
    const p = document.createElement('div');
    p.className = 'magic-sparkle';
    p.textContent = sparkles[i % sparkles.length];
    p.style.left = `${x}px`;
    p.style.top = `${y}px`;

    const angle = (i / 8) * Math.PI * 2;
    const dist = 35 + Math.random() * 25;
    p.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
    p.style.setProperty('--ty', `${Math.sin(angle) * dist}px`);

    document.body.appendChild(p);
    setTimeout(() => {
      p.remove();
    }, 600);
  }
}

/**
 * Parabolic flight from clicked source element directly to the navbar cart button
 */
export function flyToCart(sourceElement: HTMLElement | null, emoji = '🌸') {
  if (typeof document === 'undefined' || !sourceElement) return;

  const cartBtn = document.querySelector('.btn-nav-cart') || document.getElementById('navCartBtn');
  if (!cartBtn) return;

  const startRect = sourceElement.getBoundingClientRect();
  const endRect = cartBtn.getBoundingClientRect();

  const flyer = document.createElement('div');
  flyer.className = 'magic-flyer';
  flyer.textContent = emoji;
  flyer.style.left = `${startRect.left + startRect.width / 2 - 24}px`;
  flyer.style.top = `${startRect.top + startRect.height / 2 - 24}px`;
  document.body.appendChild(flyer);

  // Force reflow
  flyer.getBoundingClientRect();

  const destX = endRect.left + endRect.width / 2 - 24;
  const destY = endRect.top + endRect.height / 2 - 24;

  flyer.style.left = `${destX}px`;
  flyer.style.top = `${destY}px`;
  flyer.style.transform = 'scale(0.35) rotate(360deg)';
  flyer.style.opacity = '0.7';

  setTimeout(() => {
    flyer.remove();

    // Trigger cart bump animation
    window.dispatchEvent(new CustomEvent('cart-bump'));
    cartBtn.classList.add('cart-bump');
    setTimeout(() => {
      cartBtn.classList.remove('cart-bump');
    }, 450);

    // Spawn 8 radial sparkle bursts at destination cart button center
    spawnSparkles(endRect.left + endRect.width / 2, endRect.top + endRect.height / 2);
  }, 750);
}
