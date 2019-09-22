
import { Item, Picker } from 'native-base';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import styleContent from './commonStyling';

export default class DropDownComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: ''
        }
        this.onSelectionChanged = this.onSelectionChanged.bind(this);
        this.getView = this.getView.bind(this);
        this.getRegularView = this.getRegularView.bind(this);
        this.getRoundedView = this.getRoundedView.bind(this);



        this.getDropDownLabel = this.getDropDownLabel.bind(this);
        this.getDropDownValue = this.getDropDownValue.bind(this);
    }

    onSelectionChanged(value) {
        const { updateToParent, dropDownType } = this.props;
        this.setState({
            selected: value
        });
        if (updateToParent) {
            updateToParent({ type: dropDownType, value })
        }

    }

    componentDidMount() {
        const { dataSource, updateToParent, dropDownType, defaultSelection, returnAttribute = 'code' } = this.props;
        const defaultAutoSelectedValue = (dataSource && dataSource[0] && dataSource[0][returnAttribute]) ? dataSource[0][returnAttribute] : '';
        const value = (defaultSelection) ? defaultSelection : defaultAutoSelectedValue;
        this.setState({
            selected: value
        });
        if (updateToParent) {
            updateToParent({ type: dropDownType, value })
        }
    }

    
    static getDerivedStateFromProps(props, state) {
        const { dataSource, updateToParent, dropDownType, defaultSelection, returnAttribute = 'code' } = props;
        const defaultAutoSelectedValue = (dataSource && dataSource[0] && dataSource[0][returnAttribute]) ? dataSource[0][returnAttribute] : '';
        const value = (defaultSelection) ? defaultSelection : defaultAutoSelectedValue;
        
        if (state.selected == '' &&  value !== state.selected) {
            if (updateToParent) {
                updateToParent({ type: dropDownType, value })
            }
          return {
            selected: value,
          };
          
        }
    
        // Return null if the state hasn't changed y
        return null;
      }
      

    componentDidUpdate1(prevProps) {
        const { dataSource, updateToParent, dropDownType } = this.props;
        const { selected } = this.state;
        let value;
        // Typical usage (don't forget to compare props):
        if (dataSource !== prevProps.dataSource) {
            value = (dataSource && dataSource[0] && dataSource[0].code) ? dataSource[0].code : '';
            if (selected != value) {
                this.setState({
                    selected: value
                });
            }

            if (updateToParent) {
                updateToParent({ type: dropDownType, value })
            }
        }
    }

    getDropDownValue(singleItem) {
        const { returnAttribute } = this.props;
        if (returnAttribute) {
            return singleItem[returnAttribute];
        }
        return singleItem.name
    }


    getDropDownLabel(singleItem) {
        const { showAttribute } = this.props;
        if (showAttribute) {
            return singleItem[showAttribute];
        }
        return singleItem.name
    }

    getRegularView() {
        const { selected = '' } = this.state;
        let returnedView;
        const { dataSource = [], onDropDownSelectionChange = this.onSelectionChanged, showAttribute, returnAttribute } = this.props;
        const pickerItemArr = [];
        const indG = 'KEY_' + parseInt(Math.random(0, 111) * 1000);
        dataSource.forEach(singleItem => {
            const ind = 'KEY_' + parseInt(Math.random(0, 19) * 1000);
            pickerItemArr.push(
                (<Picker.Item
                    key={ind}
                    label={this.getDropDownLabel(singleItem)}
                    style={styleContent.dropdownTextItemAndSelection}
                    value={this.getDropDownValue(singleItem)} />)
            )
        });
        returnedView = (
                <Picker
                    key={indG}
                    mode="dropdown"
                    iosIcon={<Icon name="ios-arrow-down" />}
                    textStyle={styleContent.dropdownTextItemAndSelection}
                    itemStyle={styleContent.dropdownTextItemAndSelection}
                    itemTextStyle={styleContent.dropdownTextItemAndSelection}
                    style={styleContent.dynamicComponentTextStyle}
                    placeholderStyle={styleContent.dynamicComponentTextStyle}
                    onValueChange={onDropDownSelectionChange}
                    selectedValue={selected}
                    placeholderIconColor="#007aff"
                >
                    {pickerItemArr}

                </Picker>
           
        );
        return returnedView;
    }

    getRoundedView() {
        const { selected = '' } = this.state;
        let returnedView;
        const { dataSource = [], onDropDownSelectionChange = this.onSelectionChanged, showAttribute, returnAttribute } = this.props;
        const pickerItemArr = [];
        const indG = 'KEY_' + parseInt(Math.random(0, 111) * 1000);
        dataSource.forEach(singleItem => {
            const ind = 'KEY_' + parseInt(Math.random(0, 19) * 1000);
            pickerItemArr.push(
                (<Picker.Item
                    key={ind}
                    label={this.getDropDownLabel(singleItem)}
                    style={{
                        backgroundColor: "red"
                    }}
                    value={this.getDropDownValue(singleItem)} />)
            )
        });
        returnedView = (

            <Picker
                key={indG}
                style={
                    {
                        color: "#f0f3f7",
                        textTransform: "capitalize",
                        
                    }
                }
                mode="dropdown"
                textStyle={{ color: "#d3d3d3" }}
                itemTextStyle={{ color: '#444444' }}
                iosIcon={<Icon name="ios-arrow-down" style={{color:"#d3d3d3"}}/>}
                onValueChange={onDropDownSelectionChange}
                selectedValue={selected}
                placeholderIconColor="#007aff"
            >
                {pickerItemArr}

            </Picker>

        );
        return returnedView;
    }

    getView() {
        const { roundedDropDown = false } = this.props;
        if (!roundedDropDown) {
            return this.getRegularView();
        } else {
            return this.getRoundedView();
        }
    }

    render() {
        const { roundedDropDown = false } = this.props;
        let roundedItemStyle = {
            borderColor: '#393939'
        };
        if (roundedDropDown) {
            roundedItemStyle = {
                borderRadius: 80,
                borderColor: '#393939',
                backgroundColor: "#393939",
                paddingLeft: "2%"
            }
        }
        return (
            <Item
                picker 
                style={roundedItemStyle}
            >
                {this.getView()}
            </Item>
        )
    }
}

