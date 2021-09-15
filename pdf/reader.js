let pdfreader = require('pdfreader');
let nzhcn = require("nzh/cn"); //直接使用简体中文

const reg = /^[壹贰叁肆伍陆柒捌玖零拾佰仟]+/g;

function readPdf(filename) {
    return new Promise((resolve, reject) => {
        console.log('pdf name:', filename);
        new pdfreader.PdfReader().parseFileItems(filename, function (err, item) {
            if (err) {
                console.log(err);
                return;
            }
            if (!item) {
                return;
            }
            if (item.text) {
                // console.log('text:', item.text);
                if (item.text.match(reg)) {
                    const value = nzhcn.decodeB(item.text, { complete: true, tenMin: true })
                    console.log('money:', item.text, value);
                }
            }
        });
    })
}

async function read() {
    // await readPdf('./2021.06.01/20210603.pdf')
    // await readPdf('./2021.06.01/20210531.pdf')
    // await readPdf('./2021.06.01/20210603_03300200091.pdf')
    // await readPdf('./2021.06.01/20210604.pdf')

    console.log(nzhcn.toMoney(21.4))
    console.log(nzhcn.decodeB('人民币贰拾壹元肆角'))
}

read()