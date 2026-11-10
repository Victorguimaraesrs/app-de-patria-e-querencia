import React, { useState } from 'react';
import { Moon, Clock, X, Check, AlertCircle } from 'lucide-react';

interface SleepTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTimerRemaining: number | null; // seconds
  onSetTimer: (minutes: number) => void;
  onCancelTimer: () => void;
}

export const SleepTimerModal: React.FC<SleepTimerModalProps> = ({
  isOpen,
  onClose,
  activeTimerRemaining,
  onSetTimer,
  onCancelTimer,
}) => {
  const [customMinutes, setCustomMinutes] = useState('20');
  const presets = [15, 30, 45, 60, 90, 120];

  if (!isOpen) return null;

  const formatRemaining = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-md rounded-2xl bg-[#111A1F] border border-amber-900/40 text-slate-100 shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sleep-timer-title"
      >
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 bg-gradient-to-b from-[#18231E] to-[#111A1F] border-b border-amber-900/30">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-800 flex items-center justify-center shadow-lg p-2 border border-indigo-400/30">
              <Moon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 id="sleep-timer-title" className="text-xl font-bold font-display tracking-wide text-amber-400">
                Temporizador de Sono
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Durma ouvindo boa música campeira sem gastar bateria a noite toda
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Active Timer Status */}
          {activeTimerRemaining !== null && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-500/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-indigo-400 animate-pulse" />
                <div>
                  <span className="text-xs text-indigo-200 uppercase font-semibold tracking-wider">
                    Desligamento em:
                  </span>
                  <div className="text-2xl font-mono font-bold text-white tracking-wider tabular-nums">
                    {formatRemaining(activeTimerRemaining)}
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  onCancelTimer();
                }}
                className="px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 text-xs font-semibold border border-red-800/40 transition-colors"
              >
                Cancelar Timer
              </button>
            </div>
          )}

          {/* Preset Buttons */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2.5">
              Escolha um tempo programado:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {presets.map((mins) => (
                <button
                  key={mins}
                  onClick={() => {
                    onSetTimer(mins);
                    onClose();
                  }}
                  className="py-3 px-2 rounded-xl bg-white/[0.04] hover:bg-amber-600/20 border border-white/5 hover:border-amber-500/40 text-center transition-all group"
                >
                  <span className="block text-lg font-bold text-slate-100 group-hover:text-amber-400 tabular-nums">
                    {mins}
                  </span>
                  <span className="block text-[11px] text-slate-400">minutos</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Time */}
          <div className="pt-2 border-t border-white/5">
            <label className="text-xs font-semibold text-slate-400 block mb-2">
              Ou digite outro tempo em minutos:
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                max="360"
                value={customMinutes}
                onChange={(e) => setCustomMinutes(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500 tabular-nums"
                placeholder="Ex: 25"
              />
              <button
                onClick={() => {
                  const val = parseInt(customMinutes, 10);
                  if (val > 0) {
                    onSetTimer(val);
                    onClose();
                  }
                }}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-sm transition-colors flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                Ativar
              </button>
            </div>
          </div>

          {/* Info note */}
          <div className="flex items-start gap-2 text-xs text-slate-400">
            <AlertCircle className="w-4 h-4 text-amber-500/80 flex-shrink-0 mt-0.5" />
            <span>
              O volume do áudio diminui gradualmente nos últimos 30 segundos para um adormecer suave.
            </span>
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
