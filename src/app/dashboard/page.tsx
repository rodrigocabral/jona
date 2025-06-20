'use client'

import { motion } from 'framer-motion'
import {
  Heart,
  Calendar,
  BookOpen,
  Users,
  Settings,
  MessageCircle,
  Sparkles,
  MapPin,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { AuthGuard } from '@/components/auth/AuthGuard'
import BottomNavigation from '@/components/BottomNavigation'
import EmotionalAlert from '@/components/EmotionalAlert'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Mock data for connections
const mockConnections = [
  {
    id: '1',
    name: 'Ana Silva',
    avatar: '',
    compatibility: 92,
    commonInterests: ['Sustentabilidade', 'Yoga', 'Leitura'],
    lastActive: new Date('2024-01-15T10:30:00'),
    location: 'São Paulo, SP',
  },
  {
    id: '2',
    name: 'Carlos Mendes',
    avatar: '',
    compatibility: 88,
    commonInterests: ['Tecnologia', 'Música', 'Viagens'],
    lastActive: new Date('2024-01-15T09:15:00'),
    location: 'Rio de Janeiro, RJ',
  },
  {
    id: '3',
    name: 'Marina Costa',
    avatar: '',
    compatibility: 85,
    commonInterests: ['Arte', 'Culinária', 'Natureza'],
    lastActive: new Date('2024-01-15T08:45:00'),
    location: 'Belo Horizonte, MG',
  },
]

export default function DashboardPage() {
  const router = useRouter()
  const [showEmotionalAlert, setShowEmotionalAlert] = useState(true)

  const handleConnect = (connectionId: string) => {
    console.log('Connecting with:', connectionId)
    // In a real app, this would send a connection request
  }

  const handleDismissAlert = () => {
    setShowEmotionalAlert(false)
  }

  const handleSettingsClick = () => {
    router.push('/profile')
  }

  return (
    <AuthGuard requireOnboarding={true}>
      <div className="min-h-screen bg-gradient-to-br from-jona-green-50 to-jona-blue-50 pb-20">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold jona-text-gradient">JonA</h1>
              <p className="text-sm text-muted-foreground">Suas conexões aguardam</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSettingsClick}
              aria-label="Configurações"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          {/* Emotional Alert */}
          {showEmotionalAlert && <EmotionalAlert onDismiss={handleDismissAlert} />}

          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-gradient-to-r from-jona-green-500 to-jona-blue-500 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <Sparkles className="w-8 h-8" />
                  <div>
                    <h2 className="text-xl font-semibold">Bem-vindo de volta!</h2>
                    <p className="text-white/90">Encontramos novas pessoas compatíveis com você</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Connection Suggestions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-jona-green-600" />
                  <span>Sugestões de Conexão</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockConnections.map((connection, index) => (
                  <motion.div
                    key={connection.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-lg border bg-white/50 hover:bg-white/80 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={connection.avatar} />
                        <AvatarFallback className="bg-jona-green-100 text-jona-green-700">
                          {connection.name
                            .split(' ')
                            .map(n => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{connection.name}</h3>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          <span>{connection.location}</span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex items-center space-x-1">
                            <Heart className="w-3 h-3 text-jona-green-600" />
                            <span className="text-sm font-medium text-jona-green-600">
                              {connection.compatibility}% compatível
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {connection.commonInterests.slice(0, 2).map(interest => (
                            <span
                              key={interest}
                              className="px-2 py-1 bg-jona-green-50 text-jona-green-700 text-xs rounded-full"
                            >
                              {interest}
                            </span>
                          ))}
                          {connection.commonInterests.length > 2 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              +{connection.commonInterests.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleConnect(connection.id)}
                        className="text-jona-green-600 border-jona-green-600 hover:bg-jona-green-50"
                      >
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Conectar
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-jona-blue-600" />
                <h3 className="font-semibold text-sm">Próximos Eventos</h3>
                <p className="text-xs text-muted-foreground">3 eventos esta semana</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-jona-green-600" />
                <h3 className="font-semibold text-sm">Comunidades</h3>
                <p className="text-xs text-muted-foreground">2 grupos ativos</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <BottomNavigation currentPage="connections" />
      </div>
    </AuthGuard>
  )
}
