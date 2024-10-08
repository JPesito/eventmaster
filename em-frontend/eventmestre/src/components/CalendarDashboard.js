import React, { useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@mui/material';

export default function DailySalonSchedule() {
  const [selectedInterval, setSelectedInterval] = useState(null)
  const [currentDate, setCurrentDate] = useState(new Date())

  const salones = [
    { id: 'salon1', title: 'Salón 1' },
    { id: 'salon2', title: 'Salón 2' },
    { id: 'salon3', title: 'Salón 3' },
    { id: 'salon4', title: 'Salón 4' },
    { id: 'salon5', title: 'Salón 5' },
    { id: 'salon6', title: 'Salón 6' },
    { id: 'salon7', title: 'Salón 7' },
  ]

  const handleDateSelect = (selectInfo) => {
    const { start, end, resource } = selectInfo
    setSelectedInterval({ start, end, resourceId: resource.id })
  }

  const handleSaveEvent = () => {
    if (selectedInterval) {
      // Aquí es donde normalmente enviarías los datos a tu backend
      console.log('Guardando evento:', selectedInterval)
      // Simula una llamada a la base de datos
      alert('Evento guardado exitosamente!')
      setSelectedInterval(null)
    }
  }

  const handlePrevDay = () => {
    const calendarApi = calendarRef.current.getApi()
    calendarApi.prev()
    setCurrentDate(calendarApi.getDate())
  }

  const handleNextDay = () => {
    const calendarApi = calendarRef.current.getApi()
    calendarApi.next()
    setCurrentDate(calendarApi.getDate())
  }

  const calendarRef = React.useRef(null)

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <button onClick={handlePrevDay} className="px-4 py-2 bg-gray-200 rounded">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <h2 className="text-xl font-bold">{currentDate.toLocaleDateString()}</h2>
        <button onClick={handleNextDay} className="px-4 py-2 bg-gray-200 rounded">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <FullCalendar
        ref={calendarRef}
        plugins={[resourceTimeGridPlugin, interactionPlugin]}
        initialView="resourceTimeGridDay"
        resources={salones}
        slotMinTime="07:00:00"
        slotMaxTime="22:00:00"
        headerToolbar={false}
        allDaySlot={false}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        select={handleDateSelect}
        height="auto"
      />
      {selectedInterval && (
        <div className="mt-4 p-4 bg-blue-100 rounded">
          <p>Intervalo seleccionado:</p>
          <p>Salón: {salones.find(s => s.id === selectedInterval.resourceId)?.title}</p>
          <p>Inicio: {selectedInterval.start.toLocaleString()}</p>
          <p>Fin: {selectedInterval.end.toLocaleString()}</p>
          <Button
            onClick={handleSaveEvent}
            className="mt-2"
          >
            Guardar Evento
          </Button>
        </div>
      )}
    </div>
  )
}