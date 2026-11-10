import React from 'react';
import { Calendar, Clock, Radio, X } from 'lucide-react';

interface ProgramGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProgramGuideModal: React.FC<ProgramGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const schedule = [
    {
      time: '05:00 - 08:00',
      title: 'Alvorada Crioula',
      desc: 'Para iniciar o dia com água quente, cuia na mão e o melhor da música de galpão.',
      tag: 'Madrugada',
    },
    {
      time: '08:00 - 12:00',
      title: 'Mateando na Querência',
      desc: 'Vanerões, milongas e a cultura das três pátrias gaúchas (Brasil, Uruguai e Argentina).',
      tag: 'Manhã',
    },
    {
      time: '12:00 - 15:00',
      title: 'Canto da Terra & Festivais',
      desc: 'Os maiores sucessos da Califórnia da Canção Nativa, Coxilha e festivais nativistas.',
      tag: 'Tarde',
    },
    {
      time: '15:00 - 19:00',
      title: 'Tarde Gaudéria & Pedidos',
      desc: 'Participação ao vivo dos ouvintes pelo WhatsApp com xotes, rancheiras e vaneiras.',
      tag: 'Tarde',
    },
    {
      time: '19:00 - 23:00',
      title: 'Ronda da Tradição',
      desc: 'Poesias xucras, violão campeiro, causos e memórias dos grandes trovadores do Sul.',
      tag: 'Noite',
    },
    {
      time: '23:00 - 05:00',
      title: 'Madrugada dos Galpões',
      desc: 'Seleção especial contínua para acompanhar a vigília dos amantes do Rio Grande.',
      tag: 'Especial',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-lg rounded-2xl bg-[#111A1F] border border-amber-900/40 text-slate-100 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="program-title"
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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center shadow-lg p-2 border border-amber-400/30">
              <Calendar className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <h2 id="program-title" className="text-xl font-bold font-display tracking-wide text-amber-400">
                Grade de Programação
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                24 horas no ar celebrando a identidade e o folclore do Rio Grande do Sul
              </p>
            </div>
          </div>
        </div>

        {/* Schedule List */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {schedule.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-amber-500/30 transition-all"
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-mono font-semibold text-amber-400 flex items-center gap-1.5 tabular-nums">
                  <Clock className="w-3.5 h-3.5" />
                  {item.time}
                </span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/10">
                  {item.tag}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-amber-500/80" />
                {item.title}
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-black/40 border-t border-white/5 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-sm font-medium transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
