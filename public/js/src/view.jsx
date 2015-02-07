var React = require('react');
var _ = require('underscore');

var Player = React.createClass({
    render: function() {
        return (
            <div>{JSON.stringify(this.props)}</div>
        );
    }
})

var Hole = React.createClass({
    render: function() {
        return (
            <div>{JSON.stringify(this.props)}</div>
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
