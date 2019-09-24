
import { Button, Card, CardItem, Col, Container, Content, Grid, Input, Item, Row, Text } from 'native-base';
import React from 'react';
import { Alert, FlatList, Modal, TouchableHighlight, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import styleContent from './commonStyling';
import { default as appConstant } from './consts';
import { default as Utils } from './Util';

export default class FlatListComponent extends React.Component {
    constructor(props) {
        super(props);
        this.gridViewBasedOnType = this.gridViewBasedOnType.bind(this);

    }
    static getTypeConstant(inputType) {
        let localType = 'UNKNOWN_TYPE'
        appConstant.MI_TYPE.forEach((singleType) => {
            if(singleType.code === inputType) {
                localType = singleType.name;
            }
        });
        return localType;
    }

    static getMIListing(item, {getStatusClass}) {
        return (
            <Grid>
                <Row>
                    <Col>
                        <Text style={[styleContent.list_cardViewMainTitle, styleContent.camelCase]} > Market Intelligence #{item.id} </Text>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Text style={styleContent.list_cardViewSecondaryInfo}  > {item.description} </Text>
                    </Col>
                </Row>
                <Row>
                    <Col style={styleContent.list_colLabelOnly} >
                        <Text style={
                            styleContent.list_cardViewPrimaryLabel}  > Type </Text>

                    </Col>
                    <Col style={styleContent.list_colValue} >
                        <Text style={styleContent.list_cardViewPrimaryValue} >:   </Text>
                        <Text style={styleContent.list_cardViewPrimaryValue} > {FlatListComponent.getTypeConstant(item.type)} </Text>

                    </Col>

                </Row>

                {
                    item && item.creationDate && (
                        <Row>
                            <Col style={styleContent.list_colLabelOnly} >
                                <Text style={styleContent.list_cardViewPrimaryLabel}  > Date </Text>

                            </Col>
                            <Col style={styleContent.list_colValue} >
                                <Text style={styleContent.list_cardViewPrimaryValue} >:   </Text>
                                <Text style={styleContent.list_cardViewPrimaryValue} > {Utils.getFormattedDate(new Date(item.creationDate))}  </Text>
                            </Col>
                        </Row>
                    )
                }

                {
                    item && item.name && (
                        <Row>
                            <Col style={styleContent.list_colLabelOnly} >
                                <Text style={styleContent.list_cardViewPrimaryLabel}  > Project Name </Text>

                            </Col>
                            <Col style={styleContent.list_colValue} >
                                <Text style={styleContent.list_cardViewPrimaryValue} >:   </Text>
                                <Text style={styleContent.list_cardViewPrimaryValue} > {item.name}  </Text>
                            </Col>
                        </Row>
                    )
                }

                {
                    item && item.investment && (
                        <Row>
                            <Col style={styleContent.list_colLabelOnly} >
                                <Text style={styleContent.list_cardViewPrimaryLabel}  > Investment </Text>

                            </Col>
                            <Col style={styleContent.list_colValue} >
                                <Text style={styleContent.list_cardViewPrimaryValue} >:   </Text>
                                <Text style={styleContent.list_cardViewPrimaryValue} > {item.investment}  </Text>
                            </Col>
                        </Row>
                    )
                }
                 <Row>
                    <Col style={styleContent.list_colLabelOnly} >
                        <Text style={
                            styleContent.list_cardViewPrimaryLabel}  > Status </Text>

                    </Col>
                    <Col style={styleContent.list_colValue} >
                        <Text style={styleContent.list_cardViewPrimaryValue} >:   </Text>
                        <Text style={getStatusClass ? [styleContent.list_cardViewPrimaryValue,getStatusClass(item.status)] : [styleContent.list_cardViewPrimaryValue]} > {item.status}  </Text>

                    </Col>
                    
                </Row>

            </Grid>

        )
    }

    gridViewBasedOnType(item) {
        const { getStatusClass, getStatusCircle, getLeadContact, type = 'lead' } = this.props;
        if (type == 'lead') {
            return (
                <Grid>
                    <Row>
                        <Col>
                            <Text style={[styleContent.list_cardViewMainTitle, styleContent.camelCase]} > {item.custName} </Text>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Text style={styleContent.list_cardViewSecondaryInfo}  > {item.description} </Text>
                        </Col>
                    </Row>
                    <Row>
                        <Col style={styleContent.list_colLabelOnly} >
                            <Text style={styleContent.list_cardViewPrimaryLabel}  > Contact </Text>

                        </Col>
                        {getLeadContact(item)}

                    </Row>
                    <Row>
                        <Col style={styleContent.list_colLabelOnly} >
                            <Text style={
                                styleContent.list_cardViewPrimaryLabel}  > Status </Text>

                        </Col>
                        <Col style={styleContent.list_colValue} >
                            <Text style={styleContent.list_cardViewPrimaryValue} >:   </Text>
                            <Text style={getStatusClass(item.status)} > {item.status && appConstant.DECODED_LEAD_STATUS[(item.status).toUpperCase()]}  </Text>

                        </Col>
                        <Col style={styleContent.list_colValueThird} >
                            <View style={getStatusCircle(item.status)} />
                        </Col>

                    </Row>
                    <Row>

                        <Col style={styleContent.list_colLabelOnly} >
                            <Text style={styleContent.list_cardViewPrimaryLabel}  > Sales Rep </Text>

                        </Col>
                        <Col style={styleContent.list_colValue} >
                            <Text style={styleContent.list_cardViewPrimaryValue} >:   </Text>
                            <Text style={styleContent.list_cardViewPrimaryValue} > {(item.leadsSummaryRes && item.leadsSummaryRes.salesRep && item.leadsSummaryRes.salesRep.userDisplayName) ? item.leadsSummaryRes.salesRep.userDisplayName : ''}  </Text>
                        </Col>
                    </Row>
                    <Row>
                        <Col style={styleContent.list_colLabelOnly} >
                            <Text style={styleContent.list_cardViewPrimaryLabel}  > Unit </Text>

                        </Col>
                        <Col style={styleContent.list_colValue} >
                            <Text style={styleContent.list_cardViewPrimaryValue} >:   </Text>
                            <Text style={styleContent.list_cardViewPrimaryValue} > {item.leadsSummaryRes && item.leadsSummaryRes.businessUnits && item.leadsSummaryRes.businessUnits.length > 0 && item.leadsSummaryRes.businessUnits[0]}  </Text>
                        </Col>

                    </Row>
                    <Row>
                        <Col style={styleContent.list_colLabelOnly} >
                            <Text style={styleContent.list_cardViewPrimaryLabel}  > Last Updated </Text>

                        </Col>
                        <Col style={styleContent.list_colValue} >
                            <Text style={styleContent.list_cardViewPrimaryValue} >:   </Text>
                            <Text style={styleContent.list_cardViewPrimaryValue} > {item.updateDate}  </Text>
                        </Col>

                    </Row>
                    <Row>
                        <Col style={styleContent.list_colLabelOnly} >
                            <Text style={styleContent.list_cardViewPrimaryLabel}  > Inactive Days </Text>
                        </Col>
                        <Col style={styleContent.list_colValue} >
                            <Text style={styleContent.list_cardViewPrimaryValue} >:   </Text>
                            <Text style={styleContent.list_cardViewPrimaryValue} > {item.inactiveDuration}  </Text>
                        </Col>
                    </Row>
                </Grid>
            )
        } else {
            // MI 
           /*
            return (
                <Grid>
                    <Row>
                        <Col>
                            <Text style={[styleContent.list_cardViewMainTitle, styleContent.camelCase]} > Market Intelligence #{item.id} </Text>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Text style={styleContent.list_cardViewSecondaryInfo}  > {item.description} </Text>
                        </Col>
                    </Row>
                    <Row>
                        <Col style={styleContent.list_colLabelOnly} >
                            <Text style={
                                styleContent.list_cardViewPrimaryLabel}  > Type </Text>

                        </Col>
                        <Col style={styleContent.list_colValue} >
                            <Text style={styleContent.list_cardViewPrimaryValue} >:   </Text>
                            <Text style={styleContent.list_cardViewPrimaryValue} > {item.type} </Text>

                        </Col>

                    </Row>

                    {
                        item && item.creationDate && (
                            <Row>
                                <Col style={styleContent.list_colLabelOnly} >
                                    <Text style={styleContent.list_cardViewPrimaryLabel}  > Date </Text>

                                </Col>
                                <Col style={styleContent.list_colValue} >
                                    <Text style={styleContent.list_cardViewPrimaryValue} >:   </Text>
                                    <Text style={styleContent.list_cardViewPrimaryValue} > {item.creationDate}  </Text>
                                </Col>
                            </Row>
                        )
                    }

                    {
                        item && item.name && (
                            <Row>
                                <Col style={styleContent.list_colLabelOnly} >
                                    <Text style={styleContent.list_cardViewPrimaryLabel}  > Project Name </Text>

                                </Col>
                                <Col style={styleContent.list_colValue} >
                                    <Text style={styleContent.list_cardViewPrimaryValue} >:   </Text>
                                    <Text style={styleContent.list_cardViewPrimaryValue} > {item.name}  </Text>
                                </Col>
                            </Row>
                        )
                    }

                    {
                        item && item.investment && (
                            <Row>
                                <Col style={styleContent.list_colLabelOnly} >
                                    <Text style={styleContent.list_cardViewPrimaryLabel}  > Investment </Text>

                                </Col>
                                <Col style={styleContent.list_colValue} >
                                    <Text style={styleContent.list_cardViewPrimaryValue} >:   </Text>
                                    <Text style={styleContent.list_cardViewPrimaryValue} > {item.investment}  </Text>
                                </Col>
                            </Row>
                        )
                    }
                     <Row>
                        <Col style={styleContent.list_colLabelOnly} >
                            <Text style={
                                styleContent.list_cardViewPrimaryLabel}  > Status </Text>

                        </Col>
                        <Col style={styleContent.list_colValue} >
                            <Text style={styleContent.list_cardViewPrimaryValue} >:   </Text>
                            <Text style={[styleContent.list_cardViewPrimaryValue,getStatusClass(item.status)]} > {item.status}  </Text>

                        </Col>
                        
                    </Row>

                </Grid>

            )
            */
            return FlatListComponent.getMIListing(item, {getStatusClass});
        }

    }



    render() {
        const { resultSet = [], onSingleItemCliced, getStatusClass, getStatusCircle, getLeadContact } = this.props;
        return (
            <FlatList
                data={resultSet}
                renderItem={({ item }) =>
                    <Row
                        button
                        onPress={() => {
                            // item.id
                            if (onSingleItemCliced) {
                                onSingleItemCliced(item);
                            }
                            /*
                            this.props.navigation.navigate("leaddetails", {
                                leadId: item.id
                            });
                            */
                        }}
                    >
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
    }
}

