import "winston-daily-rotate-file";
import winston, { format, transports } from "winston";

const { combine, printf, colorize, json, timestamp } = format;

/**
 *
 * Helper for get custom timestamp
 * @returns {*}  {string}
 */
export const formattedTimestamp = (): string => {
  const date = new Date();

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long", // e.g., Friday
    day: "2-digit", // e.g., 29
    month: "long", // e.g., December
    year: "numeric", // e.g., 2023
    hour: "2-digit", // e.g., 10
    minute: "2-digit", // e.g., 27
    second: "2-digit", // e.g., 52
    hour12: true, // 12-hour clock
  };

  // Format the date according to the options
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);

  // Adjust the formatting for the desired output
  return formattedDate.replace(",", "").replace(/(\d{2} \d{2} \d{2})/, "$1");
};

/**
 * Custom format for colorful console logs.
 */
const consoleFormat = printf(({ level, message, stack }): string => {
  const timestamp = formattedTimestamp();

  // Display stack trace if available (useful for error logs)
  if (stack) {
    return `\n${level}: ${timestamp}:=> ${message}\n stack:-${JSON.stringify(stack)}`;
  }
  return `\n${level}: ${timestamp}:=> ${message}`;
});

/**
 * Contain all the error logs.
 */
const errorTransport = new transports.DailyRotateFile({
  filename: "error-%DATE%.log",
  datePattern: "DD-MM-YYYY",
  zippedArchive: false,
  maxSize: "100m",
  maxFiles: "30d",
  dirname: "logs",
  level: "error",
});

/**
 * Contain all the logs.
 */
const combinedTransport = new transports.DailyRotateFile({
  filename: "combined-%DATE%.log",
  datePattern: "DD-MM-YYYY",
  zippedArchive: false,
  maxSize: "200m",
  dirname: "logs",
  maxFiles: "30d",
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL ?? "info",
  format: combine(timestamp(), json()), // Retaining JSON format for file logs
  defaultMeta: { service: process.env.APPLICATION_NAME },
  transports: [errorTransport, combinedTransport],
});

// If we're not in production or SHOW_CONSOLE_LOG is enabled, add console transport
if (process.env.SHOW_CONSOLE_LOG) {
  logger.add(
    new transports.Console({
      format: combine(
        colorize({ all: true }), // Colorize the output based on the log level
        consoleFormat // Apply the custom printf format with the formatted timestamp
      ),
    })
  );
}

export default logger;
