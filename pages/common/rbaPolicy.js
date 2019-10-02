
class PolicyProvider {
    constructor() {
        this.policyRules = {};
        this.policyActionMapping ={};
    }
    init() {
        // init post the user information is 
        if (window.userInformation && window.userInformation.userInfo && window.userInformation.userInfo.policies) {
            this.policyRules = window.userInformation.userInfo.policies;
        }
        /**
         * "policy_action_mapping":{
                    "same_bu_modify_others_assigned_lead":"yes",
                    "same_bu_modify_non_assigned_lead":"yes"
                
            }
         * 
         */
        const buHead = {
            "general_bu_lead_view_mode":"show"
            
            
        }
        const admin = {
            "report_all_bu_to_all": "show",
            "sales_rep_selection": "show"
            
        }
        const salesRep = {
            "self_lead_view_mode": "show"
        }
        this.policyRules = {
            ...salesRep
        }

        this.policyActionMapping ={};
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