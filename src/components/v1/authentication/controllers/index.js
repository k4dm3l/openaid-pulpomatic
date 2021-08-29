import getSessionToken from '../services';

const getToken = async (req, res) => {
  res.status(201).json({
    status: 201,
    message: 'Success',
    data: await getSessionToken({ ...req.body }),
  });
};

export default getToken;
