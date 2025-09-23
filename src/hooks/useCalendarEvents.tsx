import { useState, useEffect, useCallback } from 'react';
import { 
  fetchCalendarEvents, 
  refreshCalendarEventsPost, 
  addCalendarEvent, 
  editCalendarEvent, 
  deleteCalendarEvent 
} from '@/services/calendarApi';
import { CalendarEvent, EventFormData } from '@/types/calendar';
import { AgendaType } from '@/hooks/useAgendaType';
import { toast } from 'sonner';

export function useCalendarEvents(agendaType: AgendaType = 'mentoria-ci', selectedDate?: Date | null) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clear events immediately when agendaType changes to prevent "leakage"
  useEffect(() => {
    console.log(`[Calendar] Agenda type changed to: ${agendaType}, clearing events`);
    setEvents([]);
    setError(null);
    setIsLoading(true);
  }, [agendaType]);

  // Function to fetch events (Always GET for refresh)
  const fetchEvents = useCallback(async () => {
    try {
      console.log(`[Calendar] Fetching events for ${agendaType}`, { selectedDate });
      const fetchedEvents = await fetchCalendarEvents(agendaType, selectedDate);
      setEvents(fetchedEvents);
      setLastUpdated(new Date());
      setError(null);
      console.log(`[Calendar] Successfully fetched ${fetchedEvents.length} events for ${agendaType}`);
    } catch (err) {
      console.error(`[Calendar] Error fetching events for ${agendaType}:`, err);
      setError(err instanceof Error ? err : new Error('Erro ao carregar eventos'));
      
      // Only try POST fallback if we have no events at all
      if (events.length === 0) {
        try {
          console.log(`[Calendar] GET failed for ${agendaType}, trying POST refresh as fallback...`);
          const refreshedEvents = await refreshCalendarEventsPost(agendaType, selectedDate);
          setEvents(refreshedEvents);
          setLastUpdated(new Date());
          setError(null);
          console.log(`[Calendar] Fallback POST successful for ${agendaType}`);
        } catch (refreshErr) {
          console.error(`[Calendar] POST fallback also failed for ${agendaType}:`, refreshErr);
          toast.error("Não conseguimos carregar os eventos. Tente novamente em alguns instantes.");
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate, agendaType]);

  // Function to refresh events using POST method
  const refreshEventsPost = useCallback(async () => {
    setIsLoading(true);
    try {
      const refreshedEvents = await refreshCalendarEventsPost(agendaType, selectedDate);
      setEvents(refreshedEvents);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate, agendaType]);

  // Add a new event
  const addEvent = async (formData: EventFormData) => {
    setIsSubmitting(true);
    try {
      console.log(`[Calendar] Adding event to ${agendaType}:`, formData);
      const success = await addCalendarEvent(formData, agendaType);
      if (success) {
        console.log(`[Calendar] Event added successfully to ${agendaType}, refreshing...`);
        await fetchEvents(); // Refresh events
        toast.success("Evento adicionado com sucesso!");
      } else {
        toast.error("Falha ao adicionar evento. Tente novamente.");
      }
      return success;
    } catch (err) {
      console.error(`[Calendar] Error adding event to ${agendaType}:`, err);
      toast.error("Erro ao adicionar evento. Verifique os dados e tente novamente.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit an existing event
  const editEvent = async (eventId: string, formData: EventFormData) => {
    setIsSubmitting(true);
    try {
      console.log(`[Calendar] Editing event ${eventId} in ${agendaType}:`, formData);
      const success = await editCalendarEvent(eventId, formData, agendaType);
      if (success) {
        console.log(`[Calendar] Event edited successfully in ${agendaType}, refreshing...`);
        await fetchEvents(); // Refresh events
        toast.success("Evento atualizado com sucesso!");
      } else {
        console.warn(`[Calendar] Edit operation returned false for event ${eventId} in ${agendaType}`);
        toast.error("Falha ao atualizar evento. O evento pode não existir mais.");
        await fetchEvents(); // Still refresh to get current state
      }
      return success;
    } catch (err) {
      console.error(`[Calendar] Error editing event ${eventId} in ${agendaType}:`, err);
      toast.error("Erro ao atualizar evento. Verifique se o evento ainda existe.");
      await fetchEvents(); // Refresh to get current state
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete an event
  const deleteEvent = async (eventId: string) => {
    setIsSubmitting(true);
    try {
      console.log(`[Calendar] Deleting event ${eventId} from ${agendaType}`);
      const success = await deleteCalendarEvent(eventId, agendaType);
      if (success) {
        console.log(`[Calendar] Event deleted successfully from ${agendaType}, refreshing...`);
        await fetchEvents(); // Refresh events
        toast.success("Evento excluído com sucesso!");
      } else {
        console.warn(`[Calendar] Delete operation returned false for event ${eventId} in ${agendaType}`);
        toast.error("Falha ao excluir evento. O evento pode não existir mais.");
        await fetchEvents(); // Still refresh to get current state
      }
      return success;
    } catch (err) {
      console.error(`[Calendar] Error deleting event ${eventId} from ${agendaType}:`, err);
      toast.error("Erro ao excluir evento. O evento pode não existir mais.");
      await fetchEvents(); // Refresh to get current state
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Initial fetch on mount or when selected date changes
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents, selectedDate, agendaType]);

  // Setup polling every 30 seconds (GET only for silent updates)
  useEffect(() => {
    const intervalId = setInterval(async () => {
      console.log(`[Calendar] Polling for ${agendaType} events...`);
      try {
        const fetchedEvents = await fetchCalendarEvents(agendaType, selectedDate);
        setEvents(fetchedEvents);
        setLastUpdated(new Date());
        setError(null);
      } catch (err) {
        // Silent failure for polling - don't show errors or fallbacks
        console.warn(`[Calendar] Polling failed for ${agendaType}:`, err);
      }
    }, 30000); // 30 seconds

    return () => clearInterval(intervalId);
  }, [selectedDate, agendaType]);

  return { 
    events, 
    isLoading, 
    error, 
    lastUpdated, 
    refreshEvents: fetchEvents, // Always GET method
    refreshEventsPost, // Keep for compatibility but prefer GET
    addEvent,
    editEvent,
    deleteEvent,
    isSubmitting
  };
}

// Re-export types for backward compatibility
export type { CalendarEvent, EventFormData } from '@/types/calendar';
