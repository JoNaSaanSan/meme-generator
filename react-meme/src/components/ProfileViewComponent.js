import profilepic from '../pictures/profilepic.png'
import Store from '../redux/store';
import InfiniteScroll from "react-infinite-scroll-component";
import { authenticateUser } from './../redux/action';
import { connect } from 'react-redux';
import ImageOptionsText from './ImageOptionsText';
const React = require('react');
require('./ProfileViewComponent.css');

const numberOfMemesToLoad = 1;

// Redux: AUTHENTICATE USER
function mapDispatchToProps(dispatch) {
  return {
    authenticateUser: user => dispatch(authenticateUser(user))
  };
}

class ProfileViewComponent extends React.Component {

  constructor(props) {
    super(props);
    // Init state
    this.state = {
      accessToken: Store.getState().user.accessToken,
      isSignedIn: Store.getState().user.isSignedIn,
      profileInfo: [],

      memes2display: [],
      createdMemes: [],
      favoriteMemes: [],
      commentedMemes: [],


      items: Array.from({ length: 2 }), // initial load -> 2 Memes
      hasLoaded: false,
      hasMoreToLoad: true

    }
  }

  /** 
   * get users meme infos, show info if user is not logged in 
   */
  componentDidMount() {
    if(this.state.isSignedIn === true){
    this.getUsersInfo().then(() => {
      this.setState({
        memes2display: this.state.createdMemes,
        hasLoaded: true,
      })
    })
    console.log("user is logged in")
    }else{console.log("user is noooot logged in")}


    document.getElementById("self-created").setAttribute("style", "color: #FFFFFF;")
   
    /*
        if(this.state.memes2display.length > 1){
          this.setState({items: Array.from({ length: 2 })})
          console.log("größer als 1")
        }
        else{
          this.setState({items: Array.from({ length: 0 })})
          console.log("kleiner als 1")
        }
        */

    this.props.authenticateUser({ username: localStorage.getItem('username'), email: localStorage.getItem('email'), accessToken: localStorage.getItem('token'), isSignedIn: true })

  }

  fetchMoreData = () => {
    console.log("fetchmoredata")
    console.log("items alt " + this.state.items.length)

    if (this.state.items.length < this.state.memes2display.length) {

      var items = this.state.items;
      items.push("new entry")//concat(Array.from({ length: 1 }))
      this.setState({
        items// 1 Meme is loaded
      });
      console.log("items neu " + items.length)
    }
  };


