import React from 'react'
import { render } from 'react-dom'

require('index.scss');

var Talk = React.createClass({
  render: function() {
    return (
      <div className={(this.props.data.isYour)?"outer right":"outer"}>
        <div className="box_l" title={(new Date(this.props.data.time)).toLocaleTimeString()}>{this.props.data.content}</div>
      </div>
    )
  }
});

var ChatRoom = React.createClass({
  getInitialState: function() {
    return {
      data: [
        {
          isYour: true,
          content: "通識幫我簽名",
          time: 3414513213
        },
        {
          isYour: false,
          content: "~~",
          time: 3414513213
        },
        {
          isYour: false,
          content: "兔兔",
          time: 3414513213
        },
        {
          isYour: true,
          content: "通識幫我簽名",
          time: 3414513213
        }
      ]
    };
  },
  render: function() {
    return (
      <div className='container'>

        {
          this.state.data.map(function(e,i) {
            return <Talk data={e} key={i} />
          })
        }
        <div className='ctl-panel'>
          <div className="toolbar">
            <button className="toolbar-button info" onClick={this.sendMes} ><span className="mif-rocket"></span></button>
            {/*<button className="toolbar-button"><span className="mif-icon_name"></span></button>*/}
          </div>
          <input type='text' ref='inpTalk' />
        </div>
        <div className="uploading" ref="upload" ><span className="mif-upload"></span></div>
      </div>
    );
  },
  sendMes: function() {
    this.client.write(this.refs.inpTalk.value);
    this.state.data.push({
      isYour: true,
      time: new Date().getTime(),
      content: this.refs.inpTalk.value
    });
    this.setState({
      data: this.state.data
    });
    this.refs.inpTalk.value = "";
  },
  saveData: function() {
    var data = {
      A1: this.state.A1,
      A2: this.state.A2
    };
    dialog.showSaveDialog({},function(path){
      fs.writeFile(path, JSON.stringify(data), (err) => {
        if (!err){
          $.Notify({
              caption: '訊息',
              content: '完成存檔',
              type: 'success'
          });
        }else{
          $.Notify({
              caption: '訊息',
              content: '存檔失敗',
              type: 'alert'
          });
        }
      });
    });
  },
  openData: function() {
    dialog.showOpenDialog({},function(path){
      console.log(path);
      fs.readFile(path[0], 'utf8', (err, data) => {
        console.log(data);
        if (!err){
          $.Notify({
              caption: '訊息',
              content: '載入完成',
              type: 'success'
          });
          var msg = JSON.parse(data);
          this.setState({
            A1: msg.A1,
            A2: msg.A2,
          });
        }else{
          $.Notify({
              caption: '訊息',
              content: '讀取失敗',
              type: 'alert'
          });
        }
      }.bind(this));
    }.bind(this));
  },
  client: null,
  componentDidUpdate: function() {
    $("html, body").animate({ scrollTop: $(document).height() }, "slow");
  },
  componentDidMount: function() {
    //var t = [this.saveData,this.openData]
    //setMenu(t);

    this.client = new net.Socket();
    this.client.connect(9000, location.hash.replace("#",""), function() {
    	console.log('Connected');
    }.bind(this));

    this.client.on('data', function(d) {
      this.state.data.push({
        isYour: false,
        time: new Date().getTime(),
        content: d.toString()
      });
    	this.setState({
        data: this.state.data
      });
    }.bind(this));

    this.client.on('close', function() {
    	console.log('Connection closed');
      $.Notify({
          caption: '訊息',
          content: '對方已離開',
          type: 'info'
      });
    });

    this.refs.inpTalk.onkeyup = function(e) {
      if(e.keyCode === 13){
        this.sendMes();
      }
    }.bind(this);

    const holder = $('html')[0];
    holder.ondragover = () => {
      $(this.refs.upload).addClass('vis');
      return false;
    };
    holder.ondragleave = holder.ondragend = () => {
      $(this.refs.upload).removeClass('vis');
      return false;
    };
    holder.ondrop = (e) => {
      e.preventDefault();
      $(this.refs.upload).removeClass('vis');
      const file = e.dataTransfer.files[0];
      console.log('File you dragged here is', file.path);
      fs.readFile(file.path, 'utf8', (err, data) => {
        console.log(data);
        if (!err){
          $.Notify({
              caption: '訊息',
              content: '載入完成',
              type: 'success'
          });
          var msg = JSON.parse(data);
          this.setState({
            A1: msg.A1,
            A2: msg.A2,
          });
        }else{
          $.Notify({
              caption: '訊息',
              content: '讀取失敗',
              type: 'alert'
          });
        }
      }.bind(this));
      return false;
    };

  }
});

render(
  <ChatRoom />, document.querySelector(".content-wrapper"));
