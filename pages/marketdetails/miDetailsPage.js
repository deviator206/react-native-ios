import { Button, Col, Container, Content, Footer, Grid, Row, Text, Textarea, View } from 'native-base';
import React from 'react';
import { FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import MarketIntelligenceApi from '../../services/MarketIntelligenceApi';
import CheckBoxComponent from '../common/checkBoxComponent';
import { default as commonStyle } from '../common/commonStyling';
import { default as appConstant } from '../common/consts';
import DropDownComponent from '../common/dropdownComponent';
import HeaderComponent from '../common/headerComponent';
import i18nMessages from '../common/i18n';
import ModalComponent from '../common/modalComponent';
import { default as MiInfoListComponent } from './miInfoListComponent';
import SpinnerComponent from '../common/spinnerComponent';
import styleContent from './miDetailsPageStyle';

const marketIntelligenceApi = new MarketIntelligenceApi({ state: {} });


class MiDetailsPage extends React.Component {
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
        this.props.loadMIDetail({ itemId }).then(this.onResponseSuccess).catch(this.onResponseError);
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
            INPUT_ADD_MORE_INFO
        } = this.state;

        let hasInfoUpdated = false;

        const { navigation } = this.props;
        const itemId = navigation.getParam('miId', 'NO-ID');
        let payload = {
            "id": itemId
        };
        if (ADD_MORE_INFO && INPUT_ADD_MORE_INFO && INPUT_ADD_MORE_INFO !== '') {
            hasInfoUpdated = true;
            const myBU = (window.userInformation &&
                window.userInformation.userInfo &&
                window.userInformation.userInfo.businessUnit) ? window.userInformation.userInfo.businessUnit : "";


            const userId = (window.userInformation &&
                window.userInformation.userInfo &&
                window.userInformation.userInfo.userId) ? window.userInformation.userInfo.userId : "";


            payload["miInfoList"] = [
                {
                    "info": INPUT_ADD_MORE_INFO,
                    "creator": {
                        "businessUnit": myBU,
                        "userId": userId
                    },
                }
            ]
        }

        if (hasInfoUpdated) {
            this.setState({
                spinner: true
            });

            this.props.updateMarketIntelligence({
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
        const resultSet = [];
        if (fullSet.length > 0) {
            resultSet.push(fullSet[fullSet.length - 1]);
        }
        let returnedView;
        if (resultSet && resultSet.length > 0) {
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

                                    <Row style={
                                        {
                                            borderTopColor: "#616161",
                                            borderTopWidth: 1,
                                            paddingTop: 8
                                        }
                                    }>
                                        <Col style={styleContent.profilePic}></Col>
                                        <Col style={styleContent.profileDetails}>
                                            <Row style={styleContent.profileDetailsRow}>
                                                <Col><Text style={styleContent.profileDetailsLabel}> {item.name} </Text></Col>
                                                <Col style={styleContent.alignItemTOEnd}><Text style={styleContent.profileDetailsValue}>  {item.creationDate} </Text></Col>
                                            </Row>
                                            <Row>
                                                <Col>
                                                    <Text style={[styleContent.cardViewSecondaryInfo, styleContent.profileDetailsInfo]}> {item.info} </Text>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
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
        if (fullSet.length > 1) {
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

    render() {

        const { ADD_MORE_INFO = false, CONVERT_TO_LEAD = false, miDetails } = this.state;
        const { navigation } = this.props;
        const itemId = navigation.getParam('miId', 'NO-ID');
        return (
            <Container>
                <HeaderComponent navigation={navigation} title="Market Intelligence" />
                <Content style={styleContent.mainContent}>

                    <Grid style={commonStyle.gridWrapper}>
                        <Row style={commonStyle.gridCardWrapper}>
                            <Col>
                                {
                                    miDetails &&
                                    miDetails.id &&
                                    (<Grid>
                                        <Row>
                                            <Col>
                                                <Text style={styleContent.cardViewMainTitle} > MI#{miDetails.id} </Text>
                                            </Col>
                                            <Col style={{ flexDirection: "row" }}>
                                                <Text style={styleContent.cardViewSecondaryInfo}  > Type :  </Text>
                                                <Text style={styleContent.cardViewPrimaryValue}  >  {miDetails.type} </Text>
                                            </Col>
                                        </Row>
                                        {
                                            miDetails.description && (
                                                <Row>
                                                    <Col>
                                                        <Text style={commonStyle.darkLabelStyling}  > Description : {miDetails.description} </Text>
                                                    </Col>
                                                </Row>
                                            )
                                        }

                                        {
                                            miDetails.status &&
                                            (
                                                <Row style={{ marginTop: 10, height: 50 }}>
                                                    <Col style={styleContent.colWidth50} >
                                                        <Text style={styleContent.cardViewPrimaryLabel}  > Status: </Text>
                                                    </Col>
                                                    <Col style={styleContent.colWidth50} >
                                                        <Text style={this.getStatusStyle(miDetails.status)} > {miDetails.status}  </Text>
                                                    </Col>
                                                </Row>
                                            )
                                        }

                                        {
                                            miDetails.creationDate &&
                                            (
                                                <Row style={{ marginTop: 10, height: 50 }}>
                                                    <Col >
                                                        <Text style={styleContent.cardViewPrimaryLabel}  > Creation Date: {miDetails.creationDate} </Text>
                                                    </Col>
                                                </Row>
                                            )
                                        }

                                        {
                                            miDetails.name &&
                                            (
                                                <Row style={{ marginTop: 10, height: 50 }}>
                                                    <Col  >
                                                        <Text style={styleContent.cardViewPrimaryLabel}  > Project Name : {miDetails.name} </Text>
                                                    </Col>
                                                </Row>
                                            )
                                        }
                                        {
                                            miDetails.investment &&
                                            (
                                                <Row style={{ marginTop: 10, height: 50 }}>
                                                    <Col style={styleContent.colWidth30} >
                                                        <Text style={styleContent.cardViewPrimaryLabel}  >Investment: </Text>

                                                    </Col>
                                                    <Col style={styleContent.colWidth70} >

                                                        <Text style={styleContent.cardViewSecondaryInfo} > {miDetails.investment}  </Text>
                                                    </Col>

                                                </Row>
                                            )
                                        }
                                    </Grid>
                                    )}


                            </Col>
                        </Row>

                    </Grid>

                    <Grid style={[styleContent.gridWrapper, {
                        height: "auto"
                    }]} >
                        {this.getListedInfo()}

                    </Grid>




                    <Grid style={{ marginTop: 10 }}>
                        <Row>
                            {this.viewMoreButton()}
                        </Row>
                        <Row>
                            <Col style={{ marginLeft: 10 }}>
                                <CheckBoxComponent
                                    currentState={ADD_MORE_INFO}
                                    checkBoxLabel={i18nMessages.lbl_mi_info_add_more_info}
                                    controlType={appConstant.MI_INFO.ADD_MORE_INFO}
                                    updateToParent={this.onCheckBoxChanged}
                                />
                            </Col>
                        </Row>
                        {ADD_MORE_INFO && (
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

                        <Row style={{ marginTop: 15 }}>
                            <Col style={{ marginLeft: 10 }}>
                                <CheckBoxComponent
                                    currentState={CONVERT_TO_LEAD}
                                    checkBoxLabel={i18nMessages.lbl_mi_info_convert_to_lead}
                                    controlType={appConstant.MI_INFO.CONVERT_TO_LEAD}
                                    updateToParent={this.onCheckBoxChanged}
                                />
                            </Col>
                        </Row>
                        {CONVERT_TO_LEAD && (
                            <Row>
                                <Col style={styleContent.marginHorizontalRow}>
                                    <Text style={commonStyle.darkLabelStyling}> Add Company Name </Text>
                                </Col>
                            </Row>
                        )}
                        {CONVERT_TO_LEAD && (
                            <Row>
                                <Col>
                                    <Textarea
                                        style={commonStyle.dynamicComponentTextAreaStyle}
                                        rowSpan={2}
                                        bordered
                                        placeholder="Lorem Ipsum is sim"
                                        onChangeText={(text) => {
                                            this.onInputTextChanged(appConstant.MI_INFO.CTL_CUSTOMER_NAME, text);
                                        }}
                                    />
                                </Col>
                            </Row>
                        )}

                        {CONVERT_TO_LEAD && (
                            <Row>
                                <Col style={styleContent.marginHorizontalRow}>
                                    <Text style={commonStyle.darkLabelStyling}> Add final Description / Requirements </Text>
                                </Col>
                            </Row>
                        )}
                        {CONVERT_TO_LEAD && (
                            <Row style={{ marginBottom: 50 }}>
                                <Col>
                                    <Textarea
                                        style={commonStyle.dynamicComponentTextAreaStyle}
                                        rowSpan={4}
                                        bordered
                                        placeholder="Lorem Ipsum is sim"
                                        onChangeText={(text) => {
                                            this.onInputTextChanged(appConstant.MI_INFO.CTL_REQUIREMENT, text);
                                        }}
                                    />
                                </Col>
                            </Row>
                        )}



                    </Grid>
                </Content>
                <Footer style={{
                    backgroundColor: "yellow"
                }}>
                    <Button
                        style={styleContent.addFooter}
                        onPress={this.initiateMICreation}
                    >
                        <Text style={styleContent.addFooterText}>UPDATE MI </Text>
                        <Icon name="arrow-forward" style={{ color: "white", fontSize: 20 }} />
                    </Button >
                </Footer>

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

export default connect(mapStateToProps, mapDispatchToProps)(MiDetailsPage)