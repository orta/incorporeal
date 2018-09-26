import { readFileSync } from "fs"
import { makeRemoteExecutableSchema, RenameTypes, transformSchema } from "graphql-tools"
import { createLewittLink } from "./link"

export const executableLewittSchema = async () => {
  const lewittSDL = readFileSync("src/schemas/lewitt.graphql", "utf8")
  const lewittLink = createLewittLink()

  const schema = await makeRemoteExecutableSchema({
    schema: lewittSDL,
    link: lewittLink,
  })

  // Remap the names of certain types from Lewitt to fit in the larger
  // metaphysics ecosystem.
  const remap = {
    Currencies: "PartnerProductInvoiceCurrencies",
    Invoice: "PartnerProductInvoice",
    CreateInvoiceInput: "CreatePartnerProductInvoiceInput",
    ArtworkGroup: "PartnerProductInvoiceArtworkGroup",
    LineItem: "PartnerProductInvoiceLineItem",
    MerchantAccount: "PartnerProductMerchantAccount",
    Json: "PartnerProductJson",
  }

  // Return the new modified schema
  return transformSchema(schema, [
    new RenameTypes(name => {
      const newName = remap[name]
      if (!newName) {
        throw new Error(`All types inside Lewitt should be mapped.\n Missing ${name}`)
      }
      return newName
    }),
  ])
}
