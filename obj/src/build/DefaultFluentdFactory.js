"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services_components_node_1 = require("pip-services-components-node");
const pip_services_commons_node_1 = require("pip-services-commons-node");
const FluentdLogger_1 = require("../log/FluentdLogger");
class DefaultFluentdFactory extends pip_services_components_node_1.Factory {
    constructor() {
        super();
        this.registerAsType(DefaultFluentdFactory.FluentdLoggerDescriptor, FluentdLogger_1.FluentdLogger);
    }
}
DefaultFluentdFactory.Descriptor = new pip_services_commons_node_1.Descriptor("pip-services", "factory", "fluentd", "default", "1.0");
DefaultFluentdFactory.FluentdLoggerDescriptor = new pip_services_commons_node_1.Descriptor("pip-services", "logger", "fluentd", "*", "1.0");
exports.DefaultFluentdFactory = DefaultFluentdFactory;
//# sourceMappingURL=DefaultFluentdFactory.js.map