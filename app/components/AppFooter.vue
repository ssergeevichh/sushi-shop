<script setup lang="ts">
const currentYear = new Date().getFullYear()

const emit = defineEmits<{
  openDelivery: []
}>()
</script>

<template>
  <footer class="app-footer">
    <div class="footer-content">
      <NuxtLink
        class="footer-logos"
        to="/"
        aria-label="ROLLIN’ — на головну"
      >
        <img
          class="footer-logo footer-logo--main"
          src="/images/brand/brand-logo.png"
          alt=""
        >
        <img
          class="footer-logo footer-logo--delivery"
          src="/images/brand/delivery-logo.png"
          alt=""
        >
      </NuxtLink>

      <p class="footer-tagline">
        Заряджені роли твого міста з енергією руху.
      </p>

      <div class="footer-columns">
        <nav class="footer-section" aria-label="Навігація у футері">
          <h2>Меню</h2>
          <ul class="footer-menu">
            <li><NuxtLink to="/menu">Роли</NuxtLink></li>
            <li><NuxtLink to="/categories/sets">Сети</NuxtLink></li>
            <li>
              <button
                type="button"
                aria-haspopup="dialog"
                aria-controls="delivery-dialog"
                @click="emit('openDelivery')"
              >
                Доставка
              </button>
            </li>
          </ul>
        </nav>

        <section id="delivery" class="footer-section" aria-labelledby="contacts-title">
          <h2 id="contacts-title">Контакти</h2>
          <div class="footer-contacts">
            <a class="contact-row" href="tel:+380990000000">
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="M7.2 3.5 9.7 8l-2.1 1.8a15.8 15.8 0 0 0 6.6 6.6l1.8-2.1 4.5 2.5-.8 3.2a2 2 0 0 1-2 1.5C9.3 21 3 14.7 2.5 6.3a2 2 0 0 1 1.5-2l3.2-.8Z" />
              </svg>
              <span>+380 (99) 000 00 00</span>
            </a>

            <p class="contact-row">
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3.5 2" />
              </svg>
              <span>10:00 — 22:00 Пн–Нд</span>
            </p>
          </div>
        </section>
      </div>

      <section class="footer-section" aria-labelledby="social-title">
        <h2 id="social-title">Ми в мережах</h2>
        <div class="social-links">
          <a
            class="social-link"
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="ROLLIN’ в Instagram"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle class="social-icon-dot" cx="17.4" cy="6.7" r="1" />
            </svg>
          </a>

          <a
            class="social-link"
            href="https://www.facebook.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="ROLLIN’ у Facebook"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="M14.5 21v-8h2.8l.5-3.2h-3.3V7.7c0-.9.3-1.6 1.7-1.6H18V3.2c-.8-.1-1.6-.2-2.4-.2-2.5 0-4.2 1.5-4.2 4.4v2.4H8.5V13h2.9v8h3.1Z" />
            </svg>
          </a>
        </div>
      </section>

      <section class="footer-development" aria-labelledby="development-title">
        <h2 id="development-title">Потрібна подібна платформа?</h2>
        <p>Розробка та підтримка вебплатформ.</p>

        <div class="footer-development__contacts">
          <a href="mailto:sergeevich.production@gmail.com">
            sergeevich.production@gmail.com
          </a>
          <a href="tel:+380969841645">+380 (96) 984 16 45</a>
        </div>
      </section>
    </div>

    <div class="footer-legal">
      ©ROLLIN {{ currentYear }}. Всі права захищені.
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  margin-top: 24px;
  border-top: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  text-align: center;
}

.app-footer--with-sticky-purchase {
  padding-bottom: calc(84px + env(safe-area-inset-bottom));
}

.app-footer--with-sticky-order-checkout {
  padding-bottom: calc(92px + env(safe-area-inset-bottom));
}

.footer-content {
  padding: 30px var(--page-padding) 0;
}

.footer-logos {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: inherit;
}

.footer-logo {
  display: block;
  height: auto;
  object-fit: contain;
}

.footer-logo--main {
  width: 68px;
}

.footer-logo--delivery {
  width: 112px;
}

.footer-tagline {
  max-width: 300px;
  margin: 16px auto 0;
  color: var(--color-text-muted);
  font-size: 13px;
  font-weight: 500;
  line-height: 1.45;
}

.footer-columns {
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  gap: 20px;
  margin-top: 30px;
  text-align: left;
}

.footer-section {
  margin-top: 28px;
}

.footer-columns .footer-section {
  margin-top: 0;
}

.footer-section h2 {
  margin: 0 0 12px;
  font-size: 13px;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

.footer-menu {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.footer-menu a,
.footer-menu button {
  color: var(--color-text-secondary);
  font-size: 13px;
  line-height: 1.3;
  text-decoration: none;
  transition: color var(--transition-fast);
}

.footer-menu button {
  margin: 0;
  padding: 0;
  background: transparent;
  border: 0;
}

.footer-menu a:hover,
.footer-menu button:hover {
  color: var(--color-primary);
}

.footer-contacts {
  display: inline-grid;
  gap: 8px;
  color: var(--color-text-secondary);
  text-align: left;
}

.contact-row {
  display: grid;
  grid-template-columns: 18px auto;
  align-items: center;
  gap: 8px;
  margin: 0;
  color: inherit;
  font-size: 13px;
  line-height: 1.3;
  text-decoration: none;
}

.contact-row svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

a.contact-row:hover {
  color: var(--color-primary);
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.social-link {
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border-radius: 50%;
  background: var(--color-surface-soft);
  color: var(--color-text);
  transition:
    color var(--transition-fast),
    background-color var(--transition-fast),
    transform var(--transition-fast);
}

.social-link:hover {
  background: rgb(255 116 87 / 10%);
  color: var(--color-primary);
  transform: translateY(-2px);
}

.social-link svg {
  width: 20px;
  height: 20px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

.social-link:last-child svg {
  fill: currentColor;
  stroke: none;
}

.social-icon-dot {
  fill: currentColor;
  stroke: none;
}

.footer-development {
  margin-top: 28px;
  padding: 16px 14px;
  background: var(--color-surface-soft);
  border: 1px solid var(--color-border);
  border-radius: 16px;
}

.footer-development h2 {
  font-size: 14px;
}

.footer-development > p {
  margin-top: 5px;
  color: var(--color-text-muted);
  font-size: 11px;
  line-height: 1.45;
}

.footer-development__contacts {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 5px 12px;
  margin-top: 11px;
}

.footer-development__contacts a {
  color: var(--color-primary);
  font-size: 11px;
  font-weight: 700;
  overflow-wrap: anywhere;
}

.footer-development__contacts a:hover {
  color: var(--color-primary-hover);
}

.footer-development__contacts a:focus-visible {
  outline: 3px solid rgb(255 116 87 / 24%);
  outline-offset: 3px;
}

.footer-legal {
  margin-top: 28px;
  padding: 18px var(--page-padding) 20px;
  border-top: 1px solid var(--color-border);
  color: var(--color-text-muted);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.07em;
  line-height: 1.4;
  text-transform: uppercase;
}

@media (max-width: 359px) {
  .footer-content {
    padding-top: 26px;
  }

  .footer-logos {
    gap: 10px;
  }

  .footer-logo--main {
    width: 62px;
  }

    .footer-logo--delivery {
    width: 102px;
  }

  .footer-columns {
    gap: 14px;
  }

  .footer-menu a,
  .footer-menu button,
  .contact-row {
    font-size: 12px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .footer-menu a,
  .footer-menu button,
  .social-link {
    transition: none;
  }
}
</style>
