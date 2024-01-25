import {Ajax} from "./ajax.js";
import {
    EmploeeInfo,
    Equipment,
    RequestInfo
} from "../common/types";

const config = {
    hrefs: {
        emploeeList: '/queries/emploee/get/all',
        emploeeGet: '/queries/emploee/get/',
        emploeeAdd: '/queries/emploee/add',
        emploeeDelete: '/queries/emploee/delete',
        emploeeUpdate: '/queries/emploee/update',
        equipmentList: '/queries/equipment/get/all',
        requestList: '/queries/request/get/list/',
        requestAdd: '/queries/request/add',
        requestDelete: '/queries/request/delete',
        requestUpdate: '/queries/request/update',
    }
}

const ajax = new Ajax();

export class Requests {
    /**
     * Запрашивает Сотрудников
     */
    static getEmploees(): Promise<EmploeeInfo[]> {
        return ajax.get({
            url: config.hrefs.emploeeList,
        }).then((response) => {
            const result = response!;
            if (result.status !== 200) {
                throw result.status;
            }
            const emploees: EmploeeInfo[] = [];
            result.response.emploees.forEach((emploee: 
                {
                    code: number,
                    name: string,
                    surname: string,
                    fathername: string,
                }) => {
                emploees.push({
                    ID: "" + emploee.code,
                    Name: emploee.name,
                    Surname: emploee.surname,
                    Fathername: emploee.fathername
                })
            });;
            return emploees;
        });
    }

    /**
     * Запрашивает Сотрудника
     */
    static getEmploee(code: number): Promise<EmploeeInfo> {
        return ajax.get({
            url: config.hrefs.emploeeGet + code,
        }).then((response) => {
            const result = response!;
            if (result.status !== 200) {
                throw result.status;
            }
            const emploee: EmploeeInfo = {
                ID: result.response.emploee.code,
                Name: result.response.emploee.name,
                Surname: result.response.emploee.surname,
                Fathername: result.response.emploee.fathername,
            };
            
            return emploee;
        });
    }

    /**
     * Добавляет Сотрудника
     */
    static addEmploee(emploee: EmploeeInfo): Promise<void> {
        return ajax.post({
            url: config.hrefs.emploeeAdd,
            data: {
                name: emploee.Name,
                surname: emploee.Surname,
                fathername: emploee.Fathername,
            }
        }).then((response) => {
            const result = response!;
            if (result.status !== 200) {
                throw result.status;
            }
        });
    }

    /**
     * Удаляет Сотрудника
     */
    static deleteEmploee(code: number): Promise<void> {
        return ajax.post({
            url: config.hrefs.emploeeDelete,
            data: {
                code: code,
            }
        }).then((response) => {
            const result = response!;
            if (result.status !== 200) {
                throw result.status;
            }
        });
    }

    /**
     * Обновляет Сотрудника
     */
    static updateEmploee(emploee: EmploeeInfo): Promise<void> {
        return ajax.post({
            url: config.hrefs.emploeeUpdate,
            data: {
                code: emploee.ID,
                name: emploee.Name,
                surname: emploee.Surname,
                fathername: emploee.Fathername,
            }
        }).then((response) => {
            const result = response!;
            if (result.status !== 200) {
                throw result.status;
            }
        });
    }

    /**
     * Запрашивает Оборудование
     */
        static getEquipment(): Promise<Equipment[]> {
            return ajax.get({
                url: config.hrefs.equipmentList,
            }).then((response) => {
                const result = response!;
                if (result.status !== 200) {
                    throw result.status;
                }
                const equipmentList: Equipment[] = [];
                result.response.equipment.forEach((equipment: 
                    {
                        id: number,
                        name: string,
                    }) => {
                    equipmentList.push({
                        ID: equipment.id,
                        Name: equipment.name,
                    })
                });;
                return equipmentList;
            });
        }

    /**
     * Запрашивает Запросы (ba-dums)
     */
    static getRequests(code: number): Promise<RequestInfo[]> {
        return ajax.get({
            url: config.hrefs.requestList + code,
        }).then((response) => {
            const result = response!;
            if (result.status !== 200) {
                throw result.status;
            }
            const requests: RequestInfo[] = [];
            result.response.requests.forEach((request: 
                {
                    id: number,
                    equipment: number,
                    date_from: string,
                    date_to: string,
                    name: string,
                }) => {
                requests.push({
                    ID: request.id,
                    Assigner: {
                        ID: "" + code,
                        Name: "",
                        Surname: "",
                        Fathername: ""
                    },
                    Equipment: {
                        ID: request.equipment,
                        Name: request.name,
                    },
                    From: new Date(request.date_from),
                    To: new Date(request.date_to),
                })
            });;
            return requests;
        });
    }

    /**
     * Добавляет Запрос
     */
    static addRequest(request: RequestInfo): Promise<void> {
        return ajax.post({
            url: config.hrefs.requestAdd,
            data: {
                equipment: request.Equipment.ID,
                assigner: request.Assigner.ID,
                date_from: request.From.toLocaleDateString('sv'),
                date_to: request.To.toLocaleDateString('sv'),
            }
        }).then((response) => {
            const result = response!;
            if (result.status !== 200) {
                throw result.status;
            }
        });
    }

    /**
     * Удаляет Запрос
     */
    static deleteRequest(id: number): Promise<void> {
        return ajax.post({
            url: config.hrefs.requestDelete,
            data: {
                id: id,
            }
        }).then((response) => {
            const result = response!;
            if (result.status !== 200) {
                throw result.status;
            }
        });
    }

    /**
     * Обновляет Запрос
     */
    static updateRequest(request: RequestInfo): Promise<void> {
        return ajax.post({
            url: config.hrefs.requestUpdate,
            data: {
                id: request.ID,
                equipment: request.Equipment.ID,
                assigner: request.Assigner.ID,
                date_from: request.From.toLocaleDateString('sv'),
                date_to: request.To.toLocaleDateString('sv'),
            }
        }).then((response) => {
            const result = response!;
            if (result.status !== 200) {
                throw result.status;
            }
        });
    }
}
