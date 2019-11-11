import BaseApi from "./BaseApi";
import ServiceClass from "./Services";

class LeadApi extends BaseApi  {
    constructor() {
        super();
    }
    getStats(params) {
        const that = this;
        return new Promise(function (resolve, reject) {
            ServiceClass.postLeadStats(params).then((resp) => {
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

    getStatsReport(params) {
        const that = this;
        return new Promise(function (resolve, reject) {
            ServiceClass.postLeadExtractStats(params).then((resp) => {
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

    updateLead(params) {
        const that = this;
        return new Promise(function (resolve, reject) {
            ServiceClass.postUpdateLead(params).then((resp) => {
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

    searchLeadsWithFilters(filterPayload) {
        const that = this;
        return new Promise(function (resolve, reject) {
            ServiceClass.searchLeadsWithFilters(filterPayload).then((resp) => {
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

    getLeadDetails(params) {
        const that = this;
        return new Promise(function (resolve, reject) {
            ServiceClass.getLeadDetails(params).then((resp) => {
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


    getLeads({params}) {
        const that = this;
        return new Promise(function (resolve, reject) {
            ServiceClass.getLeads(params).then((resp) => {
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

    createLead({ params}) {
        const that = this;
        return new Promise(function (resolve, reject) {
            ServiceClass.createLead(params).then((resp) => {
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

export default LeadApi;