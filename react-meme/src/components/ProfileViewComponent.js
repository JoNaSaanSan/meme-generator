import profilepic from '../profilepic.png'
import PreviewComponent from './PreviewComponent';
const React = require('react');
require('./ProfileViewComponent.css');


class ProfileViewComponent extends React.Component {

  constructor(props) {
    super(props);
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
      </div>

      <div className= "container_right">
        <div className= "container_memes">
          <h2 className="title">Generated Images</h2>
        </div>

        <div className= "container_memes">
          <h2 className="title">Favourite Images</h2>
        </div>
      </div>

    </div>
    )
  }
}




export default ProfileViewComponent;
