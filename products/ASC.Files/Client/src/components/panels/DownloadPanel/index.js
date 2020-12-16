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
  getArchiveFormats,
  getImageFormats,
  getEditedFormats,
  getSoundFormats,
} from "../../../store/files/selectors";
import {
  StyledAsidePanel,
  StyledContent,
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

    this.state = {
      uploadData: [],
      uploaded: false,
    };
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

  componentDidUpdate(prevProps) {
    const { uploadDataFiles } = this.props;

    if (prevProps.uploadDataFiles !== uploadDataFiles) {
      this.setState({
        uploadData: prevProps.uploadDataFiles,
        uploaded: true,
      });
    }
  }

  onKeyPress = (event) => {
    if (event.key === "Esc" || event.key === "Escape") {
      this.onClose();
    }
  };

  clearDownloadPanel = () => {
    this.setState({
      uploadData: [],
      uploaded: false,
    });
    this.onClose();
  };

  render() {
    const {
      t,
      downloadPanelVisible,
      uploadDataFiles,
      archiveFormats,
      imageFormats,
      soundFormats,
      editedFormats,
    } = this.props;

    const { uploadData, uploaded } = this.state;

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
                  {uploaded ? (
                    <IconButton
                      size="20"
                      iconName="ClearActiveIcon"
                      color="#A3A9AE"
                      isClickable={true}
                      onClick={this.clearDownloadPanel}
                    />
                  ) : (
                    <IconButton
                      size="20"
                      iconName="ButtonCancelIcon"
                      color="#A3A9AE"
                    />
                  )}
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
              {uploadDataFiles.length > 0
                ? uploadDataFiles.map((item, index) => (
                    <FileRow
                      item={item}
                      key={index}
                      index={index}
                      archiveFormats={archiveFormats}
                      imageFormats={imageFormats}
                      soundFormats={soundFormats}
                      editedFormats={editedFormats}
                    />
                  ))
                : uploadData.map((item, index) => (
                    <FileRow
                      item={item}
                      key={index}
                      index={index}
                      archiveFormats={archiveFormats}
                      imageFormats={imageFormats}
                      soundFormats={soundFormats}
                      editedFormats={editedFormats}
                    />
                  ))}
            </StyledBody>
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
    archiveFormats: getArchiveFormats(state),
    imageFormats: getImageFormats(state),
    soundFormats: getSoundFormats(state),
    editedFormats: getEditedFormats(state),
  };
};

export default connect(mapStateToProps, {
  setDownloadPanelVisible,
})(withRouter(DownloadPanel));
