import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
  const params = new URLSearchParams(window.location.search);
  const returnTo = params.get('returnTo');
  const backHref = returnTo === 'complete-profile' ? '/complete-profile' : '/';
  const backText = returnTo === 'complete-profile' ? 'Voltar ao Cadastro' : 'Voltar ao Início';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href={backHref}>
          <Button variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {backText}
          </Button>
        </Link>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="minecraftia text-3xl text-primary">
            Política de Privacidade
          </CardTitle>
          <p className="text-muted-foreground">
            Última atualização: 14 de Janeiro de 2025
          </p>
        </CardHeader>
        <CardContent className="prose prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Informações que Coletamos</h2>
            <h3 className="text-lg font-medium mb-2">Informações de Conta:</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-4">
              <li>Nome completo e nome de exibição</li>
              <li>Endereço de email</li>
              <li>Foto de perfil (opcional)</li>
              <li>Informações de autenticação via Google</li>
            </ul>
            <h3 className="text-lg font-medium mb-2">Informações de Transação:</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-4">
              <li>Histórico de compras e vendas</li>
              <li>Informações de pagamento (processadas por terceiros)</li>
              <li>Dados de faturamento</li>
            </ul>
            <h3 className="text-lg font-medium mb-2">Informações de Uso:</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>Páginas visitadas e tempo de sessão</li>
              <li>Interações com produtos e criadores</li>
              <li>Preferências e configurações</li>
              <li>Dados de dispositivo e navegador</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Como Usamos suas Informações</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>Fornecer e manter nossos serviços</li>
              <li>Processar transações e pagamentos</li>
              <li>Comunicar atualizações e promoções</li>
              <li>Melhorar a experiência do usuário</li>
              <li>Prevenir fraudes e garantir segurança</li>
              <li>Cumprir obrigações legais</li>
              <li>Personalizar recomendações de conteúdo</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Compartilhamento de Informações</h2>
            <p className="text-muted-foreground mb-4">Não vendemos suas informações pessoais. Compartilhamos dados apenas quando:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>Necessário para processar pagamentos</li>
              <li>Exigido por lei ou processo legal</li>
              <li>Para prevenir fraudes ou proteger direitos</li>
              <li>Com seu consentimento explícito</li>
              <li>Informações públicas do perfil (nome de exibição, produtos)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Segurança dos Dados</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>Criptografia SSL/TLS para transmissão</li>
              <li>Armazenamento seguro em servidores protegidos</li>
              <li>Autenticação via Firebase (Google)</li>
              <li>Monitoramento regular de segurança</li>
              <li>Acesso limitado por funcionários autorizados</li>
              <li>Backups regulares e seguros</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Seus Direitos (LGPD)</h2>
            <p className="text-muted-foreground mb-4">Conforme a LGPD, você tem direito a:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>Confirmação da existência de tratamento de dados</li>
              <li>Acesso aos seus dados pessoais</li>
              <li>Correção de dados incompletos ou incorretos</li>
              <li>Anonimização ou exclusão de dados desnecessários</li>
              <li>Portabilidade dos dados</li>
              <li>Informações sobre compartilhamento</li>
              <li>Revogação do consentimento</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Retenção de Dados</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>Dados de conta: mantidos enquanto ativa</li>
              <li>Dados de transação: 5 anos (obrigação legal)</li>
              <li>Logs de acesso: 6 meses</li>
              <li>Dados de marketing: até revogação</li>
              <li>Exclusão completa mediante solicitação</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Cookies</h2>
            <p className="text-muted-foreground mb-4">Utilizamos cookies para:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>Manter você logado</li>
              <li>Lembrar preferências</li>
              <li>Analisar uso da plataforma</li>
              <li>Personalizar experiência</li>
              <li>Melhorar segurança</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. Contato</h2>
            <p className="text-muted-foreground mb-4">Para questões sobre privacidade:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>Email: privacidade@minecartstore.com</li>
              <li>DPO: dpo@minecartstore.com</li>
              <li>Resposta em até 15 dias úteis</li>
            </ul>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}