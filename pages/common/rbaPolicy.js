
class PolicyProvider {
    constructor() {
        this.policyRules = {};
        this.policyActionMapping = {};
        this.isOwnerOfLead = this.isOwnerOfLead.bind(this);
        this.init = this.init.bind(this);
        this.isAuthorizedForLeadRelatedAction = this.isAuthorizedForLeadRelatedAction.bind(this);
        this.checkRoleMappingActions = this.checkRoleMappingActions.bind(this);
        this.getPolicyVisibility = this.getPolicyVisibility.bind(this);
    }
    init() {
        // init post the user information is 
        if (window.userInformation && window.userInformation.userInfo && window.userInformation.userInfo.policies) {
            this.policyRules = window.userInformation.userInfo.policies;
        }
        /**
         * 
         * 
         */
        const buHead = {
            "general_bu_lead_view_mode": "show"


        }
        const admin = {
            "report_all_bu_to_all": "show",
            "sales_rep_selection": "show"

        }
        const salesRep = {
            "self_lead_view_mode": "show",
            "policy_action_mapping": {
                "ASSIGNED":{
                    "STATUS_UPDATE": "yes",
                    "ASSIGN_SALES_REP": "yes",
                    "BUDGET_UPDATE":"yes",
                    "NOTIFY_BU": "yes",
                    "ADD_MORE_BU": "yes"
                },
                "NOT_ASSIGNED":{
                    "STATUS_UPDATE": "no",
                    "ASSIGN_SALES_REP": "no",
                    "BUDGET_UPDATE":"yes",
                    "NOTIFY_BU": "yes",
                    "ADD_MORE_BU": "yes"
                }

            }
        }
        this.policyRules = {
            ...salesRep
        }

        this.policyActionMapping = {};
    }
    isOwnerOfLead(leadDetails) {
        if(leadDetails && 
            leadDetails.leadsSummaryRes &&
            leadDetails.leadsSummaryRes.salesRepId) {
                const userId = (window.userInformation &&
                    window.userInformation.userInfo &&
                    window.userInformation.userInfo.userId) ? window.userInformation.userInfo.userId : "";
    
                return (userId === leadDetails.leadsSummaryRes.salesRepId)
            } 
    }

    isAuthorizedForLeadRelatedAction(actionName, options) {
        const type =  (this.isOwnerOfLead(options.leadDetails)) ? 'ASSIGNED': 'NOT_ASSIGNED';
        return this.checkRoleMappingActions(actionName,{type});

    }
    
    checkRoleMappingActions(id, options) {
        if (this.policyRules && 
            this.policyRules["policy_action_mapping"] &&
            this.policyRules.policy_action_mapping[options.type] &&
            this.policyRules.policy_action_mapping[options.type] && 
            this.policyRules.policy_action_mapping[options.type][id].toUpperCase() === "YES") {
            return true;
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