export default function Terms() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center">Termos de Serviço</h1>
        
        <div className="space-y-8 text-gray-300">
          <section>
            <h2 className="text-xl font-semibold mb-4 text-white">1. Aceitação dos Termos</h2>
            <p>
              Ao acessar e usar a MineCart Store, você concorda com estes Termos de Serviço. 
              Se você não concordar com qualquer parte destes termos, não deve usar nossos serviços.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-white">2. Descrição do Serviço</h2>
            <p>
              A MineCart Store é uma plataforma de marketplace que conecta criadores e compradores 
              de conteúdo para Minecraft, incluindo mundos, skins, add-ons, texturas e mods.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-white">3. Conta de Usuário</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Você deve fornecer informações precisas e atualizadas ao criar sua conta</li>
              <li>Você é responsável por manter a segurança de sua conta e senha</li>
              <li>Você deve ter pelo menos 13 anos para usar nossos serviços</li>
              <li>Uma conta por pessoa é permitida</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-white">4. Vendas e Compras</h2>
            <h3 className="text-lg font-medium mb-2 text-white">Para Vendedores:</h3>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>Você deve possuir todos os direitos sobre o conteúdo que vende</li>
              <li>O conteúdo deve ser original e não violar direitos autorais</li>
              <li>Descrições de produtos devem ser precisas e completas</li>
              <li>Taxa de comissão de 15% sobre cada venda será aplicada</li>
              <li>Pagamentos são processados mensalmente</li>
            </ul>
            
            <h3 className="text-lg font-medium mb-2 text-white">Para Compradores:</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Todas as vendas são finais</li>
              <li>Você recebe acesso imediato ao download após o pagamento</li>
              <li>Uso do conteúdo é limitado a uso pessoal</li>
              <li>Redistribuição do conteúdo comprado é proibida</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-white">5. Conteúdo Proibido</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Conteúdo que viola direitos autorais ou marcas registradas</li>
              <li>Conteúdo com material ofensivo, violento ou inadequado</li>
              <li>Malware, vírus ou código malicioso</li>
              <li>Conteúdo que promove atividades ilegais</li>
              <li>Spam ou conteúdo promocional não autorizado</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-white">6. Propriedade Intelectual</h2>
            <p>
              Ao fazer upload de conteúdo, você concede à MineCart Store uma licença limitada 
              para hospedar, exibir e distribuir seu conteúdo através da plataforma. 
              Você mantém todos os direitos sobre seu conteúdo original.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-white">7. Suspensão e Encerramento</h2>
            <p>
              Reservamos o direito de suspender ou encerrar contas que violem estes termos 
              ou se envolvam em atividades prejudiciais à plataforma ou outros usuários.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-white">8. Limitação de Responsabilidade</h2>
            <p>
              A MineCart Store não se responsabiliza por danos diretos, indiretos, incidentais 
              ou consequenciais resultantes do uso da plataforma. O serviço é fornecido "como está".
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-white">9. Modificações dos Termos</h2>
            <p>
              Podemos modificar estes termos a qualquer momento. Usuários serão notificados 
              sobre mudanças significativas. O uso continuado da plataforma constitui 
              aceitação dos termos modificados.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-white">10. Lei Aplicável</h2>
            <p>
              Estes termos são regidos pelas leis do Brasil. Disputas serão resolvidas 
              nos tribunais competentes do país.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-white">11. Contato</h2>
            <p>
              Para questões sobre estes termos, entre em contato através da página de contato 
              ou email: suporte@minecartstore.com
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