const fs = require('fs');
const path = require('path');

const log = require('log');

const config = module.exports = {
	load: function(settings, error, done){
		config.default = settings.default || {};

		config.path = path.join(settings.path || __dirname, 'config.json');

		fs.readFile(config.path, function(err, data){
			if(err && err.code === 'ENOENT') log(`No config file available at ${config.path}`);

			else if(err) log.warn('Error reading config file', err);

			try{ config.loaded = JSON.parse(data); }

			catch(e){
				log('Failed to parse config .. Replacing with default');
				log.error(2)(e);

				config.loaded = config.default;
			}

			log(1)(`Loaded config ${settings.path}`);
			log(2)(config.loaded);

			if(done) done(config.loaded);
		});
	},
	save: function(config, error, done){
		if(!config) return error({ detail: 'Missing config' });
		if(!config.path) return error({ detail: 'Missing config path' });

		config = JSON.stringify(config, null, '  ', 2);

		fs.writeFile(config.path, config, function(err){
			if(err) return error({ err: err, detail: 'Error writing to config' });

			log(1)(`Saved config ${config.path}`);
			log(2)(config);

			if(done) done(config);
		});
	}
};