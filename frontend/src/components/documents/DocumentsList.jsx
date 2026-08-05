import { useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";

import {
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";

import downloadFile from "@/utils/downloadFile";

const formatDateTime = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
};

const DocumentsList = ({ documents }) => {
  // Tracks which document is currently being downloaded, so its button can
  // show a disabled/loading state without a global spinner.
  const [downloadingId, setDownloadingId] = useState(null);

  const handleDownload = async (document) => {
    setDownloadingId(document.id);
    try {
      await downloadFile(document.storedFilename, document.originalFilename);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to download document.");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <List disablePadding>
      {documents.map((document) => (
        <ListItem
          key={document.id}
          divider
          secondaryAction={
            <Tooltip title="Download">
              <IconButton
                edge="end"
                disabled={downloadingId === document.id}
                onClick={() => handleDownload(document)}
                aria-label={`Download ${document.originalFilename || "document"}`}
              >
                <DownloadRoundedIcon />
              </IconButton>
            </Tooltip>
          }
        >
          <ListItemIcon>
            <InsertDriveFileOutlinedIcon />
          </ListItemIcon>

          <ListItemText
            primary={document.originalFilename}
            secondary={`Uploaded ${formatDateTime(document.uploadedAt)}`}
          />
        </ListItem>
      ))}
    </List>
  );
};

DocumentsList.propTypes = {
  documents: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      originalFilename: PropTypes.string,
      storedFilename: PropTypes.string,
      uploadedAt: PropTypes.string,
    })
  ).isRequired,
};

export default DocumentsList;
