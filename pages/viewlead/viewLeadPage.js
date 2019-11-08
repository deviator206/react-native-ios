import { Button, Col, Container, Content, Grid, Input, Item, Row, Text } from 'native-base';
import React from 'react';
import { View } from 'react-native';
import { default as EntypoIcon } from 'react-native-vector-icons/Entypo';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LeadApi from '../../services/LeadApi';
import RefDataApi from '../../services/RefDataApi';
import { default as commonStyle } from '../common/commonStyling';
import { default as appConstant } from '../common/consts';
import FlatListComponent from '../common/flatListComponent';
import FooterComponent from '../common/footerComponent';
import HeaderComponent from '../common/headerComponent';
import i18nMessages from '../common/i18n';
import SpinnerComponent from '../common/spinnerComponent';
import { default as Utils } from '../common/Util';
import { default as LeadsFilterComponent } from './viewLeadFilterComponent';
import styleContent from './viewLeadStyle';

import { default as RBAPolicy } from '../common/rbaPolicy';

class ViewLeadPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filterVisible: false,
            spinner: false,
        };
        this.leadApi = new LeadApi({ state: {} });
        this.refDataApi = new RefDataApi({ state: {} });
        this.willFocusSubscription = null;
        this.filerBtnToggled = this.filerBtnToggled.bind(this);
        this.getStatusClass = this.getStatusClass.bind(this);
        this.getSpinnerComponentView = this.getSpinnerComponentView.bind(this);
        this.loadAllLeads = this.loadAllLeads.bind(this);

        this.onLeadResponseSuccess = this.onLeadResponseSuccess.bind(this);
        this.onLeadResponseError = this.onLeadResponseError.bind(this);
        this.getStatusCircle = this.getStatusCircle.bind(this);
        this.getLeadContact = this.getLeadContact.bind(this);
        this.onReferenceDataFetched = this.onReferenceDataFetched.bind(this);
        this.triggerFilterBasedSearch = this.triggerFilterBasedSearch.bind(this);
        this.triggerResetFilterBasedSearch = this.triggerResetFilterBasedSearch.bind(this);
        this.validateTheFilter = this.validateTheFilter.bind(this);
        this.prepareInputPayload = this.prepareInputPayload.bind(this);

        this.onSearchButtonClicked = this.onSearchButtonClicked.bind(this);
        this.onSearchTextChange = this.onSearchTextChange.bind(this);

        //making the input same as stats
        this.preparePayloadForStats = this.preparePayloadForStats.bind(this);   
    }

    getSpinnerComponentView() {
        const { spinner } = this.state;

        const loaderView = (<SpinnerComponent />);
        const nonLoaderView = null;
        if (spinner) {
            return loaderView;
        }
        return nonLoaderView;
    }


    filerBtnToggled() {
        const { filterVisible } = this.state;
        console.log(filterVisible);
        this.setState({
            filterVisible: !filterVisible
        });
    }

    onLeadResponseSuccess(resp) {
        this.setState({
            spinner: false,
            resultSet: resp
        });
    }

    onLeadResponseError(error) {
        // console.log(error);
        this.setState({
            spinner: false

        });
    }

    onSearchTextChange(value) {
        this.setState({
            searchInput: value
        })
    }

    onSearchButtonClicked() {
        const { searchInput = '' } = this.state;
        if (searchInput && searchInput !== '') {
            const filterPayload = {
                "searchText": searchInput
            }
            this.triggerFilterBasedSearch(filterPayload)
        }
    }

    onReferenceDataFetched(resp) {
        this.setState({
            referenceData: resp
        });
    }

    getBUInputBasedOnMode(GENERAL_BU_MODE) {
        let fromBU;
        let toBU;
        switch (GENERAL_BU_MODE) {
            case "team_internal":
                fromBU = RBAPolicy.getCurrentBU();
                toBU = RBAPolicy.getCurrentBU();
                break;
            case "team_external":
                fromBU = RBAPolicy.getCurrentBU();
                break;
            case "team_across":
                toBU = RBAPolicy.getCurrentBU()
                break;
            case "self_generated":
                fromBU = RBAPolicy.getCurrentBU();
                toBU = ""
                break;
            case "all":
            default:
                break;
        }
        return { fromBU, toBU };
    }

    getLeadOriginBasedOnSalesRep(SELF_MODE) {
        let payloadInfo = {}
        switch (SELF_MODE) {
            case "both":
                payloadInfo = {
                    "toBU": RBAPolicy.getCurrentBU()
                }
                break;
            case "generated":
                payloadInfo = {
                    "creatorId": RBAPolicy.getCurrentUserId()
                }
                break;
            case "assigned":
                payloadInfo = {
                    "salesRepId": RBAPolicy.getCurrentUserId()
                }
                break;

        }

        return payloadInfo;

    }

    preparePayloadForStats() {
        const {
            ORIGINATOR_BU,
            TARGET_BU,
            SALES_REP,
            START_DATE,
            END_DATE,
            DROP_DOWN_SELF_MODE,
            DROP_DOWN_GENERAL_BU_MODE
        } = this.state;

        let payload = {};
        if (RBAPolicy.getPolicyVisibility("self_lead_view_mode") &&
            SELF_MODE
        ) {
            // Sales REP Dashboard based on  self generated and assigned to me
            payload = {
                ...payload,
                ...Utils.getLeadOriginBasedOnSalesRep(DROP_DOWN_SELF_MODE)
            }

        } else if (RBAPolicy.getPolicyVisibility("general_bu_lead_view_mode") &&
            GENERAL_BU_MODE
        ) {
            // Sales REP Dashboard based on internal , external etc
            const inputBUInfo = Utils.getBUInputBasedOnMode(DROP_DOWN_GENERAL_BU_MODE);
            payload["fromBu"] = inputBUInfo.fromBU;
            payload["toBu"] = inputBUInfo.toBU;
        } else if (ORIGINATOR_BU && 
            ORIGINATOR_BU != '' && 
            ORIGINATOR_BU != "#_ALL_#" &&
            TARGET_BU && 
            TARGET_BU != "#_ALL_#" &&
            TARGET_BU != '') {
            payload["fromBu"] = ORIGINATOR_BU;
            payload["toBu"] = TARGET_BU;
        }

        if (START_DATE && START_DATE != '' && END_DATE && END_DATE != '') {
            payload["startDate"] = Utils.getFormattedDate(START_DATE);
            payload["endDate"] = Utils.getFormattedDate(END_DATE);
        }

        if (SALES_REP && SALES_REP != '' && SALES_REP !== '#_SELECT_REP_#') {
            payload["salesRepId"] = SALES_REP;
        }
        return payload;
    }



    validateTheFilter(inputFilterState) {
        let isChanged = false;
        const newFilterState = {};
        const { filterState = {} } = this.state;
        const { searchText, LEAD_STATUS_DROP_DOWN,
            TENURE, COUNTRY, BU, SOURCE, INDUSTRY } = filterState;

        if (inputFilterState.LEAD_STATUS_DROP_DOWN && LEAD_STATUS_DROP_DOWN !== inputFilterState.LEAD_STATUS_DROP_DOWN) {
            isChanged = true;
            newFilterState['LEAD_STATUS_DROP_DOWN'] = inputFilterState.LEAD_STATUS_DROP_DOWN
        }
        if (inputFilterState.searchText && searchText !== inputFilterState.searchText) {
            isChanged = true;
            newFilterState['searchText'] = inputFilterState.searchText;
        }

        if (inputFilterState.TENURE && TENURE !== inputFilterState.TENURE) {
            isChanged = true;
            newFilterState['TENURE'] = inputFilterState.TENURE;
        }

        if (inputFilterState.COUNTRY && COUNTRY !== inputFilterState.COUNTRY) {
            isChanged = true;
            newFilterState['COUNTRY'] = inputFilterState.COUNTRY;
        }

        if (inputFilterState.BU && BU !== inputFilterState.BU) {
            isChanged = true;
            newFilterState['BU'] = inputFilterState.BU;
        }

        if (inputFilterState.SOURCE && SOURCE !== inputFilterState.SOURCE) {
            isChanged = true;
            newFilterState['SOURCE'] = inputFilterState.SOURCE;
        }
        if (inputFilterState.INDUSTRY && INDUSTRY !== inputFilterState.INDUSTRY) {
            isChanged = true;
            newFilterState['INDUSTRY'] = inputFilterState.INDUSTRY;
        }

        return (isChanged) ? newFilterState : isChanged;
    }

    prepareInputPayload(filterState) {
        const { searchText, LEAD_STATUS_DROP_DOWN,
            TENURE, COUNTRY, BU, SOURCE, INDUSTRY } = filterState;

        let filterPayload = {};

        if (searchText) {
            filterPayload = {
                ...filterPayload,
                searchText: searchText
            };
            filterPayload = Utils.ignoreAttributeFromPayload('searchText', filterPayload);
        }

        if (LEAD_STATUS_DROP_DOWN) {
            filterPayload = {
                ...filterPayload,
                status: LEAD_STATUS_DROP_DOWN
            }
            filterPayload = Utils.ignoreAttributeFromPayload('status', filterPayload);
        }

        if (TENURE) {
            filterPayload = {
                ...filterPayload,
                tenure: TENURE
            }
            filterPayload = Utils.ignoreAttributeFromPayload('tenure', filterPayload);
        }



        if (COUNTRY) {
            filterPayload = {
                ...filterPayload,
                country: COUNTRY
            }
            filterPayload = Utils.ignoreAttributeFromPayload('country', filterPayload);
        }

        if (INDUSTRY) {
            filterPayload = {
                ...filterPayload,
                industry: INDUSTRY
            }
            filterPayload = Utils.ignoreAttributeFromPayload('industry', filterPayload);
        }


        if (SOURCE) {
            filterPayload = {
                ...filterPayload,
                source: SOURCE
            }
            filterPayload = Utils.ignoreAttributeFromPayload('source', filterPayload);
        }

        if (BU) {
            filterPayload = {
                ...filterPayload,
                businessUnits: [BU]
            }
            filterPayload = Utils.ignoreAttributeFromPayloadForArray('businessUnits', filterPayload);
        }

        return filterPayload;
    }

    triggerFilterBasedSearch(ipfilterState) {
        const { filterState = {} } = this.state;
        const validationResponse = this.validateTheFilter(ipfilterState);
        if (typeof (validationResponse) === "object") {
            // console
            const updatedState = {
                ...filterState,
                ...validationResponse
            }

            // prepare input
            const filterPayload = this.prepareInputPayload(updatedState);
            if (Object.keys(filterPayload).length > 0) {
                // invoke rest
                this.leadApi.searchLeadsWithFilters(filterPayload).then(this.onLeadResponseSuccess).catch(this.onLeadResponseError);
                this.setState({
                    filterVisible: false,
                    spinner: true,
                    filterState: {
                        ...updatedState
                    }
                });
            } else {
                this.setState({
                    filterVisible: false,
                    filterState: {
                        ...updatedState
                    }
                });
            }
        }

    }

    triggerResetFilterBasedSearch() {
        this.setState({
            filterVisible: false,
            filterState: {}
        });
        this.loadAllLeads();
    }

    loadAllLeads() {
        const {filterState={}, userId =''} = this.state;
        this.setState({
            spinner: true
        });
        
        this.refDataApi.fetchStructuredRefData({ params: "type=SOURCE,CURRENCY,TENURE,COUNTRY,INDUSTRY,BU" }).then(this.onReferenceDataFetched);
        let params=""
        /*
        if (RBAPolicy.getPolicyVisibility("self_lead_view_mode")) {
            if(filterState['LEAD_STATUS_DROP_DOWN'] && filterState['LEAD_STATUS_DROP_DOWN'] !== ""){
                params=`leadtype=${filterState['LEAD_STATUS_DROP_DOWN']}&userid=${userId}`;
            } else {
                params=`leadtype=both&userid=${userId}`;
            }
        }
        */
        // prepare input
        const filterPayload = this.prepareInputPayload({
                'LEAD_STATUS_DROP_DOWN':'',
                'searchText':'',
                'TENURE':'',
                'COUNTRY':'', 
                'BU':'', 
                'SOURCE':'', 
                'INDUSTRY':''
            }
        );
        this.leadApi.searchLeadsWithFilters(filterPayload).then(this.onLeadResponseSuccess).catch(this.onLeadResponseError)


        
        // this.leadApi.getLeads({ params }).then(this.onLeadResponseSuccess).catch(this.onLeadResponseError)
        // this.props.loadLeads({}).
    }
    componentDidMount() {
        this.setState({
            filterVisible: false
            // ,
            // userId:RBAPolicy.getCurrentUserId()
        });
        this.willFocusSubscription = this.props.navigation.addListener('willFocus', this.loadAllLeads);
    }

    componentWillUnmount() {
        if (this.willFocusSubscription) {
            this.willFocusSubscription.remove();
        }
    }

    getStatusClass(status) {
        if (status && status.toUpperCase() === 'APPROVED') {
            return styleContent.approvedStatus;
        } else if (status && status.toUpperCase() === 'CLOSED') {
            return styleContent.closedStatus;
        } else if (status && status.toUpperCase() === 'PENDING') {
            return styleContent.pendingStatus;
        }
        return styleContent.cardViewSecondaryInfo;

    }

    getStatusCircle(status) {
        if (status === appConstant.LEAD_STATUS.APPROVED) {
            return styleContent.approvedStatusCircle;
        }

        if (status === appConstant.LEAD_STATUS.REJECTED) {
            return styleContent.rejectedStatusCircle;
        }

        if (status === appConstant.LEAD_STATUS.PENDING) {
            return styleContent.pendingStatusCircle;
        }
        return styleContent.needMoreStatusCircle
    }

    getLeadContact(item) {
        if (item.leadContact && item.leadContact.name) {
            return (
                <Col style={styleContent.colValue} >
                    <Text style={styleContent.cardViewPrimaryValue} >:   </Text>
                    <Text style={styleContent.cardViewPrimaryValue} >{item.leadContact && item.leadContact.name}  </Text>
                </Col>
            )
        } else if (item.leadContact && item.leadContact.email) {
            return (
                <Col style={styleContent.colValue} >
                    <Text style={styleContent.cardViewPrimaryValue} >:   </Text>
                    <Text style={styleContent.cardViewPrimaryValue} >{item.leadContact && item.leadContact.email}  </Text>
                </Col>
            )
        } else if (item.leadContact && item.leadContact.phoneNumber) {
            return (
                <Col style={styleContent.colValue} >
                    <Text style={styleContent.cardViewPrimaryValue} >:   </Text>
                    <Text style={styleContent.cardViewPrimaryValue} >{item.leadContact && item.leadContact.phoneNumber}  </Text>
                </Col>
            )
        } else {
            return (
                <Col style={styleContent.colValue} >
                    <Text style={styleContent.cardViewPrimaryValue} >:   </Text>
                    <Text style={styleContent.cardViewPrimaryValue} >{i18nMessages.info_not_sure} </Text>
                </Col>
            )
        }

    }


    getViewLeads() {

        //const { resultSet, onSingleItemCliced , getStatusCircle, getLeadContact} = this.props;
        const { resultSet, referenceData = {} } = this.state;
        return (
            <FlatListComponent
                resultSet={resultSet}
                onSingleItemCliced={(item) => {
                    this.props.navigation.navigate("leaddetails", {
                        leadId: item.id
                    });
                }}
                referenceInfo={referenceData}
                getStatusClass={this.getStatusClass}
                getStatusCircle={this.getStatusCircle}
                getLeadContact={this.getLeadContact}
            />
        )
    }
    render() {
        const { navigation } = this.props;
        const { resultSet, referenceData = {} } = this.state;

        return (
            <Container>
                <HeaderComponent title="View Leads" navigation={navigation} />
                <Content style={styleContent.mainContent}>
                    <View style={{ height: '100%' }}>
                        <Grid >
                            <Row style={styleContent.searchAndFilterWrapper}>
                                <Col style={styleContent.searchBarWrapper} >
                                    <Item searchBar
                                        rounded
                                        style={styleContent.searchBarStyling}>
                                        <Input
                                            placeholder="Search"
                                            style={{
                                                fontSize: 14,
                                                fontFamily: 'Montserrat-Regular',
                                                color: "#616161"
                                            }}
                                            onChangeText={(value) => {
                                                this.onSearchTextChange(value);
                                            }}
                                        />
                                        <Button transparent
                                            onPress={() => {
                                                this.onSearchButtonClicked();
                                            }}
                                        >
                                            <Icon name="search"
                                                style={[styleContent.iconStyling, commonStyle.searchIcon]}
                                            />
                                        </Button>

                                    </Item>
                                </Col>
                                <Col  >
                                    <Button
                                        transparent
                                        onPress={() => {
                                            this.filerBtnToggled();
                                        }


                                        }
                                    >
                                        <EntypoIcon name="sound-mix" style={styleContent.iconStyling} />
                                    </Button>
                                </Col>
                            </Row>
                        </Grid>

                        <Grid style={styleContent.gridWrapper} >
                            {this.getViewLeads()}
                        </Grid>
                    </View>
                </Content>

                <LeadsFilterComponent
                    savedState={this.state.filterState}
                    referenceInfo={referenceData}
                    toggleHandler={this.filerBtnToggled}
                    filterVisible={this.state.filterVisible}
                    applyFilterHandler={this.triggerFilterBasedSearch}
                    resetFilterHandler={this.triggerResetFilterBasedSearch}
                />
                {this.getSpinnerComponentView()}

                <FooterComponent  {...this.props} disableView={true} />
            </Container>
        )
    }
}
export default ViewLeadPage;