import { ConfigParams } from 'pip-services-commons-node';
import { IReferences } from 'pip-services-commons-node';
import { IReferenceable } from 'pip-services-commons-node';
import { IOpenable } from 'pip-services-commons-node';
import { ConfigException } from 'pip-services-commons-node';
import { CachedLogger } from 'pip-services-components-node';
import { LogMessage } from 'pip-services-components-node';
import { HttpConnectionResolver } from 'pip-services-rpc-node';

export class FluentdLogger extends CachedLogger implements IReferenceable, IOpenable {
    private _connectionResolver: HttpConnectionResolver = new HttpConnectionResolver();
    
    private _reconnect: number = 10000;
    private _timeout: number = 3000;
    private _timer: any;

    private _client: any = null;

    public constructor() {
        super();
    }

    public configure(config: ConfigParams): void {
        super.configure(config);

        this._connectionResolver.configure(config);

        this._reconnect = config.getAsIntegerWithDefault('options.reconnect', this._reconnect);
        this._timeout = config.getAsIntegerWithDefault('options.timeout', this._timeout);
    }

    public setReferences(references: IReferences): void {
        super.setReferences(references);
        this._connectionResolver.setReferences(references);
    }

    public isOpened(): boolean {
        return this._timer != null;
    }

    public open(correlationId: string, callback: (err: any) => void): void {
        if (this.isOpened()) {
            callback(null);
            return;
        }

        this._connectionResolver.resolve(correlationId, (err, connection) => {
            if (connection == null)
                err = new ConfigException(correlationId, 'NO_CONNECTION', 'Connection is not configured');

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

            if (callback) callback(null);
        });
    }

    public close(correlationId: string, callback: (err: any) => void): void {
        this.save (this._cache, (err) => {
            if (this._timer)
                clearInterval(this._timer);

            this._cache = [];
            this._timer = null;
            this._client = null;
                
            if (callback) callback(null);
        });
    }

    protected save(messages: LogMessage[], callback: (err: any) => void): void {
        if (!this.isOpened() || messages.length == 0) {
            if (callback) callback(null);
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