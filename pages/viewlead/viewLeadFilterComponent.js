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
import DropDownComponent from '../common/dropdownComponent';
import SpinnerComponent from '../common/spinnerComponent';
import FlatListComponent from '../common/flatListComponent';
import styleContent from './viewLeadStyle';



export default class viewLeadFilterComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.getDropdownFor = this.getDropdownFor.bind(this);
        this.onDropDownChange = this.onDropDownChange.bind(this);

    }

    onDropDownChange({ type, value }) {
        this.setState({
            [type]: value
        });
    }


    getDropdownFor(type) {
        let returnedView = null;
        let dataSource = [];
        let defaultSelection = "";
        const { savedState, referenceInfo } = this.props
        let containsALL = false;
        switch (type) {
            case 'LEAD_STATUS_DROP_DOWN':
                dataSource = (appConstant.LEAD_STATUS_DROP_DOWN) ? [...appConstant.LEAD_STATUS_DROP_DOWN] : [];

                containsALL = false;
                dataSource.forEach(singleSource => {
                    if (singleSource.code === "all") {
                        containsALL = true;
                    }
                });
                if (!containsALL) {
                    dataSource.unshift({
                        name: 'ALL',
                        code: 'all'
                    });
                }
                defaultSelection = (savedState && savedState.LEAD_STATUS_DROP_DOWN) ? savedState.LEAD_STATUS_DROP_DOWN : ''
                break;
            case appConstant.DROP_DOWN_TYPE.TENURE:
            case appConstant.DROP_DOWN_TYPE.BU_NAME:
            case appConstant.DROP_DOWN_TYPE.COUNTRY:
            case appConstant.DROP_DOWN_TYPE.SOURCE:
            case appConstant.DROP_DOWN_TYPE.INDUSTRY:
                dataSource = (referenceInfo && referenceInfo[type]) ? [...referenceInfo[type]] : [];
                containsALL = false;
                dataSource.forEach(singleSource => {
                    if (singleSource.code === "all") {
                        containsALL = true;
                    }
                });
                if (!containsALL) {
                    dataSource.unshift({
                        name: 'ALL',
                        code: 'all'
                    });
                }
                defaultSelection = (savedState && savedState[type]) ? savedState[type] : ''
                break;

            default:
                break;
        }
        if (dataSource.length > 0) {
            returnedView = <DropDownComponent
                defaultSelection={defaultSelection}
                dataSource={dataSource}
                updateToParent={this.onDropDownChange}
                dropDownType={type}
                showAttribute='name'
                returnAttribute='code'
            />;
        }
        return returnedView;
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
                                    {this.getDropdownFor('LEAD_STATUS_DROP_DOWN')}
                                </Col>
                                <Col>
                                    {this.getDropdownFor(appConstant.DROP_DOWN_TYPE.TENURE)}
                                </Col>
                            </Row>

                            <Row style={commonStyle.formGridLabel}>
                                <Col>
                                    <Text note style={commonStyle.labelStyling}>{i18nMessages.location}</Text>
                                </Col>
                            </Row>
                            <Row style={commonStyle.formGridValue}>
                                <Col>
                                    {this.getDropdownFor(appConstant.DROP_DOWN_TYPE.COUNTRY)}
                                </Col>
                            </Row>


                            <Row style={commonStyle.formGridLabel}>
                                <Col>
                                    <Text note style={commonStyle.labelStyling}>{i18nMessages.bu_selection}</Text>
                                </Col>
                            </Row>
                            <Row style={commonStyle.formGridValue}>
                                <Col>{this.getDropdownFor(appConstant.DROP_DOWN_TYPE.BU_NAME)}</Col>
                            </Row>
                            <Row style={commonStyle.formGridLabel}>
                                <Col>
                                    <Text note style={commonStyle.labelStyling}>{i18nMessages.industry}</Text>
                                </Col>
                            </Row>
                            <Row style={commonStyle.formGridValue}>
                                <Col>
                                    {this.getDropdownFor(appConstant.DROP_DOWN_TYPE.INDUSTRY)}
                                </Col>
                            </Row>


                            <Row style={commonStyle.formGridLabel}>
                                <Col>
                                    <Text note style={commonStyle.labelStyling}>{i18nMessages.source_type}</Text>
                                </Col>
                            </Row>
                            <Row style={commonStyle.formGridValue}>
                                <Col>
                                    {this.getDropdownFor(appConstant.DROP_DOWN_TYPE.SOURCE)}
                                </Col>
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