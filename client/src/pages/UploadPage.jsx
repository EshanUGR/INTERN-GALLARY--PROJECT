import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Box,
  Button,
  Typography,
  TextField,
  Chip,
  CircularProgress,
  Switch,
  FormControlLabel,
  Paper,
} from "@mui/material";
import { CloudUpload, Delete, Add } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string(),
  tags: Yup.array().of(Yup.string()),
  isShared: Yup.boolean(),
});

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false,
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      tags: [],
      newTag: "",
      isShared: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!file) return;

      setIsUploading(true);
      setUploadProgress(0);

      try {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("title", values.title);
        formData.append("description", values.description);
        formData.append("tags", JSON.stringify(values.tags));
        formData.append("isShared", values.isShared);
        formData.append("userId", localStorage.getItem("userId"));

        await axios.post("/api/media", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        });

        // Reset form after successful upload
        formik.resetForm();
        setFile(null);
        setPreview("");
        alert("Upload successful!");
      } catch (error) {
        console.error("Upload failed:", error);
        alert("Upload failed. Please try again.");
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    },
  });

  const handleAddTag = () => {
    if (
      formik.values.newTag &&
      !formik.values.tags.includes(formik.values.newTag)
    ) {
      formik.setFieldValue("tags", [
        ...formik.values.tags,
        formik.values.newTag,
      ]);
      formik.setFieldValue("newTag", "");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    formik.setFieldValue(
      "tags",
      formik.values.tags.filter((tag) => tag !== tagToRemove)
    );
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreview("");
    URL.revokeObjectURL(preview);
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Upload Media
      </Typography>

      <Box
        {...getRootProps()}
        sx={{
          border: "2px dashed",
          borderColor: "primary.main",
          borderRadius: 1,
          p: 4,
          textAlign: "center",
          cursor: "pointer",
          mb: 3,
          backgroundColor: "action.hover",
        }}
      >
        <input {...getInputProps()} />
        {!file ? (
          <>
            <CloudUpload fontSize="large" sx={{ mb: 1 }} />
            <Typography>Drag & drop an image here</Typography>
            <Typography variant="caption" color="text.secondary">
              (JPEG/PNG, max 5MB)
            </Typography>
            <Button variant="contained" sx={{ mt: 2 }}>
              Select File
            </Button>
          </>
        ) : (
          <Box sx={{ position: "relative" }}>
            <img
              src={preview}
              alt="Preview"
              style={{
                maxHeight: 200,
                maxWidth: "100%",
                borderRadius: 4,
              }}
            />
            <Button
              startIcon={<Delete />}
              onClick={handleRemoveFile}
              sx={{ mt: 2 }}
            >
              Remove File
            </Button>
          </Box>
        )}
      </Box>

      {file && (
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
            sx={{ mb: 3 }}
          />

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Description"
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            sx={{ mb: 3 }}
          />

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Tags
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
              <TextField
                size="small"
                placeholder="Add tag"
                name="newTag"
                value={formik.values.newTag}
                onChange={formik.handleChange}
                onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
              />
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={handleAddTag}
              >
                Add
              </Button>
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {formik.values.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => handleRemoveTag(tag)}
                />
              ))}
            </Box>
          </Box>

          <FormControlLabel
            control={
              <Switch
                name="isShared"
                checked={formik.values.isShared}
                onChange={formik.handleChange}
              />
            }
            label="Share with others"
            sx={{ mb: 3 }}
          />

          {isUploading && (
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <CircularProgress
                variant="determinate"
                value={uploadProgress}
                sx={{ mr: 2 }}
              />
              <Typography>Uploading... {uploadProgress}%</Typography>
            </Box>
          )}

          <Button
            type="submit"
            variant="contained"
            size="large"
            startIcon={<CloudUpload />}
            disabled={isUploading || !file}
            fullWidth
          >
            {isUploading ? "Uploading..." : "Upload Media"}
          </Button>
        </form>
      )}
    </Paper>
  );
}
