/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text} from 'react-native';
import {View} from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class App extends Component {
  render() {
    return (
      <View >
        <Text style={{
          marginTop:"30%",
          fontSize:43
        }}> Test Project 0.0.16 !! </Text>
        <Icon name="arrow-forward" style={{ color: "black", fontSize: 20 }} />
      </View>
    );
  }
}
