//pass errors from async functs to next so Express can catch & proccess them
module.exports = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch(next);
  };
};
