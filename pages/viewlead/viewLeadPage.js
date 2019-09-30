import { Button, Card, CardItem, Col, Container, Content, Grid, Input, Item, Row, Text } from 'native-base';
import React from 'react';
import { Alert, FlatList, Modal, TouchableHighlight, View } from 'react-native';
import { default as EntypoIcon } from 'react-native-vector-icons/Entypo';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LeadApi from '../../services/LeadApi';
import RefDataApi from '../../services/RefDataApi';
import { default as commonStyle } from '../common/commonStyling';
import { default as appConstant } from '../common/consts';
import FooterComponent from '../common/footerComponent';
import HeaderComponent from '../common/headerComponent';
import i18nMessages from '../common/i18n';
import SpinnerComponent from '../common/spinnerComponent';
import FlatListComponent from '../common/flatListComponent';
import styleContent from './viewLeadStyle';
import { default as LeadsFilterComponent } from './viewLeadFilterComponent';



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
    onReferenceDataFetched(resp) {
        this.setState({
            referenceData: resp
        });
    }
    triggerFilterBasedSearch(ipfilterState) {
    }

    triggerResetFilterBasedSearch() {
        this.setState({
            filterVisible: false,
            filterState: {}
        });
        this.loadAllLeads();
    }

    loadAllLeads() {
        this.setState({
            spinner: true
        });
        this.refDataApi.fetchStructuredRefData({ params: "type=BU" }).then(this.onReferenceDataFetched);
        this.leadApi.getLeads({ params: {} }).then(this.onLeadResponseSuccess).catch(this.onLeadResponseError)
        // this.props.loadLeads({}).
    }
    componentDidMount() {
        this.setState({
            filterVisible: false
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
                                        />
                                        <Icon name="search" style={styleContent.iconStyling} />
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