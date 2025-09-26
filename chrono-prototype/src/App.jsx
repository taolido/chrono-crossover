import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Sword, Shield, Zap, Clock, Users, MapPin } from 'lucide-react'
import './App.css'

// ゲームの状態管理
const GAME_STATES = {
  FIELD: 'field',
  BATTLE: 'battle',
  TIME_TRAVEL: 'time_travel'
}

const TIME_PERIODS = {
  PREHISTORIC: { name: '原始時代', color: 'bg-green-600', icon: '🦕' },
  ANCIENT: { name: '古代文明', color: 'bg-blue-600', icon: '🏛️' },
  MEDIEVAL: { name: '中世', color: 'bg-purple-600', icon: '⚔️' },
  PRESENT: { name: '現代', color: 'bg-gray-600', icon: '🏙️' },
  FUTURE: { name: '未来', color: 'bg-red-600', icon: '🤖' }
}

// キャラクターデータ
const CHARACTERS = {
  chrono: {
    name: 'クロノ',
    hp: 100,
    maxHp: 100,
    mp: 50,
    maxMp: 50,
    atb: 0,
    maxAtb: 100,
    position: { x: 2, y: 2 },
    element: 'lightning',
    skills: ['回転斬り', 'サンダー']
  },
  lilia: {
    name: 'リリア',
    hp: 80,
    maxHp: 80,
    mp: 80,
    maxMp: 80,
    atb: 0,
    maxAtb: 100,
    position: { x: 1, y: 2 },
    element: 'water',
    skills: ['ヒール', 'アイス']
  },
  gaion: {
    name: 'ガイオン',
    hp: 120,
    maxHp: 120,
    mp: 30,
    maxMp: 30,
    atb: 0,
    maxAtb: 100,
    position: { x: 3, y: 2 },
    element: 'earth',
    skills: ['大地の怒り', 'アースクエイク']
  }
}

// 敵データ
const ENEMIES = [
  {
    id: 1,
    name: 'スライム',
    hp: 30,
    maxHp: 30,
    position: { x: 2, y: 0 },
    atb: 0,
    maxAtb: 80
  },
  {
    id: 2,
    name: 'ゴブリン',
    hp: 50,
    maxHp: 50,
    position: { x: 1, y: 0 },
    atb: 0,
    maxAtb: 90
  }
]

