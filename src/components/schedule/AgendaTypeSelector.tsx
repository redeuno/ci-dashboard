
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AgendaType } from '@/hooks/useAgendaType';
import { GraduationCap, TrendingUp } from 'lucide-react';

interface AgendaTypeSelectorProps {
  selectedType: AgendaType;
  onTypeChange: (type: AgendaType) => void;
}

export function AgendaTypeSelector({ selectedType, onTypeChange }: AgendaTypeSelectorProps) {
  return (
    <Tabs 
      defaultValue={selectedType} 
      className="w-full" 
      onValueChange={(value) => onTypeChange(value as AgendaType)}
      value={selectedType}
    >
      <TabsList className="grid grid-cols-2 w-full">
        <TabsTrigger value="mentoria-ci" className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4" />
          <span className="hidden sm:inline">Mentoria CI</span>
        </TabsTrigger>
        <TabsTrigger value="venda-ci" className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          <span className="hidden sm:inline">Venda CI</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
