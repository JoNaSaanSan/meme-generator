import profilepic from '../pictures/profilepic.png'
import Store from '../redux/store';
import InfiniteScroll from "react-infinite-scroll-component";
import ImageOptionsText from './ImageOptionsText';
const React = require('react');
require('./ProfileViewComponent.css');


class ProfileViewComponent extends React.Component {

  constructor(props) {
    super(props);
    // Init state
    this.state = {
      accessToken: Store.getState().user.accessToken,
      profileInfo: [],
      memes2display: [],
      items: Array.from({ length: 2 }), // initial load -> 2 Memes
      hasMoreToLoad: true
    }
    this.selectedImage = this.selectedImage.bind(this)
  }
  componentDidMount() { 
    this.getUsersInfo()
  }

  fetchMoreData = () => {
    // a fake async api call like which sends
    // 3 more records in 0.05 
    if( this.state.items.length < this.state.memes2display.length-1){
      
        setTimeout(() => {
          this.setState({
            items: this.state.items.concat(Array.from({ length: 2 })) // 2 Memes are loaded
          });
        }, 50);
    }else{
      this.setState({hasMoreToLoad: false})
    }
  };


  selectedImage(index){
    this.setState({index: index})
  }

  showCreatedMemes(){
    console.log("showcreatedMemes")
  }



  getUsersInfo(){
    var token = this.state.accessToken;
    const requestOptions = {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
      },
    };
    fetch('http://localhost:3000/users/getprofile', requestOptions)
    .then(async response => {
      const data = await response.json()
      console.log("userInfo memes: "+ JSON.stringify(data.memes))
      //return response.json();
      this.setState({ profileInfo: data, memes2display: data.memes});
    })
  }

  showMemes(){
    try{
    if(this.state.memes2display !== undefined && this.state.memes2display.length > 0){
      console.log("memes2display  "+ JSON.stringify(this.state.memes2display))
      console.log("memes2display2 "+ this.state.memes2display.length)
      return(
        this.state.items.map((i, index) => (
          <div  key={index}>
            <div><ImageOptionsText meme={this.state.memes2display[index]} index = {index} className="twoRows"/></div>
          </div>
        ))
      )
    }
  }catch(e){
    console.log(e)
  }

    /*
    return(
    this.state.items.map((i, index) => (
      <div  key={index}>
        div - #{index}
      </div>
    ))
    )*/
  }


  render() {

    return (
    <div className= "container_all">
      <div className= "container_first-field">
        <div className= "container_profile-settings">
          <img className="profile-picture" src={profilepic} />
          <div className="container_nickname">
            <p className="input-label">Nickname</p>
            <input className="input-nickname"/>
          </div>
          <div className="email">email: {this.state.profileInfo.email}</div>
        </div>
      </div>

      

      <div className="container_second-field">
        <div className="tab_container">
          <div className="tab" onClick={()=> this.showCreatedMemes()}>Self Created</div>
          <div className="tab">Drafts</div>
          <div className="tab">Templates</div>
          <div className="tab">Love</div>
          <div className="tab">Comments</div>
        </div> 
      </div>
      <hr className="line"/>

      <div className="container_infiniteScroll">
            <InfiniteScroll
              className= "scroller"
              dataLength={this.state.items.length}
              next={this.fetchMoreData}
              hasMore={this.state.hasMoreToLoad}
              loader={<h4>Loading...</h4>}
              endMessage={
                <p style={{ textAlign: 'center', marginBottom: '50px' }}>
                  <b>Yay! You have seen it all</b>
                </p>
              }>
                {this.showMemes()}
            </InfiniteScroll>
      </div>

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



export default ProfileViewComponent;
