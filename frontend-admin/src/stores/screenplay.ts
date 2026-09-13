import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Scene, SceneDetail, SoundEffect, Dialogue, GameplayTip, SystemPrompt } from '@/types'

// 模拟数据
const mockScenes: Scene[] = [
  {
    id: 1,
    title: '第一幕：神秘来信',
    location: '老宅书房',
    timeOfDay: '夜晚',
    description: '主角在深夜收到一封神秘来信，信中提到了一个尘封已久的家族秘密。昏暗的灯光下，古老的书房弥漫着陈旧的气息。'
  },
  {
    id: 2,
    title: '第二幕：追寻线索',
    location: '城市街道',
    timeOfDay: '清晨',
    description: '根据信中的线索，主角来到城市的老街区。晨光中，古老的建筑诉说着过去的故事。'
  },
  {
    id: 3,
    title: '第三幕：意外相遇',
    location: '咖啡馆',
    timeOfDay: '下午',
    description: '在一家复古咖啡馆中，主角遇到了一位神秘的老人，他似乎知道关于那封信的一切。'
  },
  {
    id: 4,
    title: '第四幕：真相浮现',
    location: '废弃工厂',
    timeOfDay: '黄昏',
    description: '跟随老人的指引，主角来到城郊的废弃工厂。夕阳的余晖中，尘封的真相即将揭开。'
  },
  {
    id: 5,
    title: '第五幕：最终抉择',
    location: '山顶古塔',
    timeOfDay: '深夜',
    description: '故事的终点在山顶的古塔。月光下，主角必须做出改变命运的抉择。'
  }
]

const mockSoundEffects: SoundEffect[] = [
  { id: 1, sceneId: 1, name: '雨声', type: 'background', duration: '循环', description: '窗外淅淅沥沥的雨声' },
  { id: 2, sceneId: 1, name: '钟声', type: 'effect', duration: '3秒', description: '老式座钟敲响午夜' },
  { id: 3, sceneId: 1, name: '悬疑配乐', type: 'music', duration: '循环', description: '低沉的弦乐营造紧张氛围' },
  { id: 4, sceneId: 2, name: '城市喧嚣', type: 'background', duration: '循环', description: '清晨街道的车流人声' },
  { id: 5, sceneId: 2, name: '脚步声', type: 'effect', duration: '持续', description: '主角行走的脚步声' },
  { id: 6, sceneId: 3, name: '咖啡馆音乐', type: 'music', duration: '循环', description: '轻柔的爵士乐' },
  { id: 7, sceneId: 3, name: '咖啡机声', type: 'effect', duration: '5秒', description: '咖啡机工作的声音' },
  { id: 8, sceneId: 4, name: '风声', type: 'background', duration: '循环', description: '穿过废墟的风声' },
  { id: 9, sceneId: 4, name: '金属碰撞', type: 'effect', duration: '2秒', description: '废弃机器的金属声' },
  { id: 10, sceneId: 5, name: '夜风', type: 'background', duration: '循环', description: '山顶呼啸的夜风' },
  { id: 11, sceneId: 5, name: '史诗配乐', type: 'music', duration: '循环', description: '宏大的交响乐章' }
]

const mockDialogues: Dialogue[] = [
  { id: 1, sceneId: 1, character: '主角', content: '这封信...是谁寄来的？', emotion: '疑惑', action: '拆开信封' },
  { id: 2, sceneId: 1, character: '旁白', content: '信纸泛黄，字迹却清晰可辨。', emotion: '平静' },
  { id: 3, sceneId: 1, character: '主角', content: '父亲从未提起过这些...', emotion: '震惊', action: '握紧信纸' },
  { id: 4, sceneId: 2, character: '主角', content: '就是这里，信中提到的地址。', emotion: '期待', action: '环顾四周' },
  { id: 5, sceneId: 2, character: '路人', content: '年轻人，你在找什么？', emotion: '好奇' },
  { id: 6, sceneId: 3, character: '神秘老人', content: '我等你很久了。', emotion: '平静', action: '放下咖啡杯' },
  { id: 7, sceneId: 3, character: '主角', content: '你认识我？', emotion: '警惕' },
  { id: 8, sceneId: 3, character: '神秘老人', content: '我认识你的父亲，也知道那封信的来历。', emotion: '深沉' },
  { id: 9, sceneId: 4, character: '主角', content: '这里就是当年的事发地点...', emotion: '沉重', action: '推开铁门' },
  { id: 10, sceneId: 4, character: '神秘老人', content: '真相就在前方，但你准备好面对了吗？', emotion: '严肃' },
  { id: 11, sceneId: 5, character: '主角', content: '我明白了...这就是父亲一直守护的秘密。', emotion: '释然' },
  { id: 12, sceneId: 5, character: '神秘老人', content: '现在，选择权在你手中。', emotion: '期待' }
]

