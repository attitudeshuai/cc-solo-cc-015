<script setup lang="ts">
import { ref, watch } from 'vue'
import { useScreenplayStore } from '@/stores'
import SoundEffectList from '@/components/detail/SoundEffectList.vue'
import DialogueList from '@/components/detail/DialogueList.vue'
import GameplayTipList from '@/components/detail/GameplayTipList.vue'
import SystemPromptList from '@/components/detail/SystemPromptList.vue'

const store = useScreenplayStore()
const activeSection = ref<string[]>(['dialogue'])
const soundEffectListRef = ref<InstanceType<typeof SoundEffectList> | null>(null)

// 监听场景切换，停止所有音效
watch(() => store.selectedSceneId, () => {
  soundEffectListRef.value?.stopAll()
})
</script>

<template>
  <div class="scene-detail" v-loading="store.isLoading" element-loading-text="加载中...">
    <template v-if="store.sceneDetail">
      <!-- 场景概览卡片 -->
      <article class="detail-overview">
        <h1 class="overview-title">{{ store.sceneDetail.scene.title }}</h1>

        <div class="overview-meta">
          <el-tag effect="dark" round>
            <el-icon><Location /></el-icon>
            <span>{{ store.sceneDetail.scene.location }}</span>
          </el-tag>
          <el-tag effect="dark" type="warning" round>
            <el-icon><Clock /></el-icon>
            <span>{{ store.sceneDetail.scene.timeOfDay }}</span>
          </el-tag>
        </div>

        <p class="overview-description">{{ store.sceneDetail.scene.description }}</p>
      </article>

      <!-- 内容分区 -->
      <div class="detail-sections">
        <el-collapse v-model="activeSection" accordion>
          <!-- 音效区 -->
          <el-collapse-item name="sound">
            <template #title>
              <div class="section-header">
                <el-icon class="section-icon section-icon--sound"><Headset /></el-icon>
                <span class="section-title">音效</span>
                <el-badge
                  :value="store.sceneDetail.soundEffects.length"
                  type="primary"
                  :max="99"
                />
              </div>
            </template>
            <SoundEffectList ref="soundEffectListRef" :items="store.sceneDetail.soundEffects" />
          </el-collapse-item>

          <!-- 台词区 -->
          <el-collapse-item name="dialogue">
            <template #title>
              <div class="section-header">
                <el-icon class="section-icon section-icon--dialogue"><ChatDotRound /></el-icon>
                <span class="section-title">台词</span>
                <el-badge
                  :value="store.sceneDetail.dialogues.length"
                  type="success"
                  :max="99"
                />
              </div>
            </template>
            <DialogueList :items="store.sceneDetail.dialogues" />
          </el-collapse-item>

          <!-- 玩法提示区 -->
          <el-collapse-item name="gameplay">
            <template #title>
              <div class="section-header">
                <el-icon class="section-icon section-icon--gameplay"><Aim /></el-icon>
                <span class="section-title">玩法提示</span>
                <el-badge
                  :value="store.sceneDetail.gameplayTips.length"
                  type="warning"
                  :max="99"
                />
              </div>
            </template>
            <GameplayTipList :items="store.sceneDetail.gameplayTips" />
          </el-collapse-item>

          <!-- 系统提示区 -->
          <el-collapse-item name="system">
            <template #title>
              <div class="section-header">
                <el-icon class="section-icon section-icon--system"><Monitor /></el-icon>
                <span class="section-title">系统提示</span>
                <el-badge
                  :value="store.sceneDetail.systemPrompts.length"
                  type="info"
                  :max="99"
                />
              </div>
            </template>
            <SystemPromptList :items="store.sceneDetail.systemPrompts" />
          </el-collapse-item>
        </el-collapse>
      </div>
    </template>

    <!-- 空状态 -->
    <el-empty
      v-else
      description="请从左侧选择一个场景"
      :image-size="120"
    >
      <template #image>
        <el-icon :size="80" color="var(--text-muted)"><Film /></el-icon>
      </template>
    </el-empty>
  </div>
</template>

<style scoped>
.scene-detail {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  min-height: 0;
}

/* 场景概览 */
.detail-overview {
  flex-shrink: 0;
  padding: var(--spacing-lg);
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.overview-title {
  font-size: var(--font-size-h2);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  margin: 0 0 var(--spacing-md) 0;
}

.overview-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.overview-meta .el-tag {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  white-space: nowrap;
}

.overview-description {
  font-size: var(--font-size-body);
  color: var(--text-secondary);
  line-height: var(--line-height-relaxed);
  margin: 0;
}

/* 内容分区 */
.detail-sections {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
}

/* 分区头部 */
.section-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  width: 100%;
}

.section-icon {
  font-size: var(--font-size-h3);
}

.section-icon--sound { color: var(--primary-color); }
.section-icon--dialogue { color: var(--success-color); }
.section-icon--gameplay { color: var(--warning-color); }
.section-icon--system { color: var(--info-color); }

.section-title {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
}

.section-header .el-badge {
  margin-left: auto;
  margin-right: var(--spacing-md);
}

/* Element Plus 覆盖 */
:deep(.el-collapse-item__header) {
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: var(--bg-card);
  border-bottom: 1px solid var(--border-color);
  color: var(--text-primary);
  height: auto;
  line-height: normal;
  transition: background-color var(--transition-fast);
}

:deep(.el-collapse-item__header:hover) {
  background-color: var(--bg-card-hover);
}

:deep(.el-collapse-item__content) {
  padding: var(--spacing-md);
  background-color: var(--bg-page);
}

:deep(.el-collapse-item__wrap) {
  border-bottom: 1px solid var(--border-color);
}

:deep(.el-collapse-item:last-child .el-collapse-item__wrap) {
  border-bottom: none;
}

:deep(.el-collapse) {
  border: none;
}

:deep(.el-collapse-item__arrow) {
  color: var(--text-secondary);
}
</style>
