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
 * Returns a Promise and accepts an optional onComplete callback so other UI elements (like Cart Drawer)
 * wait until the flight animation and sparkle burst finish before opening.
 */
export function flyToCart(
  sourceElement: HTMLElement | null,
  emoji = '🌸',
  onComplete?: () => void
): Promise<void> {
  return new Promise((resolve) => {
    if (typeof document === 'undefined') {
      onComplete?.();
      resolve();
      return;
    }

    const cartBtn = document.querySelector('.btn-nav-cart') || document.getElementById('navCartBtn');
    if (!cartBtn) {
      onComplete?.();
      resolve();
      return;
    }

    // Determine starting position: fallback to center of screen if sourceElement rect unavailable
    let startX = window.innerWidth / 2;
    let startY = window.innerHeight / 2;
    if (sourceElement) {
      const startRect = sourceElement.getBoundingClientRect();
      if (startRect.width > 0 && startRect.height > 0) {
        startX = startRect.left + startRect.width / 2;
        startY = startRect.top + startRect.height / 2;
      }
    }

    const endRect = cartBtn.getBoundingClientRect();
    const destX = endRect.left + (endRect.width || 40) / 2;
    const destY = endRect.top + (endRect.height || 40) / 2;

    const flyer = document.createElement('div');
    flyer.className = 'magic-flyer';
    flyer.textContent = emoji;
    flyer.style.position = 'fixed';
    flyer.style.zIndex = '999999';
    flyer.style.left = `${startX - 24}px`;
    flyer.style.top = `${startY - 24}px`;
    flyer.style.transform = 'scale(1) rotate(0deg)';
    flyer.style.opacity = '1';
    flyer.style.transition = 'none';
    document.body.appendChild(flyer);

    // Two animation frames guarantee initial position paint before transitioning to destination
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        flyer.style.transition = 'all 0.8s cubic-bezier(0.2, 0.9, 0.25, 1)';
        flyer.style.left = `${destX - 24}px`;
        flyer.style.top = `${destY - 24}px`;
        flyer.style.transform = 'scale(0.35) rotate(360deg)';
        flyer.style.opacity = '0.85';
      });
    });

    setTimeout(() => {
      flyer.remove();

      // Trigger cart bump bounce animation on navbar cart
      window.dispatchEvent(new CustomEvent('cart-bump'));
      cartBtn.classList.add('cart-bump');
      setTimeout(() => {
        cartBtn.classList.remove('cart-bump');
      }, 450);

      // Spawn 8 radial sparkle bursts at destination cart button center
      spawnSparkles(destX, destY);

      // Trigger onComplete callback AFTER the animation is 100% finished
      setTimeout(() => {
        onComplete?.();
        resolve();
      }, 50);
    }, 800);
  });
}

