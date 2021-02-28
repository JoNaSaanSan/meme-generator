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

const numberOfMemesToLoad = 1;

class BrowseViewComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allMemes: [],
      popularMemes: [],
      hasLoaded: false,
      items: Array.from({ length: 1 }), // initial load -> 1 Meme
      memes2display: [] //while componentDidMount filled with memes sorted by time (getMemesByTime->allMemes)
    }
  }

  fetchMoreData = () => {
    console.log("fetchmoredata")
    console.log("items alt "+ this.state.items.length)
   
    if (this.state.items.length < this.state.memes2display.length) {

        var items = this.state.items;
        items.push("new entry")//concat(Array.from({ length: 1 }))
        this.setState({
          items// 1 Meme is loaded
        });
        console.log("items neu "+ items.length)
    }
  };


  componentDidMount() {
    this.getMemesByTime().then(() => {
      this.getMemesByUpvotes().then(() => {
        this.setState({
          memes2display: this.state.allMemes,
          hasLoaded: true,
        })
      })
    }
    );


    this.props.authenticateUser({ username: localStorage.getItem('username'), email: localStorage.getItem('email'), accessToken: localStorage.getItem('token'), isSignedIn: true })
  }

  /**
   * create Memes in InfinityScroll based on array (changes based on filter options)
   * the initial state is that allMemes are shown sorted by time -> getMemesByTime()
   */
  createMemes() {
    console.log("2display length" + this.state.memes2display.length)
    console.log("items length" + this.state.items.length)
    if (this.state.memes2display.length > 0 && this.state.items.length > 0) {
      
      return (
        this.state.items.map((i, index) => (
          
          <div key={index}>
            {console.log(this.state.memes2display[index])}
            <div><ImageOptionsText meme={this.state.memes2display[index]} index={index} memesArray={this.state.memes2display} /></div>
          </div>
        )))
    }
  }

  /**
   * get Memes Array sorted by time of creation
   */
  getMemesByTime() {
    return new Promise((resolve, reject) => {
      fetch('http://localhost:3000/memes/browsememes').then(response => {
        return response.json();
      })
        .then(data => {
          var reversedData = data.reverse()
          this.setState({ allMemes: reversedData }, () =>
            resolve(reversedData)
          )
        }).catch(error => {
          console.log(error);
        });
    })
  }

  /**
   * get Memes Array sorted by number of upvotes
   */
  getMemesByUpvotes() {
    return new Promise((resolve, reject) => {
      fetch('http://localhost:3000/memes/popularmemes').then(response => {
        return response.json();
      })
        .then(data => {
          this.setState({ popularMemes: data }, () =>
            resolve(data)
          )
        }).catch(error =>
          console.log(error));
    })
  }

  /**
  * styling of tab bar if clicked
  */
  showMemesByTime() {

    //this.getMemesByTime()
    this.setState({ memes2display: this.state.allMemes }) //, () => this.createMemes(this.state.allMemes))
    document.querySelector(".option1-button").setAttribute("style", "background-color: #252525;")
    document.querySelector(".option2-button").setAttribute("style", "background-color: #363636;") //background color

  }
  showMemesByUpvotes() {
    //this.getMemesByUpvotes()
    this.setState({ memes2display: this.state.popularMemes }) //, () => this.createMemes(this.state.popularMemes))
    document.querySelector(".option2-button").setAttribute("style", "background-color: #252525;")
    document.querySelector(".option1-button").setAttribute("style", "background-color: #363636;") //background color

  }

  /**
   * filterArray (image, gif, video)
   */
  showOnly(array, type) {
    var filteredArray = array.filter(meme => meme.memeTemplate.formatType === type);
    this.setState({ items: Array.from({ length: numberOfMemesToLoad }), memes2display: filteredArray })
  }



  render() {
    return (
      <div className="browse_container">
        {(this.state.hasLoaded) ? <div>
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
              hasMore={(this.state.items.length < this.state.memes2display.length)}
              loader={<h4>Loading...</h4>}
              endMessage={
                <p style={{ textAlign: 'center', marginBottom: '50px' }}>
                  <b>Yay! You have seen it all</b>
                </p>
              }>
              {this.createMemes()}

            </InfiniteScroll>
          </div> </div> : <div> </div>}

      </div>
    );
  }
}




export default connect(null, mapDispatchToProps)(BrowseViewComponent);
