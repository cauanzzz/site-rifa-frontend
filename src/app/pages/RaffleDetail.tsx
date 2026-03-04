import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useRaffles } from '../context/RaffleContext';
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
  const { getRaffleById, purchaseNumbers } = useRaffles();
  const raffle = getRaffleById(id!);

  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const toggleNumber = (num: number) => {
    if (raffle.soldNumbers.includes(num)) return;
    
    setSelectedNumbers(prev => 
      prev.includes(num) 
        ? prev.filter(n => n !== num)
        : [...prev, num]
    );
  };

  const handlePurchase = () => {
    if (!buyerName || !buyerPhone || !buyerEmail) {
      toast.error('Preencha todos os campos');
      return;
    }

    purchaseNumbers({
      raffleId: raffle.id,
      numbers: selectedNumbers,
      buyerName,
      buyerPhone,
      buyerEmail,
      totalAmount: selectedNumbers.length * raffle.price
    });

    toast.success(`Parabéns! Você adquiriu ${selectedNumbers.length} número(s)!`);
    setShowPurchaseDialog(false);
    setSelectedNumbers([]);
    setBuyerName('');
    setBuyerPhone('');
    setBuyerEmail('');
  };

  const progress = (raffle.soldNumbers.length / raffle.totalNumbers) * 100;
  const totalAmount = selectedNumbers.length * raffle.price;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Raffle Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <Card>
              <div className="relative h-96 overflow-hidden rounded-t-lg">
                <img 
                  src={raffle.imageUrl} 
                  alt={raffle.title}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-4 right-4 bg-green-500 text-lg px-4 py-2">
                  Ativa
                </Badge>
              </div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-3xl mb-2">{raffle.title}</CardTitle>
                    <CardDescription className="text-base">{raffle.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Ticket className="w-4 h-4 text-purple-600" />
                      <span className="text-sm text-gray-600">Preço</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-600">{formatCurrency(raffle.price)}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-600">Sorteio</span>
                    </div>
                    <p className="text-sm font-semibold text-blue-600">{formatDate(raffle.drawDate)}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Trophy className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-600">Prêmio</span>
                    </div>
                    <p className="text-sm font-semibold text-green-600">{raffle.prize}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cart */}
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
                    <span className="text-gray-600">Vendidos:</span>
                    <span className="font-semibold">{raffle.soldNumbers.length} / {raffle.totalNumbers}</span>
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
                        <span className="font-semibold">{formatCurrency(raffle.price)}</span>
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
                      Finalizar Compra
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

        {/* Numbers Grid */}
        <Card>
          <CardHeader>
            <CardTitle>Escolha seus números da sorte</CardTitle>
            <CardDescription>
              Clique nos números disponíveis para selecioná-los
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-15 gap-2">
              {Array.from({ length: raffle.totalNumbers }, (_, i) => i + 1).map(num => {
                const isSold = raffle.soldNumbers.includes(num);
                const isSelected = selectedNumbers.includes(num);

                return (
                  <button
                    key={num}
                    onClick={() => toggleNumber(num)}
                    disabled={isSold}
                    className={`
                      aspect-square rounded-lg font-semibold text-sm transition-all
                      ${isSold 
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                        : isSelected
                          ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white scale-95 shadow-lg'
                          : 'bg-white border-2 border-gray-200 hover:border-purple-400 hover:scale-105'
                      }
                    `}
                  >
                    {isSold && <Check className="w-3 h-3 mx-auto" />}
                    {!isSold && num.toString().padStart(4, '0')}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-6 mt-6 justify-center text-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white border-2 border-gray-200 rounded"></div>
                <span className="text-gray-600">Disponível</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded"></div>
                <span className="text-gray-600">Selecionado</span>
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

      {/* Purchase Dialog */}
      <Dialog open={showPurchaseDialog} onOpenChange={setShowPurchaseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Finalizar Compra</DialogTitle>
            <DialogDescription>
              Preencha seus dados para concluir a compra dos números
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Total a pagar:</p>
              <p className="text-2xl font-bold text-purple-600">{formatCurrency(totalAmount)}</p>
              <p className="text-xs text-gray-500 mt-1">{selectedNumbers.length} número(s) selecionado(s)</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input 
                id="name"
                placeholder="Seu nome completo"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input 
                id="phone"
                placeholder="(00) 00000-0000"
                value={buyerPhone}
                onChange={(e) => setBuyerPhone(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input 
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={buyerEmail}
                onChange={(e) => setBuyerEmail(e.target.value)}
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
              Confirmar Compra
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
