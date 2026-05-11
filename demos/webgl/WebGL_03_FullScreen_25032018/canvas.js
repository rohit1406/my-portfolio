//global variables
var canvas=null;
var context=null;

//onload function
function main()
{
	// get <canvas> element
	canvas = document.getElementById("AMC");
	if(!canvas)
	{
		console.log("Obtaining Canvas Failed\n");
	}else
	{
		console.log("Obtaining Canvas Succeeded\n");
	}
	
	//print canvas width and height on console
	console.log("Canvas Width: "+canvas.width+" And Canvas Height: "+canvas.height);
	
	//get 2D context
	context=canvas.getContext("2d");
	if(!context)
	{
		console.log("Obtaining 2D Context Failed\n");
	}else
	{
		console.log("Obtaining 2D Context Succeeded\n");
	}
	
	//fill canvas with black color
	context.fillStyle="black"; //#000000
	context.fillRect(0,0,canvas.width,canvas.height);
	
	//draw text
	drawText("Hello WebGL !!!");
	
	//register keyboards keydown event handler
	window.addEventListener("keydown", keyDown, false); //third param for capturing of events e.g. multiple windows and cursor
	window.addEventListener("click", mouseDown, false);
}

function drawText(str)
{
	//code
	//center the text
	context.textAlign="center"; //center horizontally
	context.textBaseline="middle"; //center vertically
	
	//text font
	context.font="48px sans-serif";
	
	//text color
	context.fillStyle="white"; //#ffffff
	
	//display the text in center
	context.fillText(str, canvas.width/2,canvas.height/2);
}

function keyDown(event)
{
	//code
	switch(event.keyCode)
	{
		case 70: //'F' or 'f'
			toggleFullScreen();
			
			//repait
			drawText("Hello WebGL !!!");
			break;
	}
}

function mouseDown()
{
	//code
	alert("Mouse Is Clicked");
}

function toggleFullScreen()
{
	//code
	var fullscreen_element =
	document.fullscreenElement ||
	document.webkitFullscreenElement ||
	document.mozFullScreenElement ||
	document.msFullscreenElement ||
	null;
	
	//if not fullscreen
	if(fullscreen_element==null)
	{
		if(canvas.requestFullscreen)
		{
			canvas.requestFullscreen();
		}else if(canvas.mozRequestFullScreen)
		{
			canvas.mozRequestFullScreen();
		}else if(canvas.webkitRequestFullscreen)
		{
			canvas.webkitRequestFullscreen();
		}else if(canvas.msRequestFullscreen)
		{
			canvas.msRequestFullscreen();
		}
	}else //if already fullscreen
	{
		if(document.exitFullscreen)
		{
			document.exitFullscreen();
		}else if(document.mozCancelFullScreen)
		{
			document.mozCancelFullScreen();
		}else if(document.webkitExitFullscreen)
		{
			document.webkitExitFullscreen();
		}else if(document.msExitFullscreen)
		{
			document.msExitFullscreen();
		}
	}
}