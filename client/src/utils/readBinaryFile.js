/**
 * @param {*} contentType as the image mimetype
 * @param {*} data as the image buffer
 * @returns image source url - usable on the client
 * @invoke on the img element i.e <img src={readBinaryFile({ contentType, data })} />
 */
const readBinaryFile = ({ contentType, data }) => {
  console.log({ contentType, data });
  const b64 = window.btoa(String.fromCharCode(...new Uint8Array(data.data)));
  return `data:${contentType};base64,${b64}`;
};

export default readBinaryFile;
