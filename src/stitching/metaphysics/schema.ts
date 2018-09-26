import { readFileSync } from "fs"
import { makeRemoteExecutableSchema } from "graphql-tools"
import { createMetaphysicsLink } from "./link"

export const executableMetaphysicsSchema = () => {
  const mpTypeDefs = readFileSync("src/schemas/metaphysics.graphql", "utf8")
  const mpLink = createMetaphysicsLink()

  return makeRemoteExecutableSchema({
    schema: mpTypeDefs,
    link: mpLink,
  })
}
