const UserQuizAnswer = require("./../models/QUIZ/UserQuizAnswer");
const Question = require("./../models/QUIZ/Question");
const Child = require("../models/Child");
const Answer = require("./../models/QUIZ/Answers");
const User = require("./../models/User");
const UserQuiz = require("./../models/QUIZ/UserQuiz");
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

  const data = await s3.upload(params).promise();

  return data.Location;
}

const afterFailingQuiz = async (child_id, is_child, userId, quiz_id) => {
  await UserQuiz.findOneAndUpdate(
    { child_id, is_child, userId, quiz_id },
    {
      completed_status: "start",
    },
    { new: true }
  );
};

const afterPassingQuiz = async (child_id, is_child, userId, quiz_id, link) => {
  await UserQuiz.findOneAndUpdate(
    { child_id, is_child, userId, quiz_id },
    {
      completed_status: "completed",
      certificate_url: link,
    }
  );
};

exports.evaluate = async (req, res) => {
  try {
    const userId = req.user.id;
    const { child_id, is_child, quiz_id } = req.body;

    let userAnswer = await UserQuizAnswer.find({
      child_id,
      is_child,
      quiz_id,
      userId,
    });
    if (userAnswer.length > 0) {
      let totalQuestion = await Question.countDocuments({ quiz_id });

      const userAns = userAnswer[0];

      let questIds = Object.keys(userAns.answers);

      let questionsData = await Promise.all(
        questIds.map((curr) => Answer.find({ question_id: curr }))
      );

      let actualAnswers = {};
      questionsData.forEach((curr, idx) => {
        if (curr.length > 0) {
          const idIndex = questIds[idx];
          curr.forEach((ele) => {
            if (ele.is_correct === true) {
              actualAnswers[idIndex] = ele._id.toString();
            }
          });
        }
      });

      let correctAns = 0;
      let userAnsweredQuestions = userAns.answers;

      questIds.forEach((curr) => {
        console.log(actualAnswers[curr], userAnsweredQuestions[curr]);
        if (actualAnswers[curr] === userAnsweredQuestions[curr]) {
          correctAns += 1;
        }
      });

      let percentage = (100 * correctAns) / totalQuestion;

      if (percentage >= 60) {
        const data = {
          name: "",
          schoolName: "",
          grade: "",
          city: "",
          year: String(new Date().getFullYear()),
        };

        const userData = await User.findById(userId);
        if (!userData) {
          return res
            .status(200)
            .json({ ok: false, msg: "User Data Do Not Exists!" });
        }
        data.name = userData.name;
        data.city = userData.city;
        let childData = {};
        if (is_child === true) {
          childData = await Child.findById(child_id);
          if (!childData) {
            return res
              .status(200)
              .json({ ok: false, msg: "Child Data Do Not Exists!" });
          }
          data.name = childData.name || "";
          data.schoolName = childData.school_name || "";
          data.grade = String(childData.grade || "");
        }

        const pdf = await addDetailsToPDF(
          data.name,
          data.schoolName,
          data.grade,
          data.city,
          data.year
        );
        const s3Response = await uploadToS3(pdf);

        await afterPassingQuiz(child_id, is_child, userId, quiz_id, s3Response);

        return res.status(200).json({
          ok: true,
          passed: true,
          certificate_url: s3Response,
          correctAns,
          totalQuestion,
          percentage,
        });
      } else {
        await afterFailingQuiz(child_id, is_child, userId, quiz_id);

        return res.status(200).json({
          ok: true,
          passed: false,
          correctAns,
          totalQuestion,
          percentage,
        });
      }
    } else {
      res.status(200).json({ ok: false, msg: "No User Found!" });
    }
  } catch (error) {
    res.status(400).json({ ok: false, msg: error.message });
  }
};
