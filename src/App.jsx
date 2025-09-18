import { useState } from 'react'
import PrimaryButton from './components/PrimaryButton'
import Header from './components/Header'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(false)

  const handleAsyncAction = async () => {
    setLoading(true)
    // Simula uma ação assíncrona
    await new Promise(resolve => setTimeout(resolve, 2000))
    setLoading(false)
    alert('Ação concluída!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <Header />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Seção de Contadores */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Contador Interativo
            </h2>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600 mb-4">{count}</p>
              <div className="space-y-3">
                <PrimaryButton 
                  onClick={() => setCount(count + 1)}
                  size="default"
                >
                  Incrementar
                </PrimaryButton>
                <br />
                <PrimaryButton 
                  onClick={() => setCount(count - 1)}
                  variant="secondary"
                  size="default"
                >
                  Decrementar
                </PrimaryButton>
              </div>
            </div>
          </div>

          {/* Seção de Variações */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Variações do Botão
            </h2>
            <div className="space-y-3">
              <PrimaryButton size="small" variant="primary">
                Pequeno
              </PrimaryButton>
              <br />
              <PrimaryButton size="default" variant="outline">
                Outline
              </PrimaryButton>
              <br />
              <PrimaryButton size="large" variant="secondary">
                Grande
              </PrimaryButton>
              <br />
              <PrimaryButton disabled>
                Desabilitado
              </PrimaryButton>
            </div>
          </div>

          {/* Seção de Ações */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Ações Avançadas
            </h2>
            <div className="space-y-3">
              <PrimaryButton 
                onClick={handleAsyncAction}
                disabled={loading}
                className={loading ? 'loading' : ''}
              >
                {loading ? 'Carregando...' : 'Ação Assíncrona'}
              </PrimaryButton>
              <br />
              <PrimaryButton 
                onClick={() => setCount(0)}
                variant="outline"
              >
                Resetar Contador
              </PrimaryButton>
            </div>
          </div>
        </div>

        <footer className="text-center mt-12 text-gray-500">
          <p>Componente PrimaryButton implementado com React + Tailwind CSS</p>
        </footer>
      </div>
    </div>
  )
}

export default App
