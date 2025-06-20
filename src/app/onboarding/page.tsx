'use client'

import { collection, doc, getDoc, getDocs, limit, query, where } from 'firebase/firestore'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  Instagram,
  Heart,
  Shield,
  Check,
  X,
  AlertCircle,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { useAuthContext } from '@/lib/contexts/AuthContext'
import { db } from '@/lib/firebase'
import {
  saveOnboardingResponses,
  createOrUpdateUserProfile,
  updateInstagramConnection,
  getOnboardingQuestions,
  Question,
} from '@/lib/onboarding'


export default function OnboardingPage() {
  const router = useRouter()
  const { user, loading: authLoading, error: authError } = useAuthContext()
  const [questions, setQuestions] = useState<Question[]>([])
  const [questionsLoading, setQuestionsLoading] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(1)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showInstagramDialog, setShowInstagramDialog] = useState(false)
  const [instagramConnected, setInstagramConnected] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch questions from Firebase on component mount
  useEffect(() => {
    async function fetchQuestions() {
      try {
        setQuestionsLoading(true)
        console.log('📋 Fetching onboarding questions...')
        const fetchedQuestions = await getOnboardingQuestions()
        setQuestions(fetchedQuestions)
        console.log(`✅ Loaded ${fetchedQuestions.length} questions`)
      } catch (error) {
        console.error('❌ Error loading questions:', error)
        setError('Erro ao carregar perguntas. Tente recarregar a página.')
      } finally {
        setQuestionsLoading(false)
      }
    }

    fetchQuestions()
  }, [])

  useEffect(() => {
    console.log('📋 Onboarding page loaded for user:', user?.uid)
  }, [user])

  // Show loading state while checking authentication or loading questions
  if (authLoading || questionsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-jona-green-50 to-jona-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full jona-gradient flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold mb-2">
            {authLoading ? 'Carregando...' : 'Carregando perguntas...'}
          </h3>
          <div className="animate-spin w-6 h-6 border-2 border-jona-green-600 border-t-transparent rounded-full mx-auto"></div>
        </div>
      </div>
    )
  }

  // Show error state if authentication failed
  if (authError || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-jona-green-50 to-jona-blue-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h3 className="text-lg font-semibold mb-2">Erro de Autenticação</h3>
          <p className="text-muted-foreground mb-4">{authError || 'Usuário não autenticado'}</p>
          <Button onClick={() => router.push('/login')}>Fazer Login</Button>
        </div>
      </div>
    )
  }

  // Show error state if no questions loaded
  if (!questionsLoading && questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-jona-green-50 to-jona-blue-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-orange-500" />
          <h3 className="text-lg font-semibold mb-2">Perguntas não encontradas</h3>
          <p className="text-muted-foreground mb-4">
            Não foi possível carregar as perguntas do onboarding.
          </p>
          <Button onClick={() => window.location.reload()}>Tentar Novamente</Button>
        </div>
      </div>
    )
  }

  const progress = (currentQuestion / questions.length) * 100
  const currentAnswer = answers[currentQuestion] || ''
  const isLastQuestion = currentQuestion === questions.length
  const canProceed = currentAnswer.trim().length >= 10

  const handleAnswerChange = (value: string) => {
    if (value.length <= 500) {
      setAnswers(prev => ({
        ...prev,
        [currentQuestion]: value,
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

  const handleInstagramConnect = async () => {
    try {
      // In a real app, this would initiate OAuth 2.0 flow with Meta Graph API
      console.log('Connecting to Instagram...')

      // For now, we'll simulate the connection
      if (user) {
        await updateInstagramConnection(user.uid, true, {
          username: 'user_instagram', // This would come from Instagram API
          profilePicture: user.photoURL || '',
          followersCount: 0,
        })
      }

      setInstagramConnected(true)
      setShowInstagramDialog(false)
      handleFinishOnboarding()
    } catch (error) {
      console.error('Error connecting Instagram:', error)
      setError('Erro ao conectar Instagram. Tente novamente.')
    }
  }

  const handleSkipInstagram = () => {
    setShowInstagramDialog(false)
    handleFinishOnboarding()
  }

  const handleFinishOnboarding = async () => {
    if (!user) {
      setError('Usuário não autenticado')
      return
    }

    // Validate that all questions have been answered
    const unansweredQuestions = questions.filter(
      q => !answers[q.id] || answers[q.id].trim().length === 0
    )
    if (unansweredQuestions.length > 0) {
      setError(
        `Por favor, responda todas as perguntas. Faltam: ${unansweredQuestions.length} pergunta(s)`
      )
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      console.log('💾 Saving onboarding responses:', {
        userId: user.uid,
        totalAnswers: Object.keys(answers).length,
        totalQuestions: questions.length,
        answers: Object.entries(answers).map(([id, answer]) => ({
          questionId: id,
          questionTitle: questions.find(q => q.id === parseInt(id))?.title,
          answerLength: answer.length,
        })),
        instagramConnected,
        timestamp: new Date().toISOString(),
      })

      // Save onboarding responses to Firebase
      await saveOnboardingResponses({
        userId: user.uid,
        answers,
        questions,
        instagramConnected,
      })

      console.log('✅ Onboarding responses saved to Firebase')

      // Update user profile to mark onboarding as completed
      await createOrUpdateUserProfile({
        onboardingCompleted: true,
        instagramConnected,
      })

      console.log('✅ User profile updated - onboarding marked as completed')
      console.log('🎉 Onboarding process completed successfully!')

      router.push('/dashboard')
    } catch (error) {
      console.error('❌ Error saving onboarding:', error)
      setError('Erro ao salvar respostas. Tente novamente.')
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
                <h1 className="text-lg font-bold jona-text-gradient">JonA</h1>
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
        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div>
              <p className="text-red-800 text-sm font-medium">Erro</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setError(null)} className="ml-auto">
              <X className="w-4 h-4" />
            </Button>
          </motion.div>
        )}

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
                    onChange={e => handleAnswerChange(e.target.value)}
                    maxLength={500}
                    rows={6}
                    className="resize-none text-base leading-relaxed"
                    aria-label={`Resposta para: ${currentQuestionData?.title}`}
                  />
                  <div className="flex justify-between items-center text-sm">
                    <span
                      className={`${
                        currentAnswer.trim().length >= 10
                          ? 'text-jona-green-600'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {currentAnswer.trim().length >= 10
                        ? '✓ Resposta completa'
                        : `Mínimo: ${currentAnswer.trim().length}/10 caracteres`}
                    </span>
                    <span
                      className={`${
                        currentAnswer.length > 450 ? 'text-orange-600' : 'text-muted-foreground'
                      }`}
                    >
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
                    aria-label={isLastQuestion ? 'Finalizar onboarding' : 'Próxima pergunta'}
                  >
                    {isLastQuestion ? 'Finalizar' : 'Próximo'}
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
              Conecte seu Instagram para enriquecer seu perfil e receber sugestões mais precisas de
              conexões baseadas em seus interesses.
            </p>

            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Shield className="w-4 h-4 text-jona-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Seus dados são criptografados e seguros</span>
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
            className="bg-white rounded-lg p-8 text-center max-w-md mx-4"
          >
            <div className="w-12 h-12 mx-auto mb-4 rounded-full jona-gradient flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Finalizando seu perfil...</h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>💾 Salvando {Object.keys(answers).length} respostas</p>
              <p>👤 Atualizando perfil do usuário</p>
              <p>
                {instagramConnected ? '📱 Conectando Instagram' : '⏭️ Prosseguindo sem Instagram'}
              </p>
            </div>
            <div className="mt-4">
              <div className="animate-spin w-6 h-6 border-2 border-jona-green-600 border-t-transparent rounded-full mx-auto"></div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
