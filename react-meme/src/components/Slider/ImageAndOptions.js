import upvote from '../../pictures/upvote.png'
import downvote from '../../pictures/downvote.png'
const React = require('react');
require('./ImageAndOptions.css');

class ImageAndOptions extends React.Component {
    state = {  }

    upvote(){
        console.log("upvote")
        this.props.upvote(true);
    }

    downvote(){
        console.log("downvote")
    }
    
    render() { 
        return (  
            <div>
                <div className= "voting-points">Points:</div>
                <div className="options_container">
                    <button className="voting-button" id="upvote" onClick={() => this.upvote()}><img src= {upvote} className="icon"/></button>
                    <button className="voting-button" id="downvote" onClick={() => this.downvote()}><img src= {downvote} className="icon"/></button>
                </div>
            </div>
        )
    }
}
 
export default ImageAndOptions;
