import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft, Check, Coins, ShieldCheck, Sparkles, Star, Trophy } from 'lucide-react';
import { toast } from 'sonner';

export function BuyCoins() {
  const navigate = useNavigate();
  const [usuarioLogado, setUsuarioLogado] = useState<any>(null);

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('usuario');
    if (usuarioSalvo) {
      setUsuarioLogado(JSON.parse(usuarioSalvo));
    } else {
      toast.error('Você precisa estar logado para comprar moedas!');
      navigate('/');
    }
  }, [navigate]);

  const handleComprar = (pacote: string) => {
    navigate(`/pagamento/${pacote}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </Button>
          {usuarioLogado && (
            <div className="flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full border border-yellow-300 font-semibold">
              <Coins className="w-5 h-5" />
              Saldo Atual: {usuarioLogado.moedas} Moedas
            </div>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Recarregue suas moedas
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Escolha o pacote ideal para você e comece a criar suas próprias rifas hoje mesmo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          
          <Card className="relative overflow-hidden border-2 border-orange-200 hover:border-orange-400 hover:shadow-xl transition-all hover:-translate-y-2 bg-gradient-to-b from-white to-orange-50 h-full flex flex-col">
            <CardHeader className="text-center pb-8 pt-8">
              <div className="mx-auto bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 border border-orange-200">
                <ShieldCheck className="w-8 h-8 text-orange-600" />
              </div>
              <CardTitle className="text-2xl text-orange-800">Iniciante</CardTitle>
              <CardDescription>Perfeito para testar o sistema</CardDescription>
            </CardHeader>
            <CardContent className="text-center flex-grow">
              <div className="flex items-end justify-center gap-1 mb-6">
                <span className="text-5xl font-extrabold text-gray-900">150</span>
                <span className="text-xl font-medium text-gray-500 mb-1 flex items-center gap-1"><Coins className="w-4 h-4 text-yellow-500"/> moedas</span>
              </div>
              <p className="text-3xl font-bold text-orange-600 mb-8">R$ 20,25</p>
              
              <ul className="space-y-3 text-left text-sm text-gray-600">
                <li className="flex items-center gap-2"><Check className="w-5 h-5 text-green-500" /> Crie até 2 rifas de 50 números</li>
                <li className="flex items-center gap-2"><Check className="w-5 h-5 text-green-500" /> Suporte padrão</li>
              </ul>
            </CardContent>
            <CardFooter className="pt-4 pb-8">
              <Button onClick={() => handleComprar('Iniciante')} className="cursor-pointer w-full bg-orange-500 hover:bg-orange-600 text-white text-lg py-6">
                Comprar Iniciante
              </Button>
            </CardFooter>
          </Card>

          <Card className="relative overflow-hidden border-2 border-purple-500 shadow-2xl scale-100 md:scale-105 z-10 bg-gradient-to-b from-white to-purple-50 h-full flex flex-col">
            <div className="absolute top-0 inset-x-0 bg-purple-500 text-white text-center py-1 text-sm font-bold uppercase tracking-wider">
              Mais Popular
            </div>
            <CardHeader className="text-center pb-8 pt-10">
              <div className="mx-auto bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 border border-purple-200 shadow-inner">
                <Star className="w-8 h-8 text-purple-600 fill-purple-600" />
              </div>
              <CardTitle className="text-2xl text-purple-800">Popular</CardTitle>
              <CardDescription>Ideal para criadores intermediários</CardDescription>
            </CardHeader>
            <CardContent className="text-center flex-grow">
              <div className="flex items-end justify-center gap-1 mb-6">
                <span className="text-5xl font-extrabold text-gray-900">350</span>
                <span className="text-xl font-medium text-gray-500 mb-1 flex items-center gap-1"><Coins className="w-4 h-4 text-yellow-500"/> moedas</span>
              </div>
              <p className="text-3xl font-bold text-purple-600 mb-8">R$ 36,54</p>
              
              <ul className="space-y-3 text-left text-sm text-gray-600 font-medium">
                <li className="flex items-center gap-2"><Check className="w-5 h-5 text-purple-500" /> O mais vendido</li>
                <li className="flex items-center gap-2 text-purple-700 bg-purple-100 rounded-md px-2 py-1 w-fit"><Sparkles className="w-4 h-4" /> Bônus de +80 moedas</li>
              </ul>
            </CardContent>
            <CardFooter className="pt-4 pb-8">
              <Button onClick={() => handleComprar('Popular')} className="cursor-pointer w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 text-white text-lg py-6 shadow-lg">
                Comprar Popular
              </Button>
            </CardFooter>
          </Card>

          <Card className="relative overflow-hidden border-2 border-yellow-300 hover:border-yellow-500 hover:shadow-xl transition-all hover:-translate-y-2 bg-gradient-to-b from-white to-yellow-50 h-full flex flex-col">
            <CardHeader className="text-center pb-8 pt-8">
              <div className="mx-auto bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 border border-yellow-200">
                <Trophy className="w-8 h-8 text-yellow-600" />
              </div>
              <CardTitle className="text-2xl text-yellow-800">Profissional</CardTitle>
              <CardDescription>Para grandes criadores de rifa</CardDescription>
            </CardHeader>
            <CardContent className="text-center flex-grow">
              <div className="flex items-end justify-center gap-1 mb-6">
                <span className="text-5xl font-extrabold text-gray-900">500</span>
                <span className="text-xl font-medium text-gray-500 mb-1 flex items-center gap-1"><Coins className="w-4 h-4 text-yellow-500"/> moedas</span>
              </div>
              <p className="text-3xl font-bold text-yellow-600 mb-8">R$ 47,50</p>
              
              <ul className="space-y-3 text-left text-sm text-gray-600">
                <li className="flex items-center gap-2"><Check className="w-5 h-5 text-green-500" /> Melhor custo-benefício</li>
                <li className="flex items-center gap-2 text-yellow-700 bg-yellow-100 rounded-md px-2 py-1 w-fit"><Sparkles className="w-4 h-4" /> Bônus de +150 moedas</li>
              </ul>
            </CardContent>
            <CardFooter className="pt-4 pb-8">
              <Button onClick={() => handleComprar('Profissional')} className="cursor-pointer w-full bg-yellow-500 hover:bg-yellow-600 text-white text-lg py-6">
                Comprar Profissional
              </Button>
            </CardFooter>
          </Card>

        </div>
      </div>
    </div>
  );
}