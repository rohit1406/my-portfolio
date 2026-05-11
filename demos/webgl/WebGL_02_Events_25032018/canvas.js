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
	
	//center the text
	context.textAlign="center"; //center horizontally
	context.textBaseline="middle"; //center vertically
	
	//text
	var str="Hello WebGL !!!";
	
	//text font
	context.font="48px sans-serif";
	
	//text color
	context.fillStyle="white"; //#ffffff
	
	//display the text in center
	context.fillText(str, canvas.width/2,canvas.height/2);
	
	//register keyboards keydown event handler
	window.addEventListener("keydown", keyDown, false); //third param for capturing of events e.g. multiple windows and cursor
	window.addEventListener("click", mouseDown, false);
}

function keyDown(event)
{
	//code
	alert("A Key Is Pressed");
}

function mouseDown()
{
	//code
	alert("Mouse Is Clicked");
}