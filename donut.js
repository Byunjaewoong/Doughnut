import {Calculate} from "./tool.js"

export class Donut{
    constructor(canvas,stageWidth,stageHeight,event,r1,r2,xp,yp,k1,k2,anglestep,anglestep2,xAngle,yAngle){
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.stageHeight = stageHeight;
        this.stageWidth = stageWidth;
        this.fontsize = 10;
        this.r1 = r1;
        this.r2 = r2;
        this.k1 = k1; // eye 2 screen
        this.k2 = k2; // eye 2 donut
        this.xp = xp;
        this.yp = yp;
        this.anglestep = anglestep;
        this.anglestep2 = anglestep2;
        this.septa = 2*Math.PI/this.anglestep;
        this.delta = 2*Math.PI/this.anglestep2;

        this.dotStack = [];
        this.luminStack = [];
        this.comboStack = [];
        this.xAngle = xAngle;
        this.yAngle = yAngle;
        this.t = 0;

        this.calDonut();
    }
    //[this.r1+this.r2,0,0]
//virtual 3D space cordinate
    calDonut(){
        for(let i=0;i<this.anglestep;i++){
            for(let j=0;j<this.anglestep2;j++){
                this.dotStack.push([[
                    (this.r2+this.r1*Math.cos(this.septa*i))*Math.cos(this.delta*j),
                    this.r1*Math.sin(this.septa*i),
                    -((this.r2+(this.r1*Math.cos(this.septa*i)))*Math.sin(this.delta*j))
                    ]]);
            }
        }
        this.luminance();
        console.log(this.dotStack[0]);
        for(let i = 0; i<this.dotStack.length;i++){
            this.comboStack.push([this.dotStack[i],this.luminStack[i]]);
        }
        this.sorting();

        /*for(let i = 0; i<this.dotStack.length;i++){
            console.log(this.comboStack[i][0][0][2]);
        }*/


    }

    rotation(){
        //let xspeed = 2*Math.PI*this.t/360000;
        //let yspeed = 2*Math.PI*this.t/180;
        this.xAngle = -2*Math.PI/100;
        this.yAngle = 2*Math.PI/600;
        this.zAngle = 2*Math.PI/500;

        //console.log(this.xAngle+"   "+this.yAngle);

        this.xaxisMatrix = [[1,0,0],[0,Math.cos(this.xAngle),Math.sin(this.xAngle)],[0,-Math.sin(this.xAngle),Math.cos(this.xAngle)]];
        this.yaxisMatrix = [[Math.cos(this.yAngle),Math.sin(this.yAngle),0],[-Math.sin(this.yAngle),Math.cos(this.yAngle),0],[0,0,1]];
        this.zaxisMatrix = [[Math.cos(this.zAngle),0,Math.sin(this.zAngle)],[0,1,0],[-Math.sin(this.zAngle),0,Math.cos(this.zAngle),],];
        //this.xaxisMatrix = [[1,0,0],[0,Math.cos(this.xAngle),-Math.sin(this.xAngle)],[0,Math.sin(this.xAngle),Math.sin(this.xAngle)]];
        //this.yaxisMatrix = [[Math.cos(this.yAngle),-Math.sin(this.yAngle),0],[Math.sin(this.yAngle),Math.cos(this.yAngle),0],[0,0,1]];

        for(let i=0;i<this.dotStack.length;i++){
            let matrix_buf = Calculate.matrixProduct(this.dotStack[i],this.xaxisMatrix);
            let matrix_buf2 = Calculate.matrixProduct(matrix_buf,this.zaxisMatrix);
            this.dotStack[i] = Calculate.matrixProduct(matrix_buf2,this.yaxisMatrix);
            let matrix_buf_lu = Calculate.matrixProduct(this.luminStack[i],this.xaxisMatrix);
            let matrix_buf_lu2 = Calculate.matrixProduct(matrix_buf_lu,this.zaxisMatrix);
            this.luminStack[i] = Calculate.matrixProduct(matrix_buf_lu2,this.yaxisMatrix);
            this.comboStack[i][0] =  this.dotStack[i];
            this.comboStack[i][1] =  this.luminStack[i];
        }

        this.sorting();

    }

    luminance(){
        for(let i=0;i<this.anglestep;i++){
            for(let j=0;j<this.anglestep2;j++){
                this.luminStack.push([[
                    (Math.cos(this.septa*i))*Math.cos(this.delta*j),
                    Math.sin(this.septa*i),
                    (Math.cos(this.septa*i)*Math.sin(this.delta*j))
                ]]);
            }
        }
    }

    resize(){
        
    }

    sorting(){
        this.comboStack.sort(function(a,b){
            return b[0][0][1] - a[0][0][1];
        })
    }
//canvas cordinate
    
    drawDonut(){
        //console.log(this.dotStack[0]);

        for(let i=0;i<this.dotStack.length;i++){
            //let x_persp = this.dotStack[i][0][0]*this.k1/(this.k2+this.dotStack[i][0][2]);
            let x_persp = this.comboStack[i][0][0][0]*this.k1/(this.k2+this.comboStack[i][0][0][1]);
            //let y_persp = this.dotStack[i][0][1]*this.k1/(this.k2+this.dotStack[i][0][2]);
            let y_persp = this.comboStack[i][0][0][2]*this.k1/(this.k2+this.comboStack[i][0][0][1]);
            let xscreen = x_persp + this.xp;
            let yscreen = y_persp + this.yp;

            //let L = Calculate.vectorProduct(this.luminStack[i][0][0],this.luminStack[i][0][1],this.luminStack[i][0][2]
            let L = Calculate.vectorProduct(this.comboStack[i][1][0][0],this.comboStack[i][1][0][1],this.comboStack[i][1][0][2]
                ,-1/Math.sqrt(3),-1/Math.sqrt(3),1/Math.sqrt(3));
            
            if((this.k2+this.comboStack[i][0][0][1])<0){
            console.log(this.k2+this.comboStack[i][0][0][1]);
            }
            let orr = 1/(this.k2+this.comboStack[i][0][0][1]);

            //this.ctx.fillStyle = "rgba(" +r_c+ "," +g_c+ "," +b_c+ ",1)";
            
            if(L>0){
                L = L*L;                
                let colorindex = 255*L;
             this.ctx.fillStyle = "rgba("+ colorindex +","+ colorindex +","+ colorindex +",1)";
                        this.ctx.beginPath();
                        this.ctx.arc(
                            xscreen, //* ratio_w,
                            yscreen, //* ratio_h,
                            40*orr,
                            0 * 2/8 * Math.PI, 8 * 2/8 * Math.PI  
                            );
                        this.ctx.fill();
            }
            else{
                this.ctx.fillStyle = "rgba(0,0,0,1)";
                this.ctx.beginPath();
                this.ctx.arc(
                    xscreen, //* ratio_w,
                    yscreen, //* ratio_h,
                    40*orr,
                    0 * 2/8 * Math.PI, 8 * 2/8 * Math.PI  
                    );
                this.ctx.fill();
            }
            
            //this.filltext(xscreen,yscreen,text);
        }
    }

    filltext(x,y,lumicode){
        this.ctx.font = "10px serif";
        let colorindex = lumicode * 5;
        this.ctx.fillStyle = "rgba("+colorindex+","+colorindex+",10,1)";
        this.ctx.fillText(lumicode,x,y);

    }

}

