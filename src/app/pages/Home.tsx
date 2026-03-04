import { useRaffles } from '../context/RaffleContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Link } from 'react-router';
import { Clock, Ticket, TrendingUp } from 'lucide-react';
import { useState } from 'react';

export function Home() {
  const [logado, setLogado] = useState(false);
  const { raffles } = useRaffles();
  const activeRaffles = raffles.filter(r => r.status === 'active');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
     {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-2 rounded-xl">
                <Ticket className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  RifaMax
                </h1>
                <p className="text-sm text-gray-600">Concorra a prêmios incríveis</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {logado ? (
                <>
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    Minhas Rifas
                  </Button>
                  <Link to="/criar-rifa">
                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                      Criar Rifa
                    </Button>
                  </Link>
                  <Button variant="outline" onClick={() => setLogado(false)}>Sair</Button>
                </>
              ) : (  
                <>
                  <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">
                    Cadastrar-se
                  </Button>
                  
                  <Button 
                    onClick={() => setLogado(true)} 
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    Login
                  </Button>
                </>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Rifas Ativas
          </h2>
          <p className="text-xl text-gray-600">
            Escolha sua rifa favorita e concorra a prêmios incríveis com apenas alguns cliques!
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{activeRaffles.length}</p>
                <p className="text-sm text-gray-600">Rifas Ativas</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Ticket className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {activeRaffles.reduce((sum, r) => sum + r.totalNumbers, 0)}
                </p>
                <p className="text-sm text-gray-600">Números Disponíveis</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">100%</p>
                <p className="text-sm text-gray-600">Confiável</p>
              </div>
            </div>
          </div>
        </div>

        {/* Raffles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeRaffles.map((raffle) => {
            const progress = (raffle.soldNumbers.length / raffle.totalNumbers) * 100;
            
            return (
              <Card key={raffle.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 border-2 hover:border-purple-200">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={raffle.imageUrl} 
                    alt={raffle.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-3 right-3 bg-green-500 hover:bg-green-600">
                    Ativa
                  </Badge>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-xl">{raffle.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{raffle.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Preço por número:</span>
                    <span className="font-bold text-lg text-purple-600">{formatCurrency(raffle.price)}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Vendidos:</span>
                      <span className="font-semibold">{raffle.soldNumbers.length} / {raffle.totalNumbers}</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <p className="text-xs text-gray-500 text-right">{progress.toFixed(0)}% vendido</p>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    <Clock className="w-4 h-4" />
                    <span>Sorteio: {formatDate(raffle.drawDate)}</span>
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Link to={`/rifa/${raffle.id}`} className="w-full">
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                      Ver Números
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {activeRaffles.length === 0 && (
          <div className="text-center py-12">
            <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-600">Nenhuma rifa ativa no momento</p>
            <Link to="/criar-rifa">
              <Button className="mt-4">Criar uma Rifa</Button>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
