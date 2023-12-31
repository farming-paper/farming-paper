import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Render from "./Render";

test("Simple Text", () => {
  const result = render(<Render>Simple Text</Render>);

  expect(result.container).toMatchSnapshot();
});

describe("마크다운 렌더링", () => {
  test("제목이 잘 표시되어야 함", () => {
    const result = render(
      <Render>{`# heading 1
  
  ## heading 2
  
  ### heading 3`}</Render>
    );

    expect(result.container).toMatchSnapshot();
  });

  test("굵게가 잘 표시되어야 함", () => {
    const result = render(<Render>{`**bold**`}</Render>);
    expect(result.container).toMatchSnapshot();

    // screen.debug();
  });
});

describe("수학 렌더링 (KaTeX)", () => {
  test("Inline Math 가 잘 렌더링되어야 함", () => {
    const result = render(<Render>{`$x^2$`}</Render>);

    expect(result.container).toMatchSnapshot();
  });

  test("Block Math 가 잘 렌더링되어야 함", () => {
    const result = render(<Render>{`$$x^2$$`}</Render>);

    expect(result.container).toMatchSnapshot();
  });
});
