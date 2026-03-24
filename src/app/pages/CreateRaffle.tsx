import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, Image as ImageIcon, Coins, AlertTriangle } from 'lucide-react';
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
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [temData, setTemData] = useState(false);
  const [termosCriacaoAceitos, setTermosCriacaoAceitos] = useState(false);

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('usuario');
    if (usuarioSalvo) {
      setUsuarioLogado(JSON.parse(usuarioSalvo));
    } else {
      toast.error('Você precisa estar logado para criar uma rifa!');
      navigate('/');
    }
  }, [navigate]);

  const calcularCustoMoedas = (quantidade: number) => {
    const tabelaPrecos: { [key: number]: number } = {
      50: 75,
      100: 144,
      150: 207,
      200: 264,
      250: 315,
      300: 360,
      350: 399,
      400: 432,
      450: 459,
      500: 480
    };
    return tabelaPrecos[quantidade] || 0;
  };

  const qtdNumeros = parseInt(totalNumbers) || 0;
  const custoEmMoedas = calcularCustoMoedas(qtdNumeros);
  const saldoAtual = usuarioLogado?.moedas || 0;
  const ehAdmin = usuarioLogado?.isAdmin || usuarioLogado?.IsAdmin;
  const saldoInsuficiente = !ehAdmin && (custoEmMoedas > saldoAtual);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('A imagem é muito pesada! Escolha uma de até 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const prepararCriacao = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !price || !totalNumbers) {
      toast.error('Preencha os campos obrigatórios!');
      return;
    }
    if (temData && !drawDate) {
      toast.error('Preencha a data do sorteio ou desmarque a opção!');
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
    setMostrarConfirmacao(true);
  };

  const confirmarCriacao = async () => {
    setSalvando(true); 
    const priceNum = parseFloat(price);

    try {
      const resposta = await fetch('http://localhost:5267/api/rifa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Titulo: title,
          Descricao: description,
          Premio: prize,
          Imagem: imageUrl,
          Preço: priceNum,
          QuantidadeCotas: qtdNumeros,
          CriadorEmail: usuarioLogado.email,
          DataSorteio: temData ? drawDate : null
        })
      });

      if (resposta.ok) {
        const dadosBackend = await resposta.json();
        const usuarioAtualizado = { ...usuarioLogado, moedas: dadosBackend.moedasRestantes };
        localStorage.setItem('usuario', JSON.stringify(usuarioAtualizado));

        toast.success(ehAdmin ? 'Rifa criada grátis! (Admin) 👑' : `Rifa criada com sucesso! Foram descontadas ${custoEmMoedas} moedas. 🪙`);
        setMostrarConfirmacao(false); 
        setTimeout(() => navigate('/'), 1500);
      } else {
        const erroBackend = await resposta.text();
        toast.error(`C# recusou: ${erroBackend}`);
      }
    } catch (erro) {
      toast.error('⚠️ Erro de conexão com o C#.');
    } finally {
      setSalvando(false); 
    }
  };

  return (
    <>
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
                  <CardDescription>Crie sua rifa. O custo em moedas varia conforme a quantidade de números.</CardDescription>
                </div>
                {usuarioLogado && (
                  <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border border-yellow-300 shadow-sm flex items-center gap-1 px-3 py-1 text-base">
                    <Coins className="w-4 h-4" /> {ehAdmin ? '∞ Admin' : `${saldoAtual} moedas`}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={prepararCriacao} className="space-y-6">
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
                  <Label htmlFor="imagem">Foto do Prêmio (Máx 2MB)</Label>
                  <div className="flex gap-4 items-center">
                    <div className="flex-1">
                      <Label htmlFor="imagem" className="flex items-center justify-center w-full h-12 px-4 border-2 border-dashed border-purple-300 rounded-lg bg-purple-50 hover:bg-purple-100 cursor-pointer transition-colors text-purple-700 font-medium">
                        <ImageIcon className="w-5 h-5 mr-2" />
                        Escolher arquivo do computador...
                      </Label>
                      <input id="imagem" type="file" accept="image/png, image/jpeg, image/jpg" className="hidden" onChange={handleImageChange} />
                    </div>
                    {imageUrl ? (
                      <div className="w-16 h-16 rounded-xl border-2 border-purple-200 overflow-hidden shadow-sm shrink-0">
                        <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-xl border border-gray-200 flex items-center justify-center bg-gray-50 shrink-0">
                        <ImageIcon className="w-6 h-6 text-gray-300" />
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
                    <Label htmlFor="totalNumbers">Quantidade de Números (Máx 500) *</Label>
                    <select id="totalNumbers" value={totalNumbers} onChange={(e) => setTotalNumbers(e.target.value)} required className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600">
                      <option value="" disabled>Selecione uma opção...</option>
                      <option value="50">50 números (75 moedas)</option>
                      <option value="100">100 números (144 moedas)</option>
                      <option value="150">150 números (207 moedas)</option>
                      <option value="200">200 números (264 moedas)</option>
                      <option value="250">250 números (315 moedas)</option>
                      <option value="300">300 números (360 moedas)</option>
                      <option value="350">350 números (399 moedas)</option>
                      <option value="400">400 números (432 moedas)</option>
                      <option value="450">450 números (459 moedas)</option>
                      <option value="500">500 números (480 moedas)</option>
                    </select>
                    {qtdNumeros > 0 && (
                      <p className={`text-sm mt-2 font-medium ${saldoInsuficiente ? 'text-red-600' : 'text-green-600'}`}>
                        {saldoInsuficiente ? '❌' : '✅'} {ehAdmin ? 'Custo: Grátis (Admin)' : `Custo: ${custoEmMoedas} ${custoEmMoedas === 1 ? 'moeda' : 'moedas'}`}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-4 bg-gray-50 p-5 rounded-xl border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base font-semibold text-gray-900">Data do Sorteio</Label>
                      <p className="text-sm text-gray-500">Já tem uma data definida para sortear?</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={temData} 
                        onChange={(e) => {
                          setTemData(e.target.checked);
                          if (!e.target.checked) setDrawDate(''); 
                        }} 
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  {temData && (
                    <div className="space-y-2 pt-3 border-t border-gray-200 animate-in fade-in slide-in-from-top-2">
                      <Label htmlFor="drawDate">Escolha a Data e Hora *</Label>
                      <Input id="drawDate" type="datetime-local" value={drawDate} onChange={(e) => setDrawDate(e.target.value)} required={temData} />
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="button" variant="outline" onClick={() => navigate('/')} className="flex-1">Cancelar</Button>
                  <Button type="submit" disabled={saldoInsuficiente} className={`flex-1 ${saldoInsuficiente ? 'bg-gray-400' : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700'}`}>Prosseguir</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {mostrarConfirmacao && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative scale-in-center">
            <div className="mx-auto bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 border border-yellow-200">
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-center mb-2 text-gray-900">Confirmar Criação</h2>
            <p className="text-center text-gray-600 mb-6">Você está prestes a criar uma rifa com <strong>{qtdNumeros} números</strong>.</p>
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Seu saldo atual:</span>
                <span className="font-semibold text-gray-900">{ehAdmin ? '∞ Admin' : `${saldoAtual} moedas`}</span>
              </div>
              <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-200">
                <span className="text-gray-600">Custo da rifa:</span>
                <span className="font-bold text-red-600">{ehAdmin ? 'Grátis' : `- ${custoEmMoedas} moedas`}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Saldo após criação:</span>
                <span className="font-bold text-green-600 text-lg">{ehAdmin ? '∞ Admin' : `${saldoAtual - custoEmMoedas} moedas`}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-100 p-4 rounded-lg mt-6 mb-4 border border-slate-200">
             <input
              type="checkbox"
              id="termosCriacao"
              className="mt-1 w-4 h-4 text-purple-600 rounded border-gray-300 cursor-pointer"
              checked={termosCriacaoAceitos}
              onChange={(e) => setTermosCriacaoAceitos(e.target.checked)}
            />    
            <label htmlFor="termosCriacao" className="text-sm text-gray-700 cursor-pointer select-none">
            <strong>Termo de Responsabilidade:</strong> Declaro que sou o único responsável pela veracidade desta rifa, pela realização justa do sorteio e pela entrega do prêmio ao ganhador, isentando totalmente a plataforma de qualquer responsabilidade legal ou financeira.
            </label>
          </div>

        <div className="flex flex-col gap-5 mt-4">        
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => setMostrarConfirmacao(false)} 
              disabled={salvando}
              className="flex-1"
            >
              Cancelar
            </Button>
            
            <Button 
              onClick={confirmarCriacao} 
              disabled={salvando || !termosCriacaoAceitos}
              className={`flex-1 text-white font-bold transition-all ${
                salvando || !termosCriacaoAceitos
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700'
              }`}
            >
              {salvando ? 'Salvando...' : 'Confirmar'}
            </Button>
          </div>
  
</div>
          </div>
        </div>
      )}
    </>
  );
}