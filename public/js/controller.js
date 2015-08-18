/*
  posX, posY
  Description:
   The global variables we need access to inorder to change the velocity of our character. 
  author: Alex Leonetti
*/

var posX = 0;
var posY = 0;

var android = !(/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream);


var controller = new Controller();
controller.connect();
controller.startCommunication();

/*
  interact joystick__button
  Description:
    Takes the joystick button div and allows it to be draggable within the restriction of its
    parent element container. The X and Y values are transferred over to our player.
  author: Alex Leonetti
*/

interact('#joystick__button')
  .draggable({
    restrict: {
      restriction: 'parent',
      // 0 means the left edge of the element and 1 means the right edge
      elementRect: {top: 0, left: 0, bottom: 1, right: 1}
    },

    onmove: dragMoveListener,
    onend: dragEndListener
  });

  /*
    dragEndListener
    Description:
      When this event is fired it grabs the current X and Y position and returns them to the 
      original starting point of the joystick. The player will also stop moving. 
    author: Alex Leonetti
  */

function dragEndListener (event) {
  var target = event.target;

  target.style.webkitTransform = 
  target.style.transform = 
    'translate(' + 0 + 'px, ' + 0 + 'px)';

  // update the posiion attributes
  target.setAttribute('data-x', 0);
  target.setAttribute('data-y', 0);

  posX = 0;
  posY = 0;

}

/*
  dragMoveListener
  Description:
    When the joystick button is being dragged, we grab the X and Y values and set them to 
    our characters. 
  author: Alex Leonetti
*/

function dragMoveListener (event) {
  var target = event.target;
  // keep the dragged position in the data-x/data-y attributes
  x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
  y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

  posX = x;
  posY = 0;

  // translate the element
  target.style.webkitTransform =
  target.style.transform =
    'translate(' + x + 'px, ' + y + 'px)';

  // update the posiion attributes
  target.setAttribute('data-x', x);
  target.setAttribute('data-y', y);
}

  // this is used later in the resizing demo
window.dragMoveListener = dragMoveListener;


/*
  setInterval updateVelocity
  inputs: posX, posY
  Description:
    Every 20 milliseconds, it will call updateVelocity in communication/client.js. 
  author: Alex Leonetti
*/
setInterval(function(){
  controller.updateVelocity(posX, posY);
}, 25);

/*
  button touchstart click
  Description:
   When the A button is clicked or touched it will change the Y position from 0 to -350 allowing
   the character to jump. 
  author: Alex Leonetti
*/
$('#button__a i').on('touchstart', function() {
  $(this).css('color', '#FAEB74');
  controller.pressA();
});


/*
  button touchend
  Description:
   When the A button is not being touched it changes the Y position back to 0. 
  author: Alex Leonetti
*/


$('#button__a i').on('touchend', function() {
  $(this).css('color', 'white');
  controller.releaseA();
});

$('#button__left i').on('touchstart', function() {
  $(this).css('color', '#FAEB74');
  posX = -100;
});

$('#button__left i').on('touchend', function() {
  $(this).css('color', 'white');
  posX = 0;
});

$('#button__right i').on('touchstart', function() {
  $(this).css('color', '#FAEB74');
  posX = 100;
});

$('#button__right i').on('touchend', function() {
  $(this).css('color', 'white');
  posX = 0;
});



/*
  button touchstart click
  Description:
   When the B button is clicked or touched it will change the Y position from 0 to -350 allowing
   the character to jump. 
  author: Alex Leonetti
*/
$('#button__b i').on('touchstart', function() {
  $(this).css('color', '#FAEB74');
});


/*
  button touchend
  Description:
   When the B button is not being touched it changes the Y position back to 0. 
  author: Alex Leonetti
*/
$('#button__b i').on('touchend', function() {
  $(this).css('color', 'white');
});


////////////////////////////////////
// Accelerometer logic... 
////////////////////////////////////


var x = 0, y = 0,
    vx = 0, vy = 0,
  ax = 0, ay = 0;
  
if (window.DeviceMotionEvent != undefined) {
  window.ondevicemotion = function(e) {
    $("#accelerationX").html(e.accelerationIncludingGravity.x);
    $("#accelerationY").html(e.accelerationIncludingGravity.y);
    $("#accelerationZ").html(e.accelerationIncludingGravity.z);

    if (android) {

      if (e.accelerationIncludingGravity.z < 0) {
        controller.pressA();
      }

      if (e.accelerationIncludingGravity.z > 0) {
        controller.releaseA();
      }


      if (e.accelerationIncludingGravity.y > 3) {
        $('#accelerationY').text('LOL')
        posX = 100;
      } else if (e.accelerationIncludingGravity.y < -3) {
        $('#accelerationY').text('w00t')
        posX = -100;
      } else {
        posX = 0;
      }

    } else if (!android) {

      if (e.accelerationIncludingGravity.z > 0) {
        controller.pressA();
      }

      if (e.accelerationIncludingGravity.z < 0) {
        controller.releaseA();
      }


      if (e.accelerationIncludingGravity.y < -3) {
        posX = 100; //right
      } else if (e.accelerationIncludingGravity.y > 3) {
        posX = -100;
      } else {
        posX = 0;
      }

    }

    if ( e.rotationRate ) {
      $("#rotationAlpha").innerHTML = e.rotationRate.alpha;
      $("#rotationBeta").innerHTML = e.rotationRate.beta;
      $("#rotationGamma").innerHTML = e.rotationRate.gamma;
    }   
  }
} 





