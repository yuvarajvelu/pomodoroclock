import React from 'react';
import './App.scss';
import $ from 'jquery';

let timerclock;
//let t;
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
    this.handleClick = this.handleClick.bind(this);
  }
  handleInc() {
    let l = this.state.breaklen;
    len = "";
    if (l<60) {
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
    if (l<60) {
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
    clearInterval(timerclock);
    $(".display").css("color","black");
    $(".display").css("border","2px solid black")
    $("#time-left").text("25:00");
    $(".change").prop("disabled",false);
    document.getElementById("timer-label").innerText = "Session";
    $("#play-pause").removeClass("fa-pause").addClass("fa-play");
    document.getElementById("beep").pause();
    document.getElementById("beep").currentTime = 0;
    len = "";
  }
  handleClick() {
    let c = document.getElementById("play-pause").className;
    let aud = document.getElementById("beep");
    let a = this.state.sessionlen;
    let b = this.state.breaklen; 
    
    if(c==="fa fa-play") {
      $(".change").prop("disabled",true);
      $("#play-pause").removeClass("fa-play").addClass("fa-pause");
      let seslen;
      if(len==="") {
        seslen = this.state.sessionlen + "00";
      } else {
        seslen = len;
      }
      timerclock = setInterval(function timer(){
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
        if(parseInt(seslen)===0) {
          aud.currentTime = 0;
          aud.play();
          if(flag===1) {
            document.getElementById("timer-label").innerText = "Session";
            if(seslen<10) {
              seslen = '0'+a+'00'
            }
            else{
              seslen = a + '00';
            }
            flag = 0;
          }  else {
            document.getElementById("timer-label").innerText = "Break";
            if(seslen<10) {
              seslen = '0'+b+'00'
            }
            else{
              seslen = b + '00';
            }
            flag = 1;
          }
        }
      },1000);
      
    } else if(c==="fa fa-pause") {
      $(".change").prop("disabled",false);
      $("#play-pause").removeClass("fa-pause").addClass("fa-play");
      
      clearInterval(timerclock);
    }
  } 
  render() {
    let min = this.state.sessionlen;
    let time = "";
    if(min>=10) {
      time =`${min}:00`;
    } else {
      time =`0${min}:00`;
    }
    return(
      <div id="pomodoro-clock">
        <h1 className="heading">Pomodoro Clock</h1>
        <div id="break">
          <h2 className="title" id="break-label">Break Length</h2>
          <button type="button" className="change" id="break-decrement" onClick={this.handleDec}><i className="fa fa-arrow-down"></i></button>
          <h2 id="break-length">{this.state.breaklen}</h2>
          <button type="button" className="change" id="break-increment" onClick={this.handleInc}><i className="fa fa-arrow-up"></i></button>
        </div>  
        <section id="session">
            <h2 className="title" id="session-label">Session Length</h2>
            <button type="button" className="change" id="session-decrement" onClick={this.handleDecrement}><i className="fa fa-arrow-down"></i></button>
            <h2 id="session-length">{this.state.sessionlen}</h2>
            <button type="button" className="change" id="session-increment" onClick={this.handleIncrement}><i className="fa fa-arrow-up"></i></button>
        </section>
        <div className="timer">
        <div className="display">
          <h2 id="timer-label">Session</h2>
          <h1 id="time-left">{time}</h1>
        </div>
        <audio id="beep" preload="auto" src="https://goo.gl/65cBl1" />
        <div id="options">
        <button id="start_stop"><i id="play-pause" className="fa fa-play" onClick={this.handleClick} ></i></button>
        <button id="reset"><i className="fa fa-refresh" onClick={this.handleReset}></i></button>
        </div>
      </div>
      </div>
    )
  }
}




export default App;
