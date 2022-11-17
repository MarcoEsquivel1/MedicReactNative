export const mapPatient = (patient: any) => ({
    id: patient.id,
    doctor_id: patient.doctor_id,
    name: patient.name,
    phone: patient.phone,
    dni: patient.dni,
    birthday: patient.birthday
})