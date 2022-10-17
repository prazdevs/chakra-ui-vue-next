import { render } from "../../test-utils/src"
import { CNumberInput } from "../src"

it("should render properly", () => {
  const { asFragment } = render(CNumberInput)
  expect(asFragment()).toMatchSnapshot()
})
