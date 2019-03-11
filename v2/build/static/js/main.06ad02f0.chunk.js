(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{100:function(e,t,a){e.exports=a.p+"static/media/logo.5d5d9eef.svg"},101:function(e,t,a){},197:function(e,t,a){},200:function(e,t,a){},201:function(e,t,a){},227:function(e,t){},230:function(e,t,a){"use strict";a.r(t);var r=a(0),i=a.n(r),n=a(28),s=a.n(n),o=(a(99),a(9)),l=a(10),c=a(12),m=a(11),p=a(13),d=(a(100),a(101),a(14)),u=a(87),h=a.n(u),w=a(89),E=a.n(w),f=a(52),b=a.n(f),v=a(90),T=a.n(v),g=a(91),y=a.n(g),N={palette:{primary:{light:"#757ce8",main:"#37474f",dark:"#002884",contrastText:"#fff"},secondary:{light:"#ff7961",main:"#f44336",dark:"#ba000d",contrastText:"#000"}}},O={root:{flexGrow:1},grow:{flexGrow:1},menuButton:{marginLeft:-12,marginRight:20},appBar:{backgroundColor:N.palette.primary.main}};var x=Object(d.withStyles)(O)(function(e){var t=e.classes;return i.a.createElement("div",{className:t.root},i.a.createElement(h.a,{position:"static",className:t.appBar},i.a.createElement(E.a,null,i.a.createElement(T.a,{className:t.menuButton,color:"inherit","aria-label":"Menu",onClick:e.toggleFormVisibility.bind(this)},i.a.createElement(y.a,null)),i.a.createElement(b.a,{variant:"h6",color:"inherit",className:t.grow},"KC Cooling Tower Log"))))}),k=a(7),j=a.n(k),W=(a(197),function(e){function t(){return Object(o.a)(this,t),Object(c.a)(this,Object(m.a)(t).apply(this,arguments))}return Object(p.a)(t,e),Object(l.a)(t,[{key:"render",value:function(){return i.a.createElement("div",{className:"towerForm card"},i.a.createElement("div",{className:"formHeader"},this.props.towerName),i.a.createElement("div",{className:"group"},i.a.createElement("input",{id:this.props.towerPrefix+"wo",type:"text",name:"wo"}),i.a.createElement("span",{className:"highlight"}),i.a.createElement("span",{className:"bar"}),i.a.createElement("label",null,"Work Order Number")),i.a.createElement("div",{className:"group"},i.a.createElement("input",{id:this.props.towerPrefix+"pid",type:"text",name:"pid"}),i.a.createElement("span",{className:"highlight"}),i.a.createElement("span",{className:"bar"}),i.a.createElement("label",null,"Product ID")),i.a.createElement("div",{className:"group"},i.a.createElement("input",{id:this.props.towerPrefix+"desc",type:"text",name:"desc"}),i.a.createElement("span",{className:"highlight"}),i.a.createElement("span",{className:"bar"}),i.a.createElement("label",null,"Description")),i.a.createElement("div",{className:"group"},i.a.createElement("div",{className:"input-group date",id:this.props.timePickerId},i.a.createElement("input",{type:"text",className:"form-control"}),i.a.createElement("span",{className:"input-group-addon"},i.a.createElement("span",{className:"glyphicon glyphicon-calendar"})))),i.a.createElement("input",{id:this.props.towerPrefix+"t",type:"datetime-local",hidden:!0}),i.a.createElement("button",{id:"wtsb",type:"button",className:"btn",onClick:this.send.bind(this)},"Add"))}},{key:"send",value:function(){var e=document.getElementById(this.props.towerPrefix+"wo"),t=document.getElementById(this.props.towerPrefix+"pid"),a=document.getElementById(this.props.towerPrefix+"desc"),r=document.getElementById(this.props.towerPrefix+"t"),i={wo:e.value,pid:t.value,desc:a.value,time:r.valueAsNumber,exitTime:r.valueAsNumber+72e5};"at"==this.props.towerPrefix&&(i.exitTime=r.valueAsNumber+75e5),this.props.sendTower(this.props.tower,i),e.value="",t.value="",a.value=""}}]),t}(r.Component)),R=function(e){function t(){return Object(o.a)(this,t),Object(c.a)(this,Object(m.a)(t).apply(this,arguments))}return Object(p.a)(t,e),Object(l.a)(t,[{key:"render",value:function(){return i.a.createElement(j.a,{container:!0,spacing:24,className:this.props.isFormVisible?"":"hidden"},i.a.createElement(j.a,{item:!0,xs:12,lg:6},i.a.createElement(W,{towerName:"Water Tower",timePickerId:"dtpwtt",towerPrefix:"wt",sendTower:this.props.sendTower,tower:"waterTower"})),i.a.createElement(j.a,{item:!0,xs:12,lg:6},i.a.createElement(W,{towerName:"Air Tower",timePickerId:"dtpatt",towerPrefix:"at",sendTower:this.props.sendTower,tower:"airTower"})))}}]),t}(r.Component),I=a(92),A=(a(200),function(e){function t(){var e;return Object(o.a)(this,t),e=Object(c.a)(this,Object(m.a)(t).call(this)),setInterval(function(){e.setState({timeLeft:e.getTimeLeft()})},500),e}return Object(p.a)(t,e),Object(l.a)(t,[{key:"render",value:function(){var e=this;return this.state={timeLeft:this.getTimeLeft()},i.a.createElement("div",{className:this.state.timeLeft<=0?"listItem outOfTime":"listItem"},i.a.createElement("div",{className:"wo"},this.props.item.wo),i.a.createElement("div",{className:"pid"},this.props.item.pid),i.a.createElement("div",{className:"desc"},this.props.item.desc),i.a.createElement("div",{className:"time"},this.formatDateTime(this.props.item.time)),i.a.createElement("div",{className:"exitTime"},this.formatDateTime(this.props.item.exitTime)),i.a.createElement("div",{className:"timer"},this.state.timeLeft<=0?this.formatTime(0):this.formatTime(this.state.timeLeft)),i.a.createElement("img",{src:"./img/baseline-delete-24px.svg",className:"deleteButton",onClick:function(){e.props.deleteEntry(e.props.index,e.props.towerName)}}))}},{key:"getTimeLeft",value:function(){return this.props.item.exitTime-Date.now()}},{key:"formatDateTime",value:function(e){return I.DateTime.fromMillis(e).toISO().substr(0,16).replace("T"," ")}},{key:"formatTime",value:function(e){var t=e/6e4/60,a=e/1e3,r=Math.floor(t),i=Math.floor(60*(t-r)),n=Math.floor(a%60);return r<10&&(r="0"+r),i<10&&(i="0"+i),n<10&&(n="0"+n),r+":"+i+":"+n}}]),t}(r.Component)),C=(a(201),{tableContainer:{width:"100%",backgroundColor:N.palette.primary.main,paddingBottom:"8px"},tableHeader:{width:"100%",color:"white",padding:"8px"},tableBody:{backgroundColor:"white",minHeight:"36px"}}),P=function(e){function t(){return Object(o.a)(this,t),Object(c.a)(this,Object(m.a)(t).apply(this,arguments))}return Object(p.a)(t,e),Object(l.a)(t,[{key:"render",value:function(){var e=this,t=this.props.items.map(function(t,a){return i.a.createElement(A,{className:"tableItem",item:t,key:a,towerName:e.props.towerName,index:a,deleteEntry:e.props.deleteEntry})});return i.a.createElement(j.a,{container:!0,spacing:16},i.a.createElement(j.a,{item:!0,xs:12},i.a.createElement("div",{className:"towerTitle"},this.props.towerTitle),i.a.createElement("div",{className:this.props.classes.tableContainer+" tableContainer"},i.a.createElement("div",{className:this.props.classes.tableHeader},i.a.createElement("div",{className:"wo"},"WO #"),i.a.createElement("div",{className:"pid"},"PID"),i.a.createElement("div",{className:"desc"},"Description"),i.a.createElement("div",{className:"time"},"Time In"),i.a.createElement("div",{className:"exitTime"},"Time Out"),i.a.createElement("div",{className:"timer"},"Time Left")),i.a.createElement("div",{className:this.props.classes.tableBody},t))))}}]),t}(r.Component),B=Object(d.withStyles)(C)(P),S=function(e){function t(){return Object(o.a)(this,t),Object(c.a)(this,Object(m.a)(t).apply(this,arguments))}return Object(p.a)(t,e),Object(l.a)(t,[{key:"render",value:function(){return i.a.createElement(j.a,{container:!0,spacing:24},i.a.createElement(j.a,{item:!0,xs:12,lg:6},i.a.createElement(B,{towerTitle:"Water Tower",items:this.props.towers.WATER_TOWER,deleteEntry:this.props.deleteEntry,towerName:"waterTower"})),i.a.createElement(j.a,{item:!0,xs:12,lg:6},i.a.createElement(B,{towerTitle:"Air Tower",items:this.props.towers.AIR_TOWER,deleteEntry:this.props.deleteEntry,towerName:"airTower"})))}}]),t}(r.Component),F=Object(d.withStyles)({})(S),V=a(93),_=a.n(V),L=function(e){function t(){var e;return Object(o.a)(this,t),(e=Object(c.a)(this,Object(m.a)(t).call(this))).state={towers:{AIR_TOWER:[],WATER_TOWER:[]},isFormVisible:JSON.parse(localStorage.getItem("isFormVisible"))},e.socket=_()("localhost:8000"),e.socket.on("loadAirTower",function(t){e.state.towers.AIR_TOWER=t,console.log(e.state.towers.AIR_TOWER),e.setState(e.state)}),e.socket.on("loadWaterTower",function(t){e.state.towers.WATER_TOWER=t,console.log(e.state.towers.WATER_TOWER),e.setState(e.state)}),e.socket.on("receiveAirTower",function(t){e.addToTower(e.state.towers.AIR_TOWER,t),e.setState(e.state)}),e.socket.on("receiveWaterTower",function(t){e.addToTower(e.state.towers.WATER_TOWER,t),e.setState(e.state)}),e}return Object(p.a)(t,e),Object(l.a)(t,[{key:"addToTower",value:function(e,t){if(0!=e.length)if(t.time>=e[e.length-1].time&&e.push(t),1!=e.length)for(var a=0;a<e.length;a++){var r=e[a];if(t.time<r.time){e.splice(a,0,t);break}}else e[0].time<t.time?e.push(t):e.unshift(t);else e.push(t)}},{key:"sendTower",value:function(e,t){this.socket.emit(e,t)}},{key:"deleteEntry",value:function(e,t){var a=null;"waterTower"==t?a=this.state.towers.WATER_TOWER:"airTower"==t&&(a=this.state.towers.AIR_TOWER);var r=a[e];confirm("Are you sure you want to delete ".concat(r.wo))&&this.socket.emit("deleteEntry",{index:e,towerName:t})}},{key:"render",value:function(){return i.a.createElement("div",null,i.a.createElement(x,{toggleFormVisibility:this.toggleFormVisibility.bind(this)}),i.a.createElement("div",{className:this.props.classes.contentContainer},i.a.createElement(R,{sendTower:this.sendTower.bind(this),isFormVisible:this.state.isFormVisible}),i.a.createElement(F,{towers:this.state.towers,deleteEntry:this.deleteEntry.bind(this)})))}},{key:"toggleFormVisibility",value:function(){var e=!this.state.isFormVisible;this.setState({isFormVisible:e}),localStorage.setItem("isFormVisible",e)}}]),t}(r.Component),D=Object(d.withStyles)({contentContainer:{padding:"16px"}})(L);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));s.a.render(i.a.createElement(D,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})},94:function(e,t,a){e.exports=a(230)},99:function(e,t,a){}},[[94,1,2]]]);
//# sourceMappingURL=main.06ad02f0.chunk.js.map