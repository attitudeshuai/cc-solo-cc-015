<script setup lang="ts">
import { useScreenplayStore } from '@/stores'
import { ElMessage } from 'element-plus'
import SceneCard from '@/components/scene/SceneCard.vue'

const store = useScreenplayStore()

const handleSceneSelect = async (id: number) => {
  try {
    await store.selectScene(id)
    ElMessage({
      message: `已切换到场景 ${id}`,
      type: 'success',
      duration: 1500
    })
  } catch {
    ElMessage.error('切换场景失败，请重试')
  }
}
</script>

<template>
  <div class="scene-list">
    <!-- 列表信息 -->
    <div class="list-header">
      <span class="list-count">共 {{ store.scenes.length }} 个场景</span>
    </div>

    <!-- 场景卡片列表 -->
    <div class="list-body" role="list" aria-label="场景列表">
      <SceneCard
        v-for="scene in store.scenes"
        :key="scene.id"
        :scene="scene"
        :is-active="scene.id === store.selectedSceneId"
        role="listitem"
        @select="handleSceneSelect"
      />
    </div>

    <!-- 空状态 -->
    <el-empty
      v-if="store.scenes.length === 0"
      description="暂无场景数据"
      :image-size="80"
    />
  </div>
</template>

<style scoped>
.scene-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  height: 100%;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--border-color);
}

.list-count {
  font-size: var(--font-size-small);
  color: var(--text-muted);
}

.list-body {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  flex: 1;
  overflow-y: auto;
}
</style>
