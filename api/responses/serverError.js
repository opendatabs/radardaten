module.exports = function ok(error) {
  console.error(error.stack);
  return this.res.status(500).json(error);
};
