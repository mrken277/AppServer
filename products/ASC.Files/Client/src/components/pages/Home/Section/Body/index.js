import React from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import isEqual from "lodash/isEqual";
import {
  Row,
  toastr,
  Icons,
  RowContainer,
  Loader
} from "asc-web-components";
import EmptyFolderContainer from "./EmptyFolderContainer";
import FilesRowContent from "./FilesRowContent";
import { api } from 'asc-web-common';
import { fetchFiles, updateFile } from '../../../../../store/files/actions';
import { getFilterByLocation } from "../../../../../helpers/converters";
import config from "../../../../../../package.json";

const { FilesFilter } = api;

//import i18n from '../../i18n';

class SectionBodyContent extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      renamingId: -1,
      isEdit: false
    };
  }

  componentDidMount() {
    const { fetchFiles } = this.props;

    //TODO: use right algorithm, fix fetching in src/index.html

    var re = new RegExp(`${config.homepage}((/?)$|/filter)`, "gm");
    const match = window.location.pathname.match(re);

    if (match && match.length > 0) {
      const newFilter = getFilterByLocation(window.location);
      if (newFilter) {
        return fetchFiles(newFilter)
          .catch(error => toastr.error(error));
      } else {
        const filter = FilesFilter.getDefault();

        fetchFiles(filter)
          .catch(error => toastr.error(error));
      }
    }
  }

  onClickRename = (itemId) => {
    this.setState({
      renamingId: itemId,
      isEdit: true
    });
  };

  onEditComplete = () => {
    this.setState({
      renamingId: -1,
      isEdit: false
    });
  }

  getFilesContextOptions = (item, viewer) => {
    return [
      {
        key: "sharing-settings",
        label: "Sharing settings",
        onClick: () => { },
        disabled: true
      },
      {
        key: "link-for-portal-users",
        label: "Link for portal users",
        onClick: () => { },
        disabled: true
      },
      {
        key: "sep",
        isSeparator: true
      },
      {
        key: "download",
        label: "Download",
        onClick: () => { },
        disabled: true
      },
      {
        key: "rename",
        label: "Rename",
        onClick: this.onClickRename.bind(this, item.id),
        disabled: false
      },
      {
        key: "delete",
        label: "Delete",
        onClick: () => { },
        disabled: true
      },
    ]
  };

  needForUpdate = (currentProps, nextProps) => {
    if (currentProps.checked !== nextProps.checked) {
      return true;
    }
    if (currentProps.editing !== nextProps.editing) {
      return true;
    }
    if (!isEqual(currentProps.data, nextProps.data)) {
      return true;
    }
    return false;
  };

  render() {
    const { files, folders, viewer, parentId } = this.props;
    const { renamingId, isEdit } = this.state;

    const items = [...folders, ...files];

    return items.length > 0 ? (
      <RowContainer useReactWindow={false}>
        {items.map(item => {
          const contextOptions = this.getFilesContextOptions(item, viewer).filter(o => o);
          const contextOptionsProps = !contextOptions.length
            ? {}
            : { contextOptions };
          const checked = false; //isUserSelected(selection, user.id);
          const checkedProps = /* isAdmin(viewer) */ true ? { checked } : {};;
          const element = isEdit && item.id === renamingId
            ? <Loader type='oval' color="black" size='24px' label="Editing..." />
            : item.fileExst
              ? <Icons.ActionsDocumentsIcon size='big' isfill={true} color="#A3A9AE" />
              : <Icons.CatalogFolderIcon size='big' isfill={true} color="#A3A9AE" />;

          return (
            <Row
              key={item.id}
              data={item}
              element={element}
              onSelect={() => { }}
              editing={renamingId}
              {...checkedProps}
              {...contextOptionsProps}
              needForUpdate={this.needForUpdate}
            >
              <FilesRowContent item={item} viewer={viewer} editingId={renamingId} onEditComplete={this.onEditComplete} />
            </Row>
          );
        })}
      </RowContainer>
    ) : parentId !== 0 ? (
        <EmptyFolderContainer parentId={parentId} />
      ) : <a>RootFolderContainer</a>;
  }
}

SectionBodyContent.defaultProps = {
  files: null
};

const mapStateToProps = state => {
  return {
    selection: state.files.selection,
    selected: state.files.selected,
    files: state.files.files,
    folders: state.files.folders,
    viewer: state.auth.user,
    settings: state.auth.settings,
    filter: state.files.filter,
    parentId: state.files.selectedFolder.parentId
  };
};

export default connect(
  mapStateToProps,
  { fetchFiles, updateFile }
)(withRouter(withTranslation()(SectionBodyContent)));