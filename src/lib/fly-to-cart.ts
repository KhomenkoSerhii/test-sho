"use client";

/**
 * Animates a clone of the product image from its on-screen position into the
 * cart icon in the header, on an arcing path. Pure DOM + Web Animations API —
 * no extra dependencies, and a no-op when reduced motion is requested.
 */
export function flyToCart(sourceEl: HTMLElement | null, imageSrc: string) {
  if (typeof window === "undefined" || !sourceEl) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const target = document.getElementById("cart-fly-target");
  if (!target) return;

  const from = sourceEl.getBoundingClientRect();
  const to = target.getBoundingClientRect();

  const size = Math.min(from.width, 120);
  const clone = document.createElement("img");
  clone.src = imageSrc;
  clone.className = "fly-clone";
  clone.style.width = `${size}px`;
  clone.style.height = `${size}px`;
  clone.style.left = `${from.left + from.width / 2 - size / 2}px`;
  clone.style.top = `${from.top + from.height / 2 - size / 2}px`;
  document.body.appendChild(clone);

  const dx = to.left + to.width / 2 - (from.left + from.width / 2);
  const dy = to.top + to.height / 2 - (from.top + from.height / 2);

  const animation = clone.animate(
    [
      { transform: "translate(0, 0) scale(1)", opacity: 1, offset: 0 },
      {
        transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 80}px) scale(0.7)`,
        opacity: 0.95,
        offset: 0.6,
      },
      {
        transform: `translate(${dx}px, ${dy}px) scale(0.15)`,
        opacity: 0.2,
        offset: 1,
      },
    ],
    {
      duration: 750,
      easing: "cubic-bezier(0.5, 0, 0.75, 0.4)",
      fill: "forwards",
    }
  );

  animation.onfinish = () => clone.remove();
  animation.oncancel = () => clone.remove();
}
