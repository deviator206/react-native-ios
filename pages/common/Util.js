import { default as RBAPolicy } from '../common/rbaPolicy';

const utilities = {
    getBUInputBasedOnMode : (GENERAL_BU_MODE) => {
        let fromBu;
        let toBu;
        switch (GENERAL_BU_MODE) {
            case "team_internal":
                fromBu = RBAPolicy.getCurrentBU();
                toBu = RBAPolicy.getCurrentBU();
                break;
            case "team_external":
                fromBu = RBAPolicy.getCurrentBU();
                break;
            case "team_across":
                toBu = RBAPolicy.getCurrentBU()
                break;
            case "self_generated":
                fromBu = RBAPolicy.getCurrentBU();
                toBu = ""
                break;
            case "all":
            default:
                break;
        }
        return { fromBu, toBu };
    },
    getLeadOriginBasedOnSalesRep: (SELF_MODE) => {
        let payloadInfo = {}
        switch (SELF_MODE) {
            case "both":
                payloadInfo = {
                    "toBU": RBAPolicy.getCurrentBU()
                }
                break;
            case "generated":
                payloadInfo = {
                    "creatorId": RBAPolicy.getCurrentUserId()
                }
                break;
            case "assigned":
                payloadInfo = {
                    "salesRepId": RBAPolicy.getCurrentUserId()
                }
                break;

        }

        return payloadInfo;

    },

    getFormattedDate : (newDate = new Date()) =>{
        let month = newDate.getUTCMonth()+1;
        if(month< 10) {
            month = `0${month}`;
        }
        
        let day = newDate.getUTCDate();
        if(day< 10) {
            day = `0${day}`;
        }

        return newDate.getUTCFullYear()+"-"+month+"-"+day;
    },
    getFormattedUnit:(currentUnit, referenceInfo, type)=>{
        let displayUnit = currentUnit;
        if(referenceInfo && referenceInfo[type] && referenceInfo[type].length) {
            referenceInfo[type].forEach(singleBU => {
                if(currentUnit === singleBU.code) {
                    displayUnit = singleBU.name
                }
            });
        }
        return displayUnit; 
    },
    ignoreAttributeFromPayload:(attr, payload, checkVal = "all") => {
        if(payload[`${attr}`] === checkVal){
            delete payload[`${attr}`];
        }
        return payload;
    },
    ignoreAttributeFromPayloadForArray:(attr, payload, checkVal = "all") => {
        if(payload[`${attr}`][0] === checkVal){
            delete payload[`${attr}`];
        }
        return payload;
    }

}
export default utilities