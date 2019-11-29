const appconstant = {
    version: "0.0.1",
    primaryBlue: "#44C1EE",
    primaryRed: "#EC2227",
    primaryOrange: "#F37C57",
    primaryGreen: "#8BBF45",
    mediumGrey: "#616161",
    GENERAL_BU_MODE: [
        {
            name: "All",
            code: "all"
        },
        {
            name: "Team Internal",
            code: "team_internal"
        },
        {
            name: "Team External",
            code: "team_external"
        },
        {
            name: "Across ",
            code: "team_across"
        }, {
            name: "Self Generated",
            code: "self_generated"
        }
    ],
    SELF_MODE: [
        {
            name: "Assigned To My BU",
            code: "both"
        },
        {
            name: "Self Generated",
            code: "generated"
        }, {
            name: "Assigned To Me",
            code: "assigned"
        }],

    DROP_DOWN_TYPE: {
        TENURE: 'TENURE',
        SOURCE: 'SOURCE',
        CURRENCY: 'CURRENCY',
        INDUSTRY: 'INDUSTRY',
        COUNTRY: 'COUNTRY',
        BU_NAME: 'BU',
        STATE: 'STATE',
        SALES_REP: 'SALES_REP',
        LEAD_STATUS: 'LEAD_STATUS'
    },
    LEAD_STATUS: {
        APPROVED: 'APP',
        REJECTED: 'REJ',
        PENDING: 'DRAFT',
        NEED_MORE: 'NMI'
    },
    DECODED_LEAD_STATUS: {
        APP: 'Approved',
        REJ: 'Rejected',
        DRAFT: 'Pending',
        NMI: 'Need More Info',
    },
    UPDATE_LEAD: {
        BUDGET: 'BUDGET',
        ASSIGN_REP: 'ASSIGN_REP',
        MODIFY_BU: 'MODIFY_BU',
        NOTIFY_BU: 'NOTIFY_BU',
        NOTIFY_TEXT: 'NOTIFY_TEXT'
    },
    MI_STATUS: {
        CLOSED: 'CLOSED',
        OPEN: 'OPEN'
    },
    MI_TYPE_CONST: {
        PROJECT: 'PROJECT',
        INVESTMENT: 'INVESTMENT',
        NEWSITEM: 'NEWSITEM'
    },
    LEAD_STATUS_DROP_DOWN: [
        {
            name: 'APPROVED',
            code: 'APP'
        },
        {
            name: 'REJECTED',
            code: 'REJ'
        }, {
            name: 'PENDING',
            code: 'DRAFT'
        },
        {
            name: 'NEED_MORE',
            code: 'NMI'
        }
    ],
    MI_STATUS_DROP_DOWN: [
        {
            name: 'Open For Discussion',
            code: 'open'
        },
        {
            name: 'Converted to Lead',
            code: 'closed'
        }
    ],
    MI_TYPE: [
        {
            name: 'Project',
            code: 'project'
        },
        {
            name: 'Investment',
            code: 'investment'
        },
        {
            name: 'News Item',
            code: 'newsitem'
        }
    ],
    MI_INFO: {
        ADD_MORE_INFO: 'ADD_MORE_INFO',
        CONVERT_TO_LEAD: 'CONVERT_TO_LEAD',
        CTL_CUSTOMER_NAME: 'CTL_CUSTOMER_NAME',
        CTL_REQUIREMENT: 'CTL_REQUIREMENT',
    },
    USER_TYPE_RADIO_GROUP: [
        {
            "name": "Sales Rep",
            "code": "SR"
        },
        {
            "name": "Buniess Head",
            "code": "BH"
        },
        {
            "name": "Business Development",
            "code": "BD"
        }
    ],
    ROLES_USER_TYPE_MAPPING: {
        "SR": "SALES_REP",
        "BD": "ADMIN",
        "BH": "BU_HEAD"
    },
    PAGE_ACTION_MAPPING: {
        "ACROSS_BU_ACTIONS_ALLOWED": "ACROSS_BU_ACTIONS_ALLOWED",
        "NON_ASSIGNED_ACTIONS_ALLOWED": "NON_ASSIGNED_ACTIONS_ALLOWED",
        "VIEW_STATUS": "VIEW_STATUS",
        "VIEW_ASSIGNED_SALES_REP": "VIEW_ASSIGNED_SALES_REP",
        "VIEW_BUDGET": "VIEW_BUDGET",
        "VIEW_BU": "VIEW_BU",
        "STATUS_UPDATE": "STATUS_UPDATE",
        "ASSIGN_SALES_REP": "ASSIGN_SALES_REP",
        "BUDGET_UPDATE": "BUDGET_UPDATE",
        "NOTIFY_BU": "NOTIFY_BU",
        "ADD_MORE_BU": "ADD_MORE_BU"
    }

}

export default appconstant;