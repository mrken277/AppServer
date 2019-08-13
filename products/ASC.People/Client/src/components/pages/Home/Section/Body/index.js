import React, { memo } from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import {
  ContentRow,
  toastr,
  CustomScrollbarsVirtualList,
  EmptyScreenContainer,
  Icons,
  Link
} from "asc-web-components";
import UserContent from "./userContent";
//import config from "../../../../../../package.json";
import {
  selectUser,
  deselectUser,
  setSelection
} from "../../../../../store/people/actions";
import {
  isUserSelected,
  getUserStatus,
  getUserRole,
  isUserDisabled
} from "../../../../../store/people/selectors";
import { isAdmin } from "../../../../../store/auth/selectors";
import { FixedSizeList as List, areEqual } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

const Row = memo(
  ({
    data,
    index,
    style,
    onContentRowSelect,
    history,
    settings,
    selection,
    getUserContextOptions
  }) => {
    // Data passed to List as "itemData" is available as props.data
    const user = data[index];

    // console.log("Row user", user);
    const contextOptions = getUserContextOptions(user);

    return (
      <ContentRow
        key={user.id}
        status={getUserStatus(user)}
        data={user}
        avatarRole={getUserRole(user)}
        avatarSource={user.avatar}
        avatarName={user.displayName}
        contextOptions={contextOptions}
        checked={isUserSelected(selection, user.id)}
        onSelect={onContentRowSelect}
        style={style}
      >
        <UserContent user={user} history={history} settings={settings} />
      </ContentRow>
    );
  },
  areEqual
);

class SectionBodyContent extends React.PureComponent {
  onEmailSentClick = () => {
    toastr.success("Context action: Send e-mail");
  };

  onSendMessageClick = () => {
    toastr.success("Context action: Send message");
  };

  onEditClick = user => {
    const { history, settings } = this.props;
    history.push(`${settings.homepage}/edit/${user.userName}`);
  };

  onChangePasswordClick = () => {
    toastr.success("Context action: Change password");
  };

  onChangeEmailClick = () => {
    toastr.success("Context action: Change e-mail");
  };

  onDisableClick = () => {
    toastr.success("Context action: Disable");
  };

  getUserContextOptions = user => {
    const options = [
      {
        key: "key1",
        label: "Send e-mail",
        onClick: this.onEmailSentClick
      },
      {
        key: "key2",
        label: "Send message",
        onClick: this.onSendMessageClick
      },
      { key: "key3", isSeparator: true },
      {
        key: "key4",
        label: "Edit",
        onClick: this.onEditClick.bind(this, user)
      },
      {
        key: "key5",
        label: "Change password",
        onClick: this.onChangePasswordClick
      },
      {
        key: "key6",
        label: "Change e-mail",
        onClick: this.onChangeEmailClick
      }
    ];

    return [
      ...options,
      !isUserDisabled(user)
        ? {
            key: "key7",
            label: "Disable",
            onClick: this.onDisableClick
          }
        : {}
    ];
  };

  onContentRowSelect = (checked, user) => {
    console.log("ContentRow onSelect", checked, user);
    if (checked) {
      this.props.selectUser(user);
    } else {
      this.props.deselectUser(user);
    }
  };

  render() {
    console.log("Home SectionBodyContent render()");
    const { users, isAdmin, selection, history, settings } = this.props;

    return users.length > 0 ? (
      <AutoSizer>
        {({ height, width }) => (
          <List
            className="List"
            height={height}
            width={width}
            itemSize={46} // ContentRow height
            itemCount={users.length}
            itemData={users}
            outerElementType={CustomScrollbarsVirtualList}
          >
            {({ data, index, style }) => (
              <Row
                data={data}
                index={index}
                style={style}
                onContentRowSelect={this.onContentRowSelect}
                history={history}
                settings={settings}
                selection={selection}
                getUserContextOptions={this.getUserContextOptions}
              />
            )}
          </List>
        )}
      </AutoSizer>
    ) : (
      <EmptyScreenContainer
        imageSrc="images/empty_screen_filter.png"
        imageAlt="Empty Screen Filter image"
        headerText="No results matching your search could be found"
        descriptionText="No people matching your filter can be displayed in this section. Please select other filter options or clear filter to view all the people in this section."
        buttons={
          <>
            <Icons.CrossIcon size="small" style={{ marginRight: "4px" }} />
            <Link
              type="action"
              isHovered={true}
              onClick={e => console.log("Reset filter clicked", e)}
            >
              Reset filter
            </Link>
          </>
        }
      />
    );
  }
}

SectionBodyContent.defaultProps = {
  users: []
};

const mapStateToProps = state => {
  return {
    selection: state.people.selection,
    selected: state.people.selected,
    users: state.people.users,
    isAdmin: isAdmin(state.auth),
    settings: state.auth.settings
  };
};

export default connect(
  mapStateToProps,
  { selectUser, deselectUser, setSelection }
)(withRouter(SectionBodyContent));
