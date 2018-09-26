import ip from "ip"
import uuid from "uuid/v1"

export function headers({ requestID, xForwardedFor }) {
  return {
    "x-request-id": requestID,
    "x-forwarded-for": xForwardedFor,
  }
}

export function resolveIPv4(ipAddress) {
  // tslint:disable-next-line:no-bitwise
  if (ip.isV6Format(ipAddress) && ~ipAddress.indexOf("::ffff")) {
    return ipAddress.split("::ffff:")[1]
  }
  return ipAddress
}

function resolveProxies(req) {
  const ipAddress = resolveIPv4(req.connection.remoteAddress)

  if (req.headers["x-forwarded-for"]) {
    return `${req.headers["x-forwarded-for"]}, ${ipAddress}`
  } else {
    return ipAddress
  }
}

export function middleware(req, res, next) {
  // General request ID
  const requestID = req.headers["x-request-id"] || uuid()

  // X-Forwarded-For client IP
  const xForwardedFor = resolveProxies(req)

  res.locals.requestIDs = { requestID, xForwardedFor } // eslint-disable-line no-param-reassign
  next()
}
