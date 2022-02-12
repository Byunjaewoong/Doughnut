import {Calculate} from "./tool.js"
import {Donut} from "./donut.js"

class App {
    constructor(){
        this.canvas = document.createElement('canvas');
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.pixelRatio = 1;

        window.addEventListener('resize', this.resize.bind(this), false);
        this.resize();

        window.requestAnimationFrame(this.animate.bind(this));
        this.e = 0 ;
        //this.donut = new Donut(this.canvas,this.stageWidth,this.stageHeight,this.e,1,2,this.stageWidth/2,this.stageHeight/2,500,4,144,288,2*Math.PI/360,2*Math.PI/360);
        this.donut = new Donut(this.canvas,this.stageWidth,this.stageHeight,this.e,1,2,this.stageWidth/2,this.stageHeight/2,500,6,100,200,2*Math.PI/360,2*Math.PI/360);
        //this.donut.rotation();
        console.log(this.donut.dotStack[0]);
    }

    resize(){
        this.stageWidth = document.body.clientWidth;
        this.stageHeight = document.body.clientHeight;
        this.canvas.width = this.stageWidth * this.pixelRatio;
        this.canvas.height = this.stageHeight * this.pixelRatio;
    }

    animate() {
        window.requestAnimationFrame(this.animate.bind(this));
        this.ctx.clearRect(0,0,this.stageWidth,this.stageHeight);
        this.donut.rotation();
        this.donut.drawDonut();
    }    
}


window.onload = () => {
    new App();
}
