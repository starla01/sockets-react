import React, { Component } from 'react';
import socketIOClient from 'socket.io-client'

class App extends Component {
  constructor(){
    super()
    this.state = {
      endpoint: "http://{IP server of ENDPOINT}:4001",
      //endpoint: "http://192.168.11.132:4001",
      color: 'white'
    }
  }

  send = () => {
    const socket = socketIOClient(this.state.endpoint);
    socket.emit('change color', this.state.color);
  }

  setColor = (color) => {
    this.setState({color})
  }

  render() {
    const socket = socketIOClient(this.state.endpoint)
    socket.on('change color', (color) => {
      document.body.style.backgroundColor = color
    })

    return (
      <div style={{ textAlign: "center"}}>
        <button onClick={() => this.send()}>Enviar</button>
        <button id="blue" onClick={() => this.setColor('blue')}>Azul</button>
        <button id="green" onClick={() => this.setColor('green')}>verde</button>
      </div>
    );
  }
}

export default App;
