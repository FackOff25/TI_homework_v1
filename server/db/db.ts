import pg from 'pg';
import { Emploee, EqRequest } from './types';

export type DB_CONFIG = {
    host: string,
    port: number,
    name: string,
    login: string,
    password: string,
}

export default class DB {
    #dateString(date: Date): string{
        return date.toLocaleDateString('sv');
    }

    #dbClient: pg.Client | null = null;
    #dbHost = '';
    #dbPort = 5432;
    #dbName = '';
    #dbLogin = '';
    #dbPassword = '';

    constructor(conf: DB_CONFIG){
        this.#dbHost = conf.host;
        this.#dbPort = conf.port;
        this.#dbName = conf.name;
        this.#dbLogin = conf.login;
        this.#dbPassword = conf.password;

        this.#dbClient = new pg.Client({
            user: this.#dbLogin,
            password: this.#dbPassword,
            host: this.#dbHost,
            port: this.#dbPort,
            database: this.#dbName,
        });
    }

    async connect() {
        try {
            await this.#dbClient?.connect();
            console.log('Connected to DB');
        } catch (error) {
            console.error('DB error: ', error);
            return Promise.reject(error);
        }
    }

    async disconnect() {
        await this.#dbClient?.end();
        console.log('Disconnected from DB');
    }

    //
    // Emploee Block
    //
    async getEmploees(): Promise<any[] | undefined>{
        try {
            const emploees = await this.#dbClient?.query(
                'select code, name, surname, fathername from emploee;'
            )
            return emploees?.rows;
        } catch (error) {
            console.error(error);
        }
    }

    async getEmploee(code: number): Promise<any | undefined>{
        try {
            const emploee = await this.#dbClient?.query(
                `select code, name, surname, fathername from emploee where code=${code};`
            )
            if (emploee?.rows.length === 0){
                throw "Not Found"
            }
            return emploee?.rows[0];
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
    }
    
    async addEmploee(emploee: Emploee): Promise<void>{
        try {
            const result = await this.#dbClient?.query(
                `insert into emploee(surname, name, fathername) values('${emploee.surname}', '${emploee.name}', '${emploee.fathername}');`
            )
            return Promise.resolve();
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
    }

    async deleteEmploee(code: number): Promise<void>{
        try {
            const result = await this.#dbClient?.query(
                `delete from emploee where code=${code};`
            )
            return Promise.resolve();
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
    }

    async updateEmploee(emploee: Emploee): Promise<void>{
        if (emploee.code === undefined) {
            return Promise.reject("no code");
        }
        try {
            const result = await this.#dbClient?.query(
                `update emploee set name = '${emploee.name}', surname = '${emploee.surname}', fathername = '${emploee.fathername}' where code=${emploee.code};`
            )
            return Promise.resolve();
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
    }

    //
    // End of emploee Block
    //

    //
    // Equipment Block
    //
    async getEquipment(): Promise<any[] | undefined>{
        try {
            const requests = await this.#dbClient?.query(
                `select id, name from equipment;`
            )
            return requests?.rows;
        } catch (error) {
            console.error(error);
        }
    }

    //
    // End of equipment Block
    //

    //
    // Request Block
    //
    async getRequests(code: number): Promise<any[] | undefined>{
        try {
            const requests = await this.#dbClient?.query(
                `select request.id, request.equipment, request.date_from, request.date_to, equipment.name from request join equipment on request.equipment=equipment.id where assigner=${code};`
            )
            return requests?.rows;
        } catch (error) {
            console.error(error);
        }
    }

    async getRequestsByEquipment(id: number): Promise<any[] | undefined>{
        try {
            const requests = await this.#dbClient?.query(
                `select id, equipment, date_from, date_to from request where equipment=${id};`
            )
            return requests?.rows;
        } catch (error) {
            console.error(error);
        }
    }

    async getRequest(id: number): Promise<any | undefined>{
        try {
            const request = await this.#dbClient?.query(
                `select id, assigner, equipment, date_from, date_to from emploee where id=${id};`
            )
            return request?.rows[0];
        } catch (error) {
            console.error(error);
        }
    }
    
    async addRequest(request: EqRequest): Promise<void>{
        try {
            const result = await this.#dbClient?.query(
                `insert into request(assigner, equipment, date_from, date_to) values(${request.assigner}, ${request.equipment}, '${request.date_from}', '${request.date_to}');`
            )
            return Promise.resolve();
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
    }

    async deleteRequest(id: number): Promise<void>{
        try {
            const result = await this.#dbClient?.query(
                `delete from request where id=${id};`
            )
            return Promise.resolve();
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
    }

    async updateRequest(request: EqRequest): Promise<void>{
        if (request.id === undefined) {
            return Promise.reject("no id");
        }
        try {
            const result = await this.#dbClient?.query(
                `update request set assigner = ${request.assigner}, equipment = ${request.equipment}, date_from = '${request.date_from}', date_to = '${request.date_to}' where id=${request.id};`
            )
            return Promise.resolve();
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
    }

    //
    // End of request Block
    //
}