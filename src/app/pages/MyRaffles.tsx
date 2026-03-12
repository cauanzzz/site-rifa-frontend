import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, CheckCircle, Clock, Ticket } from 'lucide-react';
import { toast } from 'sonner';

export function MyRaffles() {
  const navigate = useNavigate();
  const [abaAtiva, setAbaAtiva] = useState<'compradas' | 'criadas'>('criadas'); 
  
  const [rifas, setRifas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const buscarDados = async () => {
      try {
        const resposta = await fetch('https://localhost:7002/api/rifa');
        if (resposta.ok) {
          const dados = await resposta.json();
          setRifas(dados);
        }
      } catch (erro) {
        console.error(erro);
        toast.error('Erro ao conectar com o banco de dados.');
      } finally {
        setLoading(false);
      }
    };
    buscarDados();
  }, []);

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
        toast.error('Erro ao aprovar o pagamento no servidor.');
      }
    } catch (erro) {
      console.error(erro);
      toast.error('⚠️ Erro de conexão com o C#.');
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

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
            {abaAtiva === 'compradas' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Minhas Reservas</h2>
                <div className="bg-white p-8 rounded-xl border border-gray-100 text-center shadow-sm">
                  <Ticket className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Em breve conectaremos o login para mostrar suas compras aqui.</p>
                </div>
              </div>
            )}

            {abaAtiva === 'criadas' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Aprovação de Pagamentos</h2>
                  <Badge className="bg-yellow-500">Aguardando Aprovação</Badge>
                </div>

                {rifas.map(rifa => {
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
                            <div key={cota.numero} className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-100">
                              <div className="flex items-center gap-4 mb-3 sm:mb-0">
                                <div className="bg-yellow-100 text-yellow-700 font-bold px-4 py-2 rounded-lg text-center min-w-[60px]">
                                  {cota.numero.toString().padStart(4, '0')}
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900">{cota.nome}</p>
                                  <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Clock className="w-3 h-3" />
                                    <span>Pagamento via: <strong>{cota.tel}</strong></span>
                                  </div>
                                </div>
                              </div>
                              
                              <Button 
                                onClick={() => aprovarPagamento(rifa.id, cota.numero)}
                                className="bg-green-600 hover:bg-green-700 text-white gap-2"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Aprovar Pagamento
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}

                {/* Mensagem caso não tenha ninguém aguardando aprovação */}
                {!rifas.some(r => r.cotas && r.cotas.some((c: any) => c.status === 'Reservado')) && (
                  <div className="bg-white p-8 rounded-xl border border-gray-100 text-center shadow-sm">
                    <CheckCircle className="w-12 h-12 text-green-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">Tudo em dia!</p>
                    <p className="text-gray-400 text-sm">Nenhuma cota aguardando aprovação no momento.</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}