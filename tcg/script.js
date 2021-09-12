// Chargement config
var config = getConfigFromURL();

// Chargement de la font
var vcr_font = new FontFace('VCR', 'url(vcr.ttf)');
document.fonts.add(vcr_font);
let canvas = document.querySelector('#testcard');
let ctx = canvas.getContext('2d');
ctx.font = "100px VCR";

// Chargement des images
var images_names = ['bars75', 'bars100', 'black', 'checkerboard', 'circle', 'darkblue', 'gray50',
                    'lines', 'linesw', 'mauve', 'overscan', 'smpte', 'circlew'];
var canvas_images = new Map();
for(let i=0 ; i < images_names.length ; i++) {
    let image_object = new Image();
    image_object.src = images_names[i] + '.svg';
    canvas_images.set(images_names[i], image_object);
}

// Rafraichissement de la mire
setInterval(function() {
    updateCanvasFromConfig();
}, 100);

function getConfigFromURL() {
    let config = { // Default config
        'pattern': 'bars75',
        'circle': false,
        'circlew': false,
        'overscan': false,
        'text': false,
        'time': false,
        'inverted': false,
        'boxed': true,
        'blink': false,
        'label': 'NO SIGNAL',
        'fullscreen': false
    };

    let url_config_str = document.location.hash.substring(1);
    if(url_config_str) {
        let url_config_list = url_config_str.split(';');
        url_config_list.forEach(function(value, i, array) {
            let key_for_index = Object.keys(config)[i];
            value = decodeURIComponent(value);
            if(value == '1') { value = true; }
            if(value == '0') { value = false; }
            config[key_for_index] = value;
        });
    }

    document.querySelector("#label-widget").innerHTML = config['label'];

    return config;
}

function setConfigToURL() {
    let config_array = Object.values(config);
    config_array.forEach(function(value, i) {
        if(value == true)  { config_array[i] = '1'; }
        if(value == false) { config_array[i] = '0'; }
    });
    let config_str = config_array.join(';');
    document.location.hash = config_str;
}

function updateCanvasFromConfig() {
    drawImage(config['pattern']);
    if(config['circle']) {
        drawImage('circle');
    }
    if(config['circlew']) {
        drawImage('circlew');
    }
    if(config['overscan']) {
        drawImage('overscan');
    }
    if(config['text']) {
        drawTextbox(
            config['label'],
            config['boxed'],
            config['inverted'],
            config['blink']
        );
    }
    if(config['time']) {
        let d = new Date();
        drawTextbox(
            padt(d.getHours()) + ':' + padt(d.getMinutes()) + ':' + padt(d.getSeconds()),
            config['boxed'],
            config['inverted'],
            config['blink'],
            true
        );
    }
}

function drawImage(filename) {
    let canvas = document.querySelector('#testcard');
    let ctx = canvas.getContext('2d');
    ctx.drawImage(canvas_images.get(filename), 0, 0, canvas.width, canvas.height);
}

function drawTextbox(text, boxed, inverted, blink, bottom) {
    let d = new Date();
    if(blink && d.getSeconds() % 2) {
        return false;
    }

    if(boxed) {
        ctx.fillStyle = inverted ? "white" : "black";
        let boxWidth = ctx.measureText(text).width + 60;
        let boxHeight = 110;
        let boxX = (canvas.width/2) - (boxWidth/2);
        let boxY = (canvas.height/2) - (boxHeight/2);
        if(bottom) {
            boxY += 300;
        } 
        ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
    }

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = inverted ? "black" : "white";
    let textHeight = canvas.height/2-12;
    if(bottom) {
        textHeight += 300;
    } 
    ctx.fillText(text, canvas.width/2, textHeight);
}

function padt(hour_or_minute) {
    if(hour_or_minute < 10) {
        return '0' + hour_or_minute;
    }
    else {
        return hour_or_minute;
    }
}

// Buttons

function setPattern(filename) {
    config['pattern'] = filename;
    updateCanvasFromConfig();
    setConfigToURL();
}

function toggleOption(option) {
    config[option] = !config[option];
    updateCanvasFromConfig();
    setConfigToURL();
}

function setLabel(text) {
    config['label'] = text;
    updateCanvasFromConfig();
    setConfigToURL();
}

function setPreviewWide(yes) {
    if(yes) {
        document.querySelector("#testcard").classList.add('wide');
    }
    else {
        document.querySelector("#testcard").classList.remove('wide');
    }
}

function toggleFullscreen() {
    document.querySelector("#testcard").classList.toggle('fullscreen');
}