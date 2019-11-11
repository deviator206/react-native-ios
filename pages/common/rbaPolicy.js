import { default as appConstant } from './consts';

class PolicyProvider {
    constructor() {
        this.policyRules = {};
        this.policyActionMapping = {};
        this.policyActions = {};
        this.currentUserId = "";
        this.currentUserBU = "";
        this.isOwnerOfLead = this.isOwnerOfLead.bind(this);
        this.init = this.init.bind(this);
        this.isAuthorizedForLeadRelatedAction = this.isAuthorizedForLeadRelatedAction.bind(this);
        this.checkRoleMappingActions = this.checkRoleMappingActions.bind(this);
        this.getPolicyVisibility = this.getPolicyVisibility.bind(this);
        this.isActionAllowed = this.isActionAllowed.bind(this);
        this.isAuthorizedForAction = this.isAuthorizedForAction.bind(this);
        this.getCurrentUserId = this.getCurrentUserId.bind(this);
        this.getCurrentBU = this.getCurrentBU.bind(this);
    }
    init() {
        const buHead = {
            "general_bu_lead_view_mode": "show",
            "sales_rep_selection": "show",
            "policy_action_mapping": {
                "ASSIGNED": {
                    "STATUS_UPDATE": "yes",
                    "ASSIGN_SALES_REP": "yes",
                    "BUDGET_UPDATE": "yes",
                    "NOTIFY_BU": "yes",
                    "ADD_MORE_BU": "yes"
                },
                "NOT_ASSIGNED": {
                    "STATUS_UPDATE": "yes",
                    "ASSIGN_SALES_REP": "yes",
                    "BUDGET_UPDATE": "yes",
                    "NOTIFY_BU": "yes",
                    "ADD_MORE_BU": "yes"
                }

            }


        }
        const admin = {
            "report_all_bu_to_all": "show",
            "sales_rep_selection": "show",
            "policy_action_mapping": {
                "ASSIGNED": {
                    "STATUS_UPDATE": "yes",
                    "ASSIGN_SALES_REP": "yes",
                    "BUDGET_UPDATE": "yes",
                    "NOTIFY_BU": "yes",
                    "ADD_MORE_BU": "yes"
                },
                "NOT_ASSIGNED": {
                    "STATUS_UPDATE": "yes",
                    "ASSIGN_SALES_REP": "yes",
                    "BUDGET_UPDATE": "yes",
                    "NOTIFY_BU": "yes",
                    "ADD_MORE_BU": "yes"
                }

            }

        }
        const salesRep = {
            "self_lead_view_mode": "show",
            "policy_action_mapping": {
                "ASSIGNED": {
                    "STATUS_UPDATE": "yes",
                    "ASSIGN_SALES_REP": "yes",
                    "BUDGET_UPDATE": "yes",
                    "NOTIFY_BU": "yes",
                    "ADD_MORE_BU": "yes"
                },
                "NOT_ASSIGNED": {
                    "STATUS_UPDATE": "no",
                    "ASSIGN_SALES_REP": "no",
                    "BUDGET_UPDATE": "yes",
                    "NOTIFY_BU": "yes",
                    "ADD_MORE_BU": "yes"
                }

            }
        }
        this.currentUserId = (window.userInformation &&
            window.userInformation.userInfo &&
            window.userInformation.userInfo.userId) ? window.userInformation.userInfo.userId : "";

        // set the BU
        this.currentUserBU = (window.userInformation &&
            window.userInformation.userInfo &&
            window.userInformation.userInfo.businessUnit) ? window.userInformation.userInfo.businessUnit : "";
        // init post the user information is 
        if (window.userInformation &&
            window.userInformation.userInfo &&
            window.userInformation.userInfo.policies) {
            this.policyRules = window.userInformation.userInfo.policies;

            this.policyActions = window.userInformation.userInfo.policyActions;


            if (window.userInformation.userInfo.roles &&
                window.userInformation.userInfo.roles.indexOf("ADMIN") !== -1) {
                this.policyRules = {
                    ...admin
                }
                this.policyActions = {
                    "ACROSS_BU_ACTIONS_ALLOWED": "yes",
                    "NON_ASSIGNED_ACTIONS_ALLOWED": "yes",
                    "VIEW_STATUS": "yes",
                    "VIEW_ASSIGNED_SALES_REP": "yes",
                    "VIEW_BUDGET": "yes",
                    "VIEW_BU": "yes",
                    "STATUS_UPDATE": "yes",
                    "ASSIGN_SALES_REP": "yes",
                    "BUDGET_UPDATE": "yes",
                    "NOTIFY_BU": "yes",
                    "ADD_MORE_BU": "yes"
                }
            }
            else if (window.userInformation.userInfo.roles &&
                window.userInformation.userInfo.roles.indexOf("BU_HEAD") !== -1) {
                this.policyRules = {
                    ...buHead
                }
            }
            else if (window.userInformation.userInfo.roles &&
                window.userInformation.userInfo.roles.indexOf("SALES_REP") !== -1) {
                this.policyRules = {
                    ...salesRep
                }
            }
        }





        this.policyActionMapping = {};

    }
    getCurrentUserId() {
        return this.currentUserId;
    }

