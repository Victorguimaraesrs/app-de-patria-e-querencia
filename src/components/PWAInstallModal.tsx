import React, { useState } from 'react';
import { Download, Smartphone, Apple, Monitor, CheckCircle2, X, Sparkles, ArrowRight } from 'lucide-react';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  isInstallable: boolean;
  isIOS: boolean;
  onInstall: () => Promise<boolean>;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({
  isOpen,
  onClose,
  isInstallable,
  isIOS,
  onInstall,
}) => {
  const [activeTab, setActiveTab] = useState<'android' | 'ios' | 'desktop'>(
    isIOS ? 'ios' : 'android'
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-lg rounded-2xl bg-[#111A1F] border border-amber-900/40 text-slate-100 shadow-2xl shadow-black/80 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header with Gaucho motif */}
        <div className="relative px-6 pt-6 pb-4 bg-gradient-to-b from-[#1C2C27] to-[#111A1F] border-b border-amber-900/30">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-950/50 p-2 border border-amber-300/30">
              <Download className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <h2 id="modal-title" className="text-xl font-bold font-display tracking-wide text-amber-400">
                Baixar Aplicativo da Rádio
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Instale direto pelo site sem ocupar memória da loja de apps
              </p>
            </div>
          </div>
        </div>

        {/* Quick 1-Click Install CTA if browser supports prompt */}
        {isInstallable && (
          <div className="mx-6 mt-4 p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-amber-900/30 to-amber-950/40 border border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-left">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Instalação Rápida Detectada
              </span>
              <p className="text-xs text-slate-200 mt-0.5">
                Seu navegador suporta instalação direta em 1 toque.
              </p>
            </div>
            <button
              onClick={async () => {
                const ok = await onInstall();
                if (ok) onClose();
              }}
              className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm rounded-lg shadow-md hover:shadow-amber-500/30 transition-all flex items-center justify-center gap-2 whitespace-nowrap active:scale-95"
            >
              <Download className="w-4 h-4" />
              Instalar Agora
            </button>
          </div>
        )}

        {/* Tab Selector */}
        <div className="px-6 pt-4">
          <div className="grid grid-cols-3 gap-2 p-1 bg-black/40 rounded-xl border border-white/5 text-xs font-medium">
            <button
              onClick={() => setActiveTab('android')}
              className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'android'
                  ? 'bg-amber-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              Android
            </button>
            <button
              onClick={() => setActiveTab('ios')}
              className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'ios'
                  ? 'bg-amber-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Apple className="w-4 h-4" />
              iPhone / iPad
            </button>
            <button
              onClick={() => setActiveTab('desktop')}
              className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'desktop'
                  ? 'bg-amber-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Monitor className="w-4 h-4" />
              Computador
            </button>
          </div>
        </div>

        {/* Step-by-step content based on active tab */}
        <div className="p-6 space-y-4">
          {activeTab === 'android' && (
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center border border-amber-500/30">
                  1
                </span>
                <p className="text-sm text-slate-200">
                  Abra este site no <strong>Google Chrome</strong> ou navegador padrão do seu celular Android.
                </p>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center border border-amber-500/30">
                  2
                </span>
                <p className="text-sm text-slate-200">
                  Toque no botão <strong className="text-amber-300">"Instalar Aplicativo"</strong> no topo da página ou abra o menu de <strong>três pontos (⋮)</strong> no canto superior do navegador.
                </p>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center border border-amber-500/30">
                  3
                </span>
                <p className="text-sm text-slate-200">
                  Selecione <strong className="text-amber-300">"Instalar aplicativo"</strong> ou <strong className="text-amber-300">"Adicionar à tela inicial"</strong> e confirme. O ícone oficial aparecerá na tela do seu aparelho!
                </p>
              </div>
            </div>
          )}

          {activeTab === 'ios' && (
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center border border-amber-500/30">
                  1
                </span>
                <p className="text-sm text-slate-200">
                  Abra o site no navegador oficial <strong>Safari</strong> do iPhone ou iPad.
                </p>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center border border-amber-500/30">
                  2
                </span>
                <p className="text-sm text-slate-200">
                  Toque no botão <strong>Compartilhar</strong> (o quadrado com uma seta apontando para cima, na barra inferior).
                </p>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center border border-amber-500/30">
                  3
                </span>
                <p className="text-sm text-slate-200">
                  Role a lista para baixo e toque em <strong className="text-amber-300">"Adicionar à Tela de Início"</strong> e depois em <strong>Adicionar</strong>. Pronto!
                </p>
              </div>
            </div>
          )}

          {activeTab === 'desktop' && (
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center border border-amber-500/30">
                  1
                </span>
                <p className="text-sm text-slate-200">
                  No Chrome, Edge ou Brave, localize o <strong>ícone de instalação (computador com seta)</strong> no lado direito da barra de endereço URL.
                </p>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center border border-amber-500/30">
                  2
                </span>
                <p className="text-sm text-slate-200">
                  Clique em <strong>"Instalar Rádio de Pátria e Querência"</strong>. O player abrirá como um aplicativo dedicado na barra de tarefas!
                </p>
              </div>
            </div>
          )}

          {/* Advantages list */}
          <div className="pt-2 border-t border-white/10">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Vantagens do Aplicativo Instalado:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Acesso com 1 toque na tela</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Áudio em segundo plano com tela desligada</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Super leve (menos de 1MB)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Sem propagandas de lojas</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-black/40 border-t border-white/5 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-sm font-medium transition-colors"
          >
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
};
