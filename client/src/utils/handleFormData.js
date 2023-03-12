/**
 * @param {*} data as a key(fieldname) value(input) object containing form input values ie {name: 'Iphone 13', image: '....', price: 899 }
 * @returns updated formData - can be POSTed to the backend
 * @invoke handleFormData(data) i.e const formData = handleFormData({name: 'Iphone 13', image: '....', price: 899 })
 * @usage when parsing form-data
 */
const handleFormData = (data) => {
  const formData = new FormData();
  for (const [key, value] of Object.entries(data)) {
    formData.append(key, value);
  }
  return formData;
};

export default handleFormData;
