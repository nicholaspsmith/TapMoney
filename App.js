import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import * as Progress from 'react-native-progress';

import { midas } from './shared/util';
import Job1 from './jobs/job1';
import Job2 from './jobs/job2';
import Job3 from './jobs/job3';

export default class App extends Component {
  state = {
    currency: 15,
  };

  setGlobalCurrency = (currency) => {
    this.setState({ currency });
  }
    
  render() {
    return (
      <View style={styles.container}>
        <View style={[styles.container, styles.header]}>
          <Text style={{ fontSize: 20 }}>${midas(this.state.currency)}</Text>
        </View>
        <View style={[styles.container, styles.body]}>
          <View style={[styles.business]}>
            <Job1 globalCurrency={this.state.currency} setGlobalCurrency={this.setGlobalCurrency}/>
            <Job2 globalCurrency={this.state.currency} setGlobalCurrency={this.setGlobalCurrency}/>
            <Job3 globalCurrency={this.state.currency} setGlobalCurrency={this.setGlobalCurrency}/>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  header: {
    backgroundColor: 'green',
  },
  body: {
    flex: 7,
    backgroundColor: 'white',
  },
});
