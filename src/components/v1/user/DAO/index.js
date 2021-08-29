import userModel from '../../../../models/user';

const newUser = (user) => userModel.create({ ...user });

export default newUser;
