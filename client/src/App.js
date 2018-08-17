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
        render: (value, obj) => (
          <label>
            <Toggle
            defaultChecked={value}
            icons={false}
            onChange={this.update(obj.id, 'active')} />
          </label>
        ),
      },
    ];
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
