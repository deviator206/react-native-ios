import ServiceClass from "./Services";
import BaseApi from "./BaseApi";

class UserApi extends BaseApi {
    constructor() {
        super();
    }

    createUser(params) {
        const that = this;
        return new Promise(function (resolve, reject) {
            ServiceClass.createNewUser(params).then((resp) => {
                resolve({"status":"YES"});
            }).catch((err) => {
                that.errorHandlerRejectMechanism(reject, err);
            })
        }); 
    }

    getUserList(params) {
        const that = this;
        return new Promise(function (resolve, reject) {
            ServiceClass.getUsers(params).then((resp) => {
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

export default UserApi;