import { ref, onUnmounted } from 'vue'
import type { SoundEffect } from '@/types'

// 单个音效的播放实例
interface SoundInstance {
  id: number
  audioContext: AudioContext
  sourceNodes: (AudioBufferSourceNode | OscillatorNode)[]
  gainNode: GainNode
  loopInterval: number | null
  isLooping: boolean
}

// 音频播放器组合式函数 - 支持多音效叠加
export function useAudioPlayer() {
  // 正在播放的音效集合
  const playingIds = ref<Set<number>>(new Set())

  // 音效实例映射
  const soundInstances = new Map<number, SoundInstance>()

  // 解析播放时长
  const parseDuration = (duration: string): { ms: number; loop: boolean } => {
    if (duration === '循环' || duration === '持续') {
      return { ms: 0, loop: true }
    }
    const match = duration.match(/(\d+)/)
    if (match) {
      return { ms: parseInt(match[1]) * 1000, loop: false }
    }
    return { ms: 3000, loop: false }
  }

  // 创建白噪声
  const createNoiseBuffer = (ctx: AudioContext, duration: number): AudioBuffer => {
    const sampleRate = ctx.sampleRate
    const length = sampleRate * duration
    const buffer = ctx.createBuffer(2, length, sampleRate)

    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel)
      for (let i = 0; i < length; i++) {
        data[i] = Math.random() * 2 - 1
      }
    }
    return buffer
  }

  // 雨声合成
  const createRainSound = (ctx: AudioContext, instance: SoundInstance): AudioNode => {
    const noiseBuffer = createNoiseBuffer(ctx, 2)
    const source = ctx.createBufferSource()
    source.buffer = noiseBuffer
    source.loop = true

    const lowpass = ctx.createBiquadFilter()
    lowpass.type = 'lowpass'
    lowpass.frequency.value = 400

    const highpass = ctx.createBiquadFilter()
    highpass.type = 'highpass'
    highpass.frequency.value = 100

    const gain = ctx.createGain()
    gain.gain.value = 0.3

    source.connect(lowpass)
    lowpass.connect(highpass)
    highpass.connect(gain)

    source.start()
    instance.sourceNodes.push(source)

    return gain
  }

  // 钟声合成
  const createBellSound = (ctx: AudioContext, instance: SoundInstance): AudioNode => {
    const frequencies = [261.63, 329.63, 392, 523.25]
    const masterGain = ctx.createGain()
    masterGain.gain.value = 0.4

    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = freq

      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0.3 - i * 0.05, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3)

      osc.connect(gain)
      gain.connect(masterGain)
      osc.start()
      osc.stop(ctx.currentTime + 3)
      instance.sourceNodes.push(osc)
    })

    return masterGain
  }

  // 悬疑配乐合成
  const createSuspenseMusic = (ctx: AudioContext, instance: SoundInstance): AudioNode => {
    const masterGain = ctx.createGain()
    masterGain.gain.value = 0.2

    const baseFreqs = [65.41, 82.41, 98]
    baseFreqs.forEach(freq => {
      const osc = ctx.createOscillator()
      osc.type = 'sawtooth'
      osc.frequency.value = freq

      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.value = 200

      const gain = ctx.createGain()
      gain.gain.value = 0.15

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(masterGain)
      osc.start()
      instance.sourceNodes.push(osc)
    })

    const lfo = ctx.createOscillator()
    lfo.type = 'sine'
    lfo.frequency.value = 0.5
    const lfoGain = ctx.createGain()
    lfoGain.gain.value = 0.1
    lfo.connect(lfoGain)
    lfoGain.connect(masterGain.gain)
    lfo.start()
    instance.sourceNodes.push(lfo)

    return masterGain
  }

  // 城市喧嚣合成 - 模拟车流和人声
  const createCitySound = (ctx: AudioContext, instance: SoundInstance): AudioNode => {
    const masterGain = ctx.createGain()
    masterGain.gain.value = 0.4

    // 1. 低频车流声
    const trafficBuffer = createNoiseBuffer(ctx, 2)
    const traffic = ctx.createBufferSource()
    traffic.buffer = trafficBuffer
    traffic.loop = true

    const trafficLowpass = ctx.createBiquadFilter()
    trafficLowpass.type = 'lowpass'
    trafficLowpass.frequency.value = 200

    const trafficGain = ctx.createGain()
    trafficGain.gain.value = 0.35

    traffic.connect(trafficLowpass)
    trafficLowpass.connect(trafficGain)
    trafficGain.connect(masterGain)
    traffic.start()
    instance.sourceNodes.push(traffic)

    // 2. 人声嘈杂 - 使用调制噪声模拟人群说话
    const voiceBuffer = createNoiseBuffer(ctx, 2)
    const voice = ctx.createBufferSource()
    voice.buffer = voiceBuffer
    voice.loop = true

    // 人声频率范围的带通滤波
    const voiceBandpass = ctx.createBiquadFilter()
    voiceBandpass.type = 'bandpass'
    voiceBandpass.frequency.value = 400
    voiceBandpass.Q.value = 1.5

    // 第二个滤波器增强人声特征
    const voiceFormant = ctx.createBiquadFilter()
    voiceFormant.type = 'peaking'
    voiceFormant.frequency.value = 800
    voiceFormant.Q.value = 2
    voiceFormant.gain.value = 6

    // 音量调制 - 模拟说话的起伏
    const voiceLfo = ctx.createOscillator()
    voiceLfo.type = 'sine'
    voiceLfo.frequency.value = 3
    const voiceLfoGain = ctx.createGain()
    voiceLfoGain.gain.value = 0.08

    const voiceGain = ctx.createGain()
    voiceGain.gain.value = 0.25

    voiceLfo.connect(voiceLfoGain)
    voiceLfoGain.connect(voiceGain.gain)
    voiceLfo.start()
    instance.sourceNodes.push(voiceLfo)

    voice.connect(voiceBandpass)
    voiceBandpass.connect(voiceFormant)
    voiceFormant.connect(voiceGain)
    voiceGain.connect(masterGain)
    voice.start()
    instance.sourceNodes.push(voice)

    // 3. 第二层人声 - 更高频的女声特征
    const voice2Buffer = createNoiseBuffer(ctx, 2)
    const voice2 = ctx.createBufferSource()
    voice2.buffer = voice2Buffer
    voice2.loop = true

    const voice2Bandpass = ctx.createBiquadFilter()
    voice2Bandpass.type = 'bandpass'
    voice2Bandpass.frequency.value = 600
    voice2Bandpass.Q.value = 2

    const voice2Lfo = ctx.createOscillator()
    voice2Lfo.type = 'sine'
    voice2Lfo.frequency.value = 4.5
    const voice2LfoGain = ctx.createGain()
    voice2LfoGain.gain.value = 0.06

    const voice2Gain = ctx.createGain()
    voice2Gain.gain.value = 0.15

    voice2Lfo.connect(voice2LfoGain)
    voice2LfoGain.connect(voice2Gain.gain)
    voice2Lfo.start()
    instance.sourceNodes.push(voice2Lfo)

    voice2.connect(voice2Bandpass)
    voice2Bandpass.connect(voice2Gain)
    voice2Gain.connect(masterGain)
    voice2.start()
    instance.sourceNodes.push(voice2)

    // 4. 环境噪声
    const ambientBuffer = createNoiseBuffer(ctx, 2)
    const ambient = ctx.createBufferSource()
    ambient.buffer = ambientBuffer
    ambient.loop = true

    const ambientBandpass = ctx.createBiquadFilter()
    ambientBandpass.type = 'bandpass'
    ambientBandpass.frequency.value = 1000
    ambientBandpass.Q.value = 0.5

    const ambientGain = ctx.createGain()
    ambientGain.gain.value = 0.1

    ambient.connect(ambientBandpass)
    ambientBandpass.connect(ambientGain)
    ambientGain.connect(masterGain)
    ambient.start()
    instance.sourceNodes.push(ambient)

    // 5. 偶尔的汽车喇叭
    const playHorn = () => {
      if (!soundInstances.has(instance.id)) return

      const horn = ctx.createOscillator()
      horn.type = 'sawtooth'
      horn.frequency.value = 350 + Math.random() * 100

      const hornFilter = ctx.createBiquadFilter()
      hornFilter.type = 'lowpass'
      hornFilter.frequency.value = 800

      const hornGain = ctx.createGain()
      hornGain.gain.setValueAtTime(0, ctx.currentTime)
      hornGain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.05)
      hornGain.gain.setValueAtTime(0.15, ctx.currentTime + 0.3)
      hornGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4)

      horn.connect(hornFilter)
      hornFilter.connect(hornGain)
      hornGain.connect(masterGain)
      horn.start()
      horn.stop(ctx.currentTime + 0.5)
    }

    // 随机播放喇叭声
    const scheduleHorn = () => {
      if (!soundInstances.has(instance.id)) return
      const delay = 5000 + Math.random() * 8000
      setTimeout(() => {
        if (soundInstances.has(instance.id)) {
          playHorn()
          scheduleHorn()
        }
      }, delay)
    }
    scheduleHorn()

    return masterGain
  }

  // 脚步声合成 - 低沉的脚步声
  const createFootstepSound = (ctx: AudioContext, instance: SoundInstance): AudioNode => {
    const masterGain = ctx.createGain()
    masterGain.gain.value = 0.8

    let stepCount = 0

    const playStep = () => {
      if (!soundInstances.has(instance.id)) return

      const isLeftFoot = stepCount % 2 === 0
      stepCount++
      const now = ctx.currentTime

      // 1. 主要低频冲击 - 沉闷的"咚"声
      const thump = ctx.createOscillator()
      thump.type = 'sine'
      thump.frequency.setValueAtTime(isLeftFoot ? 55 : 60, now)
      thump.frequency.exponentialRampToValueAtTime(25, now + 0.15)

      const thumpGain = ctx.createGain()
      thumpGain.gain.setValueAtTime(1, now)
      thumpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2)

      thump.connect(thumpGain)
      thumpGain.connect(masterGain)
      thump.start(now)
      thump.stop(now + 0.25)

      // 2. 次低频 - 增加厚度
      const subThump = ctx.createOscillator()
      subThump.type = 'sine'
      subThump.frequency.setValueAtTime(35, now)
      subThump.frequency.exponentialRampToValueAtTime(18, now + 0.18)

      const subThumpGain = ctx.createGain()
      subThumpGain.gain.setValueAtTime(0.6, now)
      subThumpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22)

      subThump.connect(subThumpGain)
      subThumpGain.connect(masterGain)
      subThump.start(now)
      subThump.stop(now + 0.25)

      // 3. 中低频冲击
      const midThump = ctx.createOscillator()
      midThump.type = 'triangle'
      midThump.frequency.setValueAtTime(isLeftFoot ? 80 : 85, now)
      midThump.frequency.exponentialRampToValueAtTime(40, now + 0.1)

      const midThumpGain = ctx.createGain()
      midThumpGain.gain.setValueAtTime(0.4, now)
      midThumpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)

      midThump.connect(midThumpGain)
      midThumpGain.connect(masterGain)
      midThump.start(now)
      midThump.stop(now + 0.15)

      // 4. 轻微的接触噪声
      const contactBuffer = createNoiseBuffer(ctx, 0.04)
      const contact = ctx.createBufferSource()
      contact.buffer = contactBuffer

      const contactFilter = ctx.createBiquadFilter()
      contactFilter.type = 'lowpass'
      contactFilter.frequency.value = 500

      const contactGain = ctx.createGain()
      contactGain.gain.setValueAtTime(0.2, now)
      contactGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04)

      contact.connect(contactFilter)
      contactFilter.connect(contactGain)
      contactGain.connect(masterGain)
      contact.start(now)
      contact.stop(now + 0.05)
    }

    setTimeout(() => {
      if (soundInstances.has(instance.id)) {
        playStep()
      }
    }, 100)

    const scheduleNextStep = () => {
      if (!soundInstances.has(instance.id)) return
      const interval = 520 + Math.random() * 60
      instance.loopInterval = window.setTimeout(() => {
        playStep()
        scheduleNextStep()
      }, interval)
    }

    setTimeout(scheduleNextStep, 200)

    return masterGain
  }

  // 咖啡馆爵士乐合成
  const createJazzMusic = (ctx: AudioContext, instance: SoundInstance): AudioNode => {
    const masterGain = ctx.createGain()
    masterGain.gain.value = 0.2

    const chords = [
      [261.63, 329.63, 392],
      [293.66, 369.99, 440],
      [329.63, 415.30, 493.88],
      [349.23, 440, 523.25]
    ]

    let chordIndex = 0
    const playChord = () => {
      if (!soundInstances.has(instance.id)) return

      chords[chordIndex].forEach(freq => {
        const osc = ctx.createOscillator()
        osc.type = 'triangle'
        osc.frequency.value = freq

        const gain = ctx.createGain()
        gain.gain.setValueAtTime(0.1, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.8)

        osc.connect(gain)
        gain.connect(masterGain)
        osc.start()
        osc.stop(ctx.currentTime + 2)
      })
      chordIndex = (chordIndex + 1) % chords.length
    }

    playChord()
    instance.loopInterval = window.setInterval(playChord, 2000)

    return masterGain
  }

  // 咖啡机声合成 - 更真实的咖啡机工作声
  const createCoffeeMachineSound = (ctx: AudioContext, instance: SoundInstance): AudioNode => {
    const masterGain = ctx.createGain()
    masterGain.gain.value = 0.4

    // 1. 研磨声 - 前2秒
    const grindBuffer = createNoiseBuffer(ctx, 2)
    const grind = ctx.createBufferSource()
    grind.buffer = grindBuffer

    const grindBandpass = ctx.createBiquadFilter()
    grindBandpass.type = 'bandpass'
    grindBandpass.frequency.value = 800
    grindBandpass.Q.value = 2

    const grindGain = ctx.createGain()
    grindGain.gain.setValueAtTime(0, ctx.currentTime)
    grindGain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.2)
    grindGain.gain.setValueAtTime(0.4, ctx.currentTime + 1.8)
    grindGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 2)

    // 研磨声的震动效果
    const grindLfo = ctx.createOscillator()
    grindLfo.type = 'sine'
    grindLfo.frequency.value = 15
    const grindLfoGain = ctx.createGain()
    grindLfoGain.gain.value = 200
    grindLfo.connect(grindLfoGain)
    grindLfoGain.connect(grindBandpass.frequency)
    grindLfo.start()
    grindLfo.stop(ctx.currentTime + 2)

    grind.connect(grindBandpass)
    grindBandpass.connect(grindGain)
    grindGain.connect(masterGain)
    grind.start()
    grind.stop(ctx.currentTime + 2)
    instance.sourceNodes.push(grind)

    // 2. 水泵声 - 低频嗡嗡声 (2-4秒)
    const pump = ctx.createOscillator()
    pump.type = 'sawtooth'
    pump.frequency.value = 60

    const pumpFilter = ctx.createBiquadFilter()
    pumpFilter.type = 'lowpass'
    pumpFilter.frequency.value = 150

    const pumpGain = ctx.createGain()
    pumpGain.gain.setValueAtTime(0, ctx.currentTime + 2)
    pumpGain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 2.3)
    pumpGain.gain.setValueAtTime(0.25, ctx.currentTime + 4)
    pumpGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 4.3)

    pump.connect(pumpFilter)
    pumpFilter.connect(pumpGain)
    pumpGain.connect(masterGain)
    pump.start(ctx.currentTime + 2)
    pump.stop(ctx.currentTime + 4.5)
    instance.sourceNodes.push(pump)

    // 3. 蒸汽/出水声 - 高频嘶嘶声 (2.5-5秒)
    const steamBuffer = createNoiseBuffer(ctx, 3)
    const steam = ctx.createBufferSource()
    steam.buffer = steamBuffer

    const steamHighpass = ctx.createBiquadFilter()
    steamHighpass.type = 'highpass'
    steamHighpass.frequency.value = 3000

    const steamLowpass = ctx.createBiquadFilter()
    steamLowpass.type = 'lowpass'
    steamLowpass.frequency.value = 8000

    const steamGain = ctx.createGain()
    steamGain.gain.setValueAtTime(0, ctx.currentTime + 2.5)
    steamGain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 2.8)
    steamGain.gain.setValueAtTime(0.3, ctx.currentTime + 4.5)
    steamGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 5)

    steam.connect(steamHighpass)
    steamHighpass.connect(steamLowpass)
    steamLowpass.connect(steamGain)
    steamGain.connect(masterGain)
    steam.start(ctx.currentTime + 2.5)
    steam.stop(ctx.currentTime + 5)
    instance.sourceNodes.push(steam)

    // 4. 滴水声 - 最后的几滴
    const playDrip = (time: number) => {
      const drip = ctx.createOscillator()
      drip.type = 'sine'
      drip.frequency.setValueAtTime(1200 + Math.random() * 400, time)
      drip.frequency.exponentialRampToValueAtTime(400, time + 0.1)

      const dripGain = ctx.createGain()
      dripGain.gain.setValueAtTime(0.15, time)
      dripGain.gain.exponentialRampToValueAtTime(0.001, time + 0.15)

      drip.connect(dripGain)
      dripGain.connect(masterGain)
      drip.start(time)
      drip.stop(time + 0.2)
    }

    playDrip(ctx.currentTime + 4.2)
    playDrip(ctx.currentTime + 4.5)
    playDrip(ctx.currentTime + 4.9)

    return masterGain
  }

  // 风声合成
  const createWindSound = (ctx: AudioContext, instance: SoundInstance): AudioNode => {
    const masterGain = ctx.createGain()
    masterGain.gain.value = 0.3

    const noiseBuffer = createNoiseBuffer(ctx, 2)
    const noise = ctx.createBufferSource()
    noise.buffer = noiseBuffer
    noise.loop = true

    const bandpass = ctx.createBiquadFilter()
    bandpass.type = 'bandpass'
    bandpass.frequency.value = 500
    bandpass.Q.value = 1

    const lfo = ctx.createOscillator()
    lfo.type = 'sine'
    lfo.frequency.value = 0.2
    const lfoGain = ctx.createGain()
    lfoGain.gain.value = 300
    lfo.connect(lfoGain)
    lfoGain.connect(bandpass.frequency)
    lfo.start()
    instance.sourceNodes.push(lfo)

    noise.connect(bandpass)
    bandpass.connect(masterGain)
    noise.start()
    instance.sourceNodes.push(noise)

    return masterGain
  }

  // 金属碰撞声合成 - 废弃工厂的沉闷金属声
  const createMetalSound = (ctx: AudioContext, instance: SoundInstance): AudioNode => {
    const masterGain = ctx.createGain()
    masterGain.gain.value = 0.6

    const now = ctx.currentTime

    // 1. 沉闷的主撞击声 - 生锈金属的低沉声音
    const strike = ctx.createOscillator()
    strike.type = 'sine'
    strike.frequency.setValueAtTime(180, now)
    strike.frequency.exponentialRampToValueAtTime(60, now + 0.4)

    const strikeGain = ctx.createGain()
    strikeGain.gain.setValueAtTime(0.7, now)
    strikeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6)

    strike.connect(strikeGain)
    strikeGain.connect(masterGain)
    strike.start(now)
    strike.stop(now + 0.8)
    instance.sourceNodes.push(strike)

    // 2. 低频共振 - 大型金属物体的共振
    const resonance = ctx.createOscillator()
    resonance.type = 'sine'
    resonance.frequency.setValueAtTime(80, now)
    resonance.frequency.exponentialRampToValueAtTime(40, now + 0.5)

    const resonanceGain = ctx.createGain()
    resonanceGain.gain.setValueAtTime(0.5, now)
    resonanceGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8)

    resonance.connect(resonanceGain)
    resonanceGain.connect(masterGain)
    resonance.start(now)
    resonance.stop(now + 1)
    instance.sourceNodes.push(resonance)

    // 3. 沉闷的中频泛音 - 不清脆，有些浑浊
    const midTones = [220, 330, 440]
    midTones.forEach((freq, i) => {
      const tone = ctx.createOscillator()
      tone.type = 'triangle'
      tone.frequency.value = freq

      // 低通滤波让声音更沉闷
      const toneFilter = ctx.createBiquadFilter()
      toneFilter.type = 'lowpass'
      toneFilter.frequency.value = 400
      toneFilter.Q.value = 1

      const toneGain = ctx.createGain()
      const amplitude = 0.25 / (i + 1)
      toneGain.gain.setValueAtTime(amplitude, now)
      toneGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8 - i * 0.1)

      tone.connect(toneFilter)
      toneFilter.connect(toneGain)
      toneGain.connect(masterGain)
      tone.start(now)
      tone.stop(now + 1)
      instance.sourceNodes.push(tone)
    })

    // 4. 撞击噪声 - 生锈金属的粗糙质感
    const noiseBuffer = createNoiseBuffer(ctx, 0.15)
    const noise = ctx.createBufferSource()
    noise.buffer = noiseBuffer

    const noiseFilter = ctx.createBiquadFilter()
    noiseFilter.type = 'bandpass'
    noiseFilter.frequency.value = 300
    noiseFilter.Q.value = 0.8

    const noiseGain = ctx.createGain()
    noiseGain.gain.setValueAtTime(0.4, now)
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1)

    noise.connect(noiseFilter)
    noiseFilter.connect(noiseGain)
    noiseGain.connect(masterGain)
    noise.start(now)
    noise.stop(now + 0.15)
    instance.sourceNodes.push(noise)

    // 5. 金属震颤 - 碰撞后的低沉震动
    const rattle = ctx.createOscillator()
    rattle.type = 'sawtooth'
    rattle.frequency.value = 120

    const rattleFilter = ctx.createBiquadFilter()
    rattleFilter.type = 'lowpass'
    rattleFilter.frequency.value = 250

    // 震颤调制
    const rattleLfo = ctx.createOscillator()
    rattleLfo.type = 'sine'
    rattleLfo.frequency.value = 12
    const rattleLfoGain = ctx.createGain()
    rattleLfoGain.gain.value = 20
    rattleLfo.connect(rattleLfoGain)
    rattleLfoGain.connect(rattle.frequency)

    const rattleGain = ctx.createGain()
    rattleGain.gain.setValueAtTime(0, now + 0.1)
    rattleGain.gain.linearRampToValueAtTime(0.2, now + 0.2)
    rattleGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5)

    rattle.connect(rattleFilter)
    rattleFilter.connect(rattleGain)
    rattleGain.connect(masterGain)
    rattle.start(now + 0.1)
    rattle.stop(now + 1.8)
    rattleLfo.start(now + 0.1)
    rattleLfo.stop(now + 1.8)
    instance.sourceNodes.push(rattle)
    instance.sourceNodes.push(rattleLfo)

    // 6. 回声/余音 - 废弃空间的回响
    const echo = ctx.createOscillator()
    echo.type = 'sine'
    echo.frequency.value = 100

    const echoFilter = ctx.createBiquadFilter()
    echoFilter.type = 'lowpass'
    echoFilter.frequency.value = 200

    const echoGain = ctx.createGain()
    echoGain.gain.setValueAtTime(0, now + 0.3)
    echoGain.gain.linearRampToValueAtTime(0.15, now + 0.4)
    echoGain.gain.exponentialRampToValueAtTime(0.001, now + 1.8)

    echo.connect(echoFilter)
    echoFilter.connect(echoGain)
    echoGain.connect(masterGain)
    echo.start(now + 0.3)
    echo.stop(now + 2)
    instance.sourceNodes.push(echo)

    return masterGain
  }

  // 史诗配乐合成 - 带旋律的交响乐章
  const createEpicMusic = (ctx: AudioContext, instance: SoundInstance): AudioNode => {
    const masterGain = ctx.createGain()
    masterGain.gain.value = 0.3

    // 音符频率映射
    const notes: Record<string, number> = {
      'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'A3': 220.00, 'B3': 246.94,
      'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
      'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'G5': 783.99
    }

    // 史诗旋律 - 类似电影配乐的上升旋律
    const melody = [
      { note: 'C4', duration: 0.5 },
      { note: 'E4', duration: 0.5 },
      { note: 'G4', duration: 0.5 },
      { note: 'C5', duration: 1 },
      { note: 'B4', duration: 0.5 },
      { note: 'G4', duration: 0.5 },
      { note: 'A4', duration: 1 },
      { note: 'G4', duration: 0.5 },
      { note: 'E4', duration: 0.5 },
      { note: 'F4', duration: 0.5 },
      { note: 'E4', duration: 0.5 },
      { note: 'D4', duration: 1 },
      { note: 'C4', duration: 0.5 },
      { note: 'E4', duration: 0.5 },
      { note: 'G4', duration: 0.5 },
      { note: 'C5', duration: 1.5 },
    ]

    // 和弦进行
    const chords = [
      ['C3', 'E3', 'G3'],  // C major
      ['C3', 'E3', 'G3'],
      ['A3', 'C4', 'E4'],  // A minor
      ['F3', 'A3', 'C4'],  // F major
      ['G3', 'B3', 'D4'],  // G major
      ['C3', 'E3', 'G3'],  // C major
    ]

    let chordIndex = 0
    let currentTime = ctx.currentTime

    // 播放和弦（弦乐）
    const playChord = (chordNotes: string[], startTime: number, duration: number) => {
      chordNotes.forEach(noteName => {
        const freq = notes[noteName]
        if (!freq) return

        // 使用锯齿波模拟弦乐
        const osc = ctx.createOscillator()
        osc.type = 'sawtooth'
        osc.frequency.value = freq

        const filter = ctx.createBiquadFilter()
        filter.type = 'lowpass'
        filter.frequency.value = 800

        const gain = ctx.createGain()
        gain.gain.setValueAtTime(0, startTime)
        gain.gain.linearRampToValueAtTime(0.12, startTime + 0.1)
        gain.gain.setValueAtTime(0.12, startTime + duration - 0.1)
        gain.gain.linearRampToValueAtTime(0, startTime + duration)

        osc.connect(filter)
        filter.connect(gain)
        gain.connect(masterGain)
        osc.start(startTime)
        osc.stop(startTime + duration + 0.1)
      })
    }

    // 播放旋律音符（铜管/弦乐主旋律）
    const playMelodyNote = (noteName: string, startTime: number, duration: number) => {
      const freq = notes[noteName]
      if (!freq) return

      // 主旋律 - 正弦波 + 三角波叠加
      const osc1 = ctx.createOscillator()
      osc1.type = 'sine'
      osc1.frequency.value = freq

      const osc2 = ctx.createOscillator()
      osc2.type = 'triangle'
      osc2.frequency.value = freq

      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0, startTime)
      gain.gain.linearRampToValueAtTime(0.25, startTime + 0.05)
      gain.gain.setValueAtTime(0.25, startTime + duration * 0.7)
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration)

      osc1.connect(gain)
      osc2.connect(gain)
      gain.connect(masterGain)
      osc1.start(startTime)
      osc1.stop(startTime + duration + 0.1)
      osc2.start(startTime)
      osc2.stop(startTime + duration + 0.1)
    }

    // 定鼓节奏
    const playDrum = (startTime: number) => {
      const drum = ctx.createOscillator()
      drum.type = 'sine'
      drum.frequency.setValueAtTime(80, startTime)
      drum.frequency.exponentialRampToValueAtTime(40, startTime + 0.2)

      const drumGain = ctx.createGain()
      drumGain.gain.setValueAtTime(0.4, startTime)
      drumGain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3)

      drum.connect(drumGain)
      drumGain.connect(masterGain)
      drum.start(startTime)
      drum.stop(startTime + 0.4)
    }

    // 编排音乐
    const playMusic = () => {
      if (!soundInstances.has(instance.id)) return

      currentTime = ctx.currentTime
      let time = currentTime

      // 播放一轮旋律和和弦
      melody.forEach((item, i) => {
        playMelodyNote(item.note, time, item.duration * 0.9)

        // 每2拍换一个和弦
        if (i % 4 === 0 && chordIndex < chords.length) {
          playChord(chords[chordIndex], time, 2)
          playDrum(time)
          chordIndex = (chordIndex + 1) % chords.length
        }

        time += item.duration * 0.5 // 加快节奏
      })

      // 循环播放
      const totalDuration = melody.reduce((sum, item) => sum + item.duration * 0.5, 0)
      instance.loopInterval = window.setTimeout(() => {
        chordIndex = 0
        playMusic()
      }, totalDuration * 1000)
    }

    playMusic()

    return masterGain
  }

  // 根据音效名称获取对应的合成器
  type SoundGenerator = (ctx: AudioContext, instance: SoundInstance) => AudioNode

  const getSoundGenerator = (name: string): SoundGenerator | null => {
    const soundMap: Record<string, SoundGenerator> = {
      '雨声': createRainSound,
      '钟声': createBellSound,
      '悬疑配乐': createSuspenseMusic,
      '城市喧嚣': createCitySound,
      '脚步声': createFootstepSound,
      '咖啡馆音乐': createJazzMusic,
      '咖啡机声': createCoffeeMachineSound,
      '风声': createWindSound,
      '金属碰撞': createMetalSound,
      '夜风': createWindSound,
      '史诗配乐': createEpicMusic
    }
    return soundMap[name] || null
  }

  // 检查音效是否正在播放
  const isPlaying = (id: number): boolean => {
    return playingIds.value.has(id)
  }

  // 检查音效是否循环播放
  const isLooping = (id: number): boolean => {
    const instance = soundInstances.get(id)
    return instance?.isLooping ?? false
  }

  // 播放音效（支持叠加）
  const playSound = (item: SoundEffect): boolean => {
    // 如果已在播放，则停止该音效
    if (playingIds.value.has(item.id)) {
      stopSound(item.id)
      return false
    }

    const generator = getSoundGenerator(item.name)
    if (!generator) {
      console.warn(`未找到音效: ${item.name}`)
      return false
    }

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const gainNode = audioContext.createGain()
      gainNode.gain.value = 1
      gainNode.connect(audioContext.destination)

      const { ms, loop } = parseDuration(item.duration)

      // 创建音效实例
      const instance: SoundInstance = {
        id: item.id,
        audioContext,
        sourceNodes: [],
        gainNode,
        loopInterval: null,
        isLooping: loop
      }

      soundInstances.set(item.id, instance)

      const soundNode = generator(audioContext, instance)
      soundNode.connect(gainNode)

      // 更新播放状态
      playingIds.value = new Set([...playingIds.value, item.id])

      // 非循环音效自动停止
      if (!loop && ms > 0) {
        setTimeout(() => {
          stopSound(item.id)
        }, ms)
      }

      return true
    } catch (error) {
      console.error('播放失败:', error)
      return false
    }
  }

  // 停止指定音效
  const stopSound = (id: number) => {
    const instance = soundInstances.get(id)
    if (!instance) return

    // 清除循环定时器
    if (instance.loopInterval) {
      clearInterval(instance.loopInterval)
    }

    // 停止所有音源
    instance.sourceNodes.forEach(node => {
      try {
        node.stop()
        node.disconnect()
      } catch (e) {
        // 忽略已停止的错误
      }
    })

    // 断开增益节点
    instance.gainNode.disconnect()

    // 关闭音频上下文
    instance.audioContext.close()

    // 移除实例
    soundInstances.delete(id)

    // 更新播放状态
    const newSet = new Set(playingIds.value)
    newSet.delete(id)
    playingIds.value = newSet
  }

  // 停止所有音效
  const stopAllSounds = () => {
    const ids = [...playingIds.value]
    ids.forEach(id => stopSound(id))
  }

  // 获取当前播放数量
  const playingCount = () => playingIds.value.size

  // 组件卸载时清理
  onUnmounted(() => {
    stopAllSounds()
  })

  return {
    playingIds,
    isPlaying,
    isLooping,
    playSound,
    stopSound,
    stopAllSounds,
    playingCount
  }
}
