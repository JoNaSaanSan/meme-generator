import profilepic from '../pictures/profilepic.png'
import Store from '../redux/store';
import SliderComponent from './Slider/SliderComponent';
const React = require('react');
require('./ProfileViewComponent.css');


class ProfileViewComponent extends React.Component {

  constructor(props) {
    super(props);
    // Init state
    this.state = {
       }
    this.selectedImage = this.selectedImage.bind(this)
  }
  componentDidMount() { 
  }

  




  selectedImage(index){
    this.setState({index: index})
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
        <div className="email">email: </div>
      </div>

      

        
      <div className="tab_container">
        <div className="tab">TAB 1</div>
        <div className="tab">TAB 2</div>
        <div className="tab">TAB 3</div>
      </div>
    </div>
    )
  }
}




export default ProfileViewComponent;
