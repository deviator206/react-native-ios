import { Button, Col, Container, Content, Footer, Grid, Row, Text, Textarea, View } from 'native-base';
import React from 'react';
import { FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MarketIntelligenceApi from '../../services/MarketIntelligenceApi';
import CheckBoxComponent from '../common/checkBoxComponent';
import { default as commonStyle } from '../common/commonStyling';
import { default as appConstant } from '../common/consts';
import DropDownComponent from '../common/dropdownComponent';
import FlatListComponent from '../common/flatListComponent';
import HeaderComponent from '../common/headerComponent';
import i18nMessages from '../common/i18n';
import ModalComponent from '../common/modalComponent';
import SpinnerComponent from '../common/spinnerComponent';
import styleContent from './miDetailsPageStyle';
import { default as MiInfoListComponent } from './miInfoListComponent';

const marketIntelligenceApi = new MarketIntelligenceApi({ state: {} });


export default class MiDetailsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filterVisible: false
        };

        this.getDropdownFor = this.getDropdownFor.bind(this);
        this.onDropDownChange = this.onDropDownChange.bind(this);
        this.onInputTextChanged = this.onInputTextChanged.bind(this);

        this.initiateMICreation = this.initiateMICreation.bind(this);

        this.onSuccessHandler = this.onSuccessHandler.bind(this);
        this.onErrorHandler = this.onErrorHandler.bind(this);
        this.overlayScreenView = this.overlayScreenView.bind(this);
        this.onFPModalClosed = this.onFPModalClosed.bind(this);
        this.getSpinnerComponentView = this.getSpinnerComponentView.bind(this);

        this.loadDetail = this.loadDetail.bind(this);
        this.onResponseSuccess = this.onResponseSuccess.bind(this);
        this.onResponseError = this.onResponseError.bind(this);


        this.getStatusStyle = this.getStatusStyle.bind(this);
        this.getListedInfo = this.getListedInfo.bind(this);
        this.onCheckBoxChanged = this.onCheckBoxChanged.bind(this);

        this.showMoreInfoMessagesClicked = this.showMoreInfoMessagesClicked.bind(this);

        this.hideMoreInfoMessagesClicked = this.hideMoreInfoMessagesClicked.bind(this);

        this.viewMoreButton = this.viewMoreButton.bind(this);

        this.loadMIDetail = this.loadMIDetail.bind(this);
        this.updateMarketIntelligence = this.updateMarketIntelligence.bind(this);
        this.isActionsAllowed = this.isActionsAllowed.bind(this);


    }
    updateMarketIntelligence(inputPayload) {
        return marketIntelligenceApi.updateMI(inputPayload).then((resp) => {
            return resp;
        })
    }
    loadMIDetail(inputParams) {
        return marketIntelligenceApi.getMIDetails(inputParams).then((resp) => {
            return resp;
        })

    }


    onResponseError() {
        this.setState({
            spinner: false
        });
    }
    onResponseSuccess(resp) {
        this.setState({
            spinner: false,
            miDetails: resp,
            ADD_MORE_INFO: false,
            INPUT_ADD_MORE_INFO: ''
        });
    }

    showMoreInfoMessagesClicked() {
        const { miDetails } = this.state;
        const fullSet = (miDetails && miDetails.miInfoList) ? miDetails.miInfoList : [];
        this.setState({
            filterVisible: true,
            filterState: {
                infoList: fullSet
            }
        });
    }

    hideMoreInfoMessagesClicked() {
        this.setState({
            filterVisible: false,
            filterState: {}
        });
    }

    loadDetail() {
        const { navigation } = this.props;
        const itemId = navigation.getParam('miId', 'NO-ID');
        this.setState({
            spinner: true,
            ADD_MORE_INFO: false,
        });
        this.loadMIDetail({ itemId }).then(this.onResponseSuccess).catch(this.onResponseError);
    }


    onCheckBoxChanged({ type, value }) {
        this.setState({
            [type]: value
        });
    }

    getStatusStyle(status) {
        if (status === appConstant.MI_STATUS.CLOSED) {
            return styleContent.closedStatus;
        }
        return styleContent.pendingStatus;
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



    onFPModalClosed() {
        this.props.navigation.goBack();
    }


    onSuccessHandler(resp) {
        this.setState({
            ADD_MORE_INFO: false,
            INPUT_ADD_MORE_INFO: ''
        });
        this.loadDetail();
    }

    onErrorHandler(resp) {
        this.setState({
            spinner: false
        });
    }

    overlayScreenView() {
        const { showOverlay = false } = this.state;

        const loaderView = (
            <ModalComponent
                modalTitle="Thank You!"
                showSecondaryForgotPassword={false}
                showSecondaryInput={false}
                modalPrimaryText="Info has been added successfully"
                showHeaderCloseBtn={false}
                onCloseCallBackhandler={this.onFPModalClosed}
                showRegularModalButton={true}
                regularModalButtonLabel="Navigate To Previous Screen"
            />
        );
        const nonLoaderView = null;
        if (showOverlay) {
            return loaderView;
        }
        return nonLoaderView;
    }

    initiateMICreation() {
        const {
            ADD_MORE_INFO,
            INPUT_ADD_MORE_INFO,
            CONVERT_TO_LEAD,
            INPUT_CTL_CUSTOMER_NAME,
            INPUT_CTL_REQUIREMENT

        } = this.state;

        let hasInfoUpdated = false;
        
        const { navigation } = this.props;
        const itemId = navigation.getParam('miId', 'NO-ID');
        let payload = {
            "id": itemId
        };
        if (ADD_MORE_INFO && INPUT_ADD_MORE_INFO) {
            hasInfoUpdated = true;
            
            const userId = (window.userInformation &&
                window.userInformation.userInfo &&
                window.userInformation.userInfo.userId) ? window.userInformation.userInfo.userId : "";


            payload["miInfoList"] = [
                {
                    "info": INPUT_ADD_MORE_INFO,
                    "creatorId": userId
                }
            ]
        } else if (
            CONVERT_TO_LEAD &&
            INPUT_CTL_CUSTOMER_NAME  &&
            INPUT_CTL_REQUIREMENT 
        ) {
            this.props.navigation.navigate("addlead", {
                INPUT_CTL_CUSTOMER_NAME: INPUT_CTL_CUSTOMER_NAME,
                INPUT_CTL_REQUIREMENT: INPUT_CTL_REQUIREMENT,
                miId: itemId
            });
            return;
        }

        if (hasInfoUpdated) {
            this.setState({
                spinner: true
            });

            this.updateMarketIntelligence({
                itemId,
                payload
            }).then(this.onSuccessHandler).catch(this.onErrorHandler);
        }



    }

    onInputTextChanged(type, value) {
        this.setState({
            ['INPUT_' + type]: value
        });
    }

    onDropDownChange({ type, value }) {
        this.setState({
            [type]: value
        });
    }

    getDropdownFor(type) {
        let returnedView = null;
        let dataSource = [];
        dataSource = (appConstant.MI_TYPE) ? appConstant.MI_TYPE : [];
        returnedView = <DropDownComponent
            dataSource={dataSource}
            updateToParent={this.onDropDownChange}
            dropDownType={type}
            showAttribute='name'
            returnAttribute='code'
        />;
        return returnedView;

    }




    componentDidMount() {
        this.setState({
            filterVisible: false
        });

        this.willFocusSubscription = this.props.navigation.addListener('willFocus', this.loadDetail);

    }




    getListedInfo() {
        const { miDetails } = this.state;
        const fullSet = (miDetails && miDetails.miInfoList) ? miDetails.miInfoList : [];
        let resultSet = [];
        if (fullSet.length > 1) {
            resultSet = [...fullSet.slice(0, 2)];
        } else {
            resultSet = [...fullSet];
        }
        let returnedView;
        if (resultSet.length > 0) {
            returnedView = (
                <FlatList
                    data={resultSet}
                    style={{ height: "auto" }}
                    renderItem={({ item }) =>
                        <Row
                            style={styleContent.gridCardWrapper}
                            button
                            onPress={() => {
                                // item.id

                            }}
                        >

                            <Col>
                                <Grid>
                                    {MiInfoListComponent.getCardView(item)}
                                </Grid>
                            </Col>
                        </Row>
                    }
                >

                </FlatList>
            );
        }
        return returnedView;
    }


    viewMoreButton() {
        const { miDetails } = this.state;
        const fullSet = (miDetails && miDetails.miInfoList) ? miDetails.miInfoList : [];
        const resultSet = [];
        if (fullSet.length > 2) {
            return <View>
                <Button
                    transparent
                    onPress={this.showMoreInfoMessagesClicked}
                >
                    <Text>View More</Text>
                </Button>

            </View>
        }
        return null;
    }

    isActionsAllowed() {
        const { miDetails = {} } = this.state;
        const { status = '' } = miDetails;
        return (status.toUpperCase() != 'CLOSED') ? true : false;
    }

    render() {

        const { ADD_MORE_INFO = false, CONVERT_TO_LEAD = false, miDetails } = this.state;
        const { navigation } = this.props;
        const itemId = navigation.getParam('miId', 'NO-ID');
        return (
            <Container style={styleContent.container}>
                <HeaderComponent navigation={navigation} title="Market Intelligence" />
                <Content style={styleContent.mainContent}>

                    <Grid style={[commonStyle.gridWrapper, {
                        marginLeft: "10%"
                    }]}>

                        {
                            miDetails && miDetails.id &&
                            FlatListComponent.getMIListing(miDetails, { getStatusClass: this.getStatusStyle })
                        }
                    </Grid>

                    <Grid style={[styleContent.gridWrapper, {
                        height: "auto"
                    }]} >
                        <Row><Col><Text style={commonStyle.labelStyling} > Information : </Text></Col></Row>

                        {this.getListedInfo()}

                    </Grid>




                    <Grid style={{ marginTop: 10 }}>
                        <Row>
                            {this.viewMoreButton()}
                        </Row>

                        {
                            this.isActionsAllowed() && (<Row><Col><Text style={commonStyle.labelStyling} > Actions:  </Text></Col></Row>)
                        }
                        {this.isActionsAllowed() &&
                            (<Row>
                                <Col style={{ marginLeft: 10 }}>
                                    <CheckBoxComponent
                                        currentState={ADD_MORE_INFO}
                                        checkBoxLabel={i18nMessages.lbl_mi_info_add_more_info}
                                        controlType={appConstant.MI_INFO.ADD_MORE_INFO}
                                        updateToParent={this.onCheckBoxChanged}
                                    />
                                </Col>
                            </Row>)
                        }
                        {this.isActionsAllowed() && ADD_MORE_INFO && (
                            <Row>
                                <Col>
                                    <Textarea
                                        style={commonStyle.dynamicComponentTextAreaStyle}
                                        rowSpan={4}
                                        bordered
                                        placeholder="Lorem Ipsum is sim"
                                        onChangeText={(text) => {
                                            this.onInputTextChanged(appConstant.MI_INFO.ADD_MORE_INFO, text);
                                        }}
                                    />
                                </Col>
                            </Row>
                        )}

                        {this.isActionsAllowed() &&
                            (<Row style={{ marginTop: 15 }}>
                                <Col style={{ marginLeft: 10 }}>
                                    <CheckBoxComponent
                                        currentState={CONVERT_TO_LEAD}
                                        checkBoxLabel={i18nMessages.lbl_mi_info_convert_to_lead}
                                        controlType={appConstant.MI_INFO.CONVERT_TO_LEAD}
                                        updateToParent={this.onCheckBoxChanged}
                                    />
                                </Col>
                            </Row>)
                        }
                        {this.isActionsAllowed() && CONVERT_TO_LEAD && (
                            <Row>
                                <Col style={styleContent.marginHorizontalRow}>
                                    <Text style={commonStyle.darkLabelStyling}> Add Customer Name </Text>
                                </Col>
                            </Row>
                        )}
                        {this.isActionsAllowed() && CONVERT_TO_LEAD && (
                            <Row>
                                <Col>
                                    <Textarea
                                        style={commonStyle.dynamicComponentTextAreaStyle}
                                        rowSpan={2}
                                        bordered
                                        placeholder="Enter Customer Name"
                                        onChangeText={(text) => {
                                            this.onInputTextChanged(appConstant.MI_INFO.CTL_CUSTOMER_NAME, text);
                                        }}
                                    />
                                </Col>
                            </Row>
                        )}

                        {this.isActionsAllowed() && CONVERT_TO_LEAD && (
                            <Row>
                                <Col style={styleContent.marginHorizontalRow}>
                                    <Text style={commonStyle.darkLabelStyling}> Add final Description / Requirements </Text>
                                </Col>
                            </Row>
                        )}
                        {this.isActionsAllowed() && CONVERT_TO_LEAD && (
                            <Row style={{ marginBottom: 50 }}>
                                <Col>
                                    <Textarea
                                        style={commonStyle.dynamicComponentTextAreaStyle}
                                        rowSpan={4}
                                        bordered
                                        placeholder="Enter Requirement"
                                        onChangeText={(text) => {
                                            this.onInputTextChanged(appConstant.MI_INFO.CTL_REQUIREMENT, text);
                                        }}
                                    />
                                </Col>
                            </Row>
                        )}



                    </Grid>
                </Content>
                {
                    this.isActionsAllowed() &&
                    (<Footer >

                        <Button
                            style={styleContent.addFooter}
                            onPress={this.initiateMICreation}
                        >
                            <Text style={styleContent.addFooterText}>UPDATE MI </Text>
                            <Icon name="arrow-forward" style={{ color: "white", fontSize: 20 }} />
                        </Button >

                    </Footer>)
                }

                <MiInfoListComponent
                    itemId={itemId}
                    refreshList={this.state.filterState}
                    showModal={this.state.filterVisible}
                    closeListModal={this.hideMoreInfoMessagesClicked}
                />

                {this.getSpinnerComponentView()}
            </Container>
        )
    }
}

// This function provides a means of sending actions so that data in the Redux store
// can be modified. In this example, calling this.props.addToCounter() will now dispatch
// (send) an action so that the reducer can update the Redux state.
function mapDispatchToProps(dispatch) {
    return {
        updateMarketIntelligence: (inputPayload) => {
            return marketIntelligenceApi.updateMI(inputPayload).then((resp) => {
                return resp;
            })
        },
        loadMIDetail: (inputParams) => {
            return marketIntelligenceApi.getMIDetails(inputParams).then((resp) => {
                return resp;
            })

        },
        dispatchAction: (param) => {
            dispatch(param);
        }
    }
}

// This function provides access to data in the Redux state in the React component
// In this example, the value of this.props.count will now always have the same value
// As the count value in the Redux state
function mapStateToProps(state) {
    return {
        count: state.count
    }
}

// export default connect(mapStateToProps, mapDispatchToProps)(MiDetailsPage)