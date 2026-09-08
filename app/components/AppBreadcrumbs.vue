<script setup lang="ts">
const breadcrumbs = useBreadcrumbs()
</script>

<template>
  <nav
    v-if="breadcrumbs.length"
    class="app-breadcrumbs"
    aria-label="Хлібні крихти"
  >
    <ol>
      <li
        v-for="(item, index) in breadcrumbs"
        :key="`${index}-${item.title}`"
      >
        <svg
          v-if="index > 0"
          class="app-breadcrumbs__separator"
          aria-hidden="true"
          viewBox="0 0 20 20"
        >
          <path d="m8 5 5 5-5 5" />
        </svg>

        <NuxtLink v-if="item.to" :to="item.to">
          {{ item.title }}
        </NuxtLink>

        <span v-else aria-current="page">
          {{ item.title }}
        </span>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.app-breadcrumbs {
  padding: 14px var(--page-padding) 0;
  overflow-x: auto;
  overscroll-behavior-inline: contain;
  scrollbar-width: none;
}

.app-breadcrumbs::-webkit-scrollbar {
  display: none;
}

.app-breadcrumbs ol {
  display: flex;
  align-items: center;
  width: max-content;
  min-width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
}

.app-breadcrumbs li {
  display: inline-flex;
  align-items: center;
  min-width: 0;
}

.app-breadcrumbs a,
.app-breadcrumbs span {
  color: var(--color-text-muted);
  font-size: 12px;
  font-weight: 700;
  line-height: 1.4;
  white-space: nowrap;
}

.app-breadcrumbs a {
  transition: color var(--transition-fast);
}

.app-breadcrumbs a:hover {
  color: var(--color-primary);
}

.app-breadcrumbs a:focus-visible {
  outline: 3px solid rgb(255 116 87 / 24%);
  outline-offset: 3px;
}

.app-breadcrumbs li:last-child span {
  display: block;
  max-width: 180px;
  overflow: hidden;
  color: var(--color-text-secondary);
  text-overflow: ellipsis;
}

.app-breadcrumbs__separator {
  flex: 0 0 auto;
  width: 16px;
  height: 16px;
  margin: 0 5px;

  fill: none;
  stroke: var(--color-text-muted);
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

@media (max-width: 359px) {
  .app-breadcrumbs {
    padding-left: 14px;
    padding-right: 14px;
  }
}
</style>
