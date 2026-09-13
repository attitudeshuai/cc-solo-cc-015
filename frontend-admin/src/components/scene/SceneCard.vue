<script setup lang="ts">
import type { Scene } from '@/types'

const props = defineProps<{
  scene: Scene
  isActive: boolean
}>()

const emit = defineEmits<{
  select: [id: number]
}>()

const handleClick = () => {
  emit('select', props.scene.id)
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    emit('select', props.scene.id)
  }
}
</script>

<template>
  <article
    class="scene-card"
    :class="{ 'is-active': isActive }"
    role="button"
    tabindex="0"
    :aria-pressed="isActive"
    :aria-label="`场景 ${scene.id}: ${scene.title}`"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <!-- 序号标识 -->
    <div class="card-number">
      <span>{{ scene.id }}</span>
    </div>

    <!-- 内容区域 -->
    <div class="card-content">
      <h3 class="card-title">{{ scene.title }}</h3>

      <div class="card-meta">
        <el-tag size="small" type="info" effect="plain">
          <el-icon><Location /></el-icon>
          <span>{{ scene.location }}</span>
        </el-tag>
        <el-tag size="small" type="warning" effect="plain">
          <el-icon><Sunny /></el-icon>
          <span>{{ scene.timeOfDay }}</span>
        </el-tag>
      </div>

      <p class="card-description">{{ scene.description }}</p>
    </div>

    <!-- 激活指示器 -->
    <div v-if="isActive" class="card-indicator" aria-hidden="true">
      <el-icon><CaretRight /></el-icon>
    </div>
  </article>
</template>

<style scoped>
.scene-card {
  position: relative;
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-normal);
  outline: none;
}

/* 悬停效果 */
.scene-card:hover {
  background-color: var(--bg-card-hover);
  border-color: var(--primary-color);
  transform: translateX(4px);
  box-shadow: var(--shadow-md);
}

/* 焦点效果 */
.scene-card:focus-visible {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px var(--primary-bg);
}

/* 激活状态 */
.scene-card.is-active {
  background-color: var(--primary-bg);
  border-color: var(--primary-color);
  box-shadow: var(--shadow-md);
}

/* 序号 */
.card-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background-color: var(--primary-color);
  border-radius: 50%;
  flex-shrink: 0;
}

.card-number span {
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-semibold);
  color: white;
}

/* 内容 */
.card-content {
  flex: 1;
  min-width: 0;
}

.card-title {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin: 0 0 var(--spacing-sm) 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-sm);
}

.card-meta .el-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: var(--font-size-xs);
  white-space: nowrap;
}

.card-description {
  font-size: var(--font-size-small);
  color: var(--text-secondary);
  line-height: var(--line-height-relaxed);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 激活指示器 */
.card-indicator {
  position: absolute;
  right: var(--spacing-sm);
  top: 50%;
  transform: translateY(-50%);
  color: var(--primary-color);
  font-size: var(--font-size-h3);
}
</style>
