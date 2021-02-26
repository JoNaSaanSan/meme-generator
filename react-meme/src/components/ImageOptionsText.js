import upvote from '../pictures/upvote.png'
import downvote from '../pictures/downvote.png'
import comments from '../pictures/comments.png'
import share from '../pictures/share.png'
import download from '../pictures/download.png'
import Store from '../redux/store';
import { Link } from 'react-router-dom'
const React = require('react');
require('./ImageOptionsText.css');


class ImageOptionsText extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            accessToken: Store.getState().user.accessToken,
            isSignedIn: Store.getState().user.isSignedIn,
            upvotes: this.props.meme.upvotes,
            //downvotes: this.props.meme.downvotes,
            currentMeme: this.props.meme,
            index: this.props.index
        };
    }

    componentDidUpdate(prevProps){
        //console.log("upvotes "+ this.state.upvotes)
        /*if(this.props.meme.upvotes !== prevProps.meme.upvotes)
        this.setState({
            upvotes: this.props.meme.upvotes,
            downvotes: this.props.meme.downvotes,
        })*/
        console.log("upvotes profile" + this.props.meme.upvotes)
    }


    upvote() {
        console.log("upvote");

        var token = this.state.accessToken;
        console.log("my token" + token)
        var memeId = this.props.meme._id;
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token,
            },
        };
        fetch('http://localhost:3000/memes/upvote' + "?memeId=" + memeId, requestOptions)
            .then(async response => {
                const data = await response.json()
                console.log("upvotes data"+ JSON.stringify(data))
                //return response.json();
                this.setState({ upvotes: data.upvotes});
            })

    }

    downvote() {
        console.log("downvote");
        var token = this.state.accessToken;
        console.log("my token" + token)
        var memeId = this.props.meme._id;
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token,
            },
        };
        fetch('http://localhost:3000/memes/downvote' + "?memeId=" + memeId, requestOptions)
            .then(async response => {
                const data = await response.json()
                //return response.json();
                this.setState({ downvotes: data.downvotes });
            })

    }

    numberOfComments() {
        if (this.props.meme.comments != undefined) {
            return this.props.meme.comments.length
        }
        else {
            return 0
        }
    }

    commit() {
        console.log("make a commit")
        //var newD  = document.createElement('img');
        //document.querySelector('.commets_container').appendChild(newD);
        return (
            <div>Testen</div>
        )
    }

    selectFormat(){
        if(true){
            return(
                <img src={this.props.meme.base64} className="image"/>
            )
        }
        else{
            return(
                <video src={this.props.meme.base64} className="image" autoplay="true"/>
            )
        }
    }


    render() {
        Store.subscribe(() => this.setState({ isSignedIn: Store.getState().user.isSignedIn, accessToken: Store.getState().user.accessToken }))
        console.log("access: " + this.state.accessToken)
        return (
            <div className="container">
                <div className="user-date_container">
                    <p className="username">Username</p>
                    <p className="date">{this.props.meme.dateCreated}</p>
                </div>
                <div className="above-image_container">

                    <h1 className="image-titel">{this.props.meme.title}</h1>

                    <div className="options-top_container">
                        <div className="share-download">
                            <button className="option-button"> <img src={download} className="icon" /> </button>
                            <button className="option-button"> <img src={share} className="icon" /> </button>
                        </div>
                    </div>
                </div>
                <div className="image_container">
                <Link to={{pathname: "/gallery", index: this.state.index}}><img src={this.props.meme.base64} className="image" /></Link>
                </div>
                <div className="points-commits">
                    <p className="voting-point">Points: {this.state.upvotes} </p>
                    <p className="voting-point">Comments: {this.numberOfComments()}</p>
                </div>
                <div className="option_container">
                    <button className="option-button"><img src={upvote} className="icon" onClick={() => this.upvote()} /></button>
                    <button className="option-button"><img src={downvote} className="icon" onClick={() => this.downvote()} /></button>
                    <Link to={{pathname: "/gallery", index: this.state.index}}><button className="option-button"><img src={comments} className="icon" onClick={() => this.commit()} /></button></Link>
                </div>


            </div>
        );
    }
}

export default ImageOptionsText;