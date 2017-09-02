import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import * as Progress from 'react-native-progress';

import { midas } from '../shared/util';

export default class Job extends Component {
  state = {
    currencyEarned: 0,
    jobsComplete: 0,
    progress: 0,
    cost: 50,
    reward: 150,
    disabled: false,
    animated: true,
    timeToComplete: 4000,
  };

  haveEnoughCurrency() {
    return this.props.globalCurrency > this.state.cost
  }

  runProcess = () => {
    if (this.haveEnoughCurrency()) {
      this.setState({ disabled: true }, this.finishProcess);
      // check if we have enough money
      // call function that sets a timeout to re-enable button and add money
      this.beginWorking();
    }
  }

  checkForUpgrades = (jobsComplete) => {
    if (jobsComplete >= 10) {
      this.setState({ reward: 50, cost: 30 });
    }
    if (jobsComplete >= 20) {
      this.setState({ reward: 500, cost: 100, timeToComplete: 3000 });
    }
    if (jobsComplete >= 50) {
      this.setState({ reward: 1000, cost: 120, timeToComplete: 2000 });
    }
    if (jobsComplete >= 100) {
      this.setState({ reward: 1200, cost: 150, timeToComplete: 1000 });
    }
  }

  beginWorking = async (jobName) => {
    const globalCurrencyAmount = this.props.globalCurrency - this.state.cost;
    this.props.setGlobalCurrency(globalCurrencyAmount);

    this.setState({ progress: 1 });

    let jobsComplete = 0;

    await setTimeout(() => {
      const currencyEarned = this.state.currencyEarned + this.state.reward;
      jobsComplete = this.state.jobsComplete + 1;
      this.setState({ currencyEarned, jobsComplete, progress: 0, disabled: false });
      const newGlobalCurrency = this.props.globalCurrency + this.state.reward;
      this.props.setGlobalCurrency(newGlobalCurrency);
    }, this.state.timeToComplete);

    this.checkForUpgrades(jobsComplete)
  }

  render() {
    const { textstyle, viewStyle } = styles;
    return (
      <View style={viewStyle}>
        <Text style={textstyle}>Sell Online Course</Text>
        <Text style={textstyle}>Units Sold: {this.state.jobsComplete}</Text>
        <Text style={textstyle}>Cost ${midas(this.state.cost)}</Text>
        <Text style={textstyle}>Profit: ${midas(this.state.reward)}</Text>
        <Progress.Bar progress={this.state.progress} width={200} animated={this.state.animated} indeterminate={this.state.disabled}/>
        <Button
          onPress={() => this.runProcess()}
          disabled={this.state.disabled}
          title="Tap!"
          color="#841584"
        />
      </View>
    );
  }
}

const styles = {
  viewStyle: {
    marginTop: 15,
  },
  textstyle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  }
}