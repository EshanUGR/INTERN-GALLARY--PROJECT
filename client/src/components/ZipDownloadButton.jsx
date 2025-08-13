import { Button } from "@mui/material";
import { saveAs } from "file-saver";
import { downloadZip } from "../services/api";

export default function ZipDownloadButton({ userId, selectedItems }) {
  const handleDownload = async () => {
    try {
      const response = await downloadZip(userId, selectedItems);
      saveAs(response.data, `media-${Date.now()}.zip`);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <Button
      variant="contained"
      onClick={handleDownload}
      disabled={selectedItems.length === 0}
    >
      Download Selected ({selectedItems.length})
    </Button>
  );
}
