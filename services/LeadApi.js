import ServiceClass from "./Services";
import BaseApi from "./BaseApi";

class LeadApi extends BaseApi  {
    constructor() {
        super();
    }
    getStats(params) {
        return new Promise(function (resolve, reject) {
            ServiceClass.postLeadStats(params).then((resp) => {
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

    updateLead(params) {
        return new Promise(function (resolve, reject) {
            ServiceClass.postUpdateLead(params).then((resp) => {
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

    searchLeadsWithFilters(filterPayload) {
        return new Promise(function (resolve, reject) {
            ServiceClass.searchLeadsWithFilters(filterPayload).then((resp) => {
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

    getLeadDetails(params) {
        return new Promise(function (resolve, reject) {
            ServiceClass.getLeadDetails(params).then((resp) => {
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


    getLeads({params}) {
        return new Promise(function (resolve, reject) {
            ServiceClass.getLeads(params).then((resp) => {
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

    createLead({ params}) {
        return new Promise(function (resolve, reject) {
            ServiceClass.createLead(params).then((resp) => {
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

export default LeadApi;