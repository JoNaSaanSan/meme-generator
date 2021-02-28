import ImageOptionsText from './ImageOptionsText';
import InfiniteScroll from "react-infinite-scroll-component";
import { authenticateUser } from './../redux/action'
import { connect } from 'react-redux';
const React = require('react');
require('./BrowseViewComponent.css');

// Redux: AUTHENTICATE USER
function mapDispatchToProps(dispatch) {
  return {
    authenticateUser: user => dispatch(authenticateUser(user))
  };
}

class BrowseViewComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allMemes: [],
      popularMemes: [],
      
      items: Array.from({ length: 1 }), // initial load -> 1 Meme
      numberOfMemesToLoad: 1, // number of loaded memes after scroll

      hasMoreToLoad: true,
      shownByTime: true,
      memes2display: [] //while componentDidMount filled with memes sorted by time (getMemesByTime->allMemes)
    }
  }


  fetchMoreData = () => {
    console.log("fetchmoredata")
    // a fake async api call like which sends
    // 3 more records in 0.05 
    if( this.state.items.length < this.state.memes2display.length -1){
      this.setState({hasMoreToLoad: true})
        setTimeout(() => {
          this.setState({
            items: this.state.items.concat(Array.from({ length: this.state.numberOfMemesToLoad })) // 1 Meme is loaded
          });
        }, 50);
    }else{
      this.setState({hasMoreToLoad: false})
    }
  };


  componentDidMount() {
    this.getMemesByTime(); 
    this.getMemesByUpvotes();
    this.props.authenticateUser({ username: localStorage.getItem('username'), email: localStorage.getItem('email'), accessToken: localStorage.getItem('token'), isSignedIn: true })

  }


  /**
   * create Memes in InfinityScroll based on array (changes based on filter options)
   * the initial state is that allMemes are shown sorted by time -> getMemesByTime()
   */
  createMemes(){
    var memes2display = this.state.memes2display
    console.log("create memes "+ memes2display)

      if(memes2display.length > 0){
        
        return(
          this.state.items.map((i, index) => (
          <div key={index}>
            <div><ImageOptionsText meme={memes2display[index]} index = {index} memesArray = {memes2display}/></div>
          </div>
        )))
      
    
    }
      

  }

  /**
   * get Memes Array sorted by time of creation
   */
  getMemesByTime(){
    fetch('http://localhost:3000/memes/browsememes').then(response => {
      return response.json();
    })
    .then(data => {
      //console.log("browseMemes data: " + JSON.stringify(data))
      var reversedData= data.reverse()
      this.setState({allMemes: reversedData, memes2display: reversedData})//, () => this.createMemes(this.state.allMemes))
    }).catch(error => {
      console.log(error);
    });
  }

  /**
   * get Memes Array sorted by number of upvotes
   */
  getMemesByUpvotes(){
    fetch('http://localhost:3000/memes/popularmemes').then(response => {
      return response.json();
    })
    .then(data => {
      //console.log("data fromm popularmemes: " + JSON.stringify(data))
      this.setState({popularMemes: data})//, () => this.createMemes(this.state.popularMemes))
    }).catch(error => {
      console.log(error);
    });
  }

  /**
  * styling of tab bar if clicked
  */
  showMemesByTime(){
    
    //this.getMemesByTime()
    this.setState({memes2display: this.state.allMemes}) //, () => this.createMemes(this.state.allMemes))
    document.querySelector(".option1-button").setAttribute("style", "background-color: #252525;")
    document.querySelector(".option2-button").setAttribute("style", "background-color: #363636;") //background color
    
  }
  showMemesByUpvotes(){
    //this.getMemesByUpvotes()
    this.setState({memes2display: this.state.popularMemes}) //, () => this.createMemes(this.state.popularMemes))
    document.querySelector(".option2-button").setAttribute("style", "background-color: #252525;")
    document.querySelector(".option1-button").setAttribute("style", "background-color: #363636;") //background color
    
  }

  /**
   * filterArray (image, gif, video)
   */
  showOnly(array, type){
    
    var filteredArray = array.filter(meme => meme.memeTemplate.formatType == type);
    this.setState({hasMoreToLoad: true, items: Array.from({ length: 1 }), memes2display: filteredArray})
    console.log("moretoload"+ this.state.hasMoreToLoad)
    console.log("filteredArray "+ filteredArray)
    /*
    if(filteredArray.length-1 > this.state.numberOfMemesToLoad){
      this.setState({hasMoreToLoad: true})
    }
    
    else{
      this.setState({hasMoreToLoad: false})
    }*/
    console.log("showOnly")
     //, () => this.createMemes(filteredArray))
    //console.log("memes2display showOnly" + this.state.memes2display)
  }



  render() {
    return (
      <div className="browse_container">
          <div className="imageOptions">
 
            <div className="option1-button" onClick={() => this.showMemesByTime()}>FRESH</div>
            <div className="file-type">
              <p className="filter" onClick={() => this.showOnly(this.state.allMemes, "image")}>- images</p>
              <p className="filter" onClick={() => this.showOnly(this.state.allMemes, "gif")}>- gifs</p>
              <p className="filter" onClick={() => this.showOnly(this.state.allMemes, "video")}>- videos</p>
            </div>
            <div className="option2-button" onClick={() => this.showMemesByUpvotes()}>HOT</div>
            <div className="file-type">
              <p className="filter" onClick={() => this.showOnly(this.state.popularMemes, "image")}>- images</p>
              <p className="filter" onClick={() => this.showOnly(this.state.popularMemes, "gif")}>- gifs</p>
              <p className="filter" onClick={() => this.showOnly(this.state.popularMemes, "video")}>- videos</p>
            </div>
            
          </div>
          <div className="infiniteScroll_container">
            <InfiniteScroll
              dataLength={this.state.items.length}
              next={this.fetchMoreData}
              hasMore={this.state.hasMoreToLoad}
              loader={<h4>Loading...</h4>}
              endMessage={
                <p style={{ textAlign: 'center', marginBottom: '50px' }}>
                  <b>Yay! You have seen it all</b>
                </p>
              }>
              {this.createMemes()}

            </InfiniteScroll>
          </div>
       
      </div>
    );
  }
}




export default connect(null, mapDispatchToProps)(BrowseViewComponent);
