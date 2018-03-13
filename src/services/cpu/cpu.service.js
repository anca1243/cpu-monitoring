// Initializes the `cpu` service on path `/cpu`
const createService = require('./cpu.class.js');
const hooks = require('./cpu.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'cpu',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/cpu', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('cpu');

  service.hooks(hooks);
};
