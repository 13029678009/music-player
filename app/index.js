import React from 'react';
import {render} from 'react-dom';
import {app} from 'react-hot-loader';
import Root from './root'
 render(
 	<app>
 	  <Root/> 
 	</app>,
 	document.getElementById('root')
 );
if(module.hot) {
	module.hot.accept('./root', () =>{
		const NewRoot = require('./root').default;
		render(
			<app>
   	          <NewRoot/> 
   	       </app>,
			document.getElementById('root')
		);
	});
}
