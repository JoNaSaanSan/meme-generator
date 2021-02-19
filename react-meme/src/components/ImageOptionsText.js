import upvote from '../pictures/upvote.png'
import downvote from '../pictures/downvote.png'
import comments from '../pictures/comments.png'
import share from '../pictures/share.png'
import download from '../pictures/download.png'
const React = require('react');
require('./ImageOptionsText.css');


class ImageOptionsText extends React.Component {
    state = {  }

    upvote(){
        console.log("upvote");
        var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MDJhZTM1OTc5OWQ4MDJkYjA4YTRjOGQiLCJpYXQiOjE2MTM0Nzg0MjEsImV4cCI6MTYxMzU2NDgyMX0.UCmL0JPFKC8QY5-cInYNDxmLDe7Qh0GpFMwcwOSVqes"
        const requestOptions = {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'x-access-token': token
            },
            body: this.props.meme.id
          };
        fetch('http://localhost:3000/memes/upvote', requestOptions)
        .then(response => {
            return response.json();
        })
    }

    downvote(){
        console.log("downvote");
    }

    numberOfComments(){
        if(this.props.meme.comments != undefined){
            return this.props.meme.comments.length
        }
        else{
            return 0
        }
    }

    commit(){
        console.log("make a commit")
        return(
            <div>Testen</div>
        )
    }


    render() { 
        return (
            <div className= "container">
                <div className= "user-date_container">
                    <p className="username">Username</p>
                    <p className="date">{this.props.meme.dateCreated}</p>
                </div>
                <div className= "above-image_container">
                    
                        <h1 className="image-titel">{this.props.meme.title}</h1>
                    
                    <div className="options-top_container">
                        <div className="share-download">
                            <button className="option-button"> <img src= {download} className="icon"/> </button>
                            <button className="option-button"> <img src= {share} className="icon"/> </button>
                        </div>
                    </div>
                </div>
                <div className="image_container">
                    <img src= {this.props.meme.base64} className="image" />
                </div>
                <div className="points-commits">
                    <p className= "voting-point">Points: {this.props.meme.upvotes + this.props.meme.downvotes} </p>
                    <p className= "voting-point">Comments: {this.numberOfComments()}</p>
                </div>
                <div className="option_container">
                    <button className="option-button"><img src= {upvote} className="icon" onClick={() => this.upvote()}/></button>
                    <button className="option-button"><img src= {downvote} className="icon" onClick={() => this.downvote()}/></button>
                    <button className="option-button"><img src= {comments} className="icon" onClick={() => this.commit()}/></button>
                </div>    
                    

                <div className="comments">
                    <input className="input-text"/>
                    <button className="send">Send</button>
                </div>
                
                
            </div>
        );
    }
}
 
export default ImageOptionsText;