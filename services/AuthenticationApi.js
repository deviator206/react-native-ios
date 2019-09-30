import ServiceClass from "./Services";
import BaseApi from "./BaseApi";
class AuthenticationApi  extends BaseApi {
    constructor() {
        super();
    }

    forgotPasswordApi({ payload, successHandler, errorHandler }) {
        ServiceClass.postForgotPassword({payload}).then((resp) => {
            if (resp && resp.data && successHandler) {
                ServiceClass.updateHeaderInformation(resp.data);
                successHandler(resp.data);
            } else {
                this.invalidSuccessResponse(resp);
            }
        }).catch((err) => {
            this.errorHandlerMechanism(errorHandler, err);
        })
    }


    proceedLoginApi({ params, successHandler, errorHandler }) {
        ServiceClass.loginService(params).then((resp) => {
            if (resp && resp.data && successHandler) {
                ServiceClass.updateHeaderInformation(resp.data);
                successHandler(resp.data);
            } else {
                this.invalidSuccessResponse(resp);
            }
        }).catch((err) => {
          this.errorHandlerMechanism(errorHandler, err);
        })
    }
}

export default AuthenticationApi;