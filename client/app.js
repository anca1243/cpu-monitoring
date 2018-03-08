import React from 'react';
import ReactDOM from 'react-dom';
import CpuLoad from './cpuLoad';
import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import io from 'socket.io-client';

const socket = io('http://localhost:3030/');
const app = feathers();

app.configure(socketio(socket));
app.io.on('cpu_load',function(data){
  console.log(data)
})

app.io.on('connect', () => {console.log("connected")})


ReactDOM.render(
  <CpuLoad />
  , document.getElementById('app'));
