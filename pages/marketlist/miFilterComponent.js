import { Col, DatePicker, Grid, Row, Text } from 'native-base';
import React from 'react';
import { Modal, TouchableHighlight, View } from 'react-native';
import { default as FeatherIcon } from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { default as commonStyle } from '../common/commonStyling';
import { default as appConstant } from '../common/consts';
import DropDownComponent from '../common/dropdownComponent';
import i18nMessages from '../common/i18n';
import styleContent from './miListPageStyle';

export default class miFilterComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.getDropdownFor = this.getDropdownFor.bind(this);
        this.onDropDownChange = this.onDropDownChange.bind(this);
        this.getDatePickerView = this.getDatePickerView.bind(this);
        this.onDateSelected = this.onDateSelected.bind(this);
    }

    onDateSelected(type, selectedDate) {
        this.setState({
            [type]: selectedDate
        });
    }

    getDatePickerView(type) {
        return (
            <DatePicker
                defaultDate={this.state[type]}
                textStyle={styleContent.datePickerStyle}
                placeHolderTextStyle={styleContent.datePickerStyle}
                animationType={"fade"}
                placeHolderText={i18nMessages.select_date_lbl}
                onDateChange={(dateInfo) => {
                    this.onDateSelected(type, dateInfo)
                }}
            />
        )
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
        const { savedState } = this.props
        switch (type) {
            case 'MI_TYPE_DROP_DOWN':
                dataSource = (appConstant.MI_TYPE) ? [...appConstant.MI_TYPE] : [];
                
                let containsALL = false;
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
                defaultSelection = (savedState && savedState.MI_TYPE_DROP_DOWN) ? savedState.MI_TYPE_DROP_DOWN : ''
                break;
            case 'MI_STATUS_DROP_DOWN':
                dataSource = (appConstant.MI_STATUS_DROP_DOWN) ? [...appConstant.MI_STATUS_DROP_DOWN] : [];
                let containsBOTH = false;
                dataSource.forEach(singleSource => {
                    if (singleSource.code === "both") {
                        containsBOTH = true;
                    }
                });
                if (!containsBOTH) {
                    dataSource.unshift({
                        name: 'BOTH',
                        code: 'both'
                    });
                }
                defaultSelection = (savedState && savedState.MI_STATUS_DROP_DOWN) ? savedState.MI_STATUS_DROP_DOWN : ''
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
        const { showModal = false, toggleHandler, applyFilterHandler, resetFilterHandler, savedState = {} } = this.props;
        return (
            <Modal
                animationType="slide"
                transparent={false}
                visible={showModal}
                onRequestClose={() => {
                    if (toggleHandler) {
                        toggleHandler()
                    }
                }}>
                <View  style={{  "flex":1 }}>
                    <View style={[commonStyle.modalHeaderDiv, 
                    {
                        marginTop:"10%"
                    }]}>
                        <View><Text note style={commonStyle.modalHeader}> Filter  </Text></View>
                        <View 
                        >
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
                            <Row style={commonStyle.formGridLabel}>
                                <Col>
                                    <Text note style={commonStyle.labelStyling}>{i18nMessages.lbl_mi_list_filter_type}</Text>
                                </Col>
                            </Row>
                            <Row style={commonStyle.formGridValue}>
                                <Col>
                                    {this.getDropdownFor('MI_TYPE_DROP_DOWN')}
                                </Col>
                            </Row>

                            <Row style={commonStyle.formGridLabel}>
                                <Col>
                                    <Text note style={commonStyle.labelStyling}>{i18nMessages.lbl_mi_list_filter_status}</Text>
                                </Col>
                            </Row>
                            <Row style={commonStyle.formGridValue}>
                                <Col>
                                    {this.getDropdownFor('MI_STATUS_DROP_DOWN')}
                                </Col>
                            </Row>


                            <Row style={commonStyle.formGridLabel}>
                                <Col>
                                    <Text note style={commonStyle.labelStyling}>{i18nMessages.lbl_filter_start_date}</Text>
                                </Col>
                            </Row>
                            <Row style={commonStyle.dateGridValue}>
                                <Col>
                                    <FeatherIcon name="calendar" style={commonStyle.calenderIcon} />
                                </Col>
                                <Col style={commonStyle.dateLabel}>
                                    {this.getDatePickerView('START_DATE')}
                                </Col>
                            </Row>
                            <Row style={commonStyle.formGridLabel}>
                                <Col>
                                    <Text note style={commonStyle.labelStyling}>{i18nMessages.lbl_filter_end_date}</Text>
                                </Col>
                            </Row>
                            <Row style={commonStyle.dateGridValue}>
                                <Col>
                                    <FeatherIcon name="calendar" style={commonStyle.calenderIcon} />
                                </Col>
                                <Col style={commonStyle.dateLabel}>
                                    {this.getDatePickerView('END_DATE')}
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
        )

    }
}



