import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Progress } from '../components/ui/progress';
import { ArrowLeft, Calendar, Check, Clock, ShoppingCart, Ticket, Trophy } from 'lucide-react';
import { toast } from 'sonner';

export function RaffleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [raffle, setRaffle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const [formaPagamento, setFormaPagamento] = useState('PIX');
  const [nomePagador, setNomePagador] = useState('');

  useEffect(() => {
    const buscarRifa = async () => {
      try {
        const resposta = await fetch('https://localhost:7002/api/rifa');
        if (resposta.ok) {
          const todasRifas = await resposta.json();
          const rifaCerta = todasRifas.find((r: any) => r.id === parseInt(id!));
          setRaffle(rifaCerta);
        }
      } catch (erro) {
        console.error(erro);
        toast.error('Erro ao conectar com o servidor C#');
      } finally {
        setLoading(false);
      }
    };
    buscarRifa();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-gray-600">Carregando a rifa do banco de dados...</p>
      </div>
    );
  }

  if (!raffle) {
    return ( 
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Rifa não encontrada</p>
          <Button onClick={() => navigate('/')}>Voltar para início</Button>
        </div>
      </div>
    );
  }

  const titulo = raffle.titulo || 'Rifa Sem Título';
  const preco = raffle.preço || 0;
  const quantidadeTotal = raffle.quantidadeCotas || 1;
  const imagemPadrao = "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=500&q=80";

  // === SEPARANDO RESERVADOS E VENDIDOS ===
  const cotasReservadas = raffle.cotas ? raffle.cotas.filter((c: any) => c.status === 'Reservado').map((c: any) => c.numero) : [];
  const cotasVendidas = raffle.cotas ? raffle.cotas.filter((c: any) => c.status === 'Vendido').map((c: any) => c.numero) : [];
  const indisponiveis = [...cotasReservadas, ...cotasVendidas];

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const toggleNumber = (num: number) => {
    if (indisponiveis.includes(num)) return; 
    
    setSelectedNumbers(prev => 
      prev.includes(num) 
        ? prev.filter(n => n !== num)
        : [...prev, num]
    );
  };

  // === O BOTÃO DE COMPRAR FINALMENTE GANHA VIDA ===
  const handlePurchase = async () => {
    if (!nomePagador) {
      toast.error('Por favor, informe o nome de quem fez o pagamento');
      return;
    }

    try {
      const resposta = await fetch('https://localhost:7002/api/rifa/comprar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          RifaId: raffle.id,
          Numeros: selectedNumbers,
          NomePagador: nomePagador,
          FormaPagamento: formaPagamento
        })
      });

      if (resposta.ok) {
        toast.success(`Sucesso! Seus ${selectedNumbers.length} números foram RESERVADOS! 🎉`);
        setShowPurchaseDialog(false);
        setSelectedNumbers([]);
        setNomePagador('');
        setTimeout(() => window.location.reload(), 1500);
      } else {
        toast.error('Erro ao reservar os números.');
      }
    } catch (erro) {
      toast.error('⚠️ Erro de conexão com o servidor C#.');
      console.error(erro);
    }
  };

  const progress = (indisponiveis.length / quantidadeTotal) * 100;
  const totalAmount = selectedNumbers.length * preco;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <Card>
              <div className="relative h-96 overflow-hidden rounded-t-lg">
                <img src={imagemPadrao} alt={titulo} className="w-full h-full object-cover" />
                <Badge className="absolute top-4 right-4 bg-green-500 text-lg px-4 py-2">Ativa</Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-3xl mb-2">{titulo}</CardTitle>
                <CardDescription className="text-base">Concorra a este prêmio incrível e ajude a nossa causa!</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Ticket className="w-4 h-4 text-purple-600" />
                      <span className="text-sm text-gray-600">Preço</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-600">{formatCurrency(preco)}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-600">Sorteio</span>
                    </div>
                    <p className="text-sm font-semibold text-blue-600">Em breve</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Trophy className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-600">Prêmio</span>
                    </div>
                    <p className="text-sm font-semibold text-green-600">{titulo}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Carrinho */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Seu Carrinho
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Reservados/Vendidos:</span>
                    <span className="font-semibold">{indisponiveis.length} / {quantidadeTotal}</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                {selectedNumbers.length > 0 ? (
                  <>
                    <div className="border-t pt-4">
                      <p className="text-sm text-gray-600 mb-2">Números selecionados:</p>
                      <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                        {selectedNumbers.sort((a, b) => a - b).map(num => (
                          <Badge key={num} variant="secondary" className="bg-purple-100 text-purple-700">
                            {num.toString().padStart(4, '0')}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Quantidade:</span>
                        <span className="font-semibold">{selectedNumbers.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Preço unitário:</span>
                        <span className="font-semibold">{formatCurrency(preco)}</span>
                      </div>
                      <div className="flex justify-between text-lg border-t pt-2">
                        <span className="font-bold">Total:</span>
                        <span className="font-bold text-purple-600">{formatCurrency(totalAmount)}</span>
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      onClick={() => setShowPurchaseDialog(true)}
                    >
                      Reservar Números
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Ticket className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Selecione os números abaixo</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quadro de Números com as novas cores */}
        <Card>
          <CardHeader>
            <CardTitle>Escolha seus números da sorte</CardTitle>
            <CardDescription>Clique nos números disponíveis para selecioná-los</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-15 gap-2">
              {Array.from({ length: quantidadeTotal }, (_, i) => i + 1).map(num => {
                const isSold = cotasVendidas.includes(num);
                const isReserved = cotasReservadas.includes(num);
                const isSelected = selectedNumbers.includes(num);

                return (
                  <button
                    key={num}
                    onClick={() => toggleNumber(num)}
                    disabled={isSold || isReserved}
                    className={`
                      aspect-square rounded-lg font-semibold text-sm transition-all flex items-center justify-center
                      ${isSold ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 
                        isReserved ? 'bg-yellow-100 text-yellow-600 border-2 border-yellow-300 cursor-not-allowed' :
                        isSelected ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white scale-95 shadow-lg' :
                        'bg-white border-2 border-gray-200 hover:border-purple-400 hover:scale-105'
                      }
                    `}
                  >
                    {isSold && <Check className="w-4 h-4" />}
                    {isReserved && <Clock className="w-4 h-4" />}
                    {!isSold && !isReserved && num.toString().padStart(4, '0')}
                  </button>
                );
              })}
            </div>

            {/* LEGENDA ATUALIZADA */}
            <div className="flex flex-wrap items-center gap-6 mt-6 justify-center text-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white border-2 border-gray-200 rounded"></div>
                <span className="text-gray-600">Disponível</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded"></div>
                <span className="text-gray-600">Selecionado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-yellow-100 border-2 border-yellow-300 rounded flex items-center justify-center">
                  <Clock className="w-4 h-4 text-yellow-600" />
                </div>
                <span className="text-gray-600">Aguardando Pagamento</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                  <Check className="w-4 h-4 text-gray-400" />
                </div>
                <span className="text-gray-600">Vendido</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal de Pagamento */}
      <Dialog open={showPurchaseDialog} onOpenChange={setShowPurchaseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Finalizar Reserva</DialogTitle>
            <DialogDescription>
              Preencha seus dados para reservar os números. A compra será confirmada após o pagamento.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Total a pagar:</p>
              <p className="text-2xl font-bold text-purple-600">{formatCurrency(totalAmount)}</p>
              <p className="text-xs text-gray-500 mt-1">{selectedNumbers.length} número(s) selecionado(s)</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pagamento">Forma de Pagamento</Label>
              <select 
                id="pagamento"
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2"
                value={formaPagamento}
                onChange={(e) => setFormaPagamento(e.target.value)}
              >
                <option value="PIX">PIX</option>
                <option value="Cartão">Cartão de Crédito</option>
                <option value="Transferência">Transferência Bancária</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nomePagador">Nome de quem fez o pagamento</Label>
              <Input 
                id="nomePagador"
                placeholder="Ex: Cauan Silva (Nome no comprovante)"
                value={nomePagador}
                onChange={(e) => setNomePagador(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPurchaseDialog(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handlePurchase}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Confirmar Reserva
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}