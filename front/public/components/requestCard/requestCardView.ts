import "../tmpl/requestCard.tmpl.js";
import BasicComponentView from "../_basicComponent/basicComponentView.js";
import { EmploeeInfo, Equipment, RequestInfo } from "../../common/types.js";

export type RequestCardInfo = {
    info?: RequestInfo,
    emploees: EmploeeInfo[],
    equipment: Equipment[],
}

/**
 * @class RequestCardView
 */
export default class RequestCardView extends BasicComponentView {

    render(info: RequestCardInfo): HTMLElement {
        const wrapper = document.createElement('div');
        const isNewRequest : boolean = info.info === undefined;
        const sign = isNewRequest ? "Новый Запрос" : "Редактировать";

        const today: string = (new Date()).toISOString().split("T")[0];
        console.log(JSON.stringify(info?.info?.Equipment.ID));
        // @ts-expect-error TS(2304): Cannot find name 'Handlebars'.
        wrapper.innerHTML = Handlebars.templates['requestCard.html']({
            sign: sign,
            emploees: info.emploees,
            equipment: info.equipment,
            to: info?.info?.To.toISOString().split("T")[0],
            from: info?.info?.From.toISOString().split("T")[0],
            min_from_date_value: isNewRequest ? today : undefined,
            max_from_date_value: info?.info?.To.toISOString().split("T")[0],
            min_to_date_value: isNewRequest ? today : info?.info?.From.toISOString().split("T")[0],
            max_to_date_value: undefined,
        });

        let selectedOption: number = 0;
        for(let i = 0; i < info.emploees.length; ++i){
            if (info.emploees[i].ID === info?.info?.Assigner.ID){
                selectedOption = i;
                break;
            }
        };
        (wrapper.querySelector("#emploee_form") as HTMLSelectElement).selectedIndex = selectedOption;

        for(let i = 0; i < info.equipment.length; ++i){
            if (info.equipment[i].ID === info?.info?.Equipment.ID){
                selectedOption = i;
                break;
            }
        };
        (wrapper.querySelector("#equipment_form") as HTMLSelectElement).selectedIndex = selectedOption;

        return wrapper.querySelector('div')!;
    }
}
