import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, Image as ImageIcon, Coins } from 'lucide-react';
import { toast } from 'sonner';

export function CreateRaffle() {
  const navigate = useNavigate();
  const [usuarioLogado, setUsuarioLogado] = useState<any>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [prize, setPrize] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [price, setPrice] = useState('');
  const [totalNumbers, setTotalNumbers] = useState('');
  const [drawDate, setDrawDate] = useState('');

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('usuario');
    if (usuarioSalvo) {
      setUsuarioLogado(JSON.parse(usuarioSalvo));
    } else {
      toast.error('Você precisa estar logado para criar uma rifa!');
      navigate('/'); 
    }
  }, [navigate]);

  // === A MATEMÁTICA EM TEMPO REAL ===
  const qtdNumeros = parseInt(totalNumbers) || 0;
  const custoEmMoedas = Math.ceil(qtdNumeros / 10);
  const saldoAtual = usuarioLogado?.moedas || 0;
  const saldoInsuficiente = custoEmMoedas > saldoAtual;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !price || !totalNumbers) {
      toast.error('Preencha os campos obrigatórios!');
      return;
    }

    if (saldoInsuficiente) {
      toast.error('Você não tem moedas suficientes para criar esta rifa!');
      return;
    }

    const priceNum = parseFloat(price);

    if (priceNum <= 0 || qtdNumeros <= 0) {
      toast.error('Preço e quantidade devem ser maiores que zero');
      return;
    }

    try {
      const resposta = await fetch('https://localhost:7002/api/rifa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          Titulo: title, 
          Preço: priceNum, 
          QuantidadeCotas: qtdNumeros,
          CriadorEmail: usuarioLogado.email 
        })
      });

      if (resposta.ok) {
        const dadosBackend = await resposta.json();
        const usuarioAtualizado = { ...usuarioLogado, moedas: dadosBackend.moedasRestantes };
        localStorage.setItem('usuario', JSON.stringify(usuarioAtualizado));

        toast.success(`Rifa criada com sucesso! Foram descontadas ${custoEmMoedas} moedas. 🪙`);
        setTimeout(() => navigate('/'), 1500);
      } else {
        const erroBackend = await resposta.text();
        toast.error(`C# recusou: ${erroBackend}`);
      }
    } catch (erro) {
      toast.error('⚠️ Erro de conexão com o C#.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-3xl">Criar Nova Rifa</CardTitle>
                <CardDescription>Crie sua rifa. A cada 10 números, você gasta 1 moeda.</CardDescription>
              </div>
              {usuarioLogado && (
                <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border border-yellow-300 shadow-sm flex items-center gap-1 px-3 py-1 text-base">
                  <Coins className="w-4 h-4" /> {saldoAtual} moedas
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="space-y-2">
                <Label htmlFor="title">Título da Rifa *</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição *</Label>
                <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prize">Nome do Prêmio *</Label>
                <Input id="prize" value={prize} onChange={(e) => setPrize(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">URL da Imagem</Label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                  </div>
                  {imageUrl ? (
                    <div className="w-12 h-12 rounded border border-gray-200 overflow-hidden">
                      <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded border border-gray-200 flex items-center justify-center bg-gray-50">
                      <ImageIcon className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Preço por Número (R$) *</Label>
                  <Input id="price" type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="totalNumbers">Quantidade de Números *</Label>
                  <Input id="totalNumbers" type="number" min="1" value={totalNumbers} onChange={(e) => setTotalNumbers(e.target.value)} required />
                  
                  {/* O AVISO DE CUSTO NA TELA */}
                  {qtdNumeros > 0 && (
                    <p className={`text-sm mt-2 font-medium ${saldoInsuficiente ? 'text-red-600' : 'text-green-600'}`}>
                      {saldoInsuficiente ? '❌' : '✅'} Custo: {custoEmMoedas} {custoEmMoedas === 1 ? 'moeda' : 'moedas'}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="drawDate">Data e Hora do Sorteio *</Label>
                <Input id="drawDate" type="datetime-local" value={drawDate} onChange={(e) => setDrawDate(e.target.value)} required />
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="button" variant="outline" onClick={() => navigate('/')} className="flex-1">
                  Cancelar
                </Button>
                <Button 
                  type="submit"
                  disabled={saldoInsuficiente} 
                  className={`flex-1 ${saldoInsuficiente ? 'bg-gray-400' : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700'}`}
                >
                  Criar Rifa
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}