import reportModel from '../../../../models/report';

const getReportByIdentifier = (identifier) => reportModel.findOne({
  identifier,
}).lean().exec();

const newReport = (report) => reportModel.create({ ...report });

export default {
  getReportByIdentifier,
  newReport,
};
