export default function Privacy() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center">Política de Privacidade</h1>
        
        <div className="space-y-8 text-gray-300">
          <section>
            <h2 className="text-xl font-semibold mb-4 text-white">1. Informações que Coletamos</h2>
            <h3 className="text-lg font-medium mb-2 text-white">Informações de Conta:</h3>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>Nome completo e nome de exibição</li>
              <li>Endereço de email</li>
              <li>Foto de perfil (opcional)</li>
              <li>Informações de autenticação via Google</li>
            </ul>
            
            <h3 className="text-lg font-medium mb-2 text-white">Informações de Transação:</h3>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>Histórico de compras e vendas</li>
              <li>Informações de pagamento (processadas por terceiros)</li>
              <li>Dados de faturamento</li>
            </ul>

            <h3 className="text-lg font-medium mb-2 text-white">Informações de Uso:</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Páginas visitadas e tempo de sessão</li>
              <li>Interações com produtos e criadores</li>
              <li>Preferências e configurações</li>
              <li>Dados de dispositivo e navegador</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-white">2. Como Usamos suas Informações</h2>
            <ul className="list-disc list-inside space-y-2">
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
            <h2 className="text-xl font-semibold mb-4 text-white">3. Compartilhamento de Informações</h2>
            <p className="mb-4">Não vendemos suas informações pessoais. Compartilhamos dados apenas quando:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Necessário para processar pagamentos (com processadores de pagamento seguros)</li>
              <li>Exigido por lei ou processo legal</li>
              <li>Para prevenir fraudes ou proteger nossos direitos</li>
              <li>Com seu consentimento explícito</li>
              <li>Informações públicas do perfil (nome de exibição, produtos)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-white">4. Segurança dos Dados</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Criptografia SSL/TLS para transmissão de dados</li>
              <li>Armazenamento seguro em servidores protegidos</li>
              <li>Autenticação via Firebase (Google)</li>
              <li>Monitoramento regular de segurança</li>
              <li>Acesso limitado aos dados por funcionários autorizados</li>
              <li>Backups regulares e seguros</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-white">5. Cookies e Tecnologias Similares</h2>
            <p className="mb-4">Utilizamos cookies e tecnologias similares para:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Manter você logado</li>
              <li>Lembrar suas preferências</li>
              <li>Analisar o uso da plataforma</li>
              <li>Personalizar sua experiência</li>
              <li>Melhorar a segurança</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-white">6. Seus Direitos (LGPD)</h2>
            <p className="mb-4">Conforme a Lei Geral de Proteção de Dados, você tem direito a:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Confirmação da existência de tratamento de dados</li>
              <li>Acesso aos seus dados pessoais</li>
              <li>Correção de dados incompletos ou incorretos</li>
              <li>Anonimização ou exclusão de dados desnecessários</li>
              <li>Portabilidade dos dados</li>
              <li>Informações sobre o compartilhamento de dados</li>
              <li>Revogação do consentimento</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-white">7. Retenção de Dados</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Dados de conta: mantidos enquanto a conta estiver ativa</li>
              <li>Dados de transação: mantidos por 5 anos (obrigação legal)</li>
              <li>Logs de acesso: mantidos por 6 meses</li>
              <li>Dados de marketing: até revogação do consentimento</li>
              <li>Exclusão completa mediante solicitação (exceto obrigações legais)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-white">8. Transferência Internacional</h2>
            <p>
              Alguns dados podem ser processados em servidores localizados fora do Brasil 
              (como Firebase/Google). Garantimos que estas transferências atendem aos 
              requisitos de proteção da LGPD.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-white">9. Menores de Idade</h2>
            <p>
              Nossa plataforma não é destinada a menores de 13 anos. Se soubermos que 
              coletamos dados de menores de 13 anos, excluiremos essas informações imediatamente. 
              Usuários entre 13-18 anos precisam de autorização dos responsáveis.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-white">10. Alterações na Política</h2>
            <p>
              Podemos atualizar esta política periodicamente. Mudanças significativas serão 
              comunicadas por email ou aviso na plataforma. Recomendamos revisar esta página regularmente.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-white">11. Contato</h2>
            <p className="mb-4">Para questões sobre privacidade ou exercer seus direitos:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Email: privacidade@minecartstore.com</li>
              <li>Formulário de contato na plataforma</li>
              <li>Resposta em até 15 dias úteis</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-white">12. Encarregado de Dados (DPO)</h2>
            <p>
              Para questões específicas sobre proteção de dados, entre em contato com 
              nosso Encarregado de Dados: dpo@minecartstore.com
            </p>
          </section>
        </div>

        <div className="mt-12 text-center text-sm text-gray-400">
          <p>Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
        </div>
      </div>
    </div>
  );
}