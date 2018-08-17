import React, { Component } from 'react';
import {
  Table,
  Container,
  Provider,
} from 'rendition';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drones: [],
      ready: false,
    };

    this.columns = [
      {
        field: 'id',
        label: 'Drone Id',
        sortable: true,
      },
      {
        field: 'name',
        label: 'Name',
        sortable: true,
      },
      {
        field: 'location',
        label: 'Location',
        render: (value) => value ? value.toString() : '',
      },
    ];

    this.getDevices();
  }

  getDevices() {
    fetch('http://0.0.0.0:8000/drones')
      .then(res => {
        if (res.ok) {
          return res.json();
        }
      })
      .then(json => {
        if (json) {
          this.setState({
            drones: json.data,
            ready: true,
          });
        }
      })
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div className="App">
        <Provider>
          <Container mt={50}>
            <Table
              columns={this.columns}
              data={this.state.drones}
              rowKey={'id'}
            />
          </Container>
        </Provider>
      </div>
    );
  }
}

export default App;
