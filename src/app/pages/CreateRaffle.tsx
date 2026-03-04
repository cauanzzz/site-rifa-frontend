import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useRaffles } from '../context/RaffleContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

export function CreateRaffle() {
  const navigate = useNavigate();
  const { addRaffle } = useRaffles();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [prize, setPrize] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [price, setPrice] = useState('');
  const [totalNumbers, setTotalNumbers] = useState('');
  const [drawDate, setDrawDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !prize || !price || !totalNumbers || !drawDate) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const priceNum = parseFloat(price);
    const totalNum = parseInt(totalNumbers);

    if (priceNum <= 0 || totalNum <= 0) {
      toast.error('Preço e quantidade devem ser maiores que zero');
      return;
    }

    addRaffle({
      title,
      description,
      prize,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800&q=80',
      price: priceNum,
      totalNumbers: totalNum,
      status: 'active',
      drawDate: new Date(drawDate).toISOString()
    });

    toast.success('Rifa criada com sucesso!');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Criar Nova Rifa</CardTitle>
            <CardDescription>
              Preencha os dados abaixo para criar uma nova rifa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Título da Rifa *</Label>
                <Input 
                  id="title"
                  placeholder="Ex: iPhone 15 Pro Max"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição *</Label>
                <Textarea 
                  id="description"
                  placeholder="Descreva detalhes sobre o prêmio..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prize">Nome do Prêmio *</Label>
                <Input 
                  id="prize"
                  placeholder="Ex: iPhone 15 Pro Max 256GB"
                  value={prize}
                  onChange={(e) => setPrize(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">URL da Imagem</Label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input 
                      id="imageUrl"
                      placeholder="https://exemplo.com/imagem.jpg"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                    />
                  </div>
                  {imageUrl && (
                    <div className="w-12 h-12 rounded border border-gray-200 overflow-hidden">
                      <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  {!imageUrl && (
                    <div className="w-12 h-12 rounded border border-gray-200 flex items-center justify-center bg-gray-50">
                      <ImageIcon className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  Deixe em branco para usar uma imagem padrão
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Preço por Número (R$) *</Label>
                  <Input 
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="10.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="totalNumbers">Quantidade de Números *</Label>
                  <Input 
                    id="totalNumbers"
                    type="number"
                    min="1"
                    placeholder="100"
                    value={totalNumbers}
                    onChange={(e) => setTotalNumbers(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="drawDate">Data e Hora do Sorteio *</Label>
                <Input 
                  id="drawDate"
                  type="datetime-local"
                  value={drawDate}
                  onChange={(e) => setDrawDate(e.target.value)}
                  required
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Informações Importantes</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Certifique-se de que todos os dados estão corretos antes de criar</li>
                  <li>• A rifa será publicada imediatamente após a criação</li>
                  <li>• Os participantes poderão começar a comprar números assim que a rifa for criada</li>
                </ul>
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => navigate('/')}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  Criar Rifa
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
