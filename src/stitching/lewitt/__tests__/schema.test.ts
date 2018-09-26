import { getTypesFromSchema } from "lib/stitching/lib/getTypesFromSchema"
import { executableLewittSchema } from "../schema"

it("Does not include generic type names", async () => {
  const lewittSchema = await executableLewittSchema()
  const lewittTypes = await getTypesFromSchema(lewittSchema)

  expect(lewittTypes).not.toContain("Invoice")
  expect(lewittTypes).not.toContain("LineItem")
  expect(lewittTypes).not.toContain("Json")

  expect(lewittTypes).toContain("PartnerProductInvoice")
})
