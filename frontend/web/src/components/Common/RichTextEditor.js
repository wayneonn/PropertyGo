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

module.exports = {
    modules,
    formats
};