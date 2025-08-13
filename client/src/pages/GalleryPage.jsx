import { DataGrid } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import { getMedia } from "../services/api";
import ZipDownloadButton from "../components/ZipDownloadButton";

const columns = [
  { field: "title", headerName: "Title", width: 200 },
  { field: "description", headerName: "Description", width: 300 },
  { field: "tags", headerName: "Tags", width: 200 },
  { field: "createdAt", headerName: "Upload Date", width: 150 },
];

export default function GalleryPage() {
  const [media, setMedia] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchMedia = async () => {
      const response = await getMedia(userId);
      setMedia(response.data);
    };
    fetchMedia();
  }, [userId]);

  return (
    <div style={{ height: 600, width: "100%" }}>
      <ZipDownloadButton userId={userId} selectedItems={selectedItems} />

      <DataGrid
        rows={media}
        columns={columns}
        checkboxSelection
        onRowSelectionModelChange={(ids) => setSelectedItems(ids)}
      />
    </div>
  );
}
