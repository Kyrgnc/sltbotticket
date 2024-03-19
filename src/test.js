function convertToMenuObjects(menuString) {
    if (!menuString || menuString.trim() === '') {
      return [
        {
          setLabel: 'Talep',
          setDescription: 'Description',
          setValue: '1'
        }
      ];
    }
  
    const menuNames = menuString.split(',');
  
    const menuObjects = menuNames.map((name, index) => {
      return {
        setLabel: name.trim(),
        setDescription: name.trim(),
        setValue: (index + 1).toString()
      };
    });
  
    return menuObjects;
  }
  
  const menuString = 'Bildiri Mesajı,Buton İsmi,Buton Emojisi,Buton Rengi';
  const result = convertToMenuObjects(menuString);
  console.log(result);
  