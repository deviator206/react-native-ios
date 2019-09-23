import { Button, Card, CardItem, Col, Container, Content, Grid, Input, Item, Row, Text, View } from 'native-base';
import React from 'react';
import { FlatList } from 'react-native';
import { default as FilterIcon } from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import MarketIntelligenceApi from '../../services/MarketIntelligenceApi';
import { default as commonStyle } from '../common/commonStyling';
import { default as appConstant } from '../common/consts';
import HeaderComponent from '../common/headerComponent';
import SpinnerComponent from '../common/spinnerComponent';
import { default as FilterComponent } from './miFilterComponent';
import FlatListComponent from '../common/flatListComponent';
import styleContent from './miListPageStyle';


const marketIntelligenceApi = new MarketIntelligenceApi({ state: {} });



class MiListPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filterVisible: false,
            spinner: false
        };
        this.filerBtnToggled = this.filerBtnToggled.bind(this);
        this.willFocusSubscription = null;

        this.onLoadAllMarketInt = this.onLoadAllMarketInt.bind(this);
        this.getSpinnerComponentView = this.getSpinnerComponentView.bind(this);
        this.onSearchButtonClicked = this.onSearchButtonClicked.bind(this);
        this.onSearchTextChange = this.onSearchTextChange.bind(this);
        this.onResponseSuccess = this.onResponseSuccess.bind(this);
        this.onResponseError = this.onResponseError.bind(this);
        this.getStatusStyle = this.getStatusStyle.bind(this);
        this.triggerFilterBasedSearch = this.triggerFilterBasedSearch.bind(this);
        this.triggerResetFilterBasedSearch = this.triggerResetFilterBasedSearch.bind(this);
        this.validateTheFilter = this.validateTheFilter.bind(this);
        this.prepareInputPayload = this.prepareInputPayload.bind(this);

    }

    onResponseSuccess(resp) {
        this.setState({
            spinner: false,
            resultSet: resp
        });
    }

    onResponseError() {
        this.setState({
            spinner: false
        });
    }

    onSearchTextChange(value) {
        this.setState({
            searchInput: value
        })
    }

    triggerResetFilterBasedSearch() {
        this.setState({
            filterVisible: false,
            filterState: {}
        });
        this.onLoadAllMarketInt();
    }

    validateTheFilter(inputFilterState) {
        let isChanged = false;
        const newFilterState = {};
        const { filterState } = this.state;
        const { searchText, MI_TYPE_DROP_DOWN, START_DATE, MI_STATUS_DROP_DOWN, END_DATE } = filterState;
        if (MI_TYPE_DROP_DOWN !== inputFilterState.MI_TYPE_DROP_DOWN) {
            isChanged = true;
            newFilterState['MI_TYPE_DROP_DOWN'] = inputFilterState.MI_TYPE_DROP_DOWN
        }

        if (inputFilterState.START_DATE && START_DATE !== inputFilterState.START_DATE) {
            isChanged = true;
            newFilterState['START_DATE'] = inputFilterState.START_DATE
        }

        if (inputFilterState.MI_STATUS_DROP_DOWN && MI_STATUS_DROP_DOWN !== inputFilterState.MI_STATUS_DROP_DOWN) {
            isChanged = true;
            newFilterState['MI_STATUS_DROP_DOWN'] = inputFilterState.MI_STATUS_DROP_DOWN
        }


        if (inputFilterState.END_DATE && END_DATE !== inputFilterState.END_DATE) {
            isChanged = true;
            newFilterState['END_DATE'] = inputFilterState.END_DATE
        }

        if (inputFilterState.searchText && searchText !== inputFilterState.searchText) {
            isChanged = true;
            newFilterState['searchText'] = inputFilterState.searchText
        }
        return (isChanged) ? newFilterState : isChanged;
    }

    prepareInputPayload(filterState) {
        const { MI_TYPE_DROP_DOWN, START_DATE, MI_STATUS_DROP_DOWN, END_DATE , searchText} = filterState;
        let filterPayload = {};

        if (MI_TYPE_DROP_DOWN ) {
            filterPayload = {
                ...filterPayload,
                type: MI_TYPE_DROP_DOWN
            }
        }

        if (MI_STATUS_DROP_DOWN) {
            filterPayload = {
                ...filterPayload,
                status: MI_STATUS_DROP_DOWN
            }
        }

        if (START_DATE) {
            filterPayload = {
                ...filterPayload,
                startDate: START_DATE
            }
        }

        if (END_DATE) {
            filterPayload = {
                ...filterPayload,
                endDate: END_DATE
            }
        }

        if(searchText) {
            filterPayload = {
                ...filterPayload,
                searchText
            }
        }

        // special handling for  skipping certain attribute
        if(filterPayload["type"] === "all"){
            delete filterPayload.type;
        }

        if(filterPayload["status"] === "both"){
            delete filterPayload.status;
        }

        return filterPayload;
    }

    triggerFilterBasedSearch(ipfilterState) {
        const { filterState } = this.state;
        const validationResponse = this.validateTheFilter(ipfilterState);
        if (typeof (validationResponse) === "object") {
            const updatedState = {
                ...filterState,
                ...validationResponse
            }
            
            // prepare input
            const filterPayload = this.prepareInputPayload(updatedState);

            if(Object.keys(filterPayload).length > 0) {
                // invoke rest
                this.props.searchMIList(filterPayload).then(this.onResponseSuccess).catch(this.onResponseError);
                this.setState({
                    filterVisible: false,
                    spinner: true,
                    filterState: {
                       ...updatedState
                    }
                });
            } else {
                this.setState({
                    filterVisible: false,
                    filterState: {
                       ...updatedState
                    }
                });
            }
            
            // update state
           
            
        }
      
    }

    onSearchButtonClicked() {
        const { searchInput = '' } = this.state;
        if (searchInput && searchInput !== '') {
            const filterPayload = {
                "searchText": searchInput
            }
            this.triggerFilterBasedSearch(filterPayload)
        }
    }
    onLoadAllMarketInt() {
        this.setState({
            spinner: true
        });
        this.props.loadAllMI().then(this.onResponseSuccess).catch(this.onResponseError)
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
            filterVisible: false,
            filterState: {}
        });
        this.willFocusSubscription = this.props.navigation.addListener('willFocus', this.onLoadAllMarketInt);
    }

    componentWillUnmount() {
        if (this.willFocusSubscription) {
            this.willFocusSubscription.remove();
        }
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



    getStatusStyle(status) {
        if (status === appConstant.MI_STATUS.CLOSED) {
            return styleContent.closedStatus;
        }
        return styleContent.pendingStatus;
    }

    getViewLeads() {
        const { resultSet } = this.state;
        return (
            <FlatListComponent
                type="mi"
                resultSet={resultSet}
                onSingleItemCliced={(item) => {
                    this.props.navigation.navigate("midetails", {
                        miId: item.id
                    });
                }}
                getStatusClass={this.getStatusStyle}
            />
        )

    }

    render() {
        const { navigation } = this.props;
        return (
            <Container>
                <HeaderComponent navigation={navigation} title="Market Intelligence" />
                <Content style={styleContent.mainContent}>
                    <Grid >
                        <Row style={commonStyle.searchAndFilterWrapper}>
                            <Col style={commonStyle.searchBarWrapper} >
                                <Item searchBar rounded style={commonStyle.searchBarStyling}>
                                    <Input
                                        placeholder="Search"
                                        style={commonStyle.inputBox}
                                        onChangeText={(value) => {
                                            this.onSearchTextChange(value);
                                        }}
                                    />
                                    <Button transparent
                                        onPress={() => {
                                            this.onSearchButtonClicked();
                                        }}
                                    >
                                        <Icon name="search"
                                            style={[styleContent.iconStyling, commonStyle.searchIcon]}
                                        />
                                    </Button>
                                </Item>
                            </Col>
                            <Col  >
                                <Button
                                    transparent
                                    style={styleContent.filterBtnIcon}
                                    onPress={() => {
                                        this.filerBtnToggled();
                                    }}
                                >
                                    <FilterIcon name="filter-outline" style={styleContent.iconStylingBigger} />
                                </Button>
                            </Col>
                        </Row>
                    </Grid>

                    <Grid style={styleContent.gridWrapper} >
                        {this.getViewLeads()}
                    </Grid>
                </Content>
                <View style={styleContent.floatingButtonView}>
                    <Button
                        style={styleContent.floatingButton}
                        button
                        onPress={() => {
                            this.props.navigation.navigate("miadd");
                        }} >
                        <Icon name="add" style={{
                            color: "white",
                            fontSize: 30,
                            marginLeft: 15
                        }} />
                    </Button>
                </View>

                <FilterComponent
                    savedState={this.state.filterState}
                    showModal={this.state.filterVisible}
                    toggleHandler={this.filerBtnToggled}
                    applyFilterHandler={this.triggerFilterBasedSearch}
                    resetFilterHandler={this.triggerResetFilterBasedSearch}
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
        loadAllMI: (inputParams) => {
            return marketIntelligenceApi.getMI({
                params: inputParams
            }).then((resp) => {
                return resp;
            })

        },
        searchMIList: (filterPayload) => {
            return marketIntelligenceApi.searchMIList(filterPayload).then((resp) => {
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

export default connect(mapStateToProps, mapDispatchToProps)(MiListPage);