'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Heart, Users, Shield, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import LGPDModal from '@/components/LGPDModal'

export default function WelcomePage() {
  const [showLGPD, setShowLGPD] = useState(false)
  const router = useRouter()

  const handleStart = () => {
    setShowLGPD(true)
  }

  const handleLGPDAccept = () => {
    setShowLGPD(false)
    router.push('/onboarding')
  }

  const handleLGPDDecline = () => {
    setShowLGPD(false)
    // In a real app, you might redirect to an external page or show alternative options
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 jona-gradient">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md mx-auto"
      >
        <Card className="backdrop-blur-sm bg-white/90 shadow-xl border-0">
          <CardContent className="p-8 text-center">
            {/* Logo */}
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-8"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-full jona-gradient flex items-center justify-center">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-jona-green-700 mb-2">
                Bem-vindo ao JonA
              </h1>
              <p className="text-lg text-jona-blue-600 leading-relaxed">
                Conecte-se de verdade com quem compartilha seus valores.
              </p>
            </motion.div>

            {/* Features */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="space-y-4 mb-8"
            >
              <div className="flex items-center space-x-3 text-left">
                <Users className="w-5 h-5 text-jona-green-600 flex-shrink-0" />
                <span className="text-sm text-gray-600">Conexões baseadas em valores compartilhados</span>
              </div>
              <div className="flex items-center space-x-3 text-left">
                <Shield className="w-5 h-5 text-jona-blue-600 flex-shrink-0" />
                <span className="text-sm text-gray-600">Ambiente seguro e moderado</span>
              </div>
              <div className="flex items-center space-x-3 text-left">
                <Sparkles className="w-5 h-5 text-jona-green-600 flex-shrink-0" />
                <span className="text-sm text-gray-600">Comunidades e experiências significativas</span>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Button 
                onClick={handleStart}
                size="lg" 
                className="w-full text-lg py-6 font-medium"
                aria-label="Começar cadastro no JonA"
              >
                Começar
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      <LGPDModal 
        isOpen={showLGPD}
        onAccept={handleLGPDAccept}
        onDecline={handleLGPDDecline}
      />
    </div>
  )
} 