<script setup lang="ts">
import AppHeader from '@/components/common/AppHeader.vue'
import SceneList from '@/views/SceneList.vue'
import SceneDetail from '@/views/SceneDetail.vue'
import EmptyPanel from '@/views/EmptyPanel.vue'
</script>

<template>
  <div class="main-layout">
    <!-- Header 区域 -->
    <AppHeader />

    <!-- Main 内容区域 -->
    <main class="main-content">
      <!-- 左侧泳道 - 场景列表 -->
      <aside class="lane lane-left" role="complementary" aria-label="场景列表">
        <header class="lane-header">
          <el-icon class="lane-icon"><Film /></el-icon>
          <h2 class="lane-title">场景列表</h2>
        </header>
        <div class="lane-body">
          <SceneList />
        </div>
      </aside>

      <!-- 中间泳道 - 场景详情 -->
      <section class="lane lane-center" role="main" aria-label="场景详情">
        <header class="lane-header">
          <el-icon class="lane-icon"><Document /></el-icon>
          <h2 class="lane-title">场景详情</h2>
        </header>
        <div class="lane-body">
          <SceneDetail />
        </div>
      </section>

      <!-- 右侧泳道 - 扩展区域 -->
      <aside class="lane lane-right" role="complementary" aria-label="扩展区域">
        <header class="lane-header">
          <el-icon class="lane-icon"><Grid /></el-icon>
          <h2 class="lane-title">扩展区域</h2>
        </header>
        <div class="lane-body">
          <EmptyPanel />
        </div>
      </aside>
    </main>
  </div>
</template>

<style scoped>
.main-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 100vh;
  background-color: var(--bg-page);
}

/* Main 内容区域 */
.main-content {
  display: flex;
  flex: 1;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  overflow: hidden;
  background-color: var(--bg-main);
}

/* 泳道通用样式 */
.lane {
  display: flex;
  flex-direction: column;
  background-color: var(--bg-sidebar);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  transition: box-shadow var(--transition-normal);
}

.lane:hover {
  box-shadow: var(--shadow-xl);
}

/* 泳道尺寸 */
.lane-left {
  flex: 0 0 320px;
  min-width: 300px;
}

.lane-center {
  flex: 1;
  min-width: 420px;
}

.lane-right {
  flex: 0 0 300px;
  min-width: 280px;
}

/* 泳道头部 */
.lane-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: var(--bg-header);
  border-bottom: 1px solid var(--border-color);
}

.lane-icon {
  font-size: var(--font-size-h3);
  color: var(--primary-color);
}

.lane-title {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin: 0;
}

/* 泳道内容 */
.lane-body {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: var(--spacing-md);
  min-height: 0;
}

/* 响应式布局 */
@media (max-width: 1280px) {
  .lane-left {
    flex: 0 0 280px;
    min-width: 260px;
  }

  .lane-right {
    flex: 0 0 260px;
    min-width: 240px;
  }
}

@media (max-width: 960px) {
  .main-content {
    flex-direction: column;
    overflow-y: auto;
  }

  .lane-left,
  .lane-center,
  .lane-right {
    flex: none;
    min-width: auto;
  }

  .lane-left {
    max-height: 320px;
  }

  .lane-center {
    min-height: 400px;
  }

  .lane-right {
    min-height: 200px;
  }
}
</style>
