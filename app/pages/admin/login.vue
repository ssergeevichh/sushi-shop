<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const route = useRoute()
const { verifySession, signIn } = useAdminAuth()
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)
const isChecking = ref(true)

function getRedirectPath() {
  const redirect = route.query.redirect

  return typeof redirect === 'string'
    && redirect.startsWith('/admin')
    && redirect !== '/admin/login'
    ? redirect
    : '/admin'
}

async function submit() {
  errorMessage.value = ''
  isSubmitting.value = true

  try {
    await signIn(email.value.trim(), password.value)
    await navigateTo(getRedirectPath())
  }
  catch (error) {
    errorMessage.value = error instanceof Error
      ? error.message
      : 'Не вдалося увійти'
  }
  finally {
    isSubmitting.value = false
  }
}

onMounted(async () => {
  if (await verifySession()) {
    await navigateTo(getRedirectPath())
    return
  }

  isChecking.value = false
})

useSeoMeta({
  title: 'Вхід до адмін-панелі',
  robots: 'noindex, nofollow',
})
</script>

<template>
  <main class="admin-login">
    <div v-if="isChecking" class="admin-login__loading" aria-live="polite">
      <span aria-hidden="true" />
      Перевіряємо сесію…
    </div>

    <form v-else class="admin-login__card" @submit.prevent="submit">
      <div>
        <p class="admin-login__eyebrow">ROLLIN’</p>
        <h1>Вхід для адміністратора</h1>
        <p class="admin-login__intro">Керування замовленнями ресторану.</p>
      </div>

      <label>
        <span>Електронна пошта</span>
        <input
          v-model="email"
          type="email"
          autocomplete="username"
          required
        >
      </label>

      <label>
        <span>Пароль</span>
        <input
          v-model="password"
          type="password"
          autocomplete="current-password"
          required
        >
      </label>

      <p v-if="errorMessage" class="admin-login__error" role="alert">
        {{ errorMessage }}
      </p>

      <button type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? 'Входимо…' : 'Увійти' }}
      </button>
    </form>
  </main>
</template>

<style scoped>
.admin-login {
  display: grid;
  min-height: calc(100dvh - 68px);
  place-items: center;
  padding: 24px var(--page-padding);
}

.admin-login__card {
  display: grid;
  width: min(100%, 420px);
  gap: 18px;
  padding: 28px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-large);
  box-shadow: var(--shadow-card);
}

.admin-login__eyebrow {
  margin-bottom: 6px;
  color: var(--color-primary);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.1em;
}

.admin-login h1 {
  font-size: 25px;
}

.admin-login__intro {
  margin-top: 7px;
  color: var(--color-text-secondary);
  font-size: 13px;
}

.admin-login label {
  display: grid;
  gap: 7px;
  color: var(--color-text-secondary);
  font-size: 12px;
  font-weight: 700;
}

.admin-login input {
  width: 100%;
  height: 50px;
  padding: 0 14px;
  color: var(--color-text);
  background: var(--color-surface);
  border: 1px solid #cfd5dd;
  border-radius: 14px;
  outline: none;
}

.admin-login input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgb(255 116 87 / 14%);
}

.admin-login button {
  height: 52px;
  color: white;
  background: var(--color-primary);
  border: 0;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 800;
}

.admin-login button:disabled {
  cursor: wait;
  opacity: 0.65;
}

.admin-login__error {
  padding: 11px 13px;
  color: #b42318;
  background: #fff0ed;
  border-radius: 11px;
  font-size: 12px;
  font-weight: 700;
}

.admin-login__loading {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--color-text-muted);
  font-size: 13px;
  font-weight: 700;
}

.admin-login__loading span {
  width: 22px;
  height: 22px;
  border: 2px solid rgb(255 116 87 / 20%);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: admin-login-spin 700ms linear infinite;
}

@keyframes admin-login-spin {
  to { transform: rotate(360deg); }
}
</style>
