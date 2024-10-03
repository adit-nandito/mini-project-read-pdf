const Fs = require('fs');
const Path = require('path');
const PDFParse = require('pdf-parse');
const Handlebars = require('handlebars');
const Moment = require('moment');
const Puppeteer = require('puppeteer');
require('moment/locale/id');

Moment.locale('id');

/*
 *  PRIVATE FUNCTION
 */
const __generateAttribute = (texts) => {
  const listAttribute = {};
  let type = '';
  let value = '';
  texts.forEach((item, index) => {
    if (/H.1/.test(item)) listAttribute.h1 = texts[texts.length - 13];
    if (/H.2/.test(item)) listAttribute.h2 = texts[texts.length - 10];

    if (/A.1/.test(item)) {
      type = 'A1';
      value = '';
    }

    if (type === 'A1' && !Number.isNaN(Number(item)) && !/A.2/.test(item)) {
      value = `${value}${item}`;
      if (/A.2/.test(texts[index + 1])) listAttribute.a1 = value;
    }

    if (/A.2/.test(item)) {
      type = 'A2';
      value = '';
    }

    if (type === 'A2' && !Number.isNaN(Number(item)) && !/A.3/.test(item)) {
      value = `${value}${item}`;
      if (/A.3/.test(texts[index + 1])) listAttribute.a2 = value;
    }

    if (/A.3/.test(item)) {
      type = 'A3';
      value = '';
    }

    if (type === 'A3' && /nama/i.test(item) && !/B.1/.test(item)) listAttribute.a3 = texts[index + 1];
    if (/B\.1(?!\d)/.test(item)) listAttribute.b1 = texts[texts.length - 9];
    if (/B.2/.test(item)) listAttribute.b2 = texts[texts.length - 8];
    if (/B.3/.test(item)) listAttribute.b3 = texts[texts.length - 7];
    if (/B.4/.test(item)) listAttribute.b4 = texts[texts.length - 6];
    if (/B.5/.test(item)) listAttribute.b5 = texts[texts.length - 5];
    if (/B.6/.test(item)) listAttribute.b6 = texts[texts.length - 4];

    if (/B.7/.test(item)) {
      type = 'B7';
      value = '';
    }

    if (type === 'B7' && /nomor\s*dokumen/i.test(item) && !/B.8/.test(item)) {
      listAttribute.b7_docrefnum = texts[index + 1];
    }

    if ((type === 'B7' || type === 'DocRefName' || type === 'DocRefDate') && !/B.8/.test(item)) {
      if (/nama\s*dokumen|tanggal|dd|mm|yy/i.test(item)) {
        type = 'DocRefName';
        value = '';
        return;
      }

      if (type === 'DocRefName') {
        listAttribute.b7_docrefname = item;
        type = 'DocRefDate';
        value = '';
      } else if (type === 'DocRefDate') {
        if (!Number.isNaN(Number(item))) value = `${value}${item}`;
        if (/B.8/.test(texts[index + 1])) listAttribute.b7_docrefdate = value;
      }
    }

    if (/B.8/.test(item)) {
      type = 'B8';
      value = '';
    }

    if ((type === 'B8' || type === 'FakturPajak' || type === 'FakturPajakDate') && !/B.9/.test(item)) {
      if (/faktur|pajak|tanggal|dd|mm|yy/i.test(item)) {
        type = 'FakturPajak';
        value = '';
        return;
      }

      if (type === 'FakturPajak') {
        listAttribute.b8_fakturpajak = item;
        type = 'FakturPajakDate';
        value = '';
      } else if (type === 'FakturPajakDate') {
        if (!Number.isNaN(Number(item))) value = `${value}${item}`;
        if (/B.9/.test(texts[index + 1])) listAttribute.b8_fakturpajakdate = value;
      }
    }

    if (/B.9/.test(item)) {
      type = 'B9';
      value = '';
    }

    if ((type === 'B9' || type === 'SKB' || type === 'SKBDate') && !/B.10/.test(item)) {
      if (/skb|nomor|tanggal|dd|mm|yy/i.test(item)) {
        type = 'SKB';
        value = '';
        return;
      }

      if (type === 'SKB') {
        listAttribute.b9_skb = item;
        type = 'SKBDate';
        value = '';
      } else if (type === 'SKBDate') {
        if (!Number.isNaN(Number(item))) value = `${value}${item}`;
        if (/B.10/.test(texts[index + 1])) listAttribute.b9_skbdate = value;
      }
    }

    if (/B.10/.test(item)) {
      type = 'B10';
      value = '';
    }
    if (type === 'B10' && /berdasarkan/i.test(item) && !/B.11/.test(item)) listAttribute.b10 = texts[index + 1];

    if (/B.11/.test(item)) {
      type = 'B11';
      value = '';
    }
    if (type === 'B11' && /nomor/i.test(item) && !/B.12/.test(item)) listAttribute.b11 = texts[index + 1];

    if (/B.12/.test(item)) {
      type = 'B12';
      value = '';
    }
    if (type === 'B12' && /berdasarkan/.test(item) && !/C.1/.test(item)) listAttribute.b12 = texts[index + 1];

    if (/C.1/.test(item)) {
      type = 'C1';
      value = '';
    }

    if (type === 'C1' && !Number.isNaN(Number(item)) && !/C.2/.test(item)) {
      value = `${value}${item}`;
      if (/C.2/.test(texts[index + 1])) listAttribute.c1 = value;
    }

    if (/C.2/.test(item)) {
      type = 'C2';
      value = '';
    }
    if (type === 'C2' && /wajib\s*pajak/i.test(item) && !/C.3/.test(item)) listAttribute.c2 = texts[index + 1];

    if (/C.3/.test(item)) {
      type = 'C3';
      value = '';
    }

    if (type === 'C3' && !Number.isNaN(Number(item)) && !/C.4/.test(item)) {
      value = `${value}${item}`;
      if (/C.4/.test(texts[index + 1])) listAttribute.c3 = value;
    }

    if (/C.4/i.test(item)) {
      type = 'C4';
      value = '';
    }

    if (type === 'C4' && /penandatangan/i.test(item) && !/C.5/.test(item)) listAttribute.c4 = texts[index + 1];
  });

  return listAttribute;
};

