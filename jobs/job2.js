import React, { Component } from 'react';

import Job from './Job';

const costsAndUpgrades = [
  {
    unlockAt: 0,
    cost: 14,
    reward: 150,
    timeToComplete: 6000,
  },
  {
    unlockAt: 10,
    cost: 75,
    reward: 200,
    timeToComplete: 5000,
  },
  {
    unlockAt: 20,
    cost: 85,
    reward: 215,
    timeToComplete: 4000,
  },
  {
    unlockAt: 50,
    cost: 150,
    reward: 300,
    timeToComplete: 3000,
  },
]


export default class Job2 extends Component {

  render() {
    return (
      <Job
        data={costsAndUpgrades}
        {...this.props}
      />
    );
  }
}

