
import {default as i18nMessages} from '../pages/common/i18n';

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
            alert("VALIDATE THE RESPONSE",serverResponse)
        }
    }

}
export default BaseApi;