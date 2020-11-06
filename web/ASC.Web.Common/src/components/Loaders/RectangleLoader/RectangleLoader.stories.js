import React from "react";
import { storiesOf } from "@storybook/react";
import {
  withKnobs,
  text,
  number,
  boolean,
  color,
} from "@storybook/addon-knobs/react";
import Section from "../../../../.storybook/decorators/section";

import Loaders from "..";
import { LoaderStyle } from "../../../constants/index";

storiesOf("Components|Loaders", module)
  .addDecorator(withKnobs)
  .add("rectangle loader", () => (
    <Section>
      <h1>Rectangle Loader</h1>
      <Loaders.Rectangle
        x={text("x", "0")}
        y={text("y", "0")}
        width={text("width", LoaderStyle.width)}
        height={text("height", LoaderStyle.height)}
        borderRadius={number("borderRadius", LoaderStyle.borderRadius)}
        backgroundColor={color("backgroundColor", LoaderStyle.backgroundColor)}
        foregroundColor={color("foregroundColor", LoaderStyle.foregroundColor)}
        backgroundOpacity={number(
          "backgroundOpacity",
          LoaderStyle.backgroundOpacity
        )}
        foregroundOpacity={number(
          "foregroundOpacity",
          LoaderStyle.foregroundOpacity
        )}
        speed={number("speed", LoaderStyle.speed)}
        animate={boolean("animate", LoaderStyle.animate)}
      />
    </Section>
  ));
