import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [abaAtiva, setAbaAtiva] = useState<'moedas' | 'suporte'>('moedas');
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [mensagensSuporte, setMensagensSuporte] = useState<any[]>([]);

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('usuario');
    if (usuarioSalvo) {
      const user = JSON.parse(usuarioSalvo);
      if (!user.isAdmin && user.role !== 'admin') {
        toast.error('Acesso negado!');
        navigate('/');
        return;
      }
    } else {
      navigate('/');
      return;
    }

    fetch('http://localhost:5267/api/admin/pedidos-moedas')
      .then(res => res.json())
      .then(data => setPedidos(data))
      .catch(err => console.error(err));

    fetch('http://localhost:5267/api/suporte')
      .then(res => res.json())
      .then(data => setMensagensSuporte(data))
      .catch(err => console.error(err));
  }, [navigate]);

  const handleAprovar = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:5267/api/admin/aprovar-pedido/${id}`, { method: 'POST' });
      if (res.ok) {
        setPedidos(pedidos.filter(p => p.id !== id));
        toast.success('Moedas liberadas com sucesso!');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRecusar = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja recusar este comprovante?')) return;
    try {
      const res = await fetch(`http://localhost:5267/api/admin/recusar-pedido/${id}`, { method: 'POST' });
      if (res.ok) {
        setPedidos(pedidos.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleResolverSuporte = async (id: number) => {
    if (!window.confirm('Marcar esta mensagem como resolvida?')) return;
    try {
      const res = await fetch(`http://localhost:5267/api/suporte/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMensagensSuporte(mensagensSuporte.filter(m => m.id !== id));
        toast.success('Mensagem resolvida!');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 mt-8">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => navigate('/')} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Painel Administrativo</h1>
        <span className="bg-yellow-100 text-yellow-800 text-sm font-bold px-3 py-1 rounded-full">
          👑 Admin
        </span>
      </div>

      <div className="flex gap-6 border-b border-gray-200 mb-6">
        <button
          onClick={() => setAbaAtiva('moedas')}
          className={`pb-3 font-semibold text-lg transition-colors ${
            abaAtiva === 'moedas'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          💰 Aprovações de Moedas
        </button>
        <button
          onClick={() => setAbaAtiva('suporte')}
          className={`pb-3 font-semibold text-lg transition-colors relative ${
            abaAtiva === 'suporte'
              ? 'text-purple-600 border-b-2 border-purple-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          📩 Tickets de Suporte
          {mensagensSuporte.length > 0 && (
            <span className="absolute -top-1 -right-4 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {mensagensSuporte.length}
            </span>
          )}
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[400px]">
        {abaAtiva === 'moedas' && (
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-gray-800">Solicitações de PIX Pendentes</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="p-4 text-sm font-semibold text-slate-600">Usuário</th>
                    <th className="p-4 text-sm font-semibold text-slate-600">Pacote / Moedas</th>
                    <th className="p-4 text-sm font-semibold text-slate-600">Valor Pago</th>
                    <th className="p-4 text-sm font-semibold text-slate-600 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-slate-500">Nenhuma solicitação pendente.</td>
                    </tr>
                  ) : (
                    pedidos.map((pedido) => (
                      <tr key={pedido.id} className="border-b hover:bg-slate-50">
                        <td className="p-4 text-sm font-medium text-gray-800">
                          {pedido.usuarioNome || pedido.usuarioEmail}
                          <br />
                          <span className="text-xs text-purple-600 font-bold">PIX: {pedido.nomeTitularPix || 'Não informado'}</span>
                        </td>
                        <td className="p-4 text-sm">
                          <span className="font-bold text-purple-600">{pedido.pacote}</span>
                          <br />
                          <span className="text-xs text-gray-400">+{pedido.quantidadeMoedas} moedas</span>
                        </td>
                        <td className="p-4 text-sm font-medium text-green-600">R$ {pedido.valorPago.toFixed(2)}</td>
                        <td className="p-4 text-right flex justify-end gap-2">
                          <button onClick={() => handleAprovar(pedido.id)} className="px-3 py-1 bg-green-100 text-green-700 rounded font-bold text-sm">Aprovar</button>
                          <button onClick={() => handleRecusar(pedido.id)} className="px-3 py-1 bg-red-100 text-red-700 rounded font-bold text-sm">Recusar</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {abaAtiva === 'suporte' && (
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-gray-800">Mensagens de Suporte</h2>
            <div className="flex flex-col gap-4">
              {mensagensSuporte.length === 0 ? (
                <div className="p-12 text-center text-slate-500 border-2 border-dashed rounded-lg bg-slate-50">Nenhuma mensagem pendente!</div>
              ) : (
                mensagensSuporte.map((msg) => (
                  <div key={msg.id} className="border rounded-lg p-5 bg-slate-50 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="font-bold text-gray-800">{msg.email}</span>
                        <p className="text-xs text-gray-500">{new Date(msg.dataEnvio).toLocaleString('pt-BR')}</p>
                      </div>
                      <button onClick={() => handleResolverSuporte(msg.id)} className="px-4 py-2 bg-purple-100 text-purple-700 rounded-md text-sm font-bold">Marcar como Resolvido</button>
                    </div>
                    <div className="bg-white p-4 rounded border text-gray-700 whitespace-pre-wrap">{msg.mensagem}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}