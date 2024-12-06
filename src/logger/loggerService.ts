import { v4 as uuid } from "uuid";

import logger from "./logger";
import { LogInfo, LogError, LogLabels } from "./types";

/**
 * The logging utility for application logs
 *
 * @class LoggerService
 */
export default class LoggerService {
  private _requestId: string | undefined;

  /**
   * Creates an instance of LoggerService.
   * @memberof LoggerService
   */
  constructor(requestId?: string) {
    this._requestId = requestId ?? uuid();
    this.logBegin({ action: "Starting Logging" });
    this._registerExitHandlers();
  }

  /**
   * A helper for starting the process logging
   *
   * @param {Partial<LogInfo>} logInfo
   * @memberof LoggerService
   */
  public logBegin(logInfo: Partial<LogInfo>): void {
    logInfo.message = logInfo.message ?? "Request has been began.";
    logInfo.action = logInfo.action ?? "begin";
    logInfo.source = logInfo.source ?? "LoggerService#logBegin";
    this.logInfo(<LogInfo>logInfo);
  }

  /**
   * A helper for logging ending for process
   *
   * @param {Partial<LogDetails>} logInfo
   * @memberof LoggerService
   */
  public logEnd(logInfo: Partial<LogError>): void {
    logInfo.message = logInfo.message ?? "Request has been completed.";
    logInfo.action = logInfo.action ?? "end";
    logInfo.source = logInfo.source ?? "LoggerService#logEnd";
    if (logInfo.error) {
      this.logError(logInfo as LogError);
    } else {
      this.logInfo(logInfo as LogInfo);
    }
    this._requestId = undefined;
  }

  /**
   *
   * A helper for logging information
   * @param {LogInfo} logInfo
   * @memberof LoggerService
   */
  public logInfo(logInfo: LogInfo): void {
    logger.info(this._getLogInfo(logInfo));
  }

  /**
   *
   * A helper for logging errors
   * @param {LogError} logInfo
   * @memberof LoggerService
   */
  public logError(logInfo: LogError): void {
    logger.error(this._getLogInfo(logInfo));
  }

  /**
   *
   * A helper for logging warnings
   * @param {Partial<LogDetails>} logInfo
   * @memberof LoggerService
   */
  public logWarn(logInfo: Partial<LogError>): void {
    logger.warn(this._getLogInfo(logInfo));
  }

  /**
   * A debugger using loggerService
   * @param {Partial<LogDetails>} logInfo
   * @memberof LoggerService
   */
  public logDebug(logInfo: Partial<LogError>): void {
    logger.debug(this._getLogInfo(logInfo));
  }

  /**
   *
   *
   * @private
   * @param {Partial<LogDetails>} logInfo
   * @returns {*}  {unknown}
   * @memberof LoggerService
   */
  private _getLogInfo(logInfo: Partial<LogError>): unknown {
    return {
      message: this._logDetails({ ...logInfo, xRequestId: this._requestId }),
      labels: this._logLabels(logInfo as LogError),
    };
  }

  /**
   *
   *
   * @private
   * @param {LogDetails} logInfo
   * @returns {*}  {LogLabels}
   * @memberof LoggerService
   */
  private _logLabels(logInfo: LogError): LogLabels {
    return {
      requestId: this._requestId!,
      action: logInfo.action,
      source: logInfo.source,
    };
  }

  /**
   * @private
   * @param {Partial<LogDetails>} logInfo
   * @returns {Partial<LogDetails>}  {Partial<LogDetails>}
   * @memberof LoggerService
   */
  private _logDetails(logInfo: Partial<LogError>): Partial<LogError> {
    // This function make sure order of fields so that it is easily readable.
    const logDetails: Partial<LogError> = {};

    if (logInfo.message !== undefined) {
      logDetails.message = logInfo.message;
    }

    if (logInfo.errorMessage !== undefined) {
      logDetails.errorMessage = logInfo.errorMessage;
    }

    if (logInfo.xRequestId !== undefined) {
      logDetails.xRequestId = logInfo.xRequestId;
    }

    if (logInfo.durationMs !== undefined) {
      logDetails.durationMs = logInfo.durationMs;
    }
    if (logInfo.data !== undefined) {
      logDetails.data = logInfo.data;
    }
    if (logInfo.error !== undefined) {
      logDetails.error = logInfo.error;
    }

    if (logInfo.action !== undefined) {
      logDetails.action = logInfo.action;
    }

    if (logInfo.errorStack !== undefined) {
      logDetails.errorStack = logInfo.errorStack;
    }

    if (logInfo.source !== undefined) {
      logDetails.source = logInfo.source;
    }

    return logDetails;
  }

  /**
   * Registers handlers for process exit and termination signals.
   * @memberof LoggerService
   */
  private _registerExitHandlers(): void {
    // Handle process exit
    process.on("exit", () => {
      this.logEnd({ action: "Ending Logging" });
    });

    // Handle SIGINT (Ctrl+C) for graceful shutdown
    process.on("SIGINT", () => {
      this.logEnd({ action: "Ending Logging" });
      process.exit();
    });

    // Handle SIGTERM (Termination signal) for graceful shutdown
    process.on("SIGTERM", () => {
      this.logEnd({ action: "Ending Logging" });
      process.exit();
    });
  }
}
