'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Heart, Mail, Lock, Eye, EyeOff, AlertCircle, User, Chrome, Check, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthContext } from '@/lib/contexts/AuthContext'
import { signUpWithEmail, signInWithGoogle } from '@/lib/auth'

interface PasswordStrength {
  score: number
  label: string
  color: string
  requirements: {
    length: boolean
    lowercase: boolean
    uppercase: boolean
    number: boolean
    special: boolean
  }
}

export default function SignUpPage() {
  const { user, loading: authLoading, redirectAfterAuth } = useAuthContext()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    label: '',
    color: '',
    requirements: {
      length: false,
      lowercase: false,
      uppercase: false,
      number: false,
      special: false,
    },
  })

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && user) {
      // Use the new redirectAfterAuth function which handles onboarding status
      redirectAfterAuth()
      return
    }
  }, [user, authLoading, redirectAfterAuth])

  // Calculate password strength
  useEffect(() => {
    const password = formData.password
    const requirements = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    }

    const score = Object.values(requirements).filter(Boolean).length
    let label = ''
    let color = ''

    if (score === 0) {
      label = ''
      color = ''
    } else if (score <= 2) {
      label = 'Fraca'
      color = 'text-red-600'
    } else if (score <= 3) {
      label = 'Média'
      color = 'text-yellow-600'
    } else if (score <= 4) {
      label = 'Boa'
      color = 'text-blue-600'
    } else {
      label = 'Forte'
      color = 'text-green-600'
    }

    setPasswordStrength({ score, label, color, requirements })
  }, [formData.password])

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-jona-green-50 to-jona-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full jona-gradient flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div className="animate-spin w-6 h-6 border-2 border-jona-green-600 border-t-transparent rounded-full mx-auto"></div>
        </div>
      </div>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (error) setError(null)
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Por favor, digite seu nome.')
      return false
    }

    if (!formData.email.trim()) {
      setError('Por favor, digite seu email.')
      return false
    }

    if (!formData.password) {
      setError('Por favor, digite uma senha.')
      return false
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem.')
      return false
    }

    return true
  }

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setError(null)

    try {
      await signUpWithEmail({
        email: formData.email,
        password: formData.password,
        name: formData.name,
      })
      console.log('✅ Email sign-up successful, calling redirectAfterAuth')
      // Give a small delay to ensure auth state is updated
      setTimeout(() => {
        redirectAfterAuth()
      }, 100)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao criar conta')
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setIsLoading(true)
    setError(null)

    try {
      await signInWithGoogle()
      console.log('✅ Google sign-up successful, calling redirectAfterAuth')
      // Give a small delay to ensure auth state is updated
      setTimeout(() => {
        redirectAfterAuth()
      }, 100)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao criar conta com Google')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-jona-green-50 to-jona-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-8 h-8 rounded-full jona-gradient flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-lg font-bold jona-text-gradient">JonA</h1>
              <p className="text-xs text-muted-foreground">Crie sua conta</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-lg border-0">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl text-jona-green-700 mb-2">Criar Conta</CardTitle>
              <p className="text-muted-foreground text-sm">
                Junte-se ao JonA e comece sua jornada de conexões autênticas
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Error Display */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3"
                  >
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <p className="text-red-700 text-sm">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Sign Up Form */}
              <form onSubmit={handleEmailSignUp} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Nome Completo
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Seu nome completo"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Crie uma senha forte"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-10 pr-10"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Força da senha:</span>
                        <span className={`text-xs font-medium ${passwordStrength.color}`}>
                          {passwordStrength.label}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div
                          className={`h-1 rounded-full transition-all duration-300 ${
                            passwordStrength.score <= 2
                              ? 'bg-red-500'
                              : passwordStrength.score <= 3
                              ? 'bg-yellow-500'
                              : passwordStrength.score <= 4
                              ? 'bg-blue-500'
                              : 'bg-green-500'
                          }`}
                          style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-xs">
                        <div className="flex items-center space-x-1">
                          {passwordStrength.requirements.length ? (
                            <Check className="w-3 h-3 text-green-600" />
                          ) : (
                            <X className="w-3 h-3 text-gray-400" />
                          )}
                          <span
                            className={
                              passwordStrength.requirements.length
                                ? 'text-green-600'
                                : 'text-gray-400'
                            }
                          >
                            8+ caracteres
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {passwordStrength.requirements.number ? (
                            <Check className="w-3 h-3 text-green-600" />
                          ) : (
                            <X className="w-3 h-3 text-gray-400" />
                          )}
                          <span
                            className={
                              passwordStrength.requirements.number
                                ? 'text-green-600'
                                : 'text-gray-400'
                            }
                          >
                            Número
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {passwordStrength.requirements.lowercase ? (
                            <Check className="w-3 h-3 text-green-600" />
                          ) : (
                            <X className="w-3 h-3 text-gray-400" />
                          )}
                          <span
                            className={
                              passwordStrength.requirements.lowercase
                                ? 'text-green-600'
                                : 'text-gray-400'
                            }
                          >
                            Minúscula
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {passwordStrength.requirements.uppercase ? (
                            <Check className="w-3 h-3 text-green-600" />
                          ) : (
                            <X className="w-3 h-3 text-gray-400" />
                          )}
                          <span
                            className={
                              passwordStrength.requirements.uppercase
                                ? 'text-green-600'
                                : 'text-gray-400'
                            }
                          >
                            Maiúscula
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                    Confirmar Senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Digite a senha novamente"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="pl-10 pr-10"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-xs text-red-600 flex items-center space-x-1">
                      <X className="w-3 h-3" />
                      <span>As senhas não coincidem</span>
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-jona-green-600 hover:bg-jona-green-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Criando conta...</span>
                    </div>
                  ) : (
                    'Criar Conta'
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">ou</span>
                </div>
              </div>

              {/* Google Sign Up */}
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleSignUp}
                disabled={isLoading}
                className="w-full"
              >
                <Chrome className="w-4 h-4 mr-2" />
                Continuar com Google
              </Button>

              {/* Terms */}
              <p className="text-xs text-muted-foreground text-center leading-relaxed">
                Ao criar uma conta, você concorda com nossos{' '}
                <Link href="/terms" className="text-jona-green-600 hover:underline">
                  Termos de Serviço
                </Link>{' '}
                e{' '}
                <Link href="/privacy" className="text-jona-green-600 hover:underline">
                  Política de Privacidade
                </Link>
                .
              </p>

              {/* Sign In Link */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Já tem uma conta?{' '}
                  <Link
                    href="/login"
                    className="text-jona-green-600 hover:text-jona-green-700 hover:underline font-medium"
                  >
                    Entrar
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
