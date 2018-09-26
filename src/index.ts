import { ApolloServer, gql } from "apollo-server-express"
import express from "express"
import { mergeSchemas } from "graphql-tools"
import { executableConvectionSchema } from "./stitching/convection/schema"
import { consignmentStitchingEnvironment } from "./stitching/convection/stitching"
import { executableExchangeSchema } from "./stitching/exchange/schema"
import { executableGravitySchema } from "./stitching/gravity/schema"
import { executableMetaphysicsSchema } from "./stitching/metaphysics/schema"

// const convectionSchema = executableConvectionSchema()
// const convectionStitching = consignmentStitchingEnvironment(
//     localSchema,
//     convectionSchema,
//   )

const gravitySchema = executableGravitySchema()
// const lewittSchema = await executableLewittSchema()
const exchangeSchema = executableExchangeSchema()
const metaphysicsSchema = executableMetaphysicsSchema()
// The order should only matter in that extension schemas come after the
// objects that they are expected to build upon
const mergedSchema = mergeSchemas({
  schemas: [
    gravitySchema,
    //   convectionSchema,
    // lewittSchema,
    exchangeSchema,
    metaphysicsSchema,
    //   convectionStitching.extensionSchema,
  ],
  // resolvers: {
  //   ...convectionStitching.resolvers,
  // },
})

// Because __allowedLegacyNames isn't in the public API
const anyMergedSchema = mergedSchema as any
anyMergedSchema.__allowedLegacyNames = ["__id"]

const server = new ApolloServer({ schema: mergedSchema })

const app = express()
server.applyMiddleware({ app })

app.listen({ port: 4000 }, () =>
  // tslint:disable-next-line:no-console
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
)
