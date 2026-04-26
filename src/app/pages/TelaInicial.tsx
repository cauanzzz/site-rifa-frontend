import React from 'react';
import { Header } from '../components/header'; 

const TelaInicial = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 font-sans">
      
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-12 flex flex-col items-center text-center">
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight">
          Bem-vindo ao <br className="md:hidden" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">
            Rifas Coins
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
          A plataforma mais segura e divertida para você concorrer a prêmios incríveis. Adquira suas moedas, escolha sua rifa e boa sorte!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-lg mx-auto">
          
          <a href="/rifas-ativas" className="w-full sm:w-1/2 px-8 py-4 bg-purple-600 text-white rounded-2xl font-bold text-lg hover:bg-purple-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3">
            <span className="text-2xl">🎟️</span>
            Ver Rifas Ativas
          </a>
          
          <a href="/comprar-moedas" className="w-full sm:w-1/2 px-8 py-4 bg-white text-purple-700 border-2 border-purple-200 rounded-2xl font-bold text-lg hover:border-purple-600 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3">
            <span className="text-2xl">💰</span>
            Comprar Moedas
          </a>

        </div>
      </main>

      <footer className="fixed bottom-4 w-full text-center text-sm text-gray-400">
        © 2026 Rifas Coins. Todos os direitos reservados.
      </footer>

    </div>
  );
};

export default TelaInicial;