import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { isSameDay, parseISO, addDays, addHours, addMinutes, format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { 
  ArrowLeft, RefreshCw, LoaderCircle
} from 'lucide-react';
import { useCalendarEvents, CalendarEvent, EventFormData } from '@/hooks/useCalendarEvents';
import { useAgendaType, AgendaType } from '@/hooks/useAgendaType';
import { EventFormDialog } from '@/components/EventFormDialog';
import { DeleteEventDialog } from '@/components/DeleteEventDialog';
import { Appointment, AppointmentFormData } from '@/types/calendar';
import { CalendarSidebar } from '@/components/schedule/CalendarSidebar';
import { EventsCard } from '@/components/schedule/EventsCard';
import { AppointmentsSection } from '@/components/schedule/AppointmentsSection';
import { AgendaTypeSelector } from '@/components/schedule/AgendaTypeSelector';

// Real appointments will be fetched from the database
const mockAppointments: Appointment[] = [];

const Schedule = () => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  const { 
    agendaType, 
    changeAgendaType
  } = useAgendaType();
  
  const {
    events,
    isLoading: isEventsLoading,
    error: eventsError,
    lastUpdated,
    refreshEvents, // Use GET method for refresh button
    addEvent,
    editEvent,
    deleteEvent,
    isSubmitting
  } = useCalendarEvents(agendaType, selectedDate);
  
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState<Appointment | null>(null);
  const [formData, setFormData] = useState<AppointmentFormData>({
    clientName: '',
    ownerName: '',
    phone: '',
    date: new Date(),
    service: 'Mentoria CI',
    status: 'pendente',
    notes: ''
  });
  
  const [isAddEventDialogOpen, setIsAddEventDialogOpen] = useState(false);
  const [isEditEventDialogOpen, setIsEditEventDialogOpen] = useState(false);
  const [isDeleteEventDialogOpen, setIsDeleteEventDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('day');
  
  useEffect(() => {
    if (!isAuthLoading && !user) {
      navigate('/');
    }
  }, [user, isAuthLoading, navigate]);
  
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="h-16 w-16 border-4 border-t-transparent rounded-full animate-spin" style={{borderColor: 'hsl(80, 100%, 50%)'}}></div>
      </div>
    );
  }
  
  const filteredAppointments = appointments.filter(appointment => {
    if (selectedTab === 'day' && selectedDate) {
      return isSameDay(appointment.date, selectedDate);
    } else if (selectedTab === 'all') {
      return true;
    }
    return false;
  }).filter(appointment => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
                  return appointment.clientName.toLowerCase().includes(searchLower) || 
                         appointment.ownerName.toLowerCase().includes(searchLower) ||
                         appointment.phone.includes(searchTerm) || 
                         appointment.service.toLowerCase().includes(searchLower);
  }).sort((a, b) => a.date.getTime() - b.date.getTime());
  
  const filteredEvents = events.filter(event => {
    if (selectedTab === 'day' && selectedDate) {
      const eventStartDate = parseISO(event.start);
      return isSameDay(eventStartDate, selectedDate);
    } else if (selectedTab === 'all') {
      return true;
    }
    return false;
  }).filter(event => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (event.summary && event.summary.toLowerCase().includes(searchLower)) || 
           (event.description && event.description.toLowerCase().includes(searchLower)) ||
           (event.attendees && event.attendees.some(attendee => 
             attendee?.email && attendee.email.toLowerCase().includes(searchLower)
           ));
  }).sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditDialogOpen && currentAppointment) {
      setAppointments(appointments.map(app => 
        app.id === currentAppointment.id ? {
          ...formData,
          id: app.id
        } : app
      ));
      setIsEditDialogOpen(false);
    } else {
      const newId = Math.max(0, ...appointments.map(a => a.id)) + 1;
      setAppointments([...appointments, {
        ...formData,
        id: newId
      }]);
      setIsAddDialogOpen(false);
    }
    setFormData({
      clientName: '',
      ownerName: '',
      phone: '',
      date: new Date(),
      service: 'Mentoria CI',
      status: 'pendente',
      notes: ''
    });
  };
  
  const handleEditClick = (appointment: Appointment) => {
    setCurrentAppointment(appointment);
    setFormData({
      clientName: appointment.clientName,
      ownerName: appointment.ownerName,
      phone: appointment.phone,
      date: appointment.date,
      service: appointment.service,
      status: appointment.status,
      notes: appointment.notes
    });
    setIsEditDialogOpen(true);
  };
  
  const handleDeleteClick = (appointment: Appointment) => {
    setCurrentAppointment(appointment);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (currentAppointment) {
      setAppointments(appointments.filter(app => app.id !== currentAppointment.id));
      setIsDeleteDialogOpen(false);
      setCurrentAppointment(null);
    }
  };
  
  const handleAddEvent = (formData: EventFormData) => {
    addEvent(formData).then(success => {
      if (success) {
        setIsAddEventDialogOpen(false);
      }
    });
  };
  
  const handleEditEvent = (formData: EventFormData) => {
    if (selectedEvent) {
      editEvent(selectedEvent.id, formData).then(success => {
        if (success) {
          setIsEditEventDialogOpen(false);
          setSelectedEvent(null);
        }
      });
    }
  };
  
  const handleDeleteEvent = () => {
    if (selectedEvent) {
      deleteEvent(selectedEvent.id).then(success => {
        if (success) {
          setIsDeleteEventDialogOpen(false);
          setSelectedEvent(null);
        }
      });
    }
  };
  
  const openEditEventDialog = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEditEventDialogOpen(true);
  };
  
  const openDeleteEventDialog = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsDeleteEventDialogOpen(true);
  };
  
  const openEventLink = (url: string) => {
    window.open(url, '_blank');
  };

  const getAgendaTitle = () => {
    switch (agendaType) {
      case 'mentoria-ci':
        return 'Agenda de Mentoria CI';
      case 'venda-ci':
        return 'Agenda de Venda CI';
      default:
        return 'Agenda Completa';
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/dashboard')} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
              {getAgendaTitle()}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={refreshEvents} 
              className="flex items-center gap-2" 
              disabled={isEventsLoading}
            >
              {isEventsLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Atualizar
            </Button>
            {lastUpdated && (
              <span className="text-xs text-gray-500 dark:text-gray-400 hidden md:inline-block">
                Última atualização: {format(lastUpdated, "dd/MM/yyyy HH:mm:ss")}
              </span>
            )}
          </div>
        </div>

        <div className="mb-6">
          <AgendaTypeSelector 
            selectedType={agendaType}
            onTypeChange={changeAgendaType}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3">
            <CalendarSidebar 
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              onAddEvent={() => setIsAddEventDialogOpen(true)}
            />
          </div>

          <div className="lg:col-span-9">
            <EventsCard 
              events={events}
              filteredEvents={filteredEvents}
              selectedTab={selectedTab}
              searchTerm={searchTerm}
              selectedDate={selectedDate}
              isLoading={isEventsLoading}
              error={eventsError}
              lastUpdated={lastUpdated}
              onSearchChange={setSearchTerm}
              onTabChange={setSelectedTab}
              onEditEvent={openEditEventDialog}
              onDeleteEvent={openDeleteEventDialog}
              onOpenEventLink={openEventLink}
              agendaType={agendaType}
            />
          </div>
        </div>
      </div>

      <EventFormDialog
        open={isAddEventDialogOpen}
        onOpenChange={setIsAddEventDialogOpen}
        onSubmit={handleAddEvent}
        isSubmitting={isSubmitting}
        title={`Adicionar Evento - ${getAgendaTitle()}`}
        description="Preencha os campos para adicionar um novo evento ao calendário."
        submitLabel="Salvar Evento"
      />

      <EventFormDialog
        open={isEditEventDialogOpen}
        onOpenChange={setIsEditEventDialogOpen}
        onSubmit={handleEditEvent}
        isSubmitting={isSubmitting}
        event={selectedEvent || undefined}
        title={`Editar Evento - ${getAgendaTitle()}`}
        description="Modifique os campos para atualizar este evento."
        submitLabel="Salvar Alterações"
      />

      <DeleteEventDialog
        open={isDeleteEventDialogOpen}
        onOpenChange={setIsDeleteEventDialogOpen}
        onConfirmDelete={handleDeleteEvent}
        event={selectedEvent}
        isDeleting={isSubmitting}
      />

      <AppointmentsSection 
        appointments={appointments}
        isAddDialogOpen={isAddDialogOpen}
        setIsAddDialogOpen={setIsAddDialogOpen}
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        currentAppointment={currentAppointment}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        confirmDelete={confirmDelete}
      />
    </div>
  );
};

export default Schedule;
