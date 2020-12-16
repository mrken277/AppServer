import React from "react";
import {
  Backdrop,
  Heading,
  Aside,
  IconButton,
  Icons,
} from "asc-web-components";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { withTranslation } from "react-i18next";
import { utils as commonUtils, store } from "asc-web-common";
import { setDownloadPanelVisible } from "../../../store/files/actions";
import {
  getDownloadPanelVisible,
  getUploadDataFiles,
} from "../../../store/files/selectors";
import {
  StyledAsidePanel,
  StyledContent,
  StyledFooter,
  StyledHeaderContent,
  StyledBody,
} from "../StyledPanels";
import FileRow from "./FileRow";
import { createI18N } from "../../../helpers/i18n";
const i18n = createI18N({
  page: "DownloadPanel",
  localesPath: "panels/DownloadPanel",
});
const { changeLanguage } = commonUtils;

const { getCurrentUserId } = store.auth.selectors;

const DownloadBodyStyle = { height: `calc(100vh - 156px)` };

class DownloadPanelComponent extends React.Component {
  constructor(props) {
    super(props);

    changeLanguage(i18n);

    this.ref = React.createRef();
    this.scrollRef = React.createRef();
  }

  onClose = () => {
    this.props.setDownloadPanelVisible(!this.props.downloadPanelVisible);
  };
  componentDidMount() {
    document.addEventListener("keyup", this.onKeyPress);
  }
  componentWillUnmount() {
    document.removeEventListener("keyup", this.onKeyPress);
  }

  onKeyPress = (event) => {
    if (event.key === "Esc" || event.key === "Escape") {
      this.onClose();
    }
  };
  render() {
    const { t, downloadPanelVisible, uploadDataFiles } = this.props;

    const visible = downloadPanelVisible;
    const zIndex = 310;
    return (
      <StyledAsidePanel visible={visible}>
        <Backdrop onClick={this.onClose} visible={visible} zIndex={zIndex} />
        <Aside className="header_aside-panel" visible={visible}>
          <StyledContent>
            <StyledHeaderContent>
              <Heading className="download_panel-header" size="medium" truncate>
                {t("Uploads")}
              </Heading>
              <div className="download_panel-icons-container">
                <div className="download_panel-remove-icon">
                  <IconButton
                    size="20"
                    iconName="ButtonCancelIcon"
                    color="#A3A9AE"
                  />
                </div>
                <div className="download_panel-vertical-dots-icon">
                  <IconButton
                    size="20"
                    iconName="VerticalDotsIcon"
                    color="#A3A9AE"
                  />
                </div>
              </div>
            </StyledHeaderContent>
            <StyledBody stype="mediumBlack" style={DownloadBodyStyle}>
              {uploadDataFiles.map((item, index) => (
                <FileRow item={item} index={index} />
              ))}
            </StyledBody>
            <StyledFooter>Footer</StyledFooter>
          </StyledContent>
        </Aside>
      </StyledAsidePanel>
    );
  }
}

const DownloadPanelContainerTranslated = withTranslation()(
  DownloadPanelComponent
);

const DownloadPanel = (props) => (
  <DownloadPanelContainerTranslated i18n={i18n} {...props} />
);

const mapStateToProps = (state) => {
  return {
    isMyId: getCurrentUserId(state),
    downloadPanelVisible: getDownloadPanelVisible(state),
    uploadDataFiles: getUploadDataFiles(state),
  };
};

export default connect(mapStateToProps, {
  setDownloadPanelVisible,
})(withRouter(DownloadPanel));