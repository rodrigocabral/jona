'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle,
  Chrome,
  Eye,
  EyeOff,
  Heart,
  Lock,
  Mail,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { resetPassword, signInWithEmail, signInWithGoogle } from '@/lib/auth';
import { useAuthContext } from '@/lib/contexts/AuthContext';

export default function LoginPage() {
  const { user, loading: authLoading, redirectAfterAuth } = useAuthContext();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && user) {
      // Use the new redirectAfterAuth function which handles onboarding status
      redirectAfterAuth();
      return;
    }
  }, [user, authLoading, redirectAfterAuth]);

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
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await signInWithEmail({
        email: formData.email,
        password: formData.password,
      });
      console.log('✅ Email sign-in successful, calling redirectAfterAuth');
      // Give a small delay to ensure auth state is updated
      setTimeout(() => {
        redirectAfterAuth();
      }, 100);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao fazer login');
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await signInWithGoogle();
      console.log('✅ Google sign-in successful, calling redirectAfterAuth');
      // Give a small delay to ensure auth state is updated
      setTimeout(() => {
        redirectAfterAuth();
      }, 100);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Erro ao fazer login com Google'
      );
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!resetEmail) {
      setError('Por favor, digite seu email.');
      return;
    }

    setResetLoading(true);
    setError(null);

    try {
      await resetPassword(resetEmail);
      setResetSuccess(true);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Erro ao enviar email de recuperação'
      );
    } finally {
      setResetLoading(false);
    }
  };

  const closeResetDialog = () => {
    setShowResetDialog(false);
    setResetEmail('');
    setResetSuccess(false);
    setError(null);
  };

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
              <p className="text-xs text-muted-foreground">
                Bem-vindo de volta
              </p>
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
              <CardTitle className="text-2xl text-jona-green-700 mb-2">
                Entrar
              </CardTitle>
              <p className="text-muted-foreground text-sm">
                Entre na sua conta para continuar sua jornada
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

              {/* Email/Password Form */}
              <form onSubmit={handleEmailSignIn} className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
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
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700"
                  >
                    Senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Sua senha"
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
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowResetDialog(true)}
                    className="text-sm text-jona-green-600 hover:text-jona-green-700 hover:underline"
                    disabled={isLoading}
                  >
                    Esqueceu a senha?
                  </button>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-jona-green-600 hover:bg-jona-green-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Entrando...</span>
                    </div>
                  ) : (
                    'Entrar'
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

              {/* Google Sign In */}
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full"
              >
                <Chrome className="w-4 h-4 mr-2" />
                Continuar com Google
              </Button>

              {/* Sign Up Link */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Não tem uma conta?{' '}
                  <Link
                    href="/signup"
                    className="text-jona-green-600 hover:text-jona-green-700 hover:underline font-medium"
                  >
                    Criar conta
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Password Reset Dialog */}
      <Dialog open={showResetDialog} onOpenChange={closeResetDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Recuperar Senha</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {resetSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4"
              >
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Email Enviado!</h3>
                <p className="text-muted-foreground text-sm">
                  Enviamos um link de recuperação para{' '}
                  <strong>{resetEmail}</strong>. Verifique sua caixa de entrada.
                </p>
              </motion.div>
            ) : (
              <>
                <p className="text-muted-foreground text-sm">
                  Digite seu email para receber um link de recuperação de senha.
                </p>

                <div className="space-y-2">
                  <label htmlFor="reset-email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={resetEmail}
                    onChange={e => setResetEmail(e.target.value)}
                    disabled={resetLoading}
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                <div className="flex space-x-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={closeResetDialog}
                    className="flex-1"
                    disabled={resetLoading}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handlePasswordReset}
                    className="flex-1 bg-jona-green-600 hover:bg-jona-green-700"
                    disabled={resetLoading || !resetEmail}
                  >
                    {resetLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                        <span>Enviando...</span>
                      </div>
                    ) : (
                      'Enviar Email'
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
