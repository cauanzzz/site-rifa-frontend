import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [abaAtiva, setAbaAtiva] = useState<'moedas' | 'suporte'>('moedas');
  const [pedidos, setPedidos] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:5174/api/admin/pedidos-moedas')
      .then(res => res.json())
      .then(data => setPedidos(data))
      .catch(err => console.error(err));
  }, []);

  const handleAprovar = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:5174/api/admin/aprovar-pedido/${id}`, { method: 'POST' });
      if (res.ok) {
        setPedidos(pedidos.filter(p => p.id !== id));
        alert('Moedas liberadas com sucesso!');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRecusar = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja recusar este comprovante?')) return;
    try {
      const res = await fetch(`http://localhost:5174/api/admin/recusar-pedido/${id}`, { method: 'POST' });
      if (res.ok) {
        setPedidos(pedidos.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 mt-8">
      <div className="flex items-center gap-3 mb-8">
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
          className={`pb-3 font-semibold text-lg transition-colors ${
            abaAtiva === 'suporte'
              ? 'text-purple-600 border-b-2 border-purple-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          📩 Tickets de Suporte
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
                    <th className="p-4 text-sm font-semibold text-slate-600">Data</th>
                    <th className="p-4 text-sm font-semibold text-slate-600 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500 bg-slate-50 rounded-b-lg">
                        Nenhuma solicitação de compra de moedas pendente.
                      </td>
                    </tr>
                  ) : (
                    pedidos.map((pedido) => (
                      <tr key={pedido.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="p-4 text-sm text-gray-800 font-medium">{pedido.usuarioEmail}</td>
                        <td className="p-4 text-sm text-gray-600">
                          <span className="font-bold text-purple-600">{pedido.pacote}</span>
                          <br />
                          <span className="text-xs text-gray-400">+{pedido.quantidadeMoedas} moedas</span>
                        </td>
                        <td className="p-4 text-sm font-medium text-green-600">
                          R$ {pedido.valorPago.toFixed(2)}
                        </td>
                        <td className="p-4 text-sm text-gray-500">
                          {new Date(pedido.dataSolicitacao).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="p-4 text-right gap-2 flex justify-end">
                          <button 
                            onClick={() => handleAprovar(pedido.id)}
                            className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-sm font-bold transition-colors"
                          >
                            Aprovar
                          </button>
                          <button 
                            onClick={() => handleRecusar(pedido.id)}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm font-bold transition-colors"
                          >
                            Recusar
                          </button>
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
            <h2 className="text-xl font-bold text-gray-800">Caixa de Entrada - Suporte</h2>
            
            <div className="flex flex-col gap-3">
              <div className="p-12 text-center text-slate-500 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
                Nenhum ticket de suporte em aberto no momento.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}