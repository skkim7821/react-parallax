import React from 'react';

export default class Parallax extends React.Component {

	constructor(props) {
		super(props);

		this.node = null;
		this.windowHeight = this.getWindowHeight();
		this.childStyle = this.getChildStyle();
		this.state = {
			top: 0,
			height: 0
		};
		this.autobind();
	}

	autobind() {
		this.onScroll = this.onScroll.bind(this);
		this.onWindowResize = this.onWindowResize.bind(this);
		this.updatePosition = this.updatePosition.bind(this);
	}

	render() {
		return (
			<div className="react-parallax" style={this.getParallaxStyle()}>
				{this.props.bgImage ? <img src={this.props.bgImage} style={this.getBackgroundStyle()} ref="bgImage" alt=""/> : ''}
				<div style={this.childStyle} ref="content">
					{this.props.children}
				</div>
			</div>
		);
	}

	componentWillMount() {
		document.addEventListener('scroll', this.onScroll, false);
		window.addEventListener("resize", this.onWindowResize, false);
		window.addEventListener("load", this.updatePosition, false);
	}

	componentDidMount() {
		this.node = React.findDOMNode(this);
		this.updatePosition();
	}

	componentWillUnmount() {
		document.removeEventListener('scroll', this.onScroll, false);
		window.removeEventListener("resize", this.onWindowResize, false);
		window.removeEventListener("load", this.updatePosition, false);
	}

	onScroll(event) {
		this.updatePosition();
	}

	updatePosition() {
		let autoHeight = false;
		let content = React.findDOMNode(this.refs.content);
		this.contentHeight = content.getBoundingClientRect().height;
		this.contentWidth = this.node.getBoundingClientRect().width;

		let img = React.findDOMNode(this.refs.bgImage);
		if (img && (img.naturalWidth / img.naturalHeight * this.contentHeight < this.contentWidth)) {
			autoHeight = true;
		}

		let rect = this.node.getBoundingClientRect();
		if (rect) {
			this.setState({
				top: this.node.getBoundingClientRect().top,
				autoHeight: autoHeight
			});
		}
	}

	onWindowResize() {
		this.windowHeight = this.getWindowHeight();
		this.updatePosition();
	}

	getBackgroundStyle() {
		let backPos = Math.floor(((this.state.top + this.contentHeight) / this.windowHeight) * this.props.strength);
		let height = this.state.autoHeight ? 'auto' : Math.floor(this.contentHeight + this.props.strength);
		let width = !this.state.autoHeight ? 'auto' : this.contentWidth;
		let style = {
			position: 'absolute',
			left: '0',
			top: '-' + backPos + 'px',
			height: height,
			width: width
		};
		return style;
	}

	getParallaxStyle() {
		let style = {
			position: 'relative',
			background: this.props.bgColor,
			height: this.contentHeight,
			overflow: 'hidden'
		};
		return style;
	}

	getChildStyle() {
		return {
			position: 'absolute',
			top: '50%',
			left: '50%',
			WebkitTransform: 'translate(-50%, -50%)',
			msTransform: 'translate(-50%, -50%)',
			transform: 'translate(-50%, -50%)'
		};
	}

	getWindowHeight() {
		let w = window,
			d = document,
			e = d.documentElement,
			g = d.getElementsByTagName('body')[0];
		
		return w.innerHeight || e.clientHeight || g.clientHeight;
	}

	log() {
		if(this.props.log) {
			console.log(arguments);
		}
	}
}
Parallax.propTypes = {
	bgImage: React.PropTypes.string,
	bgColor: React.PropTypes.string,
	height: React.PropTypes.number,
	strength: React.PropTypes.number,
	log: React.PropTypes.bool
};
Parallax.defaultProps = {
	bgColor: '#fff',
	height: 300,
	strength: 100,
	log: false
};