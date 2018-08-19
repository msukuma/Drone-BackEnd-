import React, { Component } from 'react';
import {
  droneIndex,
  webPort,
  clientPort,
  dronesPath,
} from './shared';
import {
  Table,
  Container,
  Provider,
} from 'rendition';

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
        field: 'speed',
        label: 'Speed (m/s)',
      },
      {
        field: 'moving',
        label: 'Status (past 10s)',
        sortable: true,
        render: s => s ? 'moving' : 'idling',
      },
    ];
  }

  componentDidMount() {
    this.getDevices()
      .then(() => this.initWebSocket());
  }

  getDevices() {
    return fetch(`http://${locahost.host}:${webPort}${dronesPath}`)
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
    const ws = new WebSocket(`ws://${location.host}:${clientPort}`);

    ws.onopen =  () => console.log('WebSocket connection open');
    ws.onmessage =  (event) => {
      const drones = this.state.drones;
      const drone = JSON.parse(event.data);

      drones[droneIndex[drone.id]] = drone;
      this.setState({ drones: drones.slice() });
    };
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
