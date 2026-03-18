import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, CheckCircle, Clock, Ticket } from 'lucide-react';
import { toast } from 'sonner';

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

    const buscarDados = async () => {
      try {
        const resposta = await fetch('https://localhost:7002/api/rifa');
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
    buscarDados();
  }, [navigate]);

  // === BOTÃO VERDE: APROVAR ===
  const aprovarPagamento = async (rifaId: number, numero: number) => {
    try {
      const resposta = await fetch('https://localhost:7002/api/rifa/aprovar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ RifaId: rifaId, Numero: numero })
      });

      if (resposta.ok) {
        toast.success(`Pagamento do número ${numero} aprovado com sucesso! ✅`);
        setTimeout(() => window.location.reload(), 1500);
      } else {
        toast.error('Erro ao aprovar.');
      }
    } catch (erro) {
      toast.error('⚠️ Erro de conexão com o C#.');
    }
  };

  // === BOTÃO VERMELHO: RECUSAR ===
  const rejeitarPagamento = async (rifaId: number, numero: number) => {
    if (!window.confirm("Tem certeza que deseja cancelar esta reserva? O número voltará a ficar disponível para todos.")) return;
    
    try {
      const resposta = await fetch('https://localhost:7002/api/rifa/rejeitar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ RifaId: rifaId, Numero: numero })
      });

      if (resposta.ok) {
        toast.success(`Reserva do número ${numero} recusada! ❌`);
        setTimeout(() => window.location.reload(), 1500);
      } else {
        toast.error('Erro ao cancelar a reserva.');
      }
    } catch (erro) {
      toast.error('⚠️ Erro de conexão com o C#.');
    }
  };

  const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const minhasRifasCompradas = rifas.filter(r => 
    r.cotas && r.cotas.some((c: any) => c.compradorEmail === usuarioLogado?.email)
  );

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
        <h1 className="text-3xl font-bold mb-6">Painel de Controle</h1>

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
            Rifas que Criei (Admin)
          </Button>
        </div>

        {loading ? (
          <p className="text-gray-600">Buscando dados no banco...</p>
        ) : (
          <>
            {/* === ABA 1: COMPRAS === */}
            {abaAtiva === 'compradas' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Minhas Compras e Reservas</h2>
                
                {minhasRifasCompradas.length === 0 ? (
                  <div className="bg-white p-8 rounded-xl border border-gray-100 text-center shadow-sm">
                    <Ticket className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">Você ainda não comprou nenhuma cota nova.</p>
                  </div>
                ) : (
                  minhasRifasCompradas.map(rifa => {
                    const minhasCotas = rifa.cotas.filter((c: any) => c.compradorEmail === usuarioLogado?.email);
                    
                    return (
                      <Card key={rifa.id} className="border-l-4 border-l-purple-500">
                        <CardContent className="p-6">
                          <h3 className="font-bold text-lg mb-4 pb-4 border-b">{rifa.titulo}</h3>
                          <div className="flex flex-wrap gap-3">
                            {minhasCotas.map((cota: any) => (
                              <div key={cota.numero} className={`flex flex-col items-center p-3 rounded-lg border min-w-[100px] ${cota.status === 'Vendido' ? 'bg-gray-50 border-gray-200' : 'bg-yellow-50 border-yellow-200'}`}>
                                <span className={`font-bold text-xl ${cota.status === 'Vendido' ? 'text-gray-700' : 'text-yellow-700'}`}>{cota.numero.toString().padStart(4, '0')}</span>
                                <span className={`text-[10px] mt-1 px-2 py-0.5 rounded-full font-semibold uppercase ${cota.status === 'Vendido' ? 'bg-green-100 text-green-700' : 'bg-yellow-200 text-yellow-800'}`}>
                                  {cota.status === 'Vendido' ? 'Aprovado' : 'Aguardando'}
                                </span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            )}

            {/* === ABA 2: CRIADAS (ADMIN) === */}
            {abaAtiva === 'criadas' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Aprovação de Pagamentos</h2>
                  <Badge className="bg-yellow-500">Minhas Rifas</Badge>
                </div>

                {minhasRifasCriadas.length === 0 ? (
                  <div className="bg-white p-8 rounded-xl border border-gray-100 text-center shadow-sm">
                    <Ticket className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">Você ainda não criou nenhuma rifa no seu nome.</p>
                  </div>
                ) : (
                  minhasRifasCriadas.map(rifa => {
                    const cotasReservadas = rifa.cotas ? rifa.cotas.filter((c: any) => c.status === 'Reservado') : [];
                    if (cotasReservadas.length === 0) return null;

                    return (
                      <Card key={rifa.id} className="border-l-4 border-l-yellow-400">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-center mb-4 pb-4 border-b">
                            <div>
                              <h3 className="font-bold text-lg">{rifa.titulo}</h3>
                              <p className="text-sm text-gray-500">Preço da cota: {formatCurrency(rifa.preço)}</p>
                            </div>
                          </div>

                          <div className="space-y-4">
                            {cotasReservadas.map((cota: any) => (
                              <div key={cota.numero} className="flex flex-col md:flex-row md:items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-100">
                                <div className="flex items-center gap-4 mb-4 md:mb-0">
                                  <div className="bg-yellow-100 text-yellow-700 font-bold px-4 py-2 rounded-lg text-center min-w-[60px]">
                                    {cota.numero.toString().padStart(4, '0')}
                                  </div>
                                  <div>
                                    {/* Mostra o nome que a pessoa digitou + o email da conta dela */}
                                    <span className="text-gray-600">
                                      Conta: {cota.compradorEmail} <br/>
                                      <strong>Pagador: {cota.nomePagador || cota.NomePagador || 'Não informado'}</strong>
                                    </span>
                                    <span className="text-gray-500 text-sm flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                      {cota.dataReserva || cota.DataReserva 
                                      ? new Date(cota.dataReserva || cota.DataReserva).toLocaleString('pt-BR') 
                                      : 'Data não registrada'}
                                    </span>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                      <Clock className="w-3 h-3" />
                                      <span className="text-gray-500">
                                        Pagamento via: <strong>{cota.formaPagamento || cota.FormaPagamento || 'Não informado'}</strong>
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* === OS DOIS BOTÕES AQUI === */}
                                <div className="flex gap-2 w-full md:w-auto">
                                  <Button 
                                    onClick={() => rejeitarPagamento(rifa.id, cota.numero)} 
                                    variant="outline" 
                                    className="cursor-pointer text-red-600 border-red-200 hover:bg-red-50 flex-1 md:flex-none"
                                  >
                                    Recusar
                                  </Button>
                                  <Button 
                                    onClick={() => aprovarPagamento(rifa.id, cota.numero)} 
                                    className="cursor-pointer bg-green-600 hover:bg-green-700 text-white gap-2 flex-1 md:flex-none"
                                  >
                                    <CheckCircle className="w-4 h-4" /> Aprovar
                                  </Button>
                                </div>

                              </div>
                            ))}
                          </div>
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