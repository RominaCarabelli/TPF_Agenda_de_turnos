import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faSpa,
  faWallet,
  faPhone,
  faCommentDots,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";

import "./App.css";

const initialForm = {
  name: "",
  service: "",
  date: "",
  time: "",
  deposit: "no",
  phone: "",
  comments: "",
};

const services = [
  "Clásicas",
  "Efecto húmedo",
  "Efecto rímel",
  "Efecto anime",
  "Lifting de pestañas",
];

const statuses = ["Pendiente", "Confirmado", "Completado", "Cancelado"];

function App() {
  const [appointments, setAppointments] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("appointments")) || [];
    } catch {
      return [];
    }
  });

  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [expandedIds, setExpandedIds] = useState([]);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);

  useEffect(() => {
    localStorage.setItem("appointments", JSON.stringify(appointments));
  }, [appointments]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (editingId !== null) {
      setAppointments((previousAppointments) =>
        previousAppointments.map((appointment) =>
          appointment.id === editingId
            ? { ...appointment, ...form }
            : appointment
        )
      );

      setEditingId(null);
    } else {
      const newAppointment = {
        ...form,
        id: crypto.randomUUID(),
        status: "Pendiente",
      };

      setAppointments((previousAppointments) => [
        ...previousAppointments,
        newAppointment,
      ]);
    }

    setForm(initialForm);
  };

  const editAppointment = (appointment) => {
    if (appointment.status === "Completado") return;

    setForm({
      name: appointment.name,
      service: appointment.service,
      date: appointment.date,
      time: appointment.time,
      deposit: appointment.deposit,
      phone: appointment.phone,
      comments: appointment.comments || "",
    });

    setEditingId(appointment.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEditing = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const changeStatus = (id, newStatus) => {
    setAppointments((previousAppointments) =>
      previousAppointments.map((appointment) => {
        if (appointment.id !== id || appointment.status === "Completado") {
          return appointment;
        }

        return { ...appointment, status: newStatus };
      })
    );
  };
  
  const deleteAppointment = (id) => {
    const appointment = appointments.find((item) => item.id === id);

    if (!appointment) return;

    setAppointmentToDelete(appointment);
  };

  const confirmDeleteAppointment = () => {
    if (!appointmentToDelete) return;

    const id = appointmentToDelete.id;

    setAppointments((previousAppointments) =>
      previousAppointments.filter((item) => item.id !== id)
    );

    setExpandedIds((previousIds) =>
      previousIds.filter((itemId) => itemId !== id)
    );

    if (editingId === id) {
      cancelEditing();
    }

    setAppointmentToDelete(null);
  };

  const toggleDetails = (id) => {
    setExpandedIds((previousIds) =>
      previousIds.includes(id)
        ? previousIds.filter((itemId) => itemId !== id)
        : [...previousIds, id]
    );
  };

  const formatDate = (date) => {
    if (!date) return "Fecha no disponible";

    return new Date(`${date}T12:00:00`).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const statusClass = (status) =>
    status.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const filteredAppointments = appointments
    .filter(
      (appointment) =>
        statusFilter === "Todos" || appointment.status === statusFilter
    )
    .sort((a, b) =>
      `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`)
    );

  const completedCount = appointments.filter(
    (appointment) => appointment.status === "Completado"
  ).length;

  const pendingCount = appointments.filter(
    (appointment) => appointment.status === "Pendiente"
  ).length;

  return (
    <main className="app">
      <header className="app-header">
        <h1>Mumi Lashes</h1>
        <p>AGENDA DE TURNOS</p>
        <span className="header-heart">♥</span>
      </header>

      <section className="task-panel form-panel">
        <div className="content-container">
          <div className="panel-heading">
            <h2>{editingId !== null ? "Editar turno" : "Nuevo turno"}</h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <label>
                Nombre de la clienta
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Nombre y apellido"
                  required
                />
              </label>

              <label>
                Servicio
                <select
                  name="service"
                  value={form.service}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccioná un servicio</option>
                  {services.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Fecha
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Horario
                <input
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Seña abonada
                <select
                  name="deposit"
                  value={form.deposit}
                  onChange={handleChange}
                  required
                >
                  <option value="no">Pendiente</option>
                  <option value="si">Abonada</option>
                </select>
              </label>

              <label>
                Teléfono de contacto
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Ej. 11 1234-5678"
                  required
                />
              </label>

              <label className="full-width">
                Comentarios
                <textarea
                  name="comments"
                  value={form.comments}
                  onChange={handleChange}
                  placeholder="Alergias, preferencias u otras observaciones..."
                  rows="3"
                />
              </label>
            </div>

            <div className="form-actions">
              <button className="primary-button" type="submit">
                {editingId !== null ? "Guardar cambios" : "Agendar turno"}
              </button>

              {editingId !== null && (
                <button
                  className="secondary-button"
                  type="button"
                  onClick={cancelEditing}
                >
                  Cancelar edición
                </button>
              )}
            </div>
          </form>
        </div>
      </section>

      <section className="task-panel list-panel">
        <div className="content-container">
          <div className="panel-heading">
            <h2>Turnos agendados</h2>
          </div>

          <div className="filters">
            <label htmlFor="statusFilter">Filtrar por estado</label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="Todos">Todos los turnos</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {filteredAppointments.length === 0 ? (
            <div className="empty-state">
              <h3>
                {appointments.length === 0
                  ? "Todavía no hay turnos"
                  : "No hay turnos con este estado"}
              </h3>
              <p>
                {appointments.length === 0
                  ? "Cuando agendes una cita, va a aparecer acá."
                  : "Probá seleccionar otro filtro para ver tus turnos."}
              </p>
            </div>
          ) : (
            <div className="appointments-list">
              {filteredAppointments.map((appointment) => {
                const isExpanded = expandedIds.includes(appointment.id);
                const isCompleted = appointment.status === "Completado";

                return (
                  <article className="appointment-card" key={appointment.id}>
                    <div className="appointment-summary">
                      <h3>{appointment.name}</h3>

                      <span
                        className={`status-badge ${statusClass(
                          appointment.status
                        )}`}
                      >
                        {appointment.status}
                      </span>

                      <button
                        type="button"
                        className="text-button"
                        onClick={() => toggleDetails(appointment.id)}
                        aria-expanded={isExpanded}
                      >
                        {isExpanded ? "Ocultar detalles −" : "Ver detalles +"}
                      </button>
                      
                      {isCompleted && (
                        <button
                          type="button"
                          className="icon-delete-button"
                          onClick={() => deleteAppointment(appointment.id)}
                          aria-label={`Eliminar turno de ${appointment.name}`}
                          title="Eliminar turno"
                        >
                          <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                      )}
                    </div>

                    {isExpanded && (
                      <div className="appointment-expanded">
                        <div className="appointment-details">
                          <div className="detail-item">
                            <span className="detail-icon">
                              <FontAwesomeIcon icon={faCalendarDays} />
                            </span>
                            <div>
                              <p className="detail-label">Fecha y horario</p>
                              <p className="detail-value">
                                {formatDate(appointment.date)} · {appointment.time}
                              </p>
                            </div>
                          </div>

                          <div className="detail-item">
                            <span className="detail-icon">
                              <FontAwesomeIcon icon={faSpa} />
                            </span>
                            <div>
                              <p className="detail-label">Servicio</p>
                              <p className="detail-value">{appointment.service}</p>
                            </div>
                          </div>

                          <div className="detail-item">
                            <span className="detail-icon">
                              <FontAwesomeIcon icon={faCommentDots} />
                            </span>
                            <div>
                              <p className="detail-label">Comentarios</p>
                              <p className="comment-note">
                                {appointment.comments?.trim() ||
                                  "Sin comentarios adicionales."}
                              </p>
                            </div>
                          </div>

                          <div className="detail-item">
                            <span className="detail-icon">
                              <FontAwesomeIcon icon={faWallet} />
                            </span>
                            <div>
                              <p className="detail-label">Seña</p>
                              <p className="detail-value">
                                {appointment.deposit === "si"
                                  ? "Seña abonada"
                                  : "Seña pendiente"}
                              </p>
                            </div>
                          </div>

                          <div className="detail-item">
                            <span className="detail-icon">
                              <FontAwesomeIcon icon={faPhone} />
                            </span>
                            <div>
                              <p className="detail-label">Contacto</p>
                              <p className="detail-value">
                                {appointment.phone || "No indicado"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {isCompleted ? (
                          <p className="completed-message">
                            Servicio realizado exitosamente
                          </p>
                        ) : (
                          <div className="card-actions">
                            <div className="status-control">
                              <label htmlFor={`status-${appointment.id}`}>Estado</label>

                              <select
                                id={`status-${appointment.id}`}
                                className="status-select"
                                value={appointment.status}
                                onChange={(event) =>
                                  changeStatus(appointment.id, event.target.value)
                                }
                              >
                                {statuses.map((status) => (
                                  <option key={status} value={status}>
                                    {status}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="action-buttons">
                              <button
                                type="button"
                                className="secondary-button small-button"
                                onClick={() => editAppointment(appointment)}
                              >
                                Editar
                              </button>

                              <button
                                type="button"
                                className="delete-button"
                                onClick={() => deleteAppointment(appointment.id)}
                              >
                                Eliminar
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}

          <footer className="appointments-footer">
            <p>
              <strong>{appointments.length}</strong>{" "}
              {appointments.length === 1 ? "turno en total" : "turnos en total"}
            </p>
            <p>
              <strong>{pendingCount}</strong>{" "}
              {pendingCount === 1 ? "pendiente" : "pendientes"}
            </p>
            <p>
              <strong>{completedCount}</strong>{" "}
              {completedCount === 1 ? "completado" : "completados"}
            </p>
          </footer>
      </div>
    </section>

    {appointmentToDelete && (
      <div
        className="delete-modal-overlay"
        onClick={() => setAppointmentToDelete(null)}
      >
        <div
          className="delete-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-modal-title"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="delete-modal-icon">
            <FontAwesomeIcon icon={faTrashCan} />
          </div>

          <h2 id="delete-modal-title">¿Eliminar turno?</h2>

          <p>
            ¿Estás segura de que querés eliminar este turno?
            Esta acción no se puede deshacer.
          </p>

          <div className="delete-modal-actions">
            <button
              type="button"
              className="delete-modal-cancel"
              onClick={() => setAppointmentToDelete(null)}
            >
              Cancelar
            </button>

            <button
              type="button"
              className="delete-modal-confirm"
              onClick={confirmDeleteAppointment}
            >
              Sí, eliminar
            </button>
          </div>
        </div>
      </div>
    )}
  </main>
);
}
export default App;