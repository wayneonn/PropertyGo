const moment = require("moment");
const { FAQ } = require("../../models");
const cheerio = require("cheerio");

const htmlToPlainText = (html) => {
  const $ = cheerio.load(html);
  return $.text();
};

// const cleanEmptyStylingTags = (html) => {
//   const $ = cheerio.load(html, { decodeEntities: false });

//   $('*:contains(" ")').each(function () {
//     if ($(this).text().trim() === "") {
//       $(this).replaceWith($(this).text());
//     }
//   });

//   return $.html();
// };

// helper function
const getFaqForUniqueness = async ({ question, faqType, faqId = null }) => {
  const formattedQuestion = htmlToPlainText(question);

  const faqs = await FAQ.findAll({
    attributes: ["faqId", "question", "faqType"],
  });

  for (const faq of faqs) {
    const faqFormattedQuestion = htmlToPlainText(faq.question);
    const faqFaqType = faq.faqType;
    const faqFaqId = faq.faqId;

    if (formattedQuestion === faqFormattedQuestion && faqFaqType === faqType) {
      if (!(faqId != null && faqId == faqFaqId)) {
        return true;
      }
    }
  }

  return false;
};

const getAllFaqs = async (req, res) => {
  try {
    const faqs = await FAQ.findAll({
      attributes: [
        "faqId",
        "question",
        "answer",
        "faqType",
        "createdAt",
        "updatedAt",
      ],
    });

    const formattedFaqs = faqs.map((faq) => {
      return {
        faqId: faq.faqId,
        question: faq.question,
        answer: faq.answer,
        faqType: faq.faqType,
        createdAt: moment(faq.createdAt)
          .tz("Asia/Singapore")
          .format("YYYY-MM-DD HH:mm:ss"),
        updatedAt: moment(faq.updatedAt)
          .tz("Asia/Singapore")
          .format("YYYY-MM-DD HH:mm:ss"),
      };
    });

    res.status(200).json({ faqs: formattedFaqs });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getSingleFaq = async (req, res) => {
  try {
    const { id: faqId } = req.params;

    const faq = await FAQ.findByPk(faqId);

    if (!faq) {
      return res.status(404).json({ message: "FAQ not found" });
    }

    res.status(200).json(faq);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const createFaq = async (req, res) => {
  const { adminId } = req.query;

  const { question, faqType } = req.body;

  // removing styling spaces of the question first
  // const formattedQuestion = cleanEmptyStylingTags(question);

  if (!adminId) {
    return res
      .status(401)
      .json({ message: `Admin Id is empty.` });
  }

  const questionFound = await getFaqForUniqueness({
    question: question,
    faqType,
  });

  if (questionFound) {
    return res
      .status(409)
      .json({ message: `Question already exist in ${faqType}.` });
  }

  req.body.question = question;
  req.body.adminId = adminId;

  const faq = await FAQ.create(req.body);

  res.status(201).json({ faq });

  // req.io.emit("newFaqRecordNotification", "A new FAQ has been added.");
};

const updateFaq = async (req, res) => {
  const { id: faqId } = req.params;

  const { question, answer, faqType } = req.body;

  // removing styling spaces of the question first
  // const formattedQuestion = cleanEmptyStylingTags(question);

  const faq = await FAQ.findByPk(faqId);

  if (
    faq.question === question &&
    faq.answer === answer &&
    faq.faqType === faqType
  ) {
    return res.status(200).json({ faq });
  }

  if (faq.question === question && faq.answer !== answer) {
    req.body.question = question;
    await faq.update(req.body);

    const updatedFaq = await FAQ.findByPk(faqId);

    return res.status(200).json({ faq: updatedFaq });
  }

  const questionFound = await getFaqForUniqueness({
    question: question,
    faqType,
    faqId,
  });

  if (questionFound) {
    return res
      .status(409)
      .json({ message: `Question already exist in ${faqType}.` });
  }

  try {
    const faq = await FAQ.findByPk(faqId);

    if (!faq) {
      return res.status(404).json({ message: "FAQ not found" });
    }

    req.body.question = question;
    await faq.update(req.body);

    const updatedFaq = await FAQ.findByPk(faqId);

    res.status(200).json({ faq: updatedFaq });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteFaq = async (req, res) => {
  const { id: faqId } = req.params;

  const faq = await FAQ.findByPk(faqId);

  if (!faq) {
    return res.status(404).json({ message: "FAQ not found" });
  }

  await faq.destroy();
  res.status(200).json({ message: "Success! FAQ removed." });
};

module.exports = {
  getAllFaqs,
  getSingleFaq,
  createFaq,
  updateFaq,
  deleteFaq,
};
