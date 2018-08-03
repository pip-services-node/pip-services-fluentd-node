"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_components_node_1 = require("pip-services-components-node");
const pip_services_rpc_node_1 = require("pip-services-rpc-node");
class FluentdLogger extends pip_services_components_node_1.CachedLogger {
    constructor() {
        super();
        this._connectionResolver = new pip_services_rpc_node_1.HttpConnectionResolver();
        this._reconnect = 10000;
        this._timeout = 3000;
        this._client = null;
    }
    configure(config) {
        super.configure(config);
        this._connectionResolver.configure(config);
        this._reconnect = config.getAsIntegerWithDefault('options.reconnect', this._reconnect);
        this._timeout = config.getAsIntegerWithDefault('options.timeout', this._timeout);
    }
    setReferences(references) {
        super.setReferences(references);
        this._connectionResolver.setReferences(references);
    }
    isOpen() {
        return this._timer != null;
    }
    open(correlationId, callback) {
        if (this.isOpen()) {
            callback(null);
            return;
        }
        this._connectionResolver.resolve(correlationId, (err, connection) => {
            if (connection == null)
                err = new pip_services_commons_node_1.ConfigException(correlationId, 'NO_CONNECTION', 'Connection is not configured');
            if (err != null) {
                callback(err);
                return;
            }
            let host = connection.getHost();
            let port = connection.getPort() || 24224;
            let options = {
                host: host,
                port: port,
                timeout: this._timeout / 1000,
                reconnectInterval: this._reconnect
            };
            this._client = require('fluent-logger');
            this._client.configure(null, options);
            this._timer = setInterval(() => { this.dump(); }, this._interval);
            if (callback)
                callback(null);
        });
    }
    close(correlationId, callback) {
        this.save(this._cache, (err) => {
            if (this._timer)
                clearInterval(this._timer);
            this._cache = [];
            this._timer = null;
            this._client = null;
            if (callback)
                callback(null);
        });
    }
    save(messages, callback) {
        if (!this.isOpen() || messages.length == 0) {
            if (callback)
                callback(null);
            return;
        }
        for (let message of messages) {
            let record = {
                level: message.level,
                source: message.source,
                correlation_id: message.correlation_id,
                error: message.error,
                message: message.message
            };
            this._client.emit(message.level, record, callback);
        }
    }
}
exports.FluentdLogger = FluentdLogger;
//# sourceMappingURL=FluentdLogger.js.map