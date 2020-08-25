import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import styled from "styled-components";
import {
    changeAdmins,
    getUpdateListAdmin,
    fetchPeople
} from "../../../../../store/settings/actions";
import {
    Text,
    Avatar,
    Row,
    RowContainer,
    Link,
    Paging,
    IconButton,
    toastr,
    RequestLoader,
    Loader,
    EmptyScreenContainer,
    Icons,
    SearchInput
} from "asc-web-components";
import { constants } from 'asc-web-common';
import { getUserRole } from "../../../../../store/settings/selectors";
import isEmpty from "lodash/isEmpty";

const { EmployeeActivationStatus, EmployeeStatus } = constants;

const getUserStatus = user => {
    if (user.status === EmployeeStatus.Active && user.activationStatus === EmployeeActivationStatus.Activated) {
        return "normal";
    }
    else if (user.status === EmployeeStatus.Active && user.activationStatus === EmployeeActivationStatus.Pending) {
        return "pending";
    }
    else if (user.status === EmployeeStatus.Disabled) {
        return "disabled";
    }
    else {
        return "unknown";
    }
};

const ToggleContentContainer = styled.div`
  .buttons_container {
    display: flex;
    @media (max-width: 1024px) {
      display: block;
    }
  }
  .toggle_content {
    margin-bottom: 24px;
  }

  .wrapper {
    margin-top: 16px;
  }

  .remove_icon {
    margin-left: 70px;
    @media (max-width: 576px) {
      margin-left: 0px;
    }
  }

  .people-admin_container {
    margin-right: 16px;
    position: relative;

    @media (max-width: 1024px) {
      margin-bottom: 8px;
    }
  }

  .full-admin_container {
    position: relative;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
  .nameAndStatus{
    display: flex;
    align-items: center;

    .statusIcon{
        margin-left:5px;
    }
  }

  .rowMainContainer{
      height:auto;
  }

  .userRole{
      text-transform:capitalize;
      font-size: 12px;
      color: #D0D5DA;
  }

  .row_content{
    justify-content: space-between;
    align-items: center;
  }

  .actionIconsWrapper{
      display:flex;
      align-items: center;

      .fullAccessWrapper{
        margin-right:20px;
        display: flex;
        align-items: center;

        .fullAccessIcon{
            margin-right: 4px;
        }
      }

      .hyphen{
            height:1px;
            width: 8px;
            background-color:#D0D5DA;
            margin-right: 20px;
        }

      .iconWrapper{
         display: inline-block; 
         margin-right: 32px;

         &:last-child{
            margin-right:0;
         }
      }
  }
`;

