import { setContext } from "apollo-link-context"
import { createHttpLink } from "apollo-link-http"
import { headers as requestIDHeaders } from "lib/requestIDs"
import fetch from "node-fetch"
import urljoin from "url-join"

import { middlewareLink } from "../lib/middlewareLink"
import { responseLoggerLink } from "../logLinkMiddleware"

const { METAPHYSICS_API_BASE } = process.env

export const createMetaphysicsLink = () => {
  const httpLink = createHttpLink({
    fetch,
    uri: urljoin(METAPHYSICS_API_BASE),
  })

  const authMiddleware = setContext((_request, context) => {
    const locals = context.graphqlContext && context.graphqlContext.res && context.graphqlContext.res.locals
    const headers = { ...(locals && requestIDHeaders(locals.requestIDs)) }
    return { headers }
  })

  return middlewareLink
    .concat(authMiddleware)
    .concat(responseLoggerLink("Metaphysics"))
    .concat(httpLink)
}
