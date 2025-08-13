import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Chip,
  Box,
  TextField,
  Button,
} from "@mui/material";
import { Close, Edit, Save, Delete } from "@mui/icons-material";
import { useState } from "react";

export default function MediaViewer({
  open,
  media,
  onClose,
  onSave,
  onDelete,
}) {
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: media?.title || "",
    description: media?.description || "",
    tags: media?.tags || [],
  });
  const [newTag, setNewTag] = useState("");

  const handleSave = () => {
    onSave(media._id, editData);
    setEditing(false);
  };

  const addTag = () => {
    if (newTag.trim() && !editData.tags.includes(newTag.trim())) {
      setEditData({
        ...editData,
        tags: [...editData.tags, newTag.trim()],
      });
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setEditData({
      ...editData,
      tags: editData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
        {editing ? (
          <TextField
            value={editData.title}
            onChange={(e) =>
              setEditData({ ...editData, title: e.target.value })
            }
            fullWidth
          />
        ) : (
          media?.title
        )}
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <img
              src={media?.url}
              alt={media?.title}
              style={{
                width: "100%",
                maxHeight: "70vh",
                objectFit: "contain",
              }}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            {editing ? (
              <>
                <TextField
                  label="Description"
                  multiline
                  rows={4}
                  fullWidth
                  value={editData.description}
                  onChange={(e) =>
                    setEditData({ ...editData, description: e.target.value })
                  }
                  sx={{ mb: 2 }}
                />
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                    <TextField
                      label="Add Tag"
                      size="small"
                      fullWidth
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addTag())
                      }
                    />
                    <Button onClick={addTag}>Add</Button>
                  </Box>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {editData.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        onDelete={() => removeTag(tag)}
                      />
                    ))}
                  </Box>
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSave}
                  >
                    Save
                  </Button>
                  <Button variant="outlined" onClick={() => setEditing(false)}>
                    Cancel
                  </Button>
                </Box>
              </>
            ) : (
              <>
                <Typography paragraph>{media?.description}</Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                  {media?.tags.map((tag) => (
                    <Chip key={tag} label={tag} />
                  ))}
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    variant="outlined"
                    startIcon={<Edit />}
                    onClick={() => {
                      setEditData({
                        title: media.title,
                        description: media.description,
                        tags: [...media.tags],
                      });
                      setEditing(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => onDelete(media._id)}
                  >
                    Delete
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
