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
      conversation: [],
      flagSetting: false,
      colors: [{ "color": "#0084ff"},{ "color": "#54c7ec"},{ "color": "#f5c33a"},{ "color": "#f45368"},{ "color": "#d696bc"},{ "color": "#7496c8"},{ "color": "#42b72b"},{ "color": "#f7913a"},{ "color": "#e68484"},{ "color": "#e68484"},{ "color": "#8c71cc"},{ "color": "#53c8ec"},{ "color": "#a3ce70"},{ "color": "#cfa588"},{ "color": "#af9bda"}],
      selectedColor: '#4483fb',
      idLocalPerson: null,
      listUsers: [],
      typping: ''
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
      const ID = Math.floor(Math.random() * 99999) + 1
      this.setState({person: person, idLocalPerson: ID})
      const socket = socketIOClient(this.state.endpoint)
      socket.emit('ID person', ID + '|' + person)
      socket.emit('ID', ID);
    }
  }

  emitTypping = (e) => {
    console.log(this.state.person)
    const socket = socketIOClient(this.state.endpoint)
      socket.emit('writing', this.state.person)
  }
  stopTypping = () => {
    const socket = socketIOClient(this.state.endpoint)
      socket.emit('writing', '')
  }
  handleMessage = (e) =>{
    var _this = this;
    var message = e.target.value;

    if(e.keyCode === 13){
      e.target.value = '';
      const socket = socketIOClient(this.state.endpoint)
      socket.emit('chat', this.state.idLocalPerson + '|' + this.state.selectedColor + '|' + this.state.person + '|' + message)
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

    socket.on('writing', (typping) => {
      typping ? this.setState({typping: typping + ' esta escribiendo...'}) :  this.setState({typping: ''})
      
    })
  }
  handleSettings = () => {
    this.setState({flagSetting: !this.state.flagSetting})
  }
  selectColor = (color) => {
    this.setState({selectedColor: color})
    const socket = socketIOClient(this.state.endpoint)
    socket.emit('change color', this.state.idLocalPerson + '|' + color)
  }
  render() {
    console.log(this.state.conversation)
    let datos = this.state.conversation.length ? this.state.conversation.map((data, key) => { 
      var long = data.length
      return <div className="envolveMsg">
                <span id={key} 
                      style={{textAlign: 'center', float: long > 40 ? 'right' : 'none'}} 
                      className="message" style={{ backgroundColor: data.split('|')[1] ?  data.split('|')[1] : this.state.selectedColor }} 
                      key={key}>
                      <span className="letter">{data.split('|')[2].substring(0,1)}</span>{data.split('|')[3]}</span>
                </div>
    }) : null;

    const colors = this.state.colors.map((col) => {
      return <div
        className="color" 
        style={{ backgroundColor: col.color}}
        onClick={() => this.selectColor(col.color)}
      ><i className="material-icons icon">done</i></div>
    })

    const popup = this.state.flagSetting ? (
        <div className="settings">
          <div className="winSettings">
              <div className="titleSettings">
                <span>Selcciona un color</span>
                <i className="material-icons icon" onClick={() => this.handleSettings()}>clear</i>
              </div>
              <div className="colorsContainer">
                {colors}
              </div>
          </div>
        </div>
    ) : null;

    console.log(datos)
    return (
      <div style={{ textAlign: "center"}}>
        { popup }
        <div id="header"></div>
        <div id="content">
            <div id="colLeft"></div>
            <div id="colCenter">
                <div id="chat">
                  <div className="chatTitle" style={{ backgroundColor: this.state.selectedColor ? this.state.selectedColor : '#4080ff' }}>
                    <span className="name">{this.state.person}</span>
                    <i className="material-icons icon" onClick={() => this.handleSettings()}>settings</i>
                  </div>
                  <div className="conversation">
                    {datos}
                  </div>
                  <div className="messageContainer">
                    <input type="text"
                      className="message" 
                      placeholder= {this.state.typping !== '' ? this.state.typping : "Escribe un mensaje..." }
                      onKeyUp={ (e) => this.handleMessage(e)}
                      onKeyPress={(e) => this.emitTypping(e)}
                      onBlur={() => this.stopTypping()}
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
