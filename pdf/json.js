let fs = require('fs');
let PDFParser = require("pdf2json");

let pdfParser = new PDFParser();

const map = {
    '壹': 1,
    '贰': 2,
    '叁': 3,
    '肆': 4,
    '伍': 5,
    '陆': 6,
    '柒': 7,
    '捌': 8,
    '玖': 9,
    '零': 0,
    '拾': '十',
    '佰': '百',
    '仟': '千',
    '万': '万',
}

function readJson(filePath) {
    console.log('filename:', filePath);
    const paths = filePath.split('/')
    const fileName = paths[paths.length - 1].split('.')[0]

    pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
    pdfParser.on("pdfParser_dataReady", pdfData => {
        fs.writeFile(`./data/${fileName}.json`, JSON.stringify(pdfData), (err, data) => {
            console.log('file data:', data);
        });
    });

    pdfParser.loadPDF(filePath);
}

// readJson("./2021.06.01/20210603_03300200091.pdf")
readJson("./2021.06.01/20210603_03300200091.pdf")