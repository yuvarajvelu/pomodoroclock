import React from 'react';
import './App.scss';
import $ from 'jquery';

let timer = "";
let flag;
let len = ""
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state= {
      breaklen: 5,
      sessionlen: 25
    }
    this.handleDec = this.handleDec.bind(this);
    this.handleInc = this.handleInc.bind(this);
    this.handleDecrement = this.handleDecrement.bind(this);
    this.handleIncrement = this.handleIncrement.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }
  handleInc() {
    let l = this.state.breaklen;
    len = "";
    if (l<=59) {
    this.setState(state=>({
      breaklen : state.breaklen+1
    }));
    }
  }
  handleDec(){
    len = "";
    let l = this.state.breaklen;
    if(l>=2) {
    this.setState(state=>({
      breaklen : state.breaklen-1
    }));
    }
  }
  handleIncrement() {
    len = "";
    let l = this.state.sessionlen;
    if (l<=59) {
    this.setState(state=>({
      sessionlen : state.sessionlen+1
    }));
    }
  }
  handleDecrement(){
    len = "";
    let l = this.state.sessionlen;
    if(l>=2) {
    this.setState(state=>({
      sessionlen : state.sessionlen-1
    }));
    }
  }
  handleReset() {
    clearInterval(timer);
    this.setState({
      breaklen : 5,
      sessionlen : 25
    })
    $("#time-left").text("25:00");
    $(".change").prop("disabled",false);
    document.getElementById("timer-label").innerText = "Session";
    $("#play-pause").removeClass("fa-pause").addClass("fa-play");
    document.getElementById("beep").pause();
    document.getElementById("beep").currentTime = 0;
    len = "";
  }
  render() {
    return(
      <div id="pomodoro-clock">
        <h1 className="heading">Pomodoro Clock</h1>
        <Break breaklen={this.state.breaklen} handleInc={this.handleInc} handleDec={this.handleDec}/>
        <Session sessionlen={this.state.sessionlen} handleIncrement={this.handleIncrement} handleDecrement={this.handleDecrement} />
        <Timer sessionlen={this.state.sessionlen} breaklen={this.state.breaklen} handleReset={this.handleReset}/>
      </div>
    )
  }
}
class Break extends React.Component {
  render(){
    return(
    <div id="break">
      <h2 className="title" id="break-label">Break Length</h2>
      <button type="button" className="change" id="break-decrement" onClick={this.props.handleDec}><i className="fa fa-arrow-down"></i></button>
      <h2 id="break-length">{this.props.breaklen}</h2>
      <button type="button" className="change" id="break-increment" onClick={this.props.handleInc}><i className="fa fa-arrow-up"></i></button>
    </div>  
    )
  }
}
class Session extends React.Component {
  render(){
    return(
      <section id="session">
        <h2 className="title" id="session-label">Session Length</h2>
        <button type="button" className="change" id="session-decrement" onClick={this.props.handleDecrement}><i className="fa fa-arrow-down"></i></button>
        <h2 id="session-length">{this.props.sessionlen}</h2>
        <button type="button" className="change" id="session-increment" onClick={this.props.handleIncrement}><i className="fa fa-arrow-up"></i></button>
      </section>
    )
  }
}
class Timer extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    let c = document.getElementById("play-pause").className;
    let aud = document.getElementById("beep");
    if(c==="fa fa-play") {
      $(".change").prop("disabled",true);
      $("#play-pause").removeClass("fa-play").addClass("fa-pause");
      let seslen;
      if(len==="") {
        seslen = this.props.sessionlen + "00";
      } else {
        seslen = len;
      }
      timer = setInterval(()=>{
        if(seslen%100===0) {
          seslen = seslen - 41; 
        } else {
          seslen = seslen - 1;
        }
        if((seslen<1000)&&(seslen>=100)) {
          seslen = "0"+seslen;
        }
        else if((seslen<100)&&(seslen>=10)) {
          seslen = "00"+seslen;
        } else if(seslen<10) {
          seslen = "000"+seslen;
        }
        seslen = seslen.toString();
        if(parseInt(seslen)<=100) {
          $(".display").css("color","red");
          $(".display").css("border","2px solid red");
        } else {
          $(".display").css("color","black");
          $(".display").css("border","2px solid black");
        }
        len = seslen;
        if(aud.currentTime>1) {
          aud.pause();
        }
        document.getElementById("time-left").innerText = seslen.slice(0,2)+":"+seslen.slice(2);
        console.log(seslen)
        if(parseInt(seslen)===0) {
          aud.play();
          if(flag===1) {
            document.getElementById("timer-label").innerText = "Session";
            seslen = this.props.sessionlen + "00";
            flag = 0;
          }  else {
            document.getElementById("timer-label").innerText = "Break";
            seslen = this.props.breaklen + '00';
            flag = 1;
          }
        }
      },1000);
    } else {
      $(".change").prop("disabled",false);
      $("#play-pause").removeClass("fa-pause").addClass("fa-play");
      clearInterval(timer)
    }
  }
  render() {
    let min = this.props.sessionlen;
    let time = "";
    if(min>=10) {
      time =`${min}:00`;
    } else {
      time =`0${min}:00`;
    }
   
    
    return(
      <div className="timer">
        <div className="display">
          <h2 id="timer-label">Session</h2>
          <h1 id="time-left">{time}</h1>
        </div>
        <audio id="beep" preload="auto" src="https://goo.gl/65cBl1" />
        <div id="options">
        <button id="start_stop"><i id="play-pause" className="fa fa-play" onClick={this.handleClick} ></i></button>
        <button id="reset"><i className="fa fa-refresh" onClick={this.props.handleReset}></i></button>
        </div>
      </div>
    )
  }
}

export default App;
