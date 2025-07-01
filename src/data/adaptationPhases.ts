import { AdaptationPhase } from '@/types';

export const adaptationPhases: AdaptationPhase[] = [
  {
    day: 1,
    phase: "Fase 1 - Dias 1-3",
    morningFeed: "1/4 concentrado + volumoso",
    afternoonFeed: "Apenas volumoso",
    instructions: "Período inicial de adaptação. Oferecer 1/4 do concentrado pela manhã com volumoso."
  },
  {
    day: 4,
    phase: "Fase 2 - Dias 4-6",
    morningFeed: "1/4 concentrado + volumoso",
    afternoonFeed: "1/4 concentrado + volumoso",
    instructions: "Aumentar para 2 refeições diárias com concentrado."
  },
  {
    day: 7,
    phase: "Fase 3 - Dias 7-10",
    morningFeed: "1/4 concentrado + volumoso",
    afternoonFeed: "2/4 concentrado apenas",
    instructions: "Aumentar concentrado da tarde e retirar volumoso gradualmente."
  },
  {
    day: 11,
    phase: "Fase 4 - Dias 11-13",
    morningFeed: "2/4 concentrado apenas",
    afternoonFeed: "2/4 concentrado apenas",
    instructions: "Retirar volumoso completamente. Oferecer apenas concentrado."
  },
  {
    day: 14,
    phase: "Fase 5 - Dia 14",
    morningFeed: "2/4 concentrado apenas",
    afternoonFeed: "Sem alimentação",
    instructions: "Reduzir para apenas 1 refeição pela manhã."
  },
  {
    day: 15,
    phase: "Fase Final - Autoconsumo",
    morningFeed: "Concentrado à vontade",
    afternoonFeed: "Concentrado à vontade",
    instructions: "Adaptação concluída! Concentrado à vontade (autogrão)."
  }
];
