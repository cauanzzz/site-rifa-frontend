import { useRaffles } from '../context/RaffleContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Link } from 'react-router';
import { useState, useEffect } from 'react';
import { Clock, Ticket, TrendingUp, ChevronDown, Info, Coins, LifeBuoy, RefreshCw, Search } from 'lucide-react';
import { Header } from '../components/header';
import { Input } from '../components/ui/input';

export function Home() {
  const [logado, setLogado] = useState(false);
  const [usuarioNome, setUsuarioNome] = useState(''); 
  const [moedas, setMoedas] = useState(0); 
  const [menuAberto, setMenuAberto] = useState(false);
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [activeRaffles, setActiveRaffles] = useState<any[]>([]);
  const [mostrarCadastro, setMostrarCadastro] = useState(false);
  const [nomeCadastro, setNomeCadastro] = useState('');
  const [emailCadastro, setEmailCadastro] = useState('');
  const [senhaCadastro, setSenhaCadastro] = useState('');
  const [loading, setLoading] = useState(true);
  const [termoBusca, setTermoBusca] = useState('');

  const carregarTodasAsRifas = async () => {
    setLoading(true);
    try {
      const resposta = await fetch('http://localhost:5267/api/rifa');
      
      if (resposta.ok) {
        const dados = await resposta.json();
        if (Array.isArray(dados)) {
          setActiveRaffles(dados); 
        } else {
          setActiveRaffles([]); 
        }
      } else {
        setActiveRaffles([]);
      }
    } catch (erro) {
      console.error("Erro de conexão com o servidor:", erro);
      setActiveRaffles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarTodasAsRifas();
  }, []);

  const buscarPorCriador = async () => {
    if (!termoBusca.trim()) {
      carregarTodasAsRifas(); 
      return;
    }

    setLoading(true);
    try {
      const resposta = await fetch(`http://localhost:5267/api/Rifa/buscar-por-criador?nome=${termoBusca}`);
      
      if (resposta.ok) {
        const dados = await resposta.json();
        setActiveRaffles(dados); 
      } else if (resposta.status === 404) {
        setActiveRaffles([]); 
        alert('Nenhuma rifa encontrada para este criador.');
      }
    } catch (erro) {
      console.error("Erro na busca:", erro);
      alert('Erro de conexão com a API.');
    } finally {
      setLoading(false);
    }
  };

  const fazerLogin = async () => {
    try {
      const resposta = await fetch('http://localhost:5267/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      if (resposta.ok) {
        const dadosUsuario = await resposta.json();
        
        localStorage.setItem('usuario', JSON.stringify(dadosUsuario));
        
        alert(`Bem-vindo(a) de volta, ${dadosUsuario.nome}! 🚀 Você tem ${dadosUsuario.moedas} moedas.`);
        setUsuarioNome(dadosUsuario.nome);
        setMoedas(dadosUsuario.moedas); 
        setLogado(true);
        setMostrarLogin(false);
        setEmail('');
        setSenha('');
      } else {
        const erro = await resposta.text();
        alert(`❌ ${erro || 'E-mail ou senha incorretos!'}`);
      }
    } catch (erro) {
      alert('⚠️ Erro de conexão! O seu C# está rodando?');
      console.error(erro);
    }
  };

  const fazerCadastro = async () => {
    try {
      const resposta = await fetch('http://localhost:5267/api/auth/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          nome: nomeCadastro, 
          email: emailCadastro, 
          senha: senhaCadastro 
        })
      });

      if (resposta.ok) {
        alert('🎉 Conta criada com sucesso! Você ganhou 50 moedas de brinde. Agora faça o login.');
        setMostrarCadastro(false);
        setMostrarLogin(true);
      } else {
        const erro = await resposta.text();
        alert(`❌ Erro: ${erro}`);
      }
    } catch (erro) {
      alert('⚠️ Erro de conexão! O seu C# está rodando?');
      console.error(erro);
    }
  };

  const fazerLogout = () => {
    localStorage.removeItem('usuario'); 
    setLogado(false);
    setUsuarioNome('');
    setMoedas(0); 
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return 'A definir';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const formatCurrency = (value: number) => {
    if (value === undefined || value === null) return 'R$ 0,00';
    return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Header />

      <section className="container mx-auto px-4 py-12">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 pb-2">
            Rifas ativas
          </h2>
          <p className="text-xl text-gray-600">
            Escolha sua rifa favorita e concorra a prêmios incríveis com apenas alguns cliques!
          </p>
        </div>

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
                  {activeRaffles.reduce((sum, r) => sum + (r.quantidadeCotas || 0), 0)}
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

        <div className="mb-8 flex gap-2 max-w-md mx-auto lg:mx-0">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Buscar pelo nome do criador..."
              className="pl-10 w-full bg-white border-gray-200 shadow-sm"
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && buscarPorCriador()} 
            />
          </div>
          <Button onClick={buscarPorCriador} className="bg-purple-600 hover:bg-purple-700 text-white shadow-sm">
            Buscar
          </Button>
        </div>

        {loading ? (
           <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm mt-8">
              <RefreshCw className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
              <p className="text-xl text-gray-800 font-bold">Carregando rifas...</p>
              <p className="text-gray-500 mt-2">Buscando informações do servidor...</p>
           </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {activeRaffles
                .filter(r => r.status !== 'Encerrada' && r.Status !== 'Encerrada')
                .map((raffle) => {
                const titulo = raffle.titulo || raffle.Titulo || 'Rifa Sem Título';
                const preco = raffle.preço || 0;
                const quantidadeTotal = raffle.quantidadeCotas || 1;
                const cotasVendidas = raffle.cotasVendidas || 0;
                const progress = (cotasVendidas / quantidadeTotal) * 100;
                const imagemReal = raffle.imagem || raffle.Imagem || "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=500&q=80";
                
                return (
                  <Card key={raffle.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 border-2 hover:border-purple-200">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={imagemReal} 
                        alt={titulo}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-3 right-3 bg-green-500 hover:bg-green-600">
                        Ativa
                      </Badge>
                    </div>
                    
                    <CardHeader>
                      <CardTitle className="text-xl">{titulo}</CardTitle>
                      <CardDescription className="line-clamp-2">
                            Criador: {raffle.criadorNome || raffle.CriadorNome || raffle.criadorEmail}
                      </CardDescription>                    
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Preço por número:</span>
                        <span className="font-bold text-lg text-purple-600">{formatCurrency(preco)}</span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Vendidos:</span>
                          <span className="font-semibold">{cotasVendidas} / {quantidadeTotal}</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        <p className="text-xs text-gray-500 text-right">{progress.toFixed(0)}% vendido</p>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">
                      <Clock className="w-4 h-4" />
                        <span>
                        Sorteio: {(raffle.dataSorteio || raffle.DataSorteio) 
                        ? new Date(raffle.dataSorteio || raffle.DataSorteio).toLocaleDateString('pt-BR') 
                        : 'Em breve'}
                        </span>
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

            {activeRaffles.length === 0 && !loading && (
              <div className="text-center py-12 mt-8">
                <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-xl text-gray-600">Nenhuma rifa encontrada para exibir.</p>
              </div>
            )}
          </>
        )}
      </section>

      {mostrarLogin && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative">
            <button 
              onClick={() => setMostrarLogin(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Entrar no RIFEX
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                <input 
                  type="email" placeholder="seu@email.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                <input 
                  type="password" placeholder="••••••••"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                  value={senha} onChange={(e) => setSenha(e.target.value)}
                />
              </div>
              <Button 
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 mt-6"
                onClick={fazerLogin}
              >
                Entrar
              </Button>
            </div>
          </div>
        </div>
      )}

      {mostrarCadastro && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative">
            <button 
              onClick={() => setMostrarCadastro(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Criar Nova Conta
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input 
                  type="text" placeholder="Seu nome completo"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 outline-none"
                  value={nomeCadastro} onChange={(e) => setNomeCadastro(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                <input 
                  type="email" placeholder="seu@email.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 outline-none"
                  value={emailCadastro} onChange={(e) => setEmailCadastro(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                <input 
                  type="password" placeholder="••••••••"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 outline-none"
                  value={senhaCadastro} onChange={(e) => setSenhaCadastro(e.target.value)}
                />
              </div>
              <Button 
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 mt-6"
                onClick={fazerCadastro}
              >
                Confirmar Cadastro
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}