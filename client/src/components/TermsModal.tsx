
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogOverlay, DialogPortal } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TermsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TermsModal({ open, onOpenChange }: TermsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="z-[10000]" />
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden z-[10001]">
        <DialogHeader>
          <DialogTitle className="minecraftia text-2xl text-primary">
            Termos de Serviço
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Última atualização: 14 de Janeiro de 2025
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1 h-[60vh] pr-4">
          <div className="prose prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Aceitação dos Termos</h2>
              <p className="text-muted-foreground">
                Ao acessar e usar o MineCart Store, você concorda em estar vinculado a estes 
                Termos de Serviço. Se você não concordar com qualquer parte destes termos, 
                não use nossos serviços.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Descrição do Serviço</h2>
              <p className="text-muted-foreground">
                O MineCart Store é um marketplace digital que oferece conteúdo premium para 
                Minecraft, incluindo skins, mapas, mods, texturas e outros recursos digitais.
                Facilitamos transações entre criadores e compradores de conteúdo.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Contas de Usuário</h2>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>Você é responsável por manter a segurança de sua conta</li>
                <li>Forneça informações precisas e atualizadas</li>
                <li>Notifique-nos imediatamente sobre uso não autorizado</li>
                <li>Você deve ter pelo menos 13 anos para criar uma conta</li>
                <li>Uma conta por pessoa é permitida</li>
                <li>Contas inativas por mais de 2 anos podem ser removidas</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Vendas e Marketplace</h2>
              <h3 className="text-lg font-medium mb-2">Para Vendedores:</h3>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-4">
                <li>Você deve possuir todos os direitos sobre o conteúdo vendido</li>
                <li>O conteúdo deve ser original e não violar direitos autorais</li>
                <li>Descrições devem ser precisas e completas</li>
                <li>Taxa de comissão de 15% sobre cada venda</li>
                <li>Pagamentos processados mensalmente</li>
                <li>Conteúdo inadequado será removido sem aviso</li>
              </ul>
              <h3 className="text-lg font-medium mb-2">Para Compradores:</h3>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>Todas as vendas são finais</li>
                <li>Download imediato após pagamento confirmado</li>
                <li>Uso limitado a finalidades pessoais</li>
                <li>Redistribuição é proibida</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Conteúdo Proibido</h2>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>Conteúdo que viola direitos autorais ou marcas registradas</li>
                <li>Material ofensivo, violento ou inadequado</li>
                <li>Malware, vírus ou código malicioso</li>
                <li>Conteúdo que promove atividades ilegais</li>
                <li>Spam ou material promocional não autorizado</li>
                <li>Conteúdo sexual ou pornográfico</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Propriedade Intelectual</h2>
              <p className="text-muted-foreground">
                Vendedores concedem à MineCart Store licença limitada para hospedar, exibir 
                e distribuir conteúdo através da plataforma. Vendedores mantêm propriedade 
                de seu conteúdo original.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Suspensão e Encerramento</h2>
              <p className="text-muted-foreground">
                Reservamos o direito de suspender ou encerrar contas que violem estes termos 
                ou prejudiquem a plataforma. Violações graves resultam em banimento permanente.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Limitação de Responsabilidade</h2>
              <p className="text-muted-foreground">
                A MineCart Store não se responsabiliza por danos resultantes do uso da plataforma. 
                O serviço é fornecido "como está" sem garantias explícitas ou implícitas.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Lei Aplicável</h2>
              <p className="text-muted-foreground">
                Estes termos são regidos pelas leis do Brasil. Disputas serão resolvidas 
                nos tribunais competentes brasileiros.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">10. Contato</h2>
              <p className="text-muted-foreground">
                Para questões sobre estes termos: suporte@minecartstore.com
              </p>
            </section>
          </div>
        </ScrollArea>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
