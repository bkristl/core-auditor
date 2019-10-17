import { Container, Logger } from "@arkecosystem/core-interfaces";
import { defaults } from "./defaults";

export const plugin: Container.IPluginDescriptor = {
    pkg: require("../package.json"),
    defaults,
    required: false,
    alias: "core-auditor",
    async register(container: Container.IContainer, options) {
        const logger = container.resolvePlugin<Logger.ILogger>("logger");
        logger.info("Setting up core-auditor.");
        
    },
    async deregister(container: Container.IContainer, options) {
        const logger = container.resolvePlugin<Logger.ILogger>("logger");
        logger.info("Deregister core-auditor.");
    }
};
