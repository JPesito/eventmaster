import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { eventStyleGetter, cellStyleGetter } from "./EventStyles";

moment.locale("es");
const localizer = momentLocalizer(moment);

const EventCalendar = ({ events, onSelectSlot, onSelectEvent, isMobile }) => {
  return (
    <Calendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      selectable
      onSelectSlot={onSelectSlot}
      onSelectEvent={onSelectEvent}
      views={isMobile ? ["day"] : ["week"]}
      defaultView={isMobile ? "day" : "week"}
      step={30}
      timeslots={2}
      min={new Date(2024, 0, 1, 7, 0)}
      max={new Date(2024, 0, 1, 23, 0)}
      eventPropGetter={(event) => eventStyleGetter(event.backgroundColor)}
      dayPropGetter={cellStyleGetter} // Pasar la función directamente
      messages={{
        next: "Siguiente",
        previous: "Anterior",
        month: "Mes",
        week: "Semana",
        day: "Día",
        today: "Hoy",
        noEventsInRange: "No hay eventos en este rango",
      }}
      formats={{
        timeGutterFormat: (date, culture, localizer) => localizer.format(date, "HH:mm", culture),
      }}
    />
  );
};

export default EventCalendar;