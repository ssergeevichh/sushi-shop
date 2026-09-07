<template>
  <section
    class="hero-banner"
    aria-labelledby="hero-title"
  >
    <img
      class="hero-banner__image"
      src="/images/categories/all.webp"
      alt=""
      width="512"
      height="512"
      fetchpriority="high"
    >

    <div class="hero-banner__content">
      <p class="hero-banner__eyebrow">
        ROLLIN’ delivery
      </p>

      <h1
        id="hero-title"
      >
        Роли, які хочеться повторити
      </h1>

      <p class="hero-banner__description">
        Обирай улюблені смаки та збирай своє ідеальне замовлення.
      </p>

      <a
        class="hero-banner__action"
        href="#categories"
      >
        До меню

        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </a>
    </div>
  </section>
</template>

<style scoped>
.hero-banner {
  position: relative;
  isolation: isolate;
  overflow: hidden;

  min-height: clamp(280px, 76vw, 328px);

  background: #17191c;
  border-radius: var(--radius-large);
  box-shadow: var(--shadow-card);
}

.hero-banner::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;

  background:
    linear-gradient(180deg, rgb(9 10 12 / 6%) 12%, rgb(9 10 12 / 30%) 48%, rgb(9 10 12 / 92%) 100%),
    linear-gradient(90deg, rgb(9 10 12 / 38%), transparent 72%);
}

.hero-banner__image {
  position: absolute;
  inset: 0;
  z-index: -2;

  width: 100%;
  height: 100%;

  object-fit: cover;
  object-position: center;
  transform: scale(1.02);
}

.hero-banner__content {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;

  padding: 22px;
}

.hero-banner__eyebrow {
  width: fit-content;
  margin-bottom: 10px;
  padding: 6px 9px;

  color: white;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.08em;
  line-height: 1;
  text-transform: uppercase;

  background: var(--color-primary);
  border-radius: 999px;
}

.hero-banner h1 {
  max-width: 310px;

  color: white;
  letter-spacing: -0.035em;
  line-height: 1.03;
}

.hero-banner__description {
  max-width: 300px;
  margin-top: 10px;

  color: rgb(255 255 255 / 78%);
  font-size: 13px;
  line-height: 1.4;
}

.hero-banner__action {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  justify-content: center;

  min-height: 42px;
  margin-top: 16px;
  padding: 0 16px;

  color: white;
  font-size: 13px;
  font-weight: 700;

  background: var(--color-primary);
  border-radius: 13px;
  box-shadow: 0 8px 22px rgb(0 0 0 / 22%);

  transition:
    background-color var(--transition-fast),
    transform var(--transition-fast);
}

.hero-banner__action:hover {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
}

.hero-banner__action:focus-visible {
  outline: 3px solid rgb(255 255 255 / 60%);
  outline-offset: 3px;
}

.hero-banner__action svg {
  width: 17px;
  height: 17px;

  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

@media (max-width: 359px) {
  .hero-banner__content {
    padding: 18px;
  }

  .hero-banner__description {
    max-width: 260px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-banner__action {
    transition: none;
  }
}
</style>
