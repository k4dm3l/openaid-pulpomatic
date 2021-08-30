import userModel from '../../../../models/user';

const findUserByUsername = (username) => userModel.findOne({
  username,
}).lean().exec();
const newUser = (user) => userModel.create({ ...user });
const deleteUser = (userId) => userModel.findOneAndDelete({ _id: userId });

export default {
  newUser,
  deleteUser,
  findUserByUsername,
};
