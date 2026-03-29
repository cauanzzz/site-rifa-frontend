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
  const [usuarioLogado, setUsuarioLogado] = useState<any>(null);

  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const [formaPagamento, setFormaPagamento] = useState('PIX');
  const [nomePagador, setNomePagador] = useState('');
  const [termosAceitos, setTermosAceitos] = useState(false);

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('usuario');
    if (usuarioSalvo) {
      const dados = JSON.parse(usuarioSalvo);
      setUsuarioLogado(dados);
      setNomePagador(dados.nome); 
    }

    const buscarRifa = async () => {
      try {
        const resposta = await fetch(`${import.meta.env.VITE_API_URL}/api/rifa`);
        if (resposta.ok) {
          const todasRifas = await resposta.json();
          const rifaCerta = todasRifas.find((r: any) => r.id === parseInt(id!));
          setRaffle(rifaCerta);
        }
      } catch (erro) {
        toast.error('Erro ao conectar com o servidor C#');
      } finally {
        setLoading(false);
      }
    };
    buscarRifa();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p>Carregando...</p></div>;
  if (!raffle) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p>Rifa não encontrada</p></div>;

  const titulo = raffle.titulo || 'Rifa Sem Título';
  const preco = raffle.preço || 0;
  const descricao = raffle.descricao || 'Sem descrição disponível.';
  const quantidadeTotal = raffle.quantidadeCotas || 1;
  const imagemPadrao = "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=500&q=80";
  const imagemReal = raffle.imagem || raffle.Imagem || imagemPadrao;

  const isEncerrada = raffle.status === 'Encerrada' || raffle.Status === 'Encerrada';
  const numeroSorteado = raffle.numeroSorteado || raffle.NumeroSorteado;

  const cotasReservadas = raffle.cotas ? raffle.cotas.filter((c: any) => c.status === 'Reservado').map((c: any) => c.numero) : [];
  const cotasVendidas = raffle.cotas ? raffle.cotas.filter((c: any) => c.status === 'Vendido').map((c: any) => c.numero) : [];
  const indisponiveis = [...cotasReservadas, ...cotasVendidas];

  const toggleNumber = (num: number) => {
    if (isEncerrada || indisponiveis.includes(num)) return; 
    setSelectedNumbers(prev => prev.includes(num) ? prev.filter(n => n !== num) : [...prev, num]);
  };

  const abrirModalDeCompra = () => {
    if (isEncerrada) return;
    if (!usuarioLogado) {
      toast.error('Você precisa fazer Login para reservar números!');
      return;
    }
    setShowPurchaseDialog(true);
  };

  const handlePurchase = async () => {
    if (!nomePagador) {
      toast.error('Informe o nome de quem fez o pagamento');
      return;
    }

    try {
      const resposta = await fetch(`${import.meta.env.VITE_API_URL}/api/rifa/comprar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          RifaId: raffle.id,
          Numeros: selectedNumbers,
          NomePagador: nomePagador,
          FormaPagamento: formaPagamento,
          CompradorEmail: usuarioLogado.email
        })
      });

      if (resposta.ok) {
        toast.success(`Sucesso! Seus números foram RESERVADOS! 🎉`);
        setShowPurchaseDialog(false);
        setTimeout(() => window.location.reload(), 1500);
      } else {
        toast.error('Erro ao reservar os números.');
      }
    } catch (erro) {
      toast.error('⚠️ Erro de conexão com o servidor C#.');
    }
  };

  const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const progress = (indisponiveis.length / quantidadeTotal) * 100;
  const totalAmount = selectedNumbers.length * preco;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        
        {isEncerrada && numeroSorteado != null && (
          <div className="bg-gradient-to-r from-yellow-100 to-amber-100 border-2 border-yellow-400 p-6 rounded-2xl mb-8 text-center shadow-md animate-in slide-in-from-top-4">
            <Trophy className="w-12 h-12 text-yellow-600 mx-auto mb-2" />
            <h2 className="text-3xl font-black text-yellow-800 tracking-tight">RIFA ENCERRADA</h2>
            <div className="mt-4 flex flex-col md:flex-row items-center justify-center gap-3">
              <span className="text-lg font-medium text-yellow-700">O número vencedor foi:</span>
              <span className="font-black text-4xl px-6 py-2 bg-white rounded-xl border-2 border-yellow-400 text-yellow-600 shadow-sm">
                {numeroSorteado.toString().padStart(4, '0')}
              </span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <Card>
              <div className="relative h-96 overflow-hidden rounded-t-lg">
                <img src={imagemReal} alt={titulo} className={`w-full h-full object-cover ${isEncerrada ? 'grayscale-[30%]' : ''}`} />
                <Badge className={`absolute top-4 right-4 text-lg px-4 py-2 ${isEncerrada ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500'}`}>
                  {isEncerrada ? 'Encerrada' : 'Ativa'}
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-3xl mb-2">{titulo}</CardTitle>
                <CardDescription className="text-base">{descricao}</CardDescription>
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
                    <p className="text-sm font-semibold text-blue-600">
                    {raffle.dataSorteio ? new Date(raffle.dataSorteio).toLocaleDateString('pt-BR') : 'Em breve'}
                    </p>
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

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><ShoppingCart className="w-5 h-5" /> Seu carrinho</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Reservados/Vendidos:</span>
                    <span className="font-semibold">{indisponiveis.length} / {quantidadeTotal}</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                {isEncerrada ? (
                  <div className="border-t pt-6 mt-4">
                    <Button disabled className="w-full py-6 text-lg bg-slate-200 text-slate-500 cursor-not-allowed">
                      Vendas encerradas
                    </Button>
                  </div>
                ) : selectedNumbers.length > 0 ? (
                  <>
                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between text-lg">
                        <span className="font-bold">Total:</span>
                        <span className="font-bold text-purple-600">{formatCurrency(totalAmount)}</span>
                      </div>
                    </div>
                    <Button 
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      onClick={abrirModalDeCompra}
                    >
                      Reservar números
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

        <Card>
          <CardHeader>
            <CardTitle>
              {isEncerrada ? 'Números da Rifa' : 'Escolha seus números da sorte'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-25 gap-2">
              {Array.from({ length: quantidadeTotal }, (_, i) => i + 1).map(num => {
                const isSold = cotasVendidas.includes(num);
                const isReserved = cotasReservadas.includes(num);
                const isSelected = selectedNumbers.includes(num);
                const isWinner = isEncerrada && num === numeroSorteado;

                let buttonClass = '';

                if (isWinner) {
                  buttonClass = 'bg-yellow-400 text-yellow-900 border-2 border-yellow-500 shadow-xl scale-110 z-10 cursor-default';
                } else if (isEncerrada) {
                  buttonClass = 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60';
                } else if (isSold) {
                  buttonClass = 'bg-gray-200 text-gray-400 cursor-not-allowed';
                } else if (isReserved) {
                  buttonClass = 'bg-yellow-100 text-yellow-600 border-2 border-yellow-300 cursor-not-allowed';
                } else if (isSelected) {
                  buttonClass = 'bg-gradient-to-br from-purple-600 to-blue-600 text-white scale-95 shadow-lg';
                } else {
                  buttonClass = 'bg-white border-2 border-gray-200 hover:border-purple-400 hover:scale-105 cursor-pointer';
                }

                return (
                  <button
                    key={num} 
                    onClick={() => toggleNumber(num)} 
                    disabled={isSold || isReserved || isEncerrada}
                    className={`aspect-square rounded-lg font-semibold text-sm transition-all flex items-center justify-center ${buttonClass}`}
                  >
                    {isWinner ? (
                      <Trophy className="w-5 h-5" />
                    ) : isSold && !isEncerrada ? (
                      <Check className="w-4 h-4" />
                    ) : isReserved && !isEncerrada ? (
                      <Clock className="w-4 h-4" />
                    ) : (
                      num.toString().padStart(4, '0')
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showPurchaseDialog} onOpenChange={setShowPurchaseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Finalizar reserva</DialogTitle>
            <DialogDescription>A compra será confirmada após o pagamento.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Forma de pagamento</Label>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-purple-600"
                value={formaPagamento} onChange={(e) => setFormaPagamento(e.target.value)}
              >
                <option value="PIX">PIX</option>
                <option value="Cartão">Cartão de Crédito</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Nome exato de quem fez o PIX/Pagamento</Label>
              <Input 
                value={nomePagador} 
                onChange={(e) => setNomePagador(e.target.value)} 
                placeholder="Ex: Cauan Silva" 
              />
              <p className="text-xs text-gray-500 mt-1">Sua reserva ficará vinculada à sua conta: {usuarioLogado?.email}</p>
            </div>

            <div className="flex items-start gap-3 bg-yellow-100 p-4 rounded-lg mt-4 border border-slate-200">
            <input
              type="checkbox"
              id="aceitoTermos"
              className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 cursor-pointer"
              checked={termosAceitos}
              onChange={(e) => setTermosAceitos(e.target.checked)}
            />
            <label htmlFor="aceitoTermos" className="text-xs text-gray-600 cursor-pointer select-none">
            <strong>Atenção:</strong> Este site não tem relação com o prêmio e vínculo direto com a rifa. Toda a responsabilidade pela entrega e sorteio é exclusiva do criador.
            </label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPurchaseDialog(false)}>
              Cancelar
            </Button>

            <Button 
              onClick={handlePurchase} 
              disabled={!termosAceitos}
              className="bg-gradient-to-r from-purple-600 to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
              Confirmar reserva
              </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}