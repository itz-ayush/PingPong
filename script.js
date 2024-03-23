const canvas=document.getElementById('mygame');
const context=canvas.getContext('2d');
function drawRect(x,y,w,h,color)
{
  context.fillStyle=color
  context.fillRect(x,y,w,h);
}

//computer ka paddle
const comp=
{
  x:canvas.width/2-100/2,
  y:10,
  width:100,
  height:10,
  color:"white",
  score:0
}

//user ka paddle
const user=
{
  x:canvas.width/2-100/2,
  y:canvas.height-20,
  width:100,
  height:10,
  color:"white",
  score:0
}

//middle line ke liye
function centerLine()
{
  context.beginPath()
  context.moveTo(0,canvas.height/2)
  context.setLineDash([10])
  context.lineTo(canvas.width,canvas.height/2)
  context.strokeStyle="white"
  context.stroke()
}

//ball ka function
function drawCircle(x,y,r,color)
{
  context.fillStyle=color
  context.beginPath()
  context.arc(x,y,r,0,Math.PI*2,false)
  context.closePath()
  context.fill()
}
//create ball
const ball=
{
  x:canvas.width/2,
  y:canvas.height/2,
  radius:10,
  speed:1,
  velocityX:15,
  velocityY:5,
  color:"white"
}
//scores
function drawText(text,x,y,color)
{
  context.fillStyle=color
  context.font="32px josefin sans"
  context.fillText(text,x,y)
}
//render the game
function render()
{
  //make canvas
  drawRect(0,0,1000,600,"black");

  //computer ka paddle
  drawRect(comp.x,comp.y,comp.width,comp.height,comp.color)

  //user paddle
  drawRect(user.x,user.y,user.width,user.height,user.color)

  //centerline
  centerLine();

  //create the ball
  drawCircle(ball.x,ball.y,ball.radius,ball.color)

  //scores of comp and user
  drawText(comp.score,20,canvas.height/2-40)
  drawText(user.score,20,canvas.height/2+60)
}
render();
// control the user paddle

document.addEventListener("mousemove",mousepaddle);
function mousepaddle(e)
{
  let rect=canvas.getBoundingClientRect();
  user.x=e.clientX-rect.left-user.width/2;
}
//collision detection
function collision(b,p)
{
  b.top=b.y-b.radius;
  b.bottom=b.y+b.radius;
  b.left=b.x-b.radius;
  b.right=b.x+b.radius;
  //p
  p.top=p.y;
  p.bottom=p.y+p.height;
  p.left=p.x;
  p.right=p.x+p.width;
  return p.right>b.left && p.left<b.right && b.bottom>p.top && b.top<p.bottom;
}
//reset ball
function resetBall()
{
  ball.x=canvas.width/2;
  ball.y=canvas.height/2;
  ball.speed=1;
  ball.velocityY=-ball.velocityY;
}
//gameover function
function ShowGameOver()
{
    canvas.style.display="none";
    const can=document.getElementById("can");
    can.style.display="none";
    //container
    const result=document.getElementById("result");
    result.style.display="block";
}

//update
function update()
{
ball.x=ball.x+ball.velocityX*ball.speed;
ball.y=ball.y+ball.velocityY*ball.speed;

//control for the computer paddle
let computerLevel=0.1;
comp.x=comp.x+(ball.x-(comp.x+comp.width/2))+computerLevel;
if(ball.speed>1.5)
{
  comp.x+=ball.x+100;
}
//reflect from wall
if(ball.x+ball.radius>canvas.width || ball.x-ball.radius<0 )
{
  ball.velocityX=-ball.velocityX;
}

// if collision happens
let player=(ball.y<canvas.height/2)?comp:user;
if(collision(ball,player))
{
  ball.velocityY=-ball.velocityY;
  ball.speed+=0.1;
}
//points update
  if(ball.y-ball.radius<0)
  {
    user.score++;
    resetBall();
  }
  else if(ball.y+ball.radius>canvas.height)
  {
    comp.score++;
    resetBall();
  }
  //gameover
  if(user.score>2 || comp.score>2)
  {
    clearInterval(loop);
    ShowGameOver();
  }

}

//start the game
function start()
{
  update();
  render();
}

//loop
const loop=setInterval(start,1000/50)
