<script setup lang="ts">
const route = useRoute()
const { user, signOut } = useAdminAuth()

const isLoginPage = computed(() => route.path === '/admin/login')
</script>

<template>
  <div class="admin-layout">
    <header class="admin-header">
      <NuxtLink class="admin-header__brand" :to="isLoginPage ? '/' : '/admin'">
        <img src="/images/brand/brand-logo.png" alt="ROLLIN’">
        <span v-if="!isLoginPage">Адмін-панель</span>
      </NuxtLink>

      <div v-if="!isLoginPage && user" class="admin-header__account">
        <span>{{ user.email }}</span>
        <button type="button" @click="signOut">
          Вийти
        </button>
      </div>
    </header>

    <slot />
  </div>
</template>

<style scoped>
.admin-layout {
  width: 100%;
  min-height: 100dvh;
  background: var(--color-page);
}

.admin-header {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  min-height: 68px;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 10px max(var(--page-padding), calc((100% - 1080px) / 2));
  background: rgb(255 255 255 / 94%);
  border-bottom: 1px solid var(--color-border);
  backdrop-filter: blur(14px);
}

.admin-header__brand {
  display: flex;
  align-items: center;
  gap: 11px;
  font-size: 14px;
  font-weight: 800;
}

.admin-header__brand img {
  width: 50px;
  height: 42px;
  object-fit: contain;
}

.admin-header__account {
  display: flex;
  align-items: center;
  gap: 12px;
}

.admin-header__account span {
  display: none;
  color: var(--color-text-secondary);
  font-size: 12px;
}

.admin-header__account button {
  min-height: 40px;
  padding: 0 14px;
  color: var(--color-text);
  background: var(--color-surface-soft);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  font-size: 12px;
  font-weight: 800;
}

.admin-header__brand:focus-visible,
.admin-header__account button:focus-visible {
  outline: 3px solid rgb(255 116 87 / 24%);
  outline-offset: 3px;
}

@media (min-width: 640px) {
  .admin-header__account span {
    display: block;
  }
}
</style>
