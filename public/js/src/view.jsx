var React = require('react');

var App = React.createClass({
    render: function() {
        return (
            <div>
                {
                    JSON.stringify(this.props.players)
                } {
                    JSON.stringify(this.props.holes)
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
