import { useState } from "react";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Checkbox,
  IconButton,
  Box,
  TextField,
  Pagination,
  Chip,
} from "@mui/material";
import { Delete, Edit, Visibility } from "@mui/icons-material";

export default function MediaGallery({
  mediaItems,
  onSelect,
  onDelete,
  onView,
}) {
  const [selected, setSelected] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;

  const filteredItems = mediaItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedItems = filteredItems.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <TextField
          label="Search media"
          variant="outlined"
          size="small"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Typography>
          {selected.length > 0 && `${selected.length} selected`}
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {paginatedItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item._id}>
            <Card sx={{ position: "relative" }}>
              <Checkbox
                checked={selected.includes(item._id)}
                onChange={() => toggleSelect(item._id)}
                sx={{ position: "absolute", top: 0, right: 0, zIndex: 1 }}
              />
              <CardMedia
                component="img"
                height="200"
                image={item.thumbnail_url || item.url}
                alt={item.title}
                onClick={() => onView(item)}
                sx={{ cursor: "pointer" }}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" noWrap>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {item.description}
                </Typography>
                <Box
                  sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 0.5 }}
                >
                  {item.tags.map((tag) => (
                    <Chip key={tag} label={tag} size="small" />
                  ))}
                </Box>
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}
                >
                  <IconButton onClick={() => onView(item)}>
                    <Visibility />
                  </IconButton>
                  <IconButton onClick={() => onDelete(item._id)}>
                    <Delete color="error" />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Pagination
          count={Math.ceil(filteredItems.length / itemsPerPage)}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
        />
      </Box>
    </Box>
  );
}
