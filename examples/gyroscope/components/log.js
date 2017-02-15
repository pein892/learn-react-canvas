/**
 * Created by pein on 2017/2/13.
 */

var React = require('react');
var ReactCanvas = require('react-canvas');

var Text = ReactCanvas.Text;


var Log = React.createClass({

    propTypes: {
        text: React.PropTypes.string.isRequired,
    },

    render: function () {
        return (
            <Text>{this.props.text}</Text>
        );
    }

});

module.exports = Log;