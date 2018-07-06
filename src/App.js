import React, { Component } from 'react';
import socketIOClient from 'socket.io-client'

class App extends Component {
  constructor(){
    super()
    this.state = {
      //endpoint: "http://{IP server of ENDPOINT}:4001",
      endpoint: "http://192.168.14.160:4001",
      color: 'white',
      person: '',
      message: '',
      conversation: []
    }
  }

  send = () => {
    const socket = socketIOClient(this.state.endpoint);
    socket.emit('change color', this.state.color);
  }

  setColor = (color) => {
    this.setState({color})
  }

  setName  = () => {
    var person = prompt("Introduce tu nombre para la sala de Chat", "");
    if (person != null) {
      this.setState({person})
    }
  }
  cleanText = () => {

  }
  handleMessage = (e) =>{
    var _this = this;
    var message = e.target.value;
    

    if(e.keyCode === 13){
      e.target.value = '';
      const socket = socketIOClient(this.state.endpoint)
      socket.emit('chat', message)

    }
  }
  componentDidMount(){
    this.setName();

    var messages = this.state.conversation;
    const socket = socketIOClient(this.state.endpoint)
    socket.on('chat', (msg) => {
      messages.push(msg);
      this.setState({conversation: messages})
    });

  }
  render() {
    
    let datos = this.state.conversation.length ? this.state.conversation.map((data, key) => { 
      var long = data.length
      return <div className="envolveMsg"><span id={key} style={{textAlign: 'center', float: long > 40 ? 'right' : 'none'}} className="message" key={key}>{data}</span></div>
    }) : null;

    console.log(datos)
    return (
      <div style={{ textAlign: "center"}}>
        {/* <button onClick={() => this.send()}>Enviar</button>
        <button id="blue" onClick={() => this.setColor('blue')}>Azul</button>
        <button id="green" onClick={() => this.setColor('green')}>verde</button> */}
        <div id="header"></div>
        <div id="content">
            <div id="colLeft"></div>
            <div id="colCenter">
                <div id="chat">
                  <div className="chatTitle">
                    <span className="name">{this.state.person}</span>
                  </div>
                  <div className="conversation">
                    {datos}
                  </div>
                  <div className="messageContainer">
                    <input type="text"
                      className="message" 
                      placeholder="Escribe un mensaje..."
                      onKeyUp={ (e) => this.handleMessage(e)}
                     />
                  </div>
                </div>
            </div>
            <div id="colRight"></div>
        </div>
        <div id="footer"></div>
      </div>
    );
  }
}

export default App;
