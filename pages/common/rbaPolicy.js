
class PolicyProvider {
    constructor() {
        this.policyRules = {};
    }
    init() {
        // init post the user information is 
        if (window.userInformation && window.userInformation.userInfo && window.userInformation.userInfo.policies) {
            this.policyRules = window.userInformation.userInfo.policies;
        }
        const buHead = {
            "general_bu_lead_view_mode":"show",
            
            
        }
        const admin = {
            "report_all_bu_to_all": "show",
            "sales_rep_selection": "show",
            
        }
        const salesRep = {
            "self_lead_view_mode": "show"
        }
        this.policyRules = {
            ...salesRep
        }
    }
    getPolicyVisibility(id, options) {
        if (this.policyRules && this.policyRules[id]) {
            return (this.policyRules[id].toUpperCase() === "SHOW");
        }
    }
}

const policyProvider = new PolicyProvider();
// Object.freeze(policyProvider)
export default policyProvider;