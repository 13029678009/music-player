import React from 'react';
import './header.less';
let Header=React.createClass({
	render(){
		return (
			<div className='components-header row'> 
			    <img src="static/images/logo.png" width="40" alt="" className="-col-auto"/>
		       <h1 className="caption">Music Player Build By React!</h1>
			</div>
       );
	}
});
export default Header;
 
 


