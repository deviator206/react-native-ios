import ServiceClass from "./Services";
import BaseApi from "./BaseApi";

class MarketIntelligenceApi extends BaseApi  {
    constructor() {
        super();
    }

    updateMI(params) {
        const that = this;
        return new Promise(function (resolve, reject) {
            ServiceClass.postUpdateMI(params).then((resp) => {
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

    getMIDetails(params) {
        const that = this;
        return new Promise(function (resolve, reject) {
            ServiceClass.getMIDetails(params).then((resp) => {
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


    getMI({ params }) {
        const that = this;
        return new Promise(function (resolve, reject) {
            ServiceClass.getMI(params).then((resp) => {
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

    searchMIList(filterPayload) {
        const that = this;
        return new Promise(function (resolve, reject) {
            ServiceClass.searchMIList(filterPayload).then((resp) => {
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

    createNewMI({ params }) {
        const that = this;
        return new Promise(function (resolve, reject) {
            console.log(params)
            ServiceClass.createNewMI(params).then((resp) => {
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

export default MarketIntelligenceApi;