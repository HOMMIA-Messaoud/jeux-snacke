/*cette fct sera excuté quand la fentre ouvre */
window.onload = function() {
	/*largeur canvas*/
    var canvasWidth=900;
	/*hauteur canvas*/
    var canvasHeight=600;
	/*divisier le canvas a des block*/
    var blokSise = 30;
	/*widthInBlocks=900/30=30*/
    var widthInBlocks = canvasWidth/blokSise;
	/*heightInBlocks=600/30=20*/
    var heightInBlocks = canvasHeight/blokSise;
    var ctx;
	/*la vitesse de déplacement en ms*/
    var delay = 100;
    var snakee;
    var applee;
	var score;
	var timeout;
	
	/*executer la fct init()*/
    init();
	
    function init(){
	/*creé le canvas*/
     var canvas = document.createElement('canvas');
	/*la largeur de convas en px*/
    canvas.width = canvasWidth;
	/*l'hauteur de convas en px*/
    canvas.height = canvasHeight;
	/*la bordure de convas 30px de couleur grey */
    canvas.style.border = "30px solid grey";
	/*margin-top: 50px mais gauche et droite centre*/
	canvas.style.margin = "50px auto";
	/*consider le canvas comme un block*/
	canvas.style.display = "block";
	/*le background de anvas*/	
	canvas.style.backgroundColor = "#ddd";
	/*linker le canvas avec le body de notre page html*/
    document.body.appendChild(canvas);
	/*on va  selectionner le type de ctx:dessiner un ctx 2d dans le convas*/
    ctx =canvas.getContext('2d');
	/*appel la fct Snake(body,direction)  pour donner la taille(tab de 6 case) ,la position et la direction(right) initial de snakee */	
	snakee = new Snake([[6,4],[5,4],[4,4],[3,4],[2,4]],"right");
	/*appel la fct Appele(position) la 1er position de Appel est [10,10]*/
   	applee = new Appele([10,10]);
	/*initialisation de score*/
	score = 0;
	/*appelle  la fct refreshCanvas()*/
    refreshCanvas(); 
    }
	
    
    function refreshCanvas(){
		/*fct pour diriger le snakee*/
    snakee.advence();
		/*test si le snakee fait  une collision appel la fct checkCollision() */
        if(snakee.checkCollision()){
			/*appel la fct gameOver() s'il y a une colliso*/
            gameOver();
        }else{
			/* s y a pas de collision appel la fct isEatingApple (AppeleToEat)*/
            if(snakee.isEatingApple(applee)){
				/*incrementation de score*/
				score++;
				if (score % 5 === 0) {
                    accelerate();
                }
				/*la pomme est mangé boolean ateApple */
                snakee.ateApple = true;
				timeout = setTimeout(refreshCanvas,delay/500000);
               do{
				   /*crée un aure pomme*/
                    applee.setNewposition();
               }while(applee.isOnSnake(snakee))
            }
	/*effacer le convas=supprimant tout contenu précédemment dessiné*/
     ctx.clearRect(0,0,canvasWidth,canvasHeight);
    drawScore();
	snakee.draw();
    applee.draw();
	/*appellez la fct refreshCanvas aprés un durée delay*/
    timeout = setTimeout(refreshCanvas,delay); 
	 
        }
    }
		
		
		function accelerate() {
        delay = delay / 2;
    }
	/*l'afichage en cas de collision*/
	function  gameOver(){
		ctx.save();
		ctx.font = "bold 70px sans-serif";
		ctx.fillStyle = "#000";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.strokeStyle = "white";
		ctx.lineWidth = 5;
		var centerX = canvasWidth/2;
		var centerY = canvasHeight/2;
		ctx.strokeText("Game Over ",centerX,centerY-180);
		ctx.fillText("Game Over ",centerX,centerY-180);	
		ctx.font = "bold 30px sans-serif";
		ctx.strokeText(" Appuyer sur la touche Espace pour rejouer",centerX,centerY-120);
		ctx.fillText(" Appuyer sur la touche Espace pour rejouer",centerX,centerY-120);
		ctx.restore();
	}
		
	/*fct our recommencer le jeux aprés clliquer sur le boutton éspace*/
	function restart(){
	    snakee = new Snake([[6,4],[5,4],[4,4],[3,4],[2,4]],"right");
		applee = new Appele([10,10]);
		score = 0;
		/*method stops the execution of the function specified in setTimeout()*/
		clearTimeout(timeout);
		refreshCanvas();
	}
	
		
	/*fct pour afficher le score*/
		function drawScore(){
		ctx.save();
		ctx.font = "bold 200px sans-serif";
		ctx.fillStyle = "gray";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		var centerX = canvasWidth/2;
		var centerY = canvasHeight/2;
		ctx.fillText(score.toString(),centerX,centerY);
		ctx.restore();
	}
		
		/*fct pour dessiner le block de snacke*/
    function drawBlock(ctx,position){
		/*blokSise = 30 */
        var x = position[0]*blokSise;
        var y = position[1]*blokSise;
		/*ctx.fillRect(x, y, largeur, hauteur);*/
        ctx.fillRect(x,y,blokSise,blokSise);
    }
		
		
    function Snake(body,direction){
        this.body = body;
        this.direction = direction;
        this.ateApple = false;
        this.draw = function(){
		/*On sauvegarde l'état par défaut*/
        ctx.save(); 
		/*le couleur rouje de snake*/
            ctx.fillStyle ="#ff0000";
			/*pour dessiner les differents composant de body*/
            for(var i=0;i<this.body.length;i++){
                drawBlock(ctx,this.body[i]);
            }
			/*On restaure l'état par défaut*/
            ctx.restore();
        };
        this.advence = function(){
            var nextPosition = this.body[0].slice();/*????*/
            switch(this.direction){
                case "left":
                    nextPosition[0] -= 1;                  /*up*/   
                    break;
                case "right":                  /*left             ---->  right*/
                    nextPosition[0] +=1;          /*              |          */
                    break;
                case "down":                             /*down*/
                    nextPosition[1] += 1;
                    break;
                case "up":
                    nextPosition[1] -= 1;
                    break;
                default:
                    throw("invalid direction");
            }
			/*ajouter le nextPosition au début du tab body*/
            this.body.unshift(nextPosition);
			/*test si la pomme n'est pas encore mangé*/
            if(!this.ateApple) 
				/*supperimer la dernier element de tab body*/
                this.body.pop();
            else
				/*sinon la pomme a été mangé et re-initialise ateApple pour la prochaine fois*/
                this.ateApple = false;
        };
        this.setDirection = function (newDirection){
            var allowedDirections;
             switch(this.direction){
                case "left":
                case "right":
                    allowedDirections=["up","down"];
                    break;
                case "down":
                case "up":
                    allowedDirections=["left","right"];
                    break;
                default:
                    throw("invalid direction");
            }
           /*tester si allowedDirections de newDirection est connu*/
			if(allowedDirections.indexOf(newDirection) > -1){
                this.direction = newDirection;/*donc affecter le newDirection */
            }
        };
        this.checkCollision = function(){
            var wallCollision = false;
            var snakeCollision = false;
			/*la téte de serpent*/
            var head = this.body[0]; 
			/*le rest de corps*/
            var rest = this.body.slice(1);
			/*le x de téte*/
            var snakeX = head[0];
			/*le y de téte*/
            var snakeY = head[1];
            var minX = 0;
            var minY = 0;
			/*psq elle commence par 0*/
            var maxX = widthInBlocks-1;
            var maxY = heightInBlocks-1;
			/*si le serpent est endhors en dehors du canvas horistentallement isNotBetweenHorizontalWalls=true */
            var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX ;
			/*si le serpent est endhors en dehors du canvas verticalement isNotBetweenVerticalWalls=true  */
            var isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY ;
			/*si isNotBetweenHorizontalWalls=true ou isNotBetweenVerticalWalls=true */
            if(isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls){
				/*on a une wallCollision*/
                wallCollision = true;
            }
            for(var i=0;i<rest.length;i++){
                if(snakeX === rest[i][0] && snakeY === rest[i][1]){
					 /*on a une snakeCollision*/
                 snakeCollision = true;  
                }
            }
			/*si snakeCollision=false ou wallCollision=false return false */
            return snakeCollision || wallCollision;
        };
		/*fonction boolean teste si la pomme a été mangé*/
        this.isEatingApple = function(AppeleToEat){
            var head = this.body[0];
            if(head[0] === AppeleToEat.position[0] && head[1] === AppeleToEat.position[1])
                return true;
            else
                return false;
        };
    }
		
		
		
    function Appele(position){
        this.position = position;
        this.draw = function(){
			/*On sauvegarde l'état par défaut*/
            ctx.save();
			/*couleur de pomme*/
            ctx.fillStyle = "#33cc33";
			/*début de dessin*/
            ctx.beginPath();
			/*le rayon*/
            var radius = blokSise/2;
            var x =this.position[0]*blokSise + radius;
            var y =this.position[1]*blokSise + radius;
			/*cercle de centre x y et rayon=newDirection sensAntiHoraire=true*/
            ctx.arc(x,y,radius,0,Math.PI*2,true);
			/*?????*/
            ctx.fill();
			/*fin sauvegarde l'état par défaut*/
            ctx.restore();
        };
		
		/*fonction pour créer x y de pomme alétoirement*/
        this.setNewposition = function(){
            var newX = Math.round(Math.random()*(widthInBlocks-1));
            var newY = Math.round(Math.random()*(heightInBlocks-1));
            this.position = [newX,newY];
        }
		
		/*fonction booleen pour verifier la pomme isOnSnake*/
        this.isOnSnake = function(snakeToCheck){
            var isOnSnake = false;
            for(var i=0;i< snakeToCheck.body.length;i++){
                if(this.position[0]=== snakeToCheck.body[i][0] && this.position[1]=== snakeToCheck.body[i][1]){
//                    snakeToCheck = true;
					isOnSnake = true;
                }
            }
            return isOnSnake;
        };
    }
		
		
		/*relier les bouttons par les directions:left,up,right,down et le restart */
    document.onkeydown = function hendlkeyDown(e){
    var key = e.keyCode
    var newDirection
    switch(key){
        case 37:
        newDirection = "left";
        break;
        case 38:
        newDirection = "up";
        break;
        case 39:
        newDirection = "right";
        break;
        case 40:
        newDirection = "down";
        break;
		case 32:
        restart();
		return;
        default:
        return;   
    }
    snakee.setDirection(newDirection);
       
}
	
	
	}