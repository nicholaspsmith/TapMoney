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
    cost: 12,
    reward: 15,
    disabled: false,
    animated: true,
    timeToComplete: 2500,
    start: null,
    elapsed: 0,
  };

  startTimer = async (start) => {
    await this.setState({ start })
    this.timer = setInterval(this.tick, 50);
  }

  clearTimer = async () => {
    clearInterval(this.timer);
    await this.setState({ animated: false });
    await this.setState({ progress: 0 });
    await this.setState({ animated: true });
  }

  tick = async () => {
    const diffInMillis = new Date() - this.state.start
    const progress = diffInMillis / this.state.timeToComplete
    await this.setState({ progress })
  }

  haveEnoughCurrency() {
    return this.props.globalCurrency > this.state.cost
  }

  runProcess = (name) => {
    if (this.haveEnoughCurrency()) {
      this.setState({ disabled: true }, this.finishProcess);
      // check if we have enough money
      // call function that sets a timeout to re-enable button and add money
      this.beginWorking(name);
    }
  }

  checkForUpgrades = (jobsComplete) => {
    if (jobsComplete >= 10) {
      this.setState({ reward: 20, cost: 14 });
    }
    if (jobsComplete >= 12) {
      this.setState({ reward: 20, cost: 10, timeToComplete: 1000 });
    }
    if (jobsComplete >= 30) {
      this.setState({ reward: 200, cost: 25, timeToComplete: 750 });
    }
    if (jobsComplete >= 50) {
      this.setState({ reward: 300, cost: 50, timeToComplete: 500 });
    }
  }

  beginWorking = async (jobName) => {
    const globalCurrencyAmount = this.props.globalCurrency - this.state.cost;
    this.props.setGlobalCurrency(globalCurrencyAmount);

    let jobsComplete;
    this.startTimer(new Date())
    await setTimeout(() => {
      const currencyEarned = this.state.currencyEarned + this.state.reward;
      jobsComplete = this.state.jobsComplete + 1;
      this.setState({ currencyEarned, jobsComplete, disabled: false });
      const newGlobalCurrency = this.props.globalCurrency + this.state.reward;
      this.props.setGlobalCurrency(newGlobalCurrency);
      this.clearTimer()
    }, this.state.timeToComplete);

    this.checkForUpgrades(jobsComplete)
  }

  render() {
    const { textstyle, viewStyle } = styles;

    return (
      <View style={viewStyle}>
        <Text style={textstyle}>Sell Book</Text>
        <Text style={textstyle}>Units Sold: {this.state.jobsComplete}</Text>
        <Text style={textstyle}>Cost ${midas(this.state.cost)}</Text>
        <Text style={textstyle}>Profit: ${midas(this.state.reward)}</Text>
        <Progress.Bar
          progress={this.state.progress}
          width={200}
          animated={this.state.animated}
          animationConfig={{ bounciness: 0 }}
        />
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