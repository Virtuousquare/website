// const isTouchDevice = 'ontouchstart' in document.documentElement;
const dom = 'http://localhost:3000/'
// const dom = 'https://virtuousquare.com/dev/'
const assets = dom + 'assets/'
const partials = dom + 'partials/'



// BUILD PAGE ON FIRST LOAD
getElements(partials+'header.html');

async function getElements(page) {
    const response = await fetch(page);
    const text = await response.text();
    const html = stringToHTML(text);

    buildPage(html);
}

function stringToHTML (text) {
	let parser = new DOMParser();
	let doc = parser.parseFromString(text, 'text/html');
	return doc.body;
}

function buildPage(html) {
    let header = html.querySelector('#header');
    let footer = html.querySelector('#footer');
    const general = document.getElementById('container_general');
    general.prepend(header);
    general.append(footer);

    // MENU
    const menuBtn = document.querySelector('.header_menu-btn');
    menuBtn.addEventListener('click',function(e) {
        e.preventDefault();
        this.classList.toggle('header_menu-btn-open')
    });

    // INIT TOOLT
    initToolt();
    parseLinks('a[href]');
    pageReady();
}


const pageReady = () => {
    document.body.classList.add('pageReady');
}




// TOOLT
function initToolt() {

    const toolt = document.querySelector('.toolt');
    let cursor = null;
    
    function moving() {
        cursor = {'x':event.pageX,'y':event.pageY - docViewTop}
        toolt.setAttribute('style',`transform:translate(${cursor.x}px,${cursor.y}px)`)
    
        setTimeout(() => {
            onMove()
        }, 30)
    }
    
    function onMove(event) {
        if (cursor) {
            toolt.classList.add('toolt_visible')
        }
        document.addEventListener("mousemove", (event) => {
            moving(event)
        },{once: true})
    }
    onMove()
    
    const tooltItems = document.querySelectorAll('[data-toolt]');
    tooltItems.forEach(tooltItem => {
        let [type, val] = tooltItem.getAttribute('data-toolt').split('/');
        let element;

        if (type === 'image') {
            element = document.createElement('img');
            element.setAttribute('src', `${assets}img/${val}`);
            element.setAttribute('class', 'toolt_item toolt_img');
        } else {
            element = document.createElement('div');
            element.innerHTML = val;
            element.setAttribute('class', 'toolt_item toolt_text');
        }

        element.setAttribute('data-toolt-id', val);
        toolt.appendChild(element);

        tooltItem.addEventListener('mouseenter', () => changeToolt(val));
        tooltItem.addEventListener('mouseleave', () => emptyToolt(val));
    });
}
    
function changeToolt(val) {
    document.querySelector(`[data-toolt-id="${val}"]`).classList.add('toolt_item-show')
}

function emptyToolt() {
    let tooltItemShowed = document.querySelector('.toolt_item-show');
    if (tooltItemShowed) {
        document.querySelector('.toolt_item-show').classList.remove('toolt_item-show')
    }
}


// INIT LINKS TO NAVIGATE IN SITE
function parseLinks(a) {

    let links = document.querySelectorAll(a);
    initLinks(links)

}

function initLinks(links) {

    links.forEach(link => {

        let href = link.getAttribute('href');
        // SI NON LIEN EXTERNE
        if ((!href.includes('http'))&&(!link.getAttribute('target'))) {
            // PAGE COURANTE
            let currentUrl = window.location.href;
            // URL PAR DEFAUT
            let buildUrl = currentUrl+href;
            // LIENS DE HEADER PARTICULIERS
            if ((link.classList.contains('header_logo')) || (link.classList.contains('header_menu-link'))) {
                buildUrl = dom + href;
                if (href === '/') {
                    buildUrl = dom;
                }
            } else if (href.includes('../')) {
                // SI LES LIENS REMONTENT DANS L'ARBO
                let splitedHref = href.split('../');
                href = splitedHref[splitedHref.length];
                let splitedUrl = currentUrl.replace(dom,'').split('/');
                buildUrl = dom;
                for (var i=0;i<splitedHref.length - 1;i++) {
                    startUrl += '/' + splitedUrl[i];
                }
            }
            link.setAttribute('href',buildUrl);
            link.addEventListener('click',function(e){
                e.preventDefault();
                completeHistory();
                getPage(buildUrl);
            });
        }
    })
}

let pathHistory = [];
completeHistory();
function completeHistory() {
    let currentUrl = window.location.href;
    pathHistory = [currentUrl.replace(dom,'')];
}

async function getPage(href) {

    // POUR LES LIENS EXTERNES
    if (!href.includes(dom)) {
        return false;
    }

    // RECUPERE LA PAGE
    const response = await fetch(href);
    
    if (response.ok) { // TROUVE LA PAGE
        const text = await response.text();
        const html = stringToHTML(text);
    
        // if (href == dom+'/') {
        //     href = '/';
        // }
    
        // CHANGE L'URL
        window.history.pushState({"html":'',"pageTitle":'Sébastien Plaignaud - ' + href},"", href);
        // CHANGE LE CONTENU DU BLOC PRINCIPAL
        changeContent(html);
    
        // INIT TOOLT
        emptyToolt();
        initToolt();
    } else { // NE TROUVE PAS LA PAGE
        console.log('Pas de page');
    }
}


function changeContent(html) {
    let newContent = html.querySelector('#content');
    const currentContent = document.getElementById('content');
    empty(currentContent);

    // SCROLL TOP
    window.scrollTo(0, 0);

    // LOAD CONTENT
    currentContent.append(newContent);

    // REINIT LINKS DU CONTENU
    parseLinks('#content a[href]');
}

function empty(element) {
    while(element.firstElementChild) {
        element.firstElementChild.remove();
    }
}

window.addEventListener("popstate", (e) => {
    // if(e.state){
    //     document.getElementById("content").innerHTML = e.state.html;
    //     document.title = e.state.pageTitle;
    // }
    e.preventDefault();
    let previousUrl = pathHistory.pop();

    getPage(previousUrl)
});