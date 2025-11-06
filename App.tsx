
import React, { useState, useCallback } from 'react';
import { correctText } from './services/geminiService';
import { SparklesIcon, ClipboardIcon, CheckIcon } from './components/Icons';

const App: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [outputText, setOutputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const inputWordCount = inputText.trim().split(/\s+/).filter(Boolean).length;
  const outputWordCount = outputText.trim().split(/\s+/).filter(Boolean).length;

  const handleCorrection = useCallback(async () => {
    if (!inputText.trim()) {
      setError('Por favor, insira um texto para ser corrigido.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setOutputText('');
    setIsCopied(false);

    try {
      const result = await correctText(inputText);
      setOutputText(result);
    } catch (e) {
      setError('Ocorreu um erro ao comunicar com a API. Por favor, tente novamente.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [inputText]);

  const handleCopy = useCallback(() => {
    if (outputText) {
      navigator.clipboard.writeText(outputText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  }, [outputText]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col">
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 p-4 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold text-white">
            Revisor Acadêmico
          </h1>
          <a
            href="https://ai.google.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            Powered by Gemini
          </a>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col">
        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Refinamento de Texto Acadêmico</h2>
            <p className="mt-4 text-lg text-slate-400">
                Corrija seu texto acadêmico sobre educação, sexualidade e gênero com precisão e um tom conciliador.
            </p>
        </div>

        <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="flex flex-col bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-700 flex justify-between items-center">
              <h3 className="font-semibold text-lg text-white">Seu Texto</h3>
              <span className="text-sm text-slate-400">{inputWordCount} palavras</span>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Cole seu texto aqui..."
              className="font-serif w-full flex-grow p-4 bg-transparent text-slate-300 resize-none focus:outline-none placeholder-slate-500 text-base leading-relaxed"
              disabled={isLoading}
            />
          </div>

          {/* Output Panel */}
          <div className="flex flex-col bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-700 flex justify-between items-center">
              <h3 className="font-semibold text-lg text-white">Texto Corrigido</h3>
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-400">{outputWordCount} palavras</span>
                <button
                  onClick={handleCopy}
                  disabled={!outputText || isLoading}
                  className="text-slate-400 hover:text-white disabled:text-slate-600 disabled:cursor-not-allowed transition-colors"
                  aria-label="Copiar texto"
                >
                  {isCopied ? <CheckIcon className="w-5 h-5 text-green-400" /> : <ClipboardIcon className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div className="font-serif w-full flex-grow p-4 bg-transparent text-slate-200 overflow-y-auto relative text-base leading-relaxed">
              {isLoading && (
                 <div className="absolute inset-0 bg-slate-800/50 flex flex-col items-center justify-center">
                    <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-slate-300">Analisando o texto...</p>
                 </div>
              )}
              {error && <p className="text-red-400">{error}</p>}
              <p className="whitespace-pre-wrap">{outputText}</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full p-4 mt-8 flex justify-center items-center sticky bottom-0">
        <div className="w-full max-w-lg">
            <button
            onClick={handleCorrection}
            disabled={isLoading || !inputText.trim()}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 text-lg font-semibold text-white bg-cyan-600 rounded-lg shadow-lg hover:bg-cyan-500 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:scale-100"
            >
            {isLoading ? (
                <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Corrigindo...
                </>
            ) : (
                <>
                <SparklesIcon className="w-6 h-6" />
                Corrigir Texto
                </>
            )}
            </button>
        </div>
      </footer>
    </div>
  );
};

export default App;
