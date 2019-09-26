const rp = require('request-promise');
const $  = require('cheerio');
const url = 'https://www.naranja.com/comercios-amigos';
const fs = require('fs');
const dateTime = require('node-datetime');

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
let currentSocket = null;


setInterval(callNaranja, 1000 * 60);

function callNaranja() {
    rp(url)
  .then(naranjaScraper)
  .catch(showError);
}

function showError(error) {
    console.log('Error parsing html with cheerio', error);
}

function naranjaScraper(html){
    const faqs = parseFaq($('div > app-faq-question', html), html);    
    saveAsFile(faqs);
    if (currentSocket) {
        faqsFromFile = readJSONFile();
        currentSocket.emit("faqs", faqsFromFile);
    }
}

function parseFaq(faq, html) {
    let faqs = [];
    faq.each((i, faq) => { 
        const title = $(faq, html).find('.faq-title').text();
        const text = $(faq, html).find('.faq-text').text();
        faqs.push({'faqTitle': title, 'faqText': text});
    });
    return faqs;
}

function saveAsFile(faqs) {
    let dt = dateTime.create();
    const dateformatted = dt.format('d-m-Y H:M:S');

    let output = { "data": {"faqs": faqs, "date": dateformatted }};
    let data = JSON.stringify(output);
    fs.writeFileSync('naranja_faqs.json', data);
}

function readJSONFile(){
    let rawdata = fs.readFileSync('naranja_faqs.json');
    let faqs = JSON.parse(rawdata);
    return faqs;
}

io.on("connection", socket => {   
    currentSocket = socket;
    console.log("Client connected");
  });


http.listen(4444);