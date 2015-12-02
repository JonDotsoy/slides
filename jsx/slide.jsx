import React from "react";
import Viewport from "./component/Viewport";
import ReactDOM from "react-dom";

let Slides = React.createClass({
	render: function() {
		return (
			<Viewport>
				<div col={0} background-color="green">
					<h1>Un gato dice que y yo digo que!!</h1>
					<h2>Un gato dice que y yo digo que!!</h2>
					<h3>Un gato dice que y yo digo que!!</h3>
					<h4>Un gato dice que y yo digo que!!</h4>
					<h5>Un gato dice que y yo digo que!!</h5>
					<h6>Un gato dice que y yo digo que!!</h6>
					<p>Un gato dice que y yo digo que!!</p>
				</div>
				<div col={1} background-color="orange">
					<h1>Slide 2</h1>
				</div>
				<div col={2} background-color="yellow">
					<h1>Slide 3</h1>
				</div>
				<div col={3} background-color="grey">
					<h1>Slide 4</h1>
				</div>
				<div col={3} row={1} background-color="red">
					<h1>Slide 4 sub slide 1</h1>
				</div>
				<div col={3} row={6} background-color="blue">
					<h1>Slide 4 sub slide 2</h1>
				</div>
				<div col={6} row={4} background-color="chartreuse">
					<h1>Slide 4 sub slide 3</h1>
				</div>
				<div col={9} background-color="darkcyan">
					<h1>Slide 5</h1>
				</div>
				<div col={41} row={0} background-color="darkslateblue">
					<h1>Slide 5 sub Slide 1</h1>
				</div>
				<div col={41} row={1} background-color="greenyellow">
					<h1>Slide 5 sub Slide 2</h1>
				</div>
				<div col={41} row={2} background-color="lightgoldenrodyellow">
					<h1>Slide 5 sub Slide 3</h1>
				</div>
				<div col={41} row={3} background-color="lightskyblue">
					<h1>Slide 5 sub Slide 4</h1>
				</div>
			</Viewport>
		);
	}
});


ReactDOM.render(<Slides />, document.getElementById("slide"));
