
import { StyleSheet } from 'react-native';
const styleContent = StyleSheet.create({
    mainContent: {
        flex: 1,
        backgroundColor: "#E8E8E8"
    },
    iconStylingBigger: {
        fontSize: 35
    },
    iconStyling: {
        fontSize: 20,
        color: "#616161"
    },
    searchBarStyling: {
        width: "90%",
        alignSelf: "center",
        backgroundColor: "white",
        paddingLeft: "5%",
        paddingRight: "5%",
        borderColor: '#999999'
    },
    searchBarWrapper: {
        width: "90%",
    },
    gridWrapper: {
        width: "96%",
        marginBottom: 20,
        backgroundColor: '#E8E8E8',
        alignSelf: "center"
    },
    gridCardWrapper: {
        width: "96%",
        alignSelf: "center",
        marginTop: "5%",
        marginLeft: "2%",
        marginRight: "2%"
    },
    searchAndFilterWrapper: {
        marginTop: "5%"
    },
    colLabelOnly: {
        width: "40%",
    },
    colValue: {

    },
    cardViewMainTitle: {
        fontSize: 18,
        fontFamily: 'Montserrat-Bold',
        fontWeight: "bold",
        color: "#000000"
    },
    cardViewSecondaryInfo: {
        fontSize: 14,
        fontFamily: 'Montserrat-Bold',
        color: "#AEAEAE"
    },
    cardViewPrimaryLabel: {
        fontSize: 14,
        fontFamily: 'Montserrat-Bold',
        color: "#616161"
    },
    cardViewPrimaryValue: {
        fontSize: 14,
        fontFamily: 'Montserrat-Bold',
        color: "#21A50E"
    },
    addLeadFooter: {
        backgroundColor: '#ec2227',
        justifyContent: 'center',
        alignItems: 'center',
        width: '30%',
        borderRadius: 90

    },
    circular: {
        width: 50,
        height: 50,
        borderRadius: 50 / 2,
        backgroundColor: 'red',
        alignSelf:"flex-end",
        marginRight:"4%",
        marginBottom:"2%"
    },
    floatingButtonView: {
        backgroundColor: "#E8E8E8"
    },
    floatingButton: {
        position: "absolute",
        width: 60,
        height: 60,
        borderRadius: 60 / 2,
        backgroundColor: '#EC2227',
        bottom: 5,
        right: 15,
        alignSelf:"flex-end",
    },
    navTabStyle: {
        fontSize: 16,
        fontFamily: 'Montserrat-Bold',
        textTransform: 'capitalize'
    }
});
export default styleContent;