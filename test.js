const fs = require("fs");
const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const AWS = require("aws-sdk");

require("dotenv").config();

const getFontSize = (font, name, width, def) => {
  let fontSize = def;

  let textWidth = font.widthOfTextAtSize(name, fontSize);

  while (textWidth > width - 50) {
    fontSize -= 1;
    textWidth = font.widthOfTextAtSize(name, fontSize);
  }

  const x = (width - textWidth) / 2;

  return [fontSize, x];
};

async function addDetailsToPDF(name, schoolName, grade, city, year) {
  if (!name) name = "";
  if (!schoolName) schoolName = "";
  if (!grade) grade = "";
  if (!city) city = "";
  if (!year) year = "";

  const existingPdfBytes = fs.readFileSync("template.pdf");
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);

  const defaultFontSize = 25;
  const { width } = firstPage.getSize();

  const f1 = getFontSize(font, name, width, defaultFontSize);
  firstPage.drawText(name, {
    x: f1[1] + 50,
    y: 380,
    size: f1[0],
    font: font,
    color: rgb(0, 0, 0),
  });

  const f2 = getFontSize(font, schoolName, width, defaultFontSize);
  firstPage.drawText(schoolName, {
    x: f2[1] + 50,
    y: 325,
    font,
    size: f2[0],
    color: rgb(0, 0, 0),
  });

  const f3 = getFontSize(font, grade, width, defaultFontSize);
  firstPage.drawText(grade, {
    x: 350,
    y: 275,
    font,
    size: f3[0],
    color: rgb(0, 0, 0),
  });

  const f4 = getFontSize(font, city, width, defaultFontSize);
  firstPage.drawText(city, {
    x: 500,
    y: 275,
    font,
    size: f4[0],
    color: rgb(0, 0, 0),
  });

  firstPage.drawText(year, {
    x: 550,
    y: 135,
    font,
    size: defaultFontSize,
    color: rgb(0, 0, 0),
  });

  const pdfBytes = await pdfDoc.save();

  return pdfBytes;
}

async function uploadToS3(pdfBytes) {
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: "certificate_" + Date.now(),
    Body: pdfBytes,
    ContentType: "application/pdf",
    ACL: "public-read",
  };

  return s3.upload(params).promise();
}

const run = async () => {
  const pdf = await addDetailsToPDF(
    "Yash Gupta",
    "NA",
    "NA",
    "Lucknow",
    "2019"
  );
  const s3Response = await uploadToS3(pdf);

  console.log(s3Response);
};

run();
