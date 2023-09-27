const modules = {
    toolbar: {
        container: [
            ['bold', 'italic', 'underline'],
            ['link'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ],
    },
};

const formats = [
    'plain',
    'bold',
    'italic',
    'underline',
    'link',
    'list',
];

const htmlToPlainText = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    return doc.body.textContent || "";
};

module.exports = {
    htmlToPlainText,
    modules,
    formats
};