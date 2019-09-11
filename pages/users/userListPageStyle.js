
import { StyleSheet } from 'react-native';
const styleContent = StyleSheet.create({
    mainContent: {
        flex: 1,
        backgroundColor:"#E8E8E8"
    },
    iconStylingBigger: {
        fontSize: 25
    },
    iconStyling: {
        fontSize: 25,
        color: "#616161"
    },
    searchIcon: {
        paddingRight: 5
    },
    searchBarStyling: {
        width: "90%",
        alignSelf: "center",
        backgroundColor: "white",
        paddingLeft: "5%",
        paddingRight: "5%",
        borderColor: '#999999',

    },
    searchBarWrapper: {
        width: "90%",
    },
    gridWrapper: {
        width: "96%",
        marginBottom: 20,
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
        width: "42%",
        height: 25
    },
    colValue: {
        flexDirection: 'row', flexWrap: 'wrap',
        width:"54%"
    },
    cardViewMainTitle: {
        fontSize: 18,
        fontFamily: 'Montserrat-SemiBold',
        color: "#000000",
        marginBottom: "3%"
    },
    cardViewSecondaryInfo: {
        fontSize: 14,
        fontFamily: 'Montserrat-Regular',
        color: "#555555"
    },
    cardViewPrimaryLabel: {
        fontSize: 14,
        fontFamily: 'Montserrat-Regular',
        color: "#616161"
    },
    cardViewPrimaryValue: {
        fontSize: 14,
        fontFamily: 'Montserrat-SemiBold',
        color: "black"
    },
    closedStatus: {
        fontSize: 14,
        fontFamily: 'Montserrat-SemiBold',
        color: "#21A50E",
        textTransform:"uppercase"
    },
    pendingStatus: {
        fontSize: 14,
        fontFamily: 'Montserrat-SemiBold',
        color: "#F37C57",
        textTransform:"uppercase"
    },
    addLeadFooter: {
        backgroundColor: '#ec2227',
        justifyContent: 'center',
        alignItems: 'center',
        width: '30%',
        borderRadius: 90

    },
    floatingButton: {
        position: "absolute",
        width: 60,
        height: 60,
        borderRadius: 60 / 2,
        backgroundColor: '#EC2227',
        bottom: 60,
        right: 15,
        alignSelf:"flex-end",

    }
});
export default styleContent;