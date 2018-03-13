import React, { Component } from 'react';
import CpuLoad from './cpuLoad.js'
import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import io from 'socket.io-client';

const socket = io(location.host);
const app = feathers();



class Main extends Component {

  constructor(props){
    super(props);
    this.state = {
      data: [],
      hostname: "",
      x: 0,
    }
  }

  componentDidMount(){
    app.configure(socketio(socket));
    let t = this;
    app.io.on('cpu_load',function(data){
      t.state.data.push({mem: data.memory.percentUsed, y: data.cpu.percentUsed, x: t.state.x})
      if (t.state.data.length > 50)
        t.state.data.shift();

      t.setState({data: t.state.data})
      t.setState({x: t.state.x+1})

    })
    app.io.on('hostname', (hostname) => t.setState({hostname: hostname}));
    app.io.on('connect', () => {console.log("connected")});
  }

  render() {
    return <CpuLoad data={this.state.data} hostname={this.state.hostname}/>;
  }
}

export default Main;
