import { Factory } from 'pip-services-components-node';
import { Descriptor } from 'pip-services-commons-node';

import { FluentdLogger } from '../log/FluentdLogger';

export class DefaultFluentdFactory extends Factory {
	public static readonly Descriptor = new Descriptor("pip-services", "factory", "fluentd", "default", "1.0");
	public static readonly FluentdLoggerDescriptor = new Descriptor("pip-services", "logger", "fluentd", "*", "1.0");

	public constructor() {
        super();
		this.registerAsType(DefaultFluentdFactory.FluentdLoggerDescriptor, FluentdLogger);
	}
}