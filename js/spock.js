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
 * Classes
 */
class Cursor {
  cursor;
  body;

  constructor( params = { cursor: null, body: null } ) {
    this.cursor = params.cursor;
    this.body = params.body;
    document.addEventListener( "mousemove", ( event ) => {
      this.body.style.backgroundPositionX = event.pageX / -4 + "px";
      this.body.style.backgroundPositionY = event.pageY / -4 + "px";
      this.cursor.style.top = event.pageY + "px";
      this.cursor.style.left = event.pageX + "px";
    } );
  }
}
class Scroll { // Need to fix Scrolling and scroll keys 
  section_elements = null;
  nav_links = null;
  current_section_key = 0;
  allow_scroll = true;
  supports_passive = false; 
  wheel_option;
  wheel_event;

  constructor( params = { elements: null, links: null, enable: false, passive: false, wheel } ) {
    this.section_elements = params.elements;
    this.nav_links = params.links;
    this.wheel_option = ( ! params.passive ? { passive: false } : false );
    this.wheel_event = params.wheel;
    if ( params.enable ) {
      this.enable();
      return;
    }
    this.disable();
  }

  disable() {
    window.addEventListener( "DOMMouseScroll", this.custom, false ); // older FF
    window.addEventListener( this.wheel_event, this.custom, this.wheel_option ); // modern desktop
    window.addEventListener( "touchmove", this.custom, this.wheel_option ); // mobile
    window.addEventListener( "keydown", this.preventDefaultForScrollKeys, false );
  }

  enable() { // Just in case it is needed.
    window.removeEventListener( "DOMMouseScroll", this.custom, false );
    window.removeEventListener( this.wheel_event, this.custom, this.wheel_option ); 
    window.removeEventListener( "touchmove", this.custom, this.wheel_option );
    window.removeEventListener( "keydown", this.preventDefaultForScrollKeys, false );
  }

  custom( event, is_keys = false, key_code = null ) {
    event.preventDefault();
    if ( ! this.allow_scroll ) { return; }
    let direction = 0;
    if ( ( ! is_keys && event.deltaY < 0 ) 
      || ( is_keys && [keys.arrow_left, keys.arrow_up].includes( key_code ) ) )
      direction = -1;
    else if ( ( ! is_keys && event.deltaY > 0 ) 
        || ( is_keys && [keys.arrow_right, keys.arrow_down].includes( key_code ) ) ) {
      direction = 1;
    }
    this.scrollToSection( { direction: direction } );
    this.allow_scroll = false;
    setTimeout(() => { this.allow_scroll = true; }, 1500 );
  }

  scrollToSection( params = { direction: null, anchor: null } ) {
    let new_key;
    new_key = this.current_section_key;
    if ( params.anchor != null ) {
      for ( let index = 0; index < this.section_elements.length; index++ ) {
        if ( this.section_elements[index].id == params.anchor ) {
          new_key = index; break;
        }
      }
    } else if ( params.direction != null ) {
      new_key = ( ( params.direction == 1 ) ? this.current_section_key + 1 : this.current_section_key - 1 );
    }
    if ( this.section_elements[new_key] === undefined ) { return; }
    this.current_section_key = new_key;
    this.section_elements[new_key].scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
  }

  preventDefaultForScrollKeys( event ) {
    if ( [keys.arrow_left, 
      keys.arrow_up, 
      keys.arrow_right, 
      keys.arrow_down].includes( event.keyCode ) 
    ) {
      this.custom( event, true, event.keyCode );
      return false;
    }
  }

}
class Navigation {
  nav_links = null;
  ScrollClass = null;
  constructor( params = { scroll_class: null } ) {
    this.ScrollClass = params.scroll_class;
    this.nav_links = this.ScrollClass.nav_links;
    this.init();
  }

  init() {
    for ( let index = 0; index < this.nav_links.length; index++ ) {
      this.nav_links[index].addEventListener( "click", ( event ) => {
        this.scroll( { event: event, element: this.nav_links[index] } );
      } );
    }
  }

  scroll( params = { event: null, element: null } ) {
    if ( ! params.element || ! params.event ) { return; }
    params.event.preventDefault();
    let url_split = params.element.href.split( "#" );
    if ( url_split.length <= 1 ) { return; }
    this.ScrollClass.scrollToSection( { anchor: url_split[1] } )
  }
}
let supports_passive = false;
try {
  window.addEventListener( "test", null, Object.defineProperty( {}, "passive", {
    get: function () { supports_passive = true; } 
  } ) ); // modern Chrome requires { passive: false } when adding event
} catch ( error ) {}
/**
 * Elements
 */
let cursor = document.querySelector( "#cursor" );
let body = document.querySelector( "body" );
let section_elements = document.getElementsByTagName( "section" );
let nav_links = document.getElementsByTagName( "a" );
let wheel = "onwheel" in document.createElement( "test" ) ? "wheel" : "mousewheel";

/**
 * Initiate Objects
 */
let cursor_object = new Cursor( { cursor: cursor, body: body } );
let scroll_object = new Scroll( { elements: section_elements, links: nav_links, passive: supports_passive } );
let nav_object = new Navigation( { scroll_class: scroll_object } ) ;