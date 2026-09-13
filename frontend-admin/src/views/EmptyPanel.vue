<template>
  <div class="empty-panel">
    <el-empty
      description="暂无内容"
      :image-size="80"
    >
      <template #image>
        <el-icon class="empty-icon"><Box /></el-icon>
      </template>
    </el-empty>
  </div>
</template>

<style scoped>
.empty-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: var(--spacing-xl);
}

.empty-icon {
  font-size: 80px;
  color: var(--text-muted);
}
</style>
