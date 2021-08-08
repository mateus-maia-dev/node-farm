const fs = require('fs');
const http = require('http');
const url = require('url');

const replaceTemplate = require('./modules/replaceTemplate')

// Blocking, synchronous way

// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8', (err, data)=>{
//     console.log(data)
// });
// const textOut = `This is what i learned of avocado: ${textIn}`
// fs.writeFileSync('./txt/output.txt', textOut)

// Non-Blocking, assynchronous way

// fs.readFile('./txt/start.txt', 'utf-8', (err, data) => {
//     if (err) return console.log(err);
//     fs.readFile(`./txt/${data}.txt`, 'utf-8', (err, data2) => {
//         fs.readFile('./txt/final.txt', 'utf-8', (err, data3) => {
//             // console.log(data3)

//             fs.writeFile('./txt/output.txt', `${data2} - ${data3}`, 'utf-8', err => {
//                 console.log("File written!");
//             })
//         })
//     })
// })

// console.log("Your data has been processing...");

// SERVER

// syncronous request
const data = fs.readFileSync(`./dev-data/data.json`, 'utf-8');
const tempOverview = fs.readFileSync(`./templates/template-overview.html`, 'utf-8');
const tempProduct = fs.readFileSync(`./templates/template-product.html`, 'utf-8');
const tempCard = fs.readFileSync(`./templates/template-card.html`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true);

    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, { 'Content-type': 'text/html' });

        const prodHTML = dataObj.map((product) => replaceTemplate(tempCard, product)).join('');
        const output = tempOverview.replace(/{%PRODUCT_CARDS%}/, prodHTML);

        res.end(output);

    } else if (pathname === '/product') {
        res.writeHead(200, { 'Content-type': 'text/html' });


        const product = dataObj[query.id]

        const output = replaceTemplate(tempProduct, product);
        res.end(output);

    } else if (pathname === '/api') {
        res.writeHead(200, { 'Content-type': 'application/json' });
        res.end(data)

    }
    else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-owh-header': 'hello-world'

        })
        res.end('<h1>Page NOT FOUND</h1>')
    }

});

const port = '8000';
const localhost = '127.0.0.1';

server.listen(port, localhost, () => {
    console.log(`server initiated at http://${localhost}:${port}`)
})

