import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import Money from 'money-works';
import * as Progress from 'react-native-progress';

class Job extends Component {
  state = {
    currencyEarned: 0,
    jobsComplete: 0,
    progress: 0,
    cost: 12,
    reward: 15,
    disabled: false,
    animated: true,
    timeToComplete: 5000,
  };

  haveEnoughCurrency() {
    return this.props.globalCurrency > this.state.cost
  }

  runProcess = (name) => {
    const reward = 15 // how much you earn for the job

    this.setState({ disabled: true }, this.finishProcess);
    // check if we have enough money
    if (this.haveEnoughCurrency()) {
      // call function that sets a timeout to re-enable button and add money
      this.beginWorking(name);
    }
  }

  checkForUpgrades = () => {
    if (this.state.jobsComplete >= 10) {
      this.setState({ reward: 20, cost: 14 });
    }
    if (this.state.jobsComplete >= 50) {
      this.setState({ reward: 200, cost: 25, timeToComplete: 3000 });
    }
    if (this.state.jobsComplete >= 100) {
      this.setState({ reward: 300, cost: 50, timeToComplete: 2000 });
    }
  }

  beginWorking = async (jobName) => {
    const globalCurrencyAmount = this.props.globalCurrency - this.state.cost;
    this.props.setGlobalCurrency(globalCurrencyAmount);

    this.setState({ progress: 1 });

    await setTimeout(() => {
      const currencyEarned = this.state.currencyEarned + this.state.reward;
      const jobsComplete = this.state.jobsComplete + 1;
      this.setState({ currencyEarned, jobsComplete, progress: 0, disabled: false });
      const newGlobalCurrency = this.props.globalCurrency + this.state.reward;
      this.props.setGlobalCurrency(newGlobalCurrency);
    }, this.state.timeToComplete);

    this.checkForUpgrades()
  }

  render() {
    const buttonStyles = this.state.disabled ? styles.disabled : {};
    return (
      <View>
        <Text>Static Web Page</Text>
        <Text>Pages built: {this.state.jobsComplete}</Text>
        <Text>Cost ${this.state.cost}</Text>
        <Text>Salary: {this.state.reward}</Text>
        <Progress.Bar progress={this.state.progress} width={200} animated={this.state.animated} />
        <Button
          onPress={() => this.runProcess('lvl1')}
          disabled={this.state.disabled}
          title="Build"
          color="#841584"
          style={buttonStyles}
        />
      </View>
    );
  }
}

export default class App extends Component {
  state = {
    currency: 15,
    jobs: {
      job1: {
        name: 'static web page',
        initialRate: 15,
        rateMultiplier: x => Math.pow(1.7, x),
        timeMultiplier: x => Math.pow(1.4, x),
      }
    }
  };

  setGlobalCurrency = (currency) => {
    this.setState({ currency });
  }
    
  render() {
    const currency = new Money(this.state.currency, 'USD');

    return (
      <View style={styles.container}>
        <View style={[styles.container, styles.header]}>
          <Text>TapMoney!</Text>
          <Text>${currency.toString()}</Text>
        </View>
        <View style={[styles.container, styles.body]}>
          <View style={[styles.business]}>
            <Job globalCurrency={this.state.currency} setGlobalCurrency={this.setGlobalCurrency}/>
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
    flex: 3,
    backgroundColor: 'grey',
  },
  disabled: {
    display: 'none',
  }
});
