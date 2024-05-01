var trans = new glitchTransition();
trans.activate('FjpGyFS.gif');
trans.img.src = 'FjpGyFS.gif';
animate();

function animate(){
 window.requestAnimationFrame(animate);
 if(trans.active)  trans.draw();
}


function glitchTransition(){
    this.canvas = document.getElementById("transition");
    this.c = this.canvas.getContext('2d');
    this.img = document.createElement('img');
    this.img.onerror = function(e){
        e.src = 'FjpGyFS.gif';
    }
    this.nextimg = "";
    this.tt = 0;
    this.active = true;
    this.loaded = false;
    this.time = 22; 
    this.shiftpix = function(ticks){
        var b = 0;
        var sx = Math.random()*2900;
        var sy = Math.random()*1860;
        var dx = Math.floor(Math.random()*5)-50;
        var dy = Math.floor(Math.random()*5)-50;
        var tx = Math.random()*4550;
        var ty = Math.random()*4500;
        for(b=0;b<ticks;b++){
            this.c.drawImage(this.canvas,sx+dx*b,sy+dy*b,ty,tx,sx,sy,tx,ty);
        }
    };
    
    this.basepix = function(ticks){
        var b = 0;
        var sx = Math.random()*2900;
        var sy = Math.random()*2860;
        var dx = Math.floor(Math.random()*200)-100;
        var dy = Math.floor(Math.random()*200)-100;
        var tx = Math.random()*200;
        var ty = Math.random()*100;
        this.c.drawImage(this.img,sx,sy,tx,ty,sx+dx,sy+dy,tx*2,ty*2);
    };

    this.activate = function(imgx){
        this.nextimg = imgx;
        this.active = true;
        this.tt = 0;
    }
 
    this.deactivate = function(){
        this.c.clearRect(0,0,900,860);
        this.active = 0;
        this.img.src = this.nextimg;
    }
    this.draw = function(){
        this.c.fillStyle = randomcolor();
        this.c.fillRect(Math.random()*900,Math.random()*860,Math.random()*200,Math.random()*200);
        this.basepix();
        this.shiftpix(4);
    //    this.c.clearRect(Math.random()*900,Math.random()*860,Math.random()*400,Math.random()*400);
    //    this.basepix();
    //    this.shiftpix(4);
    //    this.c.clearRect(Math.random()*900,Math.random()*860,Math.random()*200,Math.random()*800);
    //    this.basepix();
    //    this.shiftpix(4);
        this.tt++;
        if (this.active && this.tt>this.time && this.loaded) this.deactivate();
    }
}

function randomcolor(){
    return 'rgb('+
      Math.floor(Math.random()*256)+','+
      Math.floor(Math.random()*256)+','+
      Math.floor(Math.random()*256)+')';
}