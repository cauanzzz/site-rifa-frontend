import { createBrowserRouter } from 'react-router';
import { Home } from './pages/Home';
import { RaffleDetail } from './pages/RaffleDetail';
import { CreateRaffle } from './pages/CreateRaffle';
import { MyRaffles } from './pages/MyRaffles'; 
import { BuyCoins } from './pages/BuyCoins';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Home,
  },
  {
    path: '/rifa/:id',
    Component: RaffleDetail,
  },
  {
    path: '/criar-rifa',
    Component: CreateRaffle,
  },
  {
    path: '/minhas-rifas', 
    Component: MyRaffles,
  },
  {
    path: '/comprar-moedas', 
    Component: BuyCoins,
  },
  {
    path: '*',
    Component: () => (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-gray-600 mb-4">Página não encontrada</p>
          <a href="/" className="text-purple-600 hover:underline">
            Voltar para início
          </a>
        </div>
      </div>
    ),
  },
]);