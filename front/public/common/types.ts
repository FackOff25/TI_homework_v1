export type RequestAnswer = {
    status: number,
    response: any,
}

export type Subscription = {
    element: Element,
    event: string,
    listener: EventListenerOrEventListenerObject
}

export type Equipment = {
    ID: number,
    Name: string,
}

export type EmploeeInfo = {
    ID: string,
    Name: string,
    Surname: string,
    Fathername: string,
}

export type RequestInfo = {
    ID: number,
    Equipment: Equipment,
    Assigner: EmploeeInfo,
    From: Date,
    To: Date,
}

export type Listener = () => any;
