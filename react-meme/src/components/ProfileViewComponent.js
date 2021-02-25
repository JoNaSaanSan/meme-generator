import profilepic from '../pictures/profilepic.png'
import Store from '../redux/store';
const React = require('react');
require('./ProfileViewComponent.css');


class ProfileViewComponent extends React.Component {

  constructor(props) {
    super(props);
    // Init state
    this.state = {
      accessToken: Store.getState().user.accessToken,
      profileInfo: {},
       }
    this.selectedImage = this.selectedImage.bind(this)
  }
  componentDidMount() { 
    this.getUsersInfo()
  }

  
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
      console.log("userInfo data: "+ JSON.stringify(data))
      //return response.json();
      this.setState({ profileInfo: data});
    })

  }


  render() {

    return (
    <div className= "container_all">
      <div className= "container_profile-settings">
        <img className="profile-picture" src={profilepic} />
        <div className="container_nickname">
          <p className="input-label">Nickname</p>
          <input className="input-nickname"/>
        </div>
        <div className="email">email: {this.state.profileInfo.email}</div>
      </div>

      

        
      <div className="tab_container">
        <div className="tab" onClick={()=> this.showCreatedMemes()}>Self Created</div>
        <div className="tab">Drafts</div>
        <div className="tab">Templates</div>
        <div className="tab">Love</div>
        <div className="tab">Comments</div>
       
      </div> 
    </div>
    )
  }
}




export default ProfileViewComponent;
