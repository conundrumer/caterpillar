var React = require('react');
var _ = require('underscore');

var Player = React.createClass({
    render: function() {
        var rotation = this.props.heading + Math.PI;
        var transformStyle = 'translateX('+this.props.position.x+'px) translateY('+this.props.position.y+'px) rotate('+rotation+'rad)';
        var style = {
            transform: transformStyle,
            webkitTransform: transformStyle,
            position: 'absolute',
            top: -20, // height: 40
            left: -15, // width: 30
            transition: 'transform 0.1s linear',
            webkitTransition: '-webkit-transform 0.1s linear',
        }
        return (
            <div className='caterpillar' style={style}>
                <img className='caterpillar-face' style={{borderRadius: 20}}src={this.props.img} />
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

var Food = React.createClass({
    render: function() {
        var rotation = Math.floor((Math.random()*360)+1);
        var transformStyle = 'rotate('+rotation+'deg)';
        var style = {
            transform: transformStyle,
            webkitTransform: transformStyle,
            position: 'absolute',
            top: this.props.position.y,
            left: this.props.position.x
        }
        return (
            <div className='food' style={style}></div>
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
                {
                    this.props.foods.map(function(food, i) {
                        return <Food key={i} position={food.position} size={food.size} />
                    })
                }
            </div>
        );
    }
});

module.exports = {
    render: function(props, target) {
        React.render(<App players={props.players} holes={props.holes} foods={props.foods}/>, target);
    }
}
