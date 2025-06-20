'use client';

import { Check, Shield, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface LGPDModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export default function LGPDModal({
  isOpen,
  onAccept,
  onDecline,
}: LGPDModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="w-6 h-6 text-jona-blue-600" />
            <DialogTitle>Privacidade e Dados</DialogTitle>
          </div>
          <DialogDescription className="text-left space-y-3">
            <p>
              Para oferecer a melhor experiência no JonA, precisamos coletar e
              processar alguns dados pessoais:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start space-x-2">
                <Check className="w-4 h-4 text-jona-green-600 mt-0.5 flex-shrink-0" />
                <span>Informações de perfil para sugestões de conexões</span>
              </li>
              <li className="flex items-start space-x-2">
                <Check className="w-4 h-4 text-jona-green-600 mt-0.5 flex-shrink-0" />
                <span>Dados de interação para melhorar recomendações</span>
              </li>
              <li className="flex items-start space-x-2">
                <Check className="w-4 h-4 text-jona-green-600 mt-0.5 flex-shrink-0" />
                <span>Integração opcional com redes sociais</span>
              </li>
            </ul>
            <p className="text-xs text-muted-foreground">
              Todos os dados são criptografados e você pode solicitar remoção a
              qualquer momento. Ao continuar, você concorda com nossa Política
              de Privacidade e Termos de Uso.
            </p>
          </DialogDescription>
        </DialogHeader>
        <div className="flex space-x-3 mt-6">
          <Button
            variant="outline"
            onClick={onDecline}
            className="flex-1"
            aria-label="Recusar coleta de dados"
          >
            <X className="w-4 h-4 mr-2" />
            Recusar
          </Button>
          <Button
            onClick={onAccept}
            className="flex-1"
            aria-label="Aceitar coleta de dados"
          >
            <Check className="w-4 h-4 mr-2" />
            Aceitar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
