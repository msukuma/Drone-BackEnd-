import React, { Component } from 'react';
import {
  host,
  webPort,
  dronesPath
} from './shared';
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
        render: (value) => value ? value.toString() : '...waiting',
      },
    ];

    this.getDevices();
  }

  getDevices() {
    fetch(`http://${host}:${webPort}${dronesPath}`)
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

  initWebSocket() {
    const socket = new WebSocket('ws://0.0.0.0:8001');

    // Connection opened
    socket.addEventListener('open', function (event) {
        socket.send('Hello Server!');
      });

    // Listen for messages
    socket.addEventListener('message', function (event) {
        console.log('Message from server ', event.data);
      });
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
