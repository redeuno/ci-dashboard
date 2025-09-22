
import { useState, useCallback } from 'react';

export type AgendaType = 'mentoria-ci' | 'venda-ci';

export function useAgendaType() {
  const [agendaType, setAgendaType] = useState<AgendaType>('mentoria-ci');

  const changeAgendaType = useCallback((type: AgendaType) => {
    setAgendaType(type);
  }, []);

  const getEndpointSuffix = useCallback(() => {
    switch (agendaType) {
      case 'mentoria-ci':
        return '/mentoria-ci';
      case 'venda-ci':
        return '/venda-ci';
    }
  }, [agendaType]);

  return {
    agendaType,
    changeAgendaType,
    getEndpointSuffix,
    isMentoriaCi: agendaType === 'mentoria-ci',
    isVendaCi: agendaType === 'venda-ci'
  };
}
