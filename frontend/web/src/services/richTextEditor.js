const htmlToPlainText = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    return doc.body.textContent || "";
};

module.exports = {
    htmlToPlainText
};