const __setDefaultAttributeValue = (attributes) => {
  const newAttribute = {
    h1: attributes.h1 || '-',
    h2: attributes.h2 || '-',
    a1: attributes.a1 || '-',
    a2: attributes.a2 || '-',
    a3: attributes.a3 || '-',
    b1: Moment(Moment(attributes.b1, 'M-YYYY').format()).isValid()
      ? Moment(attributes.b1, 'M-YYYY').format('MMMM YYYY')
      : '-',
    b2: attributes.b2 || '-',
    b3: attributes.b3 || '-',
    b4: attributes.b4 || '-',
    b5: attributes.b5 || '-',
    b6: attributes.b6 || '-',
    b7_docrefnum: attributes.b7_docrefnum || '-',
    b7_docrefname: attributes.b7_docrefname || '-',
    b7_docrefdate: Moment(Moment(attributes.b7_docrefdate, 'DDMMYYYY').format()).isValid()
      ? Moment(attributes.b7_docrefdate, 'DDMMYYYY').format('DD MMMM YYYY')
      : '-',
    b8_fakturpajak: attributes.b8_fakturpajak || '-',
    b8_fakturpajakdate: Moment(Moment(attributes.b8_fakturpajakdate, 'DDMMYYYY').format()).isValid()
      ? Moment(attributes.b8_fakturpajakdate, 'DDMMYYYY').format('DD MMMM YYYY')
      : '-',
    b9_skb: attributes.b9_skb || '-',
    b9_skbdate: Moment(Moment(attributes.b9_skbdate, 'DDMMYYYY').format()).isValid()
      ? Moment(attributes.b9_skbdate, 'DDMMYYYY').format('DD MMMM YYYY')
      : '-',
    b10: attributes.b10 || '-',
    b11: attributes.b11 || '-',
    b12: attributes.b12 || '-',
    c1: attributes.c1 || '-',
    c2: attributes.c2 || '-',
    c3: Moment(Moment(attributes.c3, 'DDMMYYYY').format()).isValid()
      ? Moment(attributes.c3, 'DDMMYYYY').format('DD MMMM YYYY')
      : '-',
    c4: attributes.c4 || '-'
  };

  return newAttribute;
};

const __createPDF = async (attributes) => {
  const html = Fs.readFileSync(Path.join(__dirname, '../assets/template.html'), 'utf8');
  const template = Handlebars.compile(html);

  const htmlTemplate = template(attributes);

  // Launch Puppeteer in headless mode
  const option = {};
  if (process.env.NODE_ENV === 'production') {
    option.headless = true;
    option.args = ['--no-sandbox', '--disable-setuid-sandbox'];
  } else {
    option.executablePath = process.env.CHROME_PATH;
  }

  const browser = await Puppeteer.launch(option);
  const page = await browser.newPage();

  // Load the HTML file into Puppeteer
  await page.setContent(htmlTemplate, { waitUntil: 'networkidle0' }); // Set HTML content

  // Convert the HTML to a PDF buffer
  const options = {
    format: 'A4',
    margin: {
      top: '11mm',
      right: '12mm',
      bottom: '11mm',
      left: '12mm'
    }
  };
  const pdfBuffer = await page.pdf(options);

  // Close the browser
  await browser.close();

  // Return the buffer
  return pdfBuffer;
};

/*
 *  PUBLIC FUNCTION
 */
const uploadPDF = async (fileBuffer) => {
  try {
    // Use pdf-parse to extract text content from the PDF
    const data = await PDFParse(fileBuffer);
    const texts = data.text.replaceAll(':', '').split('\n');
    const attributes = __generateAttribute(texts);
    const newAttribute = __setDefaultAttributeValue(attributes);
    const pdfFile = await __createPDF(newAttribute);

    return {
      pdfFile: pdfFile.toString('base64')
    };
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports = {
  uploadPDF
};
