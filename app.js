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

        //overseer 2 Dount distant
        this.L2donut = 7;

        //overserr 2 screen distant
        this.magfactor = 400;

        //donut resoultion
        this.resolutionCircle = 144;
        this.resolutionTube = 288;

        //donut Size
        this.donutOuterSize = 2;
        this.donutinternalSize = 1;

        //rotation angle
        this.xAngle = -2*Math.PI/1000;
        this.yAngle = 2*Math.PI/6000;
        this.zAngle = 2*Math.PI/5000;

        //mode
        this.mode = 0;

        window.addEventListener("click", (e) => {
            //mode 변경
            if(this.mode == 0){
                this.mode += 1;
                console.log(this.mode);
            }
            else{
                this.mode = 0;
                console.log(this.mode);
            }
            
        });

        this.donut = new Donut(this.mode,this.canvas,this.stageWidth,this.stageHeight,this.e,this.donutinternalSize,this.donutOuterSize,this.stageWidth/2,this.stageHeight/2,this.magfactor,this.L2donut,this.resolutionCircle,this.resolutionTube,this.xAngle,this.yAngle,this.zAngle);
        //this.donut.rotation();
        console.log(this.stageWidth/2+"   "+this.stageHeight/2);
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
        this.donut.drawDonut(this.mode);
    }    
}


window.onload = () => {
    new App();
}