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
      shownByTime: true,
      items: Array.from({ length: 2 }), // initial load -> 2 Memes
      hasMoreToLoad: true
    }
  }


  fetchMoreData = () => {
    // a fake async api call like which sends
    // 3 more records in 0.05 
    if( this.state.items.length < this.state.allMemes.length-1){
      
        setTimeout(() => {
          this.setState({
            items: this.state.items.concat(Array.from({ length: 2 })) // 2 Memes are loaded
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
   * create Memes in InfinityScroll based on if "hot"(popularMemes) or "fresh"(allMemes sorted by time) is clicked
   * the initial state is that allMemes are shown sorted by time
   */
  createMemes(){
    if(this.state.shownByTime === true){
      if(this.state.allMemes.length > 0){
        
        return(
          this.state.items.map((i, index) => (
          <div  key={index}>
            <div><ImageOptionsText meme={this.state.allMemes[index]} index = {index}/></div>
          </div>
        )))
      }
    }

    if(this.state.shownByTime === false){
      if(this.state.popularMemes.length > 0){

        return(
          this.state.items.map((i, index) => (
          <div  key={index}>
            <div><ImageOptionsText meme={this.state.popularMemes[index]} index = {index}/></div>
          </div>
        )))
      }
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
      //console.log("data: " + JSON.stringify(data))
      this.setState({allMemes: data.reverse()})//, () => this.createMemes(this.state.allMemes))
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
      //console.log("data popularmemes: " + JSON.stringify(data))
      this.setState({popularMemes: data})//, () => this.createMemes(this.state.popularMemes))
    }).catch(error => {
      console.log(error);
    });
  }


  showMemesByTime(){
    this.setState({shownByTime: true})
    this.getMemesByTime()
    document.querySelector(".option1-button").setAttribute("style", "background-color: #252525;")
    document.querySelector(".option2-button").setAttribute("style", "background-color: #363636;") //background color
  }

  showMemesByUpvotes(){
    this.setState({shownByTime: false})
    this.getMemesByUpvotes()
    document.querySelector(".option2-button").setAttribute("style", "background-color: #252525;")
    document.querySelector(".option1-button").setAttribute("style", "background-color: #363636;") //background color
  }




  render() {
    return (
      <div className="browse_container">
          <div className="imageOptions">
 
            <div className="option1-button" onClick={() => this.showMemesByTime()}>FRESH</div>
            <div className="option2-button" onClick={() => this.showMemesByUpvotes()}>HOT</div>
            
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
