import type renderer from "react-test-renderer";
import Render from "./Render";

import { render } from "@testing-library/react";

function toJson(component: renderer.ReactTestRenderer) {
  const result = component.toJSON();
  expect(result).toBeDefined();
  expect(result).not.toBeInstanceOf(Array);
  return result as renderer.ReactTestRendererJSON;
}

test("Simple Text", () => {
  const result = render(<Render>Simple Text</Render>);

  expect(result.container).toMatchSnapshot();
});

describe("Rendering Markdown", () => {
  test("Heading", () => {
    const result = render(
      <Render>{`# heading 1
  
  ## heading 2
  
  ### heading 3`}</Render>
    );

    expect(result.container).toMatchSnapshot();
  });

  test("bold", () => {
    const result = render(<Render>{`**bold**`}</Render>);
    expect(result.container).toMatchSnapshot();

    // screen.debug();
  });
});

describe("Rendering Math", () => {
  test("Inline Math", () => {
    const result = render(<Render>{`$x^2$`}</Render>);

    expect(result.container).toMatchSnapshot();
  });

  test("Block Math", () => {
    const result = render(<Render>{`$$x^2$$`}</Render>);

    expect(result.container).toMatchSnapshot();
  });
});
