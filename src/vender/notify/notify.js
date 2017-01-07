"use strict";

/*
* Value:
* - title   ( string, optional, if value is "" not show.)
* - content ( string, required)
* - closed  ( boolean, optional, if value is "" not show.)
*           ( when value is true, notify box show always, when value is false notify hidden after 1 minute. )
* - type    ( int, MESSAGE/WARING/ERROR)
*           ( optional, default is MESSAGE )
*
* Param:
* - string：
*   - 1：content
*   - 2：type content
*   - 3：type title content
*   - 4：type title content closed
* - object
*   - { type: xxx, title: xxx, content: xxx, close: true/false   }
*
* Example:
* new Notify().Render( "Test" );
* new Notify().Render( 0, "Test 2" );
* new Notify().Render( 0, "Test title", "Test 3" );
* new Notify().Render( 0, "SimpTab has update.", "New version changlog here.", true );
* new Notify().Render( { title: "SimpTab has update.", content: "New version changlog here.", type: 0, closed: true } );
*
*/
var Notify = ( function () {
    var VERSION = "1.2",
        name    = "notify",
        root    = "ks-notify-gp",
        rootcls = "." + root,
        roottmpl= '<notify-div class="' + root + '">',
        num     = 0,
        MESSAGE = 0,
        WARNING = 1,
        ERROR   = 2,
        options = {
            title   : "",
            content : "",
            closed  : false,
            type    : MESSAGE,
            version : VERSION
        },
        timer      = {},
        $container,
        TMPL       = '\
        <notify-div class="notify">\
            <notify-a href="#"><notify-span></notify-span></notify-a>\
            <notify-title>SimpTab has update.</notify-title>\
            <notify-content>New version changlog here.</notify-content>\
        </notify-div>',
        prefix      = function( value ) {
            return name + "-" + value;
        },
        registyElement = function( name, elements ) {
            elements.forEach( function( item ) {
                document.createElement( prefix( item ));
            });
        },
        closeHandle = function( event ) {
            $container.undelegate( "." + event.data + " notify-a", "click", closeHandle );
            hidden( $(this).parent() );
        },
        delay = function( item ) {
            clearTimeout( timer[item] );
            delete timer[item];
            hidden( this );
        },
        hidden = function( target ) {
            target.hide( 500, function() {
                target.remove();
                if ($container.children().length === 0 ) $container.css( "z-index", 0 );
            });
        },
        render = function() {
            var $tmpl    = $( TMPL ),
                $title   = $tmpl.find(prefix( "title"   )),
                $content = $tmpl.find(prefix( "content" )),
                $close   = $tmpl.find(prefix( "a"       )),
                item     = "notify-item-" + num++;

            this.title   ? $title.text( this.title )     : $title.hide();
            this.content ? $content.html( this.content ) : $content.hide();
            if ( this.closed ) {
                $container.delegate( "." + item + " notify-a", "click", item, closeHandle );
            }
            else {
                $close.hide();
                timer[item] = setTimeout( delay.bind( $tmpl, item ), 1000 * 5 );
            }

            $tmpl.addClass( item );
            $container.append( $tmpl ).css( "z-index", 2147483647 );
        };

    function Notify() {
        registyElement( name, [ "div", "a", "span", "title", "content" ] ); 
        if ( $( "body" ).find ( rootcls ).length == 0 ) {
            $( "body" ).append( roottmpl );
            $container = $( rootcls );
        }
    }

    Notify.prototype.title   = options.title;
    Notify.prototype.content = options.content;
    Notify.prototype.closed  = options.closed;
    Notify.prototype.type    = options.type;

    Notify.prototype.Render  = function () {

        var self = this;

        if ( arguments.length === 1 && typeof arguments[0] === "object" ) {
            options = arguments[0];

            Object.keys( options ).forEach( function( item ) {
                self[item] = options[item];
            });

            render.bind( self )();
        }
        else if ( typeof arguments[0] !== "object" && arguments.length > 0 && arguments.length < 5 ) {
            switch ( arguments.length ) {
                case 1:
                    this.content = arguments[0];
                    break;
                case 2:
                    this.type    = arguments[0];
                    this.content = arguments[1];
                    break;
                case 3:
                    this.type    = arguments[0];
                    this.title   = arguments[1];
                    this.content = arguments[2];
                    break;
                case 4:
                    this.type    = arguments[0];
                    this.title   = arguments[1];
                    this.content = arguments[2];
                    this.closed  = arguments[3];
                    break;
            }
            render.bind( self )();
        }
        else {
            console.error( "Arguments error", arguments );
        }
    };

    return Notify;

})();

module.exports = Notify;