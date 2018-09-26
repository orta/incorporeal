import { ApolloLink } from "apollo-link"
import { print } from "graphql/language"

const shouldLogLinkTraffic = !!process.env.LOG_HTTP_LINKS

/**
 * This acts more like a post-middleware logger, by running the operation
 * waiting until it's done, and then logging out the response.
 */
export const responseLoggerLink = (name: string) =>
  new ApolloLink(
    (operation, forward) =>
      // null checks
      (forward &&
        operation &&
        forward(operation).map(response => {
          if (shouldLogLinkTraffic) {
            // tslint:disable-next-line:no-console
            console.log(`>\n> Made query to ${name}:`)
            // tslint:disable-next-line:no-console
            console.log(">\n" + print(operation.query))
            // tslint:disable-next-line:no-console
            console.log(`> Got Response:`)
            // tslint:disable-next-line:no-console
            console.log("> " + JSON.stringify(response))
          }
          return response
        })) ||
      null // if it didn't include forward/operation
  )
