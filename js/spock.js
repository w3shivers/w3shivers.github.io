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

var enum_scroll_direction = {
  down: 1,
  up: -1,
}
/**
 * Shared Elements
 */
var global = {
  body: document.body || document.documentElement,
  section_elements: document.getElementsByTagName( "section" ),
  nav_links: document.getElementsByTagName( "a" ),
  main_element: document.getElementById( "window" ),
  nav_menu: document.getElementsByClassName( "menu" ),
  nav_aside: document.getElementById( "main-nav" ),
  modal_background: document.getElementById( "modal_background" ),

  // for testing purposes only.
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
      if ( this.cursor ) {
        this.cursor.style.top = event.pageY + "px";
        this.cursor.style.left = event.pageX + "px";
      }
    } );
  }
}

class Scroll { // Need to fix Scrolling and scroll keys 
  nav_links = null;
  current_section_key = 0;
  current_element = null;
  last_scroll_position = 0;
  current_section = {
    id: null,
    key: 0,
    element: null
  };
  next_section = {
    id: null,
    key: 0,
    element: null
  };
  previous_section = {
    id: null,
    key: 0,
    element: null
  };
  main_element = null;
  current_direction = 0;
  section_elements = null;
  navigation_class = null;

  constructor() {
    this.section_elements = global.section_elements;
    this.nav_links = global.nav_links;
    this.main_element = global.main_element;
    this.scroll_element = global.main_element;
    this.current_section = {
      id: this.section_elements[0].id,
      key: 0,
      element: this.section_elements[0]
    }
    this.initEvents();
  }

  initEvents() {
    this.main_element.onscroll = ( event ) => { this.manageSection() };
    onkeydown = ( event ) => { this.overwriteKeys({ event: event }); };
  }

  manageSection() {
    try {
      this.determineHasDirectionChanged();
      if ( this.next_section.id == null || this.next_section.id === undefined ) { this.updateNextElement(); return; }
      // let element = // Rudi - need to get up scroll flip  working. 
      let element_offset = this.next_section.element.getBoundingClientRect().y * this.current_direction;
      if ( element_offset < ( this.next_section.element.clientHeight / 2 ) ) {
        // console.table(this.next_section.element);
        console.log(this.current_direction)
        let previous_id = this.current_section.id;
        this.current_section = this.next_section;
        this.navigation_class.updateLinks({ previous: previous_id, current: this.current_section.id });
        this.updateNextElement();
        this.updateUrlAnchor({ anchor_name: this.current_section.id });
      }
    } catch( error ) {
      console.table( error );
    }
  }

  updateNextElement() {
    let next_key = this.current_section.key + this.current_direction;
    if ( this.section_elements[next_key] !== undefined ) { 
      this.next_section = {
        id: this.section_elements[next_key].id,
        key: next_key,
        element: this.section_elements[next_key]
      }
      return;
    }
  }

  determineHasDirectionChanged() {
    let element_offset = this.section_elements[0].getBoundingClientRect().y;
    let scroll_direction = 0;
    if ( element_offset > this.last_scroll_position ) {
        scroll_direction = -1;
    } else if ( element_offset < this.last_scroll_position ) {
        scroll_direction = 1;
    }
    let has_changed = (( scroll_direction != this.current_direction ) ? true : false );
    this.current_direction = scroll_direction;
    this.last_scroll_position = element_offset;
    return has_changed;
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
        history.replaceState( undefined, '', "#" + params.anchor_name );
      return true;
    } catch ( error ) {
      console.table( error );
    }
  }

  overwriteKeys( params = { event: null } ) {
    params.event.preventDefault();
    if ( ! [enum_key.arrow_up, enum_key.arrow_down].includes( params.event.keyCode ) ) { return; }
    let direction = 0;
    if ( enum_key.arrow_up == params.event.keyCode ) {
      direction = -1;
    } else if ( enum_key.arrow_down == params.event.keyCode ) {
      direction = 1;
    }
    this.scrollToSection({ direction: direction });
  }

}
class Navigation extends Scroll {
  selected_class_name = "selected";
  menu = null;
  background = null;
  holder = null;
  aside_margin = 0;
  animations = {
    menu: null,
    background: null,
    blur: null
  }

  constructor() {
    super();
    this.menu = global.nav_menu[0];
    this.navigation_class = this;
    this.holder = global.nav_aside;
    this.background = global.modal_background;
    this.load();
    this.initClick();
    this.pageLoad();
  }

  pageLoad() {
    let anchor = this.tryGetAnchorName({ from_url: true });
    anchor = ( anchor ) ? anchor : this.section_elements[0].id;
    this.scrollToSection({ anchor_name: anchor })
  }

  load() {
    this.background.style.opacity = "0px";
    this.holder.style.display = "flex";
    this.holder.style.marginRight = ( ( ( this.holder.clientWidth ) * -1 ) - 50 ) + "px";
  }

