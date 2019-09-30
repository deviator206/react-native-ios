const utilities = {
    getFormattedDate : (newDate = new Date()) =>{
        let month = newDate.getUTCMonth()+1;
        if(month< 10) {
            month = `0${month}`;
        }
        
        let day = newDate.getUTCDay();
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