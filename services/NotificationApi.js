import BaseApi from "./BaseApi";
import ServiceClass from "./Services";

class NotificationApi extends BaseApi  {
    constructor() {
        super();
    }
   
    getAllMessages({params}) {
        const that = this;
        return new Promise(function (resolve, reject) {
            ServiceClass.getNotificationMessages(params).then((resp) => {
                if (resp && resp.data) {
                    resolve(resp.data)
                } else {
                    that.invalidSuccessRejectResponse(reject,resp);
                }
            }).catch((err) => {
                that.errorHandlerRejectMechanism(reject, err);
            })
        }); 
    }
}

export default NotificationApi;