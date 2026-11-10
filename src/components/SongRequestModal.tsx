import React, { useState } from 'react';
import { MessageSquare, Music, Send, X, User, MapPin, Heart } from 'lucide-react';

interface SongRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSong?: string;
  initialArtist?: string;
}

export const SongRequestModal: React.FC<SongRequestModalProps> = ({
  isOpen,
  onClose,
  initialSong = '',
  initialArtist = '',
}) => {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [song, setSong] = useState(initialSong);
  const [artist, setArtist] = useState(initialArtist);
  const [dedication, setDedication] = useState('');

  // Update song and artist when modal opens with prefilled data
  React.useEffect(() => {
    if (isOpen) {
      if (initialSong) setSong(initialSong);
      if (initialArtist) setArtist(initialArtist);
    }
  }, [isOpen, initialSong, initialArtist]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Format WhatsApp message with Gaucho cordiality
    let text = `*Buenas, pessoal da Rádio de Pátria e Querência!* 📻🧉\n\n`;
    if (name.trim()) text += `👤 *Ouvinte:* ${name.trim()}`;
    if (city.trim()) text += ` (${city.trim()})\n`;
    else text += `\n`;

    if (song.trim()) text += `🎵 *Música pedida:* ${song.trim()}\n`;
    if (artist.trim()) text += `🎻 *Artista / Conjunto:* ${artist.trim()}\n`;
    if (dedication.trim()) text += `💬 *Recado / Dedicatória:* ${dedication.trim()}\n`;

    text += `\n_Mandando aquele abraço gauchesco a toda a gauchada da Querência!_`;

    // Encode for WhatsApp URL
    const encoded = encodeURIComponent(text);
    // Standard radio WhatsApp endpoint (if no specific number, opens WhatsApp with pre-filled message ready to select contact or station)
    // The radio official WhatsApp or direct API:
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encoded}`;
    
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-lg rounded-2xl bg-[#111A1F] border border-amber-900/40 text-slate-100 shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="song-request-title"
      >
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 bg-gradient-to-b from-[#1E2E25] to-[#111A1F] border-b border-amber-900/30">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center shadow-lg p-2 border border-emerald-400/30">
              <MessageSquare className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <h2 id="song-request-title" className="text-xl font-bold font-display tracking-wide text-amber-400">
                Pedir Música no WhatsApp
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Mande seu pedido para a programação da Rádio de Pátria e Querência
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
                <User className="w-3.5 h-3.5 text-amber-400" />
                Seu Nome:
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Cristiano Fagundes"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500 placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                Sua Cidade / Estado:
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ex: Parobé / RS"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500 placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
                <Music className="w-3.5 h-3.5 text-amber-400" />
                Nome da Música:
              </label>
              <input
                type="text"
                required
                value={song}
                onChange={(e) => setSong(e.target.value)}
                placeholder="Ex: Canto Alegretense"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500 placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
                <Music className="w-3.5 h-3.5 text-amber-400" />
                Artista / Conjunto Gaúcho:
              </label>
              <input
                type="text"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="Ex: Os Fagundes / Teixeirinha"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500 placeholder:text-slate-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
              <Heart className="w-3.5 h-3.5 text-amber-400" />
              Recado ou Dedicatória (Opcional):
            </label>
            <textarea
              rows={2}
              value={dedication}
              onChange={(e) => setDedication(e.target.value)}
              placeholder="Dedico para a família reunida tomando um chimarrão..."
              className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500 placeholder:text-slate-500 resize-none"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 text-sm font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 active:scale-95"
            >
              <Send className="w-4 h-4" />
              Enviar Pedido no WhatsApp
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
