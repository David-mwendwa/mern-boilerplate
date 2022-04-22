import { UnauthenticatedError } from '../errors/index.js';

// checks if a certain resource/item was created or belongs to a given user
const checkPermissions = (requestUser, resourceUserId) => {
  if (requestUser.role === 'admin') return;
  if (requestUser.userId === resourceUserId.toString()) return;
  throw new UnauthenticatedError('Not authorized to access this resource');
};

export default checkPermissions;
