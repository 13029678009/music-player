import React from 'react';
import Header from './components/header';
import Player from './page/player';
import MusicList from './page/musicList';
import { MUSIC_LIST } from './config/config';
import Pubsub from "pubsub-js";
import { Router, IndexRoute, Link, Route, hashHistory } from "react-router";
let App = React.createClass({
	getInitialState() {
		return {
			musicList: MUSIC_LIST,
			currentMusicItem: MUSIC_LIST[0]
        }
	},
    playMusic(musicItem){
    	$("#player").jPlayer("setMedia",{
    		mp3:musicItem.file
    	}).jPlayer("play");
    	this.setState({
    		currentMusicItem:musicItem
    	});
    },
    playNext(type="next"){
    	let index=this.findMusicIndex(this.state.currentMusicItem);
    	let musicListLength=this.state.musicList.length;
    	let newIndex=null;
    	if(type==="next"){
    		 newIndex=(index+1) % musicListLength;
    	}else{
    		 newIndex=(index-1+musicListLength) % musicListLength;
    		 
    	}
		this.playMusic(this.state.musicList[newIndex]);
    	 
    },
    findMusicIndex(musicItem){
    	return this.state.musicList.indexOf(musicItem);
    },
	componentDidMount() {
		$("#player").jPlayer({
			supplied: "mp3",
			wmode: "window"
		});
		this.playMusic(this.state.currentMusicItem);
		$("#player").bind($.jPlayer.event.ended,(e)=>{
			this.playNext();
		})
		Pubsub.subscribe("DELETE_MUSIC",(msg,musicItem)=>{
			this.setState({
				musicList:this.state.musicList.filter(item=>{
					return item!==musicItem;
				})
			})
		});
        Pubsub.subscribe("PLAY_MUSIC", (msg,musicItem)=>{
			this.playMusic(musicItem)
		});
		 Pubsub.subscribe("PLAY_NEXT", (msg,musicItem)=>{
			this.playNext()
			
		});
		 Pubsub.subscribe("PLAY_PREV", (msg,musicItem)=>{
			this.playNext("prev")
		});
	},
	componentWillUnMount() {
      Pubsub.unsubscribe('DELETE_MUSIC');
      Pubsub.unsubscribe('PLAY_MUSIC');
		$("#player").unbind($.jPlayer.event.ended);
       Pubsub.unsubscribe('PLAY_PREV');
       Pubsub.unsubscribe('PLAY_NEXT');
	},
	render() {
		return(
			<div> 
				<Header/>
				{React.cloneElement(this.props.children,this.state)}
            </div>
		);
    }
});
let Root = React.createClass({
	render() {
		return(
			<Router history={hashHistory}>
			    <Route path="/" component={App}>
					<IndexRoute component={Player}>
					</IndexRoute>
					<Route path="/list" component={MusicList}>
					</Route>
				</Route>
			</Router>
		)
	}
});
export default Root;