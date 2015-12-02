(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _router = (typeof window !== "undefined" ? window['Router'] : typeof global !== "undefined" ? global['Router'] : null);

var _router2 = _interopRequireDefault(_router);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var Viewport = _react2.default.createClass({
	displayName: "Viewport",

	getInitialState: function getInitialState() {
		return {
			row: 0,
			col: 0,
			enableKeyDirection: true,
			visible: true,
			slides: []
		};
	},
	lastRow: -1,
	lastCol: -1,
	componentWillMount: function componentWillMount() {
		window.addEventListener("keydown", this.keyPressWindow);

		var slides = [];
		var slidesByMap = [];

		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = this.props.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var slide = _step.value;

				var col = slide.props.hasOwnProperty("col") ? slide.props.col : 0;
				var row = slide.props.hasOwnProperty("row") ? slide.props.row : 0;

				if (!slides[col]) {
					slides[col] = [];
				}

				slides[col][row] = slide;
			}
		} catch (err) {
			_didIteratorError = true;
			_iteratorError = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion && _iterator.return) {
					_iterator.return();
				}
			} finally {
				if (_didIteratorError) {
					throw _iteratorError;
				}
			}
		}

		var mapCol = 0;

		slides.map(function (col) {
			slidesByMap[mapCol] = [];

			var mapRow = 0;

			col.map(function (row) {
				slidesByMap[mapCol][mapRow] = row;
				mapRow++;

				return row;
			});

			mapCol++;

			return col;
		});

		this.setState({ slides: slidesByMap });
	},
	componentDidMount: function componentDidMount() {
		var _this = this;

		(0, _router2.default)({
			"/": function _() {
				_this.selectedSlide();
			},
			"/:col": function col(_col) {
				_col = Number(_col);
				if (Number.isNaN(_col)) {
					_this.selectedSlideURL(0);
				} else {
					_this.selectedSlide(_col);
				}
			},
			"/:col/:row": function colRow(col, row) {
				col = Number(col);
				row = Number(row);
				if (Number.isNaN(col) || Number.isNaN(row)) {
					_this.selectedSlideURL(col || 0, row || 0);
				} else {
					_this.selectedSlide(col, row);
				}
			}
		}).init();
	},
	keyPressWindow: function keyPressWindow() {
		// console.log(event.keyCode);

		if (this.state.enableKeyDirection == true) {
			switch (event.keyCode) {
				case 37:
					this.directionLeft();break;
				case 39:
					this.directionRight();break;
				case 38:
					this.directionTop();break;
				case 40:
					this.directionDown();break;
				case 33:
					this.directionRepag();break;
				case 34:
					this.directionAvpag();break;
				case 190:
					this.toggleVisible();break;
			}
		}
	},
	directionLeft: function directionLeft() {
		this.selectedSlide(this.state.col - 1);
	},
	directionRight: function directionRight() {
		this.selectedSlide(this.state.col + 1);
	},
	directionTop: function directionTop() {
		this.selectedSlide(this.state.col, this.state.row + 1);
	},
	directionDown: function directionDown() {
		this.selectedSlide(this.state.col, this.state.row - 1);
	},
	directionRepag: function directionRepag() {
		if (this.checkExistsSlide(this.state.col, this.state.row - 1)) {
			this.directionDown();
		} else {
			// if (this.checkExistsSlide(this.state.col - 1)) {
			this.selectedSlide(this.state.col - 1, (this.state.slides[this.state.col - 1] || {}).length - 1);
			// }
		}
	},
	directionAvpag: function directionAvpag() {
		if (this.checkExistsSlide(this.state.col, this.state.row + 1)) {
			this.directionTop();
		} else {
			if (this.checkExistsSlide(this.state.col + 1)) {
				this.directionRight();
			}
		}
	},
	toggleVisible: function toggleVisible() {},
	selectedSlideURL: function selectedSlideURL() {
		var col = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
		var row = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

		if (col == 0 && row == 0) {
			document.location.hash = "/";
		} else if (row == 0) {
			document.location.hash = "/" + col;
		} else {
			document.location.hash = "/" + col + "/" + row;
		}
	},
	selectedSlide: function selectedSlide() {
		var col = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
		var row = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

		var newCol = null;
		var newRow = null;

		if (!this.state.slides[col]) {
			if (col > this.state.slides.length - 1) {
				newCol = this.state.slides.length - 1;
			} else if (col < 0) {
				newCol = 0;
			}
		}

		if (this.state.slides[col] && !this.state.slides[col][row]) {
			if (row > this.state.slides[col].length - 1) {
				newRow = this.state.slides[col].length - 1;
			} else if (row < 0) {
				newRow = 0;
			}
		}

		if (newCol != null || newRow != null) {
			var _ref = [newCol != null ? newCol : col, newRow != null ? newRow : row];
			col = _ref[0];
			row = _ref[1];
		}

		if (this.checkExistsSlide(col, row)) {
			if (this.state.col != col || this.state.row != row) {
				var _ref2 = [this.state.col, this.state.row];
				this.lastCol = _ref2[0];
				this.lastRow = _ref2[1];
			}

			this.selectedSlideURL(col, row);
			this.setState({ col: col, row: row });
		}
	},
	checkExistsSlide: function checkExistsSlide() {
		var col = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
		var row = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

		var validCol = false;
		var validRow = false;

		if (this.state.slides[col]) {
			validCol = true;
			if (this.state.slides[col][row]) {
				validRow = true;
			}
		}

		return validCol && validRow;
	},

	generatorClassName: function generatorClassName(col, row) {
		var _ref3 = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

		var _ref3$prefix = _ref3.prefix;
		var prefix = _ref3$prefix === undefined ? null : _ref3$prefix;
		var _ref3$classSelected = _ref3.classSelected;
		var classSelected = _ref3$classSelected === undefined ? "selected" : _ref3$classSelected;
		var _ref3$classLastSelect = _ref3.classLastSelected;
		var classLastSelected = _ref3$classLastSelect === undefined ? "last-selected" : _ref3$classLastSelect;
		var _ref3$classColSelecte = _ref3.classColSelected;
		var classColSelected = _ref3$classColSelecte === undefined ? "col-selected" : _ref3$classColSelecte;
		var _ref3$classRowSelecte = _ref3.classRowSelected;
		var classRowSelected = _ref3$classRowSelecte === undefined ? "row-selected" : _ref3$classRowSelecte;
		var nowCol = this.state.col;
		var nowRow = this.state.row;

		var classNames = [];

		if (nowCol == col) classNames.push(classColSelected);
		if (nowRow == row) classNames.push(classRowSelected);
		if (nowCol == col && nowRow == row) classNames.push(classSelected);
		if (this.lastCol == col && this.lastRow == row) classNames.push(classLastSelected);

		return classNames.map(function (className) {
			if (prefix !== null) {
				return prefix + "-" + className;
			} else return className;
		});
	},

	render: function render() {
		var _this2 = this;

		var slides = this.state.slides;

		return _react2.default.createElement(
			"div",
			{ className: "viewport" },
			_react2.default.createElement(
				"div",
				{ className: "content-background-slides" },
				slides.map(function (col, indexCol) {
					return col.map(function (row, indexRow) {
						return _react2.default.createElement("div", { className: ["background"].concat(_toConsumableArray(_this2.generatorClassName(indexCol, indexRow))).join(" "), style: { backgroundColor: row.props["background-color"] || "white" } });
					});
				})
			),
			_react2.default.createElement(
				"div",
				{ className: "content-slides" },
				slides.map(function (col, indexCol) {
					return col.map(function (row, indexRow) {
						return _react2.default.createElement(
							"div",
							{ className: ["slide"].concat(_toConsumableArray(_this2.generatorClassName(indexCol, indexRow))).join(" ") },
							row.props.children
						);
					});
				})
			)
		);
	}
});

