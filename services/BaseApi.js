
import { default as i18nMessages } from '../pages/common/i18n';

class BaseApi {
    constructor() {}

    errorHandlerMechanism(errorHandler, serverResponse) {
        if (serverResponse && 
            serverResponse.response && 
            serverResponse.response.data && 
            errorHandler &&
            serverResponse.response.data.error
            ) {
            const localizedMessages = i18nMessages['ERROR_MSG_' + (serverResponse.response.data.error).toUpperCase()]
            if (localizedMessages) {
                errorHandler({message:localizedMessages})
            } else {
                errorHandler({message:i18nMessages['ERROR_MSG_UNKNOWN_RESPONSE']});
            }
            
        } else if(errorHandler) {
            errorHandler({message:i18nMessages['ERROR_MSG_UNKNOWN_RESPONSE']})
        } else {
            console.error("VALIDATE THE RESPONSE",serverResponse)
        }
    }

    invalidSuccessResponse (serverResponse) {
        console.error("VALIDATE THE RESPONSE",serverResponse)
    }

    invalidSuccessRejectResponse (reject, serverResponse) {
        console.error("VALIDATE THE RESPONSE",serverResponse);
        reject({ message: "RESPONSE IS NOT AS EXPECTED", error: "INVALID" });
    }


    errorHandlerRejectMechanism(errorHandler, serverResponse) {
        if (serverResponse && 
            serverResponse.response && 
            serverResponse.response.data && 
            errorHandler &&
            serverResponse.response.data.error
            ) {
            const localizedMessages = i18nMessages['ERROR_MSG_' + (serverResponse.response.data.error).toUpperCase()]
            if (localizedMessages) {
                errorHandler({message:localizedMessages})
            } else {
                errorHandler({message:i18nMessages['ERROR_MSG_UNKNOWN_RESPONSE']});
            }
            
        } else if(errorHandler) {
            errorHandler({message:i18nMessages['ERROR_MSG_UNKNOWN_RESPONSE']})
        } else {
            console.error("VALIDATE THE RESPONSE",serverResponse)
        }
    }

}
export default BaseApi;