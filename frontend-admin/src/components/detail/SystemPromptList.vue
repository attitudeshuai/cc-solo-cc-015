<script setup lang="ts">
import type { SystemPrompt } from '@/types'

defineProps<{
  items: SystemPrompt[]
}>()

const getTypeConfig = (type: string) => {
  const config: Record<string, { color: string; bgColor: string; icon: string }> = {
    info: {
      color: 'var(--primary-color)',
      bgColor: 'var(--primary-bg)',
      icon: 'InfoFilled'
    },
    success: {
      color: 'var(--success-color)',
      bgColor: 'var(--success-bg)',
      icon: 'SuccessFilled'
    },
    warning: {
      color: 'var(--warning-color)',
      bgColor: 'var(--warning-bg)',
      icon: 'WarningFilled'
    },
    error: {
      color: 'var(--danger-color)',
      bgColor: 'var(--danger-bg)',
      icon: 'CircleCloseFilled'
    }
  }
  return config[type] || config.info
}
</script>

<template>
  <div class="prompt-list">
    <article
      v-for="item in items"
      :key="item.id"
      class="prompt-item"
      :style="{
        borderLeftColor: getTypeConfig(item.type).color,
        backgroundColor: getTypeConfig(item.type).bgColor
      }"
    >
      <div class="item-icon" :style="{ color: getTypeConfig(item.type).color }">
        <el-icon v-if="item.type === 'info'"><InfoFilled /></el-icon>
        <el-icon v-else-if="item.type === 'success'"><SuccessFilled /></el-icon>
        <el-icon v-else-if="item.type === 'warning'"><WarningFilled /></el-icon>
        <el-icon v-else-if="item.type === 'error'"><CircleCloseFilled /></el-icon>
        <el-icon v-else><InfoFilled /></el-icon>
      </div>

      <div class="item-body">
        <header class="item-header">
          <h4 class="item-title">{{ item.title }}</h4>
          <time v-if="item.timestamp" class="item-time">
            <el-icon><Clock /></el-icon>
            <span>{{ item.timestamp }}</span>
          </time>
        </header>

        <p class="item-content">{{ item.content }}</p>
      </div>
    </article>

    <el-empty v-if="items.length === 0" description="暂无系统提示" :image-size="60" />
  </div>
</template>

<style scoped>
.prompt-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.prompt-item {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  border-left: 3px solid;
  transition: transform var(--transition-normal);
}

.prompt-item:hover {
  transform: translateX(4px);
}

.item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-h2);
  flex-shrink: 0;
}

.item-body {
  flex: 1;
  min-width: 0;
}

.item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xs);
}

.item-title {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin: 0;
}

.item-time {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-small);
  color: var(--text-muted);
}

.item-content {
  font-size: var(--font-size-small);
  color: var(--text-secondary);
  line-height: var(--line-height-relaxed);
  margin: 0;
}
</style>
