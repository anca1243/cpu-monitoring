// Initializes the `cpu` service on path `/cpu`
const createService = require('feathers-nedb');
const createModel = require('../../models/cpu.model');
const hooks = require('./cpu.hooks');
const socketio = require('@feathersjs/socketio');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'cpu',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/cpu', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('cpu');

  service.hooks(hooks);
};