  open() {
    clearInterval( this.animations.menu );
    clearInterval( this.animations.background );
    clearInterval( this.animations.blur );
    let menu_position = parseInt( this.holder.style.marginRight.replace( "px", "" ) );
    let menu_speed = ( 1000 / ( menu_position * -1 ) );
    this.animations.menu = setInterval( () => {
      if ( menu_position >= 0 ) {
        clearInterval( this.animations.menu );
        return;
      }
      menu_position = menu_position + menu_speed; 
      this.holder.style.marginRight = menu_position + 'px'; 
    }, 0.0001 );

    this.main_element.classList.add( "modal_open" );
    let blur_percentage = 0;
    this.animations.blur = setInterval( () => {
      if ( blur_percentage >= 2 ) {
        clearInterval( this.animations.blur );
        return;
      }
      blur_percentage = blur_percentage + 0.01;
      this.main_element.style.filter = "blur( " + blur_percentage + "px )";
    }, 0.0001 );

    this.background.style.display = "block";
    let background_opacity = 0;
    this.animations.background = setInterval(() => {
      if ( background_opacity >= 0.3 ) {
        clearInterval( this.animations.background );
        return;
      }
      background_opacity = background_opacity + 0.001;
      this.background.style.opacity = background_opacity;
    }, 0.001 );
  }

  close() {
    clearInterval( this.animations.menu );
    clearInterval( this.animations.background );
    clearInterval( this.animations.blur );
    let menu_position = parseInt( this.holder.style.marginRight.replace( "px", "" ) );
    let menu_speed = ( 1500 / ( ( ( this.holder.clientWidth * -1 ) - 50 ) ) );
    this.animations.menu = setInterval( () => {
      if ( menu_position <= ( ( ( this.holder.clientWidth ) * -1 ) - 50 ) ) {
        clearInterval( this.animations.menu );
        return;
      }
      menu_position = menu_position + menu_speed; 
      this.holder.style.marginRight = menu_position + 'px'; 
    }, 0.0001 );

    this.main_element.classList.add( "modal_open" );
    let blur_percentage = 2;
    this.animations.blur = setInterval( () => {
      if ( blur_percentage <= 0 ) {
        clearInterval( this.animations.blur );
        return;
      }
      blur_percentage = blur_percentage - 0.05;
      this.main_element.style.filter = "blur( " + blur_percentage + "px )";
    }, 0.0001 );

    let background_opacity = 0.3;
    this.animations.background = setInterval(() => {
      if ( background_opacity <= 0 ) {
        clearInterval( this.animations.background );
        this.background.style.display = "none";
        return;
      }
      background_opacity = background_opacity - 0.005;
      this.background.style.opacity = background_opacity;
    }, 0.001 );
  }

  initClick() {
    this.menu.addEventListener( "click", () => { 
      this.menu.classList.toggle( "opened" );
      this.menu.setAttribute( "aria-expanded", this.menu.classList.contains( "opened" ) );
      if ( this.menu.classList.contains( 'opened' ) ) {
        this.open();
      } else {
        this.close();
      }
    });

    /* Navigation items */
    for ( let index = 0; index < this.nav_links.length; index++ ) {
      this.nav_links[index].addEventListener( "click", ( event ) => {
        this.scroll({ event: event, element: this.nav_links[index] });
      });
    }
  }

  updateLinks( params = { previous: null, current: null } ) {
    let link_hash = null;
    for ( let index = 0; index < this.nav_links.length; index++ ) {
      link_hash = this.nav_links[index].href.split( "#" )[1];
      if ( params.previous != null && params.previous == link_hash ) {
        this.nav_links[index].classList.remove( this.selected_class_name );
      }
      if ( params.current == link_hash ) {
        this.nav_links[index].classList.add( this.selected_class_name );
      }
    }
  }

  scroll( params = { event: null, element: null } ) {
    if ( ! params.element || ! params.event ) { return; }
    params.event.preventDefault();
    let anchor = this.tryGetAnchorName({ element: params.element });
    if ( ! anchor ) { return; };
    this.scrollToSection({ anchor_name: anchor })
  }

  tryGetAnchorName( params = { element: null, from_url: false } ) {
    try {
      let url_split = null;
      if ( ! params.from_url ) {
        url_split = params.element.href.split( "#" );
      } else {
        url_split = document.URL.split("#");
      }
      return ( url_split.length ) ? url_split[1] : null;
    } catch ( error ) {
      console.table( error );
    }
    return null;
  }
}

class Screen {
  sections = null;
  body = null;

  constructor() {
    this.sections = global.section_elements;
    this.body = global.body;
    window.onresize = () => {
      this.adjustSize();
     };
  }

  adjustSize() {
    let height = Math.max( this.body.scrollHeight, this.body.offsetHeight, this.body.clientHeight, this.body.scrollHeight, this.body.offsetHeight );
    for ( let index = 0; index < this.sections.length; index++ ) {
      this.sections.height = height;
    };
  }
}
/**
 * Initiate
 */
window.onload = () => {
  new Cursor();
  new Navigation();
  new Screen();
}