exports.default = Viewport;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],2:[function(require,module,exports){
(function (global){
"use strict";

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _Viewport = require("./component/Viewport");

var _Viewport2 = _interopRequireDefault(_Viewport);

var _reactDom = (typeof window !== "undefined" ? window['ReactDOM'] : typeof global !== "undefined" ? global['ReactDOM'] : null);

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Slides = _react2.default.createClass({
	displayName: "Slides",

	render: function render() {
		return _react2.default.createElement(
			_Viewport2.default,
			null,
			_react2.default.createElement(
				"div",
				{ col: 0, "background-color": "green" },
				_react2.default.createElement(
					"h1",
					null,
					"Un gato dice que y yo digo que!!"
				),
				_react2.default.createElement(
					"h2",
					null,
					"Un gato dice que y yo digo que!!"
				),
				_react2.default.createElement(
					"h3",
					null,
					"Un gato dice que y yo digo que!!"
				),
				_react2.default.createElement(
					"h4",
					null,
					"Un gato dice que y yo digo que!!"
				),
				_react2.default.createElement(
					"h5",
					null,
					"Un gato dice que y yo digo que!!"
				),
				_react2.default.createElement(
					"h6",
					null,
					"Un gato dice que y yo digo que!!"
				),
				_react2.default.createElement(
					"p",
					null,
					"Un gato dice que y yo digo que!!"
				)
			),
			_react2.default.createElement(
				"div",
				{ col: 1, "background-color": "orange" },
				_react2.default.createElement(
					"h1",
					null,
					"Slide 2"
				)
			),
			_react2.default.createElement(
				"div",
				{ col: 2, "background-color": "yellow" },
				_react2.default.createElement(
					"h1",
					null,
					"Slide 3"
				)
			),
			_react2.default.createElement(
				"div",
				{ col: 3, "background-color": "grey" },
				_react2.default.createElement(
					"h1",
					null,
					"Slide 4"
				)
			),
			_react2.default.createElement(
				"div",
				{ col: 3, row: 1, "background-color": "red" },
				_react2.default.createElement(
					"h1",
					null,
					"Slide 4 sub slide 1"
				)
			),
			_react2.default.createElement(
				"div",
				{ col: 3, row: 6, "background-color": "blue" },
				_react2.default.createElement(
					"h1",
					null,
					"Slide 4 sub slide 2"
				)
			),
			_react2.default.createElement(
				"div",
				{ col: 6, row: 4, "background-color": "chartreuse" },
				_react2.default.createElement(
					"h1",
					null,
					"Slide 4 sub slide 3"
				)
			),
			_react2.default.createElement(
				"div",
				{ col: 9, "background-color": "darkcyan" },
				_react2.default.createElement(
					"h1",
					null,
					"Slide 5"
				)
			),
			_react2.default.createElement(
				"div",
				{ col: 41, row: 0, "background-color": "darkslateblue" },
				_react2.default.createElement(
					"h1",
					null,
					"Slide 5 sub Slide 1"
				)
			),
			_react2.default.createElement(
				"div",
				{ col: 41, row: 1, "background-color": "greenyellow" },
				_react2.default.createElement(
					"h1",
					null,
					"Slide 5 sub Slide 2"
				)
			),
			_react2.default.createElement(
				"div",
				{ col: 41, row: 2, "background-color": "lightgoldenrodyellow" },
				_react2.default.createElement(
					"h1",
					null,
					"Slide 5 sub Slide 3"
				)
			),
			_react2.default.createElement(
				"div",
				{ col: 41, row: 3, "background-color": "lightskyblue" },
				_react2.default.createElement(
					"h1",
					null,
					"Slide 5 sub Slide 4"
				)
			)
		);
	}
});

_reactDom2.default.render(_react2.default.createElement(Slides, null), document.getElementById("slide"));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./component/Viewport":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqc3hcXGNvbXBvbmVudFxcanN4XFxjb21wb25lbnRcXFZpZXdwb3J0LmpzeCIsImpzeFxcanN4XFxzbGlkZS5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDR0EsSUFBSSxRQUFRLEdBQUcsZ0JBQU0sV0FBVyxDQUFDOzs7QUFDaEMsZ0JBQWUsRUFBRSwyQkFBWTtBQUM1QixTQUFPO0FBQ04sTUFBRyxFQUFFLENBQUM7QUFDTixNQUFHLEVBQUUsQ0FBQztBQUNOLHFCQUFrQixFQUFFLElBQUk7QUFDeEIsVUFBTyxFQUFFLElBQUk7QUFDYixTQUFNLEVBQUUsRUFBRTtHQUNWLENBQUE7RUFDRDtBQUNELFFBQU8sRUFBRSxDQUFDLENBQUM7QUFDWCxRQUFPLEVBQUUsQ0FBQyxDQUFDO0FBQ1gsbUJBQWtCLEVBQUUsOEJBQVk7QUFDL0IsUUFBTSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7O0FBRXhELE1BQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUNoQixNQUFJLFdBQVcsR0FBRyxFQUFFLENBQUM7Ozs7Ozs7QUFFckIsd0JBQWtCLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSw4SEFBRTtRQUE5QixLQUFLOztBQUNiLFFBQUksR0FBRyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztBQUNsRSxRQUFJLEdBQUcsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7O0FBRWxFLFFBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUU7QUFDakIsV0FBTSxDQUFD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QUMsRUFBQyxvQkFBaUIsTUFBTTtJQUMzQzs7OztLQUE0QjtJQUN2QjtHQUNOOztNQUFLLEdBQUcsRUFBRSxDQUFDLEFBQUMsRUFBQyxHQUFHLEVBQUUsQ0FBQyxBQUFDLEVBQUMsb0JBQWlCLFlBQVk7SUFDakQ7Ozs7S0FBNEI7SUFDdkI7R0FDTjs7TUFBSyxHQUFHLEVBQUUsQ0FBQyxBQUFDLEVBQUMsb0JBQWlCLFVBQVU7SUFDdkM7Ozs7S0FBZ0I7SUFDWDtHQUNOOztNQUFLLEdBQUcsRUFBRSxFQUFFLEFBQUMsRUFBQyxHQUFHLEVBQUUsQ0FBQyxBQUFDLEVBQUMsb0JBQWlCLGVBQWU7SUFDckQ7Ozs7S0FBNEI7SUFDdkI7R0FDTjs7TUFBSyxHQUFHLEVBQUUsRUFBRSxBQUFDLEVBQUMsR0FBRyxFQUFFLENBQUMsQUFBQyxFQUFDLG9CQUFpQixhQUFhO0lBQ25EOzs7O0tBQTRCO0lBQ3ZCO0dBQ047O01BQUssR0FBRyxFQUFFLEVBQUUsQUFBQyxFQUFDLEdBQUcsRUFBRSxDQUFDLEFBQUMsRUFBQyxvQkFBaUIsc0JBQXNCO0lBQzVEOzs7O0tBQTRCO0lBQ3ZCO0dBQ047O01BQUssR0FBRyxFQUFFLEVBQUUsQUFBQyxFQUFDLEdBQUcsRUFBRSxDQUFDLEFBQUMsRUFBQyxvQkFBaUIsY0FBYztJQUNwRDs7OztLQUE0QjtJQUN2QjtHQUNJLENBQ1Y7RUFDRjtDQUNELENBQUMsQ0FBQzs7QUFHSCxtQkFBUyxNQUFNLENBQUMsOEJBQUMsTUFBTSxPQUFHLEVBQUUsUUFBUSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCBSb3V0ZXIgZnJvbSBcInJvdXRlclwiO1xuXG52YXIgVmlld3BvcnQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRyb3c6IDAsXG5cdFx0XHRjb2w6IDAsXG5cdFx0XHRlbmFibGVLZXlEaXJlY3Rpb246IHRydWUsXG5cdFx0XHR2aXNpYmxlOiB0cnVlLFxuXHRcdFx0c2xpZGVzOiBbXSxcblx0XHR9XG5cdH0sXG5cdGxhc3RSb3c6IC0xLFxuXHRsYXN0Q29sOiAtMSxcblx0Y29tcG9uZW50V2lsbE1vdW50OiBmdW5jdGlvbiAoKSB7XG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIHRoaXMua2V5UHJlc3NXaW5kb3cpO1xuXG5cdFx0bGV0IHNsaWRlcyA9IFtdO1xuXHRcdGxldCBzbGlkZXNCeU1hcCA9IFtdO1xuXG5cdFx0Zm9yIChsZXQgc2xpZGUgb2YgdGhpcy5wcm9wcy5jaGlsZHJlbikge1xuXHRcdFx0bGV0IGNvbCA9IHNsaWRlLnByb3BzLmhhc093blByb3BlcnR5KFwiY29sXCIpID8gc2xpZGUucHJvcHMuY29sIDogMDtcblx0XHRcdGxldCByb3cgPSBzbGlkZS5wcm9wcy5oYXNPd25Qcm9wZXJ0eShcInJvd1wiKSA/IHNsaWRlLnByb3BzLnJvdyA6IDA7XG5cblx0XHRcdGlmICghc2xpZGVzW2NvbF0pIHtcblx0XHRcdFx0c2xpZGVzW2NvbF0gPSBbXTtcblx0XHRcdH1cblxuXHRcdFx0c2xpZGVzW2NvbF1bcm93XSA9IHNsaWRlO1xuXHRcdH1cblxuXHRcdGxldCBtYXBDb2wgPSAwO1xuXG5cdFx0c2xpZGVzLm1hcCgoY29sKSA9PiB7XG5cdFx0XHRzbGlkZXNCeU1hcFttYXBDb2xdID0gW107XG5cblx0XHRcdGxldCBtYXBSb3cgPSAwO1xuXG5cdFx0XHRjb2wubWFwKChyb3cpID0+IHtcblx0XHRcdFx0c2xpZGVzQnlNYXBbbWFwQ29sXVttYXBSb3ddID0gcm93O1xuXHRcdFx0XHRtYXBSb3crKztcblxuXHRcdFx0XHRyZXR1cm4gcm93O1xuXHRcdFx0fSk7XG5cblx0XHRcdG1hcENvbCsrO1xuXG5cdFx0XHRyZXR1cm4gY29sO1xuXHRcdH0pO1xuXG5cdFx0dGhpcy5zZXRTdGF0ZSh7c2xpZGVzOiBzbGlkZXNCeU1hcH0pO1xuXHR9LFxuXHRjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gKCkge1xuXHRcdFJvdXRlcih7XG5cdFx0XHRcIi9cIjogKCkgPT4ge1xuXHRcdFx0XHR0aGlzLnNlbGVjdGVkU2xpZGUoKTtcblx0XHRcdH0sXG5cdFx0XHRcIi86Y29sXCI6IChjb2wpID0+IHtcblx0XHRcdFx0Y29sID0gTnVtYmVyKGNvbCk7XG5cdFx0XHRcdGlmIChOdW1iZXIuaXNOYU4oY29sKSkge1xuXHRcdFx0XHRcdHRoaXMuc2VsZWN0ZWRTbGlkZVVSTCgwKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0aGlzLnNlbGVjdGVkU2xpZGUoY29sKTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdFwiLzpjb2wvOnJvd1wiOiAoY29sLCByb3cpID0+IHtcblx0XHRcdFx0Y29sID0gTnVtYmVyKGNvbCk7XG5cdFx0XHRcdHJvdyA9IE51bWJlcihyb3cpO1xuXHRcdFx0XHRpZiAoTnVtYmVyLmlzTmFOKGNvbCkgfHwgTnVtYmVyLmlzTmFOKHJvdykpIHtcblx0XHRcdFx0XHR0aGlzLnNlbGVjdGVkU2xpZGVVUkwoKGNvbCB8fCAwKSwgKHJvdyB8fCAwKSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dGhpcy5zZWxlY3RlZFNsaWRlKGNvbCwgcm93KTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHR9KS5pbml0KCk7XG5cdH0sXG5cdGtleVByZXNzV2luZG93OiBmdW5jdGlvbiAoKSB7XG5cdFx0Ly8gY29uc29sZS5sb2coZXZlbnQua2V5Q29kZSk7XG5cblx0XHRpZiAodGhpcy5zdGF0ZS5lbmFibGVLZXlEaXJlY3Rpb24gPT0gdHJ1ZSkge1xuXHRcdFx0c3dpdGNoIChldmVudC5rZXlDb2RlKSB7XG5cdFx0XHRcdGNhc2UgMzc6ICB0aGlzLmRpcmVjdGlvbkxlZnQoKTsgIGJyZWFrO1xuXHRcdFx0XHRjYXNlIDM5OiAgdGhpcy5kaXJlY3Rpb25SaWdodCgpOyBicmVhaztcblx0XHRcdFx0Y2FzZSAzODogIHRoaXMuZGlyZWN0aW9uVG9wKCk7ICAgYnJlYWs7XG5cdFx0XHRcdGNhc2UgNDA6ICB0aGlzLmRpcmVjdGlvbkRvd24oKTsgIGJyZWFrO1xuXHRcdFx0XHRjYXNlIDMzOiAgdGhpcy5kaXJlY3Rpb25SZXBhZygpOyBicmVhaztcblx0XHRcdFx0Y2FzZSAzNDogIHRoaXMuZGlyZWN0aW9uQXZwYWcoKTsgYnJlYWs7XG5cdFx0XHRcdGNhc2UgMTkwOiB0aGlzLnRvZ2dsZVZpc2libGUoKTsgIGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblx0ZGlyZWN0aW9uTGVmdDogZnVuY3Rpb24gKCkge1xuXHRcdHRoaXMuc2VsZWN0ZWRTbGlkZSh0aGlzLnN0YXRlLmNvbCAtIDEpO1xuXHR9LFxuXHRkaXJlY3Rpb25SaWdodDogZnVuY3Rpb24gKCkge1xuXHRcdHRoaXMuc2VsZWN0ZWRTbGlkZSh0aGlzLnN0YXRlLmNvbCArIDEpO1xuXHR9LFxuXHRkaXJlY3Rpb25Ub3A6IGZ1bmN0aW9uICgpIHtcblx0XHR0aGlzLnNlbGVjdGVkU2xpZGUodGhpcy5zdGF0ZS5jb2wsIHRoaXMuc3RhdGUucm93ICsgMSk7XG5cdH0sXG5cdGRpcmVjdGlvbkRvd246IGZ1bmN0aW9uICgpIHtcblx0XHR0aGlzLnNlbGVjdGVkU2xpZGUodGhpcy5zdGF0ZS5jb2wsIHRoaXMuc3RhdGUucm93IC0gMSk7XG5cdH0sXG5cdGRpcmVjdGlvblJlcGFnOiBmdW5jdGlvbiAoKSB7XG5cdFx0aWYgKHRoaXMuY2hlY2tFeGlzdHNTbGlkZSh0aGlzLnN0YXRlLmNvbCwgdGhpcy5zdGF0ZS5yb3cgLSAxKSkge1xuXHRcdFx0dGhpcy5kaXJlY3Rpb25Eb3duKCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIGlmICh0aGlzLmNoZWNrRXhpc3RzU2xpZGUodGhpcy5zdGF0ZS5jb2wgLSAxKSkge1xuXHRcdFx0XHR0aGlzLnNlbGVjdGVkU2xpZGUodGhpcy5zdGF0ZS5jb2wgLSAxLCAodGhpcy5zdGF0ZS5zbGlkZXNbdGhpcy5zdGF0ZS5jb2wgLSAxXXx8e30pLmxlbmd0aCAtIDEpO1xuXHRcdFx0Ly8gfVxuXHRcdH1cblx0fSxcblx0ZGlyZWN0aW9uQXZwYWc6IGZ1bmN0aW9uICgpIHtcblx0XHRpZiAodGhpcy5jaGVja0V4aXN0c1NsaWRlKHRoaXMuc3RhdGUuY29sLCB0aGlzLnN0YXRlLnJvdyArIDEpKSB7XG5cdFx0XHR0aGlzLmRpcmVjdGlvblRvcCgpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAodGhpcy5jaGVja0V4aXN0c1NsaWRlKHRoaXMuc3RhdGUuY29sICsgMSkpIHtcblx0XHRcdFx0dGhpcy5kaXJlY3Rpb25SaWdodCgpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblx0dG9nZ2xlVmlzaWJsZTogZnVuY3Rpb24gKCkge30sXG5cdHNlbGVjdGVkU2xpZGVVUkw6IGZ1bmN0aW9uIChjb2wgPSAwLCByb3cgPSAwKSB7XG5cdFx0aWYgKGNvbCA9PSAwICYmIHJvdyA9PSAwKSB7XG5cdFx0XHRkb2N1bWVudC5sb2NhdGlvbi5oYXNoID0gYC9gO1xuXHRcdH0gZWxzZSBpZiAocm93ID09IDApIHtcblx0XHRcdGRvY3VtZW50LmxvY2F0aW9uLmhhc2ggPSBgLyR7Y29sfWA7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGRvY3VtZW50LmxvY2F0aW9uLmhhc2ggPSBgLyR7Y29sfS8ke3Jvd31gO1xuXHRcdH1cblx0fSxcblx0c2VsZWN0ZWRTbGlkZTogZnVuY3Rpb24gKGNvbCA9IDAsIHJvdyA9IDApIHtcblx0XHRsZXQgbmV3Q29sID0gbnVsbDtcblx0XHRsZXQgbmV3Um93ID0gbnVsbDtcblxuXHRcdGlmICghdGhpcy5zdGF0ZS5zbGlkZXNbY29sXSkge1xuXHRcdFx0aWYgKGNvbCA+ICh0aGlzLnN0YXRlLnNsaWRlcy5sZW5ndGggLSAxKSkge1xuXHRcdFx0XHRuZXdDb2wgPSAodGhpcy5zdGF0ZS5zbGlkZXMubGVuZ3RoIC0gMSk7XG5cdFx0XHR9IGVsc2UgaWYgKGNvbCA8IDApIHtcblx0XHRcdFx0bmV3Q29sID0gMDtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAodGhpcy5zdGF0ZS5zbGlkZXNbY29sXSAmJiAhdGhpcy5zdGF0ZS5zbGlkZXNbY29sXVtyb3ddKSB7XG5cdFx0XHRpZiAocm93ID4gKHRoaXMuc3RhdGUuc2xpZGVzW2NvbF0ubGVuZ3RoIC0gMSkpIHtcblx0XHRcdFx0bmV3Um93ID0gKHRoaXMuc3RhdGUuc2xpZGVzW2NvbF0ubGVuZ3RoIC0gMSk7XG5cdFx0XHR9IGVsc2UgaWYgKHJvdyA8IDApIHtcblx0XHRcdFx0bmV3Um93ID0gMDtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAobmV3Q29sICE9IG51bGwgfHwgbmV3Um93ICE9IG51bGwpIHtcblx0XHRcdFtjb2wsIHJvd10gPSBbKG5ld0NvbCAhPSBudWxsKSA/IG5ld0NvbCA6IGNvbCwgKG5ld1JvdyAhPSBudWxsKSA/IG5ld1JvdyA6IHJvd107XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuY2hlY2tFeGlzdHNTbGlkZShjb2wsIHJvdykpIHtcblx0XHRcdGlmICh0aGlzLnN0YXRlLmNvbCE9Y29sfHx0aGlzLnN0YXRlLnJvdyE9cm93KSB7XG5cdFx0XHRcdFt0aGlzLmxhc3RDb2wsIHRoaXMubGFzdFJvd10gPSBbdGhpcy5zdGF0ZS5jb2wsIHRoaXMuc3RhdGUucm93XTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5zZWxlY3RlZFNsaWRlVVJMKGNvbCwgcm93KTtcblx0XHRcdHRoaXMuc2V0U3RhdGUoe2NvbCwgcm93fSk7XG5cdFx0fVxuXHR9LFxuXHRjaGVja0V4aXN0c1NsaWRlOiBmdW5jdGlvbiAoY29sID0gMCwgcm93ID0gMCkge1xuXHRcdGxldCB2YWxpZENvbCA9IGZhbHNlO1xuXHRcdGxldCB2YWxpZFJvdyA9IGZhbHNlO1xuXG5cdFx0aWYgKHRoaXMuc3RhdGUuc2xpZGVzW2NvbF0pIHtcblx0XHRcdHZhbGlkQ29sID0gdHJ1ZTtcblx0XHRcdGlmICh0aGlzLnN0YXRlLnNsaWRlc1tjb2xdW3Jvd10pIHtcblx0XHRcdFx0dmFsaWRSb3cgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiAodmFsaWRDb2wgJiYgdmFsaWRSb3cpO1xuXHR9LFxuXG5cdGdlbmVyYXRvckNsYXNzTmFtZTogZnVuY3Rpb24gKGNvbCwgcm93LCB7XG5cdFx0cHJlZml4ID0gbnVsbCxcblx0XHRjbGFzc1NlbGVjdGVkID0gXCJzZWxlY3RlZFwiLFxuXHRcdGNsYXNzTGFzdFNlbGVjdGVkID0gXCJsYXN0LXNlbGVjdGVkXCIsXG5cdFx0Y2xhc3NDb2xTZWxlY3RlZCA9IFwiY29sLXNlbGVjdGVkXCIsXG5cdFx0Y2xhc3NSb3dTZWxlY3RlZCA9IFwicm93LXNlbGVjdGVkXCIsXG5cdH0gPSB7fSkge1xuXHRcdGxldCBbbm93Q29sLCBub3dSb3ddID0gW3RoaXMuc3RhdGUuY29sLCB0aGlzLnN0YXRlLnJvd107XG5cdFx0bGV0IGNsYXNzTmFtZXMgPSBbXTtcblxuXHRcdGlmIChub3dDb2wgPT0gY29sKSBjbGFzc05hbWVzLnB1c2goY2xhc3NDb2xTZWxlY3RlZCk7XG5cdFx0aWYgKG5vd1JvdyA9PSByb3cpIGNsYXNzTmFtZXMucHVzaChjbGFzc1Jvd1NlbGVjdGVkKTtcblx0XHRpZiAobm93Q29sID09IGNvbCAmJiBub3dSb3cgPT0gcm93KSBjbGFzc05hbWVzLnB1c2goY2xhc3NTZWxlY3RlZCk7XG5cdFx0aWYgKHRoaXMubGFzdENvbCA9PSBjb2wgJiYgdGhpcy5sYXN0Um93ID09IHJvdykgY2xhc3NOYW1lcy5wdXNoKGNsYXNzTGFzdFNlbGVjdGVkKTtcblxuXHRcdHJldHVybiBjbGFzc05hbWVzLm1hcCgoY2xhc3NOYW1lKSA9PiB7XG5cdFx0XHRpZiAocHJlZml4ICE9PSBudWxsKSB7XG5cdFx0XHRcdHJldHVybiBgJHtwcmVmaXh9LSR7Y2xhc3NOYW1lfWA7XG5cdFx0XHR9IGVsc2UgcmV0dXJuIGNsYXNzTmFtZTtcblx0XHR9KTtcblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdGxldCBzbGlkZXMgPSB0aGlzLnN0YXRlLnNsaWRlcztcblxuXHRcdHJldHVybiAoXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cInZpZXdwb3J0XCI+XG5cblx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJjb250ZW50LWJhY2tncm91bmQtc2xpZGVzXCI+XG5cdFx0XHRcdFx0e3NsaWRlcy5tYXAoKGNvbCwgaW5kZXhDb2wpID0+IGNvbC5tYXAoKHJvdywgaW5kZXhSb3cpID0+IHtcblx0XHRcdFx0XHRcdHJldHVybiA8ZGl2IGNsYXNzTmFtZT17W1wiYmFja2dyb3VuZFwiLCAuLi50aGlzLmdlbmVyYXRvckNsYXNzTmFtZShpbmRleENvbCwgaW5kZXhSb3cpXS5qb2luKFwiIFwiKX0gc3R5bGU9e3tiYWNrZ3JvdW5kQ29sb3I6IChyb3cucHJvcHNbXCJiYWNrZ3JvdW5kLWNvbG9yXCJdIHx8IFwid2hpdGVcIil9fT48L2Rpdj5cblx0XHRcdFx0XHR9KSl9XG5cdFx0XHRcdDwvZGl2PlxuXG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiY29udGVudC1zbGlkZXNcIj5cblx0XHRcdFx0XHR7c2xpZGVzLm1hcCgoY29sLCBpbmRleENvbCkgPT4gY29sLm1hcCgocm93LCBpbmRleFJvdykgPT4ge1xuXHRcdFx0XHRcdFx0cmV0dXJuIDxkaXYgY2xhc3NOYW1lPXtbXCJzbGlkZVwiLCAuLi50aGlzLmdlbmVyYXRvckNsYXNzTmFtZShpbmRleENvbCwgaW5kZXhSb3cpXS5qb2luKFwiIFwiKX0+XG5cdFx0XHRcdFx0XHRcdHtyb3cucHJvcHMuY2hpbGRyZW59XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHR9KSl9XG5cdFx0XHRcdDwvZGl2PlxuXG5cdFx0XHQ8L2Rpdj5cblx0XHQpO1xuXHR9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgVmlld3BvcnQ7XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgVmlld3BvcnQgZnJvbSBcIi4vY29tcG9uZW50L1ZpZXdwb3J0XCI7XG5pbXBvcnQgUmVhY3RET00gZnJvbSBcInJlYWN0LWRvbVwiO1xuXG5sZXQgU2xpZGVzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAoXG5cdFx0XHQ8Vmlld3BvcnQ+XG5cdFx0XHRcdDxkaXYgY29sPXswfSBiYWNrZ3JvdW5kLWNvbG9yPVwiZ3JlZW5cIj5cblx0XHRcdFx0XHQ8aDE+VW4gZ2F0byBkaWNlIHF1ZSB5IHlvIGRpZ28gcXVlISE8L2gxPlxuXHRcdFx0XHRcdDxoMj5VbiBnYXRvIGRpY2UgcXVlIHkgeW8gZGlnbyBxdWUhITwvaDI+XG5cdFx0XHRcdFx0PGgzPlVuIGdhdG8gZGljZSBxdWUgeSB5byBkaWdvIHF1ZSEhPC9oMz5cblx0XHRcdFx0XHQ8aDQ+VW4gZ2F0byBkaWNlIHF1ZSB5IHlvIGRpZ28gcXVlISE8L2g0PlxuXHRcdFx0XHRcdDxoNT5VbiBnYXRvIGRpY2UgcXVlIHkgeW8gZGlnbyBxdWUhITwvaDU+XG5cdFx0XHRcdFx0PGg2PlVuIGdhdG8gZGljZSBxdWUgeSB5byBkaWdvIHF1ZSEhPC9oNj5cblx0XHRcdFx0XHQ8cD5VbiBnYXRvIGRpY2UgcXVlIHkgeW8gZGlnbyBxdWUhITwvcD5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDxkaXYgY29sPXsxfSBiYWNrZ3JvdW5kLWNvbG9yPVwib3JhbmdlXCI+XG5cdFx0XHRcdFx0PGgxPlNsaWRlIDI8L2gxPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PGRpdiBjb2w9ezJ9IGJhY2tncm91bmQtY29sb3I9XCJ5ZWxsb3dcIj5cblx0XHRcdFx0XHQ8aDE+U2xpZGUgMzwvaDE+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8ZGl2IGNvbD17M30gYmFja2dyb3VuZC1jb2xvcj1cImdyZXlcIj5cblx0XHRcdFx0XHQ8aDE+U2xpZGUgNDwvaDE+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8ZGl2IGNvbD17M30gcm93PXsxfSBiYWNrZ3JvdW5kLWNvbG9yPVwicmVkXCI+XG5cdFx0XHRcdFx0PGgxPlNsaWRlIDQgc3ViIHNsaWRlIDE8L2gxPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PGRpdiBjb2w9ezN9IHJvdz17Nn0gYmFja2dyb3VuZC1jb2xvcj1cImJsdWVcIj5cblx0XHRcdFx0XHQ8aDE+U2xpZGUgNCBzdWIgc2xpZGUgMjwvaDE+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8ZGl2IGNvbD17Nn0gcm93PXs0fSBiYWNrZ3JvdW5kLWNvbG9yPVwiY2hhcnRyZXVzZVwiPlxuXHRcdFx0XHRcdDxoMT5TbGlkZSA0IHN1YiBzbGlkZSAzPC9oMT5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDxkaXYgY29sPXs5fSBiYWNrZ3JvdW5kLWNvbG9yPVwiZGFya2N5YW5cIj5cblx0XHRcdFx0XHQ8aDE+U2xpZGUgNTwvaDE+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8ZGl2IGNvbD17NDF9IHJvdz17MH0gYmFja2dyb3VuZC1jb2xvcj1cImRhcmtzbGF0ZWJsdWVcIj5cblx0XHRcdFx0XHQ8aDE+U2xpZGUgNSBzdWIgU2xpZGUgMTwvaDE+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8ZGl2IGNvbD17NDF9IHJvdz17MX0gYmFja2dyb3VuZC1jb2xvcj1cImdyZWVueWVsbG93XCI+XG5cdFx0XHRcdFx0PGgxPlNsaWRlIDUgc3ViIFNsaWRlIDI8L2gxPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PGRpdiBjb2w9ezQxfSByb3c9ezJ9IGJhY2tncm91bmQtY29sb3I9XCJsaWdodGdvbGRlbnJvZHllbGxvd1wiPlxuXHRcdFx0XHRcdDxoMT5TbGlkZSA1IHN1YiBTbGlkZSAzPC9oMT5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDxkaXYgY29sPXs0MX0gcm93PXszfSBiYWNrZ3JvdW5kLWNvbG9yPVwibGlnaHRza3libHVlXCI+XG5cdFx0XHRcdFx0PGgxPlNsaWRlIDUgc3ViIFNsaWRlIDQ8L2gxPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdDwvVmlld3BvcnQ+XG5cdFx0KTtcblx0fVxufSk7XG5cblxuUmVhY3RET00ucmVuZGVyKDxTbGlkZXMgLz4sIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2xpZGVcIikpO1xuIl19
