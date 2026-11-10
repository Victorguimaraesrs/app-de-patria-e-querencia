import React, { useState, useEffect } from 'react';
import { Bell, BellRing, BellOff, Clock, Check, X, Sparkles, Radio, Play } from 'lucide-react';

export interface SpecialProgram {
  id: string;
  title: string;
  schedule: string;
  description: string;
  enabled: boolean;
  startsInMinutes?: number;
}

const DEFAULT_SPECIAL_PROGRAMS: SpecialProgram[] = [
  {
    id: 'california',
    title: 'Califórnia da Canção Nativa - Especial Festivais',
    schedule: 'Hoje às 20:00',
    description: 'Os grandes clássicos premiados da história dos festivais nativistas do Rio Grande do Sul.',
    enabled: true,
    startsInMinutes: 5,
  },
  {
    id: 'mateada_trovadores',
    title: 'Mateada com Trovadores & Poetas do Sul',
    schedule: 'Sábado às 10:00',
    description: 'Transmissão especial com causos, trovas e declamações dos maiores poetas campeiros.',
    enabled: true,
  },
  {
    id: 'baile_fandanguero',
    title: 'Tarde Fandanguera & Baile de Galpão',
    schedule: 'Hoje às 17:00',
    description: 'Seleção especial com as melhores vaneiras, rancheiras e xotes para alegrar a tarde.',
    enabled: false,
  },
  {
    id: 'madrugada_campeira',
    title: 'Ronda da Madrugada dos Galpões',
    schedule: 'Domingo às 00:00',
    description: '6 horas ininterruptas de música tradicionalista xucra sem intervalos comerciais.',
    enabled: false,
  },
];

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerTestNotification: (program: SpecialProgram) => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  onTriggerTestNotification,
}) => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [programs, setPrograms] = useState<SpecialProgram[]>(() => {
    const saved = localStorage.getItem('radio_special_programs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_SPECIAL_PROGRAMS;
      }
    }
    return DEFAULT_SPECIAL_PROGRAMS;
  });
  const [testSent, setTestSent] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }
  }, [isOpen]);

  const savePrograms = (updated: SpecialProgram[]) => {
    setPrograms(updated);
    localStorage.setItem('radio_special_programs', JSON.stringify(updated));
  };

  const requestPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const result = await Notification.requestPermission();
        setPermission(result);
        if (result === 'granted') {
          // Send welcome notification
          new Notification('Rádio de Pátria e Querência', {
            body: 'Notificações ativadas! Avisaremos quando um programa especial estiver começando.',
            icon: '/pwa-192x192.png',
          });
        }
      } catch (err) {
        console.warn('Erro ao solicitar permissão de notificações:', err);
      }
    }
  };

  const toggleProgram = (id: string) => {
    const updated = programs.map((p) =>
      p.id === id ? { ...p, enabled: !p.enabled } : p
    );
    savePrograms(updated);
  };

  const handleTestNotification = () => {
    const sample = programs[0] || DEFAULT_SPECIAL_PROGRAMS[0];
    onTriggerTestNotification(sample);
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-lg rounded-2xl bg-[#111A1F] border border-amber-900/40 text-slate-100 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="notification-modal-title"
      >
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 bg-gradient-to-b from-[#182B22] to-[#111A1F] border-b border-amber-900/30">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg p-2 border border-amber-400/30">
              <BellRing className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <h2
                id="notification-modal-title"
                className="text-xl font-bold font-display tracking-wide text-amber-400"
              >
                Notificações de Programas
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Receba alertas quando os programas especiais e festivais forem ao ar
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Permission Status Box */}
          <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {permission === 'granted' ? (
                <div className="w-9 h-9 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5" />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
                  <Bell className="w-5 h-5" />
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-white">
                  {permission === 'granted'
                    ? 'Notificações no Navegador Ativas'
                    : 'Ativar Alertas no seu Aparelho'}
                </p>
                <p className="text-xs text-slate-400">
                  {permission === 'granted'
                    ? 'Você receberá avisos quando os programas especiais começarem.'
                    : 'Permita notificações para não perder transmissões ao vivo.'}
                </p>
              </div>
            </div>

            {permission !== 'granted' ? (
              <button
                onClick={requestPermission}
                className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-lg transition-all shadow-md shrink-0 cursor-pointer"
              >
                Permitir Alertas
              </button>
            ) : (
              <span className="text-xs font-semibold text-emerald-400 px-3 py-1 bg-emerald-950/40 border border-emerald-500/30 rounded-lg shrink-0">
                Ativado
              </span>
            )}
          </div>

          {/* Test Notification Action */}
          <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-amber-950/20 border border-amber-500/20">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Deseja testar como o alerta chega no seu aparelho?</span>
            </div>
            <button
              onClick={handleTestNotification}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                testSent
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white/10 hover:bg-white/20 text-amber-300 border border-amber-500/30'
              }`}
            >
              {testSent ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Alerta Enviado!
                </>
              ) : (
                <>
                  <BellRing className="w-3.5 h-3.5" />
                  Testar Alerta
                </>
              )}
            </button>
          </div>

          {/* Programs List with Alert Toggles */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Programas Especiais Disponíveis:
            </label>

            {programs.map((prog) => (
              <div
                key={prog.id}
                className={`p-4 rounded-xl border transition-all ${
                  prog.enabled
                    ? 'bg-white/[0.04] border-amber-500/40'
                    : 'bg-black/30 border-white/5 opacity-75'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-semibold text-amber-400 flex items-center gap-1 tabular-nums">
                        <Clock className="w-3.5 h-3.5" />
                        {prog.schedule}
                      </span>
                      {prog.startsInMinutes && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400">
                          Prestes a começar
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5 text-amber-500" />
                      {prog.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {prog.description}
                    </p>
                  </div>

                  {/* Toggle Button */}
                  <button
                    onClick={() => toggleProgram(prog.id)}
                    className={`p-2 rounded-xl transition-all cursor-pointer shrink-0 ${
                      prog.enabled
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : 'bg-white/5 text-slate-500 hover:text-slate-300'
                    }`}
                    aria-label={
                      prog.enabled
                        ? `Desativar lembrete de ${prog.title}`
                        : `Ativar lembrete de ${prog.title}`
                    }
                  >
                    {prog.enabled ? (
                      <BellRing className="w-5 h-5 text-amber-400" />
                    ) : (
                      <BellOff className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-black/40 border-t border-white/5 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {programs.filter((p) => p.enabled).length} de {programs.length} lembretes ativos
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-sm font-medium transition-colors cursor-pointer"
          >
            Concluído
          </button>
        </div>
      </div>
    </div>
  );
};