  /**
   * get user infos + created memes
   * {username.., email.., memes: 
   * [{_id.., url.., base64.., title.., creatorId.., upvotes.., downvotes.., visibility.., dateCreated.., memeTemplate: 
   *  {url.., id.., width.., height.., name.., boxCount.., inputBoxes: [{textID.., text.., textPosX.., textPosY.., fontColor..., fontFamily.., fontSize.., outlineWidth.., outlineColor.., isItalic.., isBold.., isVisible.., start.., end.., duration..},{..}]
   * ,drawPaths.., additionalImages.., formatType..}},templates..}
   */
  getUsersInfo() {

    return new Promise((resolve, reject) => {

      var token = this.state.accessToken;
      const requestOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
      };
      fetch('http://localhost:3000/users/getprofile', requestOptions).then(async response => {
        const data = await response.json()
        //console.log("userInfo memes: " + JSON.stringify(data.memes))
        //return response.json();
        this.setState({ profileInfo: data, memes2display: data.memes, createdMemes: data.memes, favoriteMemes: data.upvotes, commentedMemes: data.comments }, () =>
          resolve(data)
        )
      })
    })
  }

  /**
   * create memes based on memes2display array (createdMemes, favoriteMemes, commentedMemes)
   */
  showMemes() {
    try {
      if (this.state.memes2display !== undefined && this.state.memes2display.length > 0) {
        console.log("memes2display  " + JSON.stringify(this.state.memes2display))
        console.log("memes2display2 " + this.state.memes2display.length)
        return (
          this.state.items.map((i, index) => (
            <div key={index}>
              <div><ImageOptionsText meme={this.state.memes2display[index]} index={index} className="twoRows" /></div>
            </div>
          ))
        )
      }
    } catch (e) {
      console.log(e)
    }
  }





  showCreatedMemes() {
    console.log("showcreatedMemes")
    document.getElementById("self-created").setAttribute("style", "color: #FFFFFF;")
    document.getElementById("favorite").setAttribute("style", "color: #757575;")
    document.getElementById("commented").setAttribute("style", "color: #757575;")
    this.setState({ items: Array.from({ length: numberOfMemesToLoad }), memes2display: this.state.createdMemes })

  }


  showFavoriteMemes() {
    document.getElementById("favorite").setAttribute("style", "color: #FFFFFF;")
    document.getElementById("self-created").setAttribute("style", "color: #757575;")
    document.getElementById("commented").setAttribute("style", "color: #757575;")
    this.setState({ items: Array.from({ length: numberOfMemesToLoad }), memes2display: this.state.favoriteMemes })
  }

  showCommentedMemes() {
    document.getElementById("commented").setAttribute("style", "color: #FFFFFF;")
    document.getElementById("self-created").setAttribute("style", "color: #757575;")
    document.getElementById("favorite").setAttribute("style", "color: #757575;")
    //this.setState({memes2display: this.state.commentedMemes})
  }

  showDraftMemes() {
    document.getElementById("drafts").setAttribute("style", "color: #FFFFFF;")
    document.getElementById("self-created").setAttribute("style", "color: #757575;")

  }


  render() {
    Store.subscribe(() => this.setState({ isSignedIn: Store.getState().user.isSignedIn, accessToken: Store.getState().user.accessToken }))
    return (
      <div className="container_all">
        <div className="container_first-field">
          <div className="container_profile-settings">
            <img className="profile-picture" src={profilepic} />
            <div className="container_nickname">
              <p className="input-label">Nickname</p>
              <input className="input-nickname" />
            </div>
            <div className="email">email: {this.state.profileInfo.email}</div>
          </div>
        </div>



        <div className="container_second-field">
          <div className="tab_container">
            <div className="tab" id="self-created" onClick={() => this.showCreatedMemes()}>Self Created</div>
            <div className="tab" id="favorite" onClick={() => this.showFavoriteMemes()}>Love</div>
            <div className="tab" id="commented" onClick={() => this.showCommentedMemes()}>Commented</div>
            <div className="tab" id="drafts" onClick={() => this.showDraftMemes()}>Drafts</div>
          </div>
        </div>
        {/* <hr className="flex-line"/> */}
        <hr className="line" />


        {(this.state.hasLoaded) ? <div>
          <div className="container_infiniteScroll">
            <InfiniteScroll
              className="scroller"
              dataLength={this.state.items.length}
              next={this.fetchMoreData}
              hasMore={(this.state.items.length < this.state.memes2display.length)}
              loader={<h4>Loading...</h4>}
              endMessage={
                <p style={{ textAlign: 'center', marginBottom: '50px' }}>
                  <b>Yay! You have seen it all</b>
                </p>
              }>

              {console.log("memes2display infinite" + this.state.memes2display)}
              {console.log("items infinite" + this.state.items)}
              {this.showMemes()}

            </InfiniteScroll>
          </div></div> : <div className="loading_text">Loading..</div>}

      </div>
    )
  }
}

/*
<div className= "container_all">
      <div className= "container_profile-settings">
        <img className="profile-picture" src={profilepic} />
        <div className="container_nickname">
          <p className="input-label">Nickname</p>
          <input className="input-nickname"/>
        </div>
        <div className="email">email: {this.state.profileInfo.email}</div>
      </div>

*/



export default connect(null, mapDispatchToProps) (ProfileViewComponent);
