import React, { useState } from 'react';
import { Share2, Copy, Check, MessageSquare, Facebook, Twitter, X } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareUrl =
    typeof window !== 'undefined' && window.location.origin && window.location.origin !== 'null'
      ? window.location.origin
      : 'https://ais-pre-gagjmrhdt2t5esodotd2o6-366743501827.us-west2.run.app';

  const shareText =
    'Ouça a Rádio de Pátria e Querência! Música nativista, folclore e tradição gaúcha 24 horas no ar. Baixe o app pelo site:';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleWhatsApp = () => {
    window.open(
      `https://api.whatsapp.com/send?text=${encodeURIComponent(
        `${shareText}\n${shareUrl}`
      )}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const handleFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareUrl
      )}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const handleTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        shareText
      )}&url=${encodeURIComponent(shareUrl)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-md rounded-2xl bg-[#111A1F] border border-amber-900/40 text-slate-100 shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-title"
      >
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 bg-gradient-to-b from-[#182620] to-[#111A1F] border-b border-amber-900/30">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg p-2 border border-amber-400/30">
              <Share2 className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <h2 id="share-title" className="text-xl font-bold font-display tracking-wide text-amber-400">
                Compartilhar a Rádio
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Espalhe a cultura e a música gaúcha para seus amigos e grupos
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Quick Copy Link Box */}
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-2">
              Link público direto do aplicativo:
            </label>
            <div className="flex items-center gap-2 p-1.5 pl-3 rounded-xl bg-black/50 border border-white/10">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="bg-transparent text-xs text-amber-300 font-mono w-full focus:outline-none select-all truncate"
              />
              <button
                onClick={handleCopy}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-amber-600 hover:bg-amber-500 text-slate-950'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copiar
                  </>
                )}
              </button>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-amber-500/20 flex items-center gap-4">
            <div className="w-24 h-24 bg-white p-1.5 rounded-xl shrink-0 flex items-center justify-center shadow-md">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                  shareUrl
                )}`}
                alt="QR Code do Aplicativo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-amber-400">
                Aponte a câmera do celular
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                Escaneie o QR Code com qualquer smartphone para abrir a rádio e instalar o aplicativo na tela inicial na hora.
              </p>
            </div>
          </div>

          {/* Social Network Buttons */}
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-2">
              Enviar link diretamente:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={handleWhatsApp}
                className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-400 transition-all group cursor-pointer"
              >
                <MessageSquare className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium">WhatsApp</span>
              </button>

              <button
                onClick={handleFacebook}
                className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-blue-950/40 hover:bg-blue-900/60 border border-blue-500/30 text-blue-400 transition-all group cursor-pointer"
              >
                <Facebook className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium">Facebook</span>
              </button>

              <button
                onClick={handleTwitter}
                className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-sky-950/40 hover:bg-sky-900/60 border border-sky-500/30 text-sky-400 transition-all group cursor-pointer"
              >
                <Twitter className="w-5 h-5 text-sky-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium">Twitter / X</span>
              </button>
            </div>
          </div>

          {/* Platform note */}
          <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5 text-[11px] text-slate-400 leading-relaxed">
            💡 <strong className="text-slate-300">Dica:</strong> No topo da tela do Google AI Studio, clique no botão <strong>"Share"</strong> (Compartilhar) e marque <strong>"Anyone with the link"</strong> para liberar o acesso público sem pedir login do Google.
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-black/40 border-t border-white/5 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 text-sm font-medium transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
