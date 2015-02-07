var React = require('react');
var _ = require('underscore');

var Player = React.createClass({
    render: function() {
        var rotation = this.props.heading + Math.PI/2;
        var transformStyle = 'translateX('+this.props.position.x+'px) translateY('+this.props.position.y+'px) rotate('+rotation+'rad)';
        var style = {
            position: 'absolute',
            top: 0,
            left: 0,
            transform: transformStyle,
            webkitTransform: transformStyle
        }
        return (
            <div style={style}>
                <img style={{borderRadius: 20}}src={this.props.img} />
            </div>
        );
    }
})

var Hole = React.createClass({
    render: function() {
        var style = {
            position: 'absolute',
            top: this.props.position.y,
            left: this.props.position.x
        }
        return (
            <div style={style}>•</div>
        );
    }
})

var App = React.createClass({
    render: function() {
        return (
            <div>
                {
                    _.pairs(this.props.players).map(function(kv) {
                        return <Player
                            key={kv[0]}
                            heading={kv[1].heading}
                            position={kv[1].position}
                            img={kv[1].img}
                            food={kv[1].food}
                        />
                    })
                }
                {
                    this.props.holes.map(function(hole, i) {
                        return <Hole key={i} position={hole.position} size={hole.size} />
                    })
                }
            </div>
        );
    }
});

module.exports = {
    render: function(props, target) {
        React.render(<App players={props.players} holes={props.holes}/>, target);
    }
}
