import ServiceClass from "./Services";
import BaseApi from "./BaseApi";


class RefDataApi extends BaseApi {
    constructor({ state }) {
        super();
        this.reducerName = 'ref_data';
        this.fetchRefData = this.fetchRefData.bind(this);
    }

    fetchStructuredRefData({ params }) {
        return new Promise(function (resolve, reject) {
            ServiceClass.getRefData(params).then((resp) => {
                if (resp && resp.data) {
                    const refInfo = {};
                    resp.data.forEach((element) => {
                        if (element && element.type) {
                            if (!refInfo[element.type]) {
                                refInfo[element.type] = [];
                            }
                            refInfo[element.type].push(element);
                        }
                    });
                    resolve(refInfo);
                } else {
                    this.invalidSuccessRejectResponse(reject, resp);
                }
            }).catch((err) => {
                if (err && err.response && err.response.data) {
                    this.errorHandlerRejectMechanism(reject, err.data);
                } else {
                    this.errorHandlerRejectMechanism(reject, err);
                }
            })
        });

    }


    fetchRefData({ params }) {
        return new Promise(function (resolve, reject) {
            ServiceClass.getRefData(params).then((resp) => {
                if (resp && resp.data) {
                    resolve(resp);
                } else {
                    this.invalidSuccessRejectResponse(reject, resp);
                }
            }).catch((err) => {
                if (err && err.response && err.response.data) {
                    this.errorHandlerRejectMechanism(reject, err.data);
                } else {
                    this.errorHandlerRejectMechanism(reject, err);
                }
            })
        });

    }
}

export default RefDataApi;