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

    loadAllLeads() {
        this.setState({
            spinner: true
        });
        this.refDataApi.fetchStructuredRefData({params: "type=BU"}).then(this.onReferenceDataFetched);
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
        const { resultSet, referenceData ={}} = this.state;
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
                <FooterComponent  {...this.props} disableView={true} />

                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.filterVisible}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                    }}>
                    <View style={{ width: '100%', height: "100%" }}>
                        <View style={commonStyle.modalHeaderDiv}>
                            <View><Text note style={commonStyle.modalHeader}> Filter View Leads </Text></View>
                            <View>
                                <TouchableHighlight
                                    onPress={() => {
                                        this.filerBtnToggled();
                                    }}>
                                    <Icon name="close" style={commonStyle.modalCloseBtn} />
                                </TouchableHighlight>
                            </View>
                        </View>
                        <View style={{ flex: 1, padding: 20 }}>
                            <Grid style={commonStyle.formGrid}>
                                <Row style={commonStyle.formGridLabel}>
                                    <Col>
                                        <Text note style={commonStyle.labelStyling}>{i18nMessages.status}</Text>
                                    </Col>
                                    <Col>
                                        <Text note style={commonStyle.labelStyling}>{i18nMessages.tenure_lbl}</Text>
                                    </Col>
                                </Row>
                                <Row style={commonStyle.formGridValue}>
                                    <Col>
                                        <Text>Status dropdown</Text>
                                    </Col>
                                    <Col>
                                        <Text>Tenure dropdown</Text>
                                    </Col>
                                </Row>

                                <Row style={commonStyle.formGridLabel}>
                                    <Col>
                                        <Text note style={commonStyle.labelStyling}>{i18nMessages.location}</Text>
                                    </Col>
                                </Row>
                                <Row style={commonStyle.formGridValue}>
                                    <Col><Text>Country AND State dropdown</Text></Col>
                                </Row>


                                <Row style={commonStyle.formGridLabel}>
                                    <Col>
                                        <Text note style={commonStyle.labelStyling}>{i18nMessages.bu_selection}</Text>
                                    </Col>
                                </Row>
                                <Row style={commonStyle.formGridValue}>
                                    <Col><Text>BU and Rep dropdown</Text></Col>
                                </Row>
                                <Row style={commonStyle.formGridLabel}>
                                    <Col>
                                        <Text note style={commonStyle.labelStyling}>{i18nMessages.industry}</Text>
                                    </Col>
                                </Row>
                                <Row style={commonStyle.formGridValue}>
                                    <Col><Text>Industry dropdown</Text></Col>
                                </Row>


                                <Row style={commonStyle.formGridLabel}>
                                    <Col>
                                        <Text note style={commonStyle.labelStyling}>{i18nMessages.source_type}</Text>
                                    </Col>
                                </Row>
                                <Row style={commonStyle.formGridValue}>
                                    <Col><Text>source dropdown</Text></Col>
                                </Row>
                            </Grid>
                        </View>

                        <View style={commonStyle.modalFooter}>
                            <View style={commonStyle.modalButtonContent}>
                                <View style={{ width: "40%" }}>
                                    <TouchableHighlight
                                        onPress={() => { }}>
                                        <Text style={[commonStyle.modalTwoButtons, commonStyle.secondaryButton]}>Reset</Text>
                                    </TouchableHighlight>
                                </View>
                                <View style={{ width: "40%" }}>
                                    <TouchableHighlight
                                        onPress={() => { }}>
                                        <Text style={[commonStyle.modalTwoButtons, commonStyle.primaryButton]}>Apply</Text>
                                    </TouchableHighlight>
                                </View>
                            </View>
                        </View>
                    </View>

                </Modal>

                {this.getSpinnerComponentView()}
            </Container>
        )
    }
}
export default ViewLeadPage;