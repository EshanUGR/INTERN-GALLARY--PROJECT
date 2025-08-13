import { useDropzone } from "react-dropzone";
import { Button, Box, Typography, TextField, Chip } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";

export default function MediaUpload({ onUpload }) {
  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    accept: { "image/*": [".jpeg", ".png"] },
    maxSize: 5 * 1024 * 1024,
    maxFiles: 1,
  });

  const [metadata, setMetadata] = useState({
    title: "",
    description: "",
    tags: [],
    isShared: false,
  });

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("image", acceptedFiles[0]);
    formData.append("title", metadata.title);
    formData.append("description", metadata.description);
    formData.append("tags", JSON.stringify(metadata.tags));
    formData.append("isShared", metadata.isShared);
    formData.append("userId", localStorage.getItem("userId"));

    onUpload(formData);
  };

  return (
    <Box sx={{ p: 3 }}>
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <Box sx={{ border: "2px dashed", p: 4, textAlign: "center" }}>
          <CloudUpload fontSize="large" />
          <Typography>Drag & drop image here (max 5MB)</Typography>
        </Box>
      </div>

      {acceptedFiles[0] && (
        <Box sx={{ mt: 2 }}>
          <TextField
            label="Title"
            fullWidth
            value={metadata.title}
            onChange={(e) =>
              setMetadata({ ...metadata, title: e.target.value })
            }
          />
          {/* Add other fields and submit button */}
          <Button variant="contained" onClick={handleSubmit}>
            Upload
          </Button>
        </Box>
      )}
    </Box>
  );
}
