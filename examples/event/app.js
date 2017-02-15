/** @jsx React.DOM */

'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var ReactCanvas = require('react-canvas');

var Gradient = ReactCanvas.Gradient;
var Surface = ReactCanvas.Surface;
var Group = ReactCanvas.Group;
var Text = ReactCanvas.Text;
var Image = ReactCanvas.Image;
var Layer = ReactCanvas.Layer;

var App = React.createClass({

    render: function () {
        var size = this.getSize();
        return (
            <Surface top={0} left={0} width={size.width} height={size.height}>
                <Text style={this.getTextStyle()}
                      onClick={() => {
                          outClick();
                      }}
                >
                    Click Me
                </Text>

                <Group style={{top: 200, left: 100, width: 100, height: 100, backgroundColor: '#00f'}} onClick={() => {
                    alert('click image')
                }}
                >
                    <Image style={{top: 200, left: 100, width: 80, height: 80}}
                           src="../gyroscope/button.jpg"
                    />
                </Group>


                <Group style={{top: 300, left: 100, width: 200, height: 100, backgroundColor: '#F00'}}
                       onClick={() => {
                           alert('click image')
                       }}
                >

                </Group>

                <Layer style={{top: 500, left: 100, width: 200, height: 100, backgroundColor: '#0F0'}}
                       onClick={() => {
                           alert('click image')
                       }}
                >

                </Layer>

            </Surface>
        );
    },

    getTextStyle: function () {
        return {
            top: 100,
            left: 100,
            width: window.innerWidth,
            height: 20,
            lineHeight: 20,
            fontSize: 12
        };
    },

    getGradientColors: function () {
        return [
            {color: "transparent", position: 0},
            {color: "#000", position: 1}
        ];
    },

    getSize: function () {
        return document.getElementById('main').getBoundingClientRect();
    }

});

ReactDOM.render(<App />, document.getElementById('main'));
