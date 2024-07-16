// const isTouchDevice = 'ontouchstart' in document.documentElement;
const dom = 'http://localhost:3000/'
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
    
    function changeToolt(val) {
        document.querySelector(`[data-toolt-id="${val}"]`).classList.add('toolt_item-show')
    }
    
    function emptyToolt(val) {
        document.querySelector(`[data-toolt-id="${val}"]`).classList.remove('toolt_item-show')
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
        if (!href.includes('http')) {
            // link.removeEventListener('click',function(){});
            link.addEventListener('click',function(e){
                e.preventDefault();
                completeHistory();
                getPage(href)
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
    if (!href.includes('http')) {
        href = dom+href;
    }
    const response = await fetch(href);
    const text = await response.text();
    const html = stringToHTML(text);
    changeContent(html);

    if (href == dom+'/') {
        href = '/';
    }

    window.history.pushState({"html":'',"pageTitle":'New title'},"", href);

    // INIT TOOLT
    initToolt();
}


function changeContent(html) {
    let newContent = html.querySelector('#content');
    const currentContent = document.getElementById('content');
    empty(currentContent);

    // SCROLL TOP
    window.scrollTo(0, 0);

    // LOAD CONTENT
    currentContent.append(newContent);

    // REINIT LINKS
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