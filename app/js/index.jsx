import React from 'react'
import { render } from 'react-dom'

require('index.scss');

var Sheet = React.createClass({
  getInitialState: function() {
    return {
      delete: false
    };
  },
  render: function() {
    return (
      <div>
        <ul className="sheet">
          <li>
            <div className="label">
              鍵名
            </div>
            <div className="label">
              鍵值
            </div>
          </li>
          {
            this.props.A1.map(function(e, i) {
              return (
                <li key={i}>
                  <div className="input-control text">
                      <input type="text" onChange={this.setA1} data-id={i} id={'1-'+i} value={e} />
                  </div>
                  <div className="input-control text">
                      <input type="number" onChange={this.setA2} data-id={i} id={'2-'+i} value={this.props.A2[i]} />
                  </div>
                  <button style={{transitionDelay:i*0.06+"s"}} onClick={this.deleteItem} data-id={i} className={(this.state.delete)?"button cycle-button vis":"button cycle-button"}><span className="mif-cross" style={{color: 'red'}}></span></button>
                </li>
              );
            }.bind(this))
          }

        </ul>
        <div className='ctl-btns'>
          <button onClick={this.addItem} className="button primary"><span className="mif-plus"></span>增項</button>
          <button onClick={this.showDeleteItem} className="button danger"><span className="mif-bin"></span>刪除</button>
        </div>
      </div>
    );
  },
  addItem: function() {
    this.props.A1.push("");
    this.props.A2.push("");
    this.props.changeData("A1",this.props.A1);
    this.props.changeData("A2",this.props.A2);
  },
  deleteItem: function(e) {
    var id = $(e.currentTarget).data('id');
    for (var i = id; i < this.props.A1.length-1; i++) {
      this.props.A1[i] = this.props.A1[i+1];
      this.props.A2[i] = this.props.A2[i+1];
    }
    this.props.A1.pop();
    this.props.A2.pop();
    this.props.changeData("A1",this.props.A1);
    this.props.changeData("A2",this.props.A2);
  },
  showDeleteItem: function() {
    this.setState({
      delete: !this.state.delete
    });
  },
  setA1: function(e) {
    var id = $(e.target).data("id");
    var val = $(e.target).val();
    this.props.A1[id] = val;
    this.props.changeData("A1",this.props.A1);
  },
  setA2: function(e) {
    var id = $(e.target).data("id");
    var val = $(e.target).val();
    this.props.A2[id] = val;
    this.props.changeData("A2",this.props.A2);
  },
  componentDidMount: function() {

  }
});

var ChartCanvas = React.createClass({
  getInitialState: function() {
    return {
    };
  },
  render: function() {
    return (
      <div>
        <ul className="t-menu">
            <li><a onClick={this.setType} data-type="bar" href="#"><span className="icon mif-chart-bars"></span></a></li>
            <li><a onClick={this.setType} data-type="pie" href="#"><span className="icon mif-chart-pie"></span></a></li>
            <li><a onClick={this.setType} data-type="line" href="#"><span className="icon mif-chart-line"></span></a></li>
        </ul>
        <canvas ref="chart" width="400" height="400"></canvas>
      </div>
    );
  },
  cxt: null,
  chart: null,
  setType: function(e) {
    console.log($(e.currentTarget).data('type'));
    this.props.changeData("type",$(e.currentTarget).data('type'));
  },
  componentDidMount: function() {
    var data = {
      labels: this.props.A1,
      datasets: [{
        label: "Student Score",
        fill: false,
        lineTension: 0.1,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: this.props.A2
      }]
    };
    this.ctx = this.refs.chart;
    setTimeout(function() {
      this.chart = new Chart(this.ctx, {
        type: this.props.type,
        data: data,
        options: {
          xAxes: [{
            display: false
          }]
        }
      });
    }.bind(this),0);
  },
  componentDidUpdate: function() {
    this.chart.destroy();
    var data = {
      labels: this.props.A1,
      datasets: [{
        label: "Student Score",
        fill: false,
        lineTension: 0.1,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: this.props.A2
      }]
    };
    this.chart = new Chart(this.ctx, {
      type: this.props.type,
      data: data,
      options: {
        xAxes: [{
          display: false
        }]
      }
    });
  }
});

var ChartSheet = React.createClass({
  getInitialState: function() {
    return {
      A1: ["其恩", "湧淵", "育安", "信又", "威良"],
      A2: [65, 59, 80, 81, 56],
      type: "bar"
    };
  },
  render: function() {
    return (
      <div className="chart-sheet" ref="holder" >
        <div><ChartCanvas changeData={this.changeData} type={this.state.type} A1={this.state.A1} A2={this.state.A2} /></div>
        <div><Sheet changeData={this.changeData} A1={this.state.A1} A2={this.state.A2} /></div>
        <div className="uploading" ref="upload" ><span className="mif-upload"></span></div>
      </div>
    );
  },
  changeData: function(key,val) {
    this.state[key] = val;
    this.setState(this.state);
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
  componentDidMount: function() {
    var t = [this.saveData,this.openData]
    setMenu(t);

    const holder = this.refs.holder;
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

    ipcRenderer.on('asynchronous-reply', (event, arg) => {
      console.log(arg); // prints "pong"
    });
    ipcRenderer.send('asynchronous-message', 'ping');
  }
});

render(
  <ChartSheet />, document.querySelector(".content-wrapper"));