const mockGameplayTips: GameplayTip[] = [
  { id: 1, sceneId: 1, type: 'interaction', title: '检查书桌', description: '点击书桌可以发现更多线索', priority: 'high' },
  { id: 2, sceneId: 1, type: 'puzzle', title: '密码锁', description: '需要找到正确的密码打开抽屉', priority: 'medium' },
  { id: 3, sceneId: 2, type: 'choice', title: '路线选择', description: '选择不同的路线会遇到不同的人物', priority: 'high' },
  { id: 4, sceneId: 2, type: 'interaction', title: '询问路人', description: '与路人对话可能获得有用信息', priority: 'low' },
  { id: 5, sceneId: 3, type: 'choice', title: '对话选项', description: '选择不同的回答会影响老人的态度', priority: 'high' },
  { id: 6, sceneId: 3, type: 'qte', title: '快速反应', description: '注意突发事件，需要快速按键', priority: 'medium' },
  { id: 7, sceneId: 4, type: 'puzzle', title: '机关解谜', description: '找到正确的开关顺序', priority: 'high' },
  { id: 8, sceneId: 4, type: 'interaction', title: '收集物品', description: '搜索区域收集关键道具', priority: 'medium' },
  { id: 9, sceneId: 5, type: 'choice', title: '最终抉择', description: '你的选择将决定故事的结局', priority: 'high' },
  { id: 10, sceneId: 5, type: 'qte', title: '关键时刻', description: '在关键时刻需要精准操作', priority: 'high' }
]

const mockSystemPrompts: SystemPrompt[] = [
  { id: 1, sceneId: 1, type: 'info', title: '场景提示', content: '使用鼠标点击物品进行互动', timestamp: '00:00' },
  { id: 2, sceneId: 1, type: 'success', title: '获得道具', content: '获得「神秘信件」', timestamp: '00:15' },
  { id: 3, sceneId: 2, type: 'info', title: '新区域', content: '已解锁新的探索区域', timestamp: '05:00' },
  { id: 4, sceneId: 2, type: 'warning', title: '注意', content: '某些选择可能影响后续剧情', timestamp: '05:30' },
  { id: 5, sceneId: 3, type: 'info', title: '对话开始', content: '与神秘老人的对话将影响剧情走向', timestamp: '10:00' },
  { id: 6, sceneId: 3, type: 'success', title: '好感度提升', content: '神秘老人对你的信任增加了', timestamp: '12:00' },
  { id: 7, sceneId: 4, type: 'warning', title: '危险区域', content: '前方区域可能存在危险', timestamp: '20:00' },
  { id: 8, sceneId: 4, type: 'error', title: '道具不足', content: '需要特定道具才能继续', timestamp: '22:00' },
  { id: 9, sceneId: 5, type: 'info', title: '最终章', content: '你即将做出改变命运的选择', timestamp: '30:00' },
  { id: 10, sceneId: 5, type: 'success', title: '成就解锁', content: '恭喜完成所有章节！', timestamp: '35:00' }
]

export const useScreenplayStore = defineStore('screenplay', () => {
  const scenes = ref<Scene[]>(mockScenes)
  const selectedSceneId = ref<number | null>(1)
  const isLoading = ref(false)

  const selectedScene = computed(() => {
    return scenes.value.find(s => s.id === selectedSceneId.value) || null
  })

  const sceneDetail = computed<SceneDetail | null>(() => {
    if (!selectedScene.value) return null

    const sceneId = selectedScene.value.id
    return {
      scene: selectedScene.value,
      soundEffects: mockSoundEffects.filter(s => s.sceneId === sceneId),
      dialogues: mockDialogues.filter(d => d.sceneId === sceneId),
      gameplayTips: mockGameplayTips.filter(g => g.sceneId === sceneId),
      systemPrompts: mockSystemPrompts.filter(p => p.sceneId === sceneId)
    }
  })

  const selectScene = async (id: number) => {
    isLoading.value = true
    // 模拟加载延迟
    await new Promise(resolve => setTimeout(resolve, 300))
    selectedSceneId.value = id
    isLoading.value = false
  }

  return {
    scenes,
    selectedSceneId,
    selectedScene,
    sceneDetail,
    isLoading,
    selectScene
  }
})
