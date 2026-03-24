import winston from "winston";

const { combine, timestamp, printf, colorize, json } = winston.format;

// Custom format untuk console biar enak dibaca pas ngoding
const consoleFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}] : ${message} `;
  if (Object.keys(metadata).length > 0) {
    msg += JSON.stringify(metadata);
  }
  return msg;
});

export const logger = winston.createLogger({
  level: "info",
  format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), json()),
  transports: [
    // 1. Tulis semua error ke file 'error.log'
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    // 2. Tulis semua log ke 'combined.log'
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: combine(colorize(), timestamp(), consoleFormat),
    })
  );
}