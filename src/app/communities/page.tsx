'use client'

import { motion } from 'framer-motion'
import { Users, Plus, Search, Calendar, MapPin, Hash, Video, Settings, Clock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import BottomNavigation from '@/components/BottomNavigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

// Mock data for communities
const mockCommunities = [
  {
    id: '1',
    name: 'Yoga & Mindfulness',
    description: 'Conecte-se através da prática de yoga e meditação',
    members: 47,
    tags: ['yoga', 'meditação', 'bem-estar'],
    isJoined: true,
    nextEvent: new Date('2024-01-20T18:00:00'),
    location: 'São Paulo, SP',
    avatar: '',
  },
  {
    id: '2',
    name: 'Sustentabilidade Urbana',
    description: 'Discussões sobre vida sustentável na cidade',
    members: 32,
    tags: ['sustentabilidade', 'meio-ambiente', 'ecologia'],
    isJoined: false,
    nextEvent: new Date('2024-01-18T19:30:00'),
    location: 'Rio de Janeiro, RJ',
    avatar: '',
  },
  {
    id: '3',
    name: 'Leitura & Literatura',
    description: 'Clube do livro para amantes da leitura',
    members: 28,
    tags: ['leitura', 'literatura', 'livros'],
    isJoined: true,
    nextEvent: new Date('2024-01-22T20:00:00'),
    location: 'Belo Horizonte, MG',
    avatar: '',
  },
  {
    id: '4',
    name: 'Tech & Inovação',
    description: 'Networking para profissionais de tecnologia',
    members: 64,
    tags: ['tecnologia', 'inovação', 'networking'],
    isJoined: false,
    nextEvent: new Date('2024-01-25T18:30:00'),
    location: 'São Paulo, SP',
    avatar: '',
  },
]

// Mock data for scheduled lives
const scheduledLives = [
  {
    id: '1',
    title: 'Meditação Guiada',
    community: 'Yoga & Mindfulness',
    date: new Date('2024-01-17T19:00:00'),
    duration: 45,
    participants: 12,
  },
  {
    id: '2',
    title: 'Discussão: Consumo Consciente',
    community: 'Sustentabilidade Urbana',
    date: new Date('2024-01-19T20:00:00'),
    duration: 60,
    participants: 8,
  },
]

export default function CommunitiesPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newCommunity, setNewCommunity] = useState({
    name: '',
    description: '',
    tags: '',
  })

  const handleJoinCommunity = (communityId: string) => {
    console.log('Joining community:', communityId)
    // In a real app, this would send a join request
  }

  const handleLeaveCommunity = (communityId: string) => {
    console.log('Leaving community:', communityId)
    // In a real app, this would send a leave request
  }

  const handleCreateCommunity = () => {
    console.log('Creating community:', newCommunity)
    // In a real app, this would create a new community
    setShowCreateDialog(false)
    setNewCommunity({ name: '', description: '', tags: '' })
  }

  const handleSettingsClick = () => {
    router.push('/profile')
  }

  const filteredCommunities = mockCommunities.filter(
    community =>
      community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      community.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      community.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-jona-green-50 to-jona-blue-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold jona-text-gradient">Comunidades</h1>
            <p className="text-sm text-muted-foreground">Conecte-se com grupos afins</p>
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
        {/* Search and Create */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex gap-3"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar comunidades..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
              aria-label="Buscar comunidades"
            />
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button
                className="bg-jona-green-600 hover:bg-jona-green-700"
                aria-label="Criar nova comunidade"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Grupo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Nova Comunidade</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <label htmlFor="community-name" className="text-sm font-medium">
                    Nome da Comunidade
                  </label>
                  <Input
                    id="community-name"
                    placeholder="Ex: Yoga & Mindfulness"
                    value={newCommunity.name}
                    onChange={e => setNewCommunity({ ...newCommunity, name: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="community-description" className="text-sm font-medium">
                    Descrição
                  </label>
                  <Textarea
                    id="community-description"
                    placeholder="Descreva o propósito da sua comunidade..."
                    value={newCommunity.description}
                    onChange={e =>
                      setNewCommunity({ ...newCommunity, description: e.target.value })
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <label htmlFor="community-tags" className="text-sm font-medium">
                    Tags (separadas por vírgula)
                  </label>
                  <Input
                    id="community-tags"
                    placeholder="Ex: yoga, meditação, bem-estar"
                    value={newCommunity.tags}
                    onChange={e => setNewCommunity({ ...newCommunity, tags: e.target.value })}
                  />
                </div>
                <Button
                  onClick={handleCreateCommunity}
                  className="w-full bg-jona-green-600 hover:bg-jona-green-700"
                  disabled={!newCommunity.name.trim()}
                >
                  Criar Comunidade
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Scheduled Lives */}
        {scheduledLives.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Video className="w-5 h-5 text-jona-blue-600" />
                  <span>Lives Agendadas</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {scheduledLives.map(live => (
                  <div
                    key={live.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-white/50 hover:bg-white/80 transition-colors"
                  >
                    <div>
                      <h3 className="font-semibold text-sm">{live.title}</h3>
                      <p className="text-xs text-muted-foreground">{live.community}</p>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(live.date)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-3 h-3" />
                          <span>{live.participants} participantes</span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Participar
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Communities List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-jona-green-600" />
                  <span>Comunidades</span>
                </div>
                <span className="text-sm text-muted-foreground font-normal">
                  {filteredCommunities.length} grupos encontrados
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredCommunities.map((community, index) => (
                <motion.div
                  key={community.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-start justify-between p-4 rounded-lg border bg-white/50 hover:bg-white/80 transition-colors"
                >
                  <div className="flex items-start space-x-4 flex-1">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={community.avatar} />
                      <AvatarFallback className="bg-jona-green-100 text-jona-green-700">
                        {community.name
                          .split(' ')
                          .map(n => n[0])
                          .join('')
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{community.name}</h3>
                        {community.isJoined && (
                          <span className="px-2 py-1 bg-jona-green-100 text-jona-green-700 text-xs rounded-full">
                            Membro
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{community.description}</p>

                      <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Users className="w-3 h-3" />
                          <span>{community.members} membros</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>{community.location}</span>
                        </div>
                      </div>

                      {community.nextEvent && (
                        <div className="flex items-center space-x-1 mt-2 text-xs text-jona-blue-600">
                          <Calendar className="w-3 h-3" />
                          <span>Próximo evento: {formatDate(community.nextEvent)}</span>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-1 mt-3">
                        {community.tags.map(tag => (
                          <span
                            key={tag}
                            className="flex items-center px-2 py-1 bg-jona-blue-100 text-jona-blue-700 text-xs rounded-full"
                          >
                            <Hash className="w-2 h-2 mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    {community.isJoined ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleLeaveCommunity(community.id)}
                        aria-label={`Sair da comunidade ${community.name}`}
                      >
                        Sair
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleJoinCommunity(community.id)}
                        className="bg-jona-green-600 hover:bg-jona-green-700"
                        aria-label={`Juntar-se à comunidade ${community.name}`}
                      >
                        Juntar
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {filteredCommunities.length === 0 && searchTerm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma comunidade encontrada</h3>
            <p className="text-muted-foreground mb-4">
              Não encontramos comunidades que correspondam à sua busca por "{searchTerm}"
            </p>
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="bg-jona-green-600 hover:bg-jona-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Nova Comunidade
            </Button>
          </motion.div>
        )}
      </div>

      <BottomNavigation currentPage="communities" />
    </div>
  )
}
