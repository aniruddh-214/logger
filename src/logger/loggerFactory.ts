import LoggerService from "./loggerService";

/**
 * The logger factory which will provide the app level logger service
 *
 * @class LoggerFactory
 */
export default class LoggerFactory {
  private static loggerInstance: LoggerService;

  /**
   * @returns {LoggerService} Description this returns LoggerService instance if created
   */
  public static getLogger(): LoggerService {
    if (!LoggerFactory.loggerInstance) {
      throw new Error(
        "Logger has not been created. Call createLogger() first."
      );
    }
    return LoggerFactory.loggerInstance;
  }

  /**
   * @returns {LoggerService} Description this function returns LoggerService instance and update the logger instance
   */
  public static createLogger(): LoggerService {
    LoggerFactory.loggerInstance = new LoggerService();
    return LoggerFactory.loggerInstance;
  }
}

//  The singleton logger object for global use anywhere in the app
LoggerFactory.createLogger();

/**
 * Global app logger for the application
 *
 * @returns {*}  {LoggerService}
 */
export const GlobalAppLogger = (): LoggerService => LoggerFactory.getLogger();
