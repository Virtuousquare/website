var elements = document.querySelectorAll('.notalive'),
    // vimeoReady = false,
    // videoOnLoad = document.querySelectorAll('.load-on-scroll'),
    windowHeight = window.innerHeight,
    windowWidth = window.innerWidth,
    docViewTop = window.scrollY,
    docViewBottom = docViewTop + windowHeight;

window.onresize = reportWindowSize;

function reportWindowSize() {
    windowHeight = window.innerHeight,
    windowWidth = window.innerWidth,
    docViewBottom = docViewTop + windowHeight;
};

function isalive(el){
    var elemTop = el.getBoundingClientRect().top + docViewTop,
        elemTrigger = elemTop + (windowHeight/10);
        
    if (elemTrigger < docViewBottom) {
        if(!el.classList.contains('fire')){
            el.classList.add('fire');
        }
        
        // Lazy loading dans les sliders

        // if ((el.classList.contains('slider'))&&(!el.classList.contains('slider_ready'))) {
        //     el.classList.add('slider_ready');
        //     var imgs = el.querySelectorAll('img');
        //     for (var i=0;i<imgs.length;i++) {
        //         imgs[i].removeAttribute('loading');
        //     }
        // }

    } else if (elemTop >= docViewBottom) {
        if(el.classList.contains('fire')){
            el.classList.remove('fire');
        }
    }
}

function onScroll(){
    docViewTop = window.scrollY,
    docViewBottom = docViewTop + windowHeight;

    for (var i=0;i<elements.length;i++) {
        isalive(elements[i]);
    }

    // if (videoOnLoad.length > 0) {
    //     for (var i=0;i<videoOnLoad.length;i++) {
    //         var video = videoOnLoad[i];
    //         if (!video.classList.contains('loaded')) {
    //             videoLoad(video,i);
    //         }
    //     };
    // }
    
    setTimeout(function(){
        startScroll();
    },30);
}

// function videoLoad(videoWrapper,ind) {
//     if (videoWrapper.getBoundingClientRect().top < windowHeight + 100) {
//         var id = videoWrapper.getAttribute('id');
//         var vidObj = document.querySelectorAll('.load-on-scroll')[ind];
//         if (!id) {
//             id = 'vid-' + ind + '-' + videoWrapper.getAttribute('data-vimeo-id');
//             videoWrapper.setAttribute('id',id);
//         }
        
//         if (vimeoReady) {
//             var video = new Vimeo.Player(vidObj);
//             videoWrapper.classList.add('loaded');
//         }
//     }
// }

// EVENEMENT DE SCROLL
startScroll();
function startScroll() {
    window.addEventListener('scroll', function(e) {
        onScroll();
    },{once: true});
}

document.addEventListener("DOMContentLoaded", function(event) { 
    for (var i=0;i<elements.length;i++) {
        elements[i].classList.remove('notalive');
        elements[i].classList.add('alive');
    }
    onScroll();
});