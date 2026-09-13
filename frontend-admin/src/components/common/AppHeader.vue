<script setup lang="ts">
// 移除所有功能逻辑，只保留展示
</script>

<template>
  <header class="app-header" role="banner">
    <!-- Logo 区域 -->
    <div class="header-brand">
      <div class="logo">
        <el-icon class="logo-icon" :size="26"><VideoCamera /></el-icon>
        <span class="logo-text">影视剧本管理系统</span>
      </div>
    </div>

    <!-- 项目信息 -->
    <div class="header-info">
      <el-tag class="project-tag" effect="dark" round>
        <el-icon><Folder /></el-icon>
        <span>当前项目：神秘来信</span>
      </el-tag>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-lg);
  padding: var(--spacing-sm) var(--spacing-lg);
  background-color: var(--bg-header);
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow-md);
  min-height: 60px;
}

/* Logo 区域 */
.header-brand {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.logo-icon {
  color: var(--primary-color);
}

.logo-text {
  font-size: var(--font-size-h3);
  font-weight: var(--font-weight-bold);
  color: var(--primary-color);
}

/* 项目信息 */
.header-info {
  display: flex;
  align-items: center;
}

.project-tag {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-small);
  background-color: var(--bg-card);
  border-color: var(--border-color);
}

.project-tag .el-icon {
  font-size: var(--font-size-body);
}

/* 响应式 */
@media (max-width: 768px) {
  .header-info {
    display: none;
  }

  .logo-text {
    display: none;
  }
}
</style>
