import ComboButton from "./sub-components/combo-button";
import DropDown from "../drop-down";
import DropDownItem from "../drop-down-item";
import PropTypes from "prop-types";
import React from "react";
import equal from "fast-deep-equal/react";
import styled from "styled-components";

const StyledComboBox = styled.div`
  width: ${(props) =>
    (props.scaled && "100%") ||
    (props.size === "base" && "173px") ||
    (props.size === "middle" && "300px") ||
    (props.size === "big" && "350px") ||
    (props.size === "huge" && "500px") ||
    (props.size === "content" && "fit-content")};

  position: relative;
  outline: 0;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

  .dropdown-container {
    padding: ${(props) => props.advancedOptions && `6px 0px`};
  }
`;

class ComboBox extends React.Component {
  constructor(props) {
    super(props);

    this.ref = React.createRef();

    this.state = {
      isOpen: props.opened,
      selectedOption: props.selectedOption,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const needUpdate =
      !equal(this.props, nextProps) || !equal(this.state, nextState);

    return needUpdate;
  }

  stopAction = (e) => e.preventDefault();

  setIsOpen = (isOpen) => this.setState({ isOpen: isOpen });

  handleClickOutside = (e) => {
    if (this.ref.current.contains(e.target)) return;

    this.setState({ isOpen: !this.state.isOpen }, () => {
      this.props.toggleAction && this.props.toggleAction(e, this.state.isOpen);
    });
  };

  comboBoxClick = (e) => {
    const { disableIconClick, isDisabled, toggleAction } = this.props;

    if (
      isDisabled ||
      (disableIconClick && e && e.target.closest(".optionalBlock"))
    )
      return;

    this.setState({ isOpen: !this.state.isOpen }, () => {
      toggleAction && toggleAction(e, this.state.isOpen);
    });
  };

  optionClick = (option) => {
    this.setState({
      isOpen: !this.state.isOpen,
      selectedOption: option,
    });

    this.props.onSelect && this.props.onSelect(option);
  };

  componentDidUpdate(prevProps) {
    if (this.props.opened !== prevProps.opened) {
      this.setIsOpen(this.props.opened);
    }

    if (this.props.selectedOption !== prevProps.selectedOption) {
      this.setState({ selectedOption: this.props.selectedOption });
    }
  }

  render() {
    //console.log("ComboBox render");
    const {
      dropDownMaxHeight,
      directionX,
      directionY,
      scaled,
      size,
      options,
      advancedOptions,
      isDisabled,
      children,
      noBorder,
      scaledOptions,
      displayType,
      toggleAction,
      textOverflow,
      showDisabledItems,
    } = this.props;
    const { isOpen, selectedOption } = this.state;

    const dropDownMaxHeightProp = dropDownMaxHeight
      ? { maxHeight: dropDownMaxHeight }
      : {};
    const dropDownManualWidthProp = scaledOptions
      ? { manualWidth: "100%" }
      : {};

    const optionsLength = options.length
      ? options.length
      : displayType !== "toggle"
      ? 0
      : 1;

    const advancedOptionsLength = advancedOptions
      ? advancedOptions.props.children.length
      : 0;

    return (
      <StyledComboBox
        ref={this.ref}
        isDisabled={isDisabled}
        scaled={scaled}
        size={size}
        data={selectedOption}
        onClick={this.comboBoxClick}
        toggleAction={toggleAction}
        {...this.props}
      >
        <ComboButton
          noBorder={noBorder}
          isDisabled={isDisabled}
          selectedOption={selectedOption}
          withOptions={optionsLength > 0}
          optionsLength={optionsLength}
          withAdvancedOptions={advancedOptionsLength > 0}
          innerContainer={children}
          innerContainerClassName="optionalBlock"
          isOpen={isOpen}
          size={size}
          scaled={scaled}
        />
        {displayType !== "toggle" && (
          <DropDown
            className="dropdown-container"
            directionX={directionX}
            directionY={directionY}
            manualY="102%"
            open={isOpen}
            clickOutsideAction={this.handleClickOutside}
            {...dropDownMaxHeightProp}
            {...dropDownManualWidthProp}
            showDisabledItems={showDisabledItems}
          >
            {advancedOptions
              ? advancedOptions
              : options.map((option) => (
                  <DropDownItem
                    {...option}
                    textOverflow={textOverflow}
                    key={option.key}
                    disabled={
                      option.disabled || option.label === selectedOption.label
                    }
                    onClick={this.optionClick.bind(this, option)}
                  />
                ))}
          </DropDown>
        )}
      </StyledComboBox>
    );
  }
}

ComboBox.propTypes = {
  advancedOptions: PropTypes.element,
  children: PropTypes.any,
  className: PropTypes.string,
  directionX: PropTypes.oneOf(["left", "right"]),
  directionY: PropTypes.oneOf(["bottom", "top"]),
  displayType: PropTypes.oneOf(["default", "toggle"]),
  dropDownMaxHeight: PropTypes.number,
  id: PropTypes.string,
  isDisabled: PropTypes.bool,
  noBorder: PropTypes.bool,
  onSelect: PropTypes.func,
  opened: PropTypes.bool,
  options: PropTypes.array.isRequired,
  scaled: PropTypes.bool,
  scaledOptions: PropTypes.bool,
  selectedOption: PropTypes.object.isRequired,
  size: PropTypes.oneOf(["base", "middle", "big", "huge", "content"]),
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  toggleAction: PropTypes.func,
  textOverflow: PropTypes.bool,
  disableIconClick: PropTypes.bool,
};

ComboBox.defaultProps = {
  displayType: "default",
  isDisabled: false,
  noBorder: false,
  scaled: true,
  scaledOptions: false,
  size: "base",
  disableIconClick: true,
  showDisabledItems: false,
};

export default ComboBox;
