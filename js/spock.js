/**
 * Enums
 */
var enum_key = {
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
 * Shared Elements
 */
var global = {
  body: document.querySelector( "body" ),
  section_elements: document.getElementsByTagName( "section" ),
  nav_links: document.getElementsByTagName( "a" ),
  main_element: document.getElementById( "main" ),
  mobile_results: document.getElementById( "mobile_results" ),
}
/**
 * Classes
 */
class Cursor {
  cursor;
  body;

  constructor() {
    this.cursor = document.querySelector( "#cursor" );
    this.body = global.body;
    this.init();
  }

  init() {
    document.addEventListener( "mousemove", ( event ) => {
      this.body.style.backgroundPositionX = event.pageX / -4 + "px";
      this.body.style.backgroundPositionY = event.pageY / -4 + "px";
      this.cursor.style.top = event.pageY + "px";
      this.cursor.style.left = event.pageX + "px";
    } );
  }
}
class Scroll { // Need to fix Scrolling and scroll keys 
  nav_links = null;
  current_section_key = 0;
  scroll_element = null
  section_elements = null;

  constructor() {
    this.section_elements = global.section_elements;
    this.nav_links = global.nav_links;
    this.scroll_element = global.main_element;
    this.initEvents();
  }

  initEvents() {
    // window.addEventListener( this.wheel_event, this.custom, this.wheel_option ); // modern desktop
    // window.addEventListener( "touchmove", this.custom, this.wheel_option ); // mobile
    global.main_element.onscroll = ( event ) => {
      // event_text = "onscroll";
      global.mobile_results.innerHTML = "onscroll";
      console.table( event );
    };
    
    // onwheel = ( event ) => { 
    //   global.mobile_results.innerHTML = "onwheel";
    //   console.log( event.deltaY ); };
    onkeydown = ( event ) => { 
      global.mobile_results.innerHTML = "onkeydown";
      this.overwriteKeys( event ); };
      // ontouchmove = ( event ) => { 
      //   global.mobile_results.innerHTML = "ontouchmove";
      // console.table( event ) }
    // window.addEventListener( "touchmove", this.yDirection, false );
  }

  scrollToSection( params = { direction: null, anchor_name: null } ) { // Works
    let new_key;
    new_key = this.current_section_key;
    if ( params.anchor_name != null ) {
      for ( let index = 0; index < this.section_elements.length; index++ ) {
        if ( this.section_elements[index].id == params.anchor_name ) {
          new_key = index; break;
        }
      }
    } else if ( params.direction != null ) {
      new_key = ( ( params.direction == 1 ) ? this.current_section_key + 1 : this.current_section_key - 1 );
    }
    if ( this.section_elements[new_key] === undefined ) { return; }
    this.current_section_key = new_key;
    this.section_elements[new_key].scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
    this.updateUrlAnchor({ anchor_name: params.anchor_name });
  }

  updateUrlAnchor( params = { anchor_name: null } ) {
    try {
      if ( ! params.anchor_name ) { return false; }
        history.replaceState(undefined, '', "#" + params.anchor_name);
      return true;
    } catch ( error ) {
      console.table( error );
    }
  }

  overwriteKeys( event ) {
    if ( ! [enum_key.arrow_up, enum_key.arrow_down].includes( event.keyCode ) ) { return; }
    event.preventDefault();
    let direction = 0;
    if ( enum_key.arrow_up == event.keyCode ) {
      direction = -1;
    } else if ( enum_key.arrow_down == event.keyCode ) {
      direction = 1;
    }
    this.scrollToSection({ direction: direction });
  }

}
class Navigation extends Scroll {
  constructor() {
    super();
    this.initClick();
  }

  initClick() {
    for ( let index = 0; index < this.nav_links.length; index++ ) {
      this.nav_links[index].addEventListener( "click", ( event ) => {
        this.scroll({ event: event, element: this.nav_links[index] });
      } );
    }
  }

  scroll( params = { event: null, element: null } ) {
    if ( ! params.element || ! params.event ) { return; }
    params.event.preventDefault();
    let anchor = this.tryGetAnchorName({ element: params.element });
    if ( ! anchor ) { return; };
    this.scrollToSection({ anchor_name: anchor })
  }

  tryGetAnchorName( params = { element: null } ) {
    try {
      let url_split = params.element.href.split( "#" );
      return url_split[1];
    } catch ( error ) {
      console.table( error );
    }
    return null;
  }
}
/**
 * Initiate
 */
let cursor_object = new Cursor();
let nav_object = new Navigation();