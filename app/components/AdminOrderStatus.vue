<script setup lang="ts">
import type { OrderStatus } from '~/types/admin'
import { getOrderStatusLabel } from '~/utils/admin'

defineProps<{ status: OrderStatus }>()
</script>

<template>
  <span class="admin-order-status" :class="`admin-order-status--${status}`">
    {{ getOrderStatusLabel(status) }}
  </span>
</template>

<style scoped>
.admin-order-status {
  display: inline-flex;
  min-height: 28px;
  align-items: center;
  padding: 0 10px;
  color: #344054;
  background: #f2f4f7;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
  white-space: nowrap;
}

.admin-order-status--new {
  color: #b54708;
  background: #fffaeb;
}

.admin-order-status--confirmed,
.admin-order-status--preparing {
  color: #175cd3;
  background: #eff8ff;
}

.admin-order-status--ready,
.admin-order-status--delivering {
  color: #6941c6;
  background: #f4f3ff;
}

.admin-order-status--completed {
  color: #027a48;
  background: #ecfdf3;
}

.admin-order-status--cancelled {
  color: #b42318;
  background: #fef3f2;
}
</style>
