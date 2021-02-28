import upvote from '../pictures/upvote.png'
import downvote from '../pictures/downvote.png'
import comments from '../pictures/comments.png'
import share from '../pictures/share.png'
import download from '../pictures/download.png'
import Store from '../redux/store';
import { Link } from 'react-router-dom'
import { b64toBlob } from '../utils/ImageUtils';
/**
 * react-share is a library which provides share buttons in addition to their respective icons of various platform. It allows us to
 * share links and content
 */
import {
    EmailShareButton,
    FacebookShareButton,
    TwitterShareButton,
    FacebookIcon,
    EmailIcon,
    TwitterIcon,
} from "react-share";
const React = require('react');
require('./ImageOptionsText.css');


class ImageOptionsText extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            accessToken: Store.getState().user.accessToken,
            isSignedIn: Store.getState().user.isSignedIn,

            upvotes: this.props.meme.upvotes,
            downvotes: this.props.meme.downvotes,
            hasUpvoted: false,      //only 1 upvote and 1 downvote per image is possible
            hasDownvoted: false,

            currentMeme: null,
            dateCreated: this.props.meme.dateCreated,
            title: this.props.meme.title,
            base64: this.props.meme.base64,
            formatType: this.props.meme.memeTemplate.formatType,

            index: this.props.index,
            memesArray: this.props.memesArray, //memesArray from Browse (filter option hot/fresh) to show in Gallery

        };
    }




    componentDidUpdate(prevProps) {
        console.log("upvotes state: " + this.state.upvotes)

        //for example filteroption in browse has changed
        if (this.props.meme !== prevProps.meme) {
            if (this.props.meme !== undefined) {
                console.log(this.props.meme)
                this.setState({
                    currentMeme: this.props.meme,
                    base64: this.props.meme.base64,
                    formatType: this.props.meme.memeTemplate.formatType,
                    upvotes: this.props.meme.upvotes,
                    downvotes: this.props.meme.downvotes,
                    dateCreated: this.props.meme.dateCreated,
                    title: this.props.meme.title
                })
            }
        }

        if (this.props.memesArray !== prevProps.memesArray) {
            this.setState({
                memesArray: this.props.memesArray
            })
        }
    }


    upvote() {
        if (this.state.hasUpvoted === false) {
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
                    console.log("upvotes data" + JSON.stringify(data))
                    //return response.json();
                    this.setState({ upvotes: data.upvotes });
                })

            this.setState({ hasUpvoted: true })
        }


    }

    downvote() {
        if (this.state.hasDownvoted === false) {
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

            this.setState({ hasDownvoted: true })
        }
    }

    /**
     * 
     * Download meme Image
     * 
     */
    download() {
        try {
            if (this.state.formatType === "video") {
                const a = document.createElement("a");
                a.download = this.state.title + '.mp4';
                a.href = this.state.base64;
                document.body.appendChild(a);
                a.click();
            } else if (this.state.formatType === "gif") {
                const a = document.createElement("a");
                a.download = this.state.title + '.gif';
                a.href = this.state.base64;
                document.body.appendChild(a);
                a.click();
            } else if (this.state.formatType === "image") {
                const a = document.createElement("a");
                a.download = this.state.title + '.png';
                a.href = this.state.base64;
                document.body.appendChild(a);
                a.click();
            }
        } catch (e) {
            console.log(e)
        }
    }


    /**
     * Share Button
     */
    share() {
        try {
            const url = 'http://localhost:3006/meme/' + this.props.meme._id;
            //  const url = 'http://github.com'
            console.log(url)
            this.setState({
                shareURL: url
            })
        } catch (e) {
            console.log(e)
        }
    }

    /**
     * returns number of comments of an image
     */
    numberOfComments() {
        if (this.props.meme !== undefined) {
            if (this.props.meme.comments !== undefined) {
                return this.props.meme.comments.length
            }
        }
        else {
            return 0
        }
    }


    /**
     * change format to display either video or image/gif
     */
    selectFormat() {
        if (this.state.formatType === "video") {

            var base64result = this.state.base64.split(',');
            var base64blob = URL.createObjectURL(b64toBlob(base64result[1], base64result[0]))
            return (
                <video src={base64blob} className="image" autoPlay={true} loop={true} />
            )
        }
        else {
            return (
                <img src={this.state.base64} className="image" />
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
                    <p className="date">{this.state.dateCreated}</p>
                </div>
                <div className="above-image_container">

                    <h1 className="image-titel">{this.state.title}</h1>

                    <div className="options-top_container">
                        <div className="share-download">
                            <button className="option-button" onClick={() => this.download()}> <img src={download} className="icon" />  </button>
                            <a className="option-button" href="#share_b" onClick={() => this.share()}> <img src={share} className="icon" /> </a>
                        </div>
                    </div>
                </div>
                <div className="image_container">
                    <Link to={{ pathname: "/gallery", index: this.state.index, memesArray: this.state.memesArray }}>{this.selectFormat()}</Link>
                </div>
                <div className="points-commits">
                    <p className="voting-point">Points: {this.state.upvotes - this.state.downvotes} </p>
                    <p className="voting-point">Comments: {this.numberOfComments()}</p>
                </div>
                <div className="option_container">
                    <button className="option-button"><img src={upvote} className="icon" onClick={() => this.upvote()} /></button>
                    <button className="option-button"><img src={downvote} className="icon" id="downvote" onClick={() => this.downvote()} /></button>
                    <Link to={{ pathname: "/gallery", index: this.state.index, memesArray: this.state.memesArray }}><button className="option-button"><img src={comments} className="icon" /></button></Link>
                </div>


                <div id="share_b" className="modal-window">
                    <div>
                        <a href="/#" title="Close" id="share-window-close" className="modal-close">Close</a>
                        <FacebookShareButton
                            url={this.state.shareURL}
                            quote={this.state.title}
                            className="share-button"
                        >
                            <FacebookIcon size={32} round />
                        </FacebookShareButton>
                        <EmailShareButton
                            url={this.state.shareURL}
                            body={"Share Now"}
                            subject={this.state.title}
                            className="share-button"
                        >
                            <EmailIcon size={32} round />
                        </EmailShareButton>
                        <TwitterShareButton
                            url={this.state.shareURL}
                            title={this.state.title}
                            className="share-button"
                        >
                            <TwitterIcon size={32} round />
                        </TwitterShareButton>
                    </div>
                </div>

            </div>
        );
    }
}

export default ImageOptionsText;