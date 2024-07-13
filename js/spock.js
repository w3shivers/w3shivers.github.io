/**
 * Enums
 */
var keys = {
  a : 97,
  A : 65,
  b : 98,
  B : 66,
  c : 99,
  C : 67,
  d : 100,
  D : 68,
  e : 101,
  E : 69,
  f : 102,
  F : 70,
  g : 103,
  G : 71,
  h : 104,
  H : 72,
  i : 105,
  I : 73,
  j : 106,
  J : 74,
  k : 107,
  K : 75,
  l : 108,
  L : 76,
  m : 109,
  M : 77,
  n : 110,
  N : 78,
  o : 111,
  O : 79,
  p : 112,
  P : 80,
  q : 113,
  Q : 81,
  r : 114,
  R : 82,
  s : 115,
  S : 83,
  t : 116,
  T : 84,
  u : 117,
  U : 85,
  v : 118,
  V : 86,
  w : 119,
  W : 87,
  x : 120,
  X : 88,
  y : 121,
  Y : 89,
  z : 122,
  Z : 90,
  zero : 48,
  one : 49,
  two : 50,
  three : 51,
  four : 52,
  five : 53,
  six : 54,
  seven : 55,
  eight : 56,
  nine : 57,
  exclamation : 33,
  at : 64,
  hash : 35,
  dollar : 36,
  percent : 37,
  ampersant : 38,
  asterick : 42,
  left_bracket : 40,
  right_bracket : 41,
  underscore : 95,
  plus : 43,
  minus : 45,
  hyphen : 45,
  equal: 61,
  left_curly_bracket : 123,
  right_curly_bracket : 125,
  left_square_bracket : 91,
  right_square_bracket : 93,
  colon : 58,
  pipe : 124,
  semi_colon : 59,
  backslash : 92,
  less_than  : 60,
  greater_than : 62,
  question_mark : 63,
  comma : 44,
  fullstop : 46,
  slash : 47,
  tab : 9,
  enter : 13,
  forward_slash : 47,
  ctrl : 17,
  ctrl_s : 19,
  backspace : 8,
  _delete : 46,
  escape : 27,
  spacebar : 32,
  arrow_left : 37,
  arrow_up : 38,
  arrow_right : 39,
  arrow_down : 40
};
/**
 * Cursor
*/
let cursor = document.querySelector( "#cursor" );
let body = document.querySelector( "body" );
document.addEventListener( "mousemove", ( event ) => {
  body.style.backgroundPositionX = event.pageX / -4 + "px";
  body.style.backgroundPositionY = event.pageY / -4 + "px";
  cursor.style.top = event.pageY + "px";
  cursor.style.left = event.pageX + "px";
} );

let section_element = document.getElementsByTagName( "section" );
// console.log(section_element);
console.log(section_element[0].clientHeight);
document.addEventListener( "wheel", ( event ) => {
  // console.log( event.layerY );
} );
/**
 * Scrolling
*/
function customsScroll( event, is_keys = false, key_code = null ) {
  event.preventDefault();
  let direction = 0;
  if ( ( ! is_keys && event.deltaY < 0 ) 
  || ( is_keys && [keys.arrow_left, keys.arrow_up].includes( key_code ) ) )
    direction = -1;
  else if ( ( ! is_keys && event.deltaY > 0 ) 
  || ( is_keys && [keys.arrow_right, keys.arrow_down].includes( key_code ) ) ) {
    direction = 1;
  }
  // window.scrollTo();
  window.scrollBy({
    left: 0,
    top: ( section_element[0].clientHeight * direction ),
    behavior: "smooth"
  });
  // console.table( event.deltaY );
  // document.dispatchEvent( EVENT );
  // scrollBy( 0,  (  * direction ) );
  // document.dispatchEvent(   );
}
function preventDefaultForScrollKeys( event ) {
  if ( [keys.arrow_left, 
    keys.arrow_up, 
    keys.arrow_right, 
    keys.arrow_down].includes( event.keyCode ) 
  ) {
    customsScroll( event, true, event.keyCode );
    return false;
  }
} 
// modern Chrome requires { passive: false } when adding event
var supports_passive = false;
try {
  window.addEventListener( "test", null, Object.defineProperty( {}, "passive", {
    get: function () { supports_passive = true; } 
  } ) );
} catch ( error ) {}
var wheelOpt = ( supports_passive ? { passive: false } : false );
var wheelEvent = "onwheel" in document.createElement( "test" ) ? "wheel" : "mousewheel";
function disableScroll() {
  window.addEventListener( "DOMMouseScroll", customsScroll, false ); // older FF
  window.addEventListener( wheelEvent, customsScroll, wheelOpt ); // modern desktop
  window.addEventListener( "touchmove", customsScroll, wheelOpt ); // mobile
  window.addEventListener( "keydown", preventDefaultForScrollKeys, false );
}
function enableScroll() {
  window.removeEventListener( "DOMMouseScroll", customsScroll, false );
  window.removeEventListener( wheelEvent, customsScroll, wheelOpt ); 
  window.removeEventListener( "touchmove", customsScroll, wheelOpt );
  window.removeEventListener( "keydown", preventDefaultForScrollKeys, false );
}
disableScroll();