'use client';

import { motion } from 'framer-motion';
import { Heart, Play, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface EmotionalAlertProps {
  onDismiss: () => void;
}

export default function EmotionalAlert({ onDismiss }: EmotionalAlertProps) {
  const handleJoinLive = () => {
    console.log('Joining live session...');
    // In a real app, this would navigate to a live session
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="bg-gradient-to-r from-pink-500 to-purple-600 text-white border-0 relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={onDismiss}
          className="absolute top-2 right-2 text-white hover:bg-white/20"
          aria-label="Fechar alerta"
        >
          <X className="w-4 h-4" />
        </Button>
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="bg-white/20 rounded-full p-2">
              <Heart className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">
                Como você está se sentindo hoje?
              </h3>
              <p className="text-sm text-white/90 mb-3">
                Detectamos que você pode estar passando por um momento
                desafiador. Que tal participar de uma live sobre bem-estar
                emocional?
              </p>
              <Button
                onClick={handleJoinLive}
                variant="secondary"
                size="sm"
                className="bg-white text-purple-600 hover:bg-white/90"
              >
                <Play className="w-4 h-4 mr-2" />
                Participar da Live
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
