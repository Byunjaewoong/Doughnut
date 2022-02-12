export class Calculate{
    constructor(){}

    static vectorProduct(x1,y1,z1,x2,y2,z2){
        let d = x1*x2 + y1*y2 + z1*z2; 
        return d;
    }

    static distanceLineToPoint(x3,y3,z3,x_polar,y_polar,z_polar){
            //벡터와 한 점의 최단거리 (외적을 통한 계산)  
    let expo_x = (y_polar*z3) - (z_polar*y3);
    let expo_y = (x_polar*z3) - (z_polar*x3);
    let expo_z = (x_polar*y3) - (y_polar*x3);
    
    let numer = Math.pow(expo_x,2)+Math.pow(expo_y,2)+Math.pow(expo_z,2);
    let denom = Math.pow(x_polar,2)+Math.pow(y_polar,2)+Math.pow(z_polar,2);
    let d = Math.sqrt(numer/denom);

    return d;
    }

    static distancePointToPoint(x1,y1,z1,x2,y2,z2){
        let d = Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2)+Math.pow(z1-z2,2));
        return d;
    }

    static directionVectorPlanetToSun(vx,vy,vz,windowRadius,sunx,suny){
        //구의 중심(vx,vy,vz)에서 항성계 중심(0,0,0)을 이었을때, 방향 벡터 반환
        //window 중심을 중심으로
        //var x1 = (-1)vx;
        //var y1 = (-1)*vy;
        //var z1 = (-1)*vz;
        //var x1 = canvas.width/2-vx;
        let x1 = sunx-vx;
        //var y1 = canvas.height/2-vy;
        let y1 = suny-vy;
        let z1 = -1*vz;
    
        let squrt = Math.sqrt(Math.pow(x1,2)+Math.pow(y1,2)+Math.pow(z1,2));
        
        let xp = x1/squrt*windowRadius;
        let yp = y1/squrt*windowRadius;
        let zp = z1/squrt*windowRadius;
        //console.log("xp:"+xp +"  yp:"+ yp + "  zp:" + zp + "   r:"+ windowRadius);

        return{
            x :xp,
            y :yp,
            z :zp
        };
    
    }

    static orthogonalVector(refx,refy,refz,tox,toy,toz){
        let sll = { x:0, y:0, z:0 };

        let vv = refx*refx + refy*refy + refz*refz;
        let sv = tox*refx + toy*refy + toz*refz;
        let k = sv/vv;

        sll.x = k*refx;
        sll.y = k*refy;
        sll.z = k*refz;  
        
        let xp = tox - sll.x;
        let yp = toy - sll.y;
        let zp = toz - sll.z;

        let length = Math.sqrt((xp*xp+yp*yp+zp*zp));
        let xp_normal = xp/length;
        let yp_normal = yp/length;
        let zp_normal = zp/length;

        return{
            x :xp_normal,
            y :yp_normal,
            z :zp_normal
        };
    }

    static axisRotation(axisX,axisY,axisZ,x1,y1,z1,angle){

        let arr1 = [[[],[],[]],[[],[],[]],[[],[],[]]];
        let arr2 = [[x1],[y1],[z1]];

        arr1[0][0] = Math.cos(angle)+(1-Math.cos(angle))*Math.pow(axisX,2);
        arr1[0][1] = (1-Math.cos(angle))*axisX*axisY - Math.sin(angle)*axisZ;
        arr1[0][2] = (1-Math.cos(angle))*axisX*axisZ + Math.sin(angle)*axisY;

        arr1[1][0] = (1-Math.cos(angle))*axisX*axisY + Math.sin(angle)*axisZ;
        arr1[1][1] = Math.cos(angle) + (1-Math.cos(angle))*Math.pow(axisY,2);
        arr1[1][2] = (1-Math.cos(angle))*axisY*axisZ - Math.sin(angle)*axisX;

        arr1[2][0] = (1-Math.cos(angle))*axisX*axisZ - Math.sin(angle)*axisY;
        arr1[2][1] = (1-Math.cos(angle))*axisY*axisZ + Math.sin(angle)*axisX;
        arr1[2][2] = Math.cos(angle) + (1-Math.cos(angle))*Math.pow(axisZ,2);

        let answer = this.matrixProduct(arr1,arr2);

        return {
            x : answer[0][0],
            y : answer[1][0],
            z : answer[2][0]
        };
    }

    static matrixProduct(arr1, arr2){
        let answer = [];
        let row1 = arr1.length;
        let col1 = arr1[0].length;
        let col2 = arr2[0].length;

        for(var s=0; s<row1; s++){
            answer.push([]);
            for(var n=0; n<col2; n++){
                answer[s].push(0);
            }
        }

        for(var i=0; i<row1; i++){
            for(var j=0; j<col2; j++){
                for(var k=0; k<col1; k++){
                    answer[i][j] = answer[i][j] + arr1[i][k]*arr2[k][j];
                }
            }
        }

        return answer;

    }

    static perspectiveLength(realLength,massX,massY,massZ,sightPositionX,sightPositionY,sightPositionZ){
        let windowLength = 0;
        let distance = this.distancePointToPoint(massX,massY,massZ,sightPositionX,sightPositionY,sightPositionZ);
        let sightdistance = this.distancePointToPoint(0,0,0,sightPositionX,sightPositionY,sightPositionZ);
        windowLength = (sightdistance/distance)*realLength;

        return windowLength;
    }

    static perspectiveConvert(x1,y1,z1,k1){
        
        let xp = (x1*k1)/z1;
        let yp= (y1*k1)/z1;
        
        return {
            x : xp,
            y : yp
        };
    }
}