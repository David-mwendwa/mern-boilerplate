/**
 * Handle multi-part form data
 * @param {*} data parse data as a key(fieldname) value(input) object containing form input values @example {name: 'David', avatar: '...', ... }
 * @returns updated formData object
 */
const handleFormData = (data) => {
  const formData = new FormData();
  for (const [key, value] of Object.entries(data)) {
    formData.append(key, value);
  }
  return formData;
};

export default handleFormData;
