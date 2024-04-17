
function Slider(arg) {
    this.slider = $(arg);
    this.id = this.slider.attr('id');
    this.slides_wrapper = this.slider.find('.slides-wrapper');
    this.slides = this.slider.find('.slide');
    this.currentSlide = 1
    this.eventStop = 0
    this.bottomNav = ''
    this.buttons = ''
    this.speed = 300;

    // clone first slide
    if (this.slides[0] && this.slides_wrapper) {
        firstSlide = this.slides[0].outerHTML;
        this.slides_wrapper.append(firstSlide);
    }
   this.slides = this.slider.find('.slide');

   this.initBottomNavigation = Slider_initBottomNavigation
   this.initBottomNavigation();

   this.updateButtons = Slider_updateButtons
   this.updateButtons();

   this.initSizer = Slider_initSizer
   this.initSizer()

   this.animForward = function(steps) {
        if (this.eventStop) {
            return
        }
        this.currentSlide += steps;
        this.eventStop = 1;
        this.slides_wrapper.animate(
            {'margin-left': '-=' + parseInt(this.sliderWidth)*steps},
            this.speed, $.proxy(function() {
                this.eventStop = 0;
                if (this.currentSlide === this.slides.length) {
                    this.currentSlide = 1;
                    this.slides_wrapper.css('margin-left', 0);
                }
                this.updateButtons()   
            }, this)
        )     
   }

    this.animBackward = function(steps) {
        if (this.eventStop) {
            return
        }

        this.eventStop = 1;
        if (this.currentSlide === 1) {
            this.slides_wrapper.css("margin-left", (-1*parseInt(this.sliderWidth)*(this.slides.length-1))+"px")
            this.currentSlide = this.slides.length;
        }

        this.currentSlide -= steps;

        this.slides_wrapper.animate(
            {'margin-left': '+=' + parseInt(this.sliderWidth)*steps},
            this.speed, $.proxy(function() {
                this.eventStop = 0;
                this.updateButtons()
            }, this)
        )
    }
    this.moveTo = Slider_moveTo
}

function Slider_moveTo(destination) {
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

function Slider_initBottomNavigation() {
    this.bottomNav = this.slider.find(".es-navigation-bottom")
    if (this.bottomNav.length == 0) {
        return
    }
    // add buttons
    for (var i=0; i< this.slides.length-1; i++) {
        this.bottomNav.append("<div class='es-button' onclick='jump(" + parseInt(i+1) + ", " + this.id + ");'></div>")
    }
    this.buttons = this.bottomNav.find(".es-button")
}

function Slider_updateButtons() {
    if (this.bottomNav.length == 0) {
        return
    }

    for (var i=0; i<this.buttons.length; i++) {
        if (i+1 == this.currentSlide) {
            $(this.buttons[i]).addClass('es-button-active');
        } else {
            $(this.buttons[i]).removeClass('es-button-active');;
        }
    }
}

function Slider_initSizer() {
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
    this.currentSlide = 1;
}

// ############################################################################

const mySliders = [];

$(".ewa-slider").each(function(i) {
    var sliderInstance = $(".ewa-slider")[i]
    mySliders.push(new Slider(sliderInstance))

    // wait interval between the slides, set only if defined
    if ($(sliderInstance).attr('data-wait')) {
        setInterval(function() {
            mySliders[i].animForward(1)
            }, $(sliderInstance).attr('data-wait'));
    }

    // slide speed
    if ($(sliderInstance).attr('data-speed')) {
        mySliders[i].speed = parseInt($(sliderInstance).attr('data-speed'))
    }

    
})

$(window).on('resize', function() {
    for (var i=0; i < mySliders.length; i++) {        
        mySliders[i].initSizer();
    }
})

$(".es-navigation-right").click(function() {
    var data_for = ($(this).attr('data-for'))
    for (var i=0; i < mySliders.length; i++) {
        if (mySliders[i].id == data_for) {
            mySliders[i].animForward(1);
        }
    }
})

$(".es-navigation-left").click(function() {
    var data_for = ($(this).attr('data-for'))
    for (var i=0; i < mySliders.length; i++) {
        if (mySliders[i].id == data_for) {
            mySliders[i].animBackward(1);
        }
    }
})

function jump(steps, sliderID) {    
    var id = $(sliderID).attr('id');

    for (var i=0; i < mySliders.length; i++) {
        if (mySliders[i].id == id ) {
            mySliders[i].moveTo(steps)
        }
    }
}