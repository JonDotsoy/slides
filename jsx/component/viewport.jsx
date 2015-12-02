import React from "react";
import Router from "router";

var Viewport = React.createClass({
	getInitialState: function () {
		return {
			row: 0,
			col: 0,
			enableKeyDirection: true,
			visible: true,
			slides: [],
		}
	},
	lastRow: -1,
	lastCol: -1,
	componentWillMount: function () {
		window.addEventListener("keydown", this.keyPressWindow);

		let slides = [];
		let slidesByMap = [];

		if (Array.isArray(this.props.children)) {
			for (let slide of this.props.children) {
				let col = slide.props.hasOwnProperty("col") ? slide.props.col : 0;
				let row = slide.props.hasOwnProperty("row") ? slide.props.row : 0;

				if (!slides[col]) {
					slides[col] = [];
				}

				slides[col][row] = slide;
			}
		} else {
			let slide = this.props.children;
			let col = slide.props.hasOwnProperty("col") ? slide.props.col : 0;
			let row = slide.props.hasOwnProperty("row") ? slide.props.row : 0;

			if (!slides[col]) {
				slides[col] = [];
			}

			slides[col][row] = slide;
		}

		let mapCol = 0;

		slides.map((col) => {
			slidesByMap[mapCol] = [];

			let mapRow = 0;

			col.map((row) => {
				slidesByMap[mapCol][mapRow] = row;
				mapRow++;

				return row;
			});

			mapCol++;

			return col;
		});

		this.setState({slides: slidesByMap});
	},
	componentDidMount: function () {
		Router({
			"/": () => {
				this.selectedSlide();
			},
			"/:col": (col) => {
				col = Number(col);
				if (Number.isNaN(col)) {
					this.selectedSlideURL(0);
				} else {
					this.selectedSlide(col);
				}
			},
			"/:col/:row": (col, row) => {
				col = Number(col);
				row = Number(row);
				if (Number.isNaN(col) || Number.isNaN(row)) {
					this.selectedSlideURL((col || 0), (row || 0));
				} else {
					this.selectedSlide(col, row);
				}
			},
		}).init();
	},
	keyPressWindow: function () {
		// console.log(event.keyCode);

		if (this.state.enableKeyDirection == true) {
			switch (event.keyCode) {
				case 37:  this.directionLeft();  break;
				case 39:  this.directionRight(); break;
				case 38:  this.directionTop();   break;
				case 40:  this.directionDown();  break;
				case 33:  this.directionRepag(); break;
				case 34:  this.directionAvpag(); break;
				case 190: this.toggleVisible();  break;
			}
		}
	},
	directionLeft: function () {
		this.selectedSlide(this.state.col - 1);
	},
	directionRight: function () {
		this.selectedSlide(this.state.col + 1);
	},
	directionTop: function () {
		this.selectedSlide(this.state.col, this.state.row + 1);
	},
	directionDown: function () {
		this.selectedSlide(this.state.col, this.state.row - 1);
	},
	directionRepag: function () {
		if (this.checkExistsSlide(this.state.col, this.state.row - 1)) {
			this.directionDown();
		} else {
			// if (this.checkExistsSlide(this.state.col - 1)) {
				this.selectedSlide(this.state.col - 1, (this.state.slides[this.state.col - 1]||{}).length - 1);
			// }
		}
	},
	directionAvpag: function () {
		if (this.checkExistsSlide(this.state.col, this.state.row + 1)) {
			this.directionTop();
		} else {
			if (this.checkExistsSlide(this.state.col + 1)) {
				this.directionRight();
			}
		}
	},
	toggleVisible: function () {},
	selectedSlideURL: function (col = 0, row = 0) {
		if (col == 0 && row == 0) {
			document.location.hash = `/`;
		} else if (row == 0) {
			document.location.hash = `/${col}`;
		} else {
			document.location.hash = `/${col}/${row}`;
		}
	},
	selectedSlide: function (col = 0, row = 0) {
		let newCol = null;
		let newRow = null;

		if (!this.state.slides[col]) {
			if (col > (this.state.slides.length - 1)) {
				newCol = (this.state.slides.length - 1);
			} else if (col < 0) {
				newCol = 0;
			}
		}

		if (this.state.slides[col] && !this.state.slides[col][row]) {
			if (row > (this.state.slides[col].length - 1)) {
				newRow = (this.state.slides[col].length - 1);
			} else if (row < 0) {
				newRow = 0;
			}
		}

		if (newCol != null || newRow != null) {
			[col, row] = [(newCol != null) ? newCol : col, (newRow != null) ? newRow : row];
		}

		if (this.checkExistsSlide(col, row)) {
			if (this.state.col!=col||this.state.row!=row) {
				[this.lastCol, this.lastRow] = [this.state.col, this.state.row];
			}

			this.selectedSlideURL(col, row);
			this.setState({col, row});
		}
	},
	checkExistsSlide: function (col = 0, row = 0) {
		let validCol = false;
		let validRow = false;

		if (this.state.slides[col]) {
			validCol = true;
			if (this.state.slides[col][row]) {
				validRow = true;
			}
		}

		return (validCol && validRow);
	},

	generatorClassNameGlobal: function ({
		directionRight = "direction-right",
		directionLeft = "direction-left",
		directionTop = "direction-top",
		directionDown = "direction-down",
	} = {}) {
		let [a, b, c, d] = [this.state.col > this.lastCol, this.state.col < this.lastCol, this.state.row > this.lastRow, this.state.row < this.lastRow];
		// console.log(a, b, c, d);

		if (a) return directionRight;
		if (b) return directionLeft;
		if (c) return directionTop;
		if (d) return directionDown;
	},

	generatorClassName: function (col, row, {
		prefix = null,
		classSelected = "selected",
		classLastSelected = "last-selected",
		classColSelected = "col-selected",
		classRowSelected = "row-selected",
	} = {}) {
		let [nowCol, nowRow] = [this.state.col, this.state.row];
		let classNames = [];

		if (nowCol == col) classNames.push(classColSelected);
		if (nowRow == row) classNames.push(classRowSelected);
		if (nowCol == col && nowRow == row) classNames.push(classSelected);
		if (this.lastCol == col && this.lastRow == row) classNames.push(classLastSelected);

		return classNames.map((className) => {
			if (prefix !== null) {
				return `${prefix}-${className}`;
			} else return className;
		});
	},

	render: function() {
		let slides = this.state.slides;

		return (
			<div className={["viewport", this.generatorClassNameGlobal()].join(" ")}>

				<div className="content-background-slides">
					{slides.map((col, indexCol) => col.map((row, indexRow) => {
						return <div className={["background", ...this.generatorClassName(indexCol, indexRow), row.props.className].join(" ")} style={{backgroundColor: (row.props["background-color"] || "white")}}></div>
					}))}
				</div>

				<div className="content-slides">
					{slides.map((col, indexCol) => col.map((row, indexRow) => {
						return <div className={["slide", ...this.generatorClassName(indexCol, indexRow), row.props.className].join(" ")}>
							{row.props.children}
						</div>
					}))}
				</div>

			</div>
		);
	}
});

export default Viewport;
