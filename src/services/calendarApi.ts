import { format, endOfDay } from 'date-fns';
import { toast } from "sonner";
import { CalendarEvent, EventFormData } from '@/types/calendar';
import { AgendaType } from '@/hooks/useAgendaType';

// Get endpoints from localStorage
const getEndpoints = () => {
  const savedEndpoints = localStorage.getItem('webhookEndpoints');
  return savedEndpoints ? JSON.parse(savedEndpoints) : {};
};

// Get the correct endpoint URL based on agenda type
const getApiUrl = (endpoint: string, agendaType: AgendaType = 'mentoria-ci') => {
  const endpoints = getEndpoints();
  
  // Map base endpoint names to their specific agenda type variants
  switch (endpoint) {
    case 'base':
      switch (agendaType) {
        case 'mentoria-ci': return endpoints.agendaMentoriaCi || 'https://endpoint.comunidadeimobiliaria.com.br/webhook/agenda/mentoria-ci';
        case 'venda-ci': return endpoints.agendaVendaCi || 'https://endpoint.comunidadeimobiliaria.com.br/webhook/agenda/venda-ci';
      }
    case 'adicionar':
      switch (agendaType) {
        case 'mentoria-ci': return endpoints.agendaAdicionarMentoriaCi || 'https://endpoint.comunidadeimobiliaria.com.br/webhook/agenda/adicionar/mentoria-ci';
        case 'venda-ci': return endpoints.agendaAdicionarVendaCi || 'https://endpoint.comunidadeimobiliaria.com.br/webhook/agenda/adicionar/venda-ci';
      }
    case 'alterar':  
      switch (agendaType) {
        case 'mentoria-ci': return endpoints.agendaAlterarMentoriaCi || 'https://endpoint.comunidadeimobiliaria.com.br/webhook/agenda/alterar/mentoria-ci';
        case 'venda-ci': return endpoints.agendaAlterarVendaCi || 'https://endpoint.comunidadeimobiliaria.com.br/webhook/agenda/alterar/venda-ci';
      }
    case 'excluir':
      switch (agendaType) {
        case 'mentoria-ci': return endpoints.agendaExcluirMentoriaCi || 'https://endpoint.comunidadeimobiliaria.com.br/webhook/agenda/excluir/mentoria-ci';
        case 'venda-ci': return endpoints.agendaExcluirVendaCi || 'https://endpoint.comunidadeimobiliaria.com.br/webhook/agenda/excluir/venda-ci';
      }
    default:
      return endpoints.agendaMentoriaCi || 'https://endpoint.comunidadeimobiliaria.com.br/webhook/agenda/mentoria-ci';
  }
};

// Fetch events with GET method
export async function fetchCalendarEvents(agendaType: AgendaType = 'mentoria-ci', selectedDate?: Date | null) {
  try {
    // Format date parameters for the API
    let url = getApiUrl('base', agendaType);
    
    // If a date is selected, add query parameters for start and end dates
    if (selectedDate) {
      const startDateTime = format(selectedDate, "yyyy-MM-dd'T'00:00:00.000-03:00");
      const endDateTime = format(endOfDay(selectedDate), "yyyy-MM-dd'T'23:59:59.999-03:00");
      
      url += `?start=${encodeURIComponent(startDateTime)}&end=${encodeURIComponent(endDateTime)}`;
      console.log(`Fetching ${agendaType} events with date range:`, { startDateTime, endDateTime });
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error(`Error fetching ${agendaType} calendar events:`, err);
    throw err;
  }
}

// Refresh events with POST method
export async function refreshCalendarEventsPost(agendaType: AgendaType = 'mentoria-ci', selectedDate?: Date | null) {
  try {
    // Create payload with selected date if available
    const payload: any = {};
    
    if (selectedDate) {
      const startDateTime = format(selectedDate, "yyyy-MM-dd'T'00:00:00.000-03:00");
      const endDateTime = format(endOfDay(selectedDate), "yyyy-MM-dd'T'23:59:59.999-03:00");
      
      payload.start = startDateTime;
      payload.end = endDateTime;
      console.log(`Refreshing ${agendaType} events with payload:`, payload);
    }
    
    const response = await fetch(getApiUrl('base', agendaType), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    toast.success("Eventos atualizados com sucesso!");
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error(`Error refreshing ${agendaType} calendar events:`, err);
    toast.error("Não conseguimos atualizar os eventos, tente novamente.");
    throw err;
  }
}

// Add a new event
export async function addCalendarEvent(formData: EventFormData, agendaType: AgendaType = 'mentoria-ci') {
  try {
    // Format the date and times for the API
    const { date, startTime, endTime, summary, description, email } = formData;
    const dateStr = format(date, "yyyy-MM-dd");
    
    const startDateTime = `${dateStr}T${startTime}:00-03:00`;
    const endDateTime = `${dateStr}T${endTime}:00-03:00`;
    
    const payload = {
      summary,
      description,
      start: startDateTime,
      end: endDateTime,
      email
    };
    
    console.log(`Adding ${agendaType} event with payload:`, payload);
    
    const response = await fetch(getApiUrl('adicionar', agendaType), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    toast.success("Evento adicionado com sucesso!");
    return true;
  } catch (err) {
    console.error(`Error adding ${agendaType} event:`, err);
    toast.error("Erro ao adicionar evento. Tente novamente.");
    return false;
  }
}

// Edit an existing event
export async function editCalendarEvent(eventId: string, formData: EventFormData, agendaType: AgendaType = 'mentoria-ci') {
  try {
    // Format the date and times for the API
    const { date, startTime, endTime, summary, description, email } = formData;
    const dateStr = format(date, "yyyy-MM-dd");
    
    const startDateTime = `${dateStr}T${startTime}:00-03:00`;
    const endDateTime = `${dateStr}T${endTime}:00-03:00`;
    
    const payload = {
      id: eventId,
      summary,
      description,
      start: startDateTime,
      end: endDateTime,
      email
    };
    
    console.log(`Updating ${agendaType} event with payload:`, payload);
    
    const response = await fetch(getApiUrl('alterar', agendaType), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    toast.success("Evento atualizado com sucesso!");
    return true;
  } catch (err) {
    console.error(`Error updating ${agendaType} event:`, err);
    toast.error("Erro ao atualizar evento. Tente novamente.");
    return false;
  }
}

// Delete an event
export async function deleteCalendarEvent(eventId: string, agendaType: AgendaType = 'mentoria-ci') {
  try {
    const payload = {
      id: eventId
    };
    
    console.log(`Deleting ${agendaType} event with payload:`, payload);
    
    const response = await fetch(getApiUrl('excluir', agendaType), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    toast.success("Evento excluído com sucesso!");
    return true;
  } catch (err) {
    console.error(`Error deleting ${agendaType} event:`, err);
    toast.error("Erro ao excluir evento. Tente novamente.");
    return false;
  }
}
