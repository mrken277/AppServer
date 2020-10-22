import React from "react";
import styled from "styled-components";
import { utils} from "asc-web-components";
const { tablet } = utils.device;
const StyledMain = styled.main`
  height: calc(100vh - 56px);
  height: calc(var(--vh, 1vh) * 100 - 56px);
  width: 100vw;
  z-index: 0;
  display: flex;
  flex-direction: row;
  box-sizing: border-box;

  @media ${tablet} {
    height:auto;
  }

`;

const Main = React.memo((props) => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
  //console.log("Main render");
  return <StyledMain {...props} />;
});

/*Main.defaultProps = {
  fullscreen: false
};*/

Main.displayName = "Main";

export default Main;