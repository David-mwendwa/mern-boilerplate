/**
 * Read binary file
 * @param {*} contentType image mimetype
 * @param {*} data file buffer i.e image
 * @returns image source url usable on the client
 * @example <img src={readBinaryFile({ contentType, data })} />
 */
const readBinaryFile = ({ contentType, data }) => {
  console.log({ contentType, data });
  const b64 = window.btoa(String.fromCharCode(...new Uint8Array(data.data)));
  return `data:${contentType};base64,${b64}`;
};

export default readBinaryFile;
