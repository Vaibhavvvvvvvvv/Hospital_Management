import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fullcalendar/bootstrap/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/timegrid/main.css';
import '@fullcalendar/resource-timegrid/main.css';

const Calendar = () => {
  const calendarRef = useRef(null);
  const [events, setEvents] = useState(JSON.parse(localStorage.getItem('events')) || []);
  const [doctors, setDoctors] = useState(JSON.parse(localStorage.getItem('doctors')) || []);

  useEffect(() => {
    const calendar = calendarRef.current.getApi();
    calendar.setOption('resources', doctors);
    calendar.addEventSource(events);
  }, [events, doctors]);

  const handleViewChange = (view) => {
    const calendar = calendarRef.current.getApi();
    calendar.changeView(view);
  };

  const handleAppointment = () => {
    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    const doctor = document.getElementById('doctor').value;
    const appointmentTime = document.getElementById('appointmentTime').value;

    const newEvent = {
      id: doctor,
      title: name,
      start: appointmentTime,
      end: appointmentTime,
      resourceId: doctor,
    };

    setEvents((prevEvents) => {
      const updatedEvents = [...prevEvents.filter(event => event.resourceId !== doctor), newEvent];
      localStorage.setItem('events', JSON.stringify(updatedEvents));
      return updatedEvents;
    });

    if (!doctors.some(d => d.id === doctor)) {
      const newDoctor = {
        id: doctor,
        title: `Dr. ${doctor}`,
      };

      setDoctors((prevDoctors) => {
        const updatedDoctors = [...prevDoctors, newDoctor];
        localStorage.setItem('doctors', JSON.stringify(updatedDoctors));
        return updatedDoctors;
      });
    }

    document.getElementById('appointmentForm').reset();
  };

  const handleDoctorSubmit = () => {
    const drId = document.getElementById('drId').value;
    const drName = document.getElementById('drName').value;

    if (!doctors.some(d => d.id === drId)) {
      const newDoctor = {
        id: drId,
        title: drName,
      };

      setDoctors((prevDoctors) => {
        const updatedDoctors = [...prevDoctors, newDoctor];
        localStorage.setItem('doctors', JSON.stringify(updatedDoctors));
        return updatedDoctors;
      });

      const doctorSelect = document.getElementById('doctor');
      const option = document.createElement('option');
      option.value = drId;
      option.text = drName;
      doctorSelect.add(option);
    }

    document.getElementById('drform').reset();
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <button type="button" className="btn btn-info" onClick={() => handleViewChange('dayGridMonth')}>Month View</button>
          <button type="button" className="btn btn-info" onClick={() => handleViewChange('timeGridWeek')}>Week View</button>
          <button type="button" className="btn btn-info" onClick={() => handleViewChange('resourceTimeGridDay')}>Day View</button>
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, resourceTimeGridPlugin, bootstrapPlugin]}
            initialView="resourceTimeGridDay"
            resources={doctors}
            events={events}
            editable
            nowIndicator
            schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
            slotMinTime="08:00:00"
            slotMaxTime="20:00:00"
            minTime="08:00:00"
            maxTime="20:00:00"
            displayEventTime
            displayEventEnd
            themeSystem="bootstrap"
            eventBackgroundColor="#2ecc71"
            eventBorderColor="#27ae60"
            eventTextColor="#ffffff"
            eventColor="#2ecc71"
            eventOverlap={false}
          />
        </div>
      </div>
      <br />
      <div className="row">
        <div className="col-4">
          <form id="drform">
            <h1>Doctor form</h1>
            <div className="form-group">
              <label htmlFor="drId">Dr Id</label>
              <input type="text" className="form-control" id="drId" placeholder="Enter Dr ID" required />
            </div>
            <div className="form-group">
              <label htmlFor="drName">Dr Name</label>
              <input type="text" className="form-control" id="drName" placeholder="Enter Dr Name" required />
            </div>
            <button type="button" className="btn btn-success" onClick={handleDoctorSubmit}>Submit</button>
          </form>
        </div>
        <div className="col-1"></div>
        <div className="col-7">
          <h1>Dr Table</h1>
          <table className="table table-dark" id="drdata">
            <thead>
              <tr>
                <th scope="col">Dr Id</th>
                <th scope="col">Dr Name</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor) => (
                <tr key={doctor.id}>
                  <td>{doctor.id}</td>
                  <td>{doctor.title}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <br />
      <div className="row">
        <div className="col-4">
          <h1>Appointment Form</h1>
          <form id="appointmentForm">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="text" className="form-control" id="email" placeholder="Enter your Email" required />
            </div>
            <div className="form-group">
              <label htmlFor="name">Your Name</label>
              <input type="text" className="form-control" id="name" placeholder="Enter your name" required />
            </div>
            <div className="form-group">
              <label htmlFor="doctor">Choose a Doctor</label>
              <select className="form-control" id="doctor" required>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>{doctor.title}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="appointmentTime">Choose Appointment Time</label>
              <input type="datetime-local" className="form-control" id="appointmentTime" required />
            </div>
            <button type="button" className="btn btn-success" onClick={handleAppointment}>Book Appointment</button>
          </form>
        </div>
        <div className="col-1"></div>
        <div className="col-7">
          <h1>Table Appointment</h1>
          <table className="table table-dark" id="user">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Email</th>
                <th scope="col">Name</th>
                <th scope="col">Appointment Time</th>
                <th scope="col">Doctor Name</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{event.email}</td>
                  <td>{event.title}</td>
                  <td>{event.start}</td>
                  <td>{event.resourceId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
