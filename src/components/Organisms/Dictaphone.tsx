import { createRef, useCallback, useEffect, useState } from 'react'

import IWindow from '@/@types/i-window'

// windowの型定義にIWindowを使う
declare const window: IWindow

const Dictaphone = () => {
  const [isStarted, setIsStarted] = useState(false)
  const [completed, setCompleted] = useState<string[]>([])
  // let completedScript: Array<string> = []
  const [processing, setProcessing] = useState<string>('')

  // ref を作成しスクロールさせたい場所にある Element にセット
  const ref = createRef<HTMLDivElement>()
  // このコールバックを呼び出して ref.current.scrollIntoView() を呼び出してスクロール
  const scrollToBottomOfList = useCallback(() => {
    ref!.current!.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    })
  }, [ref])

  useEffect(() => {
    scrollToBottomOfList()
  }, [])

  // 型定義はISpeechRecognitionConstructor
  const Recognition = window.webkitSpeechRecognition || window.SpeechRecognition

  // 型定義はISpeechRecognition
  const recognition = new Recognition()

  // 補完・型チェックができる！
  recognition.lang = 'ja-JP'
  recognition.interimResults = true
  recognition.continuous = false

  recognition.onsoundstart = () => {
    console.log('start')
  }
  recognition.onnomatch = () => {
    console.log('one more try')
  }
  recognition.onerror = () => {
    console.log('error')
  }
  recognition.onsoundend = () => {
    console.log('stop')
  }

  recognition.onend = () => {
    console.log('onend')
    recognition.stop()
    recognition.start()
  }

  recognition.onresult = (event) => {
    var results = event.results
    for (var i = event.resultIndex; i < results.length; i++) {
      const date = new Date()
      const script = results[i][0]?.transcript as string
      if (results[i].isFinal) {
        completed.push(`[${date.toLocaleString()}] ${script}`)
        setCompleted([...completed])
        setProcessing('')
        console.log('end!')
        window.scroll(0, 100000)
      } else {
        setProcessing(script)
        window.scroll(0, 100000)
      }
    }
  }

  const handleOnClick = () => {
    if (isStarted) {
      recognition.stop()
    } else {
      recognition.start()
    }
    setIsStarted(!isStarted)
  }

  const handleChange = (e: any) => {
    recognition.lang = e.target.value
  }

  return (
    <div>
      <div className='flex '>
        <select
          className='select select-primary w-full max-w-xs'
          // onChange={(e) => handleChange(e)}
        >
          <option value='ja-JP'>ja-JP</option>
          <option value='en-US'>en-US</option>
        </select>
        <button className='ml-5 btn' onClick={() => handleOnClick()}>
          {isStarted ? 'Recording' : 'Rec'}
        </button>
      </div>
      <div className='text-left w-full'>
        <ul>
          {completed.map((comp, key) => {
            return (
              <li key={key} className='mt-5'>
                {comp}
              </li>
            )
          })}
        </ul>
        <div className='my-10' ref={ref}>
          {processing}
        </div>
      </div>
    </div>
  )
}
export default Dictaphone
