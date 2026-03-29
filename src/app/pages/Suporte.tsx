import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { ArrowLeft, Mail, MessageSquare, Phone, Send } from 'lucide-react';
import { toast } from 'sonner';

export function Suporte() {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [enviando, setEnviando] = useState(false);

  const enviarMensagem = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome || !email || !mensagem) {
      toast.error('Preencha todos os campos antes de enviar!');
      return;
    }

    setEnviando(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/MensagensSuporte`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          nome: nome, 
          email: email, 
          mensagem: mensagem 
        }), 
      });

      if (response.ok) {
        toast.success('Mensagem enviada com sucesso! Nossa equipe responderá em breve. 🚀');
        setNome('');
        setEmail('');
        setMensagem('');
      } else {
        toast.error('Ops! Ocorreu um erro ao enviar sua mensagem. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao conectar com a API:', error);
      toast.error('Erro de conexão. Verifique se o servidor está rodando.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* HEADER DE NAVEGAÇÃO */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate('/')} className="gap-2 cursor-pointer">
            <ArrowLeft className="w-4 h-4" /> Voltar para o início
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Como podemos ajudar?
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Teve algum problema com uma rifa, dúvidas sobre pagamentos ou quer fazer uma sugestão? Fale com a nossa equipe.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* LADO ESQUERDO: CONTATOS DIRETOS */}
          <div className="space-y-6 md:col-span-1 animate-in fade-in slide-in-from-left-8">
            <Card className="border-purple-100 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="bg-purple-100 p-3 rounded-full text-purple-600 shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">E-mail</h3>
                  <p className="text-sm  text-gray-500 mb-2">Respondemos em até 24h</p>
                  <a href="mailto:suporte@rifex.com" className="text-purple-600 font-medium hover:underline text-sm">
                    suporte@rifex.com
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* LADO DIREITO: FORMULÁRIO */}
          <Card className="md:col-span-2 shadow-lg border-gray-100 animate-in fade-in slide-in-from-right-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-600" />
                Envie uma mensagem
              </CardTitle>
              <CardDescription>Preencha os dados abaixo e detalhe o seu problema.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={enviarMensagem} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Seu nome</Label>
                    <Input 
                      id="nome" 
                      placeholder="Ex: João Silva" 
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail cadastrado</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="seu@email.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mensagem">Mensagem</Label>
                  <Textarea 
                    id="mensagem" 
                    placeholder="Descreva com detalhes como podemos te ajudar..." 
                    rows={5}
                    value={mensagem}
                    onChange={(e) => setMensagem(e.target.value)}
                    required 
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={enviando}
                  className={`w-full gap-2 text-white font-bold text-lg ${
                    enviando ? 'bg-gray-400' : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                  }`}
                >
                  {enviando ? 'Enviando...' : (
                    <>
                      <Send className="w-5 h-5" /> Enviar mensagem
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}