// 场景类型定义
export interface Scene {
  id: number
  title: string
  location: string
  timeOfDay: string
  description: string
  thumbnail?: string
}

// 音效类型
export interface SoundEffect {
  id: number
  sceneId: number
  name: string
  type: 'background' | 'effect' | 'music'
  duration: string
  description: string
}

// 台词类型
export interface Dialogue {
  id: number
  sceneId: number
  character: string
  content: string
  emotion?: string
  action?: string
}

// 玩法提示类型
export interface GameplayTip {
  id: number
  sceneId: number
  type: 'interaction' | 'choice' | 'puzzle' | 'qte'
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
}

// 系统提示类型
export interface SystemPrompt {
  id: number
  sceneId: number
  type: 'info' | 'warning' | 'success' | 'error'
  title: string
  content: string
  timestamp?: string
}

// 场景详情（包含所有关联内容）
export interface SceneDetail {
  scene: Scene
  soundEffects: SoundEffect[]
  dialogues: Dialogue[]
  gameplayTips: GameplayTip[]
  systemPrompts: SystemPrompt[]
}
