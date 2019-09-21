import ServiceClass from "./Services";
import BaseApi from "./BaseApi";

class MarketIntelligenceApi extends BaseApi  {
    constructor() {
        super();
    }

    updateMI(params) {
        return new Promise(function (resolve, reject) {
            ServiceClass.postUpdateMI(params).then((resp) => {
                if (resp && resp.data) {
                    resolve(resp.data)
                } else {
                    this.invalidSuccessRejectResponse(reject,resp);
                }
            }).catch((err) => {
                this.errorHandlerRejectMechanism(reject, err);
            })
        });
    }

    getMIDetails(params) {
        return new Promise(function (resolve, reject) {
            ServiceClass.getMIDetails(params).then((resp) => {
                if (resp && resp.data) {
                    resolve(resp.data)
                } else {
                    this.invalidSuccessRejectResponse(reject,resp);
                }
            }).catch((err) => {
                this.errorHandlerRejectMechanism(reject, err);
            })
        });
    }


    getMI({ params }) {
        return new Promise(function (resolve, reject) {
            ServiceClass.getMI(params).then((resp) => {
                if (resp && resp.data) {
                    resolve(resp.data)
                } else {
                    this.invalidSuccessRejectResponse(reject,resp);
                }
            }).catch((err) => {
                this.errorHandlerRejectMechanism(reject, err);
            })
        });
    }

    searchMIList(filterPayload) {
        return new Promise(function (resolve, reject) {
            ServiceClass.searchMIList(filterPayload).then((resp) => {
                if (resp && resp.data) {
                    resolve(resp.data)
                } else {
                    this.invalidSuccessRejectResponse(reject,resp);
                }
            }).catch((err) => {
                this.errorHandlerRejectMechanism(reject, err);
            })
        });
    }

    createNewMI({ params }) {
        return new Promise(function (resolve, reject) {
            console.log(params)
            ServiceClass.createNewMI(params).then((resp) => {
                if (resp && resp.data) {
                    resolve(resp.data)
                } else {
                    this.invalidSuccessRejectResponse(reject,resp);
                }
            }).catch((err) => {
                this.errorHandlerRejectMechanism(reject, err);
            })
        });
    }
}

export default MarketIntelligenceApi;