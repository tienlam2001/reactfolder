import React from 'react';
import {Line} from 'react-chartjs-2';
import $ from 'jquery';
import {nameCompany,symbolCompany} from './CompanyArray';

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}
var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;
// Function        <-Labels of Chart | Name Of Chart | Data To Draw | PerCent ->
function DataCreator(thePrice,arrayLabels,objectName,dataObject,percentChanged,otherData){
    this.labels = arrayLabels;
    this.labelName = objectName;
    this.priceChange = thePrice;
    this.dataList = dataObject;
    this.percentChange = percentChanged;
    this.otherData = otherData
    this.getData = ()=>{
      return {
        labels: this.labels,
        datasets: [{
            label: this.labelName,
            data: this.dataList,
            backgroundColor: [
                'rgba(123,217,161,0.3)'
            ],
            borderColor: [
                'rgba(100,100,255,0.9)'
            ],
            borderWidth: 1
        }]
      }
    }
    this.newData = (newLabel, newData)=>{
      this.labels.push(newLabel);
      this.dataList.push(newData);
    }
}

// function createTimeFormat(){
//   var date =new Date();
//   return date.getHours() + ":" + date.getMinutes();
// }
function ResultSearch(props){
  return(
    <div id = {props.symbol} onClick = {props.functionClick} class = "result-search"><p class="Company_Name">{props.company}</p><p class="Company_Symbol">{props.symbol}</p> </div>
  )
}
function Graphic(props){
  return (
  <div class = "Chart_Stock_Wrapper">
    <div class="container">
    <Line
    data={props.dataVisual}
    width={100}
    height={90}
    options={{ maintainAspectRatio: true} }/>
      <div class = "Manual-Stock">
        <p class = "Stock-Price" class="belong-to-chart text-center">${props.StockPrice}</p>
        <p class = "Percent-Changing" class="belong-to-chart text-center" style = {{color : props.isNegative}}>{props.percentChange}% (${props.pricechange})</p>
        <p id = {props.identify}  class=  "seeFullMode text-center" onClick={props.fullmode}>{props.isSeeDetail}</p>
      </div>
    </div>
  </div>
  )
}
function restoreCompany(company,symbol){
  return {'company' : company,'symbol' : symbol};
}
class StockFrame extends React.Component {
  constructor(props){
    super(props);
    this.state={
      stockArray:[],
      stockSymbol: 'tsla,voo,jpm,jd,tqqq',
      stockUpdate: true,
      companyArray: [],
      isFullSizeMode: false
    }
    this.updateData = this.updateData.bind(this);
    this.searchEngine = this.searchEngine.bind(this);
    this.searchArray = this.searchArray.bind(this);
    this.seeDetail = this.seeDetail.bind(this)
    this.inputChose = this.inputChose.bind(this);
  }
    componentWillMount(){
      // https://cloud.iexapis.com/stable/stock/market/batch?types=quote,chart&symbols="+this.state.stockSymbol+"&token="+process.env.REACT_APP_STOCK_API_KEY

      fetch("https://sandbox.iexapis.com/stable/stock/market/batch?types=quote,chart&symbols="+this.state.stockSymbol+"&token="+process.env.REACT_APP_SANDBOX)
    .then(response => response.json())
    .then(data=>{
      var arrayOfKeys = Object.keys(data);
      arrayOfKeys.map(a=>{
          this.setState(state=>({
            stockArray:[...state.stockArray,
              new DataCreator(
                data[a]['quote']['change'],
                [data[a]['quote']['latestTime']],
              data[a]['quote']['symbol'],[data[a]['quote']['latestPrice'].toFixed(2)],
              (data[a]['quote']['changePercent']*100).toFixed(2),
              [{'high':data[a]['chart'][data[a]['chart'].length - 1]['high']},
              {'low':data[a]['chart'][data[a]['chart'].length - 1]['low']},
              {'avgTotalVolume':data[a]['quote']['avgTotalVolume'].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")},
              {'iexVolume': data[a]['chart'][data[a]['chart'].length - 1]['volume'].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")},
              {'week52High':data[a]['quote']['week52High']},
              {'week52Low':data[a]['quote']['week52Low']},
              {'peRatio':data[a]['quote']['peRatio']}]
            )
            ]
          }))
      })
    })
    .catch(error=>{
      this.searchEngine();
      this.setState({isFullSizeMode: false})
    })

    }
  seeDetail(e){
    if(!this.state.isFullSizeMode){
      $(document).ready(function(){
        $('#stockFrame').css('width','100vw');
        $('#Stock-News').css('display','none');
        $('#theMarket').css('width','100vw');
        $('.Chart_Stock_Wrapper').css('border','none');

      });

      this.state.stockArray.map(a=>{
        if(a['labelName'] == e.target.id){
          this.setState(state=>({stockArray:[a]}))
        }
      });
  }else{
    $(document).ready(function(){
      var screenWidth = window.innerWidth;
      var screenHeight = window.innerHeight;

      if(screenWidth < 800 && screenHeight < 800 ){
        $('#stockFrame').css('width','100vw');
        $('#Stock-News').css('display','hidden');
        $('#theMarket').css('width','100vw');
        $('.Chart_Stock_Wrapper').css('border','none')
      }else{
        $('#stockFrame').css('width','50vw');
        $('#Stock-News').css('display','block');
        $('#theMarket').css('width','50vw');
        $('.Chart_Stock_Wrapper').css('border','1px solid rgba(123,217,161,1)')
      }

    });
    // this.searchEngine();
  }
  this.setState(state=>({companyArray:[],isFullSizeMode:!state.isFullSizeMode}));


  }
  componentDidMount(){
    if(this.state.stockUpdate){
      var timer = setInterval(this.updateData,300000);
    }else{
      clearInterval(timer);
    }

    document.addEventListener('keydown', event=>{
      if(event.keyCode == 13 && document.getElementById('input_stock').value != ""){
        this.searchEngine();
        document.getElementById('input_stock').value = ""
      }

    });

  }
  searchArray(e){
    this.setState({companyArray:[]})
    if(e.target.value == ''){
      this.setState({companyArray:[]})
    }else{
    var regex = new RegExp("^"+e.target.value, 'i')
    for(let i = 0; i < nameCompany().length ; i++){
      if(regex.test(nameCompany()[i]) || regex.test(symbolCompany()[i])){
        this.setState(state=>({
          companyArray: [...state.companyArray,restoreCompany(nameCompany()[i],symbolCompany()[i])]
        }));
      }
    }

    }
  }
  searchEngine(){
    var inputValue = document.getElementById('input_stock').value;
    if(inputValue==''){
      this.setState({stockSymbol:'fb,googl,tsla',stockArray:[],companyArray:[]})
      this.forceUpdate(this.componentWillMount)
    }else{
      this.setState({stockSymbol:inputValue,stockArray:[],companyArray:[]})
      this.forceUpdate(this.componentWillMount)

    }
    document.getElementById('input_stock').value = '';

  }
  inputChose(e){
    document.getElementById('input_stock').value = e.target.id;
    this.searchEngine();
    document.getElementById('input_stock').value = '';
    this.setState({companyArray:[]})

  }
  updateData(){
    fetch("https://sandbox.iexapis.com/stable/stock/market/batch?types=quote,chart&symbols="+this.state.stockSymbol+"&token="+process.env.REACT_APP_SANDBOX)
    // https://cloud.iexapis.com/stable/stock/market/batch?types=quote,chart&symbols="+this.state.stockSymbol+"&token="+process.env.REACT_APP_STOCK_API_KEY
  .then(response => response.json())
  .then(data=>{
    this.state.stockArray.map(a=>{
      console.log(data[a['labelName']]['chart'][data[a['labelName']]['chart'].length-1])
      if(a['labels'].length >= 5){
        a['labels'].shift();
        a['dataList'].shift();
      }
      if(data[a['labelName']]['quote']['isUSMarketOpen'] == false){
        this.setState({stockUpdate:false})
      }else{
        this.setState({stockUpdate:true});
        if(!this.state.isFullSizeMode){
          a['priceChange'] = data[a['labelName']]['quote']['change'];
          a['labels'] = [...a['labels'],data[a['labelName']]['quote']['latestTime']];
          a['dataList'] = [...a['dataList'],data[a['labelName']]['quote']['latestPrice'].toFixed(2)]
          a['percentChange'] = (data[a['labelName']]['quote']['changePercent'] * 100).toFixed(2) ;

        }else{
          a['priceChange'] = data[a['labelName']]['quote']['change'];
          a['labels'] = [...a['labels'],data[a['labelName']]['quote']['latestTime']];
          a['dataList'] = [...a['dataList'],data[a['labelName']]['quote']['latestPrice'].toFixed(2)];
          a['percentChange'] = (data[a['labelName']]['quote']['changePercent'] * 100).toFixed(2) ;
          a['otherData'][0]['high'] = data[a['labelName']]['chart'][data[a['labelName']]['chart'].length-1]['high'];
          a['otherData'][1]['low'] = data[a['labelName']]['chart'][data[a['labelName']]['chart'].length-1]['low'];
          a['otherData'][2]['avgTotalVolume'] = data[a['labelName']]['quote']['avgTotalVolume'].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
          a['otherData'][3]['iexVolume'] = data[a['labelName']]['chart'][data[a['labelName']]['chart'].length-1]['volume'].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
          a['otherData'][4]['week52High'] = data[a['labelName']]['quote']['week52High'];
          a['otherData'][5]['week52Low'] = data[a['labelName']]['quote']['week52Low'];
          a['otherData'][6]['peRatio'] = data[a['labelName']]['quote']['peRatio'];
        }
      }
    })})
    this.setState(state=>({frames: state.frames + 1}))
  }

  render(){
    let otherDetail;
    const {stockArray} = this.state;
    let result = this.state.companyArray.map((a,b)=>{
      return(
        <ResultSearch functionClick = {this.inputChose} company ={a['company']} symbol = {a['symbol']} key = {a['symbol']}/>
      )
    })
    let frameStock = stockArray.map((a,b)=>{
      if(this.state.isFullSizeMode == true){
        if(a['percentChange'] < 0){
          // This the Display Detail
          otherDetail = <VoidRepeatDetail hello = {a['otherData']}/>
          // This the Display Detail
          // This is the Display Stock Frame
          return(
            <Graphic
            fullmode={this.seeDetail}
            identify = {a['labelName']}
            key = {b}
            pricechange = {a['priceChange']}
            dataVisual = {a.getData()}
            percentChange ={a['percentChange']}
            StockPrice = {a['dataList'][a['dataList'].length - 1]}
            isNegative={"rgb(255,0,0)"}
            isSeeDetail = {"Go Back"}
            />


          )
        }else{
          // This the Display Detail

           otherDetail = <VoidRepeatDetail hello = {a['otherData']}/>
          // This the Display Detail
          // This is the Display Stock Frame

          return(
            <Graphic
            fullmode={this.seeDetail}
            identify = {a['labelName']}
            key = {b}
            dataVisual = {a.getData()}
            pricechange = {a['priceChange']}
            percentChange ={a['percentChange']}
            StockPrice = {a['dataList'][a['dataList'].length - 1]}
            isNegative={"rgb(0,255,0)"}
            isSeeDetail = {"Go Back"}

            />
          )
        }
      }else{
        if(a['percentChange'] < 0){
          // This is the Display Stock Frame
          return(
            <Graphic
            fullmode={this.seeDetail}
            identify = {a['labelName']}
            key = {b}
            dataVisual = {a.getData()}
            pricechange = {a['priceChange']}
            percentChange ={a['percentChange']}
            StockPrice = {a['dataList'][a['dataList'].length - 1]}
            isNegative={"rgb(255,0,0)"}
            isSeeDetail = {"See More"}

            />
          )
        }else{
          // This is the Display Stock Frame
          return(
            <Graphic
            fullmode={this.seeDetail}
            identify = {a['labelName']}
            key = {b}
            dataVisual = {a.getData()}
            pricechange = {a['priceChange']}
            percentChange ={a['percentChange']}
            StockPrice = {a['dataList'][a['dataList'].length - 1]}
            isNegative={"rgb(0,255,0)"}
            isSeeDetail = {"See More"}

            />

          )
        }

      }
    });
    return(
      <div id = "stockFrame">
      <div id = "Title">
      <input id="input_stock" maxlength="50" type = "text" placeholder="Enter Symbols The Company" onKeyUp={this.searchArray}></input>
      <button id ="findingStock" class="btn btn-primary btn-default" type="submit" onClick={this.searchEngine}>Search</button>

      </div>
      {result}
      <div id ="theMarket">
        {frameStock}
      </div>
      <div id = "ExtraDetail">
        {otherDetail}
      </div>
      </div>
    )
  }
}
function DisplayDetail(props){
    return(
      <div class ="OtherDataWrapper">
      <div class ="otherDetailOfCompany"><p class= "titleDetail text-center">High</p><p class="detail_of_Data text-center">${props.high}</p></div>
      <div class ="otherDetailOfCompany"><p class="titleDetail text-center">Low</p><p class="detail_of_Data text-center">${props.low}</p></div>
      <div class ="otherDetailOfCompany"><p class="titleDetail text-center">Avg Volume</p><p class="detail_of_Data text-center">${props.averageVolume}</p></div>
      <div class ="otherDetailOfCompany"><p class="titleDetail text-center">Week 52 High</p><p class="detail_of_Data text-center">${props.highW}</p></div>
      <div class ="otherDetailOfCompany"><p class="titleDetail text-center">Volume</p><p class="detail_of_Data text-center">${props.volume}</p></div>
      <div class ="otherDetailOfCompany"><p class="titleDetail text-center">Week 52 Low</p><p class="detail_of_Data text-center">${props.lowW}</p></div>
      <div class ="otherDetailOfCompany"><p class="titleDetail text-center">peRatio</p><p class="detail_of_Data text-center">${props.peOfRatio}</p></div>
      </div>
    )
}
// <div class ="otherDetailOfCompany"><p class="titleDetail text-center">Volume</p><p class="detail_of_Data text-center">{props.volume}</p></div>



function DisplayMobileDevice(props){
  return(
    <div class ="Mobile_Wrapper">
    <div class ="OtherData_Mobile"><p class="titleDetail_mobile text-center">High : ${props.high}</p></div>
    <div class ="OtherData_Mobile"><p class="titleDetail_mobile text-center">Low : ${props.low}</p></div>
    <div class ="OtherData_Mobile"><p class="titleDetail_mobile text-center">Avg Volume : ${props.averageVolume}</p></div>
    <div class ="OtherData_Mobile"><p class="titleDetail_mobile text-center">Week 52 High : ${props.highW}</p></div>
    <div class ="OtherData_Mobile"><p class="titleDetail_mobile text-center">Volume : ${props.volume}</p></div>
    <div class ="OtherData_Mobile"><p class="titleDetail_mobile text-center">Week 52 Low : ${props.lowW}</p></div>
    <div class ="OtherData_Mobile"><p class="titleDetail_mobile text-center">peRatio : ${props.peOfRatio}</p></div>
    </div>
  )
  // <div class ="OtherData_Mobile"><p class="titleDetail_mobile">Volume : {props.volume}</p></div>

}
// <p class="detail_of_Data text-center">
function VoidRepeatDetail(props){
  var screenWidth = window.innerWidth;
  var screenHeight = window.innerHeight;
  if(screenWidth < 800 && screenHeight < 800 ){
     return( <DisplayMobileDevice
    high = {props.hello[0]['high']}
    low = {props.hello[1]['low']}
    averageVolume = {props.hello[2]['avgTotalVolume']}
    volume =  {props.hello[3]['iexVolume']}
    highW = {props.hello[4]['week52High']}
    lowW = {props.hello[5]['week52Low']}
    peOfRatio = {props.hello[6]['peRatio']}/>
  )
  // volume =  {props.hello[3]['iexVolume']}
  }else{
   return (<DisplayDetail
        high = {props.hello[0]['high']}
        low = {props.hello[1]['low']}
        averageVolume = {props.hello[2]['avgTotalVolume']}
        volume =  {props.hello[3]['iexVolume']}
        highW = {props.hello[4]['week52High']}
        lowW = {props.hello[5]['week52Low']}
        peOfRatio = {props.hello[6]['peRatio']}

      />)
  }
  // volume =  {props.hello[3]['iexVolume']}

}



export default StockFrame;
