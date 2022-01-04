  import React from 'react';
  import $ from 'jquery'

  function ListOfNews(props){
    return (

      <li id = {props.key}><p class="source-news">{props.SourseNews}</p><div class="information-data"><img src={props.imageofname} class = "NewsImage"></img>
      <a class ="title-news" src ={props.linkSourse}>{props.title}</a></div>
      </li>
    )
  }


  class StockNews extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        news:[],
        linkOfSource:'',
        keyWords:''
      }
      this.preventButton = this.preventButton.bind(this)
      this.inputNews = this.inputNews.bind(this)
    }
    preventButton(e){
      console.log(typeof e.target.href)
      e.preventDefault();
      this.state.linkOfSource= e.target.href
      this.setState(state=>({isLinkClick: !state.isLinkClick
      }))

    }
    inputNews(){
      var findNews = document.getElementById('input_news').value;
      var regex = new RegExp(findNews,'i')
      this.setState({news:[]})
      if(findNews == null){
        this.forceUpdate(this.componentWillMount)
      }
      fetch("https://newsapi.org/v2/top-headlines?q="+findNews+"&apiKey="+process.env.REACT_APP_NEWS_API_KEY)
        .then(res => res.json())
        .then(data =>{
          data['articles'].map((a,b)=>{
              this.setState(state=>({news: [...state.news,a]}));
          }
        )});

    }
    componentDidMount() {
      document.addEventListener('keydown',event=>{
        if(event.keyCode == 13 && document.getElementById('input_news').value != ''){
          this.inputNews();
          this.setState({keyWords: 'Search For ' + "\'" + document.getElementById('input_news').value + "\'"})
          document.getElementById('input_news').value = '';

        }
      });
    }
    componentWillMount(){
      this.setState({news:[]})
      fetch('https://newsapi.org/v2/top-headlines?country=us&apiKey='+process.env.REACT_APP_NEWS_API_KEY)
        .then(res => res.json())
        .then(data =>{
          data['articles'].map((a,b)=>{
            this.setState(state=>({news: [...state.news,a]}))
          })
        });
    }

    render() {

      const {news} = this.state
      let listNews
        listNews = news.map((a,b)=>{return(
        <ListOfNews key ={b} imageofname = {a['urlToImage']}
                title = {a['title']} SourseNews = {a['source']['name']}
                linkSourse = {a['url']} prevent={this.preventButton}
        />)})

      return (
        <div id = "Stock-News">
        <div id = "News-Title">
          <input id="input_news" maxlength="50" type = "text" placeholder="Enter KeyWords" ></input>
          <button class="btn btn-default btn-primary" id ="findingStock" type="submit" onClick={this.inputNews}>Search</button>

        </div>
        <p id = 'resultOfNews'>{this.state.keyWords}</p>
        <ul id = "TheNews">{listNews}</ul>
        </div>
      )
    }
  }







  export default StockNews;
