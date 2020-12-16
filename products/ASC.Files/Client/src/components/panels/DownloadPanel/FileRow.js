import React from "react";
import styled from "styled-components";
import { IconButton, Row, Text, Icons, DropDownItem } from "asc-web-components";

const StyledFileRow = styled(Row)`
  margin: 0 16px;
  width: calc(100% - 16px);
  box-sizing: border-box;
  font-weight: 600;

  .download_panel-icon {
    margin-left: auto;
    line-height: 24px;
    display: flex;
    align-items: center;
    flex-direction: row-reverse;

    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

const FileRow = (props) => {
  const { item, index } = props;
  const name = item.file.name.split(".");
  let ext = name.length > 1 ? name.pop() : "";
  let originalExt = null;

  if (ext === "rar" || ext === "zip") {
    originalExt = ext;
    ext = "file_archive";
  }
  const fileIcon = <img src={`images/icons/24/${ext}.svg`} />;

  return (
    <StyledFileRow
      className="download-row"
      key={`download_row-key_${index}`}
      checkbox={false}
      element={fileIcon}
    >
      <Text fontWeight="600">{name}</Text>
      <Text fontWeight="600" color="#A3A9AE">
        .{originalExt ? originalExt : ext}
      </Text>

      {!item.fileId ? (
        <IconButton
          iconName="ButtonCancelIcon"
          className="download_panel-icon"
          color="#A3A9AE"
        />
      ) : (
        <IconButton
          iconName="CatalogSharedIcon"
          className="download_panel-icon"
          color="#A3A9AE"
        />
      )}
    </StyledFileRow>
  );
};

export default FileRow;
