/**
 * Handle unavailable routes
 * @param {*} req request object
 * @param {*} res response object
 */
const notFoundMiddleware = async (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
};

export default notFoundMiddleware;
