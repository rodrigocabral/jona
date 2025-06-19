'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { BookOpen, Mic, MicOff, Play, Pause, Save, Lightbulb } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import BottomNavigation from '@/components/BottomNavigation'

type Emotion = 'happy' | 'sad' | 'neutral' | 'excited' | 'anxious' | 'calm'

const emotions = [
  { id: 'happy', emoji: '😊', label: 'Feliz' },
  { id: 'excited', emoji: '🤩', label: 'Animado' },
  { id: 'calm', emoji: '😌', label: 'Calmo' },
  { id: 'neutral', emoji: '😐', label: 'Neutro' },
  { id: 'anxious', emoji: '😰', label: 'Ansioso' },
  { id: 'sad', emoji: '😢', label: 'Triste' }
]

// Mock diary entries
const mockEntries = [
  {
    id: '1',
    emotion: 'happy' as Emotion,
    text: 'Hoje foi um dia incrível! Consegui me conectar com pessoas que realmente compartilham dos meus valores. Me sinto mais esperançoso sobre fazer novas amizades.',
    timestamp: new Date('2024-01-15T18:30:00'),
    audioUrl: null as string | null
  },
  {
    id: '2',
    emotion: 'anxious' as Emotion,
    text: 'Estou um pouco nervoso para o encontro de amanhã. Espero que corra tudo bem e que consigamos ter uma boa conversa.',
    timestamp: new Date('2024-01-14T21:15:00'),
    audioUrl: null as string | null
  }
]

export default function DiaryPage() {
  const [entries, setEntries] = useState(mockEntries)
  const [currentEmotion, setCurrentEmotion] = useState<Emotion | null>(null)
  const [currentText, setCurrentText] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      
      const chunks: BlobPart[] = []
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data)
      }
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' })
        setAudioBlob(blob)
        stream.getTracks().forEach(track => track.stop())
      }
      
      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error starting recording:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const playAudio = () => {
    if (audioBlob) {
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)
      audioRef.current = audio
      
      audio.onended = () => {
        setIsPlayingAudio(false)
        URL.revokeObjectURL(audioUrl)
      }
      
      audio.play()
      setIsPlayingAudio(true)
    }
  }

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlayingAudio(false)
    }
  }

  const saveEntry = () => {
    if (currentEmotion && (currentText.trim() || audioBlob)) {
      const newEntry = {
        id: Date.now().toString(),
        emotion: currentEmotion,
        text: currentText.trim(),
        timestamp: new Date(),
        audioUrl: audioBlob ? URL.createObjectURL(audioBlob) : null
      }
      
      setEntries(prev => [newEntry, ...prev])
      setCurrentEmotion(null)
      setCurrentText('')
      setAudioBlob(null)
      setShowSuggestions(true)
      
      // Auto-hide suggestions after 5 seconds
      setTimeout(() => setShowSuggestions(false), 5000)
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const getEmotionData = (emotion: Emotion) => {
    return emotions.find(e => e.id === emotion)
  }

  const getSuggestions = (emotion: Emotion) => {
    const suggestions = {
      happy: ['Compartilhe sua alegria com alguém especial', 'Registre este momento positivo', 'Pratique gratidão'],
      excited: ['Canalize essa energia em algo produtivo', 'Compartilhe seu entusiasmo', 'Planeje algo especial'],
      calm: ['Aproveite este momento de paz', 'Pratique meditação', 'Reflita sobre o dia'],
      neutral: ['Que tal uma atividade relaxante?', 'Conecte-se com a natureza', 'Leia algo inspirador'],
      anxious: ['Pratique respiração profunda', 'Converse com um amigo', 'Faça uma caminhada'],
      sad: ['Seja gentil consigo mesmo', 'Busque apoio de pessoas queridas', 'Pratique autocuidado']
    }
    return suggestions[emotion] || []
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-purple-700">Diário Emocional</h1>
          <p className="text-sm text-muted-foreground">Como você está se sentindo hoje?</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Emotion Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Como você está se sentindo?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {emotions.map((emotion) => (
                  <button
                    key={emotion.id}
                    onClick={() => setCurrentEmotion(emotion.id as Emotion)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      currentEmotion === emotion.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                    aria-label={`Selecionar emoção: ${emotion.label}`}
                  >
                    <div className="text-3xl mb-2">{emotion.emoji}</div>
                    <div className="text-sm font-medium">{emotion.label}</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Entry Form */}
        {currentEmotion && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span className="text-2xl">{getEmotionData(currentEmotion)?.emoji}</span>
                  <span>Conte como você está se sentindo</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Escreva sobre seus sentimentos, pensamentos ou o que aconteceu hoje..."
                  value={currentText}
                  onChange={(e) => setCurrentText(e.target.value)}
                  maxLength={500}
                  rows={4}
                  className="resize-none"
                />
                <div className="text-right text-sm text-muted-foreground">
                  {currentText.length}/500 caracteres
                </div>

                {/* Audio Recording */}
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Gravação de áudio (opcional)</h4>
                  <div className="flex items-center space-x-3">
                    {!isRecording ? (
                      <Button
                        onClick={startRecording}
                        variant="outline"
                        size="sm"
                        aria-label="Iniciar gravação"
                      >
                        <Mic className="w-4 h-4 mr-2" />
                        Gravar (máx. 1 min)
                      </Button>
                    ) : (
                      <Button
                        onClick={stopRecording}
                        variant="destructive"
                        size="sm"
                        aria-label="Parar gravação"
                      >
                        <MicOff className="w-4 h-4 mr-2" />
                        Parar
                      </Button>
                    )}

                    {audioBlob && (
                      <Button
                        onClick={isPlayingAudio ? pauseAudio : playAudio}
                        variant="outline"
                        size="sm"
                        aria-label={isPlayingAudio ? "Pausar áudio" : "Reproduzir áudio"}
                      >
                        {isPlayingAudio ? (
                          <Pause className="w-4 h-4 mr-2" />
                        ) : (
                          <Play className="w-4 h-4 mr-2" />
                        )}
                        {isPlayingAudio ? 'Pausar' : 'Reproduzir'}
                      </Button>
                    )}
                  </div>
                </div>

                <Button
                  onClick={saveEntry}
                  disabled={!currentEmotion || (!currentText.trim() && !audioBlob)}
                  className="w-full"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Entrada
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Suggestions */}
        <AnimatePresence>
          {showSuggestions && currentEmotion && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <Lightbulb className="w-6 h-6 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-2">Sugestões para você</h3>
                      <ul className="space-y-1 text-sm">
                        {getSuggestions(currentEmotion).map((suggestion, index) => (
                          <li key={index}>• {suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Previous Entries */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-purple-600" />
                <span>Entradas Anteriores</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {entries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 rounded-lg border bg-white/50"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{getEmotionData(entry.emotion)?.emoji}</span>
                      <span className="font-medium">{getEmotionData(entry.emotion)?.label}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(entry.timestamp)}
                    </span>
                  </div>
                  <p className="text-gray-700">{entry.text}</p>
                  {entry.audioUrl && (
                    <div className="mt-2">
                      <audio controls className="w-full">
                        <source src={entry.audioUrl} type="audio/wav" />
                        Seu navegador não suporta o elemento de áudio.
                      </audio>
                    </div>
                  )}
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <BottomNavigation currentPage="diary" />
    </div>
  )
} 