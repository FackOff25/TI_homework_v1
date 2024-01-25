export type Emploee = {
    code?: number,
    name: string,
    surname: string,
    fathername: string,
}

export type EqRequest = {
    id?: number,
    assigner: number,
    equipment: number,
    date_from: string,
    date_to: string,
}