var React = require('react');
var _ = require('underscore');

var Player = React.createClass({
    render: function() {
        var rotation = this.props.heading + Math.PI;
        var transformStyle = 'translateX('+this.props.position.x+'px) translateY('+this.props.position.y+'px) rotate('+rotation+'rad)';
        if (this.props.size) {
            transformStyle += ' scale('+this.props.size+', '+this.props.size+')';
        }
        var style = {
            transform: transformStyle,
            webkitTransform: transformStyle,
            top: 0,
            left: 0,
            position: 'absolute',
            transition: 'transform 0.1s linear',
            webkitTransition: '-webkit-transform 0.1s linear',
        }
        var c1 = {
            position: 'absolute',
            top: -28, // height: 40
            left: -15, // width: 30
            width: 175,
            height: 55
        }
        var c2 = {
            position: 'absolute',
            top: -20, // height: 40
            left: -15, // width: 30
            borderRadius: 20
        }
        return (
            <div style={style}>
                <img style={c1} src='../../images/caterpillar-l.png' />
                <img style={c2} src={this.props.img} />
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
    getInitialState: function() {
        return {
            rotation: Math.floor((Math.random()*360)+1)
        };
    },
    render: function() {
        var rotation = Math.floor((Math.random()*360)+1);
        var transformStyle = 'translate(-10px, -10px) rotate('+rotation+'deg)';
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
    },

    renderPlayer: function(props, target) {
        React.render(<Player heading={props.heading} position={props.position} img={props.img} size={props.size}/>, target);
    }
}
