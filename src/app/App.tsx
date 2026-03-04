import { RouterProvider } from 'react-router';
import { router } from './routes';
import { RaffleProvider } from './context/RaffleContext';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <RaffleProvider>
      <RouterProvider router={router} />
      <Toaster position="top-center" richColors />
    </RaffleProvider>
  );
}
