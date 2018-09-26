// import { incrementalMergeSchemas } from "../../mergeSchemas"
// import { graphql } from "graphql"
// import gql from "lib/gql"
// import { addMockFunctionsToSchema } from "graphql-tools"

// it("resolves an Artist on a Consignment Submission", async () => {
//   const allMergedSchemas = await incrementalMergeSchemas({
//     ENABLE_CONSIGNMENTS_STITCHING: true,
//   })

//   // This test is that a submission gets the artist by stitching a MP
//   // Artist into the ConsignmentSubmission inside the schema
//   const query = gql`
//     {
//       submission(id: 123) {
//         artist_id
//         artist {
//           name
//         }
//       }
//     }
//   `

//   // Mock the resolvers for just a submission, and an artist.
//   // The part we are testing is the step that goes from a submission
//   // to the Artist
//   addMockFunctionsToSchema({
//     schema: allMergedSchemas,
//     mocks: {
//       Query: () => ({
//         submission: (_root, _params) => {
//           return { artist_id: "321" }
//         },
//       }),
//     },
//   })

//   const result = await graphql(allMergedSchemas, query, {
//     accessToken: null,
//     userID: null,
//   })

//   expect(result).toEqual({
//     data: { submission: { artist: { name: "Hello World" }, artist_id: "321" } },
//   })
// })
