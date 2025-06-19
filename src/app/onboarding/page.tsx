'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ChevronLeft, ChevronRight, Instagram, Heart, Shield, Check, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const questions = [
  {
    id: 1,
    title: "O que mais te motiva no dia a dia?",
    subtitle: "Conte sobre suas paixões, hobbies ou atividades que te fazem sentir vivo(a)."
  },
  {
    id: 2,
    title: "Como você gosta de passar seu tempo livre?",
    subtitle: "Descreva suas atividades favoritas, lugares que gosta de frequentar ou como relaxa."
  },
  {
    id: 3,
    title: "Quais valores são mais importantes para você?",
    subtitle: "Fale sobre princípios, crenças ou causas que guiam suas decisões e relacionamentos."
  },
  {
    id: 4,
    title: "Como você se conecta melhor com outras pessoas?",
    subtitle: "Descreva situações, ambientes ou tipos de conversa onde você se sente mais à vontade."
  },
  {
    id: 5,
    title: "O que você busca em uma amizade verdadeira?",
    subtitle: "Conte sobre qualidades, experiências ou momentos que considera importantes em relacionamentos."
  },
  {
    id: 6,
    title: "Como você imagina seu futuro ideal?",
    subtitle: "Compartilhe seus sonhos, objetivos ou como gostaria que sua vida fosse daqui alguns anos."
  }
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(1)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showInstagramDialog, setShowInstagramDialog] = useState(false)
  const [instagramConnected, setInstagramConnected] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const progress = (currentQuestion / questions.length) * 100
  const currentAnswer = answers[currentQuestion] || ''
  const isLastQuestion = currentQuestion === questions.length
  const canProceed = currentAnswer.trim().length > 0

  const handleAnswerChange = (value: string) => {
    if (value.length <= 500) {
      setAnswers(prev => ({
        ...prev,
        [currentQuestion]: value
      }))
    }
  }

  const handleNext = () => {
    if (canProceed) {
      if (isLastQuestion) {
        setShowInstagramDialog(true)
      } else {
        setCurrentQuestion(prev => prev + 1)
      }
    }
  }

  const handleBack = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const handleInstagramConnect = () => {
    // In a real app, this would initiate OAuth 2.0 flow with Meta Graph API
    console.log('Connecting to Instagram...')
    setInstagramConnected(true)
    setShowInstagramDialog(false)
    handleFinishOnboarding()
  }

  const handleSkipInstagram = () => {
    setShowInstagramDialog(false)
    handleFinishOnboarding()
  }

  const handleFinishOnboarding = async () => {
    setIsSubmitting(true)
    
    // Simulate API call to save encrypted responses
    try {
      console.log('Saving onboarding responses:', {
        answers,
        instagramConnected,
        timestamp: new Date().toISOString()
      })
      
      // In a real app, this would:
      // 1. Encrypt responses with AES-256
      // 2. Save to MongoDB
      // 3. Mark user as onboarding completed
      
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      router.push('/dashboard')
    } catch (error) {
      console.error('Error saving onboarding:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentQuestionData = questions.find(q => q.id === currentQuestion)

  return (
    <div className="min-h-screen bg-gradient-to-br from-jona-green-50 to-jona-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full jona-gradient flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold jona-text-gradient">Jona</h1>
                <p className="text-xs text-muted-foreground">Mapa de Compatibilidade</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-jona-green-600">
                {currentQuestion}/{questions.length}
              </div>
              <div className="text-xs text-muted-foreground">Perguntas</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="shadow-lg border-0">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl text-jona-green-700 mb-2">
                  {currentQuestionData?.title}
                </CardTitle>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {currentQuestionData?.subtitle}
                </p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Textarea
                    placeholder="Compartilhe seus pensamentos aqui..."
                    value={currentAnswer}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    maxLength={500}
                    rows={6}
                    className="resize-none text-base leading-relaxed"
                    aria-label={`Resposta para: ${currentQuestionData?.title}`}
                  />
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">
                      Mínimo: 10 caracteres
                    </span>
                    <span className={`${currentAnswer.length > 450 ? 'text-orange-600' : 'text-muted-foreground'}`}>
                      {currentAnswer.length}/500
                    </span>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-4">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={currentQuestion === 1}
                    aria-label="Voltar para pergunta anterior"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Voltar
                  </Button>
                  
                  <Button
                    onClick={handleNext}
                    disabled={!canProceed}
                    className="bg-jona-green-600 hover:bg-jona-green-700"
                    aria-label={isLastQuestion ? "Finalizar onboarding" : "Próxima pergunta"}
                  >
                    {isLastQuestion ? "Finalizar" : "Próximo"}
                    {!isLastQuestion && <ChevronRight className="w-4 h-4 ml-2" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Instagram Integration Dialog */}
      <Dialog open={showInstagramDialog} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center space-x-2 mb-2">
              <Instagram className="w-6 h-6 text-pink-600" />
              <DialogTitle>Conectar Instagram</DialogTitle>
            </div>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm leading-relaxed">
              Conecte seu Instagram para enriquecer seu perfil e receber sugestões 
              mais precisas de conexões baseadas em seus interesses.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Shield className="w-4 h-4 text-jona-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Seus dados são anonimizados e criptografados</span>
              </div>
              <div className="flex items-start space-x-2">
                <Shield className="w-4 h-4 text-jona-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Não publicamos nada em seu perfil</span>
              </div>
              <div className="flex items-start space-x-2">
                <Shield className="w-4 h-4 text-jona-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Você pode desconectar a qualquer momento</span>
              </div>
            </div>
            
            <div className="flex space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={handleSkipInstagram}
                className="flex-1"
                disabled={isSubmitting}
                aria-label="Pular integração com Instagram"
              >
                <X className="w-4 h-4 mr-2" />
                Pular
              </Button>
              <Button
                onClick={handleInstagramConnect}
                className="flex-1 bg-pink-600 hover:bg-pink-700"
                disabled={isSubmitting}
                aria-label="Conectar Instagram"
              >
                <Instagram className="w-4 h-4 mr-2" />
                Conectar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg p-8 text-center"
          >
            <div className="w-12 h-12 mx-auto mb-4 rounded-full jona-gradient flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Finalizando seu perfil...</h3>
            <p className="text-muted-foreground text-sm">
              Estamos preparando suas sugestões de conexão
            </p>
            <div className="mt-4">
              <div className="animate-spin w-6 h-6 border-2 border-jona-green-600 border-t-transparent rounded-full mx-auto"></div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
} 