class PortalAdmins extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showSelector: false,
            showFullAdminSelector: false,
            isLoading: false,
            showLoader: true,
            selectedOptions: [],
            users: {}
        };
    }

    componentDidMount() {
        const { admins, fetchPeople } = this.props;

        if (isEmpty(admins, true)) {
            const newFilter = this.onAdminsFilter();
            fetchPeople(newFilter)
                .catch(error => {
                    toastr.error(error);
                })
                .finally(() =>
                    this.setState({
                        showLoader: false
                    })
                );
        } else {
            this.setState({ showLoader: false });
        }
    }

    onChangeAdmin = (userIds, isAdmin, productId) => {
        this.onLoading(true);
        const { changeAdmins } = this.props;
        const newFilter = this.onAdminsFilter();

        changeAdmins(userIds, productId, isAdmin, newFilter)
            .catch(error => {
                toastr.error("accessRights onChangeAdmin", error);
            })
            .finally(() => {
                this.onLoading(false);
            });
    };

    onChangePage = pageItem => {
        const { filter, getUpdateListAdmin } = this.props;

        const newFilter = filter.clone();
        newFilter.page = pageItem.key;
        this.onLoading(true);

        getUpdateListAdmin(newFilter)
            .catch(res => console.log(res))
            .finally(() => this.onLoading(false));
    };

    onChangePageSize = pageItem => {
        const { filter, getUpdateListAdmin } = this.props;

        const newFilter = filter.clone();
        newFilter.page = 0;
        newFilter.pageCount = pageItem.key;
        this.onLoading(true);

        getUpdateListAdmin(newFilter)
            .catch(res => console.log(res))
            .finally(() => this.onLoading(false));
    };

    onPrevClick = e => {
        const { filter, getUpdateListAdmin } = this.props;

        if (!filter.hasPrev()) {
            e.preventDefault();
            return;
        }
        const newFilter = filter.clone();
        newFilter.page--;
        this.onLoading(true);
        getUpdateListAdmin(newFilter)
            .catch(res => console.log(res))
            .finally(() => this.onLoading(false));
    };

    onNextClick = e => {
        const { filter, getUpdateListAdmin } = this.props;

        if (!filter.hasNext()) {
            e.preventDefault();
            return;
        }
        const newFilter = filter.clone();
        newFilter.page++;
        this.onLoading(true);

        getUpdateListAdmin(newFilter)
            .catch(res => console.log(res))
            .finally(() => this.onLoading(false));
    };

    onLoading = status => {
        this.setState({ isLoading: status });
    };

    onAdminsFilter = () => {
        const { filter } = this.props;

        const newFilter = filter.clone();
        newFilter.page = 0;
        //newFilter.role = "admin";

        return newFilter;
    };

    onResetFilter = () => {
        const { getUpdateListAdmin, filter } = this.props;

        const newFilter = filter.clone(true);

        this.onLoading(true);
        getUpdateListAdmin(newFilter)
            .catch(res => console.log(res))
            .finally(() => this.onLoading(false));
    };

    onModuleIconClick = (userIds, moduleName, isAdmin) => {
        const currentModule = this.props.modules.find(module => module.title.toLowerCase() === moduleName.toLowerCase());
        if (currentModule) this.onChangeAdmin(userIds, !isAdmin, currentModule.id)
    }

    pageItems = () => {
        const { t, filter } = this.props;
        if (filter.total < filter.pageCount) return [];
        const totalPages = Math.ceil(filter.total / filter.pageCount);
        return [...Array(totalPages).keys()].map(item => {
            return {
                key: item,
                label: t("PageOfTotalPage", { page: item + 1, totalPage: totalPages })
            };
        });
    };

    countItems = () => [
        { key: 25, label: this.props.t("CountPerPage", { count: 25 }) },
        { key: 50, label: this.props.t("CountPerPage", { count: 50 }) },
        { key: 100, label: this.props.t("CountPerPage", { count: 100 }) }
    ];

    selectedPageItem = () => {
        const { filter, t } = this.props;
        const pageItems = this.pageItems();

        const emptyPageSelection = {
            key: 0,
            label: t("PageOfTotalPage", { page: 1, totalPage: 1 })
        };

        return pageItems.find(x => x.key === filter.page) || emptyPageSelection;
    };

    selectedCountItem = () => {
        const { filter, t } = this.props;

        const emptyCountSelection = {
            key: 0,
            label: t("CountPerPage", { count: 25 })
        };

        const countItems = this.countItems();

        return (
            countItems.find(x => x.key === filter.pageCount) || emptyCountSelection
        );
    };

    isModuleAdmin = (user, moduleName) => {
        let isModuleAdmin = false;

        if (!user.listAdminModules) return false

        for (let i = 0; i < user.listAdminModules.length; i++) {
            if (user.listAdminModules[i] === moduleName) {
                isModuleAdmin = true
                break
            }
        }

        return isModuleAdmin;
    }

    render() {
        const { t, admins, filter } = this.props;
        const {
            isLoading,
            showLoader
        } = this.state;

        return (
            <>
                {showLoader ? (
                    <Loader className="pageLoader" type="rombs" size="40px" />
                ) : (
                        <>
                            <RequestLoader
                                visible={isLoading}
                                zIndex={256}
                                loaderSize="16px"
                                loaderColor={"#999"}
                                label={`${t("LoadingProcessing")} ${t("LoadingDescription")}`}
                                fontSize="12px"
                                fontColor={"#999"}
                                className="page_loader"
                            />

                            <ToggleContentContainer>
                                <SearchInput
                                    className="filter_container"
                                    placeholder="Search added employees"
                                />

                                {admins.length > 0 ? (
                                    <>
                                        <div className="wrapper">
                                            <RowContainer manualHeight={`${admins.length * 50}px`}>
                                                {admins.map(user => {
                                                    const element = (
                                                        <Avatar
                                                            size="small"
                                                            role={getUserRole(user)}
                                                            userName={user.displayName}
                                                            source={user.avatar}
                                                        />
                                                    );
                                                    const nameColor =
                                                        getUserStatus(user) === 'pending' ? "#A3A9AE" : "#333333";

                                                    return (
                                                        <Row
                                                            key={user.id}
                                                            status={user.status}
                                                            data={user}
                                                            element={element}
                                                            checkbox={true}
                                                            checked={false}
                                                            contextButtonSpacerWidth={"0px"}
                                                        >
                                                            <div>
                                                                <div className="nameAndStatus">
                                                                    <Link
                                                                        isTextOverflow={true}
                                                                        type="page"
                                                                        title={user.displayName}
                                                                        isBold={true}
                                                                        fontSize="15px"
                                                                        color={nameColor}
                                                                        href={user.profileUrl}
                                                                    >
                                                                        {user.displayName}
                                                                    </Link>
                                                                    {getUserStatus(user) === 'pending' && <Icons.SendClockIcon className="statusIcon" size='small' isfill={true} color='#3B72A7' />}
                                                                    {getUserStatus(user) === 'disabled' && <Icons.CatalogSpamIcon className="statusIcon" size='small' isfill={true} color='#3B72A7' />}
                                                                </div>
                                                                <div>
                                                                    <Text truncate={true} className="userRole">{getUserRole(user)}</Text>
                                                                </div>
                                                            </div>
                                                            <div className="actionIconsWrapper">
                                                                <div className="fullAccessWrapper">
                                                                    <IconButton
                                                                        iconName="ActionsFullAccessIcon"
                                                                        isClickable={false}
                                                                        className="fullAccessIcon"
                                                                        size="medium"
                                                                        isFill={true}
                                                                        color={getUserRole(user) === "owner" ? '#316DAA' : '#D0D5DA'}
                                                                    />
                                                                    <Text color={getUserRole(user) === "owner" ? '#316DAA' : '#D0D5DA'} font-size="11px" fontWeight={700}>Full access</Text>
                                                                </div>
                                                                <div className="hyphen"></div>
                                                                <div>
                                                                    <div className="iconWrapper">
                                                                        <IconButton
                                                                            iconName="ActionsDocumentsSettingsIcon"
                                                                            size={14}
                                                                            color={
                                                                                getUserRole(user) === "owner"
                                                                                    ? '#7A95B0'
                                                                                    : this.isModuleAdmin(user, 'documents') ? '#316DAA' : '#D0D5DA'
                                                                            }
                                                                            isfill={true}
                                                                            isClickable={false}
                                                                            onClick={getUserRole(user) !== "owner" && this.onModuleIconClick.bind(this, [user.id], "documents", this.isModuleAdmin(user, 'documents'))}
                                                                        />
                                                                    </div>
                                                                    <div className="iconWrapper">
                                                                        <IconButton
                                                                            iconName="MainMenuPeopleIcon"
                                                                            size={16}
                                                                            color={
                                                                                getUserRole(user) === "owner"
                                                                                    ? '#7A95B0'
                                                                                    : this.isModuleAdmin(user, 'people') ? '#316DAA' : '#D0D5DA'
                                                                            }
                                                                            isfill={true}
                                                                            isClickable={false}
                                                                            onClick={getUserRole(user) !== "owner" && this.onModuleIconClick.bind(this, [user.id], "people", this.isModuleAdmin(user, 'people'))}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Row>
                                                    );
                                                })}
                                            </RowContainer>
                                        </div>
                                        <div className="wrapper">
                                            <Paging
                                                previousLabel={t("PreviousPage")}
                                                nextLabel={t("NextPage")}
                                                openDirection="top"
                                                countItems={this.countItems()}
                                                pageItems={this.pageItems()}
                                                displayItems={false}
                                                selectedPageItem={this.selectedPageItem()}
                                                selectedCountItem={this.selectedCountItem()}
                                                onSelectPage={this.onChangePage}
                                                onSelectCount={this.onChangePageSize}
                                                previousAction={this.onPrevClick}
                                                nextAction={this.onNextClick}
                                                disablePrevious={!filter.hasPrev()}
                                                disableNext={!filter.hasNext()}
                                            />
                                        </div>
                                    </>
                                ) : (
                                        <EmptyScreenContainer
                                            imageSrc="products/people/images/empty_screen_filter.png"
                                            imageAlt="Empty Screen Filter image"
                                            headerText={t("NotFoundTitle")}
                                            descriptionText={t("NotFoundDescription")}
                                            buttons={
                                                <>
                                                    <Icons.CrossIcon
                                                        size="small"
                                                        style={{ marginRight: "4px" }}
                                                    />
                                                    <Link
                                                        type="action"
                                                        isHovered={true}
                                                        onClick={this.onResetFilter}
                                                    >
                                                        {t("ClearButton")}
                                                    </Link>
                                                </>
                                            }
                                        />
                                    )}
                            </ToggleContentContainer>
                        </>
                    )}
            </>
        );
    }
}

function mapStateToProps(state) {
    const { admins, owner, filter } = state.settings.security.accessRight;
    const { user: me } = state.auth;
    const groupsCaption = state.auth.settings.customNames.groupsCaption;

    return {
        admins,
        productId: state.auth.modules[0].id,
        modules: state.auth.modules,
        owner,
        filter,
        me,
        groupsCaption
    };
}

PortalAdmins.defaultProps = {
    admins: [],
    productId: "",
    owner: {}
};

PortalAdmins.propTypes = {
    admins: PropTypes.arrayOf(PropTypes.object),
    productId: PropTypes.string,
    owner: PropTypes.object
};

export default connect(mapStateToProps, {
    changeAdmins,
    fetchPeople,
    getUpdateListAdmin
})(withTranslation()(PortalAdmins));
