import { useState } from 'react'
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts'

const AudioMeter = () => {
  const [globalsum, setSum] = useState(0)

  const [buffer, setBuffer] = useState([{ buf: 0 }])

  // 変数
  var audioContext: any
  var mediaStreamSource
  var meter
  var s = [0, 10, 200, 40]

  // ボリューム検出の開始
  const beginDetect = () => {
    // オーディオストリームの生成
    audioContext = new window.AudioContext()

    // 音声入力の開始
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        // メディアストリームソースとメーターの生成
        mediaStreamSource = audioContext.createMediaStreamSource(stream)
        meter = createAudioMeter(audioContext)
        mediaStreamSource.connect(meter)
      })
    }
  }

  // メーターの生成
  const createAudioMeter = (
    audioContext: any,
    clipLevel?: number,
    averaging?: number,
    clipLag?: number
  ) => {
    // メーターの生成
    const processor = audioContext.createScriptProcessor(512)
    processor.onaudioprocess = volumeAudioProcess
    processor.clipping = false
    processor.lastClip = 0
    processor.volume = 0
    processor.clipLevel = clipLevel || 0.98
    processor.averaging = averaging || 0.95
    processor.clipLag = clipLag || 750
    processor.connect(audioContext.destination)

    // クリップチェック時に呼ばれる
    processor.checkClipping = function () {
      if (!this.clipping) {
        return false
      }
      if (this.lastClip + this.clipLag < window.performance.now()) {
        this.clipping = false
      }
      return this.clipping
    }

    // シャットダウン時に呼ばれる
    processor.shutdown = function () {
      this.disconnect()
      this.onaudioprocess = null
    }

    return processor
  }

  // オーディオ処理時に呼ばれる
  const volumeAudioProcess = (event: any) => {
    const buf = event.inputBuffer.getChannelData(0) as Array<number>
    const bufLength = buf.length
    let sum = 0
    let x

    let obj = []
    // 平均ボリュームの計算
    for (var i = 0; i < bufLength; i++) {
      x = buf[i]
      sum += x * x
      obj[i] = {
        buf: Math.abs(buf[i]),
        // buf: buf[i]
      }
    }
    s = buf
    setSum(sum)
    setBuffer(obj)
  }

  return (
    <div>
      <button className='btn' onClick={beginDetect}>
        audiometer
      </button>
      {/* <div>{globalsum}</div> */}
      <div className=''>
        <LineChart
          width={400}
          height={400}
          data={buffer}
          margin={{ top: 5, right: 5, left: -50, bottom: 5 }}
        >
          <XAxis axisLine={false} tick={false} />
          <Tooltip />
          {/* <CartesianGrid stroke='#f5f5f5' /> */}
          <YAxis
            type='number'
            domain={[0, 0.6]}
            axisLine={false}
            tick={false}
          />
          <Line
            type='monotone'
            dataKey='buf'
            stroke='#ff7300'
            yAxisId={0}
            strokeWidth={2}
          />
        </LineChart>
      </div>
    </div>
  )
}

export default AudioMeter
