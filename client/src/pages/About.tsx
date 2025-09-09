import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Users, Target, Heart } from 'lucide-react';

export default function About() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/">
          <Button variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Início
          </Button>
        </Link>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Hero Section */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="minecraftia text-3xl text-primary mb-4">
              Sobre o MineCart Store
            </CardTitle>
            <p className="text-lg text-muted-foreground">
              O marketplace premium que conecta criadores e jogadores de Minecraft
            </p>
          </CardHeader>
        </Card>

        {/* Mission Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <Target className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold text-lg mb-2">Nossa Missão</h3>
              <p className="text-muted-foreground">
                Democratizar o acesso a conteúdo premium de Minecraft e apoiar 
                criadores de conteúdo talentosos.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold text-lg mb-2">Comunidade</h3>
              <p className="text-muted-foreground">
                Mais de 10.000 usuários ativos e centenas de criadores de 
                conteúdo verificados.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Heart className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold text-lg mb-2">Valores</h3>
              <p className="text-muted-foreground">
                Qualidade, inovação e suporte contínuo à comunidade Minecraft 
                brasileira.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Story Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Nossa História</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              O MineCart Store nasceu da paixão pela comunidade Minecraft brasileira. 
              Fundado em 2024, nosso objetivo sempre foi criar uma plataforma que 
              valorize tanto criadores quanto jogadores.
            </p>
            <p>
              Começamos como um pequeno projeto para conectar alguns criadores locais 
              com jogadores que buscavam conteúdo de qualidade. Hoje, somos uma das 
              principais plataformas de marketplace para Minecraft no Brasil.
            </p>
            <p>
              Nossa tecnologia inovadora, incluindo visualização 3D em tempo real e 
              sistema de pagamento seguro, estabeleceu novos padrões para marketplaces 
              de gaming.
            </p>
          </CardContent>
        </Card>

        {/* Features Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Por que nos escolher?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2 text-primary">🎮 Visualização 3D</h4>
                <p className="text-muted-foreground text-sm">
                  Veja seus produtos em 3D antes de comprar, uma experiência única no mercado.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-primary">⚡ Download Instantâneo</h4>
                <p className="text-muted-foreground text-sm">
                  Acesso imediato aos seus produtos após a compra confirmada.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-primary">🔒 Pagamento Seguro</h4>
                <p className="text-muted-foreground text-sm">
                  Transações protegidas com criptografia de ponta e múltiplas opções de pagamento.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-primary">🛠️ Suporte 24/7</h4>
                <p className="text-muted-foreground text-sm">
                  Equipe dedicada pronta para ajudar sempre que você precisar.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact CTA */}
        <Card>
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-semibold mb-4">Quer saber mais?</h3>
            <p className="text-muted-foreground mb-6">
              Entre em contato conosco para parcerias, sugestões ou dúvidas.
            </p>
            <Link href="/contact">
              <Button className="bg-primary hover:bg-primary/90">
                Entre em Contato
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
