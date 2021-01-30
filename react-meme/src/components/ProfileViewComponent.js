import profilepic from '../profilepic.png'
import PreviewComponent from './PreviewComponent';
import SliderComponent from './SliderComponent';
const React = require('react');
require('./ProfileViewComponent.css');


class ProfileViewComponent extends React.Component {

  constructor(props) {
    super(props);
    // Init state
    this.state = {
      memesArray: ["https://m.media-amazon.com/images/I/51Ov85BvemL._AC_SY741_.jpg",
       "https://naturschutz.ch/wp-content/uploads/2018/10/cropped-Eichh%C3%B6rnchen--1068x580.jpg",
       "https://www.swr.de/wissen/1000-antworten/umwelt-und-natur/1596174002185,flamingo-zoo-100~_v-16x9@2dXL_-77ed5d09bafd4e3cf6a5a0264e5e16ea35f14925.jpg",
       "https://img.br.de/c73cabf1-ea20-4cbe-8137-1c9d7a7f2a57.jpeg?q=80&rect=327,200,847,477&w=1600&h=900",
       "https://m.media-amazon.com/images/I/51Ov85BvemL._AC_SY741_.jpg",
       "https://www.scinexx.de/wp-content/uploads/s/c/schrumpfeng-1.jpg"]
       }
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
          <SliderComponent memesArray = {this.state.memesArray}/>
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
