import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Collapse,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  Chip,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import type {
  Category,
  SubCategory,
  CategoryFormData,
  SubCategoryFormData,
} from "../types/Category";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
} from "../api/categories";

interface Props {
  onSnackbar: (message: string, severity: "success" | "error") => void;
}

const emptyCategoryForm: CategoryFormData = {
  name: "",
  description: null,
  isActive: true,
};

const emptySubCategoryForm: SubCategoryFormData = {
  name: "",
  description: null,
  isActive: true,
};

export default function CategoryManager({ onSnackbar }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  // Category dialog state
  const [catDialogOpen, setCatDialogOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [catForm, setCatForm] = useState<CategoryFormData>(emptyCategoryForm);

  // Sub-category dialog state
  const [subDialogOpen, setSubDialogOpen] = useState(false);
  const [subParentId, setSubParentId] = useState<string | null>(null);
  const [editingSub, setEditingSub] = useState<SubCategory | null>(null);
  const [subForm, setSubForm] =
    useState<SubCategoryFormData>(emptySubCategoryForm);

  // Delete confirmation
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    type: "category" | "sub-category";
    id: string;
    parentId?: string;
    name: string;
  }>({ open: false, type: "category", id: "", name: "" });

  const loadCategories = useCallback(async () => {
    try {
      setCategories(await fetchCategories());
    } catch {
      onSnackbar("Failed to load categories", "error");
    }
  }, [onSnackbar]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Category handlers
  const handleAddCategory = () => {
    setEditingCat(null);
    setCatForm(emptyCategoryForm);
    setCatDialogOpen(true);
  };

  const handleEditCategory = (cat: Category) => {
    setEditingCat(cat);
    setCatForm({
      name: cat.name,
      description: cat.description,
      isActive: cat.isActive,
    });
    setCatDialogOpen(true);
  };

  const handleSaveCategory = async () => {
    try {
      if (editingCat) {
        await updateCategory(editingCat.id, catForm);
        onSnackbar("Category updated", "success");
      } else {
        await createCategory(catForm);
        onSnackbar("Category created", "success");
      }
      setCatDialogOpen(false);
      loadCategories();
    } catch {
      onSnackbar("Failed to save category", "error");
    }
  };

  // Sub-category handlers
  const handleAddSubCategory = (categoryId: string) => {
    setSubParentId(categoryId);
    setEditingSub(null);
    setSubForm(emptySubCategoryForm);
    setSubDialogOpen(true);
  };

  const handleEditSubCategory = (categoryId: string, sub: SubCategory) => {
    setSubParentId(categoryId);
    setEditingSub(sub);
    setSubForm({
      name: sub.name,
      description: sub.description,
      isActive: sub.isActive,
    });
    setSubDialogOpen(true);
  };

  const handleSaveSubCategory = async () => {
    if (!subParentId) return;
    try {
      if (editingSub) {
        await updateSubCategory(subParentId, editingSub.id, subForm);
        onSnackbar("Sub-category updated", "success");
      } else {
        await createSubCategory(subParentId, subForm);
        onSnackbar("Sub-category created", "success");
      }
      setSubDialogOpen(false);
      loadCategories();
    } catch {
      onSnackbar("Failed to save sub-category", "error");
    }
  };

  // Delete handler
  const handleConfirmDelete = async () => {
    try {
      if (deleteDialog.type === "category") {
        await deleteCategory(deleteDialog.id);
        onSnackbar("Category deleted", "success");
      } else {
        await deleteSubCategory(deleteDialog.parentId!, deleteDialog.id);
        onSnackbar("Sub-category deleted", "success");
      }
      setDeleteDialog((d) => ({ ...d, open: false }));
      loadCategories();
    } catch {
      onSnackbar("Failed to delete", "error");
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          px: 3,
          py: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {categories.length}{" "}
          {categories.length === 1 ? "category" : "categories"}
        </Typography>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={handleAddCategory}
        >
          Add Category
        </Button>
      </Box>

      {/* Category list */}
      {categories.length === 0 ? (
        <Box sx={{ px: 3, py: 4, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            No categories yet. Add your first category to get started.
          </Typography>
        </Box>
      ) : (
        <List disablePadding>
          {categories.map((cat) => {
            const isExpanded = expanded === cat.id;
            return (
              <Box key={cat.id}>
                <ListItem
                  sx={{
                    px: 3,
                    py: 1.5,
                    borderBottom: "1px solid rgba(0,0,0,0.04)",
                    "&:hover": { bgcolor: "rgba(0,0,0,0.02)" },
                  }}
                  secondaryAction={
                    <Box
                      sx={{ display: "flex", gap: 0.5, alignItems: "center" }}
                    >
                      <Tooltip title="Add Sub-Category">
                        <IconButton
                          size="small"
                          onClick={() => handleAddSubCategory(cat.id)}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => handleEditCategory(cat)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() =>
                            setDeleteDialog({
                              open: true,
                              type: "category",
                              id: cat.id,
                              name: cat.name,
                            })
                          }
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  }
                >
                  <IconButton
                    size="small"
                    onClick={() => setExpanded(isExpanded ? null : cat.id)}
                    sx={{ mr: 1 }}
                  >
                    {isExpanded ? (
                      <ExpandLessIcon fontSize="small" />
                    ) : (
                      <ExpandMoreIcon fontSize="small" />
                    )}
                  </IconButton>
                  <ListItemText
                    primary={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Typography variant="body2" fontWeight={600}>
                          {cat.name}
                        </Typography>
                        {!cat.isActive && (
                          <Chip label="Inactive" size="small" />
                        )}
                        <Typography variant="caption" color="text.disabled">
                          {cat.subCategories.length} sub
                        </Typography>
                      </Box>
                    }
                    secondary={cat.description}
                  />
                </ListItem>
                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                  <List disablePadding sx={{ pl: 6 }}>
                    {cat.subCategories.length === 0 ? (
                      <ListItem sx={{ py: 1 }}>
                        <Typography
                          variant="body2"
                          color="text.disabled"
                          fontStyle="italic"
                        >
                          No sub-categories
                        </Typography>
                      </ListItem>
                    ) : (
                      cat.subCategories.map((sub) => (
                        <ListItem
                          key={sub.id}
                          sx={{
                            py: 0.75,
                            borderBottom: "1px solid rgba(0,0,0,0.03)",
                          }}
                        >
                          <ListItemText
                            primary={
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <Typography variant="body2">
                                  {sub.name}
                                </Typography>
                                {!sub.isActive && (
                                  <Chip label="Inactive" size="small" />
                                )}
                              </Box>
                            }
                            secondary={sub.description}
                          />
                          <ListItemSecondaryAction>
                            <Tooltip title="Edit">
                              <IconButton
                                size="small"
                                onClick={() =>
                                  handleEditSubCategory(cat.id, sub)
                                }
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() =>
                                  setDeleteDialog({
                                    open: true,
                                    type: "sub-category",
                                    id: sub.id,
                                    parentId: cat.id,
                                    name: sub.name,
                                  })
                                }
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))
                    )}
                  </List>
                </Collapse>
              </Box>
            );
          })}
        </List>
      )}

      {/* Category Dialog */}
      <Dialog
        open={catDialogOpen}
        onClose={() => setCatDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          {editingCat ? "Edit Category" : "Add Category"}
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            pt: "16px !important",
          }}
        >
          <TextField
            label="Name"
            fullWidth
            required
            value={catForm.name}
            onChange={(e) =>
              setCatForm((f) => ({ ...f, name: e.target.value }))
            }
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={2}
            value={catForm.description ?? ""}
            onChange={(e) =>
              setCatForm((f) => ({
                ...f,
                description: e.target.value || null,
              }))
            }
          />
          <FormControlLabel
            control={
              <Switch
                checked={catForm.isActive}
                onChange={(e) =>
                  setCatForm((f) => ({ ...f, isActive: e.target.checked }))
                }
              />
            }
            label="Active"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCatDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSaveCategory}
            disabled={!catForm.name.trim()}
          >
            {editingCat ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Sub-Category Dialog */}
      <Dialog
        open={subDialogOpen}
        onClose={() => setSubDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          {editingSub ? "Edit Sub-Category" : "Add Sub-Category"}
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            pt: "16px !important",
          }}
        >
          <TextField
            label="Name"
            fullWidth
            required
            value={subForm.name}
            onChange={(e) =>
              setSubForm((f) => ({ ...f, name: e.target.value }))
            }
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={2}
            value={subForm.description ?? ""}
            onChange={(e) =>
              setSubForm((f) => ({
                ...f,
                description: e.target.value || null,
              }))
            }
          />
          <FormControlLabel
            control={
              <Switch
                checked={subForm.isActive}
                onChange={(e) =>
                  setSubForm((f) => ({ ...f, isActive: e.target.checked }))
                }
              />
            }
            label="Active"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSubDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSaveSubCategory}
            disabled={!subForm.name.trim()}
          >
            {editingSub ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog((d) => ({ ...d, open: false }))}
        maxWidth="xs"
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{deleteDialog.name}</strong>
            ?
            {deleteDialog.type === "category" &&
              " All sub-categories under this category will also be deleted."}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialog((d) => ({ ...d, open: false }))}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
