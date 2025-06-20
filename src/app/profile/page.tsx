'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  ArrowLeft,
  User,
  Mail,
  Settings,
  Bell,
  Shield,
  LogOut,
  Edit3,
  Instagram,
  Heart,
  MapPin,
  Calendar,
  Users,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuthContext } from '@/lib/contexts/AuthContext'

export default function ProfilePage() {
  const router = useRouter()
  const { user, signOut } = useAuthContext()
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [privateProfile, setPrivateProfile] = useState(false)

  const handleBack = () => {
    router.back()
  }

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await signOut()
      router.replace('/login')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoggingOut(false)
      setShowLogoutDialog(false)
    }
  }

  const handleEditProfile = () => {
    // Navigate to edit profile page or open edit modal
    console.log('Edit profile clicked')
  }

  // Mock user data - in a real app, this would come from the database
  const userProfile = {
    name: user?.displayName || 'Usuário',
    email: user?.email || '',
    avatar: user?.photoURL || '',
    location: 'São Paulo, SP',
    joinDate: 'Janeiro 2024',
    connections: 12,
    communities: 3,
    interests: ['Yoga', 'Sustentabilidade', 'Leitura', 'Tecnologia', 'Viagens'],
    instagramConnected: false,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-jona-green-50 to-jona-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={handleBack} aria-label="Voltar">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold">Perfil</h1>
            <p className="text-sm text-muted-foreground">Gerencie suas informações</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={userProfile.avatar} />
                  <AvatarFallback className="bg-jona-green-100 text-jona-green-700 text-xl">
                    {userProfile.name
                      .split(' ')
                      .map(n => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">{userProfile.name}</h2>
                      <div className="flex items-center space-x-2 text-muted-foreground mt-1">
                        <Mail className="w-4 h-4" />
                        <span>{userProfile.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-muted-foreground mt-1">
                        <MapPin className="w-4 h-4" />
                        <span>{userProfile.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-muted-foreground mt-1">
                        <Calendar className="w-4 h-4" />
                        <span>Membro desde {userProfile.joinDate}</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleEditProfile}
                      aria-label="Editar perfil"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-jona-green-600">
                    {userProfile.connections}
                  </div>
                  <p className="text-sm text-muted-foreground">Conexões</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-jona-blue-600">
                    {userProfile.communities}
                  </div>
                  <p className="text-sm text-muted-foreground">Comunidades</p>
                </div>
              </div>

              {/* Interests */}
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold mb-3">Interesses</h3>
                <div className="flex flex-wrap gap-2">
                  {userProfile.interests.map(interest => (
                    <Badge
                      key={interest}
                      variant="secondary"
                      className="bg-jona-blue-100 text-jona-blue-700"
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Configurações</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Notifications */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bell className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Notificações</p>
                    <p className="text-sm text-muted-foreground">
                      Receber notificações de novas conexões
                    </p>
                  </div>
                </div>
                <Switch
                  checked={notifications}
                  onCheckedChange={setNotifications}
                  aria-label="Ativar/desativar notificações"
                />
              </div>

              {/* Privacy */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Perfil Privado</p>
                    <p className="text-sm text-muted-foreground">
                      Apenas conexões podem ver seu perfil
                    </p>
                  </div>
                </div>
                <Switch
                  checked={privateProfile}
                  onCheckedChange={setPrivateProfile}
                  aria-label="Ativar/desativar perfil privado"
                />
              </div>

              {/* Instagram Connection */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Instagram className="w-5 h-5 text-pink-600" />
                  <div>
                    <p className="font-medium">Instagram</p>
                    <p className="text-sm text-muted-foreground">
                      {userProfile.instagramConnected
                        ? 'Conectado'
                        : 'Conectar para melhorar sugestões'}
                    </p>
                  </div>
                </div>
                <Button
                  variant={userProfile.instagramConnected ? 'outline' : 'default'}
                  size="sm"
                  aria-label={
                    userProfile.instagramConnected ? 'Desconectar Instagram' : 'Conectar Instagram'
                  }
                >
                  {userProfile.instagramConnected ? 'Desconectar' : 'Conectar'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => setShowLogoutDialog(true)}
                aria-label="Sair da conta"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Sair da Conta
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Saída</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja sair da sua conta? Você precisará fazer login novamente para
              acessar o JonA.
            </DialogDescription>
          </DialogHeader>
          <div className="flex space-x-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowLogoutDialog(false)}
              className="flex-1"
              disabled={isLoggingOut}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="flex-1"
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Saindo...</span>
                </div>
              ) : (
                <>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
