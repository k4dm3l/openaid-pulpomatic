import getPulpomaticAIDLastFiveYears from '../services';

const getResourcesLastFiveYears = async (req, res) => {
  res.status(200).json({
    status: 200,
    message: 'Success',
    data: await getPulpomaticAIDLastFiveYears({ ...req.query }),
  });
};

export default getResourcesLastFiveYears;