function App() {
  const [gameState, setGameState] = useState(GAME_STATES.FIELD)
  const [currentPeriod, setCurrentPeriod] = useState('PRESENT')
  const [characters, setCharacters] = useState(CHARACTERS)
  const [enemies, setEnemies] = useState([])
  const [selectedCharacter, setSelectedCharacter] = useState(null)
  const [battleLog, setBattleLog] = useState([])
  const [isATBRunning, setIsATBRunning] = useState(false)
  
  const intervalRef = useRef(null)

  // ATBシステム
  useEffect(() => {
    if (gameState === GAME_STATES.BATTLE && isATBRunning) {
      intervalRef.current = setInterval(() => {
        setCharacters(prev => {
          const updated = { ...prev }
          Object.keys(updated).forEach(key => {
            if (updated[key].atb < updated[key].maxAtb) {
              updated[key].atb = Math.min(updated[key].atb + 2, updated[key].maxAtb)
            }
          })
          return updated
        })

        setEnemies(prev => prev.map(enemy => ({
          ...enemy,
          atb: enemy.atb < enemy.maxAtb ? Math.min(enemy.atb + 1.5, enemy.maxAtb) : enemy.atb
        })))
      }, 100)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [gameState, isATBRunning])

  // フィールド画面
  const FieldView = () => (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 to-green-400 p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-6 h-6" />
              フィールド探索 - {TIME_PERIODS[currentPeriod].name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {Object.entries(characters).map(([key, char]) => (
                <Card key={key} className="p-4">
                  <div className="text-center">
                    <h3 className="font-bold">{char.name}</h3>
                    <div className="mt-2">
                      <div className="text-sm text-gray-600">HP</div>
                      <Progress value={(char.hp / char.maxHp) * 100} className="h-2" />
                      <div className="text-xs">{char.hp}/{char.maxHp}</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            <div className="flex gap-4 justify-center">
              <Button 
                onClick={() => startBattle()}
                className="flex items-center gap-2"
              >
                <Sword className="w-4 h-4" />
                戦闘開始
              </Button>
              <Button 
                onClick={() => setGameState(GAME_STATES.TIME_TRAVEL)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Clock className="w-4 h-4" />
                時のゲート
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  // 戦闘画面
  const BattleView = () => (
    <div className="min-h-screen bg-gradient-to-b from-red-900 to-black p-4">
      <div className="max-w-6xl mx-auto">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Sword className="w-6 h-6" />
              戦闘中
              <Button 
                onClick={() => setIsATBRunning(!isATBRunning)}
                variant={isATBRunning ? "destructive" : "default"}
                size="sm"
                className="ml-auto"
              >
                {isATBRunning ? '一時停止' : '開始'}
              </Button>
            </CardTitle>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 味方キャラクター */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                パーティ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(characters).map(([key, char]) => (
                  <div 
                    key={key} 
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedCharacter === key ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedCharacter(key)}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold">{char.name}</h3>
                      <Badge variant={char.atb >= char.maxAtb ? "default" : "secondary"}>
                        {char.atb >= char.maxAtb ? '行動可能' : 'チャージ中'}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-sm">
                          <span>HP</span>
                          <span>{char.hp}/{char.maxHp}</span>
                        </div>
                        <Progress value={(char.hp / char.maxHp) * 100} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm">
                          <span>ATB</span>
                          <span>{Math.floor(char.atb)}/{char.maxAtb}</span>
                        </div>
                        <Progress value={(char.atb / char.maxAtb) * 100} className="h-2 bg-yellow-200" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 敵キャラクター */}
          <Card>
            <CardHeader>
              <CardTitle>敵</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {enemies.map((enemy) => (
                  <div key={enemy.id} className="p-3 border rounded-lg bg-red-50">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold">{enemy.name}</h3>
                      <Badge variant={enemy.atb >= enemy.maxAtb ? "destructive" : "secondary"}>
                        {enemy.atb >= enemy.maxAtb ? '行動準備' : 'チャージ中'}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-sm">
                          <span>HP</span>
                          <span>{enemy.hp}/{enemy.maxHp}</span>
                        </div>
                        <Progress value={(enemy.hp / enemy.maxHp) * 100} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm">
                          <span>ATB</span>
                          <span>{Math.floor(enemy.atb)}/{enemy.maxAtb}</span>
                        </div>
                        <Progress value={(enemy.atb / enemy.maxAtb) * 100} className="h-2 bg-red-200" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 行動コマンド */}
        {selectedCharacter && characters[selectedCharacter].atb >= characters[selectedCharacter].maxAtb && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>{characters[selectedCharacter].name}の行動</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 flex-wrap">
                <Button onClick={() => executeAction('attack')}>
                  <Sword className="w-4 h-4 mr-2" />
                  攻撃
                </Button>
                <Button onClick={() => executeAction('skill')} variant="outline">
                  <Zap className="w-4 h-4 mr-2" />
                  わざ
                </Button>
                <Button onClick={() => executeAction('defend')} variant="outline">
                  <Shield className="w-4 h-4 mr-2" />
                  防御
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 戦闘ログ */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>戦闘ログ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-32 overflow-y-auto bg-gray-50 p-3 rounded text-sm">
              {battleLog.map((log, index) => (
                <div key={index} className="mb-1">{log}</div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-4 text-center">
          <Button onClick={() => endBattle()} variant="outline">
            戦闘終了
          </Button>
        </div>
      </div>
    </div>
  )

  // タイムトラベル画面
  const TimeTravelView = () => (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-blue-900 p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-center">
              <Clock className="w-6 h-6" />
              時のゲート
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <p className="text-lg mb-4">どの時代に向かいますか？</p>
              <p className="text-sm text-gray-600">現在: {TIME_PERIODS[currentPeriod].name}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(TIME_PERIODS).map(([key, period]) => (
                <Card 
                  key={key}
                  className={`cursor-pointer transition-all hover:scale-105 ${
                    currentPeriod === key ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => travelToTime(key)}
                >
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-2">{period.icon}</div>
                    <h3 className="font-bold text-lg">{period.name}</h3>
                    <div className={`w-full h-2 ${period.color} rounded mt-2`}></div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <Button onClick={() => setGameState(GAME_STATES.FIELD)} variant="outline">
                フィールドに戻る
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  // 戦闘開始
  const startBattle = () => {
    setEnemies(ENEMIES.map(enemy => ({ ...enemy })))
    setGameState(GAME_STATES.BATTLE)
    setBattleLog(['戦闘が開始されました！'])
    setIsATBRunning(true)
    
    // ATBゲージをリセット
    setCharacters(prev => {
      const updated = { ...prev }
      Object.keys(updated).forEach(key => {
        updated[key].atb = 0
      })
      return updated
    })
  }

  // 戦闘終了
  const endBattle = () => {
    setGameState(GAME_STATES.FIELD)
    setEnemies([])
    setSelectedCharacter(null)
    setBattleLog([])
    setIsATBRunning(false)
  }

  // 行動実行
  const executeAction = (actionType) => {
    if (!selectedCharacter) return

    const character = characters[selectedCharacter]
    let logMessage = ''

    switch (actionType) {
      case 'attack':
        if (enemies.length > 0) {
          const damage = Math.floor(Math.random() * 20) + 10
          setEnemies(prev => prev.map(enemy => 
            enemy.id === 1 ? { ...enemy, hp: Math.max(0, enemy.hp - damage) } : enemy
          ))
          logMessage = `${character.name}の攻撃！ ${damage}のダメージ！`
        }
        break
      case 'skill':
        logMessage = `${character.name}が${character.skills[0]}を使用！`
        break
      case 'defend':
        logMessage = `${character.name}は身を守っている。`
        break
    }

    // ATBゲージをリセット
    setCharacters(prev => ({
      ...prev,
      [selectedCharacter]: { ...prev[selectedCharacter], atb: 0 }
    }))

    setBattleLog(prev => [...prev, logMessage])
    setSelectedCharacter(null)

    // 敵が倒されたかチェック
    setTimeout(() => {
      setEnemies(prev => prev.filter(enemy => enemy.hp > 0))
    }, 100)
  }

  // タイムトラベル
  const travelToTime = (period) => {
    setCurrentPeriod(period)
    setGameState(GAME_STATES.FIELD)
  }

  return (
    <div className="min-h-screen">
      {gameState === GAME_STATES.FIELD && <FieldView />}
      {gameState === GAME_STATES.BATTLE && <BattleView />}
      {gameState === GAME_STATES.TIME_TRAVEL && <TimeTravelView />}
    </div>
  )
}

export default App
