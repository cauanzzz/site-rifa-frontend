import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, CheckCircle, Clock, Ticket, Trophy, Frown, PlayCircle, Coins, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

const TicketRaspadinha = ({ cota, rifaId, rifaStatus, numeroSorteado, onRaspar }: { cota: any, rifaId: number, rifaStatus: string, numeroSorteado: number | null, onRaspar?: () => void }) => {
  const storageKey = `scratched_${rifaId}_${cota.numero}`;
  const [revelado, setRevelado] = useState(() => localStorage.getItem(storageKey) === 'true');
  const ganhou = numeroSorteado === cota.numero;

  const handleRaspar = () => {
    setRevelado(true);
    localStorage.setItem(storageKey, 'true');
    if (onRaspar) onRaspar();
  };

  if (rifaStatus !== 'Encerrada') {
    return (
      <div className={`flex flex-col items-center p-3 rounded-lg border min-w-[100px] ${cota.status === 'Vendido' ? 'bg-gray-50 border-gray-200' : 'bg-yellow-50 border-yellow-200'}`}>
        <span className={`font-bold text-xl ${cota.status === 'Vendido' ? 'text-gray-700' : 'text-yellow-700'}`}>
          {cota.numero.toString().padStart(4, '0')}
        </span>
        <span className={`text-[10px] mt-1 px-2 py-0.5 rounded-full font-semibold uppercase ${cota.status === 'Vendido' ? 'bg-green-100 text-green-700' : 'bg-yellow-200 text-yellow-800'}`}>
          {cota.status === 'Vendido' ? 'Aprovado' : 'Aguardando'}
        </span>
      </div>
    );
  }

  if (!revelado) {
    return (
      <div 
        onClick={handleRaspar}
        className="flex flex-col items-center justify-center p-3 rounded-lg border-2 border-dashed border-purple-300 bg-purple-50 min-w-[100px] cursor-pointer hover:bg-purple-100 transition-colors group"
      >
        <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
          <Coins className="w-4 h-4 text-purple-600" />
        </div>
        <span className="text-[10px] font-bold text-purple-700 uppercase">Raspar</span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center p-3 rounded-lg border min-w-[100px] animate-in zoom-in duration-300 ${ganhou ? 'bg-green-50 border-green-400 shadow-sm' : 'bg-slate-100 border-slate-200 opacity-75'}`}>
      <span className={`font-bold text-xl ${ganhou ? 'text-green-700' : 'text-slate-500'}`}>
        {cota.numero.toString().padStart(4, '0')}
      </span>
      <div className="flex items-center gap-1 mt-1">
        {ganhou ? <Trophy className="w-3 h-3 text-yellow-500" /> : <Frown className="w-3 h-3 text-slate-400" />}
        <span className={`text-[10px] font-bold uppercase ${ganhou ? 'text-green-600' : 'text-slate-500'}`}>
          {ganhou ? 'Ganhou!' : 'Perdeu'}
        </span>
      </div>
    </div>
  );
};

const RifaEncerradaCard = ({ rifa, minhasCotas }: { rifa: any, minhasCotas: any[] }) => {
  const [reveladas, setReveladas] = useState(() => {
    let count = 0;
    minhasCotas.forEach(c => {
      if (localStorage.getItem(`scratched_${rifa.id}_${c.numero}`) === 'true') {
        count++;
      }
    });
    return count;
  });

  const todasReveladas = reveladas >= minhasCotas.length;

  return (
    <Card className="border-l-4 border-l-slate-400 overflow-hidden relative">
      {todasReveladas && (
        <div className="absolute top-4 right-4 md:top-6 md:right-8 border-4 border-red-500/80 bg-white/95 backdrop-blur-sm text-red-500 px-4 py-2 rounded-xl -rotate-12 z-10 flex flex-col items-center shadow-2xl pointer-events-none animate-in zoom-in-[2.5] fade-in duration-300 ease-out">
          <span className="font-black text-xl tracking-widest">ENCERRADA</span>
          <span className="text-xs font-bold text-slate-700 mt-1">VENCEDOR: {rifa.numeroSorteado?.toString().padStart(4, '0')}</span>
        </div>
      )}

      <CardContent className="p-0 opacity-90">
        <div className="bg-slate-100 p-4 border-b">
          <Link to={`/rifa/${rifa.id}`} className="inline-flex items-center gap-2 group">
            <h3 className="font-bold text-lg text-slate-600 group-hover:text-purple-600 group-hover:underline transition-colors">{rifa.titulo}</h3>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-purple-600" />
          </Link>
          <p className="text-sm text-slate-500 mt-1">
            Finalizada. Ganhador definido!
          </p>
        </div>
        <div className="p-6">
          <p className="text-sm font-semibold text-gray-500 mb-3">Seus resultados:</p>
          <div className="flex flex-wrap gap-3">
            {minhasCotas.map((cota: any) => (
              <TicketRaspadinha 
                key={cota.numero} 
                cota={cota} 
                rifaId={rifa.id} 
                rifaStatus={rifa.status} 
                numeroSorteado={rifa.numeroSorteado} 
                onRaspar={() => setReveladas(prev => prev + 1)}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export function MyRaffles() {
  const navigate = useNavigate();
  const [abaAtiva, setAbaAtiva] = useState<'compradas' | 'criadas'>('compradas'); 
  const [rifas, setRifas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [usuarioLogado, setUsuarioLogado] = useState<any>(null);

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('usuario');
    if (usuarioSalvo) {
      setUsuarioLogado(JSON.parse(usuarioSalvo));
    } else {
      toast.error("Você precisa estar logado para acessar o painel!");
      navigate('/');
      return;
    }

    buscarDados();
  }, [navigate]);

  const buscarDados = async () => {
    try {
      const resposta = await fetch('http://localhost:5267/api/rifa');
      if (resposta.ok) {
        const dados = await resposta.json();
        setRifas(dados);
      }
    } catch (erro) {
      toast.error('Erro ao conectar com o banco de dados.');
    } finally {
      setLoading(false);
    }
  };

  const aprovarPagamento = async (rifaId: number, numero: number) => {
    try {
      const resposta = await fetch('http://localhost:5267/api/rifa/aprovar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ RifaId: rifaId, Numero: numero })
      });

      if (resposta.ok) {
        toast.success(`Pagamento do número ${numero} aprovado com sucesso! ✅`);
        buscarDados();
      } else {
        toast.error('Erro ao aprovar.');
      }
    } catch (erro) {
      toast.error('⚠️ Erro de conexão com o C#.');
    }
  };

  const rejeitarPagamento = async (rifaId: number, numero: number) => {
    if (!window.confirm("Tem certeza que deseja cancelar esta reserva? O número voltará a ficar disponível para todos.")) return;
    
    try {
      const resposta = await fetch('http://localhost:5267/api/rifa/rejeitar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ RifaId: rifaId, Numero: numero })
      });

      if (resposta.ok) {
        toast.success(`Reserva do número ${numero} recusada! ❌`);
        buscarDados();
      } else {
        toast.error('Erro ao cancelar a reserva.');
      }
    } catch (erro) {
      toast.error('⚠️ Erro de conexão com o C#.');
    }
  };

  const realizarSorteio = async (rifaId: number) => {
    if (!window.confirm("Atenção! Ao sortear, a rifa será encerrada e um ganhador será escolhido entre as cotas aprovadas. Deseja continuar?")) return;

    try {
      const resposta = await fetch(`http://localhost:5267/api/rifa/${rifaId}/sortear`, {
        method: 'POST'
      });

      if (resposta.ok) {
        const dados = await resposta.json();
        toast.success(`Sorteio realizado! O número ganhador foi ${dados.numeroSorteado}. 🎉`);
        buscarDados(); 
      } else {
        const erro = await resposta.text();
        toast.error(erro || 'Erro ao sortear rifa.');
      }
    } catch (erro) {
      toast.error('⚠️ Erro de conexão com o servidor.');
    }
  };

  const formatCurrency = (value: number) => value?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const minhasRifasCompradas = rifas.filter(r => 
    r.cotas && r.cotas.some((c: any) => c.compradorEmail === usuarioLogado?.email)
  );
  const rifasAtivas = minhasRifasCompradas.filter(r => r.status !== 'Encerrada');
  const rifasEncerradas = minhasRifasCompradas.filter(r => r.status === 'Encerrada');

  const minhasRifasCriadas = rifas.filter(r => r.criadorEmail === usuarioLogado?.email);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-3xl font-bold mb-6">Meu Painel</h1>

        <div className="flex gap-4 mb-8 border-b pb-4">
          <Button 
            variant={abaAtiva === 'compradas' ? 'default' : 'outline'}
            onClick={() => setAbaAtiva('compradas')}
            className={abaAtiva === 'compradas' ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white" : ""}
          >
            Rifas que Comprei
          </Button>
          <Button 
            variant={abaAtiva === 'criadas' ? 'default' : 'outline'}
            onClick={() => setAbaAtiva('criadas')}
            className={abaAtiva === 'criadas' ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white" : ""}
          >
            Minhas Criações
          </Button>
        </div>

        {loading ? (
          <p className="text-gray-600 text-center py-12">Buscando dados...</p>
        ) : (
          <>
            {abaAtiva === 'compradas' && (
              <div className="space-y-10">
                {minhasRifasCompradas.length === 0 ? (
                  <div className="bg-white p-8 rounded-xl border border-gray-100 text-center shadow-sm">
                    <Ticket className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">Você ainda não participou de nenhuma rifa.</p>
                  </div>
                ) : (
                  <>
                    {rifasAtivas.length > 0 && (
                      <div className="space-y-4">
                        <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800">
                          <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                          Em Andamento
                        </h2>
                        {rifasAtivas.map(rifa => {
                          const minhasCotas = rifa.cotas.filter((c: any) => c.compradorEmail === usuarioLogado?.email);
                          return (
                            <Card key={rifa.id} className="border-l-4 border-l-purple-500 overflow-hidden">
                              <CardContent className="p-0">
                                <div className="bg-slate-50 p-4 border-b flex justify-between items-center">
                                  <div>
                                    <Link to={`/rifa/${rifa.id}`} className="inline-flex items-center gap-2 group">
                                      <h3 className="font-bold text-lg text-slate-800 group-hover:text-purple-600 group-hover:underline transition-colors">{rifa.titulo}</h3>
                                      <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-purple-600" />
                                    </Link>
                                    <p className="text-sm text-slate-500 mt-1">
                                      Sorteio: {rifa.dataSorteio ? new Date(rifa.dataSorteio).toLocaleDateString('pt-BR') : 'Data em breve'}
                                    </p>
                                  </div>
                                  <Badge className="bg-green-100 text-green-700">{rifa.status}</Badge>
                                </div>
                                <div className="p-6">
                                  <p className="text-sm font-semibold text-gray-600 mb-3">Seus números:</p>
                                  <div className="flex flex-wrap gap-3">
                                    {minhasCotas.map((cota: any) => (
                                      <TicketRaspadinha 
                                        key={cota.numero} 
                                        cota={cota} 
                                        rifaId={rifa.id} 
                                        rifaStatus={rifa.status} 
                                        numeroSorteado={rifa.numeroSorteado} 
                                      />
                                    ))}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    )}

                    {rifasEncerradas.length > 0 && (
                      <div className="space-y-4 pt-6 border-t border-gray-200">
                        <h2 className="text-xl font-bold flex items-center gap-2 text-gray-600">
                          <Trophy className="w-5 h-5 text-gray-400" />
                          Histórico (Encerradas)
                        </h2>
                        {rifasEncerradas.map(rifa => {
                          const minhasCotas = rifa.cotas.filter((c: any) => c.compradorEmail === usuarioLogado?.email);
                          return <RifaEncerradaCard key={rifa.id} rifa={rifa} minhasCotas={minhasCotas} />;
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {abaAtiva === 'criadas' && (
              <div className="space-y-6">
                {minhasRifasCriadas.length === 0 ? (
                  <div className="bg-white p-8 rounded-xl border border-gray-100 text-center shadow-sm">
                    <Ticket className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">Você ainda não criou nenhuma rifa no seu nome.</p>
                  </div>
                ) : (
                  minhasRifasCriadas.map(rifa => {
                    const cotasReservadas = rifa.cotas ? rifa.cotas.filter((c: any) => c.status === 'Reservado') : [];
                    const aprovadas = rifa.cotas ? rifa.cotas.filter((c: any) => c.status === 'Vendido').length : 0;
                    const meta = rifa.quantidadeCotas;
                    const progresso = (aprovadas / meta) * 100;

                    return (
                      <Card key={rifa.id} className="border-l-4 border-l-blue-500">
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row justify-between md:items-start mb-6 pb-6 border-b border-gray-100 gap-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <Link to={`/rifa/${rifa.id}`} className="inline-flex items-center gap-2 group">
                                  <h3 className="font-bold text-xl group-hover:text-purple-600 group-hover:underline transition-colors">{rifa.titulo}</h3>
                                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-purple-600" />
                                </Link>
                                <Badge className={rifa.status === 'Encerrada' ? 'bg-slate-200 text-slate-700' : 'bg-green-100 text-green-700'}>{rifa.status}</Badge>
                              </div>
                              <p className="text-sm text-gray-500">Valor arrecadado: {formatCurrency(aprovadas * rifa.preço)}</p>
                              
                              <div className="mt-4 max-w-xs">
                                <div className="flex justify-between text-xs text-gray-500 mb-1 font-semibold">
                                  <span>Vendidos: {aprovadas}</span>
                                  <span>Total: {meta}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progresso}%` }}></div>
                                </div>
                              </div>
                            </div>

                            {rifa.status !== 'Encerrada' ? (
                              <Button 
                                onClick={() => realizarSorteio(rifa.id)}
                                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md w-full md:w-auto"
                              >
                                <PlayCircle className="w-4 h-4 mr-2" /> Sortear Agora
                              </Button>
                            ) : (
                              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center min-w-[200px]">
                                <Trophy className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
                                <p className="text-xs text-green-600 font-bold uppercase">Ganhador</p>
                                <p className="text-xl font-black text-green-800">{rifa.numeroSorteado?.toString().padStart(4, '0')}</p>
                              </div>
                            )}
                          </div>

                          {cotasReservadas.length > 0 && rifa.status !== 'Encerrada' && (
                            <div>
                              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <span className="bg-red-500 text-white w-5 h-5 flex items-center justify-center rounded-full text-xs">{cotasReservadas.length}</span>
                                Pagamentos aguardando aprovação
                              </h4>
                              <div className="space-y-3">
                                {cotasReservadas.map((cota: any) => (
                                  <div key={cota.numero} className="flex flex-col md:flex-row md:items-center justify-between bg-yellow-50/50 p-3 rounded-lg border border-yellow-100">
                                    <div className="flex items-center gap-3 mb-3 md:mb-0">
                                      <div className="bg-white border border-yellow-200 text-yellow-700 font-bold px-3 py-1.5 rounded-md text-center min-w-[50px]">
                                        {cota.numero.toString().padStart(4, '0')}
                                      </div>
                                      <div className="text-sm">
                                        <p className="text-gray-800 font-medium">{cota.nomePagador || 'Não informado'}</p>
                                        <p className="text-gray-500 text-xs">{cota.compradorEmail} • PIX: {cota.formaPagamento}</p>
                                      </div>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button onClick={() => rejeitarPagamento(rifa.id, cota.numero)} variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50 flex-1">
                                        Recusar
                                      </Button>
                                      <Button onClick={() => aprovarPagamento(rifa.id, cota.numero)} size="sm" className="bg-green-600 hover:bg-green-700 text-white flex-1">
                                        <CheckCircle className="w-3 h-3 mr-1" /> Aprovar
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}