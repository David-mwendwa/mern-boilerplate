/**
 * Handle multi-part form data.
 * Useful when submitting form values as 'Form Data' i.e when using multer file uploader on backend
 * @param {*} data form input data as a key(fieldname) value(input) object
 * @returns formData object
 * @example handleFormData({name: 'David', avatar: '...', ... })
 *
 */
const handleFormData = (data) => {
  const formData = new FormData();
  for (const [key, value] of Object.entries(data)) {
    formData.append(key, value);
  }
  return formData;
};

export default handleFormData;
