<script setup lang="ts">
import type { GameplayTip } from '@/types'

defineProps<{
  items: GameplayTip[]
}>()

const getTypeConfig = (type: string) => {
  const config: Record<string, { label: string; color: string }> = {
    interaction: { label: '互动', color: 'var(--primary-color)' },
    choice: { label: '选择', color: 'var(--success-color)' },
    puzzle: { label: '解谜', color: 'var(--warning-color)' },
    qte: { label: 'QTE', color: 'var(--danger-color)' }
  }
  return config[type] || { label: type, color: 'var(--info-color)' }
}

const getPriorityConfig = (priority: string) => {
  const config: Record<string, { label: string; tagType: 'info' | 'warning' | 'danger' }> = {
    low: { label: '低', tagType: 'info' },
    medium: { label: '中', tagType: 'warning' },
    high: { label: '高', tagType: 'danger' }
  }
  return config[priority] || { label: priority, tagType: 'info' }
}
</script>

<template>
  <div class="gameplay-list">
    <article
      v-for="item in items"
      :key="item.id"
      class="gameplay-item"
    >
      <div
        class="item-icon"
        :style="{ backgroundColor: getTypeConfig(item.type).color }"
      >
        <el-icon><Aim /></el-icon>
      </div>

      <div class="item-body">
        <header class="item-header">
          <h4 class="item-title">{{ item.title }}</h4>
          <div class="item-tags">
            <el-tag size="small" effect="dark">
              {{ getTypeConfig(item.type).label }}
            </el-tag>
            <el-tag
              size="small"
              :type="getPriorityConfig(item.priority).tagType"
              effect="plain"
            >
              优先级: {{ getPriorityConfig(item.priority).label }}
            </el-tag>
          </div>
        </header>

        <p class="item-description">{{ item.description }}</p>
      </div>
    </article>

    <el-empty v-if="items.length === 0" description="暂无玩法提示" :image-size="60" />
  </div>
</template>

<style scoped>
.gameplay-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.gameplay-item {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  transition: all var(--transition-normal);
}

.gameplay-item:hover {
  background-color: var(--bg-card-hover);
  border-color: var(--warning-color);
  box-shadow: var(--shadow-md);
}

.item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  color: white;
  font-size: var(--font-size-h3);
  flex-shrink: 0;
}

.item-body {
  flex: 1;
  min-width: 0;
}

.item-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
  flex-wrap: wrap;
}

.item-title {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin: 0;
}

.item-tags {
  display: flex;
  gap: var(--spacing-xs);
  flex-wrap: wrap;
}

.item-description {
  font-size: var(--font-size-small);
  color: var(--text-secondary);
  line-height: var(--line-height-relaxed);
  margin: 0;
}
</style>
