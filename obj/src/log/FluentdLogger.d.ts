import { ConfigParams } from 'pip-services-commons-node';
import { IReferences } from 'pip-services-commons-node';
import { IReferenceable } from 'pip-services-commons-node';
import { IOpenable } from 'pip-services-commons-node';
import { CachedLogger } from 'pip-services-components-node';
import { LogMessage } from 'pip-services-components-node';
export declare class FluentdLogger extends CachedLogger implements IReferenceable, IOpenable {
    private _connectionResolver;
    private _reconnect;
    private _timeout;
    private _timer;
    private _client;
    constructor();
    configure(config: ConfigParams): void;
    setReferences(references: IReferences): void;
    isOpened(): boolean;
    open(correlationId: string, callback: (err: any) => void): void;
    close(correlationId: string, callback: (err: any) => void): void;
    protected save(messages: LogMessage[], callback: (err: any) => void): void;
}
