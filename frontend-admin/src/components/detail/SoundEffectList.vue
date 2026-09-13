<script setup lang="ts">
import { ElMessage } from 'element-plus'
import type { SoundEffect } from '@/types'
import { useAudioPlayer } from '@/composables/useAudioPlayer'

defineProps<{
  items: SoundEffect[]
}>()

const { isPlaying, isLooping, playSound, stopSound, stopAllSounds, playingCount } = useAudioPlayer()

const getTypeConfig = (type: string) => {
  const config: Record<string, { label: string; tagType: 'primary' | 'success' | 'warning' | 'info' }> = {
    background: { label: '背景音', tagType: 'info' },
    effect: { label: '音效', tagType: 'warning' },
    music: { label: '配乐', tagType: 'success' }
  }
  return config[type] || { label: type, tagType: 'info' }
}

const handlePlay = (item: SoundEffect) => {
  if (isPlaying(item.id)) {
    stopSound(item.id)
    ElMessage.info(`已停止: ${item.name}`)
  } else {
    const success = playSound(item)
    if (success) {
      const loopText = item.duration === '循环' || item.duration === '持续' ? '（循环）' : ''
      ElMessage.success(`正在播放: ${item.name} ${loopText}`)
    } else {
      ElMessage.error(`播放失败: ${item.name}`)
    }
  }
}

const handleStopAll = () => {
  stopAllSounds()
  ElMessage.info('已停止所有音效')
}

// 暴露停止所有音效的方法供父组件调用
const stopAll = () => {
  stopAllSounds()
}

defineExpose({
  stopAll
})

const getDurationDisplay = (duration: string) => {
  if (duration === '循环' || duration === '持续') {
    return { text: duration, isLoop: true }
  }
  return { text: duration, isLoop: false }
}
</script>

<template>
  <div class="sound-list">
    <!-- 控制栏 -->
    <div class="sound-controls" v-if="playingCount() > 0">
      <div class="playing-info">
        <el-icon class="playing-indicator"><VideoPlay /></el-icon>
        <span>正在播放 {{ playingCount() }} 个音效</span>
      </div>
      <el-button size="small" type="danger" plain @click="handleStopAll">
        <el-icon><VideoPause /></el-icon>
        全部停止
      </el-button>
    </div>

    <!-- 音效列表 -->
    <article
      v-for="item in items"
      :key="item.id"
      class="sound-item"
      :class="{ 'is-playing': isPlaying(item.id) }"
    >
      <div
        class="item-icon"
        :class="{ 'is-playing': isPlaying(item.id) }"
        @click.stop="handlePlay(item)"
        role="button"
        :aria-label="isPlaying(item.id) ? '停止播放' : '开始播放'"
      >
        <el-icon v-if="isPlaying(item.id)" class="playing-icon">
          <VideoPause />
        </el-icon>
        <el-icon v-else><VideoPlay /></el-icon>
      </div>

      <div class="item-body">
        <header class="item-header">
          <h4 class="item-name">
            {{ item.name }}
            <el-tag
              v-if="isPlaying(item.id)"
              size="small"
              type="success"
              effect="dark"
              class="playing-tag"
            >
              播放中
            </el-tag>
          </h4>
          <el-tag size="small" :type="getTypeConfig(item.type).tagType" effect="plain">
            {{ getTypeConfig(item.type).label }}
          </el-tag>
        </header>

        <p class="item-description">{{ item.description }}</p>

        <footer class="item-footer">
          <div class="duration-info">
            <el-icon><Clock /></el-icon>
            <span>{{ getDurationDisplay(item.duration).text }}</span>
          </div>
          <span class="play-hint" @click.stop="handlePlay(item)">
            <template v-if="isPlaying(item.id)">
              <el-icon><VideoPause /></el-icon>
              点击停止
            </template>
            <template v-else>
              <el-icon><VideoPlay /></el-icon>
              点击播放
            </template>
          </span>
        </footer>
      </div>

      <!-- 循环播放指示器 -->
      <div v-if="isPlaying(item.id) && isLooping(item.id)" class="loop-indicator">
        <span class="loop-dot"></span>
        <span class="loop-dot"></span>
        <span class="loop-dot"></span>
      </div>
    </article>

    <el-empty v-if="items.length === 0" description="暂无音效" :image-size="60" />
  </div>
</template>

<style scoped>
.sound-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

/* 控制栏 */
.sound-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-sm) var(--spacing-md);
  background: linear-gradient(90deg, rgba(103, 194, 58, 0.1) 0%, rgba(64, 158, 255, 0.1) 100%);
  border: 1px solid var(--success-color);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-xs);
}

.playing-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-small);
  color: var(--success-color);
  font-weight: 500;
}

.playing-indicator {
  animation: pulse-icon 1s ease-in-out infinite;
}

@keyframes pulse-icon {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* 音效卡片 */
.sound-item {
  position: relative;
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  transition: all var(--transition-normal);
  user-select: none;
  overflow: hidden;
}

.sound-item:hover {
  background-color: var(--bg-card-hover);
}

.sound-item.is-playing {
  background: linear-gradient(135deg, rgba(103, 194, 58, 0.12) 0%, rgba(64, 158, 255, 0.08) 100%);
  border-color: var(--success-color);
  box-shadow: 0 0 16px rgba(103, 194, 58, 0.25);
}

.item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, var(--primary-color) 0%, #66b1ff 100%);
  border-radius: 50%;
  color: white;
  font-size: 20px;
  flex-shrink: 0;
  transition: all var(--transition-normal);
}

.item-icon:hover {
  transform: scale(1.1);
}

.item-icon.is-playing {
  background: linear-gradient(135deg, var(--success-color) 0%, #85ce61 100%);
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(103, 194, 58, 0.5);
  }
  50% {
    box-shadow: 0 0 0 12px rgba(103, 194, 58, 0);
  }
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

.item-name {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin: 0;
}

.playing-tag {
  animation: blink 1.5s ease-in-out infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.item-description {
  font-size: var(--font-size-small);
  color: var(--text-secondary);
  line-height: var(--line-height-normal);
  margin: 0 0 var(--spacing-sm) 0;
}

.item-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-sm);
}

.duration-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-small);
  color: var(--text-muted);
}

.duration-info .el-tag {
  padding: 0 4px;
  height: 18px;
}

.play-hint {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: var(--font-size-small);
  color: var(--primary-color);
  cursor: pointer;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.play-hint:hover {
  background-color: rgba(64, 158, 255, 0.1);
}

.sound-item.is-playing .play-hint {
  color: var(--danger-color);
}

.sound-item.is-playing .play-hint:hover {
  background-color: rgba(245, 108, 108, 0.1);
}

/* 循环播放指示器 */
.loop-indicator {
  position: absolute;
  bottom: 8px;
  right: 12px;
  display: flex;
  gap: 4px;
}

.loop-dot {
  width: 6px;
  height: 6px;
  background-color: var(--success-color);
  border-radius: 50%;
  animation: bounce 1.4s ease-in-out infinite;
}

.loop-dot:nth-child(1) { animation-delay: 0s; }
.loop-dot:nth-child(2) { animation-delay: 0.2s; }
.loop-dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0.6);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
