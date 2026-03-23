import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Button } from '../components/ui/button';
import { ArrowLeft, QrCode, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

const PACOTES = {
  'Iniciante': { moedas: 50, valor: 45.00 },
  'Popular': { moedas: 110, valor: 80.00 },
  'Profissional': { moedas: 550, valor: 350.00 }
};

export function Pagamento() {
  const { pacote } = useParams(); 
  const navigate = useNavigate();
  const [usuarioLogado, setUsuarioLogado] = useState<any>(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('usuario');
    if (usuarioSalvo) {
      setUsuarioLogado(JSON.parse(usuarioSalvo));
    } else {
      toast.error('Você precisa estar logado!');
      navigate('/');
    }

    if (!pacote || !PACOTES[pacote as keyof typeof PACOTES]) {
      toast.error('Pacote inválido.');
      navigate('/comprar-moedas'); 
    }
  }, [navigate, pacote]);

  const infoPacote = PACOTES[pacote as keyof typeof PACOTES];

  const confirmarPagamento = async () => {
    if (!infoPacote || !usuarioLogado) return;
    
    setEnviando(true);

    try {
      const response = await fetch('http://localhost:5174/api/admin/solicitar-moedas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          UsuarioId: usuarioLogado.id || usuarioLogado.Id,
          Pacote: pacote,
          QuantidadeMoedas: infoPacote.moedas,
          ValorPago: infoPacote.valor
        })
      });

      if (response.ok) {
        toast.success('Solicitação enviada! Redirecionando...');
        setTimeout(() => navigate('/'), 2000); 
      } else {
        toast.error('Erro ao enviar solicitação.');
      }
    } catch (error) {
      toast.error('Erro de conexão com o servidor!');
    } finally {
      setEnviando(false);
    }
  };

  if (!infoPacote) return null; 

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 flex items-center justify-center">
      <div className="max-w-md w-full">
        
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 gap-2">
          <ArrowLeft className="w-4 h-4" /> Voltar para os pacotes
        </Button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-center text-white">
            <h1 className="text-2xl font-bold">Finalizar Compra</h1>
            <p className="opacity-90 mt-1">Pacote {pacote}</p>
          </div>

          <div className="p-8">
            <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Total a pagar</span>
              <span className="text-3xl font-bold text-green-600">R$ {infoPacote.valor.toFixed(2)}</span>
            </div>

            <div className="text-center mb-8">
              <QrCode className="w-48 h-48 mx-auto text-slate-800 mb-4 border-4 border-slate-100 p-2 rounded-xl" />
              <p className="text-sm text-slate-500 mb-2">Escaneie o QR Code ou use a chave PIX abaixo:</p>
              <div className="bg-slate-100 p-3 rounded-lg flex items-center justify-center">
                <span className="font-mono font-bold text-slate-700 select-all tracking-wider">
                  pagamentos@suarifa.com
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <Button 
                onClick={confirmarPagamento} 
                disabled={enviando}
                className="w-full py-6 text-lg bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200"
              >
                {enviando ? 'Processando...' : 'Já fiz o Pagamento'}
              </Button>
              <p className="text-xs text-center text-slate-400 flex items-center justify-center gap-1">
                <ShieldCheck className="w-4 h-4" /> Pagamento 100% seguro
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}