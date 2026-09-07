<template>
  <aside
    class="promo-banner"
    aria-labelledby="promo-title"
  >
    <div class="promo-banner__content">
      <p class="promo-banner__eyebrow">
        Спецпропозиція
      </p>

      <h2
        id="promo-title"
      >
        Знижка −20% на перше замовлення
      </h2>

      <a
        class="promo-banner__action"
        href="#categories"
      >
        Обрати роли
      </a>
    </div>

    <img
      class="promo-banner__decoration"
      src="/images/brand/brand-logo.png"
      alt=""
      aria-hidden="true"
    >
  </aside>
</template>

<style scoped>
.promo-banner {
  position: relative;
  isolation: isolate;
  overflow: hidden;

  min-height: 172px;
  padding: 20px;

  color: white;
  background: linear-gradient(135deg, #ff8a6f 0%, var(--color-primary) 58%, #f35d42 100%);
  border-radius: var(--radius-large);
  box-shadow: 0 12px 30px rgb(255 116 87 / 24%);
}

.promo-banner::after {
  content: '';
  position: absolute;
  right: -50px;
  bottom: -72px;
  z-index: -1;

  width: 190px;
  height: 190px;

  background: rgb(255 255 255 / 9%);
  border-radius: 50%;
}

.promo-banner__content {
  position: relative;
  z-index: 1;
  max-width: 245px;
}

.promo-banner__eyebrow {
  margin-bottom: 8px;

  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  line-height: 1.2;
  text-transform: uppercase;
}

.promo-banner h2 {
  max-width: 230px;

  font-size: 24px;
  line-height: 1.12;
}

.promo-banner__action {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  min-height: 38px;
  margin-top: 16px;
  padding: 0 16px;

  color: var(--color-primary);
  font-size: 13px;
  font-weight: 700;

  background: white;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgb(125 36 20 / 14%);

  transition:
    box-shadow var(--transition-fast),
    transform var(--transition-fast);
}

.promo-banner__action:hover {
  box-shadow: 0 8px 22px rgb(125 36 20 / 20%);
  transform: translateY(-1px);
}

.promo-banner__action:focus-visible {
  outline: 3px solid rgb(255 255 255 / 55%);
  outline-offset: 3px;
}

.promo-banner__decoration {
  position: absolute;
  right: -34px;
  bottom: -42px;

  width: 155px;
  height: 155px;

  object-fit: contain;
  opacity: 0.14;
  filter: brightness(0) invert(1);
  transform: rotate(-12deg);
}

@media (prefers-reduced-motion: reduce) {
  .promo-banner__action {
    transition: none;
  }
}
</style>
