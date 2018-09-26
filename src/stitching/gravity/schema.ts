import { readFileSync } from "fs"
import {
  FilterTypes,
  makeRemoteExecutableSchema,
  RenameRootFields,
  RenameTypes,
  transformSchema,
} from "graphql-tools"
import { createGravityLink } from "./link"

export const executableGravitySchema = () => {
  const gravityTypeDefs = readFileSync("src/schemas/gravity.graphql", "utf8")

  const gravityLink = createGravityLink()
  const schema = makeRemoteExecutableSchema({
    schema: gravityTypeDefs,
    link: gravityLink,
  })

  // Types which come from Gravity which MP already has copies of.
  // In the future, these could get merged into the MP types.
  const removeTypes = ["Artist", "Artwork"]

  // Return the new modified schema
  return transformSchema(schema, [
    // Remove types which Metaphysics handles better
    new FilterTypes(type => {
      return !removeTypes.includes(type.name)
    }),
    // So, we cannot remove all of the types from a schema is a lesson I have
    // learned in creating these transformations. This means that there has to
    // be at least one type still inside the Schema (excluding the Mutation or
    // the Query)
    // When Partner was removed, we'd see this error
    // https://github.com/graphcool/graphql-import/issues/73
    // but I don't think we're exhibiting the same bug.
    new RenameTypes(name => {
      if (name === "Partner") {
        return "DoNotUseThisPartner"
      }
      return name
    }),
    // We have the same restrictions for root, so let's prefix
    // for now
    new RenameRootFields((type, name, _field) => {
      if (type === "Query") {
        return `_unused_gravity_${name}`
      } else {
        return name
      }
    }),
  ])
}
