import { ChevronDown, Coins, Info, LifeBuoy, Ticket } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export function Header() {
    const [logado, setLogado] = useState(false);
    const [usuarioNome, setUsuarioNome] = useState(''); 
    const [moedas, setMoedas] = useState(0); 
    const [isAdmin, setIsAdmin] = useState(false);
    
    const [menuAberto, setMenuAberto] = useState(false);
    const [mostrarLogin, setMostrarLogin] = useState(false);
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [_activeRaffles, setActiveRaffles] = useState<any[]>([]);
    
    const [mostrarCadastro, setMostrarCadastro] = useState(false);
    const [nomeCadastro, setNomeCadastro] = useState('');
    const [emailCadastro, setEmailCadastro] = useState('');
    const [senhaCadastro, setSenhaCadastro] = useState('');
    
    useEffect(() => {
        const usuarioSalvo = localStorage.getItem('usuario');
        if (usuarioSalvo) {
            const dados = JSON.parse(usuarioSalvo);
            setLogado(true);
            setUsuarioNome(dados.nome);
            setMoedas(dados.moedas || 0); 
            setIsAdmin(dados.isAdmin || dados.IsAdmin || false);
        }

        const buscarRifas = async () => {
            try {
                const resposta = await fetch('https://localhost:7002/api/rifa');
                if (resposta.ok) {
                    const dados = await resposta.json();
                    setActiveRaffles(dados); 
                }
            } catch (erro) {
                console.error("Erro ao buscar as rifas reais:", erro);
            }
        };

        buscarRifas();
    }, []);

    const fazerLogin = async () => {
        try {
            const resposta = await fetch('https://localhost:7002/api/auth/login', {
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
                setIsAdmin(dadosUsuario.isAdmin || dadosUsuario.IsAdmin || false);
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
            const resposta = await fetch('https://localhost:7002/api/auth/cadastro', {
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
        setIsAdmin(false);
    };

    return (
        <>
            <header className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        
                        <div className="flex items-center gap-8">
                            <div className="flex items-center gap-3">
                                <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-2 rounded-xl">
                                    <Ticket className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <Link to="/" className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                        RIFEX
                                    </Link>
                                    <p className="text-sm text-gray-600 hidden md:block">Concorra a prêmios incríveis</p>
                                </div>
                            </div>

                            <div className="relative hidden sm:block mt-1">
                                <button 
                                    onClick={() => setMenuAberto(!menuAberto)}
                                    className="flex items-center cursor-pointer gap-1 text-gray-600 hover:text-purple-600 font-medium transition-colors"
                                >
                                    Explorar 
                                    <ChevronDown className={`w-4 h-4 transition-transform ${menuAberto ? 'rotate-180' : ''}`} />
                                </button>

                                {menuAberto && (
                                    <div className="absolute top-full mt-4 left-0 w-56 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                                        
                                        <Link to="/about-us" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors border-b border-gray-50">
                                            <Info className="w-4 h-4 text-blue-500" /> 
                                            <div className="flex flex-col">
                                                <span className="font-medium text-sm">Sobre nós</span>
                                                <span className="text-xs text-gray-400">Conheça nossa história</span>
                                            </div>
                                        </Link>
                                        
                                        <Link to="/comprar-moedas" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors border-b border-gray-50">
                                            <Coins className="w-4 h-4 text-yellow-500" /> 
                                            <div className="flex flex-col">
                                                <span className="font-medium text-sm">Comprar moedas</span>
                                                <span className="text-xs text-gray-400">Recarregue seu saldo</span>
                                            </div>
                                        </Link>
                                        
                                        <Link to="/suporte" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors">
                                            <LifeBuoy className="w-4 h-4 text-green-500" /> 
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-sm">Suporte</span>
                                                <span className="text-xs text-gray-400">Precisa de ajuda?</span>
                                                </div>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            {logado ? (
                                <>
                                    <div className="hidden md:flex items-center gap-2 mr-2">
                                        <span className="text-sm font-medium text-gray-700">Olá, {usuarioNome}</span>
                                        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border border-yellow-300 shadow-sm flex items-center gap-1 px-3 py-1">
                                            {isAdmin ? '∞ Admin' : `🪙 ${moedas}`}
                                        </Badge>
                                    </div>
                                    <Link to="/minhas-rifas">
                                        <Button  className="cursor-pointer bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                                            Minhas Rifas
                                        </Button>
                                    </Link>
                                    <Link to="/criar-rifa">
                                        <Button className="cursor-pointer bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                                            Criar Rifa
                                        </Button>
                                    </Link>
                                    <Button variant="outline" onClick={fazerLogout}>Sair</Button>
                                </>
                            ) : (  
                                <>
                                    <Button variant="outline" className="cursor-pointer border-purple-600 text-purple-600 hover:bg-purple-50" onClick={() => setMostrarCadastro(true)}>
                                        Cadastrar-se
                                    </Button>
                                    
                                    <Button 
                                        onClick={() => setMostrarLogin(true)} 
                                        className="cursor-pointer bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                                    >
                                        Login
                                    </Button>
                                </>
                            )}
                        </div>

                    </div>
                </div>
            </header>

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
        </>
    );
}