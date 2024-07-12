// YOUTUBE
// CODEPEN : https://codepen.io/toutenpixel/pen/PoOJEJg/0f87d3281caf4677e50c6687cf9496ab

var videosYt = document.querySelectorAll('.tpx_video'),
    videosYtBtn = document.querySelectorAll('.tpx_video-btn');

if ((videosYt.length > 0)||(videosYtBtn.length > 0)) {
    var scriptTag = document.createElement('script');
    scriptTag.src = "https://www.youtube.com/player_api";
    document.head.append(scriptTag);
}


var overlay = document.querySelector('.tpx_overlay'),
    videos = [],
    currentOverlayVideo,
    overlayBtn = document.querySelector('.tpx_overlay-close');

function onYouTubeIframeAPIReady() {

    if (videosYt) {
        for (var i=0;i<videosYt.length;i++) {
            newVideo(videosYt[i]);
        }
    }
    
    if (videosYtBtn) {
        for (var i=0;i<videosYtBtn.length;i++) {
            videosYtBtn[i].addEventListener('click',function(e){
                e.preventDefault();
                var targetId = this.getAttribute('data-target');
                    playerEl = document.getElementById(targetId);

                if (!playerEl.getAttribute('data-player')) {
                    playerEl.setAttribute('data-player',videos.length);
                    newVideo(playerEl);
                } else {
                    videos[playerEl.getAttribute('data-player')].seekTo(0);
                }
                
                currentOverlayVideo = document.getElementById(targetId);
                currentOverlayVideo.setAttribute('data-show','hop');
                overlay.setAttribute('class','tpx_overlay tpx_overlay-show');
            });
        }

        overlayBtn.addEventListener('click',function(e){
            stopVideo();
        });
    }
    
}

function newVideo(playerEl){

    var vidId = playerEl.getAttribute('data-ytId');
    var params = {'muted':0,'autoplay':1,'loop':0,'controls':0};
    if (playerEl.getAttribute('data-muted') == 1) {
        params.muted = 1;
    }
    if (playerEl.getAttribute('data-autoplay') == 0) {
        params.autoplay = 0;
    }
    if (playerEl.getAttribute('data-loop') == 1) {
        params.loop = 1;
    }
    if (playerEl.getAttribute('data-ytSize')) {
        var size = playerEl.getAttribute('data-ytSize').split('/');
    }
    if (!size) {
        size = [500,500];
    }

    videos[videos.length] = new YT.Player(playerEl, {
        width: size[0],
        height: size[1],
        videoId: vidId,
        playerVars: {
            'autoplay':params.autoplay,
            'controls':params.controls,
            'loop':params.loop,
            'muted':params.muted,
            'showinfo':0,
            'rel':0,
            'modestbranding':1,
            'autohide':1
        }
    });
}


function stopVideo() {
    if (currentOverlayVideo) {
        var playerNum = currentOverlayVideo.getAttribute('data-player');
        videos[playerNum].stopVideo();
        currentOverlayVideo.removeAttribute('data-show');
        overlay.setAttribute('class','tpx_overlay');
        currentOverlayVideo = undefined;
    }
}

// CREATION AUTOMATIQUE -> AJOUTER CLASS "yt_video"
// CREATION AU CLIC -> AJOUTER CLASS "tpx_video-btn" ET data-target AVEC ID DU BLOC VIDEO 

// PARAMETRES
// data-muted="0"
// data-autoplay="1"
// data-loop="0"
// data-controls="0"

// VIDEO ID OBLIGATOIRE
// data-ytId="..."

// DIMENSION width/height
// data-ytSize="460/320"



// ===========================================================================================


// VIMEO
// CODEPEN : https://codepen.io/toutenpixel/pen/rNYzQEM/adde62ca3f241d848a6a04486794547e
if (document.querySelectorAll('.tpx_vimeo').length > 0) {
    var vimeos = [];
    var script = document.createElement('script');
    script.src = 'https://player.vimeo.com/api/player.js';
    script.onload = onVimeoReadyCallback;
    document.head.append(script);
}

function onVimeoReadyCallback() {

    vimeoReady = true;
    onScroll();

}


// VIMEO USAGE

// ATTRIBUTS HTML =============================
// data-vimeo               Detect au chargement
// data-vimeo-id            Id de la vidéo à charger
// data-vimeo-background    Option pour mettre la vidéo en boucle, sans son ni contrôle
// data-vimeo-width         Option pour la largeur de la vidéo
// data-vimeo-defer         Ne pas charger la vidéo au chargement de la page
// data-vimeo-muted         Option pour couper le son
// data-vimeo-loop          Option pour jourer la vidéo en boucle
// data-vimeo-controls      Option pour enlever les contrôles de la vidéo
// Voir aussi https://developer.vimeo.com/player/sdk/embed

// SCRIPT =====================================
// var video = new Vimeo.Player('id');  Création d'une vidéo à partir d'un id ou d'un élément JS vanilla

// TPX ========================================
// .load-on-scroll          Charge la vidéo au scroll fonctionne avec data-vimeo-defer

//  SNIPPETS HTML =============================
//  <div class="tpx_vimeo" data-vimeo-id="512954734" data-vimeo-background="true" data-vimeo-width="500" id="test"></div>
// 	<div class="tpx_vimeo" data-vimeo-id="512954734" data-vimeo-defer data-vimeo-background="true" data-vimeo-width="500" id="test2"></div>
//  <div class="tpx_vimeo load-on-scroll" data-vimeo-id="512954734" data-vimeo-defer data-vimeo-loop="true" data-vimeo-muted="true" data-vimeo-width="500"></div>