import BasicComponent from "../_basicComponent/basicComponent.js";
import {Listener, Subscription} from "../../common/types";
import RequestCardView, { RequestCardInfo } from "./requestCardView.js";
import { Queries } from "../../modules/queries.js";
import { Events } from "../../modules/events.js";

export type RequestCardEventBus = {
    closeEvent: Listener,
}

/**
 * ViewModel-компонент соответсвующего View
 * @class RequestCard
 */
export default class RequestCard extends BasicComponent {
    view: RequestCardView;
    data: RequestCardInfo;

    constructor(info: RequestCardInfo) {
        super();
        this.view = new RequestCardView();
        this.data = info;
    }

    render(): HTMLElement {
        this.root = this.view.render(this.data);
        return this.root;
    }

    subscribe(eventBus: RequestCardEventBus): void {
        let subscription: Subscription;

        const assignerInput = (this.root.querySelector('#emploee_form')! as HTMLSelectElement);
        const equipmentInput = (this.root.querySelector('#equipment_form')! as HTMLSelectElement);
        const dateFromInput = (this.root.querySelector('#request_card__from_date')! as HTMLInputElement);
        const dateToInput = (this.root.querySelector('#request_card__to_date')! as HTMLInputElement);
        
        const closeButton = this.root.querySelector('#request_card__cross')!;
        subscription = {
            element: closeButton,
            event: 'click',
            listener: eventBus.closeEvent,
        }
        this._subscribeEvent(subscription);
        
        const submitButton = this.root.querySelector('#request_card__submit_button')!;
        let submitEvent: Listener;
        if (this.data.info === undefined) {
            submitEvent = () => {
                const assigner = assignerInput.options[assignerInput.selectedIndex].getAttribute("data-em-id")!;
                const equipment = equipmentInput.options[equipmentInput.selectedIndex].getAttribute("data-eq-id")!;
                const dateFrom = dateFromInput.value;
                const dateTo = dateToInput.value;

                let invalid = false;
                if (dateFrom === "") {
                    Events.makeInvalid(dateFromInput, "Выберите начало срока заявки");
                    invalid = true;
                } else {
                    Events.makeValid(dateFromInput);
                }
                if (dateTo === "") {
                    Events.makeInvalid(dateToInput, "Выберите конец срока заявки");
                    invalid = true;
                } else {
                    Events.makeValid(dateToInput);
                }
                if (invalid) {
                    return;
                }

                Queries.addRequest({
                    ID: 0,
                    Assigner: {
                        ID: assigner,
                        Name: "",
                        Surname: "",
                        Fathername: ""
                    },
                    Equipment: {
                        ID: parseInt(equipment),
                        Name: ""
                    },
                    From: new Date(dateFrom),
                    To: new Date(dateTo),
                }).then(() => {
                    Events.openAlertMessage("Запрос успешно добавлен", "ОК", () => {
                        eventBus.closeEvent();
                        window.location.reload();
                    });
                }).catch((err) => {
                    console.log(err);
                    if (err === 403){
                        Events.openAlertMessage("Время заявки пересекается с другой заявкой на это оборудование", "ОК", Events.closeAlertMessage);
                    }else{
                        Events.openAlertMessage("Не удалось добавить запрос", "ОК", Events.closeAlertMessage);
                    }
                })
            };
        }else{
            submitEvent = () => {
                const assigner = assignerInput.options[assignerInput.selectedIndex].getAttribute("data-em-id")!;
                const equipment = equipmentInput.options[equipmentInput.selectedIndex].getAttribute("data-eq-id")!;
                const dateFrom = dateFromInput.value;
                const dateTo = dateToInput.value;

                Queries.updateRequest({
                    ID: this.data.info!.ID,
                    Assigner: {
                        ID: assigner,
                        Name: "",
                        Surname: "",
                        Fathername: ""
                    },
                    Equipment: {
                        ID: parseInt(equipment),
                        Name: ""
                    },
                    From: new Date(dateFrom),
                    To: new Date(dateTo),
                }).then(() => {
                    Events.openAlertMessage("Запрос успешно обновлён", "ОК", () => {
                        eventBus.closeEvent();
                        window.location.reload();
                    });
                }).catch((err) => {
                    if (err === 403){
                        Events.openAlertMessage("Время заявки пересекается с другой заявкой на это оборудование", "ОК", Events.closeAlertMessage);
                    }else{
                        Events.openAlertMessage("Не удалось обновить запрос", "ОК", Events.closeAlertMessage);
                    }
                })
            };
        }

        subscription = {
            element: submitButton,
            event: 'click',
            listener: submitEvent,
        }
        this._subscribeEvent(subscription);

        subscription = {
            element: dateFromInput,
            event: 'change',
            listener: () => {
                dateToInput.setAttribute("min", dateFromInput.value);
            },
        }
        this._subscribeEvent(subscription);

        subscription = {
            element: dateToInput,
            event: 'change',
            listener: () => {
                dateFromInput.setAttribute("max", dateToInput.value);
            },
        }
        this._subscribeEvent(subscription);
    }
}
