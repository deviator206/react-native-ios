import { Button, Col, Container, Content, Footer, Grid, Row, Text, Textarea, View } from 'native-base';
import React from 'react';
import { Alert, Modal, TouchableHighlight, FlatList } from 'react-native';
import { default as FeatherIcon } from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { default as commonStyle } from '../common/commonStyling';
import { default as appConstant } from '../common/consts';
import DropDownComponent from '../common/dropdownComponent';
import i18nMessages from '../common/i18n';
import { default as Utils } from '../common/Util';
import styleContent from './miDetailsPageStyle';
import SpinnerComponent from '../common/spinnerComponent';
import HeaderComponent from '../common/headerComponent';
import MarketIntelligenceApi from '../../services/MarketIntelligenceApi';

const marketIntelligenceApi = new MarketIntelligenceApi({ state: {} });


export default class miInfoListComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.loadDetail = this.loadDetail.bind(this);
        this.getSpinnerComponentView = this.getSpinnerComponentView.bind(this);
        this.getListedInfo = this.getListedInfo.bind(this);
        this.onResponseSuccess = this.onResponseSuccess.bind(this);
        this.onResponseError = this.onResponseError.bind(this);

    }
    componentDidMount() {
        this.loadDetail();
    }
    static getCardView(item) {
        return (
            <Row style={
                {
                    borderTopColor: "#616161",
                    borderTopWidth: 1,
                    paddingVertical: 10,
                    paddingHorizontal: 10
                }
            }>

                <Col style={styleContent.profileDetails}>
                    <Row style={styleContent.profileDetailsRow}>
                        <Col><Text style={styleContent.profileDetailsLabel}> {(item.creator && item.creator.userDisplayName) ? item.creator.userDisplayName : "User"} </Text></Col>
                        <Col style={styleContent.alignItemTOEnd}><Text style={styleContent.profileDetailsValue}>  {Utils.getFormattedDate(new Date(item.creationDate))} </Text></Col>
                    </Row>
                    <Row>
                        <Col>
                            <Text style={[styleContent.cardViewSecondaryInfo, styleContent.profileDetailsInfo]}>  {item.info} </Text>
                        </Col>
                    </Row>
                </Col>
            </Row>)
    }

    getListedInfo() {
        const { miDetails } = this.state;
        const resultSet = (miDetails && miDetails.miInfoList) ? miDetails.miInfoList : [];
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
                                {miInfoListComponent.getCardView(item)}

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

    onResponseError() {
        this.setState({
            spinner: false
        });
    }
    onResponseSuccess(resp) {
        this.setState({
            spinner: false,
            miDetails: resp,
        });
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

    loadDetail() {
        const { itemId } = this.props;
        this.setState({
            spinner: true
        });
        marketIntelligenceApi.getMIDetails({ itemId }).then(this.onResponseSuccess).catch(this.onResponseError);
    }

    render() {
        const { showModal = false, closeListModal } = this.props;
        return (
            <Modal
                animationType="slide"
                transparent={false}
                visible={showModal}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                }}>
                <HeaderComponent
                    title="Message  List"
                    sideMenuClickHandler={() => {

                        if (closeListModal) {
                            closeListModal()
                        }
                    }} />
                <View style={{ width: '100%', height: "100%" }}>
                    {this.getListedInfo()}
                </View>
                {this.getSpinnerComponentView()}
            </Modal>
        )

    }
}



