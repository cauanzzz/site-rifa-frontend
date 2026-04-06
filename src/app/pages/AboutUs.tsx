import { useState } from 'react';
import { Header } from '../components/header.tsx';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ShieldCheck, Lock, Server, Dices, CheckCircle, RefreshCw, Ticket } from 'lucide-react';

export function AboutUs() {
 
  const [sorteando, setSorteando] = useState(false);
  const [numeroDisplay, setNumeroDisplay] = useState<number | string>('00');
  const [resultadoFinal, setResultadoFinal] = useState<number | null>(null);
  const iniciarSorteioTeste = () => {
    if (sorteando) return;
    setSorteando(true);
    setResultadoFinal(null);
    let tempoRulagem = 0;
    const intervalo = setInterval(() => {
      setNumeroDisplay(Math.floor(Math.random() * 100) + 1);
      tempoRulagem += 50;

      if (tempoRulagem >= 2000) {
        clearInterval(intervalo);

        const arraySorteio = new Uint32Array(1);
        window.crypto.getRandomValues(arraySorteio);
        const numeroVencedor = (arraySorteio[0] % 100) + 1; 
        setNumeroDisplay(numeroVencedor);
        setResultadoFinal(numeroVencedor);
        setSorteando(false);
      }
    }, 50);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">

      <Header />

      {/* === INFORMAÇÕES SOBRE NÓS === */}
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-gradient-to-br from-purple-100 to-blue-100 p-3 rounded-full inline-block mb-4 border border-purple-200">
             <Ticket className="w-8 h-8 text-purple-600" />
          </div>
         <h1 className="text-4xl md:text-5xl font-bold mb-6 pb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            A nova era das rifas digitais
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            O RifaCoins nasceu para transformar o mercado de sorteios. Unimos a emoção das rifas tradicionais com a segurança e a transparência da tecnologia moderna, criando um ecossistema confiável para criadores e participantes.
          </p>
        </div>

        {/* === SEGURANÇA E CONFIABILIDADE === */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-3">
              <ShieldCheck className="w-9 h-9 text-green-500" />
              Segurança sem compromissos
            </h2>
            <p className="text-gray-600 mt-2 text-lg">Nossa prioridade é garantir que cada sorteio seja 100% justo e transparente.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-none shadow-md bg-white/60 backdrop-blur-sm hover:shadow-xl transition-shadow">
              <CardContent className="pt-8">
                <div className="bg-purple-100 w-14 h-14 rounded-full flex items-center justify-center mb-5 border border-purple-200">
                  <Lock className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-gray-900">Dados protegidos</h3>
                <p className="text-gray-600 leading-relaxed">
                  Utilizamos criptografia de ponta e vinculação direta de e-mail/CPF para garantir que cada cota reservada seja única e segura no nosso banco de dados relacional.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md bg-white/60 backdrop-blur-sm hover:shadow-xl transition-shadow">
              <CardContent className="pt-8">
                 <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mb-5 border border-blue-200">
                    <Server className="w-7 h-7 text-blue-600" />
                 </div>
                <h3 className="font-bold text-xl mb-3 text-gray-900">Lógica no servidor</h3>
                <p className="text-gray-600 leading-relaxed">
                  Toda a inteligência do sorteio e validação de pagamentos ocorre no nosso backend seguro (C#), impedindo manipulações externas diretamente no navegador.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md bg-white/60 backdrop-blur-sm hover:shadow-xl transition-shadow">
              <CardContent className="pt-8">
                <div className="bg-green-100 w-14 h-14 rounded-full flex items-center justify-center mb-5 border border-green-200">
                   <CheckCircle className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-gray-900">Transparência total</h3>
                <p className="text-gray-600 leading-relaxed">
                  Os status de cada número são atualizados em tempo real. Nossa auditoria aberta permite que qualquer participante verifique a integridade da rifa a qualquer momento.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* === SIMULADOR === */}
        <div className="bg-white rounded-3xl p-10 md:p-14 shadow-xl border border-gray-100 text-center relative overflow-hidden animate-in fade-in slide-in-from-bottom-6">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-blue-50 opacity-70" />
          <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48ZyBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM2YjRiZTYiIGZpbGwtb3BhY2l0eT0iMSI+PHBhdGggZD0iTTAgMGg0MHY0MEgwVjB6bTIwIDIwaDIwdjIwSDIWMjB6TTAgMjBoMjB2MjBIMFYyMHoyMCAwaDIwdjIwSDIwVjB6Ii8+PC9nPjwvZz48L3N2Zz4=')]" />
          <div className="relative z-10">
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-3 rounded-2xl inline-block mb-5 border border-purple-200">
                <Dices className="w-9 h-9 text-purple-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-950">Transparência na prática</h2>
            <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              No RifaCoins, a sorte é sagrada. Utilizamos a <strong>Web Crypto API</strong>, uma tecnologia de criptografia nativa do navegador que gera números baseados em entropia de hardware. Isso garante um resultado <strong>100% aleatório, imparcial e auditável</strong>. Faça o teste você mesmo:
            </p>

            <div className="relative w-56 h-56 mx-auto mb-10 group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full opacity-30 blur-md group-hover:opacity-50 transition-opacity duration-500"></div>
                <div className="relative bg-white/80 backdrop-blur-lg border-2 border-purple-100 rounded-full w-full h-full flex items-center justify-center shadow-inner overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDgwIDgwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIHN0cm9rZT0iIzZkMmI5MSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIwLjUiPjxwYXRoIGQ9Ik0wIDBoODB2ODBIMFYweiIvPjxwYXRoIGQ9Ik0wIDIwaDgwTTAgNDBoODBNMCA2MGg4ME0yMCAwaDIwdjgwTTQwIDBoMjB2ODBNNjAgMGgyMHY4MCIvPjwvZz48L2c+PC9zdmc+')]"></div>
                    <div className={`text-8xl font-mono font-extrabold ${sorteando ? 'text-gray-400 blur-[2px]' : 'bg-gradient-to-b from-purple-600 to-blue-600 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(109,43,145,0.3)]'} transition-all duration-75 relative z-10`}>
                        {numeroDisplay.toString().padStart(2, '0')}
                    </div>
                </div>
            </div>
            <Button 
              onClick={iniciarSorteioTeste} 
              disabled={sorteando}
              className={`text-xl px-10 py-7 rounded-2xl font-bold transition-all shadow-lg hover:scale-105
                ${sorteando 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-300' 
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'}`}
            >
              {sorteando ? (
                <>
                  <RefreshCw className="w-6 h-6 mr-3 animate-spin" /> Sorteando...
                </>
              ) : (
                <>
                    <Dices className="w-6 h-6 mr-3" /> Gerar número aleatório
                </>
              )}
            </Button>
            {resultadoFinal !== null && !sorteando && (
              <div className="mt-8 bg-green-50 text-green-700 border border-green-200 font-medium animate-in fade-in slide-in-from-bottom-2 px-6 py-3 rounded-full inline-flex items-center gap-2">
                <CheckCircle className="w-5 h-5" /> Sorteio realizado com sucesso! Número: <strong>{resultadoFinal}</strong>.
              </div>
            )}  
          </div>
        </div>
      </div>
    </div>
  );
}