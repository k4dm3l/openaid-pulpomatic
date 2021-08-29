import userModel from '../../../../models/user';

const getUserByUsername = (username) => userModel.findOne({
  username,
}).lean().exec();

export default getUserByUsername;
