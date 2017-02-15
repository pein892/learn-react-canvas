**基于Flipboard的React Canvas脚手架尝试实现swing的分享页面。**

    地址：https://github.com/Flipboard/react-canvas.git
    npm install
    npm start

## 运行项目，观察里面的四个例子：

 - gradient: 一个用来做颜色渐变的组件；
 - css-layout: 在canvas中轻松实现图文排版；
 - listview: 使用listview控件，实现高性能的列表；
 - timeline: 具有动画效果的翻页图文页面。

## lib文件夹： 各种组件及工具类

## 打包工具： gulp+webpack

##尝试实现：

### 新建页面、js文件，修改webpack.config.js

```
//index.html
<body>
  <div id="main"></div>
  <script src="/build/gyroscope.js"></script>
</body>
```

```
//webpack.config.js
entry: {
    ...
    'gyroscope': ['./examples/gyroscope/app.js'],
},
output: {
    filename: '[name].js'
}
```
### 编写app.js

 组件与React略有不同，参考文档;

 默认采用绝对布局，参考css-layout例子，可以通过指定``enableCSSLayout={true}``来使用CSS布局和flexbox布局;

 设置监听，可以直接操作DOM：

    componentDidMount: function()

        //监听手机陀螺仪事件
        if (window.DeviceMotionEvent) {
            window.addEventListener("devicemotion", this.motionHandler, false);
        } else {
            document.body.innerHTML = "Not supported on your device.";
        }
        //禁用原生手势，阻止屏幕上下滑动
        document.addEventListener("touchmove", (event) => {
            event.preventDefault();
            event.stopPropagation();
        }, false);
    },

图片组件没有加载成功后的回调，修改源码``/lib/Image.js``：

    componentDidMount: function () {
        ImageCache.get(this.props.src).on('load', this.handleImageLoad);
    },

    handleImageLoad: function () {
        var imageAlpha = 1;
        if (this.props.fadeIn) {
            imageAlpha = 0;
            this._animationStartTime = Date.now();
            this._pendingAnimationFrame = requestAnimationFrame(this.stepThroughAnimation);
        }
        this.setState({ loaded: true, imageAlpha: imageAlpha });
        //增加如下代码
        if(this.props.onLoadEnd){
            this.props.onLoadEnd();
        }
    },
预加载图片：

    preLoadImages: function () {

        var imgs = [];
        for(var i = 1; i <= imgs_num; i++){
            imgs.push(this.renderImages(i));
        }

        return (
            <Group>
                {imgs}
            </Group>
        );
    },

    renderImages: function (i) {
        return(
            <Image style={{top: 0, left: 0, width:0, height: 0}}
                   src={"https://xx.xx.xx/xxx-" + i + ".jpg"}
                   onLoadEnd={() => {
                       imgLoadEndNum++;
                       //计数
                       this.setState({imgLoadEndNum: imgLoadEndNum})
                   }}
                   key={i}
            />
        )
    },

 响应监听：

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
        img_index = img_index > imgs_num ? imgs_num : img_index;
        //底部的滑块位置
        var slider_left = (img_index / imgs_num) * (this.canvasWidth - 50);

        //更新state即可重新渲染
        this.setState({img_index: img_index, slider_left: slider_left});

        last_time = new Date();
    },

 ``getSize():``

    //getBoundingClientRect()
    //这个方法返回一个矩形对象，包含四个属性：left、top、right和bottom。分别表示元素各边与页面上边和左边的距离。
    getSize: function () {
        return document.getElementById('main').getBoundingClientRect();
    },

 禁止页面元素被选中：

    <style>
    body, canvas, div {
      -moz-user-select: none;
      -webkit-user-select: none;
      -ms-user-select: none;
      -khtml-user-select: none;
      user-select: none;
      -webkit-tap-highlight-color: rgba(1, 1, 1, 0);
    }
  </style>

 至此，基本功能实现。但是考虑到引导页结构复杂，同时还有动画，而通过使用发现，react-canvas对动画支持很差，使用state实现则开销很大，放弃使用react-canvas实现。但在以后如果有合适的场景下，应该会有用武之地。

## 测试react-canvas事件（主要是点击事件）：
### 支持的事件：

    //EventTypes.js
    module.exports = {
        onTouchStart: 'touchstart',
        onTouchMove: 'touchmove',
        onTouchEnd: 'touchend',
        onTouchCancel: 'touchcancel',
        onClick: 'click',
        onContextMenu: 'contextmenu',
        onDoubleClick: 'dblclick'
    };

测试代码：

    <Surface top={0} left={0} width={size.width} height={size.height}>
        //文本组件可直接添加事件。
        <Text style={this.getTextStyle()}onClick={() => {outClick();}}>
            Click Me
        </Text>
        //图片组件需要包含在Group组件中，给Group组件添加事件。Group和div在展现上不同，不会包含子组件，需要同时指定它的位置和大小。使用css-layout可能不存在这个问题，没有尝试。
        <Group style={{top: 200, left: 100, width: 100, height: 100, backgroundColor: '#00f'}} onClick={() => {alert('click image')}}>
            <Image style={{top: 200, left: 100, width: 80, height: 80}}
                           src="../gyroscope/button.jpg"/>
        </Group>

        //可以当做div组件理解。
        <Group style={{top: 300, left: 100, width: 200, height: 100, backgroundColor: '#F00'}} onClick={() => {alert('click image')}}>
        </Group>
        //文档里说是左右组件的基组件，用起来和Group差不多。
        <Layer style={{top: 500, left: 100, width: 200, height: 100, backgroundColor: '#0F0'}} onClick={() => {alert('click image')}}>
        </Layer>

    </Surface>

