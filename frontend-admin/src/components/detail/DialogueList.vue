<script setup lang="ts">
import type { Dialogue } from '@/types'

defineProps<{
  items: Dialogue[]
}>()
</script>

<template>
  <div class="dialogue-list">
    <article
      v-for="item in items"
      :key="item.id"
      class="dialogue-item"
    >
      <div class="item-avatar">
        <el-icon><User /></el-icon>
      </div>

      <div class="item-body">
        <header class="item-header">
          <h4 class="character-name">{{ item.character }}</h4>
          <el-tag v-if="item.emotion" size="small" type="info" effect="plain">
            {{ item.emotion }}
          </el-tag>
        </header>

        <blockquote class="dialogue-content">
          <span class="quote-mark" aria-hidden="true">"</span>
          <span class="dialogue-text">{{ item.content }}</span>
          <span class="quote-mark" aria-hidden="true">"</span>
        </blockquote>

        <footer v-if="item.action" class="item-action">
          <el-icon><Position /></el-icon>
          <span>{{ item.action }}</span>
        </footer>
      </div>
    </article>

    <el-empty v-if="items.length === 0" description="暂无台词" :image-size="60" />
  </div>
</template>

<style scoped>
.dialogue-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.dialogue-item {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-left: 3px solid var(--success-color);
  border-radius: var(--radius-md);
  transition: all var(--transition-normal);
}

.dialogue-item:hover {
  background-color: var(--bg-card-hover);
  transform: translateX(4px);
}

.item-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background-color: var(--success-color);
  border-radius: 50%;
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
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
}

.character-name {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  margin: 0;
}

.dialogue-content {
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--bg-page);
  border-radius: var(--radius-sm);
  margin: 0 0 var(--spacing-sm) 0;
  font-size: var(--font-size-body);
  color: var(--text-primary);
  line-height: var(--line-height-relaxed);
}

.quote-mark {
  color: var(--primary-color);
  font-size: var(--font-size-h3);
  font-weight: var(--font-weight-bold);
}

.dialogue-text {
  margin: 0 var(--spacing-xs);
}

.item-action {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-small);
  color: var(--text-muted);
  font-style: italic;
}
</style>
