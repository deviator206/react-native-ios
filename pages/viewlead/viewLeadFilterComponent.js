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



export default class viewLeadFilterComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        const { toggleHandler, applyFilterHandler, resetFilterHandler, } = this.props;
        return (
            <Modal
                animationType="slide"
                transparent={false}
                visible={this.props.filterVisible}
                onRequestClose={() => {
                    if (toggleHandler) {
                        toggleHandler()
                    }
                }}>
                <View style={{ marginTop: "10%", height: "90%" }}
                >
                    <View tyle={commonStyle.modalHeaderDiv}>
                        <View>
                            <Text style={[commonStyle.modalHeader, {
                                color: "black"
                            }]}> Filter View Leads </Text></View>
                        <View >
                            <TouchableHighlight
                                onPress={() => {
                                    if (toggleHandler) {
                                        toggleHandler()
                                    }
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
                                    onPress={() => {
                                        if (resetFilterHandler) {
                                            resetFilterHandler();
                                        }
                                    }}>
                                    <Text style={[commonStyle.modalTwoButtons, commonStyle.secondaryButton]}>Reset</Text>
                                </TouchableHighlight>
                            </View>
                            <View style={{ width: "40%" }}>
                                <TouchableHighlight
                                    onPress={() => {
                                        if (applyFilterHandler) {
                                            applyFilterHandler(this.state);
                                        }
                                    }}>
                                    <Text style={[commonStyle.modalTwoButtons, commonStyle.primaryButton]}>Apply</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>

                </View>


            </Modal>


        );
    }

}