    getCurrentBU() {
        return this.currentUserBU;
    }
    isOwnerOfLead(leadDetails) {
        if (leadDetails &&
            leadDetails.leadsSummaryRes &&
            leadDetails.leadsSummaryRes.salesRepId) {
            return (this.currentUserId === leadDetails.leadsSummaryRes.salesRepId)
        }
    }

    isAuthorizedForLeadRelatedAction(actionName, options) {
        const type = (this.isOwnerOfLead(options.leadDetails)) ? 'ASSIGNED' : 'NOT_ASSIGNED';
        return this.checkRoleMappingActions(actionName, { type });

    }
    isActionAllowed(actionName){
        return (
            this.policyActions && 
            this.policyActions[actionName] &&
            (this.policyActions[actionName]).toUpperCase() === 'YES') ? true:false;
    }
    isAuthorizedForAction(actionName, options) {
        // check if current user is the owner
        let isOwner = false;
        if (options && options.leadDetails) {
            isOwner = this.isOwnerOfLead(options.leadDetails);
        }
        // check if action is allowed
        const actionAllowed = this.isActionAllowed(appConstant.PAGE_ACTION_MAPPING[actionName]);
        // check for nonAssigned
        const nonAssignedAction = this.isActionAllowed(appConstant.PAGE_ACTION_MAPPING[appConstant.PAGE_ACTION_MAPPING.NON_ASSIGNED_ACTIONS_ALLOWED])
        // if owner then return 
        if(isOwner) {
            return actionAllowed ; 
        } 
        console.log(nonAssignedAction , " :2:", actionAllowed);
        return (nonAssignedAction && actionAllowed) ? true: false;
    }

    checkRoleMappingActions(id, options) {
        console.log(this.policyRules.policy_action_mapping[options.type] + " id=" + id + " type=" + options.type);
        if (this.policyRules &&
            this.policyRules["policy_action_mapping"] &&
            this.policyRules.policy_action_mapping[options.type] &&
            this.policyRules.policy_action_mapping[options.type][id] &&
            this.policyRules.policy_action_mapping[options.type][id].toUpperCase() === "YES") {
            console.log("RETURN value = " + this.policyRules.policy_action_mapping[options.type][id].toUpperCase());
            return true;
        }
    }
    getPolicyVisibility(id, options) {
        if (this.policyRules && this.policyRules[id]) {
            return (this.policyRules[id].toUpperCase() === "SHOW");
        }
    }
}

let policyProvider;
if (!window.lms_app_policyProvider) {
    policyProvider = new PolicyProvider();
    window.lms_app_policyProvider = policyProvider;
} else {
    policyProvider = window.lms_app_policyProvider;
}

// Object.freeze(policyProvider)
export default policyProvider;