# 影视剧本管理系统

## How to Run

### 使用 Docker Compose（推荐）

```bash
# 构建并启动服务
docker compose up --build

# 后台运行
docker compose up -d --build

# 停止服务
docker compose down
```

### 本地开发

```bash
cd frontend-admin

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## Services

| 服务名称 | 端口 | 描述 |
|---------|------|------|
| frontend-admin | 8081 | 影视剧本管理前端应用 |

## 测试账号

本项目为纯前端展示项目，无需登录账号。

## 业务背景

剧本按幕组织，每一幕要有地点、时间、剧情简介；和这一幕配套的还有四类素材：这一场要用的音效、台词、给玩家的玩法提示、以及运行时给玩家看的系统提示。现在这些东西分散在几个文档里，改一幕要来回对着找。

需要一个按幕维护的编辑界面：左栏列幕，选中一幕之后中栏跟着切到这一幕的四类素材，右栏先留空给后续用。音效要能在这里直接试听，音效本身是浏览器用 Web Audio 合成的（雨声、钟声、悬疑配乐这类），不需要音频文件，所以还要能多条同时放着听、能循环或限时播放，切换幕的时候自动停掉上一幕还没放完的。

## 项目介绍

这是一个基于 Vue 3 + TypeScript + Vite 构建的影视剧本管理系统，采用三栏泳道布局设计，支持场景选择与内容联动展示。

### 技术栈

- Vue 3 (Composition API)
- TypeScript
- Vite
- Element Plus (UI 组件库)
- Pinia (状态管理)
- Web Audio API (音效合成)
- Docker + Nginx

### 功能特性

- 📖 场景列表展示与选择
- 🎬 场景详情联动显示（音效、台词、玩法提示、系统提示）
- 🔊 音效播放功能
  - 支持多音效叠加播放
  - 使用 Web Audio API 实时合成音效
  - 支持循环播放和定时播放
  - 切换场景自动停止音效
  - 包含：雨声、钟声、悬疑配乐、城市喧嚣、脚步声、咖啡馆音乐、咖啡机声、风声、金属碰撞、史诗配乐等
- 🎨 视觉分层设计，卡片阴影与边框区分功能区
- 📱 响应式布局
- ✨ 完整的交互反馈（Hover 效果、Loading 状态、Toast 提示）

### Mock 数据说明

Mock 数据位于 `frontend-admin/src/stores/screenplay.ts` 文件中，包含以下模拟数据：

- `mockScenes` - 场景列表数据（5个场景）
- `mockSoundEffects` - 音效数据（11条）
- `mockDialogues` - 台词数据（12条）
- `mockGameplayTips` - 玩法提示数据（10条）
- `mockSystemPrompts` - 系统提示数据（10条）

### 音效系统说明

音效使用 Web Audio API 实时合成，位于 `frontend-admin/src/composables/useAudioPlayer.ts`：

| 音效名称 | 合成方式 |
|---------|---------|
| 雨声 | 低通滤波白噪声 |
| 钟声 | 多频率正弦波叠加衰减 |
| 悬疑配乐 | 低频锯齿波 + LFO调制 |
| 城市喧嚣 | 车流噪声 + 人声模拟 + 汽车喇叭 |
| 脚步声 | 低频正弦波冲击 + 接触噪声 |
| 咖啡馆音乐 | 爵士和弦进行 |
| 咖啡机声 | 研磨声 + 水泵声 + 蒸汽声 + 滴水声 |
| 风声 | LFO调制带通噪声 |
| 金属碰撞 | 低频撞击 + 沉闷泛音 + 震颤回响 |
| 史诗配乐 | 旋律 + 和弦进行 + 弦乐 + 定鼓 |

### 项目结构

```
├── docker-compose.yml          # Docker 编排配置
├── README.md                   # 项目文档
├── .gitignore                  # Git 忽略配置
└── frontend-admin/             # Vue 前端应用
    ├── Dockerfile              # Docker 构建文件（跨平台 ARM/X86）
    ├── nginx.conf              # Nginx 配置
    ├── package.json            # 项目依赖配置
    ├── tsconfig.json           # TypeScript 配置
    ├── vite.config.ts          # Vite 配置
    ├── index.html              # HTML 入口
    ├── public/                 # 静态资源
    │   └── favicon.svg         # 网站图标
    └── src/                    # 源代码
        ├── main.ts             # 应用入口
        ├── App.vue             # 根组件
        ├── vite-env.d.ts       # Vite 类型声明
        ├── assets/             # 静态资源
        │   └── styles/
        │       └── main.css    # 全局样式与设计变量
        ├── components/         # 公共组件
        │   ├── common/
        │   │   └── AppHeader.vue       # 顶部导航栏
        │   ├── detail/
        │   │   ├── DialogueList.vue    # 台词列表
        │   │   ├── GameplayTipList.vue # 玩法提示列表
        │   │   ├── SoundEffectList.vue # 音效列表（含播放控制）
        │   │   └── SystemPromptList.vue# 系统提示列表
        │   └── scene/
        │       └── SceneCard.vue       # 场景卡片
        ├── composables/        # 组合式函数
        │   └── useAudioPlayer.ts       # 音效播放器
        ├── layouts/            # 布局组件
        │   └── MainLayout.vue          # 三栏泳道布局
        ├── stores/             # Pinia 状态管理
        │   ├── index.ts
        │   └── screenplay.ts           # 剧本数据 Store
        ├── types/              # TypeScript 类型定义
        │   ├── index.ts
        │   └── screenplay.ts           # 剧本相关类型
        └── views/              # 页面视图
            ├── EmptyPanel.vue          # 右侧空白面板
            ├── SceneDetail.vue         # 场景详情（中间泳道）
            └── SceneList.vue           # 场景列表（左侧泳道）
```
