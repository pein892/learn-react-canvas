/**
 * Created by pein on 2017/2/13.
 */
var React = require('react');
var ReactDOM = require('react-dom');
var ReactCanvas = require('react-canvas');
var Log = require('./components/log');

var Surface = ReactCanvas.Surface;
var Text = ReactCanvas.Text;
var Image = ReactCanvas.Image;
var Group = ReactCanvas.Group;
var Layer = ReactCanvas.Layer;

var interval;
var img_index = 1;
var direction = 'right';
var imgLoadEndNum = 0;
var last_time = 0;
var angle = 0;
var max_angle = 51;
var App = React.createClass({

    getInitialState: function() {
        return {
            beta: 'init beta',
            img_index: 1,
            imgLoadEndNum: 0,
            slider_left: 0
        };
    },

    componentDidMount: function() {

        if (window.DeviceMotionEvent) {
            window.addEventListener("devicemotion", this.motionHandler, false);
        } else {
            document.body.innerHTML = "Not supported on your device.";
        }

        document.addEventListener("touchmove", (event) => {
            event.preventDefault();
            event.stopPropagation();
        }, false);


        this.canvasWidth = this.getSize().width;
    },

    preLoadImages: function () {

        var imgs = [];
        for(var i = 1; i <= 102; i++){
            imgs.push(this.renderImages(i));
        }

        return (
            <Group>
                {imgs}
            </Group>
        );
    },

    renderProcess: function () {
        if(this.state.imgLoadEndNum == 102){
            return null;
        }else{
            return(
                <Group>
                    <Text style={this.getTextStyle()}>Loading... {this.state.imgLoadEndNum / 102 * 100}%</Text>
                </Group>
            )
        }
    },
    
    renderImages: function (i) {
        return(
            <Image style={{top: 0, left: 0, width:0, height: 0}}
                   src={"https://s3.amazonaws.com/overseas-sway-img-release/FqijFTAS1yMOyfMV90Bg7mmgD6ZW.mp4-" + i + ".jpg"}
                   onLoadEnd={() => {
                       imgLoadEndNum++;
                       this.setState({imgLoadEndNum: imgLoadEndNum})
                   }}
                   key={i}
            />
        )
    },

    motionHandler: function (event) {
        var timeD = (new Date() - last_time);
        var angleV = event.rotationRate.beta;

        angleV = angleV > 60 ? 60 : angleV;
        angleV = angleV < -60 ? -60 : angleV;

        var angleD = angleV * timeD / 1000;

        angle = angle + angleD;

        if(angle < 0){
            angle = 0;
        }
        if(angle > max_angle){
            angle = max_angle;
        }

        img_index = Math.round((angle / max_angle) * 102);

        img_index = img_index < 1 ? 1 : img_index;
        img_index = img_index > 102 ? 102 : img_index;

        var slider_left = (img_index / 102) * (this.canvasWidth - 50);

        this.setState({img_index: img_index, slider_left: slider_left});

        last_time = new Date();
    },

    renderContent: function () {

        if(this.state.imgLoadEndNum == 102){
            return (
                <Image style={this.getImageStyle()}
                       src={"https://s3.amazonaws.com/overseas-sway-img-release/FqijFTAS1yMOyfMV90Bg7mmgD6ZW.mp4-" + this.state.img_index + ".jpg"}
                       fadeIn={false}
                />
            )
        }else{
            return null;
        }
    },

    render: function () {
        var size = this.getSize();
        return (
            <Surface top={0} left={0} width={size.width} height={size.height}>
                <Group>
                    {this.renderContent()}
                    {this.preLoadImages()}
                    {this.renderProcess()}
                </Group>

                <Group style={this.sliderStyle()}>
                </Group>

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

    sliderStyle: function () {
        return {
            top: this.getSize().height - 10,
            left: this.state.slider_left,
            width: 50,
            height: 10,
            backgroundColor: '#0ff'
        }
    },

    getSize: function () {
        return document.getElementById('main').getBoundingClientRect();
    },

    getImageStyle: function () {
        return {
            top: 0,
            left: 0,
            width: this.getSize().width,
            height: this.getSize().height
        };
    }

});

ReactDOM.render(<App />, document.getElementById('main'));
