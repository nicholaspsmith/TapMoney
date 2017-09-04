import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import * as Progress from 'react-native-progress';
import _ from 'lodash';

import { midas } from '../shared/util';

class Job extends Component {
  state = {
    jobsComplete: 0,
    currencyEarned: 0,
    progress: 0,
    disabled: false,
    animated: true,
    start: null,
    elapsed: 0,
    data: undefined,
  };

  setInitialData() {
    this.checkForUpgrades(0);
  }

  startTimer = async () => {
    await this.setState({ start: new Date() })
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
    const progress = diffInMillis / this.state.data.timeToComplete
    await this.setState({ progress })
  }

  haveEnoughCurrency() {
    return this.props.globalCurrency > this.state.data.cost
  }

  runProcess = async (name) => {
    if (this.haveEnoughCurrency()) {
      await this.setState({ disabled: true });
      this.beginWorking(name);
    }
  }

  checkForUpgrades = (jobsComplete) => {
    const currentLevel = _.filter(this.props.data, obj => obj.unlockAt <= this.state.jobsComplete).reverse()[0]
    this.setState({ data: currentLevel });
  }

  beginWorking = async () => {
    console.log(`this.state.data.timeToComplete ${this.state.data.timeToComplete}`)
    const globalCurrencyAmount = this.props.globalCurrency - this.state.data.cost;
    this.props.setGlobalCurrency(globalCurrencyAmount);
    
    let jobsComplete;
    this.startTimer()
    await setTimeout(() => {
      const currencyEarned = this.state.currencyEarned + this.state.data.reward;
      jobsComplete = this.state.jobsComplete + 1;
      this.setState({ currencyEarned, jobsComplete, disabled: false });

      const newGlobalCurrency = this.props.globalCurrency + this.state.data.reward;
      this.props.setGlobalCurrency(newGlobalCurrency);

      this.clearTimer()
    }, this.state.data.timeToComplete);

    this.checkForUpgrades(jobsComplete)
  }

  componentWillMount() {
    this.setInitialData();
  }

  render() {
    const { textstyle, viewStyle } = styles;
    const cost = typeof this.state.data !== 'undefined' ? this.state.data.cost : 0;
    const reward = typeof this.state.data !== 'undefined' ? this.state.data.reward : 0;

    return (
      <View style={viewStyle}>
        <Text style={textstyle}>Sell Book</Text>
        <Text style={textstyle}>Units Sold: {this.state.jobsComplete}</Text>
        <Text style={textstyle}>Cost ${midas(cost)}</Text>
        <Text style={textstyle}>Profit: ${midas(reward)}</Text>
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

Job.propTypes = {
  data: PropTypes.array.isRequired,
};

export default Job;
