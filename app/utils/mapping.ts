export const mapPatient = (patient: any) => ({
    id: patient.id,
    doctor_id: patient.doctor_id,
    name: patient.name,
    phone: patient.phone,
    dni: patient.dni,
    birthday: patient.birthday
})

export const mapAppointment = (appointment: any) => ({
    id: appointment.id,
    doctor_id: appointment.doctor_id,
    patient_id: appointment.patient_id,
    date: appointment.date,
    time: appointment.time,
    comment: appointment.comment,
    done: appointment.done
})