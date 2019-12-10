import { Card, CardItem, Col, Container, Content, Grid, Row, Text } from 'native-base';
import React from 'react';
import { Alert, FlatList, Modal, TouchableHighlight, View } from 'react-native';
import NotificationApi from '../../services/NotificationApi';
import { default as commonStyling } from '../common/commonStyling';
import HeaderComponent from '../common/headerComponent';
import { default as RBAPolicy } from '../common/rbaPolicy';
import SpinnerComponent from '../common/spinnerComponent';
import Utils from '../common/Util';
import styleContent from './notificationListStyle';




export default class NotificationListPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filterVisible: false
        };
        this.filerBtnToggled = this.filerBtnToggled.bind(this);
        this.sideMenuClickHandler = this.sideMenuClickHandler.bind(this);
        this.gridViewBasedOnType = this.gridViewBasedOnType.bind(this);
        this.loadAllRecords = this.loadAllRecords.bind(this);
        this.willFocusSubscription = null;
        this.notificationApi = new NotificationApi({ state: {} });
        this.getSpinnerComponentView = this.getSpinnerComponentView.bind(this);

        this.onRecordFetchSucess = this.onRecordFetchSucess.bind(this);
        this.onRecordFetchError = this.onRecordFetchError.bind(this);

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



    onRecordFetchSucess(resp) {
        this.setState({
            spinner: false,
            resultSet: resp
        });
    }

    onRecordFetchError(error) {
        // console.log(error);
        this.setState({
            spinner: false,
            resultSet: []

        });
    }


    loadAllRecords() {
        this.setState({
            spinner: true
        });
        const params = "recipientId=" + RBAPolicy.getCurrentUserId();
        this.notificationApi.getAllMessages({ params }).then(this.onRecordFetchSucess).catch(this.onRecordFetchError)
    }

    sideMenuClickHandler() {
        console.log("clicked side panel")
    }

    gridViewBasedOnType(item) {
        return (
            <Grid>
                <Row>
                    <Col>
                        <Text style={[commonStyling.list_cardViewMainTitle, commonStyling.camelCase]} > Message # {" " + item.id} </Text>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Text style={commonStyling.list_cardViewSecondaryInfo}  > {item.notificationText} </Text>
                    </Col>
                </Row>
                {(item && item.originationDate) && (
                    <Row>
                        <Col style={commonStyling.list_colLabelOnly} >
                            <Text style={commonStyling.list_cardViewPrimaryLabel}  > Originated Date </Text>

                        </Col>
                        <Col style={commonStyling.list_colValue} >
                            <Text style={commonStyling.list_cardViewPrimaryValue} >:   </Text>
                            <Text style={commonStyling.list_cardViewPrimaryValue} > {Utils.getFormattedDate(new Date(item.originationDate))} </Text>
                        </Col>

                    </Row>
                )}
            </Grid>
        );
    }

    filerBtnToggled() {
        const { filterVisible } = this.state;
        console.log(filterVisible);
        this.setState({
            filterVisible: !filterVisible
        });
    }
    componentDidMount() {
        this.setState({
            filterVisible: false
        });
        this.willFocusSubscription = this.props.navigation.addListener('didFocus', this.loadAllRecords);

    }

    getViewLeads() {
        const { resultSet = [] } = this.state;

        const returnedView = (
            <FlatList
                data={resultSet}
                renderItem={({ item }) =>
                    <Row>

                        <Card style={styleContent.gridCardWrapper}>
                            <CardItem>
                                <Col>
                                    {this.gridViewBasedOnType(item)}
                                </Col>
                            </CardItem>
                        </Card>


                    </Row>
                }
            >

            </FlatList>
        );

        return returnedView;
    }
    render() {
        const { navigation } = this.props;
        return (
            <Container>
                <HeaderComponent navigation={navigation} title="Notifications" />

                <Content style={styleContent.mainContent}>
                    <View style={{ height: '100%' }}>
                        <Grid style={styleContent.gridWrapper} >
                            {this.getViewLeads()}
                        </Grid>
                    </View>
                </Content>
                {this.getSpinnerComponentView()}


                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.filterVisible}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                    }}>
                    <Content style={{ width: '100%', marginTop: 80 }}>
                        <Grid style={{ width: '96%', backgroundColor: 'white', marginTop: 10, padding: 10 }}>
                            <Row><Col><Text note>Status</Text></Col><Col><Text note>Tenure</Text></Col></Row>
                            <Row>
                                <Col>
                                    <Text>Hello World!</Text>
                                </Col>
                                <Col>
                                    <Text>Hello World!</Text>
                                </Col>
                            </Row>
                        </Grid>
                        <View style={{ marginTop: 22 }}>

                            <View>


                                <TouchableHighlight
                                    onPress={() => {
                                        this.filerBtnToggled();
                                    }}>
                                    <Text>Hide Modal</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </Content>

                </Modal>

            </Container>
        )
    }
}