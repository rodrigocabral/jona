'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Calendar, Plus, Bell, ExternalLink, Clock, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import BottomNavigation from '@/components/BottomNavigation'

// Mock events data
const mockEvents = [
  {
    id: '1',
    title: 'Café com Ana Silva',
    description: 'Primeira conversa após conexão no Jona',
    date: new Date('2024-01-20T15:00:00'),
    location: 'Café Central, Vila Madalena',
    reminderSet: true,
    type: 'meeting'
  },
  {
    id: '2',
    title: 'Aniversário - Carlos Mendes',
    description: 'Lembrete para parabenizar',
    date: new Date('2024-01-25T00:00:00'),
    reminderSet: true,
    type: 'birthday'
  },
  {
    id: '3',
    title: 'Live: Mindfulness e Bem-estar',
    description: 'Comunidade de Autocuidado',
    date: new Date('2024-01-22T19:00:00'),
    reminderSet: false,
    type: 'live'
  }
]

export default function AgendaPage() {
  const [events, setEvents] = useState(mockEvents)
  const [showNewEvent, setShowNewEvent] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: ''
  })

  const handleCreateEvent = () => {
    if (newEvent.title && newEvent.date && newEvent.time) {
      const eventDateTime = new Date(`${newEvent.date}T${newEvent.time}`)
      const event = {
        id: Date.now().toString(),
        title: newEvent.title,
        description: newEvent.description,
        date: eventDateTime,
        location: newEvent.location,
        reminderSet: true,
        type: 'meeting' as const
      }
      setEvents(prev => [...prev, event])
      setNewEvent({ title: '', description: '', date: '', time: '', location: '' })
      setShowNewEvent(false)
    }
  }

  const toggleReminder = (eventId: string) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, reminderSet: !event.reminderSet }
        : event
    ))
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'birthday':
        return '🎂'
      case 'live':
        return '📺'
      default:
        return '☕'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-jona-blue-50 to-jona-green-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-jona-blue-700">Agenda</h1>
            <p className="text-sm text-muted-foreground">Suas conexões e eventos</p>
          </div>
          <Dialog open={showNewEvent} onOpenChange={setShowNewEvent}>
            <DialogTrigger asChild>
              <Button aria-label="Adicionar novo evento">
                <Plus className="w-4 h-4 mr-2" />
                Novo Evento
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Novo Evento</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Título do evento"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                />
                <Textarea
                  placeholder="Descrição (opcional)"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                  />
                  <Input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                  />
                </div>
                <Input
                  placeholder="Local (opcional)"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                />
                <Button onClick={handleCreateEvent} className="w-full">
                  Criar Evento
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Calendar Integration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-gradient-to-r from-jona-blue-500 to-jona-green-500 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-8 h-8" />
                  <div>
                    <h2 className="text-xl font-semibold">Integração com Google Calendar</h2>
                    <p className="text-white/90">Sincronize seus eventos automaticamente</p>
                  </div>
                </div>
                <Button variant="secondary" size="sm">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Conectar
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Events List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-jona-blue-600" />
                <span>Próximos Eventos</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-start justify-between p-4 rounded-lg border bg-white/50 hover:bg-white/80 transition-colors"
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-2xl">{getEventIcon(event.type)}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{event.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {formatDate(event.date)}
                      </p>
                      {event.description && (
                        <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                      )}
                      {event.location && (
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    variant={event.reminderSet ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleReminder(event.id)}
                    aria-label={event.reminderSet ? "Remover lembrete" : "Adicionar lembrete"}
                  >
                    <Bell className={`w-4 h-4 ${event.reminderSet ? 'fill-current' : ''}`} />
                  </Button>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 gap-4"
        >
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-jona-blue-600">{events.length}</div>
              <p className="text-sm text-muted-foreground">Eventos este mês</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-jona-green-600">
                {events.filter(e => e.reminderSet).length}
              </div>
              <p className="text-sm text-muted-foreground">Com lembrete ativo</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <BottomNavigation currentPage="agenda" />
    </div>
  )
} 