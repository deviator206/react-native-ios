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
import { default as RBAPolicy } from '../common/rbaPolicy';
import SpinnerComponent from '../common/spinnerComponent';
import { default as Utils } from '../common/Util';
import { default as LeadsFilterComponent } from './viewLeadFilterComponent';
import styleContent from './viewLeadStyle';

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
        let refReference = resp;
        if (refReference[appConstant.DROP_DOWN_TYPE.BU_NAME]) {
            let buReferenced = refReference[appConstant.DROP_DOWN_TYPE.BU_NAME];
            buReferenced.unshift({
                "code": "#_ALL_#",
                "name": "ALL BU",
            });
            refReference[appConstant.DROP_DOWN_TYPE.BU_NAME] = buReferenced;
        }
        this.setState({
            referenceData: refReference
        });
    }






    validateTheFilter(inputFilterState) {
        let isChanged = false;
        const newFilterState = {};
        const { filterState = {} } = this.state;
        const { searchText, LEAD_STATUS_DROP_DOWN,
            TENURE, COUNTRY, BU, SOURCE, INDUSTRY, DROP_DOWN_SELF_MODE, DROP_DOWN_GENERAL_BU_MODE, ORIGINATOR_BU, TARGET_BU } = filterState;

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
        // , DROP_DOWN_GENERAL_BU_MODE, ORIGINATOR_BU, 
        if (inputFilterState.DROP_DOWN_SELF_MODE && DROP_DOWN_SELF_MODE !== inputFilterState.DROP_DOWN_SELF_MODE) {
            isChanged = true;
            newFilterState['DROP_DOWN_SELF_MODE'] = inputFilterState.DROP_DOWN_SELF_MODE;
        }

        if (inputFilterState.DROP_DOWN_GENERAL_BU_MODE && DROP_DOWN_GENERAL_BU_MODE !== inputFilterState.DROP_DOWN_GENERAL_BU_MODE) {
            isChanged = true;
            newFilterState['DROP_DOWN_GENERAL_BU_MODE'] = inputFilterState.DROP_DOWN_GENERAL_BU_MODE;
        }


        if (inputFilterState.ORIGINATOR_BU && ORIGINATOR_BU !== inputFilterState.ORIGINATOR_BU) {
            isChanged = true;
            newFilterState['ORIGINATOR_BU'] = inputFilterState.ORIGINATOR_BU;
        }


        if (inputFilterState.TARGET_BU && TARGET_BU !== inputFilterState.TARGET_BU) {
            isChanged = true;
            newFilterState['TARGET_BU'] = inputFilterState.TARGET_BU;
        }


        return (isChanged) ? newFilterState : isChanged;
    }

    prepareInputPayload(filterState) {
        const { searchText, LEAD_STATUS_DROP_DOWN,
            TENURE, COUNTRY, BU, SOURCE, INDUSTRY, DROP_DOWN_SELF_MODE, DROP_DOWN_GENERAL_BU_MODE, ORIGINATOR_BU, TARGET_BU } = filterState;

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

        /*if (BU) {
            filterPayload = {
                ...filterPayload,
                businessUnits: [BU]
            }
            filterPayload = Utils.ignoreAttributeFromPayloadForArray('businessUnits', filterPayload);
        }*/

        if (RBAPolicy.getPolicyVisibility("self_lead_view_mode") &&
            DROP_DOWN_SELF_MODE
        ) {
            // Sales REP Dashboard based on  self generated and assigned to me
            filterPayload = {
                ...filterPayload,
                ...Utils.getLeadOriginBasedOnSalesRep(DROP_DOWN_SELF_MODE)
            }

        } else if (RBAPolicy.getPolicyVisibility("general_bu_lead_view_mode") &&
            DROP_DOWN_GENERAL_BU_MODE
        ) {
            // Sales REP Dashboard based on internal , external etc
            filterPayload = {
                ...filterPayload,
                ...Utils.getBUInputBasedOnMode(DROP_DOWN_GENERAL_BU_MODE)
            }
        } else {
            if (ORIGINATOR_BU &&
                ORIGINATOR_BU != '' &&
                ORIGINATOR_BU != "#_ALL_#") {
                filterPayload["fromBu"] = ORIGINATOR_BU;

            }
            if (TARGET_BU &&
                TARGET_BU != "#_ALL_#" &&
                TARGET_BU != '') {
                filterPayload["toBu"] = TARGET_BU;
            }
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
        const { filterState = {}, userId = '' } = this.state;
        this.setState({
            spinner: true
        });

        this.refDataApi.fetchStructuredRefData({ params: "type=SOURCE,CURRENCY,TENURE,COUNTRY,INDUSTRY,BU" }).then(this.onReferenceDataFetched);
        let params = ""

        let basicInput = {
            'LEAD_STATUS_DROP_DOWN': '',
            'searchText': '',
            'TENURE': '',
            'COUNTRY': '',
            'BU': '',
            'SOURCE': '',
            'INDUSTRY': ''
        }
        if (RBAPolicy.getPolicyVisibility("self_lead_view_mode")

        ) {
            // Sales REP Dashboard based on  self generated and assigned to me
            basicInput = {
                ...basicInput,
                DROP_DOWN_SELF_MODE: appConstant.SELF_MODE[0].code

            }

        } else if (RBAPolicy.getPolicyVisibility("general_bu_lead_view_mode")

        ) {
            // Sales REP Dashboard based on internal , external etc
            basicInput = {
                ...basicInput,
                DROP_DOWN_GENERAL_BU_MODE: appConstant.GENERAL_BU_MODE[0].code
            }
        }

        // prepare input
        const filterPayload = this.prepareInputPayload(basicInput);

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
        this.willFocusSubscription = this.props.navigation.addListener('didFocus', this.loadAllLeads);
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