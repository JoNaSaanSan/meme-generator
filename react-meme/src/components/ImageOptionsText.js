import upvote from '../pictures/upvote.png'
import downvote from '../pictures/downvote.png'
import comments from '../pictures/comments.png'
import share from '../pictures/share.png'
import download from '../pictures/download.png'
const React = require('react');
require('./ImageOptionsText.css');


class ImageOptionsText extends React.Component {
    state = {  }
    render() { 
        return (
            <div className= "container">
                <div className= "above-image_container">
                    <div className="image-titel">
                        <h1 >Ein wunderschöner Löwe</h1>
                    </div>
                    <div className="options-top_container">
                        <div className="share-download">
                            <button className="option-button"><img src= {download} className="icon"/></button>
                            <button className="option-button"><img src= {share} className="icon"/></button>
                        </div>
                    </div>
                </div>
                <div className="image_container">
                    <img src="https://m.media-amazon.com/images/I/51Ov85BvemL._AC_SY741_.jpg" className="image" />
                </div>
                <div className="points-commits">
                    <p className= "voting-point">Points: 235 </p>
                    <p className= "voting-point">Comments: 10</p>
                </div>
                <div className="option_container">
                    <button className="option-button"><img src= {upvote} className="icon"/></button>
                    <button className="option-button"><img src= {downvote} className="icon"/></button>
                    <button className="option-button"><img src= {comments} className="icon"/></button>
                    
                </div>
            </div>
        );
    }
}
 
export default ImageOptionsText;