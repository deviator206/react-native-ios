import { Col, Grid, Row, Text } from 'native-base';
import React from 'react';
import { Modal, TouchableHighlight, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { default as commonStyle } from '../common/commonStyling';
import { default as appConstant } from '../common/consts';
import DropDownComponent from '../common/dropdownComponent';
import i18nMessages from '../common/i18n';
import { default as RBAPolicy } from '../common/rbaPolicy';



export default class viewLeadFilterComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.getDropdownFor = this.getDropdownFor.bind(this);
        this.onDropDownChange = this.onDropDownChange.bind(this);
        this.getRBABasedSelfModeView = this.getRBABasedSelfModeView.bind(this);
        this.getRBABasedGeneralBUModeView = this.getRBABasedGeneralBUModeView.bind(this);
        this.getAllToAllDropdown = this.getAllToAllDropdown.bind(this);

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
            case 'DROP_DOWN_SELF_MODE':
                dataSource = (appConstant.SELF_MODE) ? [...appConstant.SELF_MODE] : [];
                defaultSelection = (savedState && savedState.DROP_DOWN_SELF_MODE) ? savedState.DROP_DOWN_SELF_MODE : ''
                break;
            case 'DROP_DOWN_GENERAL_BU_MODE':
                dataSource = (appConstant.GENERAL_BU_MODE) ? [...appConstant.GENERAL_BU_MODE] : [];
                defaultSelection = (savedState && savedState.DROP_DOWN_GENERAL_BU_MODE) ? savedState.DROP_DOWN_GENERAL_BU_MODE : ''
                break;
            case 'ORIGINATOR_BU':
                dataSource = (referenceInfo && referenceInfo[appConstant.DROP_DOWN_TYPE.BU_NAME]) ? referenceInfo[appConstant.DROP_DOWN_TYPE.BU_NAME] : [];
                defaultSelection = (savedState && savedState.ORIGINATOR_BU) ? savedState.ORIGINATOR_BU : ''
                break;
            case 'TARGET_BU':
                dataSource = (referenceInfo && referenceInfo[appConstant.DROP_DOWN_TYPE.BU_NAME]) ? referenceInfo[appConstant.DROP_DOWN_TYPE.BU_NAME] : [];
                defaultSelection = (savedState && savedState.TARGET_BU) ? savedState.TARGET_BU : ''
                break;
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

    getRBABasedSelfModeView() {
        if (RBAPolicy.getPolicyVisibility("self_lead_view_mode")) {
            return (
                <React.Fragment>
                    <Row style={[commonStyle.formGridLabel, { justifyContent: "space-between" }]}>
                        <Col>
                            <Text note style={commonStyle.labelStyling}>{i18nMessages.lbl_lead_origin}</Text>
                        </Col>
                    </Row>
                    <Row style={[commonStyle.formGridValue, { justifyContent: "space-between" }]}>
                        <Col>
                            {this.getDropdownFor('DROP_DOWN_SELF_MODE')}
                        </Col>
                    </Row>
                </React.Fragment>
            );
        }
    }

    getAllToAllDropdown() {
        if (RBAPolicy.getPolicyVisibility("report_all_bu_to_all")) {
            return (
                <Row style={[commonStyle.formGridValue, { justifyContent: "space-between", marginBottom: "10%" }]}>
                    <Col style={{
                        width: "45%"
                    }}>
                        <Text note style={commonStyle.labelStyling}  > Originator BU</Text>
                        {this.getDropdownFor('ORIGINATOR_BU')}
                    </Col>
                    <Col style={{
                        width: "45%"
                    }}>
                        <Text note style={commonStyle.labelStyling}  >Target BU</Text>
                        {this.getDropdownFor('TARGET_BU')}
                    </Col>
                </Row>
            );
        }
    }

    getRBABasedGeneralBUModeView() {
        if (RBAPolicy.getPolicyVisibility("general_bu_lead_view_mode")) {
            return (
                <React.Fragment>
                    <Row style={[commonStyle.formGridLabel, { justifyContent: "space-between" }]} >
                        <Col>
                            <Text note style={commonStyle.labelStyling}>{i18nMessages.lbl_lead_origin}</Text>
                        </Col>
                    </Row>
                    <Row style={[commonStyle.formGridValue, { justifyContent: "space-between" }]}>
                        <Col>
                            {this.getDropdownFor('DROP_DOWN_GENERAL_BU_MODE')}
                        </Col>
                    </Row>
                </React.Fragment>
            );
        }
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
                <View style={{ "flex": 1 }}
                >
                    <View style={[commonStyle.modalHeaderDiv,
                    {
                        marginTop: "3%"
                    }]}>
                        <View>
                            <Text style={commonStyle.modalHeader}> Filter View Leads </Text></View>
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
                    <View style={{ flex: 0.9, padding: 20 }}>
                        <Grid style={commonStyle.formGrid}>
                            {this.getRBABasedSelfModeView()}
                            {this.getRBABasedGeneralBUModeView()}
                            {this.getAllToAllDropdown()}
                            <Row style={[commonStyle.formGridLabel, { justifyContent: "space-between" }]}>
                                <Col style={{ width: "45%" }}>
                                    <Text note style={commonStyle.labelStyling}>{i18nMessages.status}</Text>
                                </Col>
                                <Col style={{ width: "45%" }}>
                                    <Text note style={commonStyle.labelStyling}>{i18nMessages.tenure_lbl}</Text>
                                </Col>
                            </Row>
                            <Row style={[commonStyle.formGridValue, { justifyContent: "space-between" }]}>
                                <Col style={{ width: "45%" }}>
                                    {this.getDropdownFor('LEAD_STATUS_DROP_DOWN')}
                                </Col>
                                <Col style={{ width: "45%" }}>
                                    {this.getDropdownFor(appConstant.DROP_DOWN_TYPE.TENURE)}
                                </Col>
                            </Row>

                            <Row style={[commonStyle.formGridLabel, { justifyContent: "space-between" }]}>
                                <Col style={{ width: "45%" }}>
                                    <Text note style={commonStyle.labelStyling}>{i18nMessages.location}</Text>
                                </Col>
                            </Row>
                            <Row style={[commonStyle.formGridValue, { justifyContent: "space-between" }]}>
                                <Col >
                                    {this.getDropdownFor(appConstant.DROP_DOWN_TYPE.COUNTRY)}
                                </Col>
                            </Row>


                            {
                                /*<Row style={commonStyle.formGridLabel}>
                                    <Col>
                                        <Text note style={commonStyle.labelStyling}>{i18nMessages.bu_selection}</Text>
                                    </Col>
                                </Row>
                                <Row style={commonStyle.formGridValue}>
                                    <Col>{this.getDropdownFor(appConstant.DROP_DOWN_TYPE.BU_NAME)}</Col>
                                </Row>
                                */
                            }
                            <Row style={[commonStyle.formGridLabel, { justifyContent: "space-between" }]}>
                                <Col style={{ width: "45%" }}>
                                    <Text note style={commonStyle.labelStyling}>{i18nMessages.industry}</Text>
                                </Col>
                                <Col style={{ width: "45%" }}>
                                    <Text note style={commonStyle.labelStyling}>{i18nMessages.source_type}</Text>
                                </Col>
                            </Row>
                            <Row style={[commonStyle.formGridValue, { justifyContent: "space-between" }]}>
                                <Col style={{ width: "45%" }}>
                                    {this.getDropdownFor(appConstant.DROP_DOWN_TYPE.INDUSTRY)}
                                </Col>
                                <Col style={{ width: "45%" }}>
                                    {this.getDropdownFor(appConstant.DROP_DOWN_TYPE.SOURCE)}
                                </Col>
                            </Row>


                        </Grid>
                    </View>



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


            </Modal>


        );
    }

}