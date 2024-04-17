
// ///////////////////////////
//  responsive-fader.js
//  (c) erla-r
//  v 1.0
// ///////////////////////////

function Fader(arg) {
    this.slider = $(arg);
    this.id = this.slider.attr('id');
    this.slides_wrapper = this.slider.find('.fader-slides-wrapper');
    this.slides = this.slider.find('.fader-slide');
    this.eventStop = 0
    this.bottomNav = ''
    this.buttons = ''
    this.slideToHide = 0;

    // /////////////////////////
    // clone first slide
    // /////////////////////////

    if (this.slides[0] && this.slides_wrapper) {
        firstSlide = this.slides[0].outerHTML;
        this.slides_wrapper.append(firstSlide);
    }
    
    this.slides = this.slider.find('.fader-slide');
    this.currentSlide = 1;

    // /////////////////////////
    // hide all slides except for first
    // /////////////////////////

    for (i=this.currentSlide; i<this.slides.length; i++) {
        $(this.slides[i]).css('opacity', '0');
    }
   
    this.initBottomNavigation = Fader_initBottomNavigation
    this.initBottomNavigation();

    this.updateButtons = Fader_updateButtons
    this.updateButtons();

    this.initSizer = Fader_initSizer
    this.initSizer()

    this.animForward = function(steps) {
            
        if (this.eventStop) {
            return
        }
        
        this.eventStop = 1;
        this.slideToHide = this.currentSlide-1;
        this.currentSlide += steps;
        
        $(this.slides[this.currentSlide-1]).css('top', '-5%');
        $(this.slides[this.currentSlide-1]).css('left', '-5%');
        $(this.slides[this.currentSlide-1]).css('width', '110%');
        $(this.slides[this.currentSlide-1]).css('height', '110%');
        

        $(this.slides[this.currentSlide-1]).animate({'opacity': '1', 'top': '0', 'height': '100%', 'left': '0', 'width': '100%'}, this.speed, $.proxy(function() {
            this.eventStop = 0;

            if (this.currentSlide == this.slides.length) {
                $(this.slides[0]).css('opacity', '1');
                for (i=1; i<this.slides.length; i++) {
                    $(this.slides[i]).css('opacity', '0');
                }
                this.currentSlide = 1;  
            } else {
                $(this.slides[this.slideToHide]).css('opacity', '0');
            }
            this.updateButtons()
        }, this));
    }

    this.animBackward = function(steps) {
        if (this.eventStop) {
            return
        }

        this.eventStop = 1;
        if (this.currentSlide === 1) {
            this.currentSlide = this.slides.length;

            for (i=0; i<this.slides.length; i++) {
                    $(this.slides[i]).css('opacity', '0');
                }
            $(this.slides[this.slides.length-1]).css('opacity', '1');
        }

        this.slideToHide = this.currentSlide-1;
        $(this.slides[this.currentSlide-steps-1]).css('opacity', '1');
        $(this.slides[this.currentSlide-1]).animate({'opacity': '0', 'top': '-5%', 'height': '110%', 'left': '-5%', 'width': '110%'},this.speed, $.proxy(function() {

            this.eventStop = 0;
            this.currentSlide -= steps;
            this.updateButtons()

            $(this.slides[this.slideToHide]).css('top', '0');
            $(this.slides[this.slideToHide]).css('left', '0');
            $(this.slides[this.slideToHide]).css('width', '100%');
            $(this.slides[this.slideToHide]).css('height', '100%');

        }, this));
    }
    this.moveTo = Fader_moveTo
}

function Fader_moveTo(destination) {
    if (this.eventStop) {
        return
    }

    if (this.currentSlide < destination) {
        this.animForward(destination-this.currentSlide)
    }

    if (this.currentSlide > destination) {
        this.animBackward(this.currentSlide-destination)
    }
}

function Fader_initBottomNavigation() {
    this.bottomNav = this.slider.find(".ef-navigation-bottom")
    if (this.bottomNav.length == 0) {
        return
    }
    // add buttons
    for (var i=0; i< this.slides.length-1; i++) {
        this.bottomNav.append("<div class='ef-button' onclick='jump(" + parseInt(i+1) + ", " + this.id + ");'></div>")
    }
    this.buttons = this.bottomNav.find(".ef-button")
}

function Fader_updateButtons() {
    if (this.bottomNav.length == 0) {
        return
    }

    for (var i=0; i<this.buttons.length; i++) {
        if (i == this.currentSlide-1) {
            $(this.buttons[i]).addClass('ef-button-active');
        } else {
            $(this.buttons[i]).removeClass('ef-button-active');;
        }
    }
}

function Fader_initSizer() {
    this.sliderWidth = this.slider.css("width");
    this.sliderHeight = this.slider.css("height");

    for (i=0; i < this.slides.length; i++) {
        $(this.slides[i]).css("width", this.sliderWidth);
        $(this.slides[i]).css("height", this.sliderHeight);
    }
    this.slides_wrapper.css("margin-left", "0px");

    // adjust the slides_wrapper width
    var totalSlidesWidth = this.slides.length * parseInt(this.sliderWidth);
    this.slides_wrapper.css("width", totalSlidesWidth);

}

// ############################################################################

myFaders = [];

$(".ewa-fader").each(function(i) {
    var sliderInstance = $(".ewa-fader")[i]
    myFaders.push(new Fader(sliderInstance))

    // wait interval between the slides, set only if defined
    if ($(sliderInstance).attr('data-wait')) {
        setInterval(function() {
            myFaders[i].animForward(1)
            }, parseInt($(sliderInstance).attr('data-wait')));
    }

    // slide speed
    if ($(sliderInstance).attr('data-speed')) {
        myFaders[i].speed = parseInt($(sliderInstance).attr('data-speed'))
    }

    
})

$(window).on('resize', function() {
    for (var i=0; i < myFaders.length; i++) {        
        myFaders[i].initSizer();
    }
})

$(".ef-navigation-right").click(function() {
    var data_for = ($(this).attr('data-for'))
    for (var i=0; i < myFaders.length; i++) {
        if (myFaders[i].id == data_for) {
            myFaders[i].animForward(1);
        }
    }
})

$(".ef-navigation-left").click(function() {
    var data_for = ($(this).attr('data-for'))
    for (var i=0; i < myFaders.length; i++) {
        if (myFaders[i].id == data_for) {
            myFaders[i].animBackward(1);
        }
    }
})

function jump(steps, sliderID) {    
    var id = $(sliderID).attr('id');

    for (var i=0; i < myFaders.length; i++) {
        if (myFaders[i].id == id ) {
            myFaders[i].moveTo(steps)
        }
    }
}