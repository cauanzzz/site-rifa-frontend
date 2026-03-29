import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Button } from '../components/ui/button';
import { ArrowLeft, QrCode, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

const PACOTES = {
  'Iniciante': { moedas: 150, valor: 20.25 },
  'Popular': { moedas: 350, valor: 36.54 },
  'Profissional': { moedas: 500, valor: 47.50 }
};

export function Pagamento() {
  const { pacote } = useParams(); 
  const navigate = useNavigate();
  const [usuarioLogado, setUsuarioLogado] = useState<any>(null);
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [nomePix, setNomePix] = useState('');

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
    
    if (nomePix.trim() === '') {
      toast.error('Por favor, informe o nome de quem fez o PIX.');
      return;
    }
    
    setEnviando(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/solicitar-moedas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuarioId: usuarioLogado.id || usuarioLogado.Id,
          pacote: pacote,
          quantidadeMoedas: infoPacote.moedas,
          valorPago: infoPacote.valor,
          nomeTitularPix: nomePix
        })
      });

      if (response.ok) {
        setSucesso(true);
      } else {
        const errorData = await response.json().catch(() => null);
        toast.error(errorData?.erro || 'Erro ao enviar solicitação.');
      }
    } catch (error) {
      toast.error('Erro de conexão com o servidor!');
    } finally {
      setEnviando(false);
    }
  };

  if (!infoPacote) return null; 

  if (sucesso) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-slate-100">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Tudo certo!</h2>
          <p className="text-gray-600 mb-8">
            Sua solicitação foi enviada com sucesso. Um administrador está confirmando o seu PIX e logo as moedas cairão na sua conta!
          </p>
          <Button 
            onClick={() => navigate('/')} 
            className="w-full py-6 text-lg bg-purple-600 hover:bg-purple-700 text-white"
          >
            Voltar para o Início
          </Button>
        </div>
      </div>
    );
  }

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

            <div className="mb-4 text-left">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Titular do PIX</label>
              <input 
                type="text" 
                placeholder="Ex: João da Silva"
                value={nomePix}
                onChange={(e) => setNomePix(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 outline-none"
              />
            </div>

            <div className="space-y-4">
              <Button 
                onClick={confirmarPagamento} 
                disabled={enviando}
                className="w-full py-6 text-lg bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200"
              >
                {enviando ? 'Processando...' : 'Já fiz o Pagamento!